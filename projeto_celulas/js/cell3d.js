/**
 * ==========================================================================
 * EXPLORADOR 3D DE CÉLULA EUCARIONTE (Three.js)
 * Permite que a criança gire uma célula 3D interativa em 360 graus,
 * explore as organelas e clique/coloque o marcador de DNA no NÚCLEO!
 * ==========================================================================
 */

class Cell3DExplorer {
  constructor() {
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.cellGroup = null;
    this.raycaster = null;
    this.mouse = null;
    this.animationFrameId = null;
    this.isDragging = false;
    this.prevMouse = { x: 0, y: 0 };
    this.dragDelta = 0;
    this.clickableParts = [];
    this.selectedPartName = null;
    this.dnaPinMesh = null;
    this.onSelectPartCallback = null;
  }

  init(containerId, onSelectPart) {
    this.destroy();
    this.onSelectPartCallback = onSelectPart;

    const container = document.getElementById(containerId);
    if (!container || typeof THREE === 'undefined') return;

    const width = container.clientWidth || 600;
    const height = container.clientHeight || 360;

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 100);
    this.camera.position.set(0, 3.2, 7.8);
    this.camera.lookAt(0, 0, 0);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.innerHTML = '';
    container.appendChild(this.renderer.domElement);

    // Iluminação suave e científica
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 0.9);
    dirLight1.position.set(6, 10, 7);
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf472b6, 0.65);
    dirLight2.position.set(-6, -5, 5);
    this.scene.add(dirLight2);

    this.cellGroup = new THREE.Group();
    this.scene.add(this.cellGroup);
    this.clickableParts = [];

    // 1. Membrana Plasmática (Camada exterior translúcida que decide o que entra e sai)
    const membraneGeo = new THREE.SphereGeometry(2.75, 40, 32);
    membraneGeo.scale(1.12, 0.72, 1.0);
    const membraneMat = new THREE.MeshPhongMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.24,
      shininess: 90,
      side: THREE.DoubleSide
    });
    const membraneMesh = new THREE.Mesh(membraneGeo, membraneMat);
    membraneMesh.userData = {
      id: 'membrana',
      title: 'Membrana Plasmática',
      desc: 'Fica na parte exterior da célula e decide o que entra e o que sai!'
    };
    this.cellGroup.add(membraneMesh);

    // Anel equatorial destacando o corte da Membrana Plasmática
    const ringGeo = new THREE.TorusGeometry(2.85, 0.11, 16, 64);
    ringGeo.scale(1.08, 0.96, 1.0);
    const ringMat = new THREE.MeshPhongMaterial({
      color: 0x0284c7,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.rotation.x = Math.PI / 2;
    ringMesh.userData = membraneMesh.userData;
    this.cellGroup.add(ringMesh);
    this.clickableParts.push(ringMesh);

    // 2. Citoplasma (Líquido gelatinoso interno que mantém as organelas)
    const cytoGeo = new THREE.CylinderGeometry(2.75, 2.55, 0.45, 40);
    cytoGeo.scale(1.08, 1.0, 0.96);
    const cytoMat = new THREE.MeshPhongMaterial({
      color: 0x6ee7b7,
      transparent: true,
      opacity: 0.48,
      shininess: 50
    });
    const cytoMesh = new THREE.Mesh(cytoGeo, cytoMat);
    cytoMesh.position.y = -0.15;
    cytoMesh.userData = {
      id: 'citoplasma',
      title: 'Citoplasma',
      desc: 'É o líquido dentro da célula que mantém as organelas no lugar!'
    };
    this.cellGroup.add(cytoMesh);
    this.clickableParts.push(cytoMesh);

    // 3. NÚCLEO (Alvo principal! Onde fica guardado o DNA da célula eucarionte)
    const nucleusGeo = new THREE.SphereGeometry(0.95, 32, 32);
    const nucleusMat = new THREE.MeshPhongMaterial({
      color: 0xa855f7,
      emissive: 0x6b21a8,
      emissiveIntensity: 0.35,
      shininess: 100
    });
    const nucleusMesh = new THREE.Mesh(nucleusGeo, nucleusMat);
    nucleusMesh.position.set(0, 0.25, 0);
    nucleusMesh.userData = {
      id: 'nucleo',
      title: 'Núcleo da Célula',
      desc: 'É aqui que fica guardado o DNA (o código com todas as informações da célula)!'
    };
    this.cellGroup.add(nucleusMesh);
    this.clickableParts.push(nucleusMesh);
    this.nucleusMesh = nucleusMesh;

    // Nucléolo brilhante dentro do núcleo
    const nucleolusGeo = new THREE.SphereGeometry(0.38, 24, 24);
    const nucleolusMat = new THREE.MeshBasicMaterial({ color: 0xfde047 });
    const nucleolusMesh = new THREE.Mesh(nucleolusGeo, nucleolusMat);
    nucleusMesh.add(nucleolusMesh);

    // 4. Organelas espalhadas pelo citoplasma (Mitocôndrias, vacúolos, etc.)
    const organellePositions = [
      { x: 1.65, y: 0.15, z: 0.65, color: 0xf97316, rot: 0.5 },
      { x: -1.65, y: 0.15, z: -0.55, color: 0xf97316, rot: -0.6 },
      { x: 1.15, y: 0.15, z: -1.35, color: 0xf43f5e, rot: 1.1 },
      { x: -1.25, y: 0.15, z: 1.25, color: 0xeab308, rot: 0.2 }
    ];

    organellePositions.forEach((pos) => {
      const orgGeo = new THREE.SphereGeometry(0.32, 20, 16);
      orgGeo.scale(1.6, 0.85, 0.9);
      const orgMat = new THREE.MeshPhongMaterial({
        color: pos.color,
        shininess: 80
      });
      const orgMesh = new THREE.Mesh(orgGeo, orgMat);
      orgMesh.position.set(pos.x, pos.y, pos.z);
      orgMesh.rotation.y = pos.rot;
      orgMesh.userData = {
        id: 'organelas',
        title: 'Organelas da Célula',
        desc: 'São como pequenos órgãos dentro do citoplasma, cada uma com sua função!'
      };
      this.cellGroup.add(orgMesh);
      this.clickableParts.push(orgMesh);
    });

    // Marcador de DNA 3D (aparece quando o aluno coloca o DNA em uma parte)
    const pinGroup = new THREE.Group();
    const pinSphere = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.32, 1),
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    pinSphere.position.y = 0.4;
    pinGroup.add(pinSphere);
    pinGroup.visible = false;
    this.cellGroup.add(pinGroup);
    this.dnaPinMesh = pinGroup;

    // Configuração de Raycaster para clique/toque nas estruturas 3D
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // Eventos de arrastar para girar e clicar para selecionar
    const domEl = this.renderer.domElement;

    this._onPointerDown = (e) => {
      this.isDragging = true;
      this.dragDelta = 0;
      const pt = this._getClientXY(e);
      this.prevMouse = { x: pt.x, y: pt.y };
    };

    this._onPointerMove = (e) => {
      if (!this.isDragging || !this.cellGroup) return;
      const pt = this._getClientXY(e);
      const dx = pt.x - this.prevMouse.x;
      const dy = pt.y - this.prevMouse.y;
      this.dragDelta += Math.abs(dx) + Math.abs(dy);

      this.cellGroup.rotation.y += dx * 0.01;
      this.cellGroup.rotation.x = Math.max(-0.6, Math.min(0.8, this.cellGroup.rotation.x + dy * 0.008));

      this.prevMouse = { x: pt.x, y: pt.y };
    };

    this._onPointerUp = (e) => {
      if (!this.isDragging) return;
      this.isDragging = false;
      if (this.dragDelta < 10) {
        this._handleCanvasClick(e, domEl);
      }
    };

    domEl.addEventListener('mousedown', this._onPointerDown);
    window.addEventListener('mousemove', this._onPointerMove);
    window.addEventListener('mouseup', this._onPointerUp);

    domEl.addEventListener('touchstart', this._onPointerDown, { passive: true });
    window.addEventListener('touchmove', this._onPointerMove, { passive: true });
    window.addEventListener('touchend', this._onPointerUp);

    this._onResize = () => {
      if (!container || !this.renderer || !this.camera) return;
      const w = container.clientWidth || 600;
      const h = container.clientHeight || 360;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    };
    window.addEventListener('resize', this._onResize);

    // Loop de animação
    const animate = () => {
      this.animationFrameId = requestAnimationFrame(animate);
      if (this.cellGroup && !this.isDragging) {
        this.cellGroup.rotation.y += 0.0045;
      }
      if (this.dnaPinMesh && this.dnaPinMesh.visible) {
        this.dnaPinMesh.rotation.y += 0.05;
      }
      if (this.renderer && this.scene && this.camera) {
        this.renderer.render(this.scene, this.camera);
      }
    };
    animate();
  }

  _getClientXY(e) {
    if (e.changedTouches && e.changedTouches.length > 0) {
      return { x: e.changedTouches[0].clientX, y: e.changedTouches[0].clientY };
    }
    return { x: e.clientX || 0, y: e.clientY || 0 };
  }

  _handleCanvasClick(e, domEl) {
    const rect = domEl.getBoundingClientRect();
    const pt = this._getClientXY(e);
    this.mouse.x = ((pt.x - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((pt.y - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.clickableParts, false);

    if (intersects.length > 0) {
      const hit = intersects[0].object;
      this.selectPartById(hit.userData.id, hit.position);
    }
  }

  selectPartById(partId, customPosition = null) {
    const partObj = this.clickableParts.find((m) => m.userData && m.userData.id === partId);
    if (!partObj) return;

    this.selectedPartName = partId;

    // Posiciona o marcador 3D sobre a parte escolhida
    if (this.dnaPinMesh) {
      this.dnaPinMesh.visible = true;
      if (partId === 'nucleo') {
        this.dnaPinMesh.position.set(0, 1.15, 0);
      } else if (partId === 'membrana') {
        this.dnaPinMesh.position.set(2.6, 0.35, 0);
      } else if (partId === 'citoplasma') {
        this.dnaPinMesh.position.set(-1.1, 0.35, 1.1);
      } else {
        const p = customPosition || partObj.position;
        this.dnaPinMesh.position.set(p.x, p.y + 0.45, p.z);
      }
    }

    if (window.soundManager) {
      window.soundManager.playPop();
    }

    if (this.onSelectPartCallback) {
      this.onSelectPartCallback(partObj.userData);
    }
  }

  destroy() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    if (this._onPointerMove) {
      window.removeEventListener('mousemove', this._onPointerMove);
      window.removeEventListener('mouseup', this._onPointerUp);
      window.removeEventListener('touchmove', this._onPointerMove);
      window.removeEventListener('touchend', this._onPointerUp);
    }
    if (this._onResize) {
      window.removeEventListener('resize', this._onResize);
    }
    this.scene = null;
    this.renderer = null;
  }
}

window.cell3DExplorer = new Cell3DExplorer();
