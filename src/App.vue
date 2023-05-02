<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { RouterView } from 'vue-router'
import { useTitleStore } from './stores/title'
import epflLogoUrl from '/EPFL_Logo_184X53.svg'
const { title, subtitle } = storeToRefs(useTitleStore())
</script>

<template>
  <v-app>
    <v-app-bar flat height="68">
      <v-app-bar-title>
        <div v-if="title" class="text-h4">{{ title }}</div>
        <div v-if="subtitle" class="text-subtitle-1">{{ subtitle }}</div>
      </v-app-bar-title>
      <template #append>
        <a href="https://epfl.ch" target="_blank">
          <v-img :src="epflLogoUrl" width="100px" />
        </a>
      </template>
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<style lang="scss" scoped>
.v-app-bar {
  border-bottom: 1px solid rgb(var(--v-theme-primary));
}
</style>
