import LucideIcon from './index.vue'
import * as icons from 'lucide-vue-next'

type IconName = keyof typeof icons | (string & {})
export { icons, type IconName }

export interface LucideIconProps {
  name: IconName
  size?: number
  color?: string
  strokeWidth?: number
  defaultClass?: string
}

export default LucideIcon
