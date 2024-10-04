<script lang="ts" setup>
const props = defineProps({
  title: String,
});
</script>

<template>
  <v-card variant="flat">
    <template v-if="props.title">
      <v-card-item>
        <div class="d-sm-flex align-center justify-space-between">
          <v-card-title>{{ props.title }}</v-card-title>
          <slot name="action"></slot>
        </div>
      </v-card-item>
      <v-divider></v-divider>
    </template>
    <v-card-text>
      <slot />
    </v-card-text>
  </v-card>
</template>
