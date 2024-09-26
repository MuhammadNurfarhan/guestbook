<script lang="ts" setup>
const props = defineProps({ item: Object, level: Number });
</script>

<template>
  <!-- ---------------------------------------------- -->
  <!---Item Children -->
  <!-- ---------------------------------------------- -->
  <v-list-group no-action>
    <!-- ---------------------------------------------- -->
    <!---Dropdown  -->
    <!-- ---------------------------------------------- -->
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :value="item.meta?.title"
        rounded
        class="mb-1"
        color="secondary"
      >
        <!---Icon  -->
        <template v-if="item.meta?.icon" v-slot:prepend>
          <v-icon :icon="item.meta?.icon" />
        </template>
        <!---Title  -->
        <v-list-item-title class="mr-auto">
          {{ item.meta?.title }}
        </v-list-item-title>
      </v-list-item>
    </template>
    <!-- ---------------------------------------------- -->
    <!---Sub Item-->
    <!-- ---------------------------------------------- -->
    <template v-for="(subitem, i) in item.children" :key="i">
      <NavCollapse
        :item="subitem"
        v-if="subitem.children"
        :level="props.level + 1"
      />
      <NavItem :item="subitem" :level="props.level + 1" v-else></NavItem>
    </template>
  </v-list-group>

  <!-- ---------------------------------------------- -->
  <!---End Item Sub Header -->
  <!-- ---------------------------------------------- -->
</template>
