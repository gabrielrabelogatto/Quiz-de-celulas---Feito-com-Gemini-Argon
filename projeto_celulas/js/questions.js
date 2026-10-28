/**
 * ==========================================================================
 * BANCO DE DADOS E CONFIGURAÇÃO DAS 7 MISSÕES (PERGUNTAS INTERATIVAS)
 * Baseado 100% na apostila "Atividade de Células" (Páginas 1 a 5)
 * ==========================================================================
 */

window.QUESTIONS_DATA = [
  {
    id: 1,
    pageRef: 'Página 1 • Tipos de Células',
    themeClass: 'theme-lab-pastel',
    isDarkTheme: false,
    environmentBadge: '🔬 Bancada de Identificação Celular',
    title: 'Quem é quem no mundo das células?',
    subtitle: 'A célula é a menor parte de um ser vivo! Clique em um crachá abaixo e depois clique na célula correspondente para identificá-las:',
    interactionType: 'match-cells',
    explanation: 'Excelente! A célula Eucarionte tem núcleo organizado e várias organelas, enquanto a célula Procarionte (como as bactérias, com esse rabinho chamado flagelo) tem formato mais simples!'
  },
  {
    id: 2,
    pageRef: 'Página 1 • Estrutura Celular',
    themeClass: 'theme-blueprint',
    isDarkTheme: false,
    environmentBadge: '⚙️ Scanner de Estrutura e Complexidade',
    title: 'Estrutura Mais Complexa vs. Mais Simples',
    subtitle: 'Agora que você conhece as duas células, marque nos painéis abaixo qual delas tem a estrutura MAIS COMPLEXA e qual é MUITO MAIS SIMPLES:',
    interactionType: 'match-complexity',
    explanation: 'Na mosca! Como vimos na Página 1 da atividade: as células Eucariontes são as células mais estruturadas/complexas, e as células Procariontes são muito mais simples!'
  },
  {
    id: 3,
    pageRef: 'Página 1 • Os Reinos dos Seres Vivos',
    themeClass: 'theme-reinos',
    isDarkTheme: false,
    environmentBadge: '🌿 Museu Vivo dos Reinos',
    title: 'Onde encontramos as Células Eucariontes?',
    subtitle: 'As células eucariontes estão presentes em organismos unicelulares ou pluricelulares de 4 Reinos específicos. Selecione exatamente os 4 Reinos corretos na vitrine abaixo:',
    interactionType: 'select-kingdoms',
    explanation: 'Perfeito! Na Página 1 aprendemos que as células eucariontes podem ser encontradas nos 4 Reinos: Protista, Fungi, Plantae e Animalia!'
  },
  {
    id: 4,
    pageRef: 'Página 2 • Células Animais e Vegetais',
    themeClass: 'theme-estufa',
    isDarkTheme: false,
    environmentBadge: '🌱 Estufa Botânica & Laboratório do Corpo',
    title: 'Segredos das Células Animais e Vegetais!',
    subtitle: 'Complete as 3 descobertas da Página 2 escolhendo a peça certa para cada cartão:',
    interactionType: 'plant-animal-lab',
    explanation: 'Show de bola! Os osteócitos formam nossos ossos (criando um líquido que endurece com o tempo), a base rígida mantém a planta em pé, e a clorofila realiza a fotossíntese e dá a cor verde!'
  },
  {
    id: 5,
    pageRef: 'Página 3 • Dentro da Célula Eucarionte (3D)',
    themeClass: 'theme-3d-space',
    isDarkTheme: true,
    environmentBadge: '🪐 Simulador Holográfico 3D',
    title: 'Missão 3D: Onde fica guardado o DNA?',
    subtitle: 'Gire a célula eucarionte 3D abaixo com o mouse ou dedo! Depois, clique diretamente no NÚCLEO (ou use os botões do painel) para guardar o código de DNA no lugar certo:',
    interactionType: 'cell-3d-nucleus',
    explanation: 'Incrível! Na célula eucarionte, a membrana plasmática controla o que entra e sai, o citoplasma guarda as organelas, e o DNA (nosso "código" de programação) fica bem guardado dentro do NÚCLEO!'
  },
  {
    id: 6,
    pageRef: 'Página 4 • DNA Procarionte e Imagens Reais',
    themeClass: 'theme-microscope',
    isDarkTheme: true,
    environmentBadge: '🔭 Microscópio Óptico de Alta Precisão',
    title: 'DNA Espalhado e Lentes Reais!',
    subtitle: 'Use o controle de foco do microscópio para ver as imagens reais da Página 4 com nitidez e responda às duas perguntas do laboratório:',
    interactionType: 'microscope-real-images',
    explanation: 'Olho de cientista! As células procariontes não têm núcleo definido (o DNA fica espalhado, meio "bagunçado"), e na Lente A vemos o amontoado de células eucariontes com seus núcleos visíveis!'
  },
  {
    id: 7,
    pageRef: 'Página 5 • Outros Tipos e o Maior Vírus do Mundo',
    themeClass: 'theme-expedition',
    isDarkTheme: true,
    environmentBadge: '🦠 Expedição Científica • França, 2011',
    title: 'O Mistério dos Vírus e o Megavirus chilensis!',
    subtitle: 'Os vírus não têm células e possuem apenas DNA e uma proteção chamada capsídeo. Complete o relatório final da Página 5:',
    interactionType: 'virus-expedition',
    explanation: 'Missão cumprida com louvor! Os vírus são seres acelulares (têm apenas material genético e capsídeo), e a Foto 1 mostra a imagem real de microscópio do Megavirus chilensis achado em 2011!'
  }
];
