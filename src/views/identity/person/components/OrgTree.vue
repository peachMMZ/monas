<template>
  <div>
    <n-tree :data="orgTree" @update:selected-keys="(keys) => emit('update:selected-keys', keys)" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NTree,
  type TreeOption
} from 'naive-ui'
import { orgUnitService } from '../../org/service'
import type { OrgUnit } from '../../org/types'

const emit = defineEmits<{
  (e: 'update:selected-keys', keys: OrgUnit['id'][]): void
}>()

const orgTree = ref<TreeOption[]>()
function fetchOrgTree() {
  orgUnitService.tree().then((res) => {
    orgTree.value = res.data?.map(mapToTreeOption) || []
  })
}
function mapToTreeOption(orgUnit: OrgUnit): TreeOption {
  return {
    key: orgUnit.id,
    label: orgUnit.name,
    children: orgUnit.children?.map(mapToTreeOption) || undefined
  }
}

onMounted(() => {
  fetchOrgTree()
})
</script>
<style scoped></style>
