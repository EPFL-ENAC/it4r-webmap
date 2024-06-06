<template>
  <q-list>
    <q-item-label header class="text-h6">
      <q-icon name="layers" class="q-pb-xs"/>
      <span class="q-ml-sm">{{ $t('layers') }}</span>
    </q-item-label>
    <q-item
      v-for="layer in mapStore.layers"
      :key="layer.id"
      class="q-pl-sm"
    >
      <q-item-section>
        <q-checkbox
          v-model="layer.visible"
          :label="$t(`layer.${layer.id}`)" 
          @click="mapStore.toggleLayer(layer.id)"
        />
      </q-item-section>
      <q-item-section avatar>
        <q-btn 
          flat
          round
          icon="help_outline"
          @click="helpStore.toggleHelp(layer.id)"
        />
      </q-item-section>
    </q-item>
    <q-item-label header class="text-h6">
      <q-icon name="filter_alt" class="q-pb-xs"/>
      <span class="q-ml-sm">{{ $t('Filters') }}</span></q-item-label>
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LayersDrawer',
});
</script>
<script setup lang="ts">
const mapStore = useMapStore()
const helpStore = useHelpStore()
</script>