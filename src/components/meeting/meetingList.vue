<template>
  <div v-if="cardList" :key="componentKey">
    <b-table-simple selectable>
      <b-thead>
        <b-tr>
          <b-th scope="col">id</b-th>
          <b-th scope="col">title</b-th>
          <b-th scope="col">startAt</b-th>
          <b-th scope="col">Host</b-th>
          <b-th scope="col">CurrentParticipant/MaxParticipant</b-th>
        </b-tr>
      </b-thead>
      <draggable v-model="allMeetingList.item" tag="b-tbody" ghost-class="ghost">
        <b-tr
          v-for="(meetingItem, idx) in allMeetingList"
          :key="idx"
          @click="rowClick(meetingItem.id)"
          class="sortable"
        >
          <b-td>{{ meetingItem.id }}</b-td>
          <b-td>{{ meetingItem.title }}</b-td>
          <b-td>{{ meetingItem.startAt }}</b-td>
          <b-td>{{ meetingItem.host.nickname }}</b-td>
          <b-td>{{ meetingItem.cntCurrentParticipant }}/{{ meetingItem.maxParticipant }}</b-td>
        </b-tr>
      </draggable>
    </b-table-simple>
    <b-button
      v-if="pageInfo.hasNextPage"
      variant="light"
      @click="listMeetings({ first: 10, after: pageInfo.endCursor })"
      block
      class="float-right mt-2"
      >다음</b-button
    >
    <div>
      <b-form-input
        size="sm"
        class="float-left ml-1"
        style="width:10%"
        placeholder="호스트 ID"
        v-model="hostId"
      ></b-form-input>
      <b-button size="sm" class="float-left ml-1" @click="listMeetings({ first: 10 })">Search</b-button>
    </div>
    <b-alert v-model="showErrorMessage" variant="danger" dismissible @dismissed="showErrorMessage = false">
      <b-icon icon="exclamation-circle"></b-icon>
      {{ errorMessage }}
    </b-alert>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import draggable from 'vuedraggable';
import Header from '../../layout/components/header.vue';
import { GET_MEETINGS } from '../../graphql/meetings';
import { convertTimezone } from '@/services/serviceUtil';

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
export default Vue.extend({
  name: 'meetingsList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Header,
    draggable,
  },
  data() {
    return {
      hostId: '',
      userId: '',
      page: { pageNum: 0, pageSize: 0, first: 5, after: '' },
      cardList: [] as MeetingEdge[],
      pageInfo: {
        endCursor: '',
        hasNextPage: false,
      },
      nickname: '',
      fields: [
        // A virtual column that doesn't exist in items
        { key: 'id' },
        // A column that needs custom formatting
        { key: 'host.nickname', label: 'Host' },
        // A regular column
        { key: 'title' },
        // A regular column
        { key: 'startAt' },
        // A virtual column made up from two fields
        { key: 'maxParticipant', label: '현재/최대' },
      ],
      oldIndex: '',
      newIndex: '',
      transProps: {
        // Transition name
        name: 'flip-table',
      },
      showErrorMessage: false,

      errorMessage: '',
      componentKey: 0,
    };
  },
  created() {
    this.listMeetings({ first: 5 });
  },

  computed: {
    allMeetingList(): Meeting[] {
      return this.cardList.map((meeting: MeetingEdge) => meeting.node);
    },
  },

  methods: {
    forceRerender() {
      this.componentKey += 1;
    },
    rowClick(id: any, index: any, e: any): void {
      this.$router.push({ path: `/meetings/${id}` }).catch(err => {
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
      this.page.first = Number(page.first);
      this.page.after = page.after || '';
      this.$apollo
        .query({
          query: GET_MEETINGS,
          variables: { hostId: this.hostId, page: this.page },
        })
        .then((result: GqlResult<MeetingConnection>): void => {
          const edges = [...result.data.meetings.edges];
          edges.forEach(function(item) {
            item.node.startAt = convertTimezone(item.node.startAt);
          });
          this.cardList.push(...edges);
          this.pageInfo = result.data.meetings.pageInfo;
        })
        .catch((error: any) => {
          this.showErrorMessage = true;
          this.errorMessage = error.message.split(':')[1];
        });
    },
  },
});
</script>

<style>
.sortable {
  cursor: move;
}

.ghost {
  border-left: 6px solid rgb(0, 255, 183);
  box-shadow: 10px 10px 5px -1px rgba(0, 0, 0, 0.14);
  opacity: 0.7;
}
</style>
