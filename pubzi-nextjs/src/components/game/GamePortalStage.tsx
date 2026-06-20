'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import type { Material, Mesh } from 'three';

export default function GamePortalStage() {
  const rootRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef({ x: 0, y: 0 });
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [useFallback, setUseFallback] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    const root = rootRef.current;
    if (!mount || !root) return;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      const frame = window.requestAnimationFrame(() => {
        setUseFallback(true);
        setIsLoaded(true);
      });
      return () => window.cancelAnimationFrame(frame);
    }

    let disposed = false;
    let running = false;
    let animationFrame = 0;
    let resizeObserver: ResizeObserver | null = null;
    let visibilityObserver: IntersectionObserver | null = null;
    let disposeScene: (() => void) | null = null;

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(animationFrame);
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = root.getBoundingClientRect();
      pointerRef.current = {
        x: ((event.clientX - rect.left) / rect.width - 0.5) * 2,
        y: ((event.clientY - rect.top) / rect.height - 0.5) * 2,
      };
    };

    const boot = async () => {
      try {
        const THREE = await import('three');
        const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
        const { DRACOLoader } = await import('three/examples/jsm/loaders/DRACOLoader.js');
        if (disposed || !mountRef.current) return;

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 100);
        const renderer = new THREE.WebGLRenderer({
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          powerPreference: 'high-performance',
        });
        const modelGroup = new THREE.Group();
        const clock = new THREE.Clock();

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.36;
        mount.appendChild(renderer.domElement);

        camera.position.set(0, 0.18, 8.6);
        scene.add(modelGroup);
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

        const resize = () => {
          const stage = mount.parentElement ?? mount;
          const width = Math.max(stage.clientWidth, 1);
          const height = Math.max(stage.clientHeight, 1);
          renderer.setSize(width, height, false);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
          renderer.render(scene, camera);
        };

        const frame = () => {
          if (!running) return;
          const elapsed = clock.getElapsedTime();
          const pointer = pointerRef.current;
          modelGroup.rotation.y = -0.24 + Math.sin(elapsed * 0.34) * 0.12 + pointer.x * 0.16;
          modelGroup.rotation.x = 0.05 + pointer.y * 0.045;
          modelGroup.position.y = Math.sin(elapsed * 0.48) * 0.045;
          renderer.render(scene, camera);
          animationFrame = window.requestAnimationFrame(frame);
        };

        const start = () => {
          if (running || disposed) return;
          running = true;
          animationFrame = window.requestAnimationFrame(frame);
        };

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath('/assets/draco/');

        const loader = new GLTFLoader();
        loader.setDRACOLoader(dracoLoader);
        loader.load(
          '/assets/img/home-7/3d/3d_9.glb',
          (gltf) => {
            if (disposed) return;
            const model = gltf.scene;

            model.traverse((child) => {
              const mesh = child as Mesh;
              if (!mesh.isMesh) return;
              mesh.castShadow = true;
              mesh.receiveShadow = true;
            });

            const box = new THREE.Box3().setFromObject(model);
            const size = new THREE.Vector3();
            const center = new THREE.Vector3();
            box.getSize(size);
            box.getCenter(center);
            model.position.sub(center);

            const maxDimension = Math.max(size.x, size.y, size.z);
            if (maxDimension > 0) model.scale.setScalar(3.85 / maxDimension);

            model.rotation.set(0.08, 0, 0);
            modelGroup.add(model);
            setLoadingProgress(100);
            setIsLoaded(true);
            resize();
            start();
          },
          (xhr) => {
            if (!xhr.lengthComputable || disposed) return;
            setLoadingProgress(Math.min(96, Math.floor((xhr.loaded / xhr.total) * 100)));
          },
          () => {
            if (disposed) return;
            setUseFallback(true);
            setIsLoaded(true);
          }
        );

        resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(mount);
        root.addEventListener('pointermove', handlePointerMove);

        visibilityObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) start();
            else stop();
          },
          { rootMargin: '16% 0px' }
        );
        visibilityObserver.observe(mount);

        disposeScene = () => {
          dracoLoader.dispose();
          scene.traverse((child) => {
            const mesh = child as Mesh;
            if (!mesh.isMesh) return;
            mesh.geometry?.dispose();
            const materials: Material[] = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
            materials.forEach((material) => material.dispose());
          });
          renderer.dispose();
          renderer.domElement.remove();
        };
      } catch {
        if (!disposed) {
          setUseFallback(true);
          setIsLoaded(true);
        }
      }
    };

    void boot();

    return () => {
      disposed = true;
      stop();
      root.removeEventListener('pointermove', handlePointerMove);
      resizeObserver?.disconnect();
      visibilityObserver?.disconnect();
      disposeScene?.();
    };
  }, []);

  return (
    <div className="game-portal-stage" ref={rootRef}>
      <div
        className={`game-portal-canvas ${isLoaded && !useFallback ? 'is-loaded' : ''}`}
        ref={mountRef}
        aria-hidden="true"
      />

      {useFallback && (
        <div className="game-portal-fallback" aria-hidden="true">
          <Image
            src="/assets/img/landing-page/trasparent_bg.png"
            alt=""
            fill
            sizes="(max-width: 767px) 88vw, 680px"
            priority
          />
        </div>
      )}

      {!isLoaded && !useFallback && (
        <div className="game-portal-loader" aria-live="polite">
          <span>Đang mở cổng</span>
          <strong>{Math.max(8, loadingProgress)}%</strong>
        </div>
      )}

    </div>
  );
}
