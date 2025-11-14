import { computed, ref } from 'vue'
import type { User } from '@/views/system/user/types'
import { defineStore } from 'pinia'
import type { LoginResponse } from '@/views/system/login/service'
import router from '@/router'

export const useUserStore = defineStore(
  'user',
  () => {
    const loginUser = ref<User>()
    const token = ref<string>()
    const logined = computed(() => loginUser.value && token.value)

    function setupLogin(res: LoginResponse) {
      loginUser.value = res.user
      token.value = res.token.tokenValue
    }

    function clearLogin() {
      loginUser.value = undefined
      token.value = undefined
      router.push({ name: 'login' })
    }

    return {
      loginUser,
      token,
      logined,
      setupLogin,
      clearLogin,
    }
  },
  { persist: true },
)
