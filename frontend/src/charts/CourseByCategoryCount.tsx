import { useEffect, useState } from "react";
import { getInstructorCoursesByCategory } from "../services/dashboard/dashboard.api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const generateColors = (count: number) => {
  const colors = [
    "rgba(255, 99, 132, 0.2)",
    "rgba(54, 162, 235, 0.2)",
    "rgba(255, 206, 86, 0.2)",
    "rgba(75, 192, 192, 0.2)",
    "rgba(153, 102, 255, 0.2)",
    "rgba(255, 159, 64, 0.2)",
    "rgba(201, 203, 207, 0.2)",
    "rgba(0, 128, 128, 0.2)",
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

const generateBorderColors = (count: number) => {
  const colors = [
    "rgb(255, 99, 132)",
    "rgb(54, 162, 235)",
    "rgb(255, 206, 86)",
    "rgb(75, 192, 192)",
    "rgb(153, 102, 255)",
    "rgb(255, 159, 64)",
    "rgb(201, 203, 207)",
    "rgb(0, 128, 128)",
  ];

  return Array.from({ length: count }, (_, i) => colors[i % colors.length]);
};

const CourseByCategoryCount = () => {
  const [categoryStats, setCategoryStats] = useState<
    { category: string; totalCourses: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryCount = async () => {
      try {
        const response = await getInstructorCoursesByCategory();
        setCategoryStats(response || []);
      } catch (err) {
        console.error("Error fetching category data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryCount();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500 text-lg animate-pulse">Loading chart...</p>
      </div>
    );
  }

  if (categoryStats.length === 0) {
    return (
      <p className="text-gray-500 text-center py-16">
        No courses available to display.
      </p>
    );
  }

  const labels = categoryStats.map((c) => c.category);
  const dataValues = categoryStats.map((c) => c.totalCourses);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Courses",
        data: dataValues,
        backgroundColor: generateColors(dataValues.length),
        borderColor: generateBorderColors(dataValues.length),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Courses by Category", font: { size: 16 } },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: Math.max(...dataValues) + 2,
        ticks: { stepSize: 2 },
      },
    },
  };

  return <Bar data={chartData} options={options} />;
};

export default CourseByCategoryCount;
