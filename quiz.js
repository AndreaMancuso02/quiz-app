let currentQuiz = [];
let index = 0;
let score = 0;
let userAnswers = [];

window.onload = async () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  
  try {
    const response = await fetch('domande.json');
    const allQuizzes = await response.json();

    if (cat && allQuizzes[cat]) {
      document.getElementById("category-title").innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
      startQuiz(allQuizzes[cat]);
    } else if (window.location.pathname.includes("quiz.html")) {
      window.location.href = "index.html";
    }
  } catch (error) {
    console.error("Errore nel caricamento del file JSON:", error);
  }
};

function startQuiz(questionsArray) {
  // Mischia e seleziona esattamente 10 domande casuali dal database
  currentQuiz = [...questionsArray].sort(() => Math.random() - 0.5).slice(0, 10);
  index = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz[index];
  document.getElementById("question").innerText = `Domanda ${index + 1}: ${q.q}`;
  
  const progress = (index / currentQuiz.length) * 100;
  document.getElementById("progress").style.width = `${progress}%`;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  const shuffledAnswers = q.a.map((text, i) => ({ 
    text, 
    isCorrect: i === q.correct 
  })).sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.innerText = ans.text;
    btn.onclick = () => handleAnswer(ans, btn, shuffledAnswers);
    answersDiv.appendChild(btn);
  });
}

function handleAnswer(selectedObj, button, allOptions) {
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(b => b.disabled = true);

  if (selectedObj.isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    buttons.forEach((b, i) => {
      if (allOptions[i].isCorrect) b.classList.add("correct");
    });
  }

  userAnswers.push({
    question: currentQuiz[index].q,
    selected: selectedObj.text,
    correct: allOptions.find(a => a.isCorrect).text,
    isRight: selectedObj.isCorrect
  });

  setTimeout(() => {
    index++;
    index < currentQuiz.length ? showQuestion() : showSummary();
  }, 1000);
}

function showSummary() {
  const container = document.querySelector(".container");
  container.innerHTML = `
    <h2>📊 Risultato finale</h2>
    <p class="final-score">${score} / ${currentQuiz.length}</p>
    <div class="summary">
      ${userAnswers.map((item, i) => `
        <div class="summary-item">
          <strong>${i + 1}. ${item.question}</strong><br>
          <span class="${item.isRight ? 'text-correct' : 'text-wrong'}">
            Tua: ${item.selected} ${item.isRight ? '✅' : '❌'}
          </span>
          ${!item.isRight ? `<br><small>Corretta: ${item.correct}</small>` : ''}
        </div>
      `).join("")}
    </div>
    <div style="margin-top:20px; display:flex; flex-direction:column; gap:10px;">
        <button onclick="location.reload()" class="category" style="border:none; cursor:pointer;">🔄 Riprova (Nuove domande)</button>
        <a class="back-home" href="index.html">⬅ Torna alla Home</a>
    </div>
  `;
}