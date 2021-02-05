<template>
  <div>
    <b-alert v-model="showSuccessMessage" variant="success" dismissible @dismissed="showSuccessMessage = false">
      <b-icon icon="check-circle"></b-icon>
      성공적으로 등록되었습니다!
    </b-alert>
    <b-alert v-model="showErrorMessage" variant="danger" dismissible @dismissed="showErrorMessage = false">
      <b-icon icon="exclamation-circle"></b-icon>
      {{ errorMessage }}
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'errorAlert',
  props: {
    showSuccessMessage: { type: Boolean, required: true },
    showErrorMessage: { type: Boolean, required: true },
    errorMessage: { type: String, required: true },
  },
});
</script>
