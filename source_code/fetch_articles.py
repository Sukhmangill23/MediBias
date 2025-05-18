import os
import requests
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()  # 👈 Add this line

API_KEY = os.getenv("NEWS_API_KEY")  # 👈 Changed from hardcoded value

def fetch_headlines(topic, page_size=10):
    url = (
        f"https://newsapi.org/v2/everything?q={topic}"
        f"&language=en&pageSize={page_size}&apiKey={API_KEY}"  # 👈 Now using env variable
    )
    response = requests.get(url)

    if response.status_code != 200:
        print("❌ Error fetching news:", response.json())
        return []

    data = response.json()
    articles = data.get("articles", [])

    return [
        {
            "source": article["source"]["name"],
            "title": article["title"],
            "publishedAt": article["publishedAt"]
        }
        for article in articles
        if article.get("title")
    ]
