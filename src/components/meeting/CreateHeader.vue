<template>
  <div>
    <b-progress :value="title" variant="success" striped :animated="true"></b-progress>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'CreateHeader',
  props: {
    title: { type: Number, required: true },
  },
});
</script>
