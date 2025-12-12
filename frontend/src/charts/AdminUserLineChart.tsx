import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  getUserStatsByDate,
  type UserStatsByDate,
} from "../services/adminDashboard/adminDashboard.api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const AdminUsersLineChart = () => {
  const [data, setData] = useState<UserStatsByDate[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const stats = await getUserStatsByDate();
      setData(stats);
    };
    fetchData();
  }, []);

  const chartData = {
    labels: data.map((d) => d.date),
    datasets: [
      {
        label: "Total Users",
        data: data.map((d) => d.total),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,

    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "User Registration Trend (Last 30 Days)" },
    },
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 2,
        max: Math.max(...data.map((d) => d.total)) + 2,
        ticks: {
          stepSize: 2,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

export default AdminUsersLineChart;
