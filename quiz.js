const quizzes = {
  storia: [
    { q: "Chi ha scoperto l'America?", a: ["Colombo", "Galileo", "Napoleone"], correct: 0 },
    { q: "In che anno iniziò la Seconda Guerra Mondiale?", a: ["1939", "1918", "1945"], correct: 0 },
    { q: "Chi era il primo imperatore romano?", a: ["Augusto", "Cesare", "Nerone"], correct: 0 },
    { q: "Dove nacque la civiltà egizia?", a: ["Nilo", "Tigri", "Danubio"], correct: 0 },
    { q: "Chi scrisse la Divina Commedia?", a: ["Dante", "Petrarca", "Boccaccio"], correct: 0 },
    { q: "Quando cadde l'Impero Romano d'Occidente?", a: ["476", "1000", "1492"], correct: 0 },
    { q: "Chi scoprì la penicillina?", a: ["Fleming", "Einstein", "Newton"], correct: 0 },
    { q: "La Rivoluzione Francese iniziò nel?", a: ["1789", "1600", "1900"], correct: 0 },
    { q: "Chi era Napoleone?", a: ["Generale", "Pittore", "Filosofo"], correct: 0 },
    { q: "La Prima Guerra Mondiale iniziò nel?", a: ["1914", "1939", "1945"], correct: 0 }
  ],
  geografia: [
    { q: "Qual è la capitale d'Italia?", a: ["Roma", "Milano", "Torino"], correct: 0 },
    { q: "Qual è il fiume più lungo del mondo?", a: ["Nilo", "Po", "Danubio"], correct: 0 },
    { q: "In che continente si trova il Brasile?", a: ["Sud America", "Europa", "Asia"], correct: 0 },
    { q: "Qual è il monte più alto del mondo?", a: ["Everest", "Bianco", "K2"], correct: 0 },
    { q: "Qual è l'oceano più grande?", a: ["Pacifico", "Atlantico", "Indiano"], correct: 0 },
    { q: "Dove si trova il Sahara?", a: ["Africa", "Asia", "America"], correct: 0 },
    { q: "Qual è la capitale della Francia?", a: ["Parigi", "Lione", "Marsiglia"], correct: 0 },
    { q: "Quale paese ha più abitanti?", a: ["Cina", "Italia", "Canada"], correct: 0 },
    { q: "Qual è il deserto più grande?", a: ["Sahara", "Gobi", "Kalahari"], correct: 0 },
    { q: "Quale mare bagna la Sicilia?", a: ["Mediterraneo", "Baltico", "Nero"], correct: 0 }
  ]
};

function startQuiz(category) {
  // Clona e mischia l'ordine delle domande
  currentQuiz = [...quizzes[category]].sort(() => Math.random() - 0.5);
  index = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz[index];
  document.getElementById("question").innerText = `Domanda ${index + 1}: ${q.q}`;
  
  // Aggiorna barra progresso
  const progress = (index / currentQuiz.length) * 100;
  document.getElementById("progress").style.width = `${progress}%`;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  // Mischia le risposte mantenendo il riferimento alla corretta
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
  buttons.forEach(b => b.disabled = true); // Disabilita per evitare click multipli

  if (selectedObj.isCorrect) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    // Mostra la risposta giusta se l'utente sbaglia
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

// Funzione showSummary con pulsante Riprova che resetta la pagina
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
        <button onclick="location.reload()" class="category" style="border:none; cursor:pointer;">🔄 Gioca ancora</button>
        <a class="back-home" href="index.html">⬅ Torna alla Home</a>
    </div>
  `;
}