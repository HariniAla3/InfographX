import React from "react";
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
} from "recharts";
import { Composition } from "remotion";
import { Canvas } from "@react-three/fiber";
import { Box, OrbitControls } from "@react-three/drei";

const RechartsVisualization = ({ data, config }) => {
  const { x, y, chartType, colorTheme, showLabels, width, height } = config;

  // Define color themes
  const colorSchemes = {
    default: ["#8884d8", "#82ca9d", "#ffc658"],
    modern: ["#6b5b95", "#feb236", "#d64161"],
    vintage: ["#ff6f61", "#6b5b95", "#88b04b"],
  };

  const colors = colorSchemes[colorTheme] || colorSchemes.default;

  if (chartType === "bar") {
    return (
      <BarChart
        width={width || 800}
        height={height || 400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={x} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey={y} fill={colors[0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    );
  } else if (chartType === "line") {
    return (
      <LineChart
        width={width || 800}
        height={height || 400}
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey={x} />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey={y} stroke={colors[0]} />
      </LineChart>
    );
  } else if (chartType === "pie") {
    return (
      <PieChart width={width || 800} height={height || 400}>
        <Pie
          data={data}
          dataKey={y}
          nameKey={x}
          cx="50%"
          cy="50%"
          outerRadius={150}
          label={showLabels}
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  } else {
    return <p>Unsupported chart type</p>;
  }
};

const RechartsVisualizationWithVideo = ({ data, config }) => (
  <Composition
    id="VisualizationVideo"
    component={() => <RechartsVisualization data={data} config={config} />}
    durationInFrames={150}
    fps={30}
    width={config.width || 800}
    height={config.height || 400}
  />
);

// const ThreeDVisualization = ({ config = {} }) => {
//   const { width = 800, height = 400 } = config;

//   return (
//     <Canvas
//       style={{ width, height }}
//       camera={{ position: [0, 0, 5], fov: 75 }}
//     >
//       <ambientLight intensity={0.5} />
//       <directionalLight position={[0, 5, 5]} intensity={1} />
//       <mesh>
//         <Box args={[1, 1, 1]} /> {/* Render a 3D box */}
//         <meshStandardMaterial attach="material" color="orange" />
//       </mesh>
//       <OrbitControls /> {/* Allow interactive controls */}
//     </Canvas>
//   );
// };

export { RechartsVisualization, RechartsVisualizationWithVideo };
