import pandas as pd
from ydata_profiling import ProfileReport

def generate_profile_report(df):
    """
    Generate a profile report for the given DataFrame.

    Parameters:
        df (pd.DataFrame): Input data

    Returns:
        str: HTML string of the profile report
    """
    try:
        if not isinstance(df, pd.DataFrame):
            raise ValueError("Input data must be a pandas DataFrame.")
        
        profile = ProfileReport(df, title="Data Profile Report", explorative=True)
        return profile.to_html()
    except Exception as e:
        raise RuntimeError(f"Error generating profile report: {e}")
