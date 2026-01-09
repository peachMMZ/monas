import { BaseService } from '../../network/service'
import type { FileMeta } from './index.d'

class FileService extends BaseService<FileMeta> {
  constructor() {
    super('/file')
  }

  async url(fileId: FileMeta['id']) {
    const res = await this.request<string>({
      method: 'GET',
      url: `${this.getPrefix()}/url`,
      params: {
        fileId,
      },
    })
    if (res.code === 200 && !res.data.startsWith('http')) {
      res.data = `${import.meta.env.VITE_API_BASE_URL}/${res.data}`
    }
    return res
  }

  async upload(file: File) {
    const formData = new FormData()
    formData.append('file', file)
    return this.request<FileMeta>({
      method: 'POST',
      url: `${this.getPrefix()}/upload`,
      data: formData,
    })
  }
}

export const fileService = new FileService()
