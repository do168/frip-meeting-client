<template>
  <Header />
</template>
<script>
import Header from './components/header.vue';
export default {
  name: 'layouts',
  components: {
    Header,
  },
};
</script>
<style>
#content {
  margin-top: 4rem;
  background-color: var(--main-white);
}
</style>
