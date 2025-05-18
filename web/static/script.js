document.getElementById('bias-form').addEventListener('submit', async function (e) {
  e.preventDefault();
  const topic = document.getElementById('topic-input').value;
  const errorDiv = document.getElementById('error-message');
  const summary = document.getElementById('summary');
  const cards = document.getElementById('bias-cards');
  const toneText = document.getElementById('overall-tone');
  const biasLabel = document.getElementById('bias-label');

  // Reset UI
  errorDiv.classList.add('hidden');
  summary.classList.add('hidden');
  cards.innerHTML = '';
  toneText.innerText = '';
  biasLabel.innerText = '';

  try {
    const res = await fetch('/analyze', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Server error');
    }

    const data = await res.json();
    summary.classList.remove('hidden');
    toneText.innerText = `Overall tone on "${data.topic}" is: ${data.overall_tone.toUpperCase()}`;

    // Clear previous cards
    cards.innerHTML = '';
    data.results.forEach(article => {
      const card = document.createElement('div');
      card.className = 'card';
      card.innerHTML = `
        <h3>${article.source}</h3>
        <p><strong>Tone:</strong> ${article.sentiment}</p>
        <p><strong>Bias Score:</strong> ${article.bias_score.toFixed(1)}</p>
      `;
      cards.appendChild(card);
    });

    // Calculate sentiment distribution
    let positive = 0, neutral = 0, negative = 0;
    data.results.forEach(article => {
      const sentiment = article.sentiment.toLowerCase();
      if (sentiment === 'positive') positive++;
      else if (sentiment === 'neutral') neutral++;
      else if (sentiment === 'negative') negative++;
    });

    // Destroy existing chart
    if (window.biasChart) {
      window.biasChart.destroy();
    }

    // Calculate percentages
    const total = positive + neutral + negative;
    const percentages = {
      positive: total ? (positive / total * 100).toFixed(1) : 0,
      neutral: total ? (neutral / total * 100).toFixed(1) : 0,
      negative: total ? (negative / total * 100).toFixed(1) : 0
    };

    // Create chart
    const ctx = document.getElementById("biasMeter").getContext("2d");

    // Register plugin once
    Chart.register(ChartDataLabels);

    window.biasChart = new Chart(ctx, {
      type: "pie",
      data: {
        labels: ['Positive', 'Neutral', 'Negative'],
        datasets: [{
          data: [positive, neutral, negative],
          backgroundColor: ['#e74c3c', '#aaa', '#3498db'],
          borderWidth: 0,
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: 'bottom',
            labels: {
              color: '#fff',
              font: {
                size: 14
              }
            }
          },
          tooltip: { enabled: false },
          datalabels: {
            color: '#fff',
            font: {
              size: 16,
              weight: 'bold'
            },
            formatter: (value, context) => {
              return `${percentages[context.chart.data.labels[context.dataIndex].toLowerCase()]}%`;
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    });

    // Update bias label
    const biasMap = { positive: 1, neutral: 0, negative: -1 };
    const biasValue = biasMap[data.overall_tone] ?? 0;
    biasLabel.textContent = `Overall Bias: ${data.overall_tone.toUpperCase()} (${biasValue})`;

  } catch (error) {
    console.error('Error:', error);
    errorDiv.textContent = error.message;
    errorDiv.classList.remove('hidden');
  }
});
