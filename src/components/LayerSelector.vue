<script setup lang="ts">
import type { SelectItemObject } from '@/utils/vuetify'
import { computed, onMounted } from 'vue'

export type SelectableItem = SelectableSingleItem | SelectableGroupItem

export interface SelectableSingleItem {
  title: string
  ids: string[]
  selected?: boolean
}

export interface SelectableGroupItem {
  title: string
  children: SelectableSingleItem[]
  selected?: boolean
}

const props = withDefaults(
  defineProps<{
    modelValue?: string[]
    items?: SelectableItem[]
  }>(),
  {
    modelValue: () => [],
    items: () => []
  }
)
const emit = defineEmits<{
  (e: 'update:modelValue', value: string[]): void
}>()

onMounted(() => {
  emit(
    'update:modelValue',
    singleItems.value.filter((item) => item.selected).flatMap((item) => item.ids)
  )
})

const singleItems = computed<SelectableSingleItem[]>(() =>
  props.items.flatMap((item) => {
    if ('children' in item) {
      return item.children
    } else {
      return [item]
    }
  })
)
const items = computed<
  (SelectItemObject<string[]> | { title: string; children: SelectItemObject<string[]>[] })[]
>(() =>
  props.items.map((item) =>
    'children' in item
      ? {
          title: item.title,
          children: item.children.map((child) => ({
            title: child.title,
            value: child.ids
          }))
        }
      : {
          title: item.title,
          value: item.ids
        }
  )
)

const selectedItems = computed<string[][]>({
  get: () =>
    singleItems.value
      .map((item) => item.ids)
      .filter((values) => props.modelValue.some((value) => values.includes(value))),
  set: (value) => {
    emit('update:modelValue', value.flat())
  }
})

function selectAll(value: boolean, children: string[][]) {
  if (value) {
    selectedItems.value = [...selectedItems.value, ...children]
  } else {
    selectedItems.value = selectedItems.value.filter((item) => !children.includes(item))
  }
}
</script>

<template>
  <v-card>
    <v-card-item>
      <v-card-title class="text-capitalize">{{ $t('layer', 2) }}</v-card-title>
    </v-card-item>
    <v-expansion-panels multiple variant="accordion">
      <v-expansion-panel v-for="(item, index) in items" :key="index">
        <v-expansion-panel-title v-if="'children' in item">
          <v-checkbox
            color="primary"
            density="compact"
            hide-details
            :label="$t(`layers.${item.title}`)"
            :model-value="item.children.every((child) => selectedItems.includes(child.value))"
            :indeterminate="
              item.children.some((child) => selectedItems.includes(child.value)) &&
              !item.children.every((child) => selectedItems.includes(child.value))
            "
            @update:model-value="
              selectAll(
                $event,
                item.children.map((child) => child.value)
              )
            "
            @click.stop=""
          >
            <template #label="{ label }">
              <span @click.stop="">{{ label }}</span>
            </template>
          </v-checkbox>
        </v-expansion-panel-title>
        <v-expansion-panel-title v-else collapse-icon="" expand-icon="">
          <v-checkbox
            v-model="selectedItems"
            color="primary"
            density="compact"
            hide-details
            :value="item.value"
            :label="$t(`layers.${item.title}`)"
          />
        </v-expansion-panel-title>
        <v-expansion-panel-text v-if="'children' in item">
          <v-checkbox
            v-for="(child, childIndex) in item.children"
            :key="childIndex"
            v-model="selectedItems"
            color="primary"
            density="compact"
            hide-details
            :value="child.value"
            :label="$t(`layers.${child.title}`)"
          >
          </v-checkbox>
        </v-expansion-panel-text>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-card>
</template>
