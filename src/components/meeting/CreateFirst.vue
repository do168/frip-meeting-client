<template>
  <b-container class="my-2">
    <div>
      <b-form @submit="onSubmit" @reset="onReset" v-if="show">
        <b-form-group label-cols="4" label-cols-lg="2" label="호스트 ID" label-for="input-sm">
          <b-form-input
            id="input-1"
            v-model="meetingPostParam.hostId"
            type="text"
            placeholder="호스트 ID"
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 제목" label-for="input-sm">
          <b-form-input
            v-model="meetingPostParam.title"
            type="text"
            placeholder="모임 제목"
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 내용" label-for="input-sm">
          <b-form-input
            v-model="meetingPostParam.content"
            type="text"
            placeholder="모임 내용"
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 시작날짜/시간" label-for="input-sm">
          <b-form-datepicker v-model="startDate" class="ml-2"></b-form-datepicker>
          <b-form-timepicker v-model="startTime" class="ml-2"></b-form-timepicker>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 종료날짜/시간" label-for="input-sm">
          <b-form-datepicker v-model="endDate" class="ml-2"></b-form-datepicker>
          <b-form-timepicker v-model="endTime" class="ml-2"></b-form-timepicker>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 마감날짜/시간" label-for="input-sm">
          <b-form-datepicker v-model="deadlineDate" class="ml-2"></b-form-datepicker>
          <b-form-timepicker v-model="deadlineTime" class="ml-2"></b-form-timepicker>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 장소" label-for="input-sm">
          <b-form-input
            v-model="meetingPostParam.place"
            type="text"
            placeholder="모임 장소"
            required
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 제목" label-for="input-sm">
          <b-form-input
            v-model.number="meetingPostParam.maxParticipant"
            type="number"
            placeholder="최대 인원"
            required
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-alert v-model="showSuccessMessage" variant="success" dismissible @dismissed="showSuccessMessage = false">
          <b-icon icon="check-circle"></b-icon>
          성공적으로 등록되었습니다!
        </b-alert>
        <b-alert v-model="showErrorMessage" variant="danger" dismissible @dismissed="showErrorMessage = false">
          <b-icon icon="exclamation-circle"></b-icon>
          {{ errorMessage }}
        </b-alert>
        <b-button type="submit" class="float-right" variant="primary">참가 신청</b-button>
        <b-button type="reset" class="float-right mx-2" variant="danger">입력 초기화</b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import gql from 'graphql-tag';
import { CREATE_MEETING } from '@/graphql/createMeeting';
import { mergeDateTime } from '@/services/serviceUtil';

interface MeetingPostParam {
  hostId: string;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  deadline: string;
  maxParticipant: number;
  place: string;
}

export default Vue.extend({
  name: 'CreateFirst',
  data() {
    return {
      startTime: '',
      startDate: '',
      endTime: '',
      endDate: '',
      deadlineTime: '',
      deadlineDate: '',
      meetingPostParam: {} as MeetingPostParam,
      show: true,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: '',
    };
  },

  methods: {
    onSubmit(event: Event): void {
      mergeDateTime(
        this.meetingPostParam,
        this.startDate,
        this.startTime,
        this.endDate,
        this.endTime,
        this.deadlineDate,
        this.deadlineTime,
      );
      event.preventDefault();
      this.$apollo
        .mutate({
          mutation: CREATE_MEETING,
          variables: { input: this.meetingPostParam },
        })
        .then((): void => {
          this.showSuccessMessage = true;
        })
        .catch((error: any) => {
          this.showErrorMessage = true;
          this.errorMessage = error.message.split(':')[1];
        });
    },
    onReset(event: Event): void {
      event.preventDefault();
      // Reset our form values
      this.meetingPostParam = {
        hostId: '',
        title: '',
        content: '',
        startAt: '',
        endAt: '',
        deadline: '',
        maxParticipant: 0,
        place: '',
      };
      this.show = false;
      this.$nextTick(() => {
        this.show = true;
      });
    },
  },
});
</script>
