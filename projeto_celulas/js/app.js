/**
 * ==========================================================================
 * CONTROLADOR PRINCIPAL DO JOGO / QUIZ INTERATIVO DE CÉLULAS
 * Sem cronômetro, totalmente amigável, com 7 ambientes interativos!
 * ==========================================================================
 */

class CellQuizApp {
  constructor() {
    this.questions = window.QUESTIONS_DATA || [];
    this.currentIndex = 0;
    this.score = 0;
    this.resultsHistory = [];
    this.questionAnswered = false;

    // Estado temporário da pergunta atual
    this.tempState = {};
  }

  init() {
    this.bindWelcomeEvents();
    this.updateProgressUI();
  }

  bindWelcomeEvents() {
    const startBtn = document.getElementById('btn-start-quiz');
    if (startBtn) {
      startBtn.addEventListener('click', () => this.startQuizWithAnimation());
    }

    const audioBtn = document.getElementById('btn-toggle-audio');
    if (audioBtn) {
      audioBtn.addEventListener('click', () => {
        if (window.soundManager) {
          window.soundManager.toggleMute();
        }
      });
    }

    const restartBtn = document.getElementById('btn-restart-quiz');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => this.restartQuiz());
    }
  }

  startQuizWithAnimation() {
    if (window.soundManager) {
      window.soundManager.startMusic();
      window.soundManager.playPortalZoom();
    }

    const welcomeScreen = document.getElementById('screen-welcome');
    const quizScreen = document.getElementById('screen-quiz');
    const topHud = document.getElementById('top-quiz-hud');

    if (welcomeScreen) {
      welcomeScreen.classList.add('screen-exit');
    }

    setTimeout(() => {
      if (welcomeScreen) {
        welcomeScreen.classList.add('hidden');
        welcomeScreen.classList.remove('screen-exit');
      }
      if (topHud) {
        topHud.classList.remove('hidden');
      }
      if (quizScreen) {
        quizScreen.classList.remove('hidden');
        quizScreen.classList.add('zoom-transition-enter');
      }
      this.currentIndex = 0;
      this.score = 0;
      this.resultsHistory = [];
      this.renderCurrentQuestion();
    }, 620);
  }

  restartQuiz() {
    if (window.soundManager) {
      window.soundManager.playPortalZoom();
    }
    const resultScreen = document.getElementById('screen-results');
    const quizScreen = document.getElementById('screen-quiz');
    const topHud = document.getElementById('top-quiz-hud');

    if (resultScreen) resultScreen.classList.add('hidden');
    if (topHud) topHud.classList.remove('hidden');
    if (quizScreen) {
      quizScreen.classList.remove('hidden');
      quizScreen.classList.add('zoom-transition-enter');
    }

    this.currentIndex = 0;
    this.score = 0;
    this.resultsHistory = [];
    this.renderCurrentQuestion();
  }

  updateProgressUI() {
    const total = this.questions.length;
    const currentNum = this.currentIndex + 1;

    const counterText = document.getElementById('hud-question-counter');
    if (counterText) {
      counterText.textContent = `Pergunta ${currentNum} de ${total}`;
    }

    const pageBadge = document.getElementById('hud-page-badge');
    if (pageBadge && this.questions[this.currentIndex]) {
      pageBadge.textContent = this.questions[this.currentIndex].pageRef;
    }

    const progressBar = document.getElementById('hud-progress-bar');
    if (progressBar) {
      const pct = Math.round((currentNum / total) * 100);
      progressBar.style.width = `${pct}%`;
    }

    // Bolinhas de progresso
    const dotsContainer = document.getElementById('hud-step-dots');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      this.questions.forEach((q, idx) => {
        const dot = document.createElement('div');
        let classes = 'w-3.5 h-3.5 rounded-full transition-all duration-300 ';
        if (idx < this.currentIndex) {
          const wasCorrect = this.resultsHistory[idx]?.isCorrect;
          classes += wasCorrect ? 'bg-emerald-500 scale-100' : 'bg-amber-400 scale-100';
        } else if (idx === this.currentIndex) {
          classes += 'bg-sky-500 scale-125 ring-4 ring-sky-200';
        } else {
          classes += 'bg-slate-300 opacity-60';
        }
        dot.className = classes;
        dot.title = `Pergunta ${idx + 1}`;
        dotsContainer.appendChild(dot);
      });
    }
  }

  applyEnvironmentTheme(question) {
    const body = document.body;
    body.className = question.themeClass || 'theme-lab-pastel';

    const cardContainer = document.getElementById('question-main-card');
    if (cardContainer) {
      if (question.isDarkTheme) {
        cardContainer.className = 'dark-glass-card p-6 md:p-8 transition-all duration-500';
      } else {
        cardContainer.className = 'glass-card p-6 md:p-8 transition-all duration-500';
      }
    }
  }

  renderCurrentQuestion() {
    if (window.cell3DExplorer) {
      window.cell3DExplorer.destroy();
    }

    const q = this.questions[this.currentIndex];
    if (!q) return;

    this.questionAnswered = false;
    this.tempState = {};

    this.applyEnvironmentTheme(q);
    this.updateProgressUI();

    const envBadge = document.getElementById('q-env-badge');
    const titleEl = document.getElementById('q-title');
    const subtitleEl = document.getElementById('q-subtitle');
    const stageEl = document.getElementById('q-interactive-stage');
    const feedbackBox = document.getElementById('q-feedback-box');
    const btnVerify = document.getElementById('btn-verify-answer');
    const btnNext = document.getElementById('btn-next-question');

    if (envBadge) envBadge.textContent = q.environmentBadge;
    if (titleEl) titleEl.textContent = q.title;
    if (subtitleEl) subtitleEl.textContent = q.subtitle;

    if (feedbackBox) {
      feedbackBox.classList.add('hidden');
      feedbackBox.innerHTML = '';
    }
    if (btnVerify) {
      btnVerify.classList.remove('hidden');
      btnVerify.disabled = true;
    }
    if (btnNext) {
      btnNext.classList.add('hidden');
    }

    if (!stageEl) return;
    stageEl.innerHTML = '';

    // Renderiza a mecânica interativa exclusiva de cada pergunta
    switch (q.interactionType) {
      case 'match-cells':
        this.renderQ1MatchCells(stageEl);
        break;
      case 'match-complexity':
        this.renderQ2MatchComplexity(stageEl);
        break;
      case 'select-kingdoms':
        this.renderQ3SelectKingdoms(stageEl);
        break;
      case 'plant-animal-lab':
        this.renderQ4PlantAnimalLab(stageEl);
        break;
      case 'cell-3d-nucleus':
        this.renderQ5Cell3DNucleus(stageEl);
        break;
      case 'microscope-real-images':
        this.renderQ6MicroscopeReal(stageEl);
        break;
      case 'virus-expedition':
        this.renderQ7VirusExpedition(stageEl);
        break;
    }

    // Reatribui botões de ação
    if (btnVerify) {
      btnVerify.onclick = () => this.verifyCurrentAnswer();
    }
    if (btnNext) {
      btnNext.onclick = () => this.goToNextQuestion();
    }
  }

  enableVerifyButton(enabled = true) {
    const btnVerify = document.getElementById('btn-verify-answer');
    if (btnVerify && !this.questionAnswered) {
      btnVerify.disabled = !enabled;
    }
  }

  /* ========================================================================
     PERGUNTA 1: Marcar interativamente qual é Eucarionte e qual é Procarionte
     ======================================================================== */
  renderQ1MatchCells(stageEl) {
    this.tempState = {
      selectedStamp: 'eucarionte', // Começa com o primeiro crachá já selecionado para facilitar!
      assignments: { leftCard: null, rightCard: null }
    };

    stageEl.innerHTML = `
      <div class="space-y-6">
        <!-- Barra de Crachás para selecionar ou arrastar -->
        <div class="bg-emerald-50/90 border-2 border-emerald-200 rounded-2xl p-4 text-center">
          <p class="text-sm font-bold text-emerald-800 mb-3">
            PASSO 1: Escolha um crachá abaixo (ou arraste) e clique na célula correspondente!
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button type="button" id="stamp-eucarionte"
              class="badge-chip bg-purple-600 text-white selected-chip"
              draggable="true">
              <span>🟣</span>
              <span>Célula Eucarionte</span>
            </button>
            <button type="button" id="stamp-procarionte"
              class="badge-chip bg-amber-500 text-white"
              draggable="true">
              <span>🟠</span>
              <span>Célula Procarionte</span>
            </button>
            <button type="button" id="btn-swap-q1"
              class="px-4 py-2 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition">
              🔄 Inverter Marcações
            </button>
          </div>
        </div>

        <!-- Cartões com os 2 desenhos da Página 1 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Célula da Esquerda (Eucarionte) -->
          <div id="q1-card-left"
            class="bg-white rounded-3xl p-5 border-4 border-slate-200 shadow-md hover:border-purple-400 transition cursor-pointer flex flex-col items-center justify-between">
            <div class="w-full flex justify-between items-center mb-2">
              <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs">ESPÉCIME A</span>
              <span class="text-xs text-slate-500 font-semibold">Clique para marcar</span>
            </div>
            <div class="h-48 flex items-center justify-center p-2">
              <img src="assets/img/celula_eucarionte.png" alt="Espécime Celular A" class="max-h-44 w-auto object-contain" />
            </div>
            <p class="text-xs text-slate-500 text-center mb-3">
              Cheia de estruturas internas e com um núcleo redondo no centro!
            </p>
            <div id="q1-slot-left" class="interactive-slot w-full font-extrabold text-slate-500">
              Clique aqui para colar o crachá
            </div>
          </div>

          <!-- Célula da Direita (Procarionte) -->
          <div id="q1-card-right"
            class="bg-white rounded-3xl p-5 border-4 border-slate-200 shadow-md hover:border-amber-400 transition cursor-pointer flex flex-col items-center justify-between">
            <div class="w-full flex justify-between items-center mb-2">
              <span class="px-3 py-1 rounded-full bg-slate-100 text-slate-700 font-extrabold text-xs">ESPÉCIME B</span>
              <span class="text-xs text-slate-500 font-semibold">Clique para marcar</span>
            </div>
            <div class="h-48 flex items-center justify-center p-2">
              <img src="assets/img/celula_procarionte.png" alt="Espécime Celular B" class="max-h-44 w-auto object-contain" />
            </div>
            <p class="text-xs text-slate-500 text-center mb-3">
              Formato de cápsula com cílios ao redor, flagelo (rabinho) e DNA solto!
            </p>
            <div id="q1-slot-right" class="interactive-slot w-full font-extrabold text-slate-500">
              Clique aqui para colar o crachá
            </div>
          </div>
        </div>
      </div>
    `;

    const stampEuc = document.getElementById('stamp-eucarionte');
    const stampProc = document.getElementById('stamp-procarionte');
    const swapBtn = document.getElementById('btn-swap-q1');
    const cardLeft = document.getElementById('q1-card-left');
    const cardRight = document.getElementById('q1-card-right');

    const updateUI = () => {
      stampEuc.classList.toggle('selected-chip', this.tempState.selectedStamp === 'eucarionte');
      stampProc.classList.toggle('selected-chip', this.tempState.selectedStamp === 'procarionte');

      const renderSlot = (slotId, val) => {
        const el = document.getElementById(slotId);
        if (!el) return;
        if (val === 'eucarionte') {
          el.className = 'interactive-slot slot-filled w-full font-extrabold text-purple-900 bg-purple-100 border-purple-500';
          el.innerHTML = '🟣 Marcado: <strong>Célula Eucarionte</strong>';
        } else if (val === 'procarionte') {
          el.className = 'interactive-slot slot-filled w-full font-extrabold text-amber-900 bg-amber-100 border-amber-500';
          el.innerHTML = '🟠 Marcado: <strong>Célula Procarionte</strong>';
        } else {
          el.className = 'interactive-slot w-full font-extrabold text-slate-500';
          el.innerHTML = 'Clique aqui para colar o crachá';
        }
      };

      renderSlot('q1-slot-left', this.tempState.assignments.leftCard);
      renderSlot('q1-slot-right', this.tempState.assignments.rightCard);

      const bothFilled = Boolean(this.tempState.assignments.leftCard && this.tempState.assignments.rightCard);
      this.enableVerifyButton(bothFilled);
    };

    const assignToCard = (side) => {
      if (this.questionAnswered) return;
      if (window.soundManager) window.soundManager.playPop();

      const currentStamp = this.tempState.selectedStamp;
      const otherSide = side === 'leftCard' ? 'rightCard' : 'leftCard';
      const otherStamp = currentStamp === 'eucarionte' ? 'procarionte' : 'eucarionte';

      this.tempState.assignments[side] = currentStamp;
      // Preenche automaticamente o outro lado com o crachá complementar para ser super fluido e amigável!
      if (!this.tempState.assignments[otherSide] || this.tempState.assignments[otherSide] === currentStamp) {
        this.tempState.assignments[otherSide] = otherStamp;
      }
      // Alterna o próximo crachá ativo
      this.tempState.selectedStamp = otherStamp;
      updateUI();
    };

    stampEuc.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playClick();
      this.tempState.selectedStamp = 'eucarionte';
      updateUI();
    });

    stampProc.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playClick();
      this.tempState.selectedStamp = 'procarionte';
      updateUI();
    });

    swapBtn.addEventListener('click', () => {
      if (this.questionAnswered) return;
      if (window.soundManager) window.soundManager.playPop();
      const l = this.tempState.assignments.leftCard || 'eucarionte';
      const r = this.tempState.assignments.rightCard || 'procarionte';
      this.tempState.assignments.leftCard = r;
      this.tempState.assignments.rightCard = l;
      updateUI();
    });

    cardLeft.addEventListener('click', () => assignToCard('leftCard'));
    cardRight.addEventListener('click', () => assignToCard('rightCard'));

    // Suporte a Drag and Drop também!
    stampEuc.addEventListener('dragstart', () => { this.tempState.selectedStamp = 'eucarionte'; });
    stampProc.addEventListener('dragstart', () => { this.tempState.selectedStamp = 'procarionte'; });
    cardLeft.addEventListener('dragover', (e) => e.preventDefault());
    cardRight.addEventListener('dragover', (e) => e.preventDefault());
    cardLeft.addEventListener('drop', () => assignToCard('leftCard'));
    cardRight.addEventListener('drop', () => assignToCard('rightCard'));
  }

  /* ========================================================================
     PERGUNTA 2: Marcar quem tem a estrutura MAIS COMPLEXA e quem é MAIS SIMPLES
     ======================================================================== */
  renderQ2MatchComplexity(stageEl) {
    this.tempState = {
      selectedStamp: 'complexa',
      assignments: { eucarionte: null, procarionte: null }
    };

    stageEl.innerHTML = `
      <div class="space-y-6">
        <!-- Barra de Selos de Complexidade -->
        <div class="bg-sky-50/90 border-2 border-sky-200 rounded-2xl p-4 text-center">
          <p class="text-sm font-bold text-sky-900 mb-3">
            Escolha o selo de estrutura abaixo e clique na célula correspondente:
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <button type="button" id="stamp-complexa"
              class="badge-chip bg-indigo-600 text-white selected-chip">
              <span>🏗️</span>
              <span>Mais Estruturada / Complexa</span>
            </button>
            <button type="button" id="stamp-simples"
              class="badge-chip bg-teal-600 text-white">
              <span>✨</span>
              <span>Muito Mais Simples</span>
            </button>
            <button type="button" id="btn-swap-q2"
              class="px-4 py-2 rounded-full bg-white border-2 border-slate-300 text-slate-700 font-bold text-sm hover:bg-slate-100 transition">
              🔄 Inverter Selos
            </button>
          </div>
        </div>

        <!-- Painéis Comparativos -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div id="q2-card-euc"
            class="bg-white rounded-3xl p-5 border-4 border-indigo-100 shadow-md hover:border-indigo-400 transition cursor-pointer flex flex-col items-center">
            <span class="px-4 py-1 rounded-full bg-purple-100 text-purple-800 font-extrabold text-sm mb-3">
              🟣 Célula Eucarionte
            </span>
            <img src="assets/img/celula_eucarionte.png" alt="Célula Eucarionte" class="h-40 w-auto object-contain mb-4" />
            <div id="q2-slot-euc" class="interactive-slot w-full font-extrabold text-slate-500">
              Clique para classificar a estrutura
            </div>
          </div>

          <div id="q2-card-proc"
            class="bg-white rounded-3xl p-5 border-4 border-teal-100 shadow-md hover:border-teal-400 transition cursor-pointer flex flex-col items-center">
            <span class="px-4 py-1 rounded-full bg-amber-100 text-amber-800 font-extrabold text-sm mb-3">
              🟠 Célula Procarionte
            </span>
            <img src="assets/img/celula_procarionte.png" alt="Célula Procarionte" class="h-40 w-auto object-contain mb-4" />
            <div id="q2-slot-proc" class="interactive-slot w-full font-extrabold text-slate-500">
              Clique para classificar a estrutura
            </div>
          </div>
        </div>
      </div>
    `;

    const stampComp = document.getElementById('stamp-complexa');
    const stampSimp = document.getElementById('stamp-simples');
    const swapBtn = document.getElementById('btn-swap-q2');
    const cardEuc = document.getElementById('q2-card-euc');
    const cardProc = document.getElementById('q2-card-proc');

    const updateUI = () => {
      stampComp.classList.toggle('selected-chip', this.tempState.selectedStamp === 'complexa');
      stampSimp.classList.toggle('selected-chip', this.tempState.selectedStamp === 'simples');

      const renderSlot = (slotId, val) => {
        const el = document.getElementById(slotId);
        if (!el) return;
        if (val === 'complexa') {
          el.className = 'interactive-slot slot-filled w-full font-extrabold text-indigo-900 bg-indigo-100 border-indigo-500';
          el.innerHTML = '🏗️ <strong>Mais Estruturada / Complexa</strong>';
        } else if (val === 'simples') {
          el.className = 'interactive-slot slot-filled w-full font-extrabold text-teal-900 bg-teal-100 border-teal-500';
          el.innerHTML = '✨ <strong>Muito Mais Simples</strong>';
        } else {
          el.className = 'interactive-slot w-full font-extrabold text-slate-500';
          el.innerHTML = 'Clique para classificar a estrutura';
        }
      };

      renderSlot('q2-slot-euc', this.tempState.assignments.eucarionte);
      renderSlot('q2-slot-proc', this.tempState.assignments.procarionte);

      const ready = Boolean(this.tempState.assignments.eucarionte && this.tempState.assignments.procarionte);
      this.enableVerifyButton(ready);
    };

    const assign = (targetKey) => {
      if (this.questionAnswered) return;
      if (window.soundManager) window.soundManager.playPop();

      const stamp = this.tempState.selectedStamp;
      const otherKey = targetKey === 'eucarionte' ? 'procarionte' : 'eucarionte';
      const otherStamp = stamp === 'complexa' ? 'simples' : 'complexa';

      this.tempState.assignments[targetKey] = stamp;
      if (!this.tempState.assignments[otherKey] || this.tempState.assignments[otherKey] === stamp) {
        this.tempState.assignments[otherKey] = otherStamp;
      }
      this.tempState.selectedStamp = otherStamp;
      updateUI();
    };

    stampComp.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playClick();
      this.tempState.selectedStamp = 'complexa';
      updateUI();
    });

    stampSimp.addEventListener('click', () => {
      if (window.soundManager) window.soundManager.playClick();
      this.tempState.selectedStamp = 'simples';
      updateUI();
    });

    swapBtn.addEventListener('click', () => {
      if (this.questionAnswered) return;
      if (window.soundManager) window.soundManager.playPop();
      const e = this.tempState.assignments.eucarionte || 'complexa';
      const p = this.tempState.assignments.procarionte || 'simples';
      this.tempState.assignments.eucarionte = p;
      this.tempState.assignments.procarionte = e;
      updateUI();
    });

    cardEuc.addEventListener('click', () => assign('eucarionte'));
    cardProc.addEventListener('click', () => assign('procarionte'));
  }

  /* ========================================================================
     PERGUNTA 3 (Página 1): Os 4 Reinos que possuem Células Eucariontes
     ======================================================================== */
  renderQ3SelectKingdoms(stageEl) {
    this.tempState = {
      selectedKingdoms: new Set()
    };

    const options = [
      { id: 'protista', name: 'Reino Protista', icon: '🦠', desc: 'Algas e protozoários eucariontes', isCorrect: true },
      { id: 'fungi', name: 'Reino Fungi', icon: '🍄', desc: 'Cogumelos, leveduras e fungos', isCorrect: true },
      { id: 'plantae', name: 'Reino Plantae', icon: '🌻', desc: 'Todas as plantas e árvores', isCorrect: true },
      { id: 'animalia', name: 'Reino Animalia', icon: '🐶', desc: 'Você, cachorros, gatos e animais', isCorrect: true },
      { id: 'mineral', name: 'Reino das Rochas', icon: '🪨', desc: 'Pedras e minerais sem vida', isCorrect: false },
      { id: 'virus', name: 'Grupo dos Vírus', icon: '👾', desc: 'Seres acelulares (não têm células)', isCorrect: false }
    ];

    stageEl.innerHTML = `
      <div class="space-y-4">
        <div class="flex items-center justify-between bg-amber-100/80 border-2 border-amber-300 rounded-2xl px-4 py-2.5">
          <span class="text-sm font-extrabold text-amber-900">
            🎯 Selecione os 4 Reinos citados na Página 1:
          </span>
          <span id="q3-counter-pill" class="px-3 py-1 rounded-full bg-white text-amber-900 font-black text-xs shadow-sm">
            0 de 4 selecionados
          </span>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4" id="q3-grid"></div>
      </div>
    `;

    const grid = document.getElementById('q3-grid');
    const counterPill = document.getElementById('q3-counter-pill');

    options.forEach((opt) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.dataset.id = opt.id;
      card.className = 'p-4 rounded-2xl bg-white border-4 border-slate-200 hover:border-emerald-400 transition text-left flex items-start gap-3.5 shadow-sm cursor-pointer';
      card.innerHTML = `
        <div class="text-3xl bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center shrink-0">
          ${opt.icon}
        </div>
        <div class="flex-1">
          <div class="font-extrabold text-slate-800 text-base">${opt.name}</div>
          <div class="text-xs text-slate-500 mt-0.5">${opt.desc}</div>
        </div>
        <div class="q3-check w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-transparent">
          ✓
        </div>
      `;

      card.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();

        if (this.tempState.selectedKingdoms.has(opt.id)) {
          this.tempState.selectedKingdoms.delete(opt.id);
        } else {
          if (this.tempState.selectedKingdoms.size >= 4) {
            // Remove o mais antigo se já tiver 4, para manter a experiência fluida
            const first = this.tempState.selectedKingdoms.values().next().value;
            this.tempState.selectedKingdoms.delete(first);
          }
          this.tempState.selectedKingdoms.add(opt.id);
        }

        // Atualiza visual
        Array.from(grid.children).forEach((child) => {
          const cid = child.dataset.id;
          const active = this.tempState.selectedKingdoms.has(cid);
          const checkEl = child.querySelector('.q3-check');
          if (active) {
            child.className = 'p-4 rounded-2xl bg-emerald-50 border-4 border-emerald-500 transition text-left flex items-start gap-3.5 shadow-md cursor-pointer scale-[1.02]';
            if (checkEl) {
              checkEl.className = 'q3-check w-6 h-6 rounded-full bg-emerald-500 border-2 border-emerald-600 flex items-center justify-center text-xs font-bold text-white';
            }
          } else {
            child.className = 'p-4 rounded-2xl bg-white border-4 border-slate-200 hover:border-emerald-400 transition text-left flex items-start gap-3.5 shadow-sm cursor-pointer';
            if (checkEl) {
              checkEl.className = 'q3-check w-6 h-6 rounded-full border-2 border-slate-300 flex items-center justify-center text-xs font-bold text-transparent';
            }
          }
        });

        const count = this.tempState.selectedKingdoms.size;
        if (counterPill) {
          counterPill.textContent = `${count} de 4 selecionados`;
        }
        this.enableVerifyButton(count === 4);
      });

      grid.appendChild(card);
    });
  }

  /* ========================================================================
     PERGUNTA 4 (Página 2): Laboratório de Células Animais e Vegetais
     ======================================================================== */
  renderQ4PlantAnimalLab(stageEl) {
    this.tempState = {
      q4_bone: null,
      q4_stand: null,
      q4_green: null
    };

    stageEl.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5 items-stretch">
        <!-- Cartão Ilustrado da Célula Vegetal da Página 2 -->
        <div class="bg-white rounded-3xl p-5 border-4 border-emerald-200 flex flex-col items-center justify-center text-center shadow-sm">
          <span class="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-xs mb-2">
            🌿 Ilustração da Apostila (Pág. 2)
          </span>
          <img src="assets/img/celula_vegetal.jpg" alt="Célula Vegetal" class="h-40 w-auto object-contain rounded-xl mb-3" />
          <p class="text-xs text-slate-600 font-semibold leading-relaxed">
            Observe a estrutura verdinha e rígida da <strong>Célula Vegetal</strong> ao lado e relembre também as <strong>Células Animais</strong> do nosso corpo!
          </p>
        </div>

        <!-- 3 Desafios Interativos Rápidos da Página 2 -->
        <div class="lg:col-span-2 space-y-4">
          <!-- Item 1: Osteócitos -->
          <div class="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm">
            <p class="text-sm font-extrabold text-slate-800 mb-2">
              🦴 1. Qual célula animal forma o nosso osso e cria um líquido que vai endurecendo com o tempo?
            </p>
            <div class="flex flex-wrap gap-2" data-group="q4_bone">
              <button type="button" data-val="osteocitos" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-sky-50 transition">
                🦴 Osteócitos
              </button>
              <button type="button" data-val="cloroplastos" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-sky-50 transition">
                🍃 Cloroplastos
              </button>
              <button type="button" data-val="bacterias" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-sky-50 transition">
                🦠 Bactérias Procariontes
              </button>
            </div>
          </div>

          <!-- Item 2: Base rígida e potente -->
          <div class="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm">
            <p class="text-sm font-extrabold text-slate-800 mb-2">
              🌳 2. A célula vegetal tem uma "base rígida e potente". Para que ela serve?
            </p>
            <div class="flex flex-wrap gap-2" data-group="q4_stand">
              <button type="button" data-val="parar_em_pe" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-emerald-50 transition">
                🌱 Para a planta parar em pé!
              </button>
              <button type="button" data-val="correr" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-emerald-50 transition">
                🏃 Para a planta sair andando
              </button>
              <button type="button" data-val="ficar_mole" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-emerald-50 transition">
                💧 Para deixar o tronco mole
              </button>
            </div>
          </div>

          <!-- Item 3: Clorofila -->
          <div class="bg-white rounded-2xl p-4 border-2 border-slate-200 shadow-sm">
            <p class="text-sm font-extrabold text-slate-800 mb-2">
              ☀️ 3. O que dá a cor VERDE para a célula vegetal e permite fazer a fotossíntese?
            </p>
            <div class="flex flex-wrap gap-2" data-group="q4_green">
              <button type="button" data-val="clorofila" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-emerald-50 transition">
                💚 A Clorofila
              </button>
              <button type="button" data-val="tinta_verde" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-emerald-50 transition">
                🎨 Tinta da chuva
              </button>
              <button type="button" data-val="capsideo" class="q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 hover:bg-emerald-50 transition">
                🛡️ O Capsídeo
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const groups = stageEl.querySelectorAll('[data-group]');
    groups.forEach((grp) => {
      const groupKey = grp.dataset.group;
      const buttons = grp.querySelectorAll('.q4-opt');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          if (this.questionAnswered) return;
          if (window.soundManager) window.soundManager.playClick();

          this.tempState[groupKey] = btn.dataset.val;
          buttons.forEach((b) => {
            const active = b.dataset.val === btn.dataset.val;
            b.className = active
              ? 'q4-opt px-3.5 py-2 rounded-xl border-2 border-emerald-600 font-extrabold text-xs bg-emerald-600 text-white shadow-sm transition'
              : 'q4-opt px-3.5 py-2 rounded-xl border-2 border-slate-200 font-bold text-xs bg-slate-50 text-slate-700 hover:bg-emerald-50 transition';
          });

          const allReady = Boolean(this.tempState.q4_bone && this.tempState.q4_stand && this.tempState.q4_green);
          this.enableVerifyButton(allReady);
        });
      });
    });
  }

  /* ========================================================================
     PERGUNTA 5 (Página 3): Explorador 3D Interativo - Colocar o DNA no Núcleo!
     ======================================================================== */
  renderQ5Cell3DNucleus(stageEl) {
    this.tempState = {
      selectedPartId: null
    };

    stageEl.innerHTML = `
      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <!-- Viewport 3D Interativo -->
        <div class="lg:col-span-7 flex flex-col">
          <div id="cell-3d-viewport"></div>
          <div class="flex flex-wrap items-center justify-between text-xs text-sky-200 mt-2 px-1">
            <span>👆 Arraste para girar a célula em 3D (360°)</span>
            <span>🎯 Clique na parte onde fica o DNA!</span>
          </div>
        </div>

        <!-- Painel de Controle do Cientista -->
        <div class="lg:col-span-5 space-y-4">
          <div class="bg-slate-800/90 border-2 border-indigo-400/40 rounded-2xl p-4">
            <div class="text-xs font-bold uppercase tracking-wider text-indigo-300 mb-1">
              🧬 Cápsula de Código DNA
            </div>
            <p class="text-xs text-slate-300 leading-relaxed">
              Na Página 3 aprendemos que o <strong>DNA</strong> guarda todas as informações da célula. Clique diretamente no modelo 3D ou escolha abaixo onde devemos colocar o DNA:
            </p>

            <div class="grid grid-cols-1 gap-2.5 mt-3" id="q5-part-buttons">
              <button type="button" data-part="membrana"
                class="q5-part-btn w-full p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 border-2 border-slate-600 text-left flex items-center gap-3 transition">
                <span class="w-4 h-4 rounded-full bg-sky-400 shrink-0"></span>
                <div>
                  <div class="font-extrabold text-sm text-white">Membrana Plasmática</div>
                  <div class="text-[11px] text-slate-300">Camada exterior que decide o que entra e sai</div>
                </div>
              </button>

              <button type="button" data-part="citoplasma"
                class="q5-part-btn w-full p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 border-2 border-slate-600 text-left flex items-center gap-3 transition">
                <span class="w-4 h-4 rounded-full bg-emerald-400 shrink-0"></span>
                <div>
                  <div class="font-extrabold text-sm text-white">Citoplasma</div>
                  <div class="text-[11px] text-slate-300">Líquido gelatinoso que mantém as organelas</div>
                </div>
              </button>

              <button type="button" data-part="nucleo"
                class="q5-part-btn w-full p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 border-2 border-slate-600 text-left flex items-center gap-3 transition">
                <span class="w-4 h-4 rounded-full bg-purple-400 shrink-0"></span>
                <div>
                  <div class="font-extrabold text-sm text-white">Núcleo (Centro Roxo/Amarelo)</div>
                  <div class="text-[11px] text-slate-300">Esfera central protegida da célula eucarionte</div>
                </div>
              </button>

              <button type="button" data-part="organelas"
                class="q5-part-btn w-full p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 border-2 border-slate-600 text-left flex items-center gap-3 transition">
                <span class="w-4 h-4 rounded-full bg-orange-400 shrink-0"></span>
                <div>
                  <div class="font-extrabold text-sm text-white">Organelas Digestórias</div>
                  <div class="text-[11px] text-slate-300">Pequenos órgãos espalhados no citoplasma</div>
                </div>
              </button>
            </div>
          </div>

          <!-- Visor da Parte Selecionada -->
          <div id="q5-inspector-box" class="bg-indigo-950/90 border-2 border-indigo-400/50 rounded-2xl p-3.5 text-center">
            <span class="text-xs text-indigo-200 font-bold">
              📍 Nenhum local selecionado ainda. Clique na célula 3D ou nos botões acima!
            </span>
          </div>
        </div>
      </div>
    `;

    const inspectorBox = document.getElementById('q5-inspector-box');
    const partBtns = stageEl.querySelectorAll('.q5-part-btn');

    const handlePartSelected = (partData) => {
      if (this.questionAnswered) return;
      this.tempState.selectedPartId = partData.id;

      partBtns.forEach((btn) => {
        const isCurrent = btn.dataset.part === partData.id;
        btn.className = isCurrent
          ? 'q5-part-btn w-full p-3 rounded-xl bg-indigo-600 border-2 border-emerald-400 text-left flex items-center gap-3 transition shadow-lg scale-[1.02]'
          : 'q5-part-btn w-full p-3 rounded-xl bg-slate-700/80 hover:bg-slate-700 border-2 border-slate-600 text-left flex items-center gap-3 transition';
      });

      if (inspectorBox) {
        inspectorBox.innerHTML = `
          <div class="text-xs font-extrabold text-emerald-300">
            🧬 DNA posicionado em: <span class="underline">${partData.title}</span>
          </div>
          <div class="text-[11px] text-slate-200 mt-1">${partData.desc}</div>
        `;
      }

      this.enableVerifyButton(true);
    };

    partBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.questionAnswered) return;
        const pid = btn.dataset.part;
        if (window.cell3DExplorer) {
          window.cell3DExplorer.selectPartById(pid);
        }
      });
    });

    setTimeout(() => {
      if (window.cell3DExplorer) {
        window.cell3DExplorer.init('cell-3d-viewport', handlePartSelected);
      }
    }, 60);
  }

  /* ========================================================================
     PERGUNTA 6 (Página 4): DNA Procarionte e Imagens Reais no Microscópio
     ======================================================================== */
  renderQ6MicroscopeReal(stageEl) {
    this.tempState = {
      focusValue: 100,
      dnaAnswer: null,
      lensEucarionteAnswer: null
    };

    stageEl.innerHTML = `
      <div class="space-y-6">
        <!-- Controle de Foco e Lentes Reais da Página 4 -->
        <div class="bg-slate-800/90 border-2 border-teal-500/40 rounded-3xl p-5">
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <span class="text-xs font-extrabold uppercase tracking-wider text-teal-300">
                🔬 Imagens Reais de Microscópio (Página 4)
              </span>
              <p class="text-xs text-slate-300">
                Ajuste o botão de foco se quiser examinar os detalhes das células reais:
              </p>
            </div>
            <div class="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
              <span class="text-xs font-bold text-teal-300">🔍 Foco:</span>
              <input id="q6-focus-slider" type="range" min="20" max="100" value="100" class="accent-teal-400 cursor-pointer" />
              <span id="q6-focus-label" class="text-xs font-extrabold text-white">100%</span>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div class="text-center">
              <div class="microscope-lens">
                <img id="q6-img-a" src="assets/img/real_eucariontes.jpg" alt="Lente A" />
                <div class="microscope-crosshair"></div>
              </div>
              <span class="inline-block mt-2 px-3 py-1 rounded-full bg-teal-900/90 text-teal-200 font-extrabold text-xs border border-teal-500/40">
                LENTE A (Vários núcleos escuros no centro)
              </span>
            </div>

            <div class="text-center">
              <div class="microscope-lens">
                <img id="q6-img-b" src="assets/img/real_procariontes.png" alt="Lente B" />
                <div class="microscope-crosshair"></div>
              </div>
              <span class="inline-block mt-2 px-3 py-1 rounded-full bg-teal-900/90 text-teal-200 font-extrabold text-xs border border-teal-500/40">
                LENTE B (Cápsulas simples de bactérias)
              </span>
            </div>
          </div>
        </div>

        <!-- Duas Perguntas Rápidas da Página 4 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4">
            <p class="text-sm font-extrabold text-white mb-3">
              1. Como fica o DNA na célula PROCARIONTE, já que ela não tem núcleo definido?
            </p>
            <div class="space-y-2" id="q6-dna-group">
              <button type="button" data-val="espalhado" class="q6-dna-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                🌀 Fica espalhado pelo corpo dela, meio "bagunçado"
              </button>
              <button type="button" data-val="trancado" class="q6-dna-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                🔒 Fica trancado dentro de dois núcleos gigantes
              </button>
            </div>
          </div>

          <div class="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4">
            <p class="text-sm font-extrabold text-white mb-3">
              2. Olhando as lentes acima, qual delas mostra o "Amontoado de células EUCARIONTES"?
            </p>
            <div class="space-y-2" id="q6-lens-group">
              <button type="button" data-val="lente_a" class="q6-lens-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                🟣 A LENTE A (células roxas com núcleo bem visível)
              </button>
              <button type="button" data-val="lente_b" class="q6-lens-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                ⚪ A LENTE B (bactérias em preto e branco)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const slider = document.getElementById('q6-focus-slider');
    const focusLabel = document.getElementById('q6-focus-label');
    const imgA = document.getElementById('q6-img-a');
    const imgB = document.getElementById('q6-img-b');

    if (slider) {
      slider.addEventListener('input', () => {
        const val = Number(slider.value);
        const blurPx = ((100 - val) / 14).toFixed(1);
        if (imgA) imgA.style.filter = `blur(${blurPx}px)`;
        if (imgB) imgB.style.filter = `blur(${blurPx}px)`;
        if (focusLabel) focusLabel.textContent = `${val}%`;
      });
    }

    const dnaBtns = stageEl.querySelectorAll('.q6-dna-btn');
    const lensBtns = stageEl.querySelectorAll('.q6-lens-btn');

    const checkReady = () => {
      this.enableVerifyButton(Boolean(this.tempState.dnaAnswer && this.tempState.lensEucarionteAnswer));
    };

    dnaBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();
        this.tempState.dnaAnswer = btn.dataset.val;
        dnaBtns.forEach((b) => {
          const active = b.dataset.val === btn.dataset.val;
          b.className = active
            ? 'q6-dna-btn w-full p-2.5 rounded-xl bg-teal-600 text-left text-xs font-extrabold text-white border-2 border-teal-300 transition shadow-md'
            : 'q6-dna-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition';
        });
        checkReady();
      });
    });

    lensBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();
        this.tempState.lensEucarionteAnswer = btn.dataset.val;
        lensBtns.forEach((b) => {
          const active = b.dataset.val === btn.dataset.val;
          b.className = active
            ? 'q6-lens-btn w-full p-2.5 rounded-xl bg-teal-600 text-left text-xs font-extrabold text-white border-2 border-teal-300 transition shadow-md'
            : 'q6-lens-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition';
        });
        checkReady();
      });
    });
  }

  /* ========================================================================
     PERGUNTA 7 (Página 5): Outros Tipos, Acelulares e Megavirus chilensis
     ======================================================================== */
  renderQ7VirusExpedition(stageEl) {
    this.tempState = {
      virusTypeAnswer: null,
      realPhotoAnswer: null
    };

    stageEl.innerHTML = `
      <div class="space-y-6">
        <!-- Comparação das 2 Imagens da Página 5 -->
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div id="q7-photo-real"
            class="bg-slate-800/90 rounded-3xl p-4 border-4 border-slate-700 hover:border-purple-400 transition cursor-pointer flex flex-col items-center text-center">
            <span class="px-3 py-1 rounded-full bg-purple-900 text-purple-200 font-extrabold text-xs mb-2">
              📸 IMAGEM 1
            </span>
            <img src="assets/img/megavirus_real.jpg" alt="Megavirus chilensis Real" class="h-40 w-auto object-contain rounded-xl mb-2" />
            <p class="text-xs text-slate-300">
              Estrutura escura com cápsula densa e pelinhos ao redor vista em microscópio eletrônico
            </p>
          </div>

          <div id="q7-photo-cartoon"
            class="bg-slate-800/90 rounded-3xl p-4 border-4 border-slate-700 hover:border-purple-400 transition cursor-pointer flex flex-col items-center text-center">
            <span class="px-3 py-1 rounded-full bg-purple-900 text-purple-200 font-extrabold text-xs mb-2">
              🎨 IMAGEM 2
            </span>
            <img src="assets/img/virus_desenho.jpg" alt="Desenho de Vírus" class="h-40 w-auto object-contain rounded-xl mb-2" />
            <p class="text-xs text-slate-300">
              Desenho clássico em preto e branco cheio de pinos redondinhos
            </p>
          </div>
        </div>

        <!-- Duas Perguntas da Expedição Página 5 -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div class="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4">
            <p class="text-sm font-extrabold text-white mb-3">
              1. Como são chamados os seres que NÃO têm células (como os vírus, que têm apenas DNA e capsídeo)?
            </p>
            <div class="space-y-2">
              <button type="button" data-val="acelulares" class="q7-type-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                🧬 Acelulares (não possuem células e dependem de outros seres vivos)
              </button>
              <button type="button" data-val="pluricelulares" class="q7-type-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                🐘 Pluricelulares (formados por trilhões de células animais)
              </button>
            </div>
          </div>

          <div class="bg-slate-800/90 border-2 border-slate-700 rounded-2xl p-4">
            <p class="text-sm font-extrabold text-white mb-3">
              2. Em 2011 na França acharam o <em>Megavirus chilensis</em> (o maior vírus do mundo). Qual imagem mostra <strong>COMO ELE É DE VERDADE</strong>?
            </p>
            <div class="space-y-2">
              <button type="button" data-val="img1" class="q7-photo-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                📸 A IMAGEM 1 ("Como é" de verdade na foto cientifica!)
              </button>
              <button type="button" data-val="img2" class="q7-photo-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition">
                🎨 A IMAGEM 2 ("Como pensamos que é" nos desenhos)
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    const typeBtns = stageEl.querySelectorAll('.q7-type-btn');
    const photoBtns = stageEl.querySelectorAll('.q7-photo-btn');
    const cardReal = document.getElementById('q7-photo-real');
    const cardCartoon = document.getElementById('q7-photo-cartoon');

    const updatePhotoSelection = (val) => {
      this.tempState.realPhotoAnswer = val;
      photoBtns.forEach((b) => {
        const active = b.dataset.val === val;
        b.className = active
          ? 'q7-photo-btn w-full p-2.5 rounded-xl bg-purple-600 text-left text-xs font-extrabold text-white border-2 border-purple-300 transition shadow-md'
          : 'q7-photo-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition';
      });
      if (cardReal && cardCartoon) {
        cardReal.classList.toggle('border-purple-400', val === 'img1');
        cardCartoon.classList.toggle('border-purple-400', val === 'img2');
      }
      this.enableVerifyButton(Boolean(this.tempState.virusTypeAnswer && this.tempState.realPhotoAnswer));
    };

    typeBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();
        this.tempState.virusTypeAnswer = btn.dataset.val;
        typeBtns.forEach((b) => {
          const active = b.dataset.val === btn.dataset.val;
          b.className = active
            ? 'q7-type-btn w-full p-2.5 rounded-xl bg-purple-600 text-left text-xs font-extrabold text-white border-2 border-purple-300 transition shadow-md'
            : 'q7-type-btn w-full p-2.5 rounded-xl bg-slate-700 hover:bg-slate-600 text-left text-xs font-bold text-slate-100 border-2 border-slate-600 transition';
        });
        this.enableVerifyButton(Boolean(this.tempState.virusTypeAnswer && this.tempState.realPhotoAnswer));
      });
    });

    photoBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();
        updatePhotoSelection(btn.dataset.val);
      });
    });

    if (cardReal) {
      cardReal.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();
        updatePhotoSelection('img1');
      });
    }
    if (cardCartoon) {
      cardCartoon.addEventListener('click', () => {
        if (this.questionAnswered) return;
        if (window.soundManager) window.soundManager.playClick();
        updatePhotoSelection('img2');
      });
    }
  }

  /* ========================================================================
     VERIFICAÇÃO DE RESPOSTA E FEEDBACK PEDAGÓGICO ACOLHEDOR
     ======================================================================== */
  verifyCurrentAnswer() {
    if (this.questionAnswered) return;

    const q = this.questions[this.currentIndex];
    let isCorrect = false;

    switch (q.interactionType) {
      case 'match-cells':
        isCorrect =
          this.tempState.assignments.leftCard === 'eucarionte' &&
          this.tempState.assignments.rightCard === 'procarionte';
        break;

      case 'match-complexity':
        isCorrect =
          this.tempState.assignments.eucarionte === 'complexa' &&
          this.tempState.assignments.procarionte === 'simples';
        break;

      case 'select-kingdoms': {
        const s = this.tempState.selectedKingdoms;
        isCorrect =
          s.size === 4 &&
          s.has('protista') &&
          s.has('fungi') &&
          s.has('plantae') &&
          s.has('animalia');
        break;
      }

      case 'plant-animal-lab':
        isCorrect =
          this.tempState.q4_bone === 'osteocitos' &&
          this.tempState.q4_stand === 'parar_em_pe' &&
          this.tempState.q4_green === 'clorofila';
        break;

      case 'cell-3d-nucleus':
        isCorrect = this.tempState.selectedPartId === 'nucleo';
        break;

      case 'microscope-real-images':
        isCorrect =
          this.tempState.dnaAnswer === 'espalhado' &&
          this.tempState.lensEucarionteAnswer === 'lente_a';
        break;

      case 'virus-expedition':
        isCorrect =
          this.tempState.virusTypeAnswer === 'acelulares' &&
          this.tempState.realPhotoAnswer === 'img1';
        break;
    }

    this.questionAnswered = true;
    if (isCorrect) {
      this.score++;
      if (window.soundManager) window.soundManager.playSuccess();
    } else {
      if (window.soundManager) window.soundManager.playGentleHint();
    }

    this.resultsHistory.push({
      questionId: q.id,
      title: q.title,
      pageRef: q.pageRef,
      isCorrect: isCorrect,
      explanation: q.explanation
    });

    const feedbackBox = document.getElementById('q-feedback-box');
    const btnVerify = document.getElementById('btn-verify-answer');
    const btnNext = document.getElementById('btn-next-question');

    if (feedbackBox) {
      feedbackBox.classList.remove('hidden');
      if (isCorrect) {
        feedbackBox.className = 'mt-6 p-4 rounded-2xl bg-emerald-100 border-2 border-emerald-500 text-emerald-950 flex items-start gap-3 shadow-sm';
        feedbackBox.innerHTML = `
          <div class="text-2xl">🎉</div>
          <div>
            <div class="font-extrabold text-base">Mandou muito bem! Resposta correta!</div>
            <p class="text-xs sm:text-sm mt-1 leading-relaxed">${q.explanation}</p>
          </div>
        `;
      } else {
        feedbackBox.className = 'mt-6 p-4 rounded-2xl bg-amber-100 border-2 border-amber-500 text-amber-950 flex items-start gap-3 shadow-sm';
        feedbackBox.innerHTML = `
          <div class="text-2xl">💡</div>
          <div>
            <div class="font-extrabold text-base">Quase lá! Vamos lembrar juntos:</div>
            <p class="text-xs sm:text-sm mt-1 leading-relaxed">${q.explanation}</p>
          </div>
        `;
      }
    }

    if (btnVerify) btnVerify.classList.add('hidden');
    if (btnNext) {
      btnNext.classList.remove('hidden');
      const isLast = this.currentIndex === this.questions.length - 1;
      btnNext.innerHTML = isLast
        ? '<span>🏆 Ver Meu Resultado Final!</span>'
        : '<span>Próxima Missão ➡️</span>';
    }

    this.updateProgressUI();
  }

  goToNextQuestion() {
    if (window.soundManager) window.soundManager.playClick();

    if (this.currentIndex < this.questions.length - 1) {
      this.currentIndex++;
      this.renderCurrentQuestion();
    } else {
      this.showFinalResults();
    }
  }

  /* ========================================================================
     TELA FINAL DE RESULTADOS (Mostra quantas o aluno acertou e resumo)
     ======================================================================== */
  showFinalResults() {
    if (window.cell3DExplorer) {
      window.cell3DExplorer.destroy();
    }

    document.body.className = 'theme-welcome';

    const quizScreen = document.getElementById('screen-quiz');
    const topHud = document.getElementById('top-quiz-hud');
    const resultScreen = document.getElementById('screen-results');

    if (quizScreen) quizScreen.classList.add('hidden');
    if (topHud) topHud.classList.add('hidden');
    if (resultScreen) {
      resultScreen.classList.remove('hidden');
      resultScreen.classList.add('zoom-transition-enter');
    }

    if (window.soundManager) {
      window.soundManager.playFanfare();
    }
    this.launchConfetti();

    const total = this.questions.length;
    const scoreNumberEl = document.getElementById('result-score-number');
    const titleEl = document.getElementById('result-Headline');
    const messageEl = document.getElementById('result-message');
    const listEl = document.getElementById('result-summary-list');

    if (scoreNumberEl) {
      scoreNumberEl.textContent = `${this.score} de ${total}`;
    }

    if (titleEl && messageEl) {
      if (this.score === total) {
        titleEl.textContent = '🌟 Cientista Mestre das Células!';
        messageEl.textContent = 'Parabéns! Você acertou todas as perguntas da atividade e dominou o mundo microscópico!';
      } else if (this.score >= 5) {
        titleEl.textContent = '🔬 Grande Explorador do Laboratório!';
        messageEl.textContent = `Você acertou ${this.score} de ${total} perguntas! Mandou super bem no conhecimento sobre as células!`;
      } else {
        titleEl.textContent = '🌱 Jovem Cientista em Treinamento!';
        messageEl.textContent = `Você acertou ${this.score} de ${total} perguntas! Que tal revisar o resumo abaixo e jogar mais uma vez?`;
      }
    }

    if (listEl) {
      listEl.innerHTML = '';
      this.resultsHistory.forEach((item, idx) => {
        const row = document.createElement('div');
        row.className = item.isCorrect
          ? 'p-3.5 rounded-2xl bg-emerald-50 border-2 border-emerald-200 flex items-start gap-3 text-left'
          : 'p-3.5 rounded-2xl bg-amber-50 border-2 border-amber-200 flex items-start gap-3 text-left';
        row.innerHTML = `
          <div class="text-xl shrink-0">${item.isCorrect ? '✅' : '💡'}</div>
          <div>
            <div class="text-xs font-extrabold uppercase tracking-wide ${item.isCorrect ? 'text-emerald-700' : 'text-amber-700'}">
              Pergunta ${idx + 1} • ${item.pageRef}
            </div>
            <div class="font-bold text-slate-800 text-sm">${item.title}</div>
            <div class="text-xs text-slate-600 mt-1">${item.explanation}</div>
          </div>
        `;
        listEl.appendChild(row);
      });
    }
  }

  launchConfetti() {
    const colors = ['#10b981', '#3b82f6', '#f59e0b', '#ec4899', '#8b5cf6'];
    for (let i = 0; i < 40; i++) {
      const conf = document.createElement('div');
      conf.className = 'confetti-piece';
      conf.style.left = `${Math.random() * 100}vw`;
      conf.style.backgroundColor = colors[i % colors.length];
      conf.style.animationDelay = `${Math.random() * 0.8}s`;
      document.body.appendChild(conf);
      setTimeout(() => conf.remove(), 3500);
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.cellQuizApp = new CellQuizApp();
  window.cellQuizApp.init();
});
