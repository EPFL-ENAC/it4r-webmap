<template>
  <q-page class="q-pa-md">
    <div class="text-h6 q-mb-md">Page 1</div>
    <div class="text-bold">
      
    </div>

    <div class="q-mt-md q-mb-md">
      <q-markdown no-heading-anchor-links>
### Style and identity

* [Quasar: Style and identity](https://quasar.dev/docs)
* [EPFL brand identity guidelines](https://inside.epfl.ch/corp-id/en/brand-identity-guidelines/)
      </q-markdown>
    </div>
    <div class="row q-gutter-md">
      <q-btn label="primary" color="primary" />
      <q-btn label="secondary" color="secondary"/>
      <q-btn label="accent" color="accent" />
      <q-btn label="positive" color="positive" />
      <q-btn label="negative" color="negative" />
      <q-btn label="info" color="info" />
      <q-btn label="warning" color="warning" />
    </div>
    <q-card class="q-mt-xl">
      <q-card-section>
        <div class="text-bold">README.md</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <q-markdown no-heading-anchor-links :src="content" />
      </q-card-section>
    </q-card>
    
  </q-page>
</template>

<script setup lang="ts">
const ReadmeMd = 'https://raw.githubusercontent.com/EPFL-ENAC/it4r-webmap/main/README.md'

const content = ref();

onMounted(async () => {
  const response = await fetch(ReadmeMd);
  content.value = await response.text();
});
</script>
