import React, { useState, useEffect } from "react";
import { Composition } from "remotion"; // For Remotion integration
import RechartsVisualization  from "./RechartsVisualization";



function Visualization({ data, insights }) {
  const [chartType, setChartType] = useState(""); 
  const [xAxis, setXAxis] = useState(""); 
  const [yAxis, setYAxis] = useState(""); 
  const [colorTheme, setColorTheme] = useState("default");
  const [animationStyle, setAnimationStyle] = useState("default");
  const [showLabels, setShowLabels] = useState(true);
  const [replayKey, setReplayKey] = useState(0);
  const [xAxisOptions, setXAxisOptions] = useState([]);
  const [yAxisOptions, setYAxisOptions] = useState([]);

  const firstVisualizationSuggestion =
    insights?.visualization_suggestions?.[0] || null;

  useEffect(() => {
    if (!chartType || !data || data.length === 0) return;

    const numericFields = Object.keys(data[0]).filter((field) =>
      data.every((row) => typeof row[field] === "number")
    );

    const categoricalFields = Object.keys(data[0]).filter((field) =>
      data.every((row) => typeof row[field] === "string")
    );

    if (chartType === "bar" || chartType === "line") {
      setXAxisOptions(categoricalFields);
      setYAxisOptions(numericFields);
    } else if (chartType === "pie") {
      setXAxisOptions(categoricalFields);
      setYAxisOptions(numericFields);
    }
  }, [chartType, data]);

  useEffect(() => {
    setReplayKey((prevKey) => prevKey + 1);
  }, [colorTheme, animationStyle]);

  const config = {
    x: xAxis,
    y: yAxis,
    chartType,
    colorTheme,
    animationStyle,
    showLabels,
    width: 800,
    height: 400,
  };

  const handleReplayAnimation = () => {
    setReplayKey((prevKey) => prevKey + 1);
  };

  const renderVisualization = () => {
    // if (chartType === "3d") {
    //   return <ThreeDVisualization />;
    // }
    return (
      <RechartsVisualization
        key={replayKey}
        data={data}
        config={config}
      />
    );
  };

  return (
    <div className="p-6 bg-gray-50">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Create Visualization</h2>

      {firstVisualizationSuggestion && (
        <div className="mb-6 p-4 bg-blue-100 border-l-4 border-blue-500 rounded">
          <h3 className="text-lg font-bold">Recommended by AI</h3>
          <p>
            <strong>Chart Type:</strong> {firstVisualizationSuggestion.type}
          </p>
          <p>{firstVisualizationSuggestion.reason}</p>
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
              {xAxisOptions.map((field) => (
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
              {yAxisOptions.map((field) => (
                <option key={field} value={field}>
                  {field}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {chartType && chartType !== "3d" && (
        <>
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Animation Style:</label>
            <select
              value={animationStyle}
              onChange={(e) => setAnimationStyle(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="default">Default</option>
              <option value="bounce">Bounce</option>
              <option value="ease-in-out">Ease In-Out</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">
              <input
                type="checkbox"
                checked={showLabels}
                onChange={() => setShowLabels(!showLabels)}
                className="mr-2"
              />
              Show Labels
            </label>
          </div>

          <div className="flex space-x-4 mb-4">
            <button
              onClick={handleReplayAnimation}
              className="bg-purple-600 text-white px-4 py-2 rounded shadow hover:bg-purple-700 flex items-center"
            >
              Replay Animation
            </button>
          </div>
        </>
      )}

      {chartType && xAxis && yAxis ? (
        <div className="mt-6 bg-white rounded-lg shadow-md p-4">
          <RechartsVisualization 
            key={replayKey}
            data={data} 
            config={config} 
          />
        </div>
      ) : (
        <p className="text-gray-500">Please select chart type, X-axis, and Y-axis to display the visualization.</p>
      )}

      <Composition
        id="RechartsVisualization"
        component={RechartsVisualization}
        durationInFrames={150}
        fps={30}
        width={800}
        height={400}
        defaultProps={{ data, config }}
      />
    </div>
  );
}

export default Visualization;