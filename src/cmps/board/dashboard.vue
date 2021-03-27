<template>
  <section class="dashboard-container">
    <h1>This board's stats</h1>
    <span>Created at {{ boardCreatedAt }} </span> |
    <span>{{ currBoard.members.length }} members</span> |
    <span>{{ tasksLength }} tasks</span> |
    <span>{{ currBoard.activities.length }} activities</span>
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
  props: {},
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