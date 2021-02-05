<template>
  <div v-if="loaded">
    <b-badge v-if="!expired" variant="success">
      <div class="countdown" loaded>
        <div class="countdown__num">
          <span class="countdown__num--time">{{ displayDays }}</span>
          <span class="countdown__num--unit">Days</span>
        </div>
        <span class="countdown__num--colon">:</span>
        <div class="countdown__num">
          <span class="countdown__num--time">{{ displayHours }}</span>
          <span class="countdown__num--unit">Hours</span>
        </div>
        <span class="countdown__num--colon">:</span>
        <div class="countdown__num">
          <span class="countdown__num--time">{{ displayMinutes }}</span>
          <span class="countdown__num--unit">Minutes</span>
        </div>
        <span class="countdown__num--colon">:</span>
        <div class="countdown__num">
          <span class="countdown__num--time">{{ displaySeconds }}</span>
          <span class="countdown__num--unit">Seconds</span>
        </div>
      </div>
    </b-badge>
    <b-badge v-else variant="danger">
      <div class="countdown__num">
        <span class="my-2" style="font-size: 30px;">마감시간이 지났습니다</span>
      </div></b-badge
    >
  </div>
  <div v-else><b-spinner variant="success" label="Spinning"></b-spinner></div>
</template>

<script lang="ts">
import Vue from 'vue';
export default Vue.extend({
  name: 'participateTimer',
  props: ['deadline'],
  data() {
    const limit = new Date(this.deadline);
    const year = limit.getFullYear();
    const month = limit.getMonth();
    const day = limit.getDate();
    const hour = limit.getHours();
    const minute = limit.getMinutes();
    const second = limit.getSeconds();
    const milliseconds = limit.getMilliseconds();
    return {
      displayDays: 0,
      displayHours: 0,
      displayMinutes: 0,
      displaySeconds: 0,
      loaded: false,
      expired: false,
      year: year,
      month: month,
      day: day,
      hour: hour,
      minute: minute,
      second: second,
      milliseconds: milliseconds,
    };
  },
  computed: {
    _seconds: () => 1000,
    _minutes(): number {
      return this._seconds * 60;
    },
    _hours(): number {
      return this._minutes * 60;
    },
    _days(): number {
      return this._hours * 24;
    },
    END(): Date {
      return new Date(this.year, this.month, this.day, this.hour, this.second, this.minute, this.milliseconds);
    },
  },
  mounted() {
    this.showRemaining();
  },
  methods: {
    formatNum: (num: any) => (num < 10 ? '0' + num : num),
    showRemaining() {
      const TIMER = setInterval(() => {
        const NOW = new Date();
        const DISTANCE = this.END.getTime() - NOW.getTime();
        if (DISTANCE < 0) {
          clearInterval(TIMER);
          this.expired = true;
          this.loaded = true;
          return;
        }
        const DAYS = Math.floor(DISTANCE / this._days);
        const HOURS = Math.floor((DISTANCE % this._days) / this._hours);
        const MINUTES = Math.floor((DISTANCE % this._hours) / this._minutes);
        const SECONDS = Math.floor((DISTANCE % this._minutes) / this._seconds);
        this.displayMinutes = this.formatNum(MINUTES);
        this.displaySeconds = this.formatNum(SECONDS);
        this.displayHours = this.formatNum(HOURS);
        this.displayDays = this.formatNum(DAYS);
        this.loaded = true;
      }, 1000);
    },
  },
});
</script>

<style>
.countdown {
  display: flex;
  justify-content: space-evenly;
  margin-top: 20px;
}
.countdown__num {
  display: flex;
  flex-direction: column;
  padding: 0 10px;
}
.countdown__num--time {
  color: var(--color-primary);
  font-size: 40px;
}
.countdown__num--unit {
  color: var(--color-gray);
  font-size: 12;
}
.countdown__num--colon {
  color: var(--color-primary);
  font-size: 40px;
  line-height: 1.4em;
}
</style>
