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

function startQuiz(category) {
  currentQuiz = quizzes[category];
  index = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  const q = currentQuiz[index];
  document.getElementById("question").innerText = q.q;

  const answersDiv = document.getElementById("answers");
  answersDiv.innerHTML = "";

  q.a.forEach((text, i) => {
    const btn = document.createElement("button");
    btn.innerText = text;
    btn.onclick = () => answer(i);
    answersDiv.appendChild(btn);
  });
}

function answer(choice) {
  if (choice === currentQuiz[index].correct) {
    score++;
  }

  index++;

  if (index < currentQuiz.length) {
    showQuestion();
  } else {
    document.getElementById("question").innerText = "🎉 Quiz completato!";
    document.getElementById("answers").innerHTML = "";
    document.getElementById("score").innerText =
      "Punteggio: " + score + " / " + currentQuiz.length;
  }
}
