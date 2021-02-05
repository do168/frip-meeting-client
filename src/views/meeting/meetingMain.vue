<template>
  <div>
    <b-tabs content-class="mt-3">
      <b-tab title="모임 조회" active>
        <meeting-list />
      </b-tab>
      <b-tab title="모임 생성"
        ><p><create /></p
      ></b-tab>
    </b-tabs>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import MeetingList from '@/components/meeting/meetingList.vue';
import Create from '@/components/meeting/Create.vue';

export default Vue.extend({
  name: 'meetingsMain',
  components: {
    MeetingList,
    Create,
  },
});
</script>
