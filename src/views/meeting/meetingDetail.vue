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
              <participate-timer :deadline="meeting.deadline" />
            </b-col>
          </b-row>
        </b-container>
      </template>

      <b-card-body>
        <b-card-title>
          <B>{{ meeting.host.nickname }}의 모임</B></b-card-title
        >
        <div style="margin:15px; color:grey">
          <b-icon icon="calendar2-event" style="margin-right:15px"></b-icon>
          <I> {{ meeting.startAt }} 에 진행됨 </I>
        </div>
        <div>
          <b-calendar
            v-model="value"
            :date-info-fn="dateClass"
            locale="kr"
            :hide-header="true"
            :initial-date="meeting.startAt"
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

      <b-card-footer align="right">
        <b-button v-if="isPossibleParticipant" variant="primary" v-b-modal.modal-1>참가 신청</b-button>
        <b-button v-else disabled href="#" style="display:inline-block">참가 불가</b-button>
        <b-modal id="modal-1"
          ><meeting-participation v-bind:meetId="meetingId" v-bind:alreadyApply="meeting.participatesUsers"
        /></b-modal>
      </b-card-footer>
    </b-card>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import MeetingParticipation from './meetingParticipation.vue';
import ParticipateTimer from './participateTimer.vue';
import Vue from 'vue';

interface GqlResult<T> {
  data: T;
}

interface User {
  meetingId: number;
  id: string;
}

interface Host {
  id: string;
  nickname: string;
}

interface Meeting {
  id: number;
  title: string;
  content: string;
  startAt: string;
  endAt: string;
  deadline: string;
  place: string;
  maxParticipant: number;
  updatedAt: string;
  host: Host | undefined;
  cntCurrentParticipant: number | 0;
  participatesUsers: User[];
}

export default Vue.extend({
  name: 'meetingDetails',
  components: {
    MeetingParticipation,
    ParticipateTimer,
  },
  data() {
    return {
      meetingId: 0,
      userId: '',
      participatesUsers: [],
      meeting: {} as Meeting,
      dateString: '',
      value: '',
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
          query: gql`
            query GetMeeting($id: ID!) {
              meeting(id: $id) {
                id
                title
                content
                startAt
                endAt
                deadline
                updatedAt
                place
                maxParticipant
                cntCurrentParticipant
                host {
                  nickname
                }
                participatesUsers {
                  id
                }
              }
            }
          `,
          variables: { id: this.meetingId },
        })
        .then((result: any): void => {
          this.meeting = result.data.meeting;
          // date 재조립. 이거 datetime이라 표준시 포함해서 localdatetime으로 바꿔야 한다
          this.meeting.startAt = this.meeting.startAt.substring(0, 10) + ' ' + this.meeting.startAt.substring(11, 19);
          this.meeting.endAt = this.meeting.endAt.substring(0, 10) + ' ' + this.meeting.endAt.substring(11, 19);
          this.meeting.deadline =
            this.meeting.deadline.substring(0, 10) + ' ' + this.meeting.deadline.substring(11, 19);
          this.meeting.updatedAt =
            this.meeting.updatedAt.substring(0, 10) + ' ' + this.meeting.updatedAt.substring(11, 19);
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
  },
});
</script>
