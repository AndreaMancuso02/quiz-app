let questionsDB = {};
let activeQuestions = [];
let currentIndex = 0;
let score = 0;
let timer;
let isSurvival = false;
let userAnswers = [];
let startTime;

// Inizializzazione Tema
if(localStorage.getItem('theme') === 'dark') document.body.classList.add('dark-mode');

function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', document.body.classList.contains('dark-mode') ? 'dark' : 'light');
}

// Suoni sintetizzati ottimizzati
function playSound(isCorrect) {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain); gain.connect(ctx.destination);
    if (isCorrect) {
        osc.type = 'sine'; osc.frequency.setValueAtTime(523.25, ctx.currentTime); 
        osc.frequency.exponentialRampToValueAtTime(1046.50, ctx.currentTime + 0.1);
    } else {
        osc.type = 'triangle'; osc.frequency.setValueAtTime(180, ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.2);
    }
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    osc.start(); osc.stop(ctx.currentTime + 0.3);
}

// Navigazione Home
let selectedCategory = 'storia';
function selectCat(cat, btn) {
    selectedCategory = cat;
    document.querySelectorAll('.btn-cat').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
}
function goToQuiz(diff) {
    window.location.href = `quiz.html?cat=${selectedCategory}&diff=${diff}`;
}

// Gestione Record Home
const highScoreEl = document.getElementById('high-score');
if(highScoreEl) highScoreEl.innerText = "Record Survival: " + (localStorage.getItem('survivalRecord') || 0);

window.onload = async () => {
    const qScreen = document.getElementById('quiz-screen');
    if(!qScreen) return;

    try {
        const res = await fetch('domande.json');
        questionsDB = await res.json();
        const urlParams = new URLSearchParams(window.location.search);
        const mode = urlParams.get('mode');
        
        if (mode === 'survival') {
            isSurvival = true;
            activeQuestions = Object.values(questionsDB).flat().sort(() => 0.5 - Math.random());
        } else if (mode === 'mix') {
            activeQuestions = Object.values(questionsDB).flat().sort(() => 0.5 - Math.random()).slice(0, 10);
        } else {
            const cat = urlParams.get('cat');
            const diff = urlParams.get('diff');
            activeQuestions = questionsDB[cat].filter(q => q.difficolta === diff).sort(() => 0.5 - Math.random()).slice(0, 10);
        }
        startTime = Date.now();
        renderQuestion();
    } catch (e) { console.error("Errore caricamento database"); }
};

function renderQuestion() {
    if (currentIndex >= activeQuestions.length) return finish();
    
    // Progress Bar
    const progressBar = document.getElementById('progress-bar');
    if(progressBar) progressBar.style.width = ((currentIndex / activeQuestions.length) * 100) + "%";

    const q = activeQuestions[currentIndex];
    const qBox = document.getElementById('question-box');
    
    // Animazione Fade-in
    qBox.classList.remove('fade-in');
    void qBox.offsetWidth;
    qBox.classList.add('fade-in');

    document.getElementById('question-text').innerText = q.q;
    document.getElementById('status-text').innerText = isSurvival ? `Record: ${score}` : `Domanda ${currentIndex + 1}/${activeQuestions.length}`;
    
    const options = document.getElementById('answer-options');
    options.innerHTML = '';
    q.a.forEach((opt, i) => {
        const btn = document.createElement('button');
        btn.innerText = opt;
        btn.onclick = () => validate(i, btn);
        options.appendChild(btn);
    });

    let timeLeft = 15;
    const timerEl = document.getElementById('timer-display');
    timerEl.innerText = `⏱ ${timeLeft}s`;
    timerEl.classList.remove('timer-low');

    clearInterval(timer);
    timer = setInterval(() => {
        timeLeft--;
        timerEl.innerText = `⏱ ${timeLeft}s`;
        if(timeLeft <= 5) timerEl.classList.add('timer-low');
        if(timeLeft <= 0) validate(-1, null);
    }, 1000);
}

function validate(choice, btn) {
    clearInterval(timer);
    const correctIdx = activeQuestions[currentIndex].correct;
    const isCorrect = (choice === correctIdx);

    if (!isSurvival) {
        userAnswers.push({
            q: activeQuestions[currentIndex].q,
            correctStr: activeQuestions[currentIndex].a[correctIdx],
            userStr: choice === -1 ? "Tempo scaduto" : activeQuestions[currentIndex].a[choice],
            isCorrect: isCorrect
        });
    }

    document.querySelectorAll('#answer-options button').forEach(b => b.disabled = true);

    if (isCorrect) {
        btn.classList.add('correct-anim');
        playSound(true);
        score++;
    } else {
        if(btn) btn.classList.add('wrong-anim');
        document.querySelectorAll('#answer-options button')[correctIdx].classList.add('correct-anim');
        playSound(false);
    }

    setTimeout(() => {
        if (!isCorrect && isSurvival) finish();
        else { currentIndex++; renderQuestion(); }
    }, 1500);
}

function finish() {
    document.getElementById('quiz-screen').classList.add('hidden');
    document.getElementById('result-screen').classList.remove('hidden');
    
    const totalTime = Math.floor((Date.now() - startTime) / 1000);
    const avgTime = (totalTime / (currentIndex || 1)).toFixed(1);

    let comment = "";
    const ratio = score / (isSurvival ? score + 1 : activeQuestions.length);
    if(score === activeQuestions.length && !isSurvival) comment = "🥇 Incredibile! Perfetto!";
    else if(ratio >= 0.7) comment = "🥈 Ottimo lavoro!";
    else if(ratio >= 0.5) comment = "🥉 Ben fatto!";
    else comment = "🦾 Continua ad allenarti!";

    let html = `<h2>Punteggio: ${score}</h2>`;
    html += `<p class="final-comment">${comment}</p>`;
    html += `<p style="font-size:0.9rem; margin-bottom:15px;">Tempo medio: ${avgTime}s a domanda</p>`;

    if (isSurvival) {
        const best = localStorage.getItem('survivalRecord') || 0;
        if (score > parseInt(best)) localStorage.setItem('survivalRecord', score);
        html += `<p>Record di sopravvivenza: ${localStorage.getItem('survivalRecord')}</p>`;
    } else {
        html += `<div class="recap-container">`;
        userAnswers.forEach(ans => {
            html += `<div class="recap-box ${ans.isCorrect ? 'r-up' : 'r-down'}">
                <p><strong>${ans.q}</strong></p>
                <p>Tu: ${ans.userStr} | ✅: ${ans.correctStr}</p>
            </div>`;
        });
        html += `</div>`;
    }
    document.getElementById('result-desc').innerHTML = html;
}