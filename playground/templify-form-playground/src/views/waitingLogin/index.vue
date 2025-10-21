<script lang="ts" setup>
import { nextTick, onMounted, watch } from "vue"

import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"

import { ELoginStatus } from "@/constants"
import { useLoadings } from "@/hooks/useLoadings"
import { useUserStore } from "@/store"

defineOptions({
  name: "waitingLogin",
})

const { showLoading, hideLoading } = useLoadings()
const { userInfo } = storeToRefs(useUserStore())

onMounted(() => {
  showLoading()
  watch(
    [() => userInfo.value.loginStatus],
    () => {
      if (userInfo.value.loginStatus === ELoginStatus.logining) return
      const router = useRouter()

      nextTick(() => {
        const { name: toName, params: toParams } = router.options.history.state
        const name = (toName as string) ?? "home"
        const params = JSON.parse(JSON.stringify(toParams ?? {}))

        hideLoading()
        router.push({
          name,
          params,
        })
      })
    },
    {
      immediate: true,
    }
  )
})
</script>

<template>
  <div role="wait-login" class="size-full"></div>
</template>
