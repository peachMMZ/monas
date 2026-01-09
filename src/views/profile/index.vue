<template>
  <div class="h-full p-4 flex justify-center">
    <div class="w-1/2 h-full">
      <n-card class="h-full" embedded>
        <template #header>
          <h3 class="text-center text-2xl">个人中心</h3>
        </template>
        <div class="h-full flex gap-x-4">
          <n-card class="basis-1/4 h-full">
            <template #cover>
              <div class="w-full p-2 relative inline-block group">
                <file-wrapper :file-id="userStore.loginUser?.avatar">
                  <template #default="{ fileUrl }">
                    <n-spin :show="avatarUpdating">
                      <img class="w-full rounded object-cover" :src="fileUrl" />
                    </n-spin>
                  </template>
                </file-wrapper>
                <n-upload v-model:file-list="fileInfoList" abstract :max="1" @update:file-list="handleAvatarChange">
                  <n-upload-trigger #="{ handleClick }" abstract>
                    <div class="avatar-upload-overlay" @click="handleClick">
                      更换头像
                    </div>
                  </n-upload-trigger>
                </n-upload>
              </div>
            </template>
            <div class="h-full flex flex-col">
              <n-descriptions :column="1">
                <n-descriptions-item label="账号">{{ userStore.loginUser?.account }}</n-descriptions-item>
                <n-descriptions-item label="昵称">{{ userStore.loginUser?.nickname }}</n-descriptions-item>
                <n-descriptions-item label="邮箱">{{ userStore.loginUser?.email }}</n-descriptions-item>
              </n-descriptions>
            </div>
          </n-card>
          <n-tabs class="basis-3/4" type="line" animated>
            <n-tab-pane name="basic-info" tab="基本信息">
              <BasicInfo />
            </n-tab-pane>
            <n-tab-pane name="preferences" tab="偏好设置">
              偏好设置
            </n-tab-pane>
          </n-tabs>
        </div>
      </n-card>
    </div>

    <AvatarCropper ref="avatarCropperRef" @confirm="handleAvatarConfirm" @close="fileInfoList = []" />
  </div>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
import {
  NCard,
  NTabs,
  NTabPane,
  NDescriptions,
  NDescriptionsItem,
  NUpload,
  NUploadTrigger,
  NSpin,
  type UploadFileInfo,
  useMessage
} from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { fileService } from '@/services/file'
import { sysUserService } from '@/views/system/user/service'
import FileWrapper from '@/components/File/FileWrapper'
import AvatarCropper from './components/AvatarCropper.vue'
import BasicInfo from './components/BasicInfo.vue'

defineOptions({
  name: 'ProfileView',
})

const message = useMessage()
const userStore = useUserStore()

const fileInfoList = ref<UploadFileInfo[]>([])
const avatarCropperRef = useTemplateRef('avatarCropperRef')

function handleAvatarChange(fileInfoList?: UploadFileInfo[]) {
  if (fileInfoList && fileInfoList.length === 1 && fileInfoList[0] && fileInfoList[0].file) {
    avatarCropperRef.value?.open(fileInfoList[0].file)
  }
}

const avatarUpdating = ref(false)
async function handleAvatarConfirm(blob: Blob) {
  avatarUpdating.value = true
  const file = new File([blob], 'avatar.jpg', { type: blob.type })
  try {
    const res = await fileService.upload(file)
    if (userStore.loginUser) {
      const data = {
        ...userStore.loginUser,
        avatar: res.data.id,
      }
      await sysUserService.save(data)
      userStore.loginUser.avatar = res.data.id
      message.success('更换头像成功')
    }
  } catch (error) {
    message.error('更换头像失败' + error)
  } finally {
    avatarUpdating.value = false
  }
}
</script>
<style scoped>
.avatar-upload-overlay {
  margin: 0.5rem;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  border-radius: 0.25rem;
  cursor: pointer;
}

.group:hover .avatar-upload-overlay {
  opacity: 1;
}
</style>
