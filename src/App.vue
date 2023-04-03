<script setup lang="ts">
import { mdiHome, mdiInformation } from '@mdi/js'
import { RouterView } from 'vue-router'
</script>

<template>
  <v-app>
    <v-app-bar color="primary" density="compact">
      <v-tabs class="text-white">
        <v-tab to="/" :prepend-icon="mdiHome">
          <v-app-bar-title>Home</v-app-bar-title>
        </v-tab>
        <v-tab to="/about" :prepend-icon="mdiInformation">
          <v-app-bar-title>About</v-app-bar-title>
        </v-tab>
      </v-tabs>
      <v-spacer />
    </v-app-bar>
    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>
