<template>
  <div>
    <div class="mb-1">
      <p>
        이 모임을 삭제하시겠습니까?
      </p>
      <b-button class="float-right" @click="clickDel" variant="danger">삭제</b-button>
      <b-alert v-model="showSuccessMessage" variant="success" dismissible @dismissed="showSuccessMessage = false">
        <b-icon icon="check-circle"></b-icon>
        성공적으로 삭제되었습니다!
      </b-alert>
      <b-alert v-model="showErrorMessage" variant="danger" dismissible @dismissed="showErrorMessage = false">
        <b-icon icon="exclamation-circle"></b-icon>
        {{ errorMessage }}
      </b-alert>
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import { DELETE_MEETING } from '@/graphql/deleteMeeting';
export default Vue.extend({
  name: 'DeleteMeeting',
  props: {
    id: { type: Number, required: true },
  },
  data() {
    return {
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: '',
      boxTwo: '',
    };
  },
  methods: {
    clickDel() {
      this.$apollo
        .mutate({
          mutation: DELETE_MEETING,
          variables: { id: this.id },
        })
        .then((): void => {
          this.showSuccessMessage = true;
        })
        .catch((error: any) => {
          this.showErrorMessage = true;
          this.errorMessage = error.message.split(':')[1];
        });
    },
    showMsgBoxTwo() {
      this.boxTwo = '';
      this.$bvModal
        .msgBoxConfirm('이 모임을 정말 삭제하시겠습니까?', {
          title: '모임 삭제',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: 'YES',
          cancelTitle: 'NO',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then(value => {
          if (value) {
            this.clickDel();
          }
        })
        .catch(err => {
          // An error occurred
        });
    },
  },
});
</script>
