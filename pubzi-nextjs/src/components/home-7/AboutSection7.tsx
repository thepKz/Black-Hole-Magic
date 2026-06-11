'use client';
import { useEffect, useRef } from 'react';
import { ShieldCheck, Zap, Globe, CheckCircle } from 'lucide-react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import Icon from '@/components/Icon';

export default function AboutSection7() {
  return (
    <section className="about-section about-section-purple fix section-padding" style={{ borderTop: '2px solid #6C5CE7' }}>
      <div className="container">
        <div className="about-wrapper-7">
          <div className="row g-4 align-items-center">
            <div className="col-lg-5">
              <div className="about-image-2 wow fadeInUp animated-image" data-wow-delay=".4s">
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
                <div className="section-title mb-0">
                  <h6 className="wow fadeInUp" data-wow-delay=".2s">ABOUT BLACK HOLE</h6>
                  <h2 className="wow fadeInUp" data-wow-delay=".3s">
                    Converging Digital Worlds<br />Into One Ecosystem
                  </h2>
                </div>
                <p className="about-text wow fadeInUp" data-wow-delay=".5s">
                  Black Hole is a next-generation digital ecosystem that brings together game publishing,
                  fintech infrastructure, platform solutions, and enterprise technology under one unified framework.
                  We empower businesses to thrive in the digital economy.
                </p>
                <div className="about-box-wrapper wow fadeInUp" data-wow-delay=".6s">
                  <div className="about-box-item">
                    <div className="about-box bg-color border-none">
                      <div className="icon">
                        <Icon icon={ShieldCheck} size={32} variant="purple" className="mono-icon" />
                      </div>
                      <div className="content">
                        <h5>Enterprise Security</h5>
                        <p>
                          Bank-grade security protocols protecting your digital assets
                        </p>
                      </div>
                    </div>
                    <div className="about-box bg-color border-none">
                      <div className="icon">
                        <Icon icon={Zap} size={32} variant="purple" className="mono-icon" />
                      </div>
                      <div className="content">
                        <h5>Lightning Fast</h5>
                        <p>
                          Optimized performance at scale for global operations
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="about-box-item">
                    <div className="about-box bg-color border-none">
                      <div className="icon">
                        <Icon icon={Globe} size={32} variant="purple" className="mono-icon" />
                      </div>
                      <div className="content">
                        <h5>Global Reach</h5>
                        <p>
                          Operate seamlessly in 150+ countries worldwide
                        </p>
                      </div>
                    </div>
                    <div className="about-box bg-color border-none">
                      <div className="icon">
                        <Icon icon={CheckCircle} size={32} variant="purple" className="mono-icon" />
                      </div>
                      <div className="content">
                        <h5>Compliance Ready</h5>
                        <p>
                          Meet international standards and regulatory requirements
                        </p>
                      </div>
                    </div>
                  </div>
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
            radial-gradient(circle at 16% 8%, rgba(108, 92, 231, 0.18) 0%, transparent 30%),
            linear-gradient(180deg, #120a32 0%, #0b071d 54%, #06060a 100%) !important;
          background-color: #0b071d !important;
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
      `}</style>
    </section>
  );
}

function AboutGlbModel() {
  const mountRef = useRef<HTMLDivElement>(null);

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
    loader.load('/assets/img/home-7/3d/3d_3.glb', (gltf) => {
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
    });

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

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
}
