import axios, { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import type { ApiResult } from './types/request.d'
import { createDiscreteApi } from 'naive-ui'
import { useUserStore } from '@/stores/user'

const TOKEN_PREFIX = 'Bearer '
const SUCCESS_CODE = 200
const UN_AUTHORIZED_CODE = 401
const FORBIDDEN_CODE = 403
const SERVER_ERROR_CODE = 500
const { message } = createDiscreteApi(['message'])

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
})

axiosInstance.interceptors.request.use((config) => {
  const userStore = useUserStore()
  const token = userStore.token
  if (token) {
    config.headers = config.headers || {}
    config.headers.Authorization = `${TOKEN_PREFIX}${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response: AxiosResponse<ApiResult<unknown>>) => {
    const res = response.data
    if (res.code !== SUCCESS_CODE) {
      message.error(res.msg)
      return Promise.reject(new Error(res.msg))
    }
    return response
  },
  (error) => {
    if (error.status === UN_AUTHORIZED_CODE) {
      message.error('未授权，请登录')
      return Promise.reject(error?.response?.data)
    } else if (error.status === FORBIDDEN_CODE) {
      message.error('拒绝访问')
      return Promise.reject(error?.response?.data)
    } else if (error.status === SERVER_ERROR_CODE) {
      const msg = error.response?.data?.msg || error.message || '服务器错误'
      message.error(msg)
      return Promise.reject(new Error(msg))
    } else {
      const msg = error.response?.data?.msg || error.message || '请求错误'
      message.error(msg)
      return Promise.reject(error)
    }
  },
)

const request = async <T = unknown>(config: AxiosRequestConfig) => {
  if (config.params) {
    const params = config.params
    for (const key in params) {
      if (Array.isArray(params[key])) {
        params[key] = params[key].join(',')
      } else if (params[key] === '') {
        params[key] = undefined
      }
    }
    config.params = params
  }
  const response = await axiosInstance.request<ApiResult<T>>(config)
  return response.data
}

export default request
