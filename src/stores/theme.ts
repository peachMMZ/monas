import { ref, watch } from 'vue'
import { defineStore } from 'pinia'
import { useOsTheme, type GlobalThemeOverrides } from 'naive-ui'
import { deriveColorStates, isHex } from '@/utils/color'

export type Theme = 'light' | 'dark'

const defaultThemeOverride = (): GlobalThemeOverrides => {
  return {
    common: {
      primaryColor: '#6366F1',
      primaryColorHover: '#7C7FF5',
      primaryColorPressed: '#4F52D1',
      primaryColorSuppl: '#8A8CF7',
    },
  }
}

export const useThemeStore = defineStore(
  'theme',
  () => {
    const theme = ref<Theme>('light')
    const followOsTheme = ref(true)
    const themeOverride = ref<GlobalThemeOverrides>(defaultThemeOverride())
    const themeDrawerShow = ref(false)
    const siderInverted = ref(false)

    const init = async () => {
      themeDrawerShow.value = false
      watch(
        () => ({
          theme: theme.value,
          followOsTheme: followOsTheme.value,
          themeOverride: themeOverride.value,
        }),
        async (val) => {
          if (val.followOsTheme) {
            const osTheme = useOsTheme()
            theme.value = osTheme.value || 'light'
          }
        },
        { deep: true },
      )
    }

    const rollbackTheme = () => {
      followOsTheme.value = true
      themeOverride.value = defaultThemeOverride()
      setFontSize(14)
      siderInverted.value = false
    }

    const switchTheme = () => {
      followOsTheme.value = false
      theme.value = theme.value === 'light' ? 'dark' : 'light'
    }

    const setPrimaryColor = (color: string) => {
      if (!isHex(color)) {
        throw new Error(`无效的Hex颜色格式: ${color}`)
      }
      const { base, hover, pressed, suppl } = deriveColorStates(color)
      if (!themeOverride.value.common) {
        themeOverride.value.common = {}
      }
      themeOverride.value.common.primaryColor = base
      themeOverride.value.common.primaryColorHover = hover
      themeOverride.value.common.primaryColorPressed = pressed
      themeOverride.value.common.primaryColorSuppl = suppl
    }

    const setFontSize = (size: number | null) => {
      if (!size) return
      if (!themeOverride.value.common) {
        themeOverride.value.common = {}
      }
      themeOverride.value.common.fontSize = `${size}px`
    }

    return {
      theme,
      followOsTheme,
      themeOverride,
      themeDrawerShow,
      siderInverted,
      init,
      rollbackTheme,
      switchTheme,
      setPrimaryColor,
      setFontSize,
    }
  },
  { persist: true },
)
