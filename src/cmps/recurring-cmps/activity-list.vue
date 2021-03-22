<template>
  <section class="activity-log">
    <i class="far fa-list-alt fa-lg"></i>
    <h2 class="details-title">Activity Log</h2>
    <section
      v-for="activity in activities"
      :key="activity.id"
      class="activity-container"
    >
      <section class="flex activity">
        <span class="avatar"
          ><avatar :size="32" :username="activity.byMember.fullname"></avatar>
        </span>
        <span class="flex activity-details">
          {{ renderTask(activity) }}
          <span class="muted-txt activity-time">{{
            time(activity.createdAt)
          }}</span>
        </span>
      </section>
    </section>
  </section>
</template>

<script>
import moment from "moment";
import Avatar from "vue-avatar";

export default {
  props: {
    activities: Array,
  },

  methods: {
    moment: function () {
      return moment();
    },
    time(date) {
      return moment(date).fromNow();
    },
    renderTask(activity) {
      switch (activity.title) {
        case "This board was created": {
          return `${activity.title}`;
          break;
        }
        default: {
          return `${activity.byMember.fullname} ${activity.title}`;
        }
      }
    },
  },
  components: { Avatar },
};
</script>