'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Material, Mesh } from 'three';

// ---------------------------------------------------------------------------
// /game floating 3D companion.
//
// A large warrior that lives ONLY on the /game page. It is positioned in PAGE
// coordinates (position:absolute inside .gm-root) — NOT fixed to the viewport.
// User's model: "the page is a road; drop it and it stays there." Throw it to a
// lower section and it stays at that page position; scroll past and it scrolls
// out of view; scroll back and it's exactly where you left it.
//
// Why absolute (not fixed): /game uses NATIVE scroll (Lenis is disabled on
// /game), so an absolutely-positioned element scrolls with the page for free —
// no per-frame scrollY math, no Lenis integration. Dragging adds the viewport
// pointer delta to the page-coord position (the page doesn't move during a
// pointer-captured drag, so viewport delta == page delta).
//
// The box is a small render target moved by left/top; the 3D model fills it and
// tumbles gently on 3 axes ("floating in space"). Physics live in refs — never
// React state — so dragging causes zero re-renders. On release it stays put
// (no inertia, by design).
// ---------------------------------------------------------------------------

const EDGE_PAD = 12; // px gap kept from the viewport edge

// Zero-gravity fling physics (px / per-RAF-frame at 60fps; normalised by `f`).
const LINEAR_DAMPING = 0.985; // velocity decay — high = floats long (~2-4s) like vacuum
const STOP_SPEED = 0.02; // px/frame; below this (and spin small) the drift settles
const MAX_FLING_SPEED = 60; // px/frame clamp so a violent flick can't rocket off-screen
const VELOCITY_WINDOW = 90; // ms of recent pointer samples used for fling velocity
const EDGE_SOFT = 0.018; // soft-boundary spring stiffness (accel = -k * overshoot)
const EDGE_DAMP_OUT = 0.86; // extra velocity damping while past the soft edge

// Angular momentum — the character tumbles like an object in space.
const SPIN_DAMPING = 0.97; // spin decay (slow → keeps tumbling a while)
const SPIN_FROM_FLING = 0.00022; // rad/frame of spin added per (px/frame) of fling speed
const SPIN_MAX = 0.16; // rad/frame clamp
const IDLE_SPIN_Y = 0.0016; // baseline drift-spin around Y when idle (never fully still)

// Right-drag = orbit-inspect the character in place (like viewing a game skin).
const ORBIT_SPEED = 0.01; // rad per px of right-drag
const ORBIT_RELEASE_SPIN = 0.15; // fraction of orbit motion left as residual spin on release

const IDLE_BOB_AMP = 8; // px vertical sine bob while idle
const IDLE_BOB_HZ = 0.15; // bob frequency (Hz)

type Mode = 'idle' | 'drifting' | 'dragging' | 'orbiting';
type Vec = { x: number; y: number };

// This component only mounts on /game and unmounts with it, but guard against a
// StrictMode/HMR double-invoke booting two WebGL contexts.
let companionMounted = false;

