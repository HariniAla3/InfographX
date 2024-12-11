import React from "react";

function Insights({ insights }) {
  if (!insights) return <p>No insights available. Please upload a file first.</p>;

  return (
    <div>
      <h2 className="text-xl font-bold text-gray-800 mb-4">Insights</h2>
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-blue-600">Key Insights</h3>
          <ul className="list-disc list-inside text-gray-700">
            {insights.key_insights?.map((insight, index) => (
              <li key={index}>
                <strong>{insight.title}:</strong> {insight.description} (Impact:
                {insight.importance})
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-blue-600">Trends</h3>
          <ul className="list-disc list-inside text-gray-700">
            {insights.trends?.map((trend, index) => (
              <li key={index}>
                <strong>Pattern:</strong> {trend.pattern} — {trend.explanation}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-blue-600">
            Visualization Suggestions
          </h3>
          <ul className="list-disc list-inside text-gray-700">
            {insights.visualization_suggestions?.map((viz, index) => (
              <li key={index}>
                <strong>Type:</strong> {viz.type} — {viz.reason}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Insights;
