<template>
  <b-container>
    <p class="my-2" style="color: gray">참가 신청</p>
    <div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group id="input-group-1" label="유저 ID" label-for="input-1">
          <b-form-input id="input-1" v-model="userId" type="text" placeholder="유저 ID" required></b-form-input>
        </b-form-group>

        <b-alert v-model="showSuccessMessage" variant="success" dismissible @dismissed="showSuccessMessage = false">
          <b-icon icon="check-circle"></b-icon>
          성공적으로 등록되었습니다!
        </b-alert>
        <b-alert v-model="showErrorMessage" variant="danger" dismissible @dismissed="showErrorMessage = false">
          <b-icon icon="exclamation-circle"></b-icon>
          {{ errorMessage }}
        </b-alert>
        <!-- <error-alert
          :showSuccessMessage="showSuccessMessage"
          :showErrorMessage="showErrorMessage"
          :errorMessage="errorMessage"
        /> -->
        <b-button type="submit" class="float-right" variant="primary">참가 신청</b-button>
        <b-button type="reset" class="float-right mx-2" variant="danger">입력 초기화</b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { CREATE_MEETING_PARTICIPATION } from '@/graphql/createMeetingParticipation';
import ErrorAlert from '@/components/errorAlert.vue';
export default Vue.extend({
  data() {
    return {
      userId: '',
      show: true,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: '',
      submit: false,
    };
  },
  props: ['meetId', 'alreadyApply'],
  components: {
    // ErrorAlert,
  },
  methods: {
    isAlreadyApplied(): boolean {
      return this.alreadyApply.find((c: any) => c.id === this.userId);
    },
    onSubmit(event: Event): void {
      event.preventDefault();
      if (this.isAlreadyApplied()) {
        this.showErrorMessage = true;
        this.errorMessage = '이미 신청한 모임입니다';
      } else {
        this.$apollo
          .mutate({
            mutation: CREATE_MEETING_PARTICIPATION,
            variables: { meetingId: this.meetId, userId: this.userId },
          })
          .then(() => {
            this.showSuccessMessage = true;
          })
          .catch(error => {
            this.showErrorMessage = true;
            this.errorMessage = error.message.split(':')[1];
          });
      }
    },
    onReset(event: Event): void {
      event.preventDefault();
      // Reset our form values
      this.userId = '';
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
});
</script>
