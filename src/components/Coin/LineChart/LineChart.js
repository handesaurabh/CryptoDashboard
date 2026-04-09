import React from "react";
import { Line } from "react-chartjs-2";
import "chart.js/auto";
import "./LineChart.css";

function LineChart({ chartData, priceType = "Price", multiAxis, coinName = "Coin", days = 30 }) {
    const hasChartData =
        Array.isArray(chartData?.labels) &&
        Array.isArray(chartData?.datasets) &&
        chartData.datasets.length > 0;

    const options = {
        plugins: {
            legend: {
                display: multiAxis ? true : false,
            },
            tooltip: {
                backgroundColor: "rgba(17, 17, 17, 0.95)",
                borderColor: "rgba(0, 212, 255, 0.24)",
                borderWidth: 1,
                titleColor: "#ffffff",
                bodyColor: "rgba(255, 255, 255, 0.86)",
                padding: 12,
                displayColors: false,
                callbacks: {
                    label: (context) => `Rs. ${Number(context.parsed.y).toLocaleString("en-IN")}`,
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: "index",
            intersect: false,
        },
        elements: {
            point: {
                radius: 0,
                hoverRadius: 5,
                hoverBorderWidth: 2,
                hoverBackgroundColor: "#00d4ff",
                hoverBorderColor: "#ffffff",
            },
            line: {
                borderJoinStyle: "round",
            },
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.62)",
                    maxRotation: 0,
                },
            },
            y: {
                grid: {
                    color: "rgba(255, 255, 255, 0.08)",
                    drawBorder: false,
                },
                ticks: {
                    color: "rgba(255, 255, 255, 0.72)",
                    callback: (value) => `Rs. ${Number(value).toLocaleString("en-IN")}`,
                },
            },
        },
    };

    if (!hasChartData) {
        return null;
    }

    const dayLabel =
        days === "max"
            ? "All days market snapshot"
            : `${days} day market snapshot`;

    return (
        <section className="chart-card">
            <div className="chart-card-header">
                <div>
                    <p className="chart-eyebrow">{dayLabel}</p>
                    <h2>{coinName} {priceType} Trend</h2>
                </div>
                <p className="chart-note">Daily closing values in INR</p>
            </div>
            <div className="chart-canvas-wrap">
                <Line data={chartData} options={options} />
            </div>
        </section>
    );
}

export default LineChart;
