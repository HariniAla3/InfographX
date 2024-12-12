import requests
from flask import current_app

# Shotstack API configuration
SHOTSTACK_API_URL = "https://api.shotstack.io/edit/stage/render"
SHOTSTACK_API_KEY = "QKgU3xromXsiSd5vIarr54MKAGDGRVv3QsFLIpke"  # Replace with your Shotstack API key


def create_video_with_shotstack(insights, visualizations):
    """
    Create a video using the Shotstack API based on provided insights and visualizations.

    Parameters:
        insights (dict): A dictionary containing 'key_insights' and 'trends'.
        visualizations (list): A list of URLs to visualization images (e.g., exported D3 charts).

    Returns:
        dict: The response from the Shotstack API.
    """
    try:
        clips = []
        current_time = 0

        # Add key insights as title clips
        for insight in insights.get("key_insights", []):
            clips.append({
                "asset": {
                    "type": "title",
                    "text": f"{insight['title']}\n\n{insight['description']}",
                    "style": "minimal"
                },
                "start": current_time,
                "length": 5
            })
            current_time += 5

        # Add trends as title clips
        for trend in insights.get("trends", []):
            clips.append({
                "asset": {
                    "type": "title",
                    "text": f"Trend: {trend['pattern']}\n\n{trend['explanation']}",
                    "style": "minimal"
                },
                "start": current_time,
                "length": 5
            })
            current_time += 5

        # Add visualization image clips
        for visualization_url in visualizations:
            clips.append({
                "asset": {
                    "type": "image",
                    "src": visualization_url
                },
                "start": current_time,
                "length": 5
            })
            current_time += 5

        # Prepare Shotstack payload
        payload = {
            "timeline": {
                "tracks": [
                    {
                        "clips": clips
                    }
                ]
            },
            "output": {
                "format": "mp4",
                "resolution": "hd"
            }
        }

        # Make a POST request to the Shotstack API
        headers = {
            "x-api-key": SHOTSTACK_API_KEY,
            "Content-Type": "application/json"
        }
        response = requests.post(SHOTSTACK_API_URL, json=payload, headers=headers)

        if response.status_code == 200:
            return response.json()
        else:
            error_message = response.json().get("message", "An error occurred.")
            current_app.logger.error(f"Shotstack API Error: {error_message}")
            return {"error": error_message}

    except Exception as e:
        current_app.logger.error(f"Error interacting with Shotstack API: {e}")
        return {"error": f"Unexpected error: {str(e)}"}
