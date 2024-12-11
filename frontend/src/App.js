import React, { useState } from "react";
import DataUpload from "./components/DataUpload";
import Insights from "./components/Insights";
import Visualization from "./components/Visualization";
import DataProfile from "./components/DataProfile";

function App() {
  const [uploadResponse, setUploadResponse] = useState(null);
  const [activeTab, setActiveTab] = useState("Visualization");

  const tabs = ["Visualization", "Insights", "Data Profile"];

  const renderTabContent = () => {
    if (!uploadResponse) {
      return (
        <div className="flex justify-center items-center h-full text-gray-500 text-lg">
          <p>Please upload data to start analyzing.</p>
        </div>
      );
    }

    switch (activeTab) {
      case "Visualization":
        return <Visualization data={uploadResponse.data} insights={uploadResponse.insights} />;
      case "Insights":
        return <Insights insights={uploadResponse.insights} />;
      case "Data Profile":
        return <DataProfile dataProfile={uploadResponse.dataProfile} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-blue-600 shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">📊 InfographX</h1>
        </div>
      </header>

      {/* Conditional Rendering */}
      {!uploadResponse ? (
        // Show Data Upload
        <main className="flex-1 p-6 bg-gray-50 flex justify-center items-center">
          <div className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full">
            <h2 className="text-2xl font-semibold text-center mb-4 text-gray-700">
              Upload Your Data
            </h2>
            <DataUpload onUploadComplete={setUploadResponse} />
          </div>
        </main>
      ) : (
        // Show Tabs and Main Content
        <>
          <nav className="sticky top-16 z-10 bg-white shadow-md">
            <div className="max-w-7xl mx-auto flex justify-center space-x-6 py-3">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 text-lg font-semibold rounded-md transition-all duration-200 ${
                    activeTab === tab
                      ? "bg-blue-600 text-white shadow-md"
                      : "text-gray-600 hover:text-blue-600 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </nav>
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-5xl mx-auto bg-white shadow-lg rounded-lg p-8">
              {renderTabContent()}
            </div>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
