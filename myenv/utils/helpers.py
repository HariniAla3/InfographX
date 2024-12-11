import json

def clean_and_parse_json(response_content):
    """
    Clean and parse a JSON response.

    Parameters:
        response_content (str): The raw string from the API response.

    Returns:
        dict: Parsed JSON object.
    """
    try:
        # Identify the JSON block by locating the first '{' and last '}'
        start_idx = response_content.find("{")
        end_idx = response_content.rfind("}")
        if start_idx == -1 or end_idx == -1:
            raise ValueError("No JSON object found in the response content.")

        json_str = response_content[start_idx:end_idx + 1]
        return json.loads(json_str)
    except json.JSONDecodeError as e:
        raise ValueError(f"JSON decoding failed: {e}")

def format_error_message(exception):
    """
    Format a consistent error message for logging or debugging.

    Parameters:
        exception (Exception): The exception to format.

    Returns:
        str: Formatted error message.
    """
    return f"Error: {str(exception)}"

def validate_dataframe(df, required_columns=None):
    """
    Validate a pandas DataFrame.

    Parameters:
        df (pd.DataFrame): The DataFrame to validate.
        required_columns (list, optional): List of required columns. Default is None.

    Returns:
        bool: True if valid, raises ValueError otherwise.
    """
    if df is None or df.empty:
        raise ValueError("The provided DataFrame is empty or None.")

    if required_columns:
        missing_columns = [col for col in required_columns if col not in df.columns]
        if missing_columns:
            raise ValueError(f"Missing required columns: {missing_columns}")

    return True
