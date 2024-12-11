import React, { useState } from "react";
import { uploadData } from "../services/apiService";

function DataUpload({ onUploadComplete }) {
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(""); // Track upload status
  const [textInput, setTextInput] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(""); // Reset status message

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadData(formData);
      onUploadComplete(response); // Pass the API response to parent component
      setUploadStatus("Uploaded successfully!"); // Show success message
    } catch (error) {
      console.error("File upload failed:", error);
      setUploadStatus("Upload failed. Please try again."); // Show failure message
    } finally {
      setUploading(false);
    }
  };

  const handleTextSubmit = async () => {
    if (!textInput.trim()) {
      setUploadStatus("Text input is empty. Please provide some text.");
      return;
    }

    setUploading(true);
    setUploadStatus(""); // Reset status message

    try {
      const formData = new FormData();
      formData.append("text", textInput);

      const response = await uploadData(formData);
      onUploadComplete(response); // Pass the API response to parent component
      setUploadStatus("Text processed successfully!"); // Show success message
    } catch (error) {
      console.error("Text upload failed:", error);
      setUploadStatus("Text processing failed. Please try again."); // Show failure message
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Upload Button */}
      <label className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow cursor-pointer hover:bg-blue-700">
        {uploading ? (
          <div className="flex items-center space-x-2">
            <span className="loader w-4 h-4 border-2 border-t-2 border-white rounded-full animate-spin"></span>
            <span>Uploading...</span>
          </div>
        ) : (
          "Upload Data File"
        )}
        <input
          type="file"
          accept=".csv"
          onChange={handleFileUpload}
          className="hidden"
        />
      </label>

      <div className="mt-4 w-full max-w-md">
        <textarea
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Enter text to process"
          className="w-full border rounded p-2"
          rows="5"
        ></textarea>
        <button
          onClick={handleTextSubmit}
          className="mt-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700"
          disabled={uploading}
        >
          {uploading ? "Processing..." : "Submit Text"}
        </button>
      </div>

      {/* Status Message */}
      {uploadStatus && (
        <p
          className={`mt-4 text-sm font-medium ${
            uploadStatus.includes("successfully")
              ? "text-green-600"
              : "text-red-600"
          }`}
        >
          {uploadStatus}
        </p>
      )}
    </div>
  );
}

export default DataUpload;
