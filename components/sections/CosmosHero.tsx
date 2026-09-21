"use client";

import { useEffect, useRef } from "react";
import { heroActs } from "@/lib/site-data";

/* ============================================================================
   COSMOS HERO — the original hero, restored.

   This is the scroll-driven Three.js flythrough from the pre-Next version of
   the site (`legacy/js/hero-cosmos.js`), ported across unchanged in behaviour:
   starfield, nebula, "La Cima" mountain silhouettes, the three-act camera
   move, the backdrop push-in, the GSAP title entrance, and the study icon
   that is projected from a real 3D point on the mountain ridge every frame so
   it stays stuck to the ridge as the camera flies through.

   The engine never needed React — the original's state lived in plain object
   properties — so the class is kept as-is and React only owns mounting,
   the markup, and teardown. Three.js, GSAP and ScrollTrigger are all loaded
   from an effect, so none of them sit in the initial bundle.
   ========================================================================= */

type Vec = { x: number; y: number; z: number };

export function CosmosHero() {
  const rootRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let teardown: (() => void) | undefined;

    (async () => {
      const [THREE, { gsap, ScrollTrigger }] = await Promise.all([
        import("three"),
        import("@/lib/gsap").then((m) => m.loadGsap()),
      ]);
      if (disposed) return;

      const section = root;
      const pinEl = root.querySelector<HTMLElement>(".hero__pin");
      const canvas = root.querySelector<HTMLCanvasElement>(".hero__canvas");
      const stages = Array.from(
        root.querySelectorAll<HTMLElement>(".hero__stage"),
      );
      const backdropEl = root.querySelector<HTMLElement>(".hero__backdrop");
      const backdropImg = root.querySelector<HTMLImageElement>(
        ".hero__backdrop img",
      );
      const studyIcon = root.querySelector<HTMLElement>(".hero__study-icon");
      const progressFill = root.querySelector<HTMLElement>(
        ".hero__progress-fill",
      );
      const progressCount = root.querySelector<HTMLElement>(
        ".hero__progress-count",
      );

      if (!pinEl || !canvas || !stages.length) return;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;
      const isNarrow = window.innerWidth < 768;
      const totalStages = stages.length;

      const three: {
        stars: InstanceType<typeof THREE.Points>[];
        mountains: InstanceType<typeof THREE.Mesh>[];
        nebula: InstanceType<typeof THREE.Mesh> | null;
        atmosphere: InstanceType<typeof THREE.Mesh> | null;
      } = { stars: [], mountains: [], nebula: null, atmosphere: null };

      const cameraKeyframes: Vec[] = [
        { x: 0, y: 26, z: 260 },
        { x: 0, y: 34, z: -60 },
        { x: 0, y: 44, z: -640 },
      ];
      const cameraTarget: Vec = { ...cameraKeyframes[0] };
      const cameraSmooth: Vec = { ...cameraKeyframes[0] };

      let scene: InstanceType<typeof THREE.Scene>;
      let camera: InstanceType<typeof THREE.PerspectiveCamera>;
      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      let iconAnchor3D: InstanceType<typeof THREE.Vector3> | null = null;
      let iconBaseDist = 1;
      let rafId = 0;

      /* ── Scene ─────────────────────────────────────────────────────── */

      function createStarField() {
        const starCount = isNarrow ? 900 : 2600;

        for (let i = 0; i < 2; i++) {
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
            if (pick < 0.55) color.setHSL(0.58, 0.12, 0.93);
            else if (pick < 0.92) color.setHSL(0.58, 0.55, 0.68);
            else color.setHSL(0.11, 0.45, 0.72);

            colors[j * 3] = color.r;
            colors[j * 3 + 1] = color.g;
            colors[j * 3 + 2] = color.b;
            sizes[j] = Math.random() * 2 + 0.5;
          }

          geometry.setAttribute(
            "position",
            new THREE.BufferAttribute(positions, 3),
          );
          geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
          geometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

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
          scene.add(stars);
          three.stars.push(stars);
        }
      }

      function createNebula() {
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
        scene.add(nebula);
        three.nebula = nebula;
      }

      /* "La Cima" — layered mountain silhouettes in brand navy, standing in
         for generic sci-fi terrain. Fits the school's own name. */
      function createMountains() {
        const layers = [
          { z: -50, y: -32, height: 32, color: 0x0e2150, opacity: 1 },
          { z: -100, y: -44, height: 45, color: 0x192e5e, opacity: 0.85 },
          { z: -150, y: -56, height: 58, color: 0x1c5596, opacity: 0.55 },
          { z: -200, y: -68, height: 70, color: 0x376fb0, opacity: 0.32 },
        ];

        layers.forEach((layer, index) => {
          const points: InstanceType<typeof THREE.Vector2>[] = [];
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
          scene.add(mountain);
          three.mountains.push(mountain);
        });
      }

      function createAtmosphere() {
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
          /* The intensity clamp and the low alpha are deliberate: without
             them this shader blows out to near-white by the final act and
             washes the hero copy away. */
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
        scene.add(atmosphere);
        three.atmosphere = atmosphere;
      }

      /* Chooses the ridge point the study icon sits on.
         Portrait screens have a much narrower horizontal field of view at the
         same vertical FOV, so the wide-screen point (x = 280) projects past
         the right edge on them and needs a more centred one. The choice is
         made on the screen's shape, not a width breakpoint: a tablet held
         upright is wider than 768px yet still portrait, and a width read
         once at load goes stale when the window is resized. Standard
         landscape desktops (16:10, 16:9) keep the wide-screen point. */
      function pickIconAnchor() {
        const wide = window.innerWidth / window.innerHeight >= 1.4;
        iconAnchor3D = wide
          ? new THREE.Vector3(280, -150, -50)
          : new THREE.Vector3(70, -120, -50);
        // Measured from the camera's starting position, so the icon's scale
        // stays consistent however far through the flythrough a resize lands.
        const k0 = cameraKeyframes[0];
        iconBaseDist = new THREE.Vector3(k0.x, k0.y, k0.z).distanceTo(
          iconAnchor3D,
        );
      }

      function initThree(): boolean {
        try {
          scene = new THREE.Scene();
          scene.fog = new THREE.FogExp2(0x04070d, 0.00028);

          camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000,
          );
          camera.position.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);

          renderer = new THREE.WebGLRenderer({
            canvas: canvas!,
            antialias: true,
            alpha: true,
          });
          renderer.setSize(window.innerWidth, window.innerHeight);
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 0.5;
          // Truly transparent — the real photo sits behind this canvas.
          renderer.setClearColor(0x000000, 0);

          createStarField();
          createNebula();
          createMountains();
          createAtmosphere();

          /* A real point on the front mountain's ridge. Projected to screen
             space every frame in animate(), so the study icon tracks the
             ridge through the whole camera move instead of a CSS position
             that only happens to line up once. */
          if (studyIcon) pickIconAnchor();

          return true;
        } catch (err) {
          console.warn(
            "CosmosHero: WebGL unavailable, falling back to static hero.",
            err,
          );
          return false;
        }
      }

      /* ── Title entrance ────────────────────────────────────────────── */

      function splitFirstTitle() {
        const el = stages[0]?.querySelector<HTMLElement>(".hero__title");
        if (!el) return;
        const text = el.textContent ?? "";
        el.innerHTML = "";
        text.split("").forEach((ch) => {
          const span = document.createElement("span");
          span.className = "hero__title-char";
          span.textContent = ch === " " ? " " : ch;
          el.appendChild(span);
        });
      }

      function playIntro() {
        const stage0 = stages[0];
        if (!stage0) return;

        const eyebrow = stage0.querySelector(".hero__eyebrow");
        const chars = stage0.querySelectorAll(".hero__title-char");
        const lines = stage0.querySelectorAll(".hero__subtitle-line");

        gsap.set(stage0, { opacity: 1 });

        const tl = gsap.timeline({ delay: 0.2 });
        if (eyebrow)
          tl.from(eyebrow, {
            opacity: 0,
            y: -16,
            duration: 0.7,
            ease: "power3.out",
          });
        if (chars.length)
          tl.from(
            chars,
            {
              y: 110,
              opacity: 0,
              duration: 1.2,
              stagger: 0.035,
              ease: "power4.out",
            },
            "-=0.35",
          );
        if (lines.length)
          tl.from(
            lines,
            {
              y: 26,
              opacity: 0,
              duration: 0.8,
              stagger: 0.14,
              ease: "power3.out",
            },
            "-=0.6",
          );
      }

      /* ── Scroll-driven camera flythrough ───────────────────────────── */

      function updateStageVisibility(stageFloat: number) {
        stages.forEach((stage, i) => {
          const dist = Math.abs(stageFloat - i);
          let op = 1;
          if (dist > 0.15) op = Math.max(0, 1 - (dist - 0.15) / 0.35);
          stage.style.opacity = String(op);
          stage.style.transform = `translate(-50%, calc(-50% + ${(1 - op) * 24}px))`;

          /* Interactive children must not stay clickable while their stage
             is faded out and overlapping the others. */
          const cta = stage.querySelector<HTMLElement>(".hero__stage-cta");
          if (cta) cta.style.pointerEvents = op > 0.6 ? "auto" : "none";
        });
      }

      function updateMountainFade(progress: number) {
        const mult =
          progress > 0.62 ? Math.max(0, 1 - (progress - 0.62) / 0.22) : 1;
        three.mountains.forEach((m) => {
          const mat = m.material as InstanceType<typeof THREE.MeshBasicMaterial>;
          mat.opacity = (m.userData.baseOpacity as number) * mult;
        });
        /* Same multiplier as the mountains, on purpose — the icon sits on
           that ridge, so it must vanish in lockstep with it rather than
           outliving it and reading as a sticker floating loose. */
        if (studyIcon) studyIcon.style.opacity = String(0.92 * mult);
      }

      function updateProgressUI(progress: number, stageIndex: number) {
        if (progressFill)
          progressFill.style.transform = `scaleX(${progress})`;
        if (progressCount) {
          const cur = String(
            Math.min(Math.max(stageIndex, 0), totalStages - 1),
          ).padStart(2, "0");
          const total = String(totalStages - 1).padStart(2, "0");
          progressCount.textContent = `${cur} / ${total}`;
        }
      }

      function render(progress: number) {
        const stageFloat = progress * (totalStages - 1);
        const maxIdx = cameraKeyframes.length - 2;
        const idx = Math.min(Math.floor(stageFloat), maxIdx);
        const localT = stageFloat - idx;
        const a = cameraKeyframes[idx];
        const b = cameraKeyframes[idx + 1];

        cameraTarget.x = a.x + (b.x - a.x) * localT;
        cameraTarget.y = a.y + (b.y - a.y) * localT;
        cameraTarget.z = a.z + (b.z - a.z) * localT;

        updateStageVisibility(stageFloat);
        updateMountainFade(progress);
        updateProgressUI(progress, Math.round(stageFloat));

        /* The real photo carries most of the depth cue — an aggressive
           push-in through the three acts, darkening as it goes so it reads
           as diving into the photo, not just a bigger crop of it. */
        if (backdropImg)
          backdropImg.style.transform = `scale(${1 + progress * 2.2})`;
        if (backdropEl)
          backdropEl.style.setProperty(
            "--dark",
            (0.72 + progress * 0.27).toFixed(2),
          );
      }

      function animate() {
        rafId = requestAnimationFrame(animate);
        const time = performance.now() * 0.001;

        three.stars.forEach((s) => {
          const mat = s.material as InstanceType<typeof THREE.ShaderMaterial>;
          if (mat.uniforms) mat.uniforms.time.value = time;
        });
        if (three.nebula) {
          const mat = three.nebula.material as InstanceType<
            typeof THREE.ShaderMaterial
          >;
          mat.uniforms.time.value = time * 0.5;
        }
        if (three.atmosphere) {
          const mat = three.atmosphere.material as InstanceType<
            typeof THREE.ShaderMaterial
          >;
          mat.uniforms.time.value = time;
        }

        const smoothing = 0.06;
        cameraSmooth.x += (cameraTarget.x - cameraSmooth.x) * smoothing;
        cameraSmooth.y += (cameraTarget.y - cameraSmooth.y) * smoothing;
        cameraSmooth.z += (cameraTarget.z - cameraSmooth.z) * smoothing;

        const floatX = Math.sin(time * 0.1) * 2;
        const floatY = Math.cos(time * 0.15) * 1;

        camera.position.set(
          cameraSmooth.x + floatX,
          cameraSmooth.y + floatY,
          cameraSmooth.z,
        );
        camera.lookAt(0, 10, -600);

        /* Project the icon's real 3D anchor to screen space every frame —
           this is what keeps it stuck to the mountain as the camera flies
           through, instead of a CSS position that lines up at exactly one
           scroll point and drifts everywhere else. */
        if (studyIcon && iconAnchor3D) {
          const viewSpace = iconAnchor3D
            .clone()
            .applyMatrix4(camera.matrixWorldInverse);
          if (viewSpace.z < 0) {
            const projected = iconAnchor3D.clone().project(camera);
            const dist = camera.position.distanceTo(iconAnchor3D);
            const scale = iconBaseDist / dist;
            studyIcon.style.left = `${(projected.x * 0.5 + 0.5) * window.innerWidth}px`;
            studyIcon.style.top = `${(-projected.y * 0.5 + 0.5) * window.innerHeight}px`;
            studyIcon.style.transform = `translate(-50%, -100%) scale(${scale})`;
            studyIcon.style.visibility = "visible";
          } else {
            studyIcon.style.visibility = "hidden";
          }
        }

        three.mountains.forEach((m, i) => {
          const parallax = 1 + i * 0.5;
          m.position.x = Math.sin(time * 0.1) * 2 * parallax;
        });

        renderer.render(scene, camera);
      }

      /* ── Boot ──────────────────────────────────────────────────────── */

      if (!initThree()) {
        section.classList.add("hero--fallback");
        if (stages[0]) stages[0].style.opacity = "1";
        return;
      }

      splitFirstTitle();
      if (!reduceMotion) playIntro();
      else if (stages[0]) stages[0].style.opacity = "1";

      let trigger: { kill: () => void } | undefined;

      if (!reduceMotion) {
        trigger = ScrollTrigger.create({
          trigger: pinEl,
          start: "top top",
          end: `+=${(totalStages - 1) * 100}%`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => render(self.progress),
        });
        render(0);
      } else if (stages[0]) {
        stages[0].style.opacity = "1";
      }

      animate();

      let resizeTimer: number | undefined;
      const onResize = () => {
        window.clearTimeout(resizeTimer);
        resizeTimer = window.setTimeout(() => {
          if (!camera || !renderer) return;
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
          renderer.setSize(window.innerWidth, window.innerHeight);
          // The screen may have changed shape: re-pick the icon's point.
          if (studyIcon) pickIconAnchor();
          ScrollTrigger.refresh();
        }, 200);
      };
      window.addEventListener("resize", onResize);

      teardown = () => {
        cancelAnimationFrame(rafId);
        window.clearTimeout(resizeTimer);
        window.removeEventListener("resize", onResize);
        trigger?.kill();
        // Release GPU memory — without this a route change leaks the whole
        // scene and eventually exhausts WebGL contexts.
        three.stars.forEach((s) => {
          s.geometry.dispose();
          (s.material as { dispose: () => void }).dispose();
        });
        [three.nebula, three.atmosphere, ...three.mountains].forEach((m) => {
          if (!m) return;
          m.geometry.dispose();
          (m.material as { dispose: () => void }).dispose();
        });
        renderer?.dispose();
      };
    })();

    return () => {
      disposed = true;
      teardown?.();
    };
  }, []);

  const totalLabel = String(heroActs.length - 1).padStart(2, "0");

  return (
    <section ref={rootRef} id="hero" aria-label="Colegio Altamira La Cima">
      <div className="hero__pin">
        <div className="hero__backdrop" aria-hidden="true">
          {/* Plain <img>: this element's transform is written every frame by
              the render loop, and next/image's wrapper would fight it. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/img/hero/campus-backdrop.jpg" alt="" fetchPriority="high" />
        </div>

        <canvas className="hero__canvas" aria-hidden="true" />

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/img/hero/nino-estudiando.png"
          alt=""
          className="hero__study-icon"
          aria-hidden="true"
        />

        {heroActs.map((act, i) => (
          <div className="hero__stage" data-stage={i} key={act.title}>
            <span className="section-label hero__eyebrow justify-center !text-white/70">
              <span
                aria-hidden="true"
                className="size-[5px] bg-accent-500"
              />
              {act.eyebrow}
            </span>

            {i === 0 ? (
              <h1 className="hero__title mt-6">{act.title}</h1>
            ) : (
              <p className="hero__title mt-6" role="presentation">
                {act.title}
              </p>
            )}

            <div className="mt-7 space-y-1">
              {act.lines.map((line) => (
                <p className="hero__subtitle-line" key={line}>
                  {line}
                </p>
              ))}
            </div>

            {act.cta ? (
              <a
                href={act.cta.href}
                className="hero__stage-cta mt-10 inline-flex min-h-[52px] items-center gap-3 bg-white px-8 text-sm font-semibold tracking-wide text-ink-950 transition-colors hover:bg-white/85"
              >
                {act.cta.label}
                <span aria-hidden="true">&#8594;</span>
              </a>
            ) : null}
          </div>
        ))}

        {/* Scroll rail — "Desliza" + progress + 00 / 02 */}
        <div className="absolute inset-x-0 bottom-0 z-10 pb-8">
          <div className="container-x flex items-center gap-4 sm:gap-6">
            <span className="shrink-0 text-[length:var(--text-label)] font-semibold uppercase tracking-[0.2em] text-white/55">
              Desliza
            </span>
            <div className="h-px flex-1 bg-white/20">
              <div className="hero__progress-fill h-px w-full origin-left scale-x-0 bg-accent-500" />
            </div>
            <span className="hero__progress-count shrink-0 text-[length:var(--text-label)] tabular-nums tracking-[0.18em] text-white/55">
              00 / {totalLabel}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
