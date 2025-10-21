<script setup lang="ts">
import { useTagViewStore } from "@/store"
import Tag from "./Tag.vue"
import SvgIcon from "@/components/SvgIcon/index.vue"
import { storeToRefs } from "pinia"
import { useRouter } from "vue-router"
import { getMeta } from "@/utils"
import { routes } from "@/router"
import { EIcons } from "@/constants"
import clsx from "clsx"
import { useLanguage } from "@/hooks/useLanguage"
const tagViewStore = useTagViewStore()
const { allTags } = storeToRefs(tagViewStore)
const { push } = useRouter()
const { getMenuTitle } = useLanguage()
</script>

<template>
  <div role="tag-views" class="w-full flex items-center justify-start gap-2 border-b-1 border-b-border">
    <Tag v-for="name of allTags" :key="name" class="my-1.5 first:ml-10 group/tag" :class="clsx(tagViewStore.isCurrent(name) && 'bg-primary! text-btn-text! ')" @click="() => push({ name })">
      {{ getMenuTitle({ meta: getMeta(routes, name) }) }}
      <template #footer>
        <SvgIcon :class="clsx((tagViewStore.isCurrent(name) && 'group-hover/tag:text-btn-text') || 'group-hover/tag:text-text/60')" :name="EIcons.Close" @click="() => tagViewStore.deleteTag(name)" />
      </template>
    </Tag>
  </div>
</template>
