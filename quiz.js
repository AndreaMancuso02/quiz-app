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

let currentQuiz = [];
let index = 0;
let score = 0;
let userAnswers = [];

// Funzione che legge l'URL all'apertura
window.onload = () => {
  const params = new URLSearchParams(window.location.search);
  const cat = params.get('cat');
  
  if (cat && quizzes[cat]) {
    document.getElementById("category-title").innerText = cat.charAt(0).toUpperCase() + cat.slice(1);
    startQuiz(cat);
  } else {
    window.location.href = "index.html";
  }
};

function startQuiz(category) {
  // Bonus: Mischia le domande ogni volta [Miglioramento suggerito]
  currentQuiz = [...quizzes[category]].sort(() => Math.random() - 0.5);
  index = 0;
  score = 0;
  userAnswers = [];
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz[index];
  document.getElementById("question").innerText = `Domanda ${index + 1}: ${q.q}`;
  
  // Aggiorna barra di progresso
  const progress = (index / currentQuiz.length) * 100;
  document.getElementById("progress").style.width = `${progress}%`;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = () => answer(i, btn);
    answersDiv.appendChild(btn);
  });
}

function answer(choice, button) {
  const q = currentQuiz[index];
  const buttons = document.querySelectorAll("#answers button");
  buttons.forEach(b => b.disabled = true);

  if (choice === q.correct) {
    button.classList.add("correct");
    score++;
  } else {
    button.classList.add("wrong");
    buttons[q.correct].classList.add("correct");
  }

  userAnswers.push({
    question: q.q,
    selected: q.a[choice],
    correct: q.a[q.correct]
  });

  setTimeout(() => {
    index++;
    if (index < currentQuiz.length) {
      showQuestion();
    } else {
      showSummary();
    }
  }, 800);
}

function showSummary() {
  document.getElementById("progress").style.width = `100%`;
  const container = document.querySelector(".container");
  container.innerHTML = `
    <h2>📊 Risultato finale</h2>
    <p>Hai totalizzato <strong>${score} / ${currentQuiz.length}</strong></p>
    <div class="summary">
      ${userAnswers.map((item, i) => `
        <div class="summary-item">
          <strong>Domanda ${i + 1}:</strong> ${item.question}<br>
          ✅ Corretta: ${item.correct}<br>
          <span style="color: ${item.selected === item.correct ? 'green' : 'red'}">
            🧍‍♂️ Tua risposta: ${item.selected}
          </span>
        </div>
      `).join("")}
    </div>
    <a class="back-home" href="index.html">⬅ Torna alla Home</a>
  `;
}