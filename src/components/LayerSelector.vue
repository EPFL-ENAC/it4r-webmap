<script setup lang="ts">
import type { SelectItemObject } from '@/utils/vuetify'
import { computed, onMounted } from 'vue'

export interface SelectableItem {
  title: string
  ids: string[]
  selected?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    itemSeparator?: string
    items?: SelectableItem[]
  }>(),
  {
    modelValue: () => [],
    itemSeparator: ',',
    items: () => []
  }
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

onMounted(() => {
  emit(
    'update:modelValue',
    props.items.filter((item) => item.selected).flatMap((item) => item.ids)
  )
})

const items = computed<SelectItemObject[]>(() =>
  props.items.map((item) => ({
    title: item.title,
    value: item.ids.join(props.itemSeparator)
  }))
)

const selectedItems = computed<string[]>({
  get: () =>
    props.items
      .map((item) => item.ids)
      .filter((values) => props.modelValue.some((value) => values.includes(value)))
      .map((values) => values.join(props.itemSeparator)),
  set: (value) => {
    emit(
      'update:modelValue',
      value.flatMap((value) => value.split(props.itemSeparator))
    )
  }
})
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title class="text-capitalize">{{ $t('layer', 2) }}</v-card-title>
    </v-card-item>
    <v-card-text>
      <v-checkbox
        v-for="(item, index) in items"
        :key="index"
        v-model="selectedItems"
        color="primary"
        density="compact"
        hide-details
        :value="item.value"
        :label="$t(`layers.${item.title}`)"
      >
      </v-checkbox>
    </v-card-text>
  </v-card>
</template>
