"use client";

import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, TooltipItem } from "chart.js";
import { Bar } from "react-chartjs-2";
import { generateSessionsForChart } from "@/lib/data/sessions";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export function SessionsChart() {
  const chartData = generateSessionsForChart();

  const data = {
    labels: chartData.map((d) => d.date),
    datasets: [
      {
        label: "Charging",
        data: chartData.map((d) => d.charging),
        backgroundColor: "#22c55e",
        borderColor: "#16a34a",
        borderWidth: 1,
        borderRadius: 4,
      },
      {
        label: "Completed",
        data: chartData.map((d) => d.completed),
        backgroundColor: "#9ca3af",
        borderColor: "#6b7280",
        borderWidth: 1,
        borderRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: "top" as const,
        labels: {
          font: {
            size: 12,
          },
          boxWidth: 12,
          padding: 16,
        },
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        cornerRadius: 4,
        titleFont: {
          size: 12,
        },
        bodyFont: {
          size: 11,
        },
        callbacks: {
          label: function(context: TooltipItem<'bar'>) {
            return `${context.dataset.label}: ${context.parsed.y} sessions`;
          },
        },
      },
    },
    scales: {
      x: {
        stacked: false,
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
        },
      },
      y: {
        beginAtZero: true,
        max: 30,
        ticks: {
          font: {
            size: 11,
          },
        },
        grid: {
          color: "#f3f4f6",
          drawBorder: false,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        Charging Sessions (Last 7 Days)
      </h3>
      <div className="relative h-80">
        <Bar data={data} options={options} />
      </div>
    </div>
  );
}
