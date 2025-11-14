import request from '@/network/request'
import type { UserStatus } from '@/views/system/user/types'

export interface LoginRequest {
  identifier: string
  password: string
}

export interface LoginResponse {
  token: {
    isLogin: boolean
    loginDeviceType: string
    loginId: string
    loginType: string
    sessionTimeout: number
    tag: string
    tokenActiveTimeout: number
    tokenName: string
    tokenSessionTimeout: number
    tokenTimeout: number
    tokenValue: string
  }
  user: {
    id: number
    account: string
    email: string
    status: UserStatus
    menus: string[]
    nickname: string
    roles: string[]
  }
}

class LoginService {
  async login(data: LoginRequest) {
    return request<LoginResponse>({
      url: '/auth/login',
      method: 'POST',
      data,
    })
  }
}

export const loginService = new LoginService()
