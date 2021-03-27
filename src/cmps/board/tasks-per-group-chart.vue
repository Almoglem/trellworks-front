<script>
import { Pie } from "vue-chartjs";

export default {
  props: {
    board: Object,
  },
  extends: Pie,
  computed: {
    groupTitles() {
      return this.board.groups.map((group) => {
        return group.title;
      });
    },
    tasksPerGroup() {
      return this.board.groups.map((group) => {
        return group.task.length;
      });
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.groupTitles,
        datasets: [
          {
            label: "tasks per group",
            backgroundColor: [
              "#d6b0b1",
              "#8b5e83",
              "#ffdcb8",
              "#b67171",
              "#6f9eaf",
              "#d0af84",
              "#62959c",
              "#c7cfb7",
              "#bb8082",
              "#d0af84",
              "#6e7c7c",
              "#dddddd",
              "#91684a",
            ],
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
