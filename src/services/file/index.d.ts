import type { BaseEntity } from '../../network/service'

export type FileStatus = 'TEMP' | 'ACTIVE' | 'ISOLATED'

export interface FileMeta extends BaseEntity<string> {
  originalName: string
  contentType: string
  size: number
  storageType: string
  status: FileStatus
  visibility: 'PUBLIC' | 'PRIVATE'
}
