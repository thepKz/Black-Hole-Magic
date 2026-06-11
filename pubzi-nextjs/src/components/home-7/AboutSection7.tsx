'use client';
import { useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useEffect, useRef } from 'react';

export default function AboutSection7() {
  return (
    <section className="about-section about-section-purple fix section-padding" style={{ borderTop: '2px solid #6C5CE7' }}>
      <div className="container">
        <div className="about-wrapper-7">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="about-image-2 wow fadeInUp" data-wow-delay=".4s">
                <div className="about-3d-stage" aria-label="Black Hole 3D model">
                  <AboutGlbModel />
                </div>
                <div className="bg-shape">
                  <img src="assets/img/home-7/about/bg-shape.png" alt="img" />
                </div>
                <div className="ellipse-shape">
                  <img src="assets/img/home-7/about/ellipse.png" alt="img" />
                </div>
              </div>
            </div>
            <div className="col-lg-7">
              <div className="about-content">
                <div className="section-title mb-4">
                  <h6 className="wow fadeInUp text-purple" data-wow-delay=".2s" style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '20px' }}>
                    VỀ BLACKHOLE GAME
                  </h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s" style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.3, marginBottom: '16px', color: '#fff' }}>
                    Tầm nhìn 2030
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".5s" style={{ fontSize: '16px', lineHeight: 1.7, marginBottom: '32px', color: 'rgba(255,255,255,0.85)' }}>
                    Đến năm 2030, Blackhole Game định vị là Hệ sinh thái Đồng phát hành (Co-Publishing) tiêu chuẩn và là Local Partner được lựa chọn đầu tiên (Top-of-mind) bởi các nhà phát triển game quốc tế tại thị trường Đông Nam Á.
                  </p>
                </div>
                <div className="section-title">
                  <h2 className="wow fadeInUp" data-wow-delay=".6s" style={{ fontSize: '32px', fontWeight: 800, lineHeight: 1.3, marginBottom: '16px', color: '#fff' }}>
                    Sứ mệnh
                  </h2>
                  <p className="wow fadeInUp" data-wow-delay=".7s" style={{ fontSize: '16px', lineHeight: 1.7, color: 'rgba(255,255,255,0.85)' }}>
                    Trở thành cổng kết nối hàng đầu giữa game quốc tế và 100 triệu người chơi Đông Nam Á — đặt Việt Nam lên bản đồ gaming toàn cầu.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        .about-section-purple {
          position: relative;
          isolation: isolate;
          background:
            radial-gradient(circle at 16% 8%, rgba(108, 92, 231, 0.12) 0%, transparent 30%),
            linear-gradient(180deg, rgba(18, 10, 50, 0.7) 0%, rgba(11, 7, 29, 0.5) 54%, rgba(6, 6, 10, 0.8) 100%) !important;
          background-color: rgba(11, 7, 29, 0.4) !important;
        }

        .text-purple {
          color: #8b7ae8;
        }

        .about-section-purple .about-image-2 .bg-shape img {
          filter: drop-shadow(0 0 28px rgba(255, 255, 255, 0.22)) !important;
          opacity: 0.82;
        }

        .about-section-purple .about-image-2 .ellipse-shape img {
          filter: brightness(0.9) saturate(0.9) drop-shadow(0 0 24px rgba(108, 92, 231, 0.35)) !important;
          opacity: 0.58;
        }

        .about-section-purple .about-image-2 {
          z-index: 1;
        }

        .about-section-purple .about-3d-stage {
          position: relative;
          z-index: 1;
          width: 100%;
          aspect-ratio: 713 / 749;
          min-height: 420px;
          cursor: grab;
          touch-action: none;
          filter: contrast(1.12) brightness(1.04)
            drop-shadow(0 0 22px rgba(108, 92, 231, 0.5))
            drop-shadow(0 0 62px rgba(139, 122, 232, 0.42));
        }

        .about-section-purple .about-3d-stage:active {
          cursor: grabbing;
        }

        .about-section-purple .about-3d-stage::before {
          content: '';
          position: absolute;
          inset: 9% 7% 14%;
          border-radius: 999px;
          background:
            radial-gradient(circle at 50% 42%, rgba(139, 122, 232, 0.34) 0%, rgba(108, 92, 231, 0.2) 28%, rgba(108, 92, 231, 0.08) 52%, transparent 74%);
          filter: blur(24px);
          pointer-events: none;
        }

        .about-section-purple .about-3d-stage canvas {
          position: relative;
          z-index: 1;
          display: block;
          width: 100% !important;
          height: 100% !important;
        }

        .loading-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          background: rgba(6, 6, 10, 0.8);
          backdrop-filter: blur(10px);
          z-index: 10;
        }

        .loading-circle {
          width: 100px;
          height: 100px;
          transform: rotate(-90deg);
        }

        .loading-bg {
          fill: none;
          stroke: rgba(108, 92, 231, 0.2);
          stroke-width: 4;
        }

        .loading-progress {
          fill: none;
          stroke: #8b7ae8;
          stroke-width: 4;
          stroke-linecap: round;
          transition: stroke-dasharray 0.3s ease;
          filter: drop-shadow(0 0 8px rgba(139, 122, 232, 0.8));
        }

        .loading-text {
          position: absolute;
          font-size: 24px;
          font-weight: 700;
          color: #fff;
          text-shadow: 0 0 20px rgba(139, 122, 232, 0.8);
        }
      `}</style>
    </section>
  );
}

function AboutGlbModel() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(36, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    const modelGroup = new THREE.Group();
    const controls = new OrbitControls(camera, renderer.domElement);
    const motionClock = new THREE.Clock();
    let animationFrame = 0;
    let disposed = false;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    mount.appendChild(renderer.domElement);

    camera.position.set(0, 0.16, 6.2);
    scene.add(modelGroup);
    scene.add(new THREE.AmbientLight(0xffffff, 1.75));

    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.rotateSpeed = 0.7;
    controls.autoRotate = false;
    controls.minPolarAngle = 0;
    controls.maxPolarAngle = Math.PI;
    controls.target.set(0, 0, 0);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.35);
    keyLight.position.set(2.8, 4.6, 4.2);
    scene.add(keyLight);

    const haloLight = new THREE.PointLight(0x8b7ae8, 4.2, 7.5);
    haloLight.position.set(0, 1.25, 2.3);
    scene.add(haloLight);

    const purpleRim = new THREE.PointLight(0x9b7cff, 4.4, 8);
    purpleRim.position.set(-2.4, 1.8, 2.8);
    scene.add(purpleRim);

    const softFill = new THREE.PointLight(0x6c5ce7, 2.2, 7);
    softFill.position.set(2.2, -1.2, 2.4);
    scene.add(softFill);

    const resize = () => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };

    const frame = () => {
      const elapsed = motionClock.getElapsedTime();
      modelGroup.position.x = Math.sin(elapsed * 1.25) * 0.16;
      controls.update();
      renderer.render(scene, camera);
      animationFrame = window.requestAnimationFrame(frame);
    };

    const loader = new GLTFLoader();
    loader.load(
      '/assets/img/home-7/3d/3d_4.glb',
      (gltf) => {
        if (disposed) return;

        const model = gltf.scene;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        const center = new THREE.Vector3();
        box.getSize(size);
        box.getCenter(center);

        model.position.sub(center);
        const maxDimension = Math.max(size.x, size.y, size.z);
        if (maxDimension > 0) {
          model.scale.setScalar(2.75 / maxDimension);
        }

        model.rotation.set(0.08, -0.28, 0);
        modelGroup.add(model);
        setLoadingProgress(100);
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percent = Math.min((xhr.loaded / xhr.total) * 100, 95);
          setLoadingProgress(Math.floor(percent));
        }
      }
    );

    resize();
    frame();

    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    return () => {
      disposed = true;
      observer.disconnect();
      window.cancelAnimationFrame(animationFrame);
      controls.dispose();
      renderer.dispose();
      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.domElement.remove();
    };
  }, []);

  return (
    <>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
      {loadingProgress < 100 && (
        <div className="loading-overlay">
          <svg className="loading-circle" viewBox="0 0 100 100">
            <circle className="loading-bg" cx="50" cy="50" r="40" />
            <circle
              className="loading-progress"
              cx="50"
              cy="50"
              r="40"
              strokeDasharray={`${loadingProgress * 2.51} 251.2`}
            />
          </svg>
          <div className="loading-text">{loadingProgress}%</div>
        </div>
      )}
    </>
  );
}
