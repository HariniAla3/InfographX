import pandas as pd
import json
from flask import current_app
from services.groq_service import get_groq_client


def generate_insights(df):
    """
    Generate insights for the given DataFrame using the Groq API.
    
    Parameters:
        df (DataFrame): DataFrame containing the uploaded data.
    
    Returns:
        dict: Insights response as JSON or None if an error occurs.
    """
    try:
        # Validate the DataFrame
        if not isinstance(df, pd.DataFrame):
            raise ValueError("Invalid dataset provided. Expected a pandas DataFrame.")
        
        # Prepare the prompt for Groq API
        prompt = f"""
        Analyze this dataset and provide insights in JSON format:
        Columns: {list(df.columns)}
        First 5 Rows: {df.head().to_dict(orient='records')}
        
        Respond strictly in this JSON format:
        {{
            "key_insights": [
                {{
                    "title": "Main observation",
                    "description": "Detailed explanation",
                    "importance": "Business impact"
                }}
            ],
            "trends": [
                {{
                    "pattern": "Identified pattern",
                    "explanation": "Pattern meaning"
                }}
            ],
            "visualization_suggestions": [
                {{
                    "type": "Visualization type",
                    "reason": "Why this visualization works"
                }}
            ]
        }}
        """
        
        # Retrieve the Groq client
        client = get_groq_client()

        # Call the Groq API
        response = client.chat.completions.create(
            model="mixtral-8x7b-32768",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2
        )
        
        # Extract the content of the response
        response_content = response.choices[0].message.content
        
        # Parse and return the response
        return clean_and_parse_json(response_content)

    except ValueError as ve:
        current_app.logger.error(f"Validation error: {ve}")
        return {"error": str(ve)}

    except json.JSONDecodeError as je:
        current_app.logger.error(f"JSON decoding error: {je}")
        return {"error": str(je)}

    except Exception as e:
        current_app.logger.error(f"Error interacting with Groq API: {e}")
        return {"error": f"Unexpected error: {str(e)}"}

def clean_and_parse_json(response_content):
    """
    Clean and parse a JSON response from the Groq API.

    Parameters:
        response_content (str): The raw string from the API response.

    Returns:
        dict: Parsed JSON object.
    """
    try:
        # Attempt to parse the JSON response
        insights = json.loads(response_content)

        # Validate and structure the insights
        return {
            "key_insights": insights.get("key_insights", []),
            "trends": insights.get("trends", []),
            "visualization_suggestions": insights.get("visualization_suggestions", [])
        }
    except json.JSONDecodeError as e:
        raise ValueError(f"Error decoding JSON response: {e}")
