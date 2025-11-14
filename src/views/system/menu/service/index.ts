import { BaseService } from '@/network/service'
import type { Menu, MenuQuery } from '../types'

export class MenuService extends BaseService<Menu> {
  constructor() {
    super('/sys/menu')
  }

  tree(params?: MenuQuery) {
    return this.request<Menu[]>({
      url: `${this.prefix}/tree`,
      method: 'GET',
      params,
    })
  }
}

export const menuService = new MenuService()
