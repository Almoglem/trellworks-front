<template>
  <section class="dashboard-container">
    <div class="info-cards-container flex">
      <i class="fas fa-times dashboard-close clickable"> </i>
      <!-- <div class="info-card flex">
        <i class="far fa-clock"></i>
        <span>Created at {{ boardCreatedAt }} </span>
      </div> -->

      <!-- <i class="far fa-question-circle"></i> -->
      <!-- unassigned tasks -->

      <div class="info-card flex">
        <i class="far fa-user fa-2x"></i>
        <div class="info flex">
          <span class="bold">{{ currBoard.members.length }}</span>
          <span>Members</span>
        </div>
      </div>

      <div class="info-card flex">
        <i class="far fa-sticky-note fa-2x"></i>
        <div class="info flex">
          <span class="bold">{{ tasksLength }} </span>
          <span>Tasks</span>
        </div>
      </div>

      <div class="info-card flex">
        <i class="far fa-list-alt fa-2x"></i>
        <div class="info flex">
          <span class="bold">{{ currBoard.activities.length }} </span>
          <span>Activities</span>
        </div>
      </div>
    </div>
    <div class="chart-container flex">
      <div>
        <h5>tasks per group</h5>
        <tasksPerGroupChart :board="currBoard" class="chart" />
      </div>
      <div>
        <h5>tasks per member</h5>
        <tasksPerMemberChart :board="currBoard" class="chart" />
      </div>
    </div>
  </section>
</template>

<script>
import moment from "moment";
import tasksPerGroupChart from "./tasks-per-group-chart";
import tasksPerMemberChart from "./tasks-per-member-chart";

export default {
  data() {
    return {
      toggleDashboard: true,
    };
  },
  computed: {
    currBoard() {
      return this.$store.getters.currBoard;
    },
    tasksLength() {
      const board = this.$store.getters.currBoard;
      let count = 0;
      for (let i = 0; i < board.groups.length; i++) {
        count += board.groups[i].task.length;
      }
      return count;
    },
    boardCreatedAt() {
      return this.time(this.$store.getters.currBoard.createdAt);
    },
    isFromMenu() {},
  },
  methods: {
    moment: function () {
      return moment();
    },
    time(date) {
      return moment(date).format("DD.MM.YYYY");
    },
  },
  components: { tasksPerGroupChart, tasksPerMemberChart },
};
</script>