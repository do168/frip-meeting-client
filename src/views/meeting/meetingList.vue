<template>
  <div v-if="cardList">
    <b-table small :fields="fields" :items="allMeetingList" responsive="sm" selectable @row-clicked="rowClick">
      <!-- A virtual column -->
      <template #cell(id)="allMeetingList">
        {{ allMeetingList.item.id }}
      </template>

      <!-- A custom formatted column -->
      <template #cell(title)="allMeetingList">
        <b class="text-info">{{ allMeetingList.item.title }}</b>
      </template>

      <!-- A virtual composite column -->
      <template #cell(startAt)="allMeetingList"> {{ allMeetingList.item.startAt }}</template>

      <!-- Optional default data cell scoped slot -->
      <template #cell(Host)="allMeetingList">
        <i>{{ allMeetingList.host.nickname }}</i>
      </template>

      <template #cell(maxParticipant)="allMeetingList">
        <i>{{ allMeetingList.item.cntCurrentParticipant }} / {{ allMeetingList.item.maxParticipant }}</i>
      </template>
    </b-table>
    <b-button
      v-if="pageInfo.hasNextPage"
      variant="light"
      @click="listMeetings({ first: 10, after: pageInfo.endCursor })"
      block
      class="float-right mt-2"
      >다음</b-button
    >
    <b-navbar-nav>
      <b-nav-form>
        <b-form-input size="sm" class="mr-sm-2" placeholder="호스트 ID" v-model="hostId"></b-form-input>
        <b-button size="sm" class="my-2 my-sm-0" @click="listMeetings({ first: 10 })">Search</b-button>
      </b-nav-form>
    </b-navbar-nav>
  </div>
</template>

<script lang="ts">
import gql from 'graphql-tag';
import Vue from 'vue';

interface GqlResult<T> {
  data: T;
}

interface MeetingEdge {
  node: Meeting;
}
interface MeetingConnection {
  meetings: {
    edges: MeetingEdge[];
    pageInfo: {
      endCursor: string;
      hasNextPage: boolean;
    };
  };
}

interface Page {
  pageNum?: number;
  pageSize?: number;
  first?: number;
  after?: string;
}

interface Meeting {
  id: number;
  title: string;
  startAt: string;
  maxParticipant: number;
  host: string;
  cntCurrentParticipant: number | 0;
}
import Header from '../../layout/components/header.vue';
export default Vue.extend({
  name: 'meetingsList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Header,
  },
  data() {
    const cardList: MeetingEdge[] = [];
    return {
      hostId: '',
      userId: '',
      page: { pageNum: 0, pageSize: 0, first: 10, after: '' },
      cardList: cardList,
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
      },
      fields: [
        // A virtual column that doesn't exist in items
        'id',
        // A column that needs custom formatting
        { key: 'host.nickname', label: 'Host' },
        // A regular column
        'title',
        // A regular column
        'startAt',
        // A virtual column made up from two fields
        { key: 'maxParticipant', label: '현재/최대' },
      ],
    };
  },
  created() {
    this.listMeetings({ first: 10 });
  },

  computed: {
    allMeetingList(): Meeting[] {
      return this.cardList.map((meeting: MeetingEdge) => meeting.node);
    },
  },

  methods: {
    rowClick(item: any, index: any, e: any): void {
      this.$router.push({ path: `/meetings/${item.id}` }).catch(err => {
        // Ignore the vuex err regarding  navigating to the page they are already on.
        if (
          err.name !== 'NavigationDuplicated' &&
          !err.message.includes('Avoided redundant navigation to current location')
        ) {
          // But print any other errors to the console
          console.log(err);
        }
      });
    },
    listMeetings(page: Page): void {
      this.cardList = [];
      this.page.first = Number(page.first);
      this.page.after = page.after || '';
      this.$apollo
        .query({
          query: gql`
            query GetMeetings($hostId: String, $page: Page!) {
              meetings(hostId: $hostId, page: $page) {
                edges {
                  node {
                    id
                    title
                    startAt
                    maxParticipant
                    cntCurrentParticipant
                    host {
                      nickname
                    }
                  }
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
                totalCount
              }
            }
          `,
          variables: { hostId: this.hostId, page: this.page },
        })
        .then((result: GqlResult<MeetingConnection>): void => {
          this.cardList.push(...result.data.meetings.edges);
          this.pageInfo = result.data.meetings.pageInfo;
        })
        .catch((err: any) => {
          console.log(err.stack);
        });
    },
  },
});
</script>
