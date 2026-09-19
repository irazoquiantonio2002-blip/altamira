/* ============================================
   ALTAMIRA LA CIMA — Cosmos Hero
   Three.js scroll-driven flythrough (starfield,
   nebula, "La Cima" mountain silhouettes), ported
   from a React/shadcn demo to plain JS + ES modules
   so the site stays a zero-build static project.
   ============================================ */

import * as THREE from 'three';

class CosmosHero {
  constructor() {
    this.section = document.getElementById('hero');
    this.pinEl = document.querySelector('.hero__pin');
    this.canvas = document.getElementById('hero-canvas');
    this.stages = Array.from(document.querySelectorAll('.hero__stage'));
    this.backdropEl = document.querySelector('.hero__backdrop');
    this.backdropImg = document.querySelector('.hero__backdrop img');
    this.studyIcon = document.getElementById('hero-study-icon');
    this.progressFill = document.getElementById('hero-progress-fill');
    this.progressCount = document.getElementById('hero-progress-count');

    if (!this.section || !this.pinEl || !this.canvas || !this.stages.length) return;

    this.reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isNarrow = window.innerWidth < 768;
    this.totalStages = this.stages.length;

    this.three = { stars: [], mountains: [], nebula: null, atmosphere: null };
    this.cameraKeyframes = [
      { x: 0, y: 26, z: 260 },
      { x: 0, y: 34, z: -60 },
      { x: 0, y: 44, z: -640 },
    ];
    this.cameraTarget = { ...this.cameraKeyframes[0] };
    this.cameraSmooth = { ...this.cameraKeyframes[0] };
    this.rafId = null;

    const ok = this.initThree();
    if (!ok) {
      this.section.classList.add('hero--fallback');
      if (this.stages[0]) this.stages[0].style.opacity = 1;
      return;
    }

    this.splitFirstTitle();
    this.playIntro();
    this.bindScroll();
    this.bindResize();
    this.animate();
  }

  /* ── Three.js scene setup ── */
  initThree() {
    try {
      this.scene = new THREE.Scene();
      this.scene.fog = new THREE.FogExp2(0x04070d, 0.00028);

      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      this.camera.position.set(this.cameraTarget.x, this.cameraTarget.y, this.cameraTarget.z);

      this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = 0.5;
      this.renderer.setClearColor(0x000000, 0); // truly transparent — the real photo sits behind this canvas

      this.createStarField();
      this.createNebula();
      this.createMountains();
      this.createAtmosphere();

      /* A real point on the front mountain's ridge (right side) — a
         genuine local peak from that mesh's own geometry, not a guess.
         Projected to screen space every frame in animate(), so the
         study icon tracks the mountain through the whole camera move
         instead of a CSS position that only happened to line up once. */
      if (this.studyIcon) {
        /* Portrait phones have a much narrower horizontal field of view
           than desktop at the same vertical FOV, so a point that's
           comfortably on-screen on desktop can sit entirely outside the
           frustum on mobile — needs its own, more centered anchor. */
        this.iconAnchor3D = this.isNarrow
          ? new THREE.Vector3(70, -120, -50)
          : new THREE.Vector3(280, -150, -50);
        this.iconBaseDist = this.camera.position.distanceTo(this.iconAnchor3D);
      }

      return true;
    } catch (err) {
      console.warn('CosmosHero: WebGL unavailable, falling back to static hero.', err);
      return false;
    }
  }

