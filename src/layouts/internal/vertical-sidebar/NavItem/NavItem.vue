<script lang="ts" setup>
const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <!---Single Item-->
  <v-list-item
    :to="{ path: props.item.path }"
    rounded
    class="mb-1"
    color="secondary"
  >
    <!---If icon-->
    <template v-slot:prepend>
      <v-icon
        :icon="
          props.item.children
            ? props.item.children[0].meta.icon
            : props.item.meta.icon
        "
      />
    </template>
    <v-list-item-title>
      {{
        props.item.children
          ? props.item.children[0].meta.title
          : props.item.meta.title
      }}
    </v-list-item-title>
  </v-list-item>
</template>
