<template>
  <b-container class="my-2">
    <div>
      <b-form @submit="onSubmit" v-if="show">
        <b-form-group label-cols="4" label-cols-lg="2" label="호스트 ID" label-for="input-sm">
          <b-form-input
            id="input-1"
            v-model="meeting.host.id"
            type="text"
            placeholder="호스트 ID"
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 제목" label-for="input-sm">
          <b-form-input v-model="meeting.title" type="text" placeholder="모임 제목" class="ml-2"></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 내용" label-for="input-sm">
          <b-form-input v-model="meeting.content" type="text" placeholder="모임 내용" class="ml-2"></b-form-input>
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
            v-model="meeting.place"
            type="text"
            placeholder="모임 장소"
            required
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-form-group label-cols="4" label-cols-lg="2" label="모임 제목" label-for="input-sm">
          <b-form-input
            v-model.number="meeting.maxParticipant"
            type="number"
            placeholder="최대 인원"
            required
            class="ml-2"
          ></b-form-input>
        </b-form-group>

        <b-alert v-model="showSuccessMessage" variant="success" dismissible @dismissed="showSuccessMessage = false">
          <b-icon icon="check-circle"></b-icon>
          성공적으로 수정되었습니다!
        </b-alert>
        <b-alert v-model="showErrorMessage" variant="danger" dismissible @dismissed="showErrorMessage = false">
          <b-icon icon="exclamation-circle"></b-icon>
          {{ errorMessage }}
        </b-alert>
        <b-button type="submit" class="float-right" variant="primary">모임 수정</b-button>
      </b-form>
    </div>
  </b-container>
</template>

<script lang="ts">
import Vue from 'vue';
import { UPDATE_MEETING } from '@/graphql/updateMeeting';
import { MeetingPostParam } from '@/model/meetingPostParam';
import { mergeDateTime } from '@/services/serviceUtil';

export default Vue.extend({
  name: 'CreateFirst',
  props: ['meeting'],
  data() {
    const start = this.meeting.startAt.split(' ');
    const startDate = start[0];
    const startTime = start[1];
    const end = this.meeting.endAt.split(' ');
    const endDate = end[0];
    const endTime = end[1];
    const deadline = this.meeting.deadline.split(' ');
    const deadlineDate = deadline[0];
    const deadlineTime = deadline[1];
    console.log(deadlineTime);

    return {
      startTime: startTime,
      startDate: startDate,
      endTime: endTime,
      endDate: endDate,
      deadlineTime: deadlineTime,
      deadlineDate: deadlineDate,
      meetingPostParam: {} as MeetingPostParam,
      show: true,
      showSuccessMessage: false,
      showErrorMessage: false,
      errorMessage: '',
    };
  },
  created() {
    console.log(this.meeting);
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
      this.meetingPostParam.hostId = this.meeting.host.id;
      this.meetingPostParam.title = this.meeting.title;
      this.meetingPostParam.content = this.meeting.content;
      this.meetingPostParam.maxParticipant = this.meeting.maxParticipant;
      this.meetingPostParam.place = this.meeting.place;
      event.preventDefault();
      this.$apollo
        .mutate({
          mutation: UPDATE_MEETING,
          variables: { id: this.meeting.id, input: this.meetingPostParam },
        })
        .then((): void => {
          this.showSuccessMessage = true;
        })
        .catch((error: any) => {
          this.showErrorMessage = true;
          this.errorMessage = error.message.split(':')[1];
        });
    },
  },
});
</script>
