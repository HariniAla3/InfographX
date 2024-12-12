import React, { useState, useRef } from "react";
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
import { Canvg } from "canvg";

const RechartsVisualization = ({ data, config }) => {
  const [isExporting, setIsExporting] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
  const [animationKey, setAnimationKey] = useState(0);
  const chartRef = useRef(null);
  const canvasRef = useRef(document.createElement("canvas"));

  const { x, y, chartType, colorTheme, width = 800, height = 400 } = config;

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

  const replayAnimation = () => {
    setAnimationKey((prevKey) => prevKey + 1); // Trigger animation replay by updating the key
  };

  const exportAnimation = () => {
    if (!chartRef.current) {
      console.error("Chart not available for capture.");
      return;
    }

    replayAnimation(); // Replay the animation before starting export

    const canvas = canvasRef.current;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");

    const svgElement = chartRef.current.querySelector("svg");
    if (!svgElement) {
      console.error("SVG not found.");
      return;
    }

    const svgString = new XMLSerializer().serializeToString(svgElement);
    const canvg = Canvg.fromString(ctx, svgString);

    // Initialize MediaRecorder
    const stream = canvas.captureStream(30); // 30 FPS
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: "video/webm",
      videoBitsPerSecond: 2500000,
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      const videoURL = URL.createObjectURL(blob);
      setVideoURL(videoURL);
      setIsExporting(false);
    };

    mediaRecorder.start();
    setIsExporting(true);

    // Render Frames for Animation
    const totalFrames = 150; // 5 seconds at 30 FPS
    let currentFrame = 0;

    const renderFrame = () => {
      if (currentFrame >= totalFrames) {
        mediaRecorder.stop();
        return;
      }

      canvg.render();
      currentFrame++;
      setTimeout(renderFrame, 1000 / 30); // Capture frame every 1/30 seconds
    };

    setTimeout(renderFrame, 100); // Small delay to ensure animation starts before capture
  };

  const renderChart = () => {
    const chartProps = {
      width: width,
      height: height,
      margin: { top: 20, right: 30, bottom: 30, left: 40 },
      key: animationKey, // Use key to trigger re-render and replay animation
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

      <canvas ref={canvasRef} style={{ display: "none" }}></canvas>

      <div className="mt-4 flex space-x-2">
        <button
          onClick={exportAnimation}
          disabled={isExporting}
          className={`px-4 py-2 rounded ${
            isExporting ? "bg-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
          }`}
        >
          {isExporting ? "Exporting..." : "Export Animation"}
        </button>
      </div>

      {videoURL && (
        <div className="mt-4">
          <h3 className="text-lg font-bold">Animation Preview</h3>
          <video controls src={videoURL} className="mt-2 rounded shadow-md w-full" />
          <a href={videoURL} download="chart-animation.webm" className="block mt-2 text-blue-600 underline">
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default RechartsVisualization;
