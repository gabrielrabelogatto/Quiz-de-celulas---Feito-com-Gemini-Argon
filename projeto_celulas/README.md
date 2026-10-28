# 🔬 Missão Células — Quiz Interativo de Biologia

Bem-vindo ao projeto **Missão Células**, uma atividade interativa e acolhedora criada especialmente para avaliar e reforçar o aprendizado dos alunos sobre a apostila **Atividade de Células** (Páginas 1 a 5).

## 📁 Estrutura de Pastas do Projeto

O código foi dividido de forma limpa, modular e comentada para facilitar qualquer leitura ou personalização futura:

```text
projeto_celulas/
├── index.html          # Estrutura principal das telas (Boas-vindas, Palco de Missões e Placar Final)
├── README.md           # Documentação e guia rápido do professor
├── css/
│   └── styles.css      # Estilos visuais, temas dinâmicos por pergunta, animações e lentes do microscópio
├── js/
│   ├── audio.js        # Música amigável gerada via Web Audio API e efeitos sonoros interativos
│   ├── cell3d.js       # Simulador 3D interativo da Célula Eucarionte (Three.js) para localizar o Núcleo/DNA
│   ├── questions.js    # Banco de dados das 7 perguntas interativas baseadas nas 5 páginas da apostila
│   └── app.js          # Controlador de progresso, verificação das respostas e tela final de pontuação
└── assets/
    └── img/            # Ilustrações e fotos reais extraídas diretamente do PDF original da atividade
        ├── celula_eucarionte.png
        ├── celula_procarionte.png
        ├── celula_vegetal.jpg
        ├── real_eucariontes.jpg
        ├── real_procariontes.png
        ├── megavirus_real.jpg
        └── virus_desenho.jpg
```

## ✨ Destaques Pedagógicos

- **Sem Cronômetro**: Como solicitado, não há qualquer contagem regressiva ou pressão de tempo, permitindo que cada criança responda com tranquilidade.
- **Musiquinha Amigável Integrada**: Utiliza o sintetizador nativo do navegador (*Web Audio API*), funcionando offline sem depender de arquivos externos de áudio, com botão no topo para ligar/silenciar a qualquer momento.
- **7 Ambientes Criativos (2 Perguntas Iniciais + 5 das Páginas do Material)**:
  1. **Pergunta 1 (Pág. 1)**: Bancada de Identificação Interativa (*Célula Eucarionte* vs. *Célula Procarionte*).
  2. **Pergunta 2 (Pág. 1)**: Scanner de Complexidade (*Mais Estruturada/Complexa* vs. *Muito Mais Simples*).
  3. **Pergunta 3 (Pág. 1)**: Museu Vivo dos 4 Reinos Eucariontes (*Protista, Fungi, Plantae e Animalia*).
  4. **Pergunta 4 (Pág. 2)**: Estufa Botânica & Corpo Humano (*Osteócitos*, *Base rígida da planta* e *Clorofila*).
  5. **Pergunta 5 (Pág. 3)**: Explorador de Célula Eucarionte em **3D** (Girar a célula em 360° e posicionar o DNA dentro do **Núcleo**).
  6. **Pergunta 6 (Pág. 4)**: Microscópio Óptico Real com ajuste de foco (*DNA espalhado na procarionte* e *Amontoado de células eucariontes*).
  7. **Pergunta 7 (Pág. 5)**: Expedição França 2011 (*Seres Acelulares / Capsídeo* e foto real do *Megavirus chilensis*).

## 🚀 Como Executar

Basta extrair o arquivo `.zip` e abrir o arquivo `index.html` em qualquer navegador moderno (Chrome, Edge, Firefox, Safari).
