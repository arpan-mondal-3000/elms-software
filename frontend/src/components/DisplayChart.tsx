import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";

// Register required components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

type ChartData = {
    Sunday: number;
    Monday: number;
    Tuesday: number;
    Wednesday: number;
    Thursday: number;
    Friday: number;
    Saturday: number;
}

const DisplayChart = ({ data }: { data: ChartData | {} }) => {
    const days: (keyof ChartData)[] = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];

    const chartData: ChartData<"bar"> = {
        labels: days,
        datasets: [
            {
                label: "Absentees",
                data: days.map((day) => data[day]),
                backgroundColor: "#3b82f6",
                borderRadius: 6,
            },
        ],
    };

    const options: ChartOptions<"bar"> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: "top",
            },
            title: {
                display: true,
                text: "Absentees by Day",
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    precision: 0,
                },
            },
        },
    };

    return (
        <div style={{ height: "400px", width: "100%" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default DisplayChart;
