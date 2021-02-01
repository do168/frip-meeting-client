<template>
  <div>
    <b-jumbotron>
      <template #header>{{ meetingInfo.title }}</template>

      <template #lead>
        <div>
          <ul class="list-unstyled">
            <b-media tag="li">
              <template #aside>
                <b-img blank blank-color="#abc" width="64" alt="placeholder"></b-img>
              </template>
              <h5 class="mt-0 mb-1">Host</h5>
              <p class="mb-0">
                {{ meetingInfo.host.nickname }}
              </p>
            </b-media>

            <b-media tag="li" class="my-4">
              <template #aside>
                <b-img blank blank-color="#cba" width="64" alt="placeholder"></b-img>
              </template>

              <h5 class="mt-0 mb-1">시작시간 / 종료시간</h5>
              <p class="mb-0">{{ meetingInfo.startAt }} / {{ meetingInfo.endAt }}</p>
            </b-media>

            <b-media tag="li">
              <template #aside>
                <b-img blank blank-color="#bac" width="64" alt="placeholder"></b-img>
              </template>

              <h5 class="mt-0 mb-1">마감시간</h5>
              <p class="mb-0">
                {{ meetingInfo.deadline }}
              </p>
            </b-media>

            <b-media tag="li" class="my-4">
              <template #aside>
                <b-img blank blank-color="#bae" width="64" alt="placeholder"></b-img>
              </template>

              <h5 class="mt-0 mb-1">장소</h5>
              <p class="mb-0">
                {{ meetingInfo.place }}
              </p>
            </b-media>

            <b-media tag="li">
              <template #aside>
                <b-img blank blank-color="#edc" width="64" alt="placeholder"></b-img>
              </template>

              <h5 class="mt-0 mb-1">현재 참가 인원 / 최대 참가 인원</h5>
              <p class="mb-0">{{ meetingInfo.cntCurrentParticipant }} / {{ meetingInfo.maxParticipant }}</p>
            </b-media>
          </ul>
        </div>
      </template>

      <hr class="my-4" />

      <h1>
        {{ meetingInfo.content }}
      </h1>

      <b-button v-if="isPossibleParticipant" variant="primary" v-b-modal.modal-1>참가 신청</b-button>
      <b-button v-else disabled href="#">참가 불가</b-button>
      <b-modal id="modal-1"
        ><meeting-participation v-bind:meetId="meetingId" v-bind:alreadyApply="meetingInfo.participatesUsers"
      /></b-modal>
    </b-jumbotron>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import Vue from 'vue';
import MeetingParticipation from './meetingParticipation.vue';

interface GqlResult<T> {
  data: T;
}

interface User {
  meetingId: number;
  id: string;
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
  host: string;
  cntCurrentParticipant: number | 0;
  participatesUsers: User[];
}

export default {
  name: 'meetingDetails',
  components: {
    MeetingParticipation,
  },
  data() {
    const meetingId = Number(this.$route.params.id);
    const participatesUsers: User[] = [];
    const meetingInfo: Meeting = {
      id: 0,
      title: '',
      content: '',
      startAt: '',
      endAt: '',
      deadline: '',
      place: '',
      maxParticipant: 0,
      host: '',
      cntCurrentParticipant: 0,
      participatesUsers: participatesUsers,
    };
    return {
      meetingId: meetingId,
      userId: '',
      meetingInfo: meetingInfo,
    };
  },
  created() {
    this.listMeetings();
  },

  computed: {
    isPossibleParticipant(): boolean {
      return this.meetingInfo.cntCurrentParticipant < this.meetingInfo.maxParticipant;
    },
  },

  methods: {
    listMeetings(): void {
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
          this.meetingInfo = result.data.meeting;
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
    participateMeeting(): void {
      this.$apollo
        .mutate({
          mutation: gql`
            mutation($meetingId: Int!, $userId: String!) {
              createMeetingParticipation(meetingId: $meetingId, userId: $userId) {
                meeting {
                  id
                }
                user {
                  id
                }
              }
            }
          `,
          variables: { meetingId: this.meetingId, userId: this.userId },
        })
        .then((result: any): void => {
          this.meetingInfo = result.data.meeting;
        })
        .catch((err: any) => {
          console.log(err);
        });
    },
  },
};
</script>