  createStarField() {
    const starCount = this.isNarrow ? 900 : 2600;
    const layerCount = this.isNarrow ? 2 : 2;

    for (let i = 0; i < layerCount; i++) {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(starCount * 3);
      const colors = new Float32Array(starCount * 3);
      const sizes = new Float32Array(starCount);

      for (let j = 0; j < starCount; j++) {
        const radius = 200 + Math.random() * 800;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(Math.random() * 2 - 1);

        positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
        positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
        positions[j * 3 + 2] = radius * Math.cos(phi);

        const color = new THREE.Color();
        const pick = Math.random();
        if (pick < 0.55) {
          color.setHSL(0.58, 0.12, 0.93); // near-white, faint cool tint
        } else if (pick < 0.92) {
          color.setHSL(0.58, 0.55, 0.68); // brand blue-300
        } else {
          color.setHSL(0.11, 0.45, 0.72); // sparse warm gold sparkle
        }

        colors[j * 3] = color.r;
        colors[j * 3 + 1] = color.g;
        colors[j * 3 + 2] = color.b;

        sizes[j] = Math.random() * 2 + 0.5;
      }

      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
      geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

      const material = new THREE.ShaderMaterial({
        uniforms: { time: { value: 0 }, depth: { value: i } },
        vertexShader: `
          attribute float size;
          attribute vec3 color;
          varying vec3 vColor;
          uniform float time;
          uniform float depth;

          void main() {
            vColor = color;
            vec3 pos = position;

            float angle = time * 0.05 * (1.0 - depth * 0.3);
            mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
            pos.xy = rot * pos.xy;

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = size * (300.0 / -mvPosition.z);
            gl_Position = projectionMatrix * mvPosition;
          }
        `,
        fragmentShader: `
          varying vec3 vColor;
          void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
            gl_FragColor = vec4(vColor, opacity);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const stars = new THREE.Points(geometry, material);
      this.scene.add(stars);
      this.three.stars.push(stars);
    }
  }

  createNebula() {
    const geometry = new THREE.PlaneGeometry(8000, 4000, 80, 80);
    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        color1: { value: new THREE.Color(0x192e5e) },
        color2: { value: new THREE.Color(0x429be3) },
        opacity: { value: 0.18 },
      },
      vertexShader: `
        varying vec2 vUv;
        varying float vElevation;
        uniform float time;

        void main() {
          vUv = uv;
          vec3 pos = position;
          float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
          pos.z += elevation;
          vElevation = elevation;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color1;
        uniform vec3 color2;
        uniform float opacity;
        uniform float time;
        varying vec2 vUv;
        varying float vElevation;

        void main() {
          float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
          vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
          float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
          alpha *= 1.0 + vElevation * 0.01;
          gl_FragColor = vec4(color, alpha);
        }
      `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });

    const nebula = new THREE.Mesh(geometry, material);
    nebula.position.z = -1050;
    this.scene.add(nebula);
    this.three.nebula = nebula;
  }

  /* "La Cima" — layered mountain silhouettes in brand navy, standing
     in for generic sci-fi terrain. Fits the school's own name. */
  createMountains() {
    const layers = [
      { z: -50, y: -32, height: 32, color: 0x0e2150, opacity: 1 },
      { z: -100, y: -44, height: 45, color: 0x192e5e, opacity: 0.85 },
      { z: -150, y: -56, height: 58, color: 0x1c5596, opacity: 0.55 },
      { z: -200, y: -68, height: 70, color: 0x376fb0, opacity: 0.32 },
    ];

    layers.forEach((layer, index) => {
      const points = [];
      const segments = 48;

      for (let i = 0; i <= segments; i++) {
        const x = (i / segments - 0.5) * 1000;
        const y =
          Math.sin(i * 0.11 + index) * layer.height +
          Math.sin(i * 0.045 + index * 2) * layer.height * 0.5 -
          90;
        points.push(new THREE.Vector2(x, y));
      }
      points.push(new THREE.Vector2(5000, -400));
      points.push(new THREE.Vector2(-5000, -400));

      const shape = new THREE.Shape(points);
      const geometry = new THREE.ShapeGeometry(shape);
      const material = new THREE.MeshBasicMaterial({
        color: layer.color,
        transparent: true,
        opacity: layer.opacity,
        side: THREE.DoubleSide,
      });

      const mountain = new THREE.Mesh(geometry, material);
      mountain.position.z = layer.z;
      mountain.position.y = layer.y;
      mountain.userData = { baseOpacity: layer.opacity, index };
      this.scene.add(mountain);
      this.three.mountains.push(mountain);
    });
  }

  createAtmosphere() {
    const geometry = new THREE.SphereGeometry(600, 32, 32);
    const material = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform float time;
        void main() {
          float intensity = pow(0.5 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.0);
          intensity = clamp(intensity, 0.0, 0.5);
          vec3 atmosphere = vec3(0.259, 0.608, 0.890) * intensity;
          float pulse = sin(time * 2.0) * 0.06 + 0.94;
          atmosphere *= pulse;
          gl_FragColor = vec4(atmosphere, intensity * 0.1);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
    });

    const atmosphere = new THREE.Mesh(geometry, material);
    this.scene.add(atmosphere);
    this.three.atmosphere = atmosphere;
  }

  /* ── Title entrance: split into chars for a GSAP stagger-in ── */
  splitFirstTitle() {
    const el = this.stages[0] && this.stages[0].querySelector('.hero__title');
    if (!el) return;
    const text = el.textContent;
    el.innerHTML = '';
    text.split('').forEach((ch) => {
      const span = document.createElement('span');
      span.className = 'hero__title-char';
      span.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(span);
    });
  }

  playIntro() {
    if (typeof window.gsap === 'undefined') return;
    const stage0 = this.stages[0];
    if (!stage0) return;

    const eyebrow = stage0.querySelector('.eyebrow');
    const chars = stage0.querySelectorAll('.hero__title-char');
    const lines = stage0.querySelectorAll('.hero__subtitle-line');

    gsap.set(stage0, { opacity: 1 });

    const tl = gsap.timeline({ delay: 0.2 });
    if (eyebrow) tl.from(eyebrow, { opacity: 0, y: -16, duration: 0.7, ease: 'power3.out' });
    if (chars.length) {
      tl.from(chars, { y: 110, opacity: 0, duration: 1.2, stagger: 0.035, ease: 'power4.out' }, '-=0.35');
    }
    if (lines.length) {
      tl.from(lines, { y: 26, opacity: 0, duration: 0.8, stagger: 0.14, ease: 'power3.out' }, '-=0.6');
    }
  }

  /* ── Scroll-driven camera flythrough ── */
  bindScroll() {
    if (this.reduceMotion || typeof window.gsap === 'undefined' || typeof window.ScrollTrigger === 'undefined') {
      if (this.stages[0]) this.stages[0].style.opacity = 1;
      return;
    }

    gsap.registerPlugin(ScrollTrigger);
    this.navbarEl = document.getElementById('navbar-main');

    ScrollTrigger.create({
      trigger: this.pinEl,
      start: 'top top',
      end: `+=${(this.totalStages - 1) * 100}%`,
      pin: true,
      scrub: 0.6,
      onUpdate: (self) => this.render(self.progress),
      /* The navbar must stay transparent for the *entire* pinned journey —
         raw window.scrollY passes 50px almost immediately, long before
         the pin actually releases, so it needs to key off the pin's own
         start/end instead of a scroll-position guess. */
      onLeave: () => this.navbarEl && this.navbarEl.classList.add('scrolled'),
      onEnterBack: () => this.navbarEl && this.navbarEl.classList.remove('scrolled'),
    });

    this.render(0);
  }

  render(progress) {
    const stageFloat = progress * (this.totalStages - 1);
    const maxIdx = this.cameraKeyframes.length - 2;
    const idx = Math.min(Math.floor(stageFloat), maxIdx);
    const localT = stageFloat - idx;
    const a = this.cameraKeyframes[idx];
    const b = this.cameraKeyframes[idx + 1];

    this.cameraTarget.x = a.x + (b.x - a.x) * localT;
    this.cameraTarget.y = a.y + (b.y - a.y) * localT;
    this.cameraTarget.z = a.z + (b.z - a.z) * localT;

    this.updateStageVisibility(stageFloat);
    this.updateMountainFade(progress);
    this.updateProgressUI(progress, Math.round(stageFloat));

    /* The real photo carries most of the depth cue — an aggressive
       push-in as you scroll through the 3 acts (up to 3.2x by the
       end), darkening from a deep blue down to near-black so it reads
       as diving into the photo, not just a bigger crop of it. */
    if (this.backdropImg) {
      this.backdropImg.style.transform = `scale(${1 + progress * 2.2})`;
    }
    if (this.backdropEl) {
      this.backdropEl.style.setProperty('--dark', (0.97 + progress * 0.03).toFixed(2));
    }
  }

  updateStageVisibility(stageFloat) {
    this.stages.forEach((stage, i) => {
      const dist = Math.abs(stageFloat - i);
      let op = 1;
      if (dist > 0.15) op = Math.max(0, 1 - (dist - 0.15) / 0.35);
      stage.style.opacity = op;
      stage.style.transform = `translate(-50%, calc(-50% + ${(1 - op) * 24}px))`;

      /* Interactive children (e.g. the closing CTA) must not stay
         clickable while their stage is faded out and overlapping others. */
      const cta = stage.querySelector('.hero__stage-cta');
      if (cta) cta.style.pointerEvents = op > 0.6 ? 'auto' : 'none';
    });
  }

  updateMountainFade(progress) {
    const mult = progress > 0.62 ? Math.max(0, 1 - (progress - 0.62) / 0.22) : 1;
    this.three.mountains.forEach((m) => {
      m.material.opacity = m.userData.baseOpacity * mult;
    });
    /* Same mult as the mountains, on purpose — the icon sits on that
       ridge, so it must vanish in lockstep with it, never outliving
       or lagging the mountain and reading as a sticker floating loose. */
    if (this.studyIcon) this.studyIcon.style.opacity = 0.92 * mult;
  }

  updateProgressUI(progress, stageIndex) {
    if (this.progressFill) this.progressFill.style.width = `${progress * 100}%`;
    if (this.progressCount) {
      const cur = String(Math.min(Math.max(stageIndex, 0), this.totalStages - 1)).padStart(2, '0');
      const total = String(this.totalStages - 1).padStart(2, '0');
      this.progressCount.textContent = `${cur} / ${total}`;
    }
  }

  /* ── Render loop ── */
  animate() {
    this.rafId = requestAnimationFrame(() => this.animate());
    const time = performance.now() * 0.001;

    this.three.stars.forEach((s) => {
      if (s.material.uniforms) s.material.uniforms.time.value = time;
    });
    if (this.three.nebula) this.three.nebula.material.uniforms.time.value = time * 0.5;
    if (this.three.atmosphere) this.three.atmosphere.material.uniforms.time.value = time;

    const smoothing = 0.06;
    this.cameraSmooth.x += (this.cameraTarget.x - this.cameraSmooth.x) * smoothing;
    this.cameraSmooth.y += (this.cameraTarget.y - this.cameraSmooth.y) * smoothing;
    this.cameraSmooth.z += (this.cameraTarget.z - this.cameraSmooth.z) * smoothing;

    const floatX = Math.sin(time * 0.1) * 2;
    const floatY = Math.cos(time * 0.15) * 1;

    this.camera.position.set(
      this.cameraSmooth.x + floatX,
      this.cameraSmooth.y + floatY,
      this.cameraSmooth.z
    );
    this.camera.lookAt(0, 10, -600);

    /* Project the icon's real 3D anchor to screen space every frame —
       this is what makes it actually stay stuck to the mountain as the
       camera flies through, instead of a CSS position that only lines
       up at one scroll point and drifts everywhere else. */
    if (this.studyIcon && this.iconAnchor3D) {
      const viewSpace = this.iconAnchor3D.clone().applyMatrix4(this.camera.matrixWorldInverse);
      if (viewSpace.z < 0) {
        const projected = this.iconAnchor3D.clone().project(this.camera);
        const dist = this.camera.position.distanceTo(this.iconAnchor3D);
        const scale = this.iconBaseDist / dist;
        this.studyIcon.style.left = `${(projected.x * 0.5 + 0.5) * window.innerWidth}px`;
        this.studyIcon.style.top = `${(-projected.y * 0.5 + 0.5) * window.innerHeight}px`;
        this.studyIcon.style.transform = `translate(-50%, -100%) scale(${scale})`;
        this.studyIcon.style.visibility = 'visible';
      } else {
        this.studyIcon.style.visibility = 'hidden';
      }
    }

    this.three.mountains.forEach((m, i) => {
      const parallax = 1 + i * 0.5;
      m.position.x = Math.sin(time * 0.1) * 2 * parallax;
    });

    this.renderer.render(this.scene, this.camera);
  }

  bindResize() {
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!this.camera || !this.renderer) return;
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        if (typeof window.ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
      }, 200);
    });
  }
}

document.addEventListener('DOMContentLoaded', () => new CosmosHero());
