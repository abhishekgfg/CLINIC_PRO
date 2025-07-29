"use client";

import React, { useState } from "react";
import Chart from "react-apexcharts";
import { useInView } from "react-intersection-observer";

const DashboardStatsChart = ({
  patients,
  appointments,
  assistantData,
  accountData,
  medicineData,
  chithiData,
  packagingData,
  courierData,
  rescheduledCount,
}) => {
  const categories = [
    "Patients",
    "Appointments",
    "Assistant Doctor",
    "Account",
    "Medicine",
    "Chithi",
    "Packaging",
    "Courier",
    "Rescheduled",
  ];

  const dataCounts = [
    patients.length,
    appointments.length,
    assistantData.length,
    accountData.length,
    medicineData.length,
    chithiData.length,
    packagingData.length,
    courierData.length,
    rescheduledCount,
  ];

  const colors = [
    "#3498db", "#2ecc71", "#9b59b6", "#e67e22", "#1abc9c",
    "#e84393", "#e74c3c", "#f1c40f", "#7f8c8d",
  ];

  const { ref: barRef, inView: barVisible } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const { ref: pieRef, inView: pieVisible } = useInView({
    triggerOnce: true,
    threshold: 0.3,
  });

  const barOptions = {
    chart: {
      type: "bar",
      height: 400,
      toolbar: { show: false },
      animations: {
        enabled: barVisible,
        easing: 'easeinout',
        speed: 900,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
    },
    plotOptions: {
      bar: {
        borderRadius: 8,
        horizontal: false,
        columnWidth: "45%",
      },
    },
    dataLabels: {
      enabled: true,
    },
    xaxis: {
      categories,
      labels: {
        rotate: -45,
        style: { fontSize: "12px" },
      },
    },
    colors,
    title: {
      text: "Bar Chart - Clinic Overview",
      align: "center",
      style: { fontSize: "18px", fontWeight: "bold" },
    },
  };

  const pieOptions = {
    labels: categories,
    colors,
    legend: {
      position: "bottom",
    },
    chart: {
      animations: {
        enabled: pieVisible,
        easing: 'easeinout',
        speed: 1000,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
        dynamicAnimation: {
          enabled: true,
          speed: 500,
        },
      },
    },
    title: {
      text: "Pie Chart - Clinic Data Distribution",
      align: "center",
      style: { fontSize: "18px", fontWeight: "bold" },
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["#fff"],
    },
    fill: {
      type: "gradient",
    },
  };

  return (
    <div className="mt-10 space-y-10 px-4 md:px-10 transition-all duration-500">
      {/* Bar Chart */}
      <div
        ref={barRef}
        className={`rounded-2xl bg-white p-6 shadow-md transform transition-transform duration-700 ${
          barVisible ? "scale-[1.02] shadow-lg" : "scale-95 opacity-50"
        }`}
      >
        <Chart
          options={barOptions}
          series={[{ name: "Count", data: dataCounts }]}
          type="bar"
          height={400}
        />
      </div>

      {/* Pie Chart */}
      <div
        ref={pieRef}
        className={`rounded-full bg-white p-6 shadow-md transform transition-transform duration-700 ${
          pieVisible ? "scale-[1.02] shadow-lg" : "scale-95 opacity-50"
        }`}
      >
        <Chart
          options={pieOptions}
          series={dataCounts}
          type="pie"
          height={400}
        />
      </div>
    </div>
  );
};

export default DashboardStatsChart;
