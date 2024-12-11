import os
from groq import Groq
from flask import g

def init_groq_client():
    """
    Initialize the Groq client using an environment variable for the API key.

    Returns:
        Groq: An initialized Groq client object if successful.
    """
    try:
        # Fetch the API key from the environment variable
        GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
        if not GROQ_API_KEY:
            raise ValueError("API key not found in environment variables. Ensure 'GROQ_API_KEY' is set.")
        
        # Initialize the Groq client
        return Groq(api_key=GROQ_API_KEY)
    except Exception as e:
        raise RuntimeError(f"Error initializing Groq client: {e}")

def get_groq_client():
    """
    Retrieve the Groq client for the current Flask application context.
    Initializes the client if it doesn't already exist.
    """
    if "groq_client" not in g:
        g.groq_client = init_groq_client()
    return g.groq_client
