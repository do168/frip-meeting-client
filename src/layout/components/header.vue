<template>
  <div>
    <b-navbar toggleable="lg" type="dark" variant="info">
      <b-navbar-nav>
        <b-nav-item @click="meetingPush"> 모임관리</b-nav-item>
        <b-nav-item @click="reviewPush">리뷰관리</b-nav-item>
      </b-navbar-nav>

      <!-- Right aligned nav items -->
      
    </b-navbar>
  </div>
</template>
<script>
export default {
  name: 'headers',
  data: function() {
    return {
      id: 0,
    };
  },
  methods: {
    meetingPush() {
      this.$router.push('/meetings').catch(err => {
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

    reviewPush() {
      this.$router.push('/reviews').catch(err => {
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
  },
};
</script>
