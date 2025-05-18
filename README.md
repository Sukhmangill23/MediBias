
# News Mood Meter – Track Media Sentiment in Real Time

Ever wondered how different news outlets feel about a trending topic? This tool analyzes headlines from multiple sources to give you a snapshot of media sentiment. Whether you're a journalist, researcher, or just curious about media bias, this app helps you stay informed.

### What You'll Need
- Python 3.8 or higher
- A free [NewsAPI key](https://newsapi.org/register)
- Basic comfort with the terminal

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/news-mood-meter.git
   cd news-mood-meter


2. **Install dependencies**

   ```bash
   pip install -r requirements.txt
   ```

3. **Add your API key**
   Create a `.env` file in the root directory:

   ```bash
   echo "NEWS_API_KEY='your-api-key-here'" > .env
   ```

4. **Run the app**
   Navigate to the `web` folder:

   ```bash
   flask run
   ```

   Then visit `http://localhost:5000` in your browser.

---

## Features

* **Real-time Sentiment Analysis**
  Instantly see how the media is framing a topic.

* **Bias Indicator**
  Detect potential slant or lean in headlines.

* **Trend Comparison**
  Compare sentiment over time to spot shifts in tone.

* **Export Results**
  Download data in CSV or JSON format for deeper analysis.

---

## How It Works (Simple Version)

1. **Fetch**: Grabs headlines from over 50 news outlets.
2. **Analyze**: Runs sentiment scoring and bias detection.
3. **Display**: Presents it all in a clear, interactive interface.

---

## Tech Stack

* Flask – For the web framework
* NewsAPI – To gather current headlines
* NLTK – For sentiment analysis
* Pandas – To process and format the data

---

## Contributing

Got an idea? Found a bug? Want to redesign the interface?
Contributions are welcome. Check out the [contributing guide](CONTRIBUTING.md) for details.

---


