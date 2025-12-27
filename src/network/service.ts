import request from './request'

const DEFAULT_ENDPOINTS = {
  list: '/list',
  page: '/page',
  detail: '/detail',
  save: '/save',
  delete: '/delete',
  deleteBatch: '/delete/batch',
}

export interface BaseEntity<ID = number> {
  id: ID
  version?: number
  createdBy?: number
  createdDate?: string
  lastModifiedBy?: number
  lastModifiedDate?: string
}

export interface BaseQuery {
  id?: number | string
  pageNum?: number
  pageSize?: number
  sortBy?: string
  order?: 'asc' | 'desc'
}

export interface PageResult<T> {
  content: T[]
  pageNum: number
  pageSize: number
  totalElements: number
  totalPages: number
}

export class BaseService<T> {
  public request = request
  constructor(protected prefix: string) {}

  public getPrefix() {
    return this.prefix
  }

  async list(params?: BaseQuery) {
    return request<T[]>({
      url: `${this.prefix}${DEFAULT_ENDPOINTS.list}`,
      method: 'GET',
      params,
    })
  }

  async page(params?: BaseQuery) {
    return request<PageResult<T>>({
      url: `${this.prefix}${DEFAULT_ENDPOINTS.page}`,
      method: 'GET',
      params,
    })
  }

  async detail(params?: BaseQuery) {
    return request<T>({
      url: `${this.prefix}${DEFAULT_ENDPOINTS.detail}`,
      method: 'GET',
      params,
    })
  }

  async save<D = T>(data: D) {
    return request<T>({
      url: `${this.prefix}${DEFAULT_ENDPOINTS.save}`,
      method: 'POST',
      data,
    })
  }

  async delete(params?: BaseQuery) {
    return request<T>({
      url: `${this.prefix}${DEFAULT_ENDPOINTS.delete}`,
      method: 'DELETE',
      params,
    })
  }

  async deleteBatch(ids: number[]) {
    return request<void>({
      url: `${this.prefix}${DEFAULT_ENDPOINTS.deleteBatch}`,
      method: 'DELETE',
      data: ids,
    })
  }
}