export default function GameCompanion3D() {
  const rootRef = useRef<HTMLDivElement>(null); // the moving box
  const mountRef = useRef<HTMLDivElement>(null); // WebGL canvas mount
  const gripRef = useRef<HTMLDivElement>(null); // the only pointer-interactive area

  const [useFallback, setUseFallback] = useState(false);

  // --- physics state (refs, never state) ---
  const pos = useRef<Vec>({ x: 0, y: 0 }); // box top-left in PAGE coords (px from .gm-root top-left)
  const vel = useRef<Vec>({ x: 0, y: 0 }); // linear velocity px/frame (drift after fling)
  const spin = useRef<Vec>({ x: 0, y: 0 }); // angular velocity rad/frame (tumble); .x→rotation.y, .y→rotation.x
  const idleAnchor = useRef<Vec>({ x: 0, y: 0 }); // centre the idle bob settles around
  const mode = useRef<Mode>('idle');
  const drag = useRef({
    active: false,
    // gesture: 'move' = drag/fling (1 finger or left mouse),
    //          'orbit' = inspect-rotate (right mouse OR two fingers)
    gesture: 'move' as 'move' | 'orbit',
    lastX: 0,
    lastY: 0,
    samples: [] as { dx: number; dy: number; t: number }[],
  });
  // All active pointers on the grip (pointerId → viewport position). Used to tell
  // a 1-finger move from a 2-finger orbit on touch (no right button on mobile).
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const boxSize = useRef(820);

  useEffect(() => {
    const root = rootRef.current;
    const mount = mountRef.current;
    const grip = gripRef.current;
    if (!root || !mount || !grip) return;
    if (companionMounted) return; // StrictMode / HMR second boot → no-op
    companionMounted = true;

    // The absolute containing block: .gm-root (position:relative, page-tall).
    const container: HTMLElement = (root.offsetParent as HTMLElement) ?? document.body;

    // Right-click on /game is reserved for orbiting the character, so suppress
    // the browser context menu across the whole page. Registered unconditionally
    // (also covers reduced-motion and the async WebGL-boot gap).
    const onContextMenu = (event: Event) => event.preventDefault();
    container.addEventListener('contextmenu', onContextMenu);

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const coarse = () => window.matchMedia('(max-width: 767px), (pointer: coarse)').matches;

    const applyBoxSize = () => {
      const target = coarse()
        ? Math.min(420, window.innerHeight * 0.7)
        : Math.min(820, window.innerHeight * 0.86);
      // never exceed the viewport's small dimension
      const cap = Math.min(window.innerWidth, window.innerHeight) - 2 * EDGE_PAD;
      boxSize.current = Math.max(220, Math.min(target, cap));
    };
    applyBoxSize();

    // Page bounds for clamping (page coords relative to the container).
    const maxX = () => Math.max(EDGE_PAD, container.clientWidth - boxSize.current - EDGE_PAD);
    const maxY = () =>
      Math.max(EDGE_PAD, container.scrollHeight - boxSize.current - EDGE_PAD);

    const clampHard = () => {
      pos.current.x = Math.min(Math.max(EDGE_PAD, pos.current.x), maxX());
      pos.current.y = Math.min(Math.max(EDGE_PAD, pos.current.y), maxY());
    };

    const applyTransform = () => {
      root.style.left = `${pos.current.x}px`;
      root.style.top = `${pos.current.y}px`;
    };

    // Home = centre of the portal ring, in PAGE coords relative to the container.
    const homePos = (): Vec => {
      const shell = document.querySelector('.gm-portal-shell');
      const cRect = container.getBoundingClientRect();
      let cx = container.clientWidth / 2;
      let cy = Math.min(container.clientHeight, window.innerHeight) / 2;
      if (shell) {
        const r = shell.getBoundingClientRect();
        if (r.width > 0 && r.height > 0) {
          // viewport rect → page coords relative to the container
          cx = r.left - cRect.left + r.width / 2;
          cy = r.top - cRect.top + r.height / 2;
        }
      }
      return { x: cx - boxSize.current / 2, y: cy - boxSize.current / 2 };
    };

    let homeLocked = false; // true once the user first grabs it
    const recenterHome = () => {
      if (mode.current === 'dragging' || drag.current.active) return;
      pos.current = homePos();
      clampHard();
      idleAnchor.current = { ...pos.current };
      applyTransform();
    };

    // initial placement (re-measured after layout settles below)
    recenterHome();

    // -- reveal: fade in once placed / model ready ----------------------
    const reveal = () => root.classList.add('is-ready');

    // The hero only has its real layout once .gm-pending is removed and a frame
    // has passed; re-measure home then so the companion lands on the portal.
    let settleFrame = 0;
    const settle = () => {
      if (!homeLocked) recenterHome();
    };
    settleFrame = window.requestAnimationFrame(() => {
      settle();
      settleFrame = window.requestAnimationFrame(settle);
    });

    // -- reduced motion: static fallback, no WebGL, non-interactive ------
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => {
        setUseFallback(true);
        reveal();
      });
      const onResizeRm = () => {
        applyBoxSize();
        recenterHome();
      };
      window.addEventListener('resize', onResizeRm);
      return () => {
        window.cancelAnimationFrame(frame);
        window.cancelAnimationFrame(settleFrame);
        window.removeEventListener('resize', onResizeRm);
        container.removeEventListener('contextmenu', onContextMenu);
        companionMounted = false;
      };
    }

    // -- WebGL boot ------------------------------------------------------
    let disposed = false;
    let running = false;
    let animationFrame = 0;
    let lastNow = 0;
    let phase = 0; // accumulated seconds for bob/tumble
    let rootResize: ResizeObserver | null = null;
    let canvasResize: ResizeObserver | null = null;
    let disposeScene: (() => void) | null = null;

    const stopLoop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const boot = async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
        if (disposed || !mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        });
        const modelGroup = new THREE.Group();

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.36;
        renderer.setSize(boxSize.current, boxSize.current, false);
        mount.appendChild(renderer.domElement);

        scene.add(modelGroup);

        // Lighting mirrors the original portal look.
        scene.add(new THREE.AmbientLight(0xffffff, 1.55));
        const keyLight = new THREE.DirectionalLight(0xffffff, 2.4);
        keyLight.position.set(2.5, 4.2, 4.4);
        scene.add(keyLight);
        const purpleCore = new THREE.PointLight(0x9b7cff, 5.4, 9);
        purpleCore.position.set(0, 1.2, 2.2);
        scene.add(purpleCore);
        const coolRim = new THREE.PointLight(0x44d6ff, 2.2, 7);
        coolRim.position.set(2.4, -0.8, 2.6);
        scene.add(coolRim);
        const magentaRim = new THREE.PointLight(0xff7adf, 1.9, 7);
        magentaRim.position.set(-2.7, 1.5, 2.8);
        scene.add(magentaRim);

        // Fit camera to the model's bounding sphere so the WHOLE model (sword
        // included) fills the square box with a small margin. Aspect is constant
        // (square box), so the sword never crops.
        let fitRadius = 0;
        const fitCamera = () => {
          camera.aspect = 1;
          if (fitRadius > 0) {
            const MARGIN = 1.02; // nearly fills the box
            const vFOV = THREE.MathUtils.degToRad(camera.fov);
            const dist = (MARGIN * fitRadius) / Math.sin(vFOV / 2);
            camera.position.set(0, 0, dist);
            camera.lookAt(0, 0, 0);
          }
          camera.updateProjectionMatrix();
        };

        const resizeRenderer = () => {
          renderer.setSize(boxSize.current, boxSize.current, false);
          fitCamera();
          renderer.render(scene, camera);
        };

        // Soft elastic boundary, measured against the CURRENT VIEWPORT (not the
        // page) — measured in PAGE coords, the same space as `pos`. (Earlier this
        // used the viewport; that mixed coord spaces, so scrolling while the model
        // drifted near an edge dragged it along with the scroll. Page bounds keep
        // "dropped where you left it in the page" consistent.) Pushes velocity
        // back instead of hard-stopping.
        const applySoftEdges = (f: number) => {
          const left = EDGE_PAD;
          const right = maxX();
          const top = EDGE_PAD;
          const bottom = maxY();
          let outside = false;
          if (pos.current.x < left) {
            vel.current.x += (left - pos.current.x) * EDGE_SOFT * f;
            outside = true;
          } else if (pos.current.x > right) {
            vel.current.x -= (pos.current.x - right) * EDGE_SOFT * f;
            outside = true;
          }
          if (pos.current.y < top) {
            vel.current.y += (top - pos.current.y) * EDGE_SOFT * f;
            outside = true;
          } else if (pos.current.y > bottom) {
            vel.current.y -= (pos.current.y - bottom) * EDGE_SOFT * f;
            outside = true;
          }
          if (outside) {
            vel.current.x *= Math.pow(EDGE_DAMP_OUT, f);
            vel.current.y *= Math.pow(EDGE_DAMP_OUT, f);
          }
        };

        const frame = (now: number) => {
          if (!running) return;
          const dt = lastNow ? now - lastNow : 16.67;
          lastNow = now;
          const f = Math.min(2.5, dt / 16.67); // frame-rate normalisation (1 @60fps)
          phase += dt / 1000;

          if (mode.current === 'drifting') {
            // Zero-g linear inertia + soft elastic walls.
            pos.current.x += vel.current.x * f;
            pos.current.y += vel.current.y * f;
            vel.current.x *= Math.pow(LINEAR_DAMPING, f);
            vel.current.y *= Math.pow(LINEAR_DAMPING, f);
            applySoftEdges(f);
            if (
              Math.hypot(vel.current.x, vel.current.y) < STOP_SPEED &&
              Math.hypot(spin.current.x, spin.current.y) < 0.004
            ) {
              vel.current.x = 0;
              vel.current.y = 0;
              mode.current = 'idle';
              idleAnchor.current = { ...pos.current };
            }
          } else if (mode.current === 'idle') {
            pos.current.y =
              idleAnchor.current.y + Math.sin(phase * IDLE_BOB_HZ * 2 * Math.PI) * IDLE_BOB_AMP;
          }
          // 'dragging'/'orbiting': pos / rotation written by pointermove.
          applyTransform();

          // --- Angular momentum (tumble) ---
          // While right-drag orbiting, the user hand-rotates the model directly
          // (in pointermove) — don't auto-spin on top of that.
          if (mode.current !== 'orbiting') {
            if (mode.current === 'idle') {
              // ease spin toward a tiny baseline drift so it's never dead-still,
              // never a fixed repeating loop.
              spin.current.x += (IDLE_SPIN_Y - spin.current.x) * 0.02 * f;
              spin.current.y *= Math.pow(0.985, f);
            } else {
              spin.current.x *= Math.pow(SPIN_DAMPING, f);
              spin.current.y *= Math.pow(SPIN_DAMPING, f);
            }
            // accumulate (never set absolute) → genuine tumbling, no repeat
            modelGroup.rotation.y += spin.current.x * f;
            modelGroup.rotation.x += spin.current.y * f;
            // subtle z sway for life, scaled by how fast it's spinning
            modelGroup.rotation.z = Math.sin(phase * 0.5) * 0.05 + spin.current.x * 0.6;
          }

          renderer.render(scene, camera);
          animationFrame = window.requestAnimationFrame(frame);
        };

        const startLoop = () => {
          if (running || disposed) return;
          running = true;
          lastNow = 0;
          animationFrame = window.requestAnimationFrame(frame);
        };

        // ---- gesture handlers (on the grip pad) ----
        // MOVE  = drag/fling: 1 finger, or left mouse button.
        // ORBIT = inspect-rotate in place: 2 fingers (mobile), or right mouse button.
        const centroid = () => {
          let x = 0;
          let y = 0;
          pointers.current.forEach((p) => {
            x += p.x;
            y += p.y;
          });
          const n = pointers.current.size || 1;
          return { x: x / n, y: y / n };
        };

        // (Re)bind the gesture reference point to the current driving point — the
        // single finger for MOVE, the two-finger centroid for ORBIT — without
        // emitting motion (used when a finger is added/removed mid-gesture).
        const rebindRef = () => {
          const c = drag.current.gesture === 'orbit' ? centroid() : (() => {
            const first = pointers.current.values().next().value;
            return first ?? { x: drag.current.lastX, y: drag.current.lastY };
          })();
          drag.current.lastX = c.x;
          drag.current.lastY = c.y;
          drag.current.samples = [];
        };

        const startMove = () => {
          drag.current.gesture = 'move';
          mode.current = 'dragging';
          vel.current = { x: 0, y: 0 }; // catch a moving companion mid-flight
          rebindRef();
        };
        const startOrbit = () => {
          drag.current.gesture = 'orbit';
          mode.current = 'orbiting';
          vel.current = { x: 0, y: 0 };
          spin.current = { x: 0, y: 0 };
          rebindRef();
        };

        const onPointerDown = (event: PointerEvent) => {
          if (disposed) return;
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          drag.current.active = true;
          homeLocked = true; // user took control → stop auto-recentering
          try {
            grip.setPointerCapture(event.pointerId);
          } catch {
            /* ignore */
          }
          root.classList.add('is-dragging');
          event.stopPropagation();

          // Right mouse button → orbit. Two fingers → orbit. Otherwise move.
          if (event.pointerType === 'mouse' && event.button === 2) startOrbit();
          else if (pointers.current.size >= 2) startOrbit();
          else startMove();
        };

        const onPointerMove = (event: PointerEvent) => {
          if (!drag.current.active || !pointers.current.has(event.pointerId)) return;
          pointers.current.set(event.pointerId, { x: event.clientX, y: event.clientY });

          // Drive from the single finger (MOVE) or the centroid (ORBIT).
          const pt =
            drag.current.gesture === 'orbit'
              ? centroid()
              : pointers.current.get(event.pointerId)!;
          const dx = pt.x - drag.current.lastX;
          const dy = pt.y - drag.current.lastY;
          drag.current.lastX = pt.x;
          drag.current.lastY = pt.y;

          const t = event.timeStamp;
          drag.current.samples.push({ dx, dy, t });
          while (drag.current.samples.length && t - drag.current.samples[0].t > VELOCITY_WINDOW) {
            drag.current.samples.shift();
          }

          if (drag.current.gesture === 'orbit') {
            // Orbit-inspect: rotate the model directly (yaw from horizontal, pitch
            // from vertical) — like spinning a figurine to look at it.
            modelGroup.rotation.y += dx * ORBIT_SPEED;
            modelGroup.rotation.x += dy * ORBIT_SPEED;
          } else {
            // Move: /game is native scroll and the page doesn't move during a
            // captured drag, so viewport delta == page-coord delta. No hard clamp —
            // soft edges handle bounds; dragging can briefly cross them.
            pos.current.x += dx;
            pos.current.y += dy;
          }
        };

        // Settle the whole gesture into physics once no pointers remain.
        const settleGesture = () => {
          drag.current.active = false;
          const now = performance.now();
          const recent = drag.current.samples.filter((s) => now - s.t <= VELOCITY_WINDOW);
          const span = recent.length >= 2 ? Math.max(1, recent[recent.length - 1].t - recent[0].t) : 0;
          const sumDx = recent.reduce((a, s) => a + s.dx, 0);
          const sumDy = recent.reduce((a, s) => a + s.dy, 0);
          const clampSpin = (v: number) => Math.min(Math.max(v, -SPIN_MAX), SPIN_MAX);

          if (drag.current.gesture === 'orbit') {
            // residual orbit momentum → keeps turning the way you flicked it
            if (span > 0) {
              spin.current.x = clampSpin((sumDx / span) * 16.67 * ORBIT_SPEED * ORBIT_RELEASE_SPIN);
              spin.current.y = clampSpin((sumDy / span) * 16.67 * ORBIT_SPEED * ORBIT_RELEASE_SPIN);
            }
            mode.current = 'idle';
            idleAnchor.current = { ...pos.current };
          } else {
            const clampSpeed = (v: number) =>
              Math.min(Math.max(v, -MAX_FLING_SPEED), MAX_FLING_SPEED);
            if (span > 0) {
              vel.current.x = clampSpeed((sumDx / span) * 16.67); // px/ms → px/frame
              vel.current.y = clampSpeed((sumDy / span) * 16.67);
            } else {
              vel.current = { x: 0, y: 0 };
            }
            // Fling imparts spin: horizontal throw → about Y, vertical → about X.
            spin.current.x = clampSpin(spin.current.x + vel.current.x * SPIN_FROM_FLING);
            spin.current.y = clampSpin(spin.current.y - vel.current.y * SPIN_FROM_FLING);
            if (Math.hypot(vel.current.x, vel.current.y) > STOP_SPEED) {
              mode.current = 'drifting';
            } else {
              mode.current = 'idle';
              idleAnchor.current = { ...pos.current };
            }
          }
          root.classList.remove('is-dragging');
        };

        const onPointerUp = (event: PointerEvent) => {
          if (!pointers.current.has(event.pointerId)) return;
          pointers.current.delete(event.pointerId);
          try {
            grip.releasePointerCapture(event.pointerId);
          } catch {
            /* ignore */
          }
          if (pointers.current.size === 0) {
            // last finger up → fling/settle
            settleGesture();
          } else if (drag.current.gesture === 'orbit' && pointers.current.size < 2) {
            // dropped from two fingers to one mid-orbit → settle the orbit (leave a
            // little spin), then continue moving with the remaining finger.
            settleGesture();
            drag.current.active = true;
            root.classList.add('is-dragging');
            startMove();
          } else {
            // still ≥2 fingers (rare) → keep orbiting, just rebind the centroid
            rebindRef();
          }
        };

        // Double-click / double-tap → snap back home (centre of the portal).
        const onDoubleClick = () => {
          homeLocked = false;
          vel.current = { x: 0, y: 0 };
          mode.current = 'idle';
          recenterHome();
        };

        grip.addEventListener('pointerdown', onPointerDown);
        grip.addEventListener('pointermove', onPointerMove);
        grip.addEventListener('pointerup', onPointerUp);
        grip.addEventListener('pointercancel', onPointerUp);
        grip.addEventListener('lostpointercapture', onPointerUp);
        grip.addEventListener('dblclick', onDoubleClick);

        const onWindowBlur = () => {
          if (!drag.current.active) return;
          pointers.current.clear();
          settleGesture();
        };
        window.addEventListener('blur', onWindowBlur);

        // Resize: swap box size, refit camera. Re-clamp; re-home if untouched.
        const onResize = () => {
          applyBoxSize();
          resizeRenderer();
          if (!homeLocked) recenterHome();
          else {
            clampHard();
            idleAnchor.current.x = Math.min(Math.max(EDGE_PAD, idleAnchor.current.x), maxX());
            idleAnchor.current.y = Math.min(Math.max(EDGE_PAD, idleAnchor.current.y), maxY());
          }
        };
        window.addEventListener('resize', onResize);

        // The page height changes when the catalog filter changes the grid →
        // re-clamp Y so a dropped companion never ends up stuck off-page.
        rootResize = new ResizeObserver(() => {
          if (!homeLocked) recenterHome();
          else {
            clampHard();
            idleAnchor.current.y = Math.min(Math.max(EDGE_PAD, idleAnchor.current.y), maxY());
            applyTransform();
          }
        });
        rootResize.observe(container);

        // pause RAF when the tab is hidden
        const onVisibility = () => {
          if (document.visibilityState === 'hidden') stopLoop();
          else if (!disposed) startLoop();
        };
        document.addEventListener('visibilitychange', onVisibility);

        // WebGL context loss → static fallback
        const canvas = renderer.domElement;
        const onContextLost = (e: Event) => {
          e.preventDefault();
          stopLoop();
          setUseFallback(true);
        };
        canvas.addEventListener('webglcontextlost', onContextLost as EventListener);

        const draco = new DRACOLoader();
        draco.setDecoderPath('/assets/draco/');
        const loader = new GLTFLoader();
        loader.setDRACOLoader(draco);
        loader.load(
          '/assets/img/home-7/3d/3d_9.glb',
          (gltf) => {
            if (disposed) return;
            const model = gltf.scene;
            model.traverse((child) => {
              const mesh = child as Mesh;
              if (!mesh.isMesh) return;
              mesh.castShadow = false;
              mesh.receiveShadow = false;
            });

            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            model.position.sub(center); // centre at origin

            fitRadius = box.getBoundingSphere(new THREE.Sphere()).radius;

            modelGroup.add(model);
            fitCamera();
            resizeRenderer();
            startLoop();
            reveal();
          },
          undefined,
          () => {
            if (disposed) return;
            setUseFallback(true);
            reveal();
          }
        );

        canvasResize = new ResizeObserver(resizeRenderer);
        canvasResize.observe(mount);

        disposeScene = () => {
          grip.removeEventListener('pointerdown', onPointerDown);
          grip.removeEventListener('pointermove', onPointerMove);
          grip.removeEventListener('pointerup', onPointerUp);
          grip.removeEventListener('pointercancel', onPointerUp);
          grip.removeEventListener('lostpointercapture', onPointerUp);
          grip.removeEventListener('dblclick', onDoubleClick);
          window.removeEventListener('blur', onWindowBlur);
          window.removeEventListener('resize', onResize);
          document.removeEventListener('visibilitychange', onVisibility);
          canvas.removeEventListener('webglcontextlost', onContextLost as EventListener);
          draco.dispose();
          scene.traverse((child) => {
            const mesh = child as Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const materials: Material[] = Array.isArray(mesh.material)
              ? mesh.material
              : [mesh.material];
            materials.forEach((material) => material?.dispose());
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) {
          setUseFallback(true);
          reveal();
        }
      }
    };

    void boot();

    return () => {
      disposed = true;
      stopLoop();
      window.cancelAnimationFrame(settleFrame);
      rootResize?.disconnect();
      canvasResize?.disconnect();
      disposeScene?.();
      container.removeEventListener('contextmenu', onContextMenu);
      companionMounted = false;
    };
  }, []);

  return (
    <div className="gmc-root" ref={rootRef} aria-hidden="true">
      <div className="gmc-canvas" ref={mountRef} />

      {useFallback && (
        <div className="gmc-fallback">
          <Image
            src="/assets/img/landing-page/trasparent_bg.png"
            alt=""
            fill
            sizes="(max-width: 767px) 420px, 820px"
            priority
          />
        </div>
      )}

      {/* Only this centre strip is pointer-interactive, so the large box blocks
          minimal page area (the rest passes clicks through). */}
      <div className="gmc-grip" ref={gripRef} />

      <style jsx global>{`
        .gmc-root {
          position: absolute;
          top: 0;
          left: 0;
          /* Big square box sized to fill/overflow the portal ring; JS caps it to
             the viewport and swaps the mobile size. These are the defaults. */
          width: 820px;
          height: 820px;
          z-index: 6;
          pointer-events: none;
          touch-action: none;
          user-select: none;
          -webkit-user-select: none;
          opacity: 0;
          transition: opacity 0.5s ease;
          contain: layout paint;
        }
        .gmc-root.is-ready {
          opacity: 1;
        }
        .gmc-canvas {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .gmc-canvas canvas {
          width: 100% !important;
          height: 100% !important;
          display: block;
        }
        .gmc-grip {
          /* Narrow tall strip over the character's body, NOT the whole box. */
          position: absolute;
          left: 34%;
          top: 16%;
          right: 34%;
          bottom: 10%;
          pointer-events: auto;
          cursor: grab;
          -webkit-user-drag: none;
        }
        .gmc-root.is-dragging .gmc-grip {
          cursor: grabbing;
        }
        .gmc-fallback {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .gmc-fallback img {
          object-fit: contain;
        }
        @media (max-width: 767px), (pointer: coarse) {
          .gmc-root {
            width: 420px;
            height: 420px;
          }
        }
      `}</style>
    </div>
  );
}
