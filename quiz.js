let currentQuiz = [];
let index = 0;
let score = 0;
let userAnswers = [];
let timer;
let timeLeft;

// Funzioni per i suoni (opzionale: caricano file mp3 se presenti)
const soundCorrect = new Audio('https://assets.mixkit.co/active_storage/sfx/2000/2000-preview.mp3');
const soundWrong = new Audio('https://assets.mixkit.co/active_storage/sfx/2019/2019-preview.mp3');

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
    console.error("Errore:", error);
  }
};

function startQuiz(questionsArray) {
  currentQuiz = [...questionsArray].sort(() => Math.random() - 0.5).slice(0, 10);
  index = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
}

function startTimer() {
  timeLeft = 15; // Secondi per domanda
  document.getElementById("timer-display").innerText = `⏳ ${timeLeft}s`;
  
  clearInterval(timer);
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById("timer-display").innerText = `⏳ ${timeLeft}s`;
    
    if (timeLeft <= 0) {
      clearInterval(timer);
      handleAnswer(null, null, null, true); // Tempo scaduto
    }
  }, 1000);
}

function showQuestion() {
  const q = currentQuiz[index];
  document.getElementById("question").innerText = `Domanda ${index + 1}: ${q.q}`;
  
  const progress = (index / currentQuiz.length) * 100;
  document.getElementById("progress").style.width = `${progress}%`;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  const shuffledAnswers = q.a.map((text, i) => ({ text, isCorrect: i === q.correct }))
                           .sort(() => Math.random() - 0.5);

  shuffledAnswers.forEach((ans) => {
    const btn = document.createElement("button");
    btn.innerText = ans.text;
    btn.onclick = () => handleAnswer(ans, btn, shuffledAnswers, false);
    answersDiv.appendChild(btn);
  });

  startTimer();
}

function handleAnswer(selectedObj, button, allOptions, timeOut) {
  clearInterval(timer);
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(b => b.disabled = true);

  let isRight = false;
  let selectedText = timeOut ? "Tempo scaduto" : selectedObj.text;
  const correctAnswerText = timeOut ? currentQuiz[index].a[currentQuiz[index].correct] : allOptions.find(a => a.isCorrect).text;

  if (!timeOut && selectedObj.isCorrect) {
    button.classList.add("correct");
    soundCorrect.play();
    score++;
    isRight = true;
  } else {
    if (button) button.classList.add("wrong");
    soundWrong.play();
    // Evidenzia la corretta
    if (!timeOut) {
        buttons.forEach((b, i) => { if (allOptions[i].isCorrect) b.classList.add("correct"); });
    }
  }

  userAnswers.push({
    question: currentQuiz[index].q,
    selected: selectedText,
    correct: correctAnswerText,
    isRight: isRight
  });

  setTimeout(() => {
    index++;
    index < currentQuiz.length ? showQuestion() : showSummary();
  }, 1200);
}

function showSummary() {
  clearInterval(timer);
  // ... (Logica showSummary rimane uguale a quella precedente)
}