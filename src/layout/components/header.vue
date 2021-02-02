<template>
  <div>
    <b-navbar
      toggleable="lg"
      type="dark"
      variant="info"
      fixed="top"
      v-show="hideStyle.opacity !== 0"
      :style="hideStyle"
      v-b-hover="handleHover"
    >
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
      hideStyle: {
        opacity: 1.0,
      },
      id: 0,
    };
  },
  created() {
    this.handleScroll();
    window.addEventListener('scroll', this.handleScroll);
  },
  destroyed() {
    window.removeEventListener('scroll', this.handleScroll);
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
    handleScroll() {
      const y = window.scrollY;
      if (y < 120) {
        this.hideStyle.opacity = (120 - y) / 200 + 0.4;
      } else {
        this.hideStyle.opacity = 0.4;
      }
    },
    handleHover(hovered) {
      if (hovered) {
        this.hideStyle.opacity = 100;
      } else {
        this.handleScroll();
      }
    },
  },
};
</script>
