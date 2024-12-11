import React from "react";

function DataProfile({ dataProfile }) {
  if (!dataProfile) return <p>Data profile is not available. Please upload a file.</p>;

  return (
    <div>
      <h2>Data Profile</h2>
      <iframe
        srcDoc={dataProfile}
        title="Data Profile Report"
        className="w-full h-screen border rounded-lg"
      ></iframe>
    </div>
  );
}

export default DataProfile;
