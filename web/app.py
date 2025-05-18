import sys
from pathlib import Path

from flask import Flask, render_template, request, jsonify

source_path = Path(__file__).resolve().parent.parent / "source_code"
sys.path.insert(0, str(source_path))

from sentiment_analysis import analyze_headlines

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')
@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        if not data or 'topic' not in data:
            return jsonify({'error': 'No topic provided.'}), 400

        topic = data['topic'].strip()
        if not topic:
            return jsonify({'error': 'Topic is empty.'}), 400

        df = analyze_headlines(topic)

        if df is None or df.empty:
            return jsonify({'error': f'No headlines found for "{topic}".'}), 404

        results = df[["source", "title", "sentiment", "bias_score", "compound"]].to_dict(orient='records')
        overall_avg = df["compound"].mean()

        tone = (
            "positive" if overall_avg >= 0.05
            else "negative" if overall_avg <= -0.05
            else "neutral"
        )

        return jsonify({
            'topic': topic,
            'overall_tone': tone,
            'results': results
        })

    except Exception as e:
        return jsonify({'error': f'Something went wrong: {str(e)}'}), 500


if __name__ == '__main__':
    app.run(debug=True)
