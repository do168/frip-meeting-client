<template>
  <div>
    <div id="progress">
      <create-header :title="title" />
    </div>
    <div id="create-step">
      <create-first />
    </div>
  </div>
</template>

<script lang="ts">
import CreateHeader from './CreateHeader.vue';
import CreateFirst from './CreateFirst.vue';
import Vue from 'vue';
export default Vue.extend({
  components: {
    CreateHeader,
    CreateFirst,
  },

  data() {
    return {
      title: 0,
    };
  },
});
</script>
