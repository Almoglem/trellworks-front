<script>
import { Bar } from "vue-chartjs";

export default {
  props: {
    board: Object,
  },
  extends: Bar,
  computed: {
    usernames() {
      return this.board.members.map((member) => {
        return member.username;
      });
    },
    tasksPerMember() {
      let counts = [];
      this.board.members.forEach((member) => {
        let memberTaskCount = 0;
        this.board.groups.forEach((group) => {
          group.task.forEach((task) => {
            task.members.forEach((taskMember) => {
              if (taskMember._id === member._id) {
                memberTaskCount++;
              }
            });
          });
        });
        counts.push(memberTaskCount);
      });
      return counts;
    },
  },
  mounted() {
    this.renderChart(
      {
        labels: this.usernames,
        datasets: [
          {
            label: "tasks per member",
            backgroundColor: [
              "#cee6b4",
              "#bb8082",
              "#ecb390",
              "#a3ddcb",
              "#387c6d",
              "#d0af84",
              "#ffe6e6",
              "#65d6ce",
              "#bb8082",
              "#d0af84",
              "#6e7c7c",
              "#dddddd",
              "#9e7540",
            ],
            data: this.tasksPerMember,
          },
        ],
      },
      {
        scales: {
          yAxes: [
            {
              ticks: {
                beginAtZero: true,
              },
            },
          ],
        },
      }
    );
  },
};
</script>
