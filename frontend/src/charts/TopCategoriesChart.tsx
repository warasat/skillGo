import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { getTopCategoriesByEnrollments } from "../services/dashboard/dashboard.api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopCategoriesChart = () => {
  const [data, setData] = useState<
    { category: string; totalEnrollments: number }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState(30);

  // Fetch top categories whenever range changes
  const fetchData = async (selectedRange: number) => {
    setLoading(true);
    const result = await getTopCategoriesByEnrollments(selectedRange);
    setData(result);
    setLoading(false);
  };

  useEffect(() => {
    fetchData(range);
  }, [range]);

  const labels = data.map((item) => item.category);
  const values = data.map((item) => item.totalEnrollments);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Enrollments",
        data: values,
        backgroundColor: ["#FFD700", "#C0C0C0", "#CD7F32"],
      },
    ],
  };

  const options = {
    indexAxis: "y" as const,
    responsive: true,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top 3 Categories by Enrollments",
        font: { size: 16 },
      },
      tooltip: {
        callbacks: {
          label: (context: any) => `${context.label}: ${context.raw} learners`,
        },
      },
    },
    scales: {
      x: {
        beginAtZero: true,
        max: Math.max(...values) + 2,
        ticks: { stepSize: 2 },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded shadow ">
      {/* Filter Dropdown */}
      <div className="flex justify-between items-center mb-4  ">
        <h3 className="text-lg font-semibold">Top Categories</h3>
        <select
          value={range}
          onChange={(e) => setRange(parseInt(e.target.value))}
          className="border px-2 py-1 rounded cursor-pointer"
        >
          <option value={7}>Last 7 Days</option>
          <option value={30}>Last 30 Days</option>
          <option value={365}>Last 1 Year</option>
        </select>
      </div>

      {/* Chart / Loading */}
      {loading ? (
        <p className="text-gray-500 animate-pulse">Loading chart...</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">No enrollment data available.</p>
      ) : (
        <Bar data={chartData} options={options} />
      )}
    </div>
  );
};

export default TopCategoriesChart;
