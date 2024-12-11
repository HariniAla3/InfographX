import json
import os
import subprocess
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
from services.groq_service import init_groq_client 
from services.profiling_service import generate_profile_report
from services.insights_service import generate_insights
# from services.shotstack_service import create_video_with_shotstack
from services.text_processing import process_text_to_csv

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app)

groq_client = init_groq_client()

@app.route('/')
def home():
    return jsonify({"message": "Welcome to the API!"})

@app.route('/api/upload', methods=['POST'])
def upload_data():
    text_input = request.form.get('text')
    uploaded_file = request.files.get('file')

    if not text_input and 'file' not in request.files:
        return jsonify({"error": "No input provided."}), 400

    try:
        data = None
        insights = None
        data_profile_html = None

        if uploaded_file:
            print("File received:", uploaded_file.filename)
            # Process the uploaded file into a DataFrame
            data = pd.read_csv(uploaded_file)

            # Validate if the DataFrame is empty
            if data.empty:
                return jsonify({"error": "Uploaded file is empty"}), 400

        if text_input:
            print("Text received:", text_input)
            # Process text input to generate CSV
            csv_data = process_text_to_csv(text_input)
            data = pd.DataFrame(csv_data)  # Convert processed text to DataFrame

        if data is not None:
            # Generate insights using the DataFrame
            insights = generate_insights(data)

            # Generate data profile report
            data_profile_html = generate_profile_report(data)

        # Return the response
        return jsonify({
            "data": data.to_dict(orient='records') if data is not None else None,
            "columns": list(data.columns) if data is not None else [],
            "insights": insights,
            "dataProfile": data_profile_html  # Include the data profile HTML
        })
    except Exception as e:
        app.logger.error(f"Error processing input: {e}")
        return jsonify({"error": str(e)}), 500


@app.route('/api/generate-insights', methods=['POST'])
def get_insights():
    try:
        # Parse input data
        data = request.json.get('data')
        if not data:
            return jsonify({"error": "No data provided in the request"}), 400

        # Convert data to a DataFrame
        df = pd.DataFrame(data)
        if df.empty:
            return jsonify({"error": "Provided data is empty"}), 400

        # Generate insights
        insights = generate_insights( df)

        # Return insights as JSON
        return jsonify(insights)

    except Exception as e:
        # current_app.logger.error(f"Error generating insights: {e}")
        return jsonify({"error": f"Error generating insights: {str(e)}"}), 500

# @app.route('/api/create-video', methods=['POST'])
# def create_video():
#     """
#     API endpoint to create a video using the Shotstack API.
#     """
#     try:
#         # Get insights and visualizations from the request payload
#         insights = request.json.get('insights', {})
#         visualizations = request.json.get('visualizations', [])

#         if not insights and not visualizations:
#             return jsonify({"error": "Insights or visualizations are required."}), 400

#         # Call the Shotstack service to create the video
#         response = create_video_with_shotstack(insights, visualizations)

#         # Return the response to the client
#         return jsonify(response)

#     except Exception as e:
#         app.logger.error(f"Error creating video: {e}")
#         return jsonify({"error": str(e)}), 500

# Paths for temporary files
# FRAMES_DIR = "frames"
# OUTPUT_FILE = "static/animation.mp4"

# @app.route('/export', methods=['POST'])
# def export_video():
#     try:
#         # Get visualization data from the frontend
#         data = request.json.get('data')
#         if not data:
#             return jsonify({'error': 'No data provided'}), 400

#         # Serialize data as a JSON string for Puppeteer
#         serialized_data = json.dumps(data)

#         # Run Puppeteer script to capture frames
#         subprocess.run(
#             ["node", "capture-frames.js", f"--data={serialized_data}"], check=True
#         )

#         # Generate video from frames using FFMPEG
#         subprocess.run(
#             ["ffmpeg", "-framerate", "30", "-i", "frames/frame-%03d.png", "-c:v", "libx264", "-pix_fmt", "yuv420p", "static/animation.mp4"], check=True
#         )

#         # Cleanup frames directory
#         for file in os.listdir("frames"):
#             os.remove(os.path.join("frames", file))

#         return send_file("static/animation.mp4", as_attachment=True)

#     except Exception as e:
#         return jsonify({'error': str(e)}), 500
    
if __name__ == '__main__':
    app.run(debug=True)
