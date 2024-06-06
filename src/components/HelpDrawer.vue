<template>
  <q-markdown no-heading-anchor-links :src="helpStore.content" class="q-pl-md q-pr-md"/>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'HelpDrawer',
});
</script>
<script setup lang="ts">
const helpStore = useHelpStore();
</script>