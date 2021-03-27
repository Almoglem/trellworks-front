<script>
import { Bar } from "vue-chartjs";

export default {
  props: {
    board: Object,
  },
  extends: Bar,
  computed: {},
  mounted() {
    this.renderChart(
      {
        labels: [],
        datasets: [
          {
            label: "tasks per member",
            backgroundColor: ["#C7CEEA", "#B5EAD7", "#FFDAC1", " #FFB7B2"],
            data: [],
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
