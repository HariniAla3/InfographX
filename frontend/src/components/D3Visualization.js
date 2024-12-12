import React, { useState, useEffect, useRef } from "react";
import * as d3 from "d3";
import { saveAs } from 'file-saver';

const D3Visualization = ({ data, config }) => {
  const svgRef = useRef();
  const canvasRef = useRef(document.createElement('canvas'));
  const [isRecording, setIsRecording] = useState(false);
  const [recorder, setRecorder] = useState(null);
  const recordingIntervalRef = useRef(null);
  const animationDurationRef = useRef(0);
  

  const renderChart = () => {
    // Clear previous visualizations
    d3.select(svgRef.current).selectAll("*").remove();

    const { x, y, chartType, colorTheme, animationStyle, showLabels, width, height } = config;
    const margin = { top: 20, right: 30, bottom: 30, left: 40 };

    const parsedData = data.map((d) => ({
      ...d,
      [y]: +d[y], // Convert Y values to numbers if necessary
    }));

    const svg = d3
      .select(svgRef.current)
      .attr("width", width || 800)
      .attr("height", height || 400)
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Define color themes
    const colorSchemes = {
      default: d3.schemeCategory10,
      modern: d3.schemeSet2,
      vintage: d3.schemePastel1,
    };

    const color = d3.scaleOrdinal(colorSchemes[colorTheme]);

    // Determine animation duration based on chart type and style
    const animationDuration = chartType === "bar" 
      ? (animationStyle === "bounce" ? 1000 : 800)
      : (animationStyle === "bounce" ? 1200 : 800);
    
    animationDurationRef.current = animationDuration;

    if (chartType === "bar") {
      // Bar Chart Implementation
      const xScale = d3
        .scaleBand()
        .domain(parsedData.map((d) => d[x]))
        .range([0, width - margin.left - margin.right])
        .padding(0.1);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(parsedData, (d) => d[y])])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      svg.append("g").call(d3.axisLeft(yScale));

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      svg
        .selectAll(".bar")
        .data(parsedData)
        .join("rect")
        .attr("x", (d) => xScale(d[x]))
        .attr("y", height - margin.top - margin.bottom) // Start from bottom
        .attr("width", xScale.bandwidth())
        .attr("height", 0) // Start with height 0
        .attr("fill", (d, i) => color(i))
        .transition()
        .duration(animationDuration)
        .ease(animationStyle === "ease-in-out" ? d3.easeCubicInOut : d3.easeLinear)
        .attr("y", (d) => yScale(d[y]))
        .attr("height", (d) => height - margin.top - margin.bottom - yScale(d[y]));

    } else if (chartType === "line") {
      // Line Chart Implementation
      const xScale = d3
        .scalePoint()
        .domain(parsedData.map((d) => d[x]))
        .range([0, width - margin.left - margin.right]);

      const yScale = d3
        .scaleLinear()
        .domain([0, d3.max(parsedData, (d) => d[y])])
        .nice()
        .range([height - margin.top - margin.bottom, 0]);

      svg.append("g").call(d3.axisLeft(yScale));

      svg
        .append("g")
        .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
        .call(d3.axisBottom(xScale));

      const line = d3
        .line()
        .x((d) => xScale(d[x]))
        .y((d) => yScale(d[y]));

      const path = svg
        .append("path")
        .datum(parsedData)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 2)
        .attr("d", line);

      // Animate the line drawing
      const totalLength = path.node().getTotalLength();
      path
        .attr("stroke-dasharray", `${totalLength} ${totalLength}`)
        .attr("stroke-dashoffset", totalLength)
        .transition()
        .duration(animationDuration)
        .ease(animationStyle === "ease-in-out" ? d3.easeCubicInOut : d3.easeLinear)
        .attr("stroke-dashoffset", 0);

    } else if (chartType === "pie") {
      // Pie Chart Implementation
      const radius = Math.min(width, height) / 2 - margin.top;

      const pie = d3.pie().value((d) => d[y]);

      const arc = d3
        .arc()
        .innerRadius(0)
        .outerRadius(radius);

      const pieGroup = svg
        .append("g")
        .attr("transform", `translate(${width / 2}, ${height / 2})`);

      pieGroup
        .selectAll("path")
        .data(pie(parsedData))
        .join("path")
        .attr("fill", (d, i) => color(i))
        .each(function (d) {
          this._current = { startAngle: 0, endAngle: 0 }; // Start with empty angles
        })
        .transition()
        .duration(animationDuration)
        .ease(animationStyle === "ease-in-out" ? d3.easeCubicInOut : d3.easeLinear)
        .attrTween("d", function (d) {
          const interpolate = d3.interpolate(this._current, d);
          this._current = interpolate(1);
          return function (t) {
            return arc(interpolate(t));
          };
        });

      // Add labels if enabled
      if (showLabels) {
        pieGroup
          .selectAll("text")
          .data(pie(parsedData))
          .join("text")
          .attr("transform", (d) => `translate(${arc.centroid(d)})`)
          .attr("text-anchor", "middle")
          .attr("font-size", "12px")
          .text((d) => `${d.data[x]} (${d.data[y]})`);
      }
    }
  };

  const startVideoRecording = () => {
    const svg = svgRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas dimensions to match SVG
    canvas.width = svg.width.baseVal.value;
    canvas.height = svg.height.baseVal.value;

    // Prepare stream
    const stream = canvas.captureStream(30);
    const mediaRecorder = new MediaRecorder(stream, {
      mimeType: 'video/webm',
      videoBitsPerSecond: 2500000 // High quality
    });

    const chunks = [];
    mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      saveAs(blob, 'chart-animation.webm');
      setIsRecording(false);
    };

    // Start recording
    mediaRecorder.start();
    setRecorder(mediaRecorder);
    setIsRecording(true);

    // Function to capture frames
    const captureFrames = () => {
      // Draw SVG to canvas
      const svgString = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    };

    // Start capturing frames at 30 FPS
    recordingIntervalRef.current = setInterval(captureFrames, 1000 / 30);
  };

  const stopVideoRecording = () => {
    if (recorder) {
      // Stop the frame capturing interval
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
      }
      
      // Stop the media recorder
      recorder.stop();
    }
  };

  useEffect(() => {
    if (config.x && config.y && config.chartType) {
      renderChart();
    }
  }, [data, config,renderChart]);

  return (
    <div>
      <svg ref={svgRef}></svg>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
      <div className="mt-4 flex space-x-2">
        <button
          onClick={startVideoRecording}
          disabled={isRecording}
          className={`px-4 py-2 rounded ${
            isRecording 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 text-white hover:bg-green-600'
          }`}
        >
          {isRecording ? 'Recording...' : 'Record Video'}
        </button>
        {isRecording && (
          <button
            onClick={stopVideoRecording}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Stop Recording
          </button>
        )}
      </div>
    </div>
  );
};

export default D3Visualization;