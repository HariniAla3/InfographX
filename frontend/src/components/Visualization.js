import React, { useState, useEffect } from "react";
import RechartsVisualization from "./RechartsVisualization";
import { motion,AnimatePresence}from "framer-motion";

function Visualization({ data, insights }) {
  const [chartType, setChartType] = useState("");
  const [xAxis, setXAxis] = useState("");
  const [yAxis, setYAxis] = useState("");
  const [colorTheme, setColorTheme] = useState("default");
  const [showLabels, setShowLabels] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(4000); // Animation duration
  const [loopAnimation, setLoopAnimation] = useState(true); // Loop the title animation
  const [currentTitleIndex, setCurrentTitleIndex] = useState(0);
  const [isVisualizationReady, setIsVisualizationReady] = useState(false); // Toggle to show visualization
  const [currentSummaryIndex, setCurrentSummaryIndex] = useState(0);

  const keyInsights = insights?.key_insights || [];

  // Automatically cycle through the titles in key insights
  useEffect(() => {
    if (loopAnimation && keyInsights.length > 1) {
      const interval = setInterval(() => {
        setCurrentTitleIndex((prevIndex) => (prevIndex + 1) % keyInsights.length);
      }, animationSpeed);
      return () => clearInterval(interval);
    }
  }, [loopAnimation, keyInsights.length, animationSpeed]);
  
  useEffect(() => {
    if (loopAnimation && insights?.summary?.length > 1) {
      const interval = setInterval(() => {
        setCurrentSummaryIndex((prevIndex) => (prevIndex + 1) % insights.summary.length);
      }, animationSpeed);
      return () => clearInterval(interval);
    }
  }, [loopAnimation, insights?.summary?.length, animationSpeed]);  
  

  const config = {
    x: xAxis,
    y: yAxis,
    chartType,
    colorTheme,
    showLabels,
    width: 600, // Increased width of visualization
    height: 400,
    animationDuration: animationSpeed,
  };

  const renderAnimatedTitle = () => {
    const title = keyInsights[currentTitleIndex]?.title || "No Title Available";
    
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`title-${currentTitleIndex}`} // Ensure a unique key
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
          className="text-blue-600 font-bold text-lg mb-4 text-center"
        >
          {title}
        </motion.div>
      </AnimatePresence>
    );
  };
  
  const renderAnimatedSummary = () => {
    const summaries = insights?.summary || [];
    const currentSummary = summaries[currentSummaryIndex]?.pointer || "No Summary Available";
  
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={`summary-${currentSummaryIndex}`}
          initial={{ opacity: 0, rotateX: 90 }} // Start flipped vertically
          animate={{ opacity: 1, rotateX: 0 }} // Flip into position
          exit={{ opacity: 0, rotateX: -90 }} // Flip out vertically
          transition={{
            duration: 2,
            ease: "easeInOut",
          }}
          className="text-gray-700 font-medium text-md mt-4 text-center"
        >
          {currentSummary}
        </motion.div>
      </AnimatePresence>
    );
  };

  const renderVisualization = () => (
    <div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        duration: animationSpeed / 1000,
        repeat: loopAnimation ? Infinity : 0,
        repeatType: "loop",
      }}
    >
      <RechartsVisualization data={data} config={config} />
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 flex">
      {/* Left container for options */}
      <div className="w-1/3 pr-4 border-r flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Create Visualization</h2>

        {insights?.visualization_suggestions?.[0] && (
          <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded">
            <h3 className="text-lg font-bold">Recommended by AI</h3>
            <p>
              <strong>Chart Type:</strong> {insights.visualization_suggestions[0].type}
            </p>
            <p>{insights.visualization_suggestions[0].reason}</p>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Chart Type:</label>
          <select
            value={chartType}
            onChange={(e) => setChartType(e.target.value)}
            className="w-full p-2 border rounded"
          >
            <option value="">Select Chart Type</option>
            <option value="bar">Bar Chart</option>
            <option value="line">Line Chart</option>
            <option value="pie">Pie Chart</option>
          </select>
        </div>

        {chartType && (
          <>
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">X-Axis:</label>
              <select
                value={xAxis}
                onChange={(e) => setXAxis(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select X-Axis</option>
                {Object.keys(data[0] || {}).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Y-Axis:</label>
              <select
                value={yAxis}
                onChange={(e) => setYAxis(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="">Select Y-Axis</option>
                {Object.keys(data[0] || {}).map((field) => (
                  <option key={field} value={field}>
                    {field}
                  </option>
                ))}
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">Color Theme:</label>
              <select
                value={colorTheme}
                onChange={(e) => setColorTheme(e.target.value)}
                className="w-full p-2 border rounded"
              >
                <option value="default">Default</option>
                <option value="modern">Modern</option>
                <option value="vintage">Vintage</option>
              </select>
            </div>

            <label className="block text-gray-700 font-medium mb-2">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
                className="mr-2"
              />
              Show Labels
            </label>

            <button
              onClick={() => setIsVisualizationReady(true)}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
            >
              Generate Visualization
            </button>
          </>
        )}
      </div>

      {/* Right container for visualization */}
      <div className="w-2/3 pl-9 flex flex-col">
        {isVisualizationReady ? (
          <div className="flex flex-col items-center">
            {renderAnimatedTitle()}
            {renderVisualization()}
            {renderAnimatedSummary()}
            
          </div>
        ) : (
          <p className="text-gray-500">Select options and click "Generate Visualization" to view the chart.</p>
        )}
      </div>
    </div>
  );
}

export default Visualization;
