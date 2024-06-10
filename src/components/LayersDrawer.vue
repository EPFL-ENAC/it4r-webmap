<template>
  <q-list>
    <q-item-label header class="text-h6">
      <q-icon name="layers" class="q-pb-xs"/>
      <span class="q-ml-sm">{{ $t('layers') }}</span>
    </q-item-label>
    <q-item
      v-for="layer in mapStore.layers"
      :key="layer.id"
      class="q-pl-sm q-pr-sm"
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
    <q-item-label header>
      <span class="text-h6">
        <q-icon name="filter_alt" class="q-pb-xs"/>
        <span class="q-ml-sm">{{ $t('filters') }}</span>
      </span>
      <q-btn
        flat
        no-caps
        color="primary"
        size="12px"
        icon="restart_alt"
        :label="$t('reset_filters')"
        @click="onResetFilters" 
        class="q-mt-xs q-pl-xs q-pr-xs float-right "/>
    </q-item-label>
    <q-item>
      <q-item-section>
        <span>{{ $t('magnitudes') }}</span>
        <q-range
          v-model="filtersStore.magnitudes"
          :min="1"
          :max="10"
          :step="1"
          label
          snap
          color="primary"
          @change="onUpdatedFilter"
        />
        <span class="text-help">{{ $t('magnitudes_help') }}</span>
      </q-item-section>
    </q-item>
    <q-item
      class="q-pl-sm q-pr-sm">
      <q-item-section>
        <q-toggle keep-color toggle-indeterminate v-model="filtersStore.tsunami" color="primary" :label="$t('with_tsunami')" @update:model-value="onUpdatedFilter" />
      </q-item-section>
    </q-item>
    <q-item-label header class="text-h6">
      <q-icon name="info" class="q-pb-xs"/>
      <span class="q-ml-sm">{{ $t('legends') }}</span>
    </q-item-label>
    <q-item-label>
      <span class="q-ml-md">{{ $t('number_of_earthquakes') }}</span>
    </q-item-label>
    <q-item v-for="cluster in clusterColors" :key="cluster.color">
        <q-item-section avatar>
          <q-avatar :color="cluster.color" text-color="black" />
        </q-item-section>
        <q-item-section>{{ $t(cluster.label) }}</q-item-section>
      </q-item>
  </q-list>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
export default defineComponent({
  name: 'LayersDrawer',
});
</script>
<script setup lang="ts">
const mapStore = useMapStore();
const helpStore = useHelpStore();
const filtersStore = useFiltersStore();

const clusterColors = [
  {
    color: 'cyan-5',
    label: '< 100'
  },  
  {
    color: 'yellow-6',
    label: '100 - 750'
  },
  {
    color: 'pink-3',
    label: '> 750'
  }
]

function onResetFilters() {
  filtersStore.reset();
  onUpdatedFilter();
}

function onUpdatedFilter() {
  mapStore.applyFilters(filtersStore.asParams());
}
</script>