<script>
import { Pie } from "vue-chartjs";

export default {
  props: {
    board: Object,
  },
  extends: Pie,
  computed: {
    groupTitles() {
      let titles = [];
      for (let i = 0; i < this.board.groups.length; i++) {
        titles.push(this.board.groups[i].title);
      }
      return titles;
    },
    tasksPerGroup() {
      let counts = [];
      for (let i = 0; i < this.board.groups.length; i++) {
        counts.push(this.board.groups[i].task.length);
      }
      return counts;
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.groupTitles,
        datasets: [
          {
            label: "tasks per group",
            backgroundColor: ["#C7CEEA", "#B5EAD7", "#FFDAC1", " #FFB7B2"],
            data: this.tasksPerGroup,
          },
        ],
      }
      //   {
      //     scales: {
      //       yAxes: [
      //         {
      //           ticks: {
      //             beginAtZero: true,
      //           },
      //         },
      //       ],
      //     },
      //   }
    );
  },
};
</script>
