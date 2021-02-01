import Vue from 'vue';
import VueRouter from 'vue-router';
import meetingList from '../views/meeting/meetingList.vue';
import meetingDetail from '../views/meeting/meetingDetail.vue';
import layoutMain from '../layout/layout.vue';
Vue.use(VueRouter);

const router = new VueRouter({
  mode: 'history',
  routes: [
    //메인
    {
      path: '/',
      name: 'Main',
      components: {
        layout: layoutMain,
      },
    },
    //모임
    {
      path: '/meetings/',
      name: 'meetingMain',
      components: {
        layout: layoutMain,
        main: meetingList,
      },
    },
    {
      path: '/meetings/:id',
      name: 'meetingMain',
      components: {
        layout: layoutMain,
        main: meetingDetail,
      },
    },
    // {
    //     path: "/meeting/create",
    //     name: "meetingCreate",
    //     components: {
    //         layout: layoutMain,
    //         main: meetingCreate
    //     }
    // },
    // {
    //     path: "/meeting/modify",
    //     name: "meetingModify",
    //     components: {
    //         layout: layoutMain,
    //         main: meetingModify
    //     }
    // },
    //리뷰
    //   {
    //     path: "/review",
    //     name: "mreviewMain",
    //     components: {
    //         layout: layoutMain,
    //         main: reviewMain
    //     }
    // },
    // {
    //     path: "/review/create",
    //     name: "reviewCreate",
    //     components: {
    //         layout: layoutMain,
    //         main: reviewCreate
    //     }
    // },
    // {
    //     path: "/review/modify",
    //     name: "reviewModify",
    //     components: {
    //         layout: layoutMain,
    //         main: reviewModify
    //     }
    // },
    //에러페이지
  ],
});

export default router;
