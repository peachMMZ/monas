<template>
  <div class="h-full bg-amber-50 flex justify-center items-center">
    <div class="h-2/3 w-200 p-2 rounded-2xl flex">
      <div class="w-1/2 p-8 flex flex-col gap-y-4 justify-center items-center bg-white rounded-l-2xl">
        <span class="text-2xl font-bold">欢迎</span>
        <span class="text-sm font-light">登录您的账号</span>
        <n-form class="w-full">
          <n-form-item label="账号/邮箱">
            <n-input v-model:value="loginRequest.identifier" placeholder="请输入账号/邮箱" />
          </n-form-item>
          <n-form-item label="密码">
            <n-input v-model:value="loginRequest.password" type="password" show-password-on="click"
              placeholder="请输入密码" />
          </n-form-item>
          <div class="w-full flex justify-end">
            <n-button text>
              <span class="text-xs font-light">忘记密码？</span>
            </n-button>
          </div>
        </n-form>
        <div class="mt-2 w-full">
          <n-button type="primary" block round :loading="loading" @click="login">登录</n-button>
        </div>
        <div>
          <span class="text-xs font-light">还没有账号？</span>
          <n-button text>
            <span class="text-xs font-light">去注册</span>
          </n-button>
        </div>
      </div>
      <div class="w-1/2 rounded-r-2xl bg-amber-100 flex flex-col justify-center items-center gap-y-2">
        <img :src="Logo" alt="logo" class="w-32 h-32 mb-8" />
        <span id="app-name" class="text-violet-400 text-4xl font-black tracking-[0.2em]">{{ appName.toUpperCase()
          }}</span>
        <span class="text-sm font-light">✨ 看清这个世界，然后爱它。
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { NForm, NFormItem, NInput, NButton, useMessage } from 'naive-ui'
import { animate, stagger, splitText } from 'animejs'
import { loginService, type LoginRequest } from './service'
import Logo from '@/assets/image/logo.svg'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

defineOptions({
  name: 'LoginView',
})

const userStore = useUserStore()
const message = useMessage()
const router = useRouter()

const appName = import.meta.env.VITE_APP_NAME
function startAnimation() {
  const { chars } = splitText('#app-name', { words: false, chars: true })
  animate(chars, {
    y: [
      { to: '-2.75rem', ease: 'outExpo', duration: 600 },
      { to: 0, ease: 'outBounce', duration: 800, delay: 100 }
    ],
    // Property specific parameters
    rotate: {
      from: '-1turn',
      delay: 0
    },
    delay: stagger(50),
    ease: 'inOutCirc',
    loopDelay: 2000,
    loop: true
  })
}

const loginRequest = ref<LoginRequest>({
  identifier: '',
  password: '',
})
const loading = ref(false)
function login() {
  loading.value = true
  loginService.login(loginRequest.value).then(res => {
    message.success(`欢迎，${res.data.user.nickname}`)
    userStore.setupLogin(res.data)
    router.push('/')
  }).finally(() => {
    loading.value = false
  })
}

onMounted(() => {
  startAnimation()
})
</script>
<style scoped></style>
