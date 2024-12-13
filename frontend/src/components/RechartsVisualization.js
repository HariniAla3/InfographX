import React, { useState, useRef, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { toPng } from "html-to-image";

const RechartsVisualization = ({ data, config }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const chartRef = useRef(null);

  const { x, y, chartType, colorTheme, width = 400, height = 400 } = config;

  const colorSchemes = {
    default: ["#8884d8", "#82ca9d", "#ffc658"],
    modern: ["#6b5b95", "#feb236", "#d64161"],
    vintage: ["#ff6f61", "#6b5b95", "#88b04b"],
  };

  const colors = colorSchemes[colorTheme] || colorSchemes.default;

  const parsedData = data.map((d) => ({
    ...d,
    [y]: +d[y],
  }));

  // Replay the animation infinitely
  useEffect(() => {
    const interval = setInterval(() => {
      setAnimationKey((prevKey) => prevKey + 1); // Trigger animation replay
    }, 3000);// Adjust interval time (e.g., 3000ms for 3 seconds)

    return () => clearInterval(interval); // Clear interval on component unmount
  }, []);

  const downloadChartAsImage = () => {
    if (chartRef.current) {
      toPng(chartRef.current, { backgroundColor: "white" })
        .then((dataUrl) => {
          const link = document.createElement("a");
          link.download = "chart.png";
          link.href = dataUrl;
          link.click();
        })
        .catch((err) => {
          console.error("Failed to export chart as PNG", err);
        });
    }
  };

  const renderChart = () => {
    const chartProps = {
      width: width,
      height: height,
      margin: { top: 20, right: 30, bottom: 30, left: 40 },
      key: animationKey, // Use key to trigger re-render and replay animation
      animationDuration: 10000
    };

    if (chartType === "bar") {
      return (
        <BarChart {...chartProps} data={parsedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey={y} fill={colors[0]}>
            {parsedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      );
    } else if (chartType === "line") {
      return (
        <LineChart {...chartProps} data={parsedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey={x} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={y} stroke={colors[0]} strokeWidth={2} />
        </LineChart>
      );
    } else if (chartType === "pie") {
      return (
        <PieChart {...chartProps}>
        <Pie
          data={parsedData}
          dataKey={y}
          nameKey={x}
          cx="50%"
          cy="50%"
          outerRadius={150}
          label={({ name, value }) => `${name}: ${value}%`} // Custom label format
          labelLine={false}
          animationDuration={3000}
        >
          {parsedData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
      );
    }

    return <p>Unsupported chart type</p>;
  };

  return (
    <div>
      <ResponsiveContainer width="100%" height={height}>
        <div ref={chartRef}>{renderChart()}</div>
      </ResponsiveContainer>
      <div
      onClick={downloadChartAsImage}
      style={{
        cursor: "pointer",
        width: "60px",
        height: "60px",
        background: "linear-gradient(135deg, #6B73FF, #000DFF)", // Gradient background
        borderRadius: "50%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        marginTop: "20px",
      }}
      title="Download Chart as PNG"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
    </div>

    </div>
  );
};

export default RechartsVisualization;
