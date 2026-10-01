import pandas as pd
import re

def clean_text(text):
    if not isinstance(text, str):
        return ""
    text = str(text)
    # Convert to lowercase
    text = text.lower()
    # Normalize whitespace
    text = re.sub(r'\s+', ' ', text).strip()
    return text

def preprocess_dataframe(df: pd.DataFrame, text_col='text', label_col='label'):
    # Drop rows with missing text
    df = df.dropna(subset=[text_col, label_col])
    # Drop duplicates
    df = df.drop_duplicates()
    # Clean text
    df['cleaned_text'] = df[text_col].apply(clean_text)
    # Remove empty text
    df = df[df['cleaned_text'] != ""]
    return df
