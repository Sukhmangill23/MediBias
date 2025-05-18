import pandas as pd
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from fetch_articles import fetch_headlines


def analyze_headlines(topic):
    analyzer = SentimentIntensityAnalyzer()
    raw_articles = fetch_headlines(topic)
    if not raw_articles:
        return None

    df = pd.DataFrame(raw_articles)

    # Get compound sentiment
    df["compound"] = df["title"].apply(
        lambda x: analyzer.polarity_scores(x)["compound"])



    # Label sentiment
    def classify(score):
        if score >= 0.05:
            return "positive"
        elif score <= -0.05:
            return "negative"
        else:
            return "neutral"

    df["sentiment"] = df["compound"].apply(classify)

    # Convert date string to datetime
    df["publishedAt"] = pd.to_datetime(df["publishedAt"], errors='coerce')

    # Calculate "Bias Score" = abs(compound) × 100
    df["bias_score"] = df["compound"].abs() * 100

    return df
