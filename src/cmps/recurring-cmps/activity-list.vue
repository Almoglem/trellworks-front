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
          >           		<img
				v-if="activity.byMember.profileImg"
				class="user-profileimg"
				:src="activity.byMember.profileImg"
				alt=""
			/>
			<avatar v-else :size="30" :username="activity.byMember.fullname"></avatar>
        </span>
        <span class="flex activity-details">
          <span>
            <span style="font-weight:bold">{{activity.byMember.fullname   }}   </span>   {{ activity.title }}
          </span>
          
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
  },
  components: { Avatar },
};
</script>