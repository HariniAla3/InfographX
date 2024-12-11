import pandas as pd
import json
from flask import current_app
from services.groq_service import get_groq_client

def process_text_to_csv(text):
    """
    Process the input text to generate a DataFrame in CSV format using the Groq API.

    Parameters:
        text (str): Input text to be processed.

    Returns:
        list[dict]: A list of dictionaries representing the rows of the generated CSV.
    """
    try:
        # Prepare the prompt for Groq API
        prompt = f"""
        You are an AI assistant. Analyze the following text to extract structured data.
        Identify column names and corresponding rows of data.

        Input text:
        "{text}"

        Respond strictly in this JSON format:
        {{
            "columns": ["Column1", "Column2", ...],
            "data": [
                ["Row1Col1", "Row1Col2", ...],
                ["Row2Col1", "Row2Col2", ...],
                ...
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
        print("Response:",response_content)

        # Parse and return the CSV data
        return clean_and_parse_csv(response_content)
        # return response_content

    except ValueError as ve:
        current_app.logger.error(f"Validation error: {ve}")
        raise RuntimeError(f"Validation error: {str(ve)}")

    except json.JSONDecodeError as je:
        current_app.logger.error(f"JSON decoding error: {je}")
        raise RuntimeError(f"JSON decoding error: {str(je)}")

    except Exception as e:
        current_app.logger.error(f"Error interacting with Groq API: {e}")
        raise RuntimeError(f"Unexpected error: {str(e)}")

def clean_and_parse_csv(response_content):
    """
    Clean and parse a CSV response from the Groq API.

    Parameters:
        response_content (str): The raw string from the API response.

    Returns:
        list[dict]: Parsed CSV as a list of dictionaries.
    """
    try:
        # Parse the JSON response
        csv_data = json.loads(response_content)

        # Ensure the response has the expected structure
        if not isinstance(csv_data, dict) or "columns" not in csv_data or "data" not in csv_data:
            raise ValueError("Invalid CSV format received from API.")

        # Convert to list of dictionaries
        columns = csv_data["columns"]
        data = csv_data["data"]

        # Ensure data is a list of lists
        if not all(isinstance(row, list) for row in data):
            raise ValueError("Invalid data format in CSV response.")

        return [dict(zip(columns, row)) for row in data]
    except json.JSONDecodeError as e:
        raise ValueError(f"Error decoding CSV response: {e}")
