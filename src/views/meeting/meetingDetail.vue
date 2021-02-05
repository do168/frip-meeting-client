<template>
  <div align="left">
    <b-card no-body>
      <template #header>
        <b-container fluid class="text-left">
          <b-row>
            <b-col cols="6">
              <h3 class="mb-0">
                <B>{{ meeting.title }}</B>
              </h3>
              <p text-align="left" sytle="font-size:small;">
                <I style="color:grey">{{ meeting.updatedAt }}에 게시됨</I>
              </p>
            </b-col>
            <b-col class="text-right">
              <div v-cloak v-if="meeting.deadline">
                <participate-timer v-bind:deadline="meeting.deadline" />
              </div>
            </b-col>
          </b-row>
        </b-container>
      </template>

      <b-card-body>
        <b-card-title>
          <B>{{ nickname }}의 모임</B></b-card-title
        >
        <div style="margin:15px; color:grey">
          <b-icon icon="calendar2-event" style="margin-right:15px"></b-icon>
          <I> {{ meeting.startAt }} 에 진행됨 </I>
        </div>
        <div>
          <b-calendar
            v-model="value"
            locale="kr"
            :hide-header="true"
            selected-variant="info"
            today-variant="info"
            nav-button-variant="info"
            :initial-date="meeting.startAt"
            :date-info-fn="dateClass"
          ></b-calendar>
        </div>
        <div style="margin-top:15px"></div>
      </b-card-body>

      <b-list-group flush>
        <b-list-group-item
          ><b-icon icon="person-check-fill" style="margin-right:15px"></b-icon> 최대 {{ meeting.maxParticipant }}명까지
          참가 가능</b-list-group-item
        >
        <b-list-group-item
          ><b-icon icon="question-diamond-fill" style="margin-right:15px"></b-icon>
          {{ meeting.place }}</b-list-group-item
        >
        <b-list-group-item>
          <b-card-title><b-icon icon="info-circle" style="margin-right:15px"></b-icon> <B>모임 내용</B></b-card-title>
          <div style="margin-left:50px">{{ meeting.content }}</div></b-list-group-item
        >

        <b-list-group-item>
          <div><b-icon icon="alarm" style="margin-right:15px"></b-icon> 시작시간 : {{ meeting.startAt }}</div>
          <div><b-icon icon="alarm-fill" style="margin-right:15px"></b-icon> 종료시간 : {{ meeting.endAt }}</div>
        </b-list-group-item>
      </b-list-group>

      <b-card-body> </b-card-body>

      <b-card-footer>
        <b-button class="float-right mr-1" v-if="isPossibleParticipant" variant="primary" v-b-modal.modal-1
          >참가 신청</b-button
        >
        <b-button class="float-right mr-1" v-else disabled href="#" style="display:inline-block">참가 불가</b-button>
        <b-modal id="modal-1"
          ><meeting-participation v-bind:meetId="meetingId" v-bind:alreadyApply="meeting.participatesUsers"
        /></b-modal>
        <b-button class="float-left mr-1" variant="warning" v-b-modal.modal-2>모임 수정</b-button>
        <b-modal id="modal-2"><update :meeting="meeting"/></b-modal>
        <b-button class="float-left mr-1" variant="danger" v-b-modal.modal-3>모임 삭제</b-button>
        <b-modal id="modal-3"><delete :id="meetingId"/></b-modal>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script lang="ts">
import MeetingParticipation from '@/components/meeting/meetingParticipation.vue';
import ParticipateTimer from '@/components/meeting/participateTimer.vue';
import Update from '@/components/meeting/Update.vue';
import Delete from '@/components/meeting/Delete.vue';
import Vue from 'vue';
import { GET_MEETING } from '@/graphql/meeting';
import { convertTimezone } from '@/services/serviceUtil';
import { Meeting } from '@/model/Meeting';

export default Vue.extend({
  name: 'meetingDetails',
  components: {
    MeetingParticipation,
    ParticipateTimer,
    Update,
    Delete,
  },
  data() {
    return {
      meetingId: 0,
      userId: '',
      participatesUsers: [],
      meeting: {} as Meeting,
      dateString: '',
      value: '',
      nickname: '',
    };
  },

  created() {
    this.meetingId = Number(this.$route.params.id);
    this.getMeeting();
  },

  computed: {
    isPossibleParticipant(): boolean {
      return (
        this.meeting.cntCurrentParticipant < this.meeting.maxParticipant &&
        new Date().getTime() < new Date(this.meeting.deadline).getTime()
      );
    },
  },

  methods: {
    // 달력에 모임 시작, 끝을 나타내는 함수
    dateClass(ymd: string, date: Date) {
      const month = date.getMonth();
      const startDate = new Date(this.meeting.startAt);
      const endDate = new Date(this.meeting.endAt);
      const day = date.getDate();
      return month >= startDate.getMonth() &&
        month <= endDate.getMonth() &&
        day >= startDate.getDate() &&
        day <= endDate.getDate()
        ? 'table-info'
        : '';
    },
    // 미팅 정보 쿼리
    getMeeting(): void {
      this.$apollo
        .query({
          query: GET_MEETING,
          variables: { id: this.meetingId },
        })
        .then((result: any): void => {
          this.meeting = result.data.meeting;
          this.nickname = result.data.meeting.host.nickname;
          this.meeting.startAt = convertTimezone(this.meeting.startAt);
          this.meeting.endAt = convertTimezone(this.meeting.endAt);
          this.meeting.deadline = convertTimezone(this.meeting.deadline);
          this.meeting.updatedAt = convertTimezone(this.meeting.updatedAt);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
  },
});
</script>

<style>
[v-cloak] {
  display: none !important;
}
</style>
