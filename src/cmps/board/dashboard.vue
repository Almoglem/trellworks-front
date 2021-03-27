<template>
  <section class="dashboard-container">
    <h1>This board's stats</h1>
    <p>Created at {{ currBoard.createdAt }} (use moment JS here)</p>
    <p>{{ currBoard.members.length }} members</p>
    <p>{{ tasksLength }} tasks</p>
    <p>{{ currBoard.activities.length }} activities</p>
    <!-- {{ currBoard }} -->
  </section>
</template>

<script>
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
  },
  methods: {},
  components: {},
};
</script>