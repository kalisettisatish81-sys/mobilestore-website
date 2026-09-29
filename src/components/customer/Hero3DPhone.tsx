'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import * as THREE from 'three';

const COLOR_OPTIONS = [
  { name: 'Natural Titanium', hex: 0xb3b0a9, bgClass: 'bg-[#b3b0a9]', borderClass: 'border-[#b3b0a9]' },
  { name: 'Obsidian Black', hex: 0x1c1d21, bgClass: 'bg-[#1c1d21]', borderClass: 'border-slate-600' },
  { name: 'Deep Space Blue', hex: 0x1e3a5f, bgClass: 'bg-[#1e3a5f]', borderClass: 'border-blue-400' },
  { name: 'Cosmic Emerald', hex: 0x1b4332, bgClass: 'bg-[#1b4332]', borderClass: 'border-emerald-400' },
];

export default function Hero3DPhone() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[0]);
  const [isHovered, setIsHovered] = useState(false);
  const [isInteracting, setIsInteracting] = useState(false);

  // References for Three.js state
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const phoneGroupRef = useRef<THREE.Group | null>(null);
  const frameMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const cameraBumpMaterialRef = useRef<THREE.MeshPhysicalMaterial | null>(null);
  const ringsRef = useRef<THREE.Group | null>(null);
  const particlesRef = useRef<THREE.Points | null>(null);
  const animFrameIdRef = useRef<number | null>(null);

  // Mouse & interaction tracking
  const targetRotation = useRef({ x: 0.15, y: -0.35 });
  const currentRotation = useRef({ x: 0.15, y: -0.35 });
  const isDragging = useRef(false);
  const previousMousePosition = useRef({ x: 0, y: 0 });

  // Update phone body color dynamically
  const handleColorChange = useCallback((option: typeof COLOR_OPTIONS[0]) => {
    setSelectedColor(option);
    if (frameMaterialRef.current) {
      frameMaterialRef.current.color.setHex(option.hex);
    }
    if (cameraBumpMaterialRef.current) {
      cameraBumpMaterialRef.current.color.setHex(option.hex);
    }
  }, []);

  // Generate high-resolution dynamic screen texture
  const createScreenTexture = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 2048;
    const ctx = canvas.getContext('2d');
    if (!ctx) return new THREE.CanvasTexture(canvas);

    // 1. OLED Screen Background Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 1024, 2048);
    bgGrad.addColorStop(0, '#090d16');
    bgGrad.addColorStop(0.3, '#151b32');
    bgGrad.addColorStop(0.65, '#2e1065');
    bgGrad.addColorStop(1, '#090514');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 1024, 2048);

    // 2. Cosmic Nebular Ambient Glow
    const aura = ctx.createRadialGradient(512, 900, 50, 512, 900, 600);
    aura.addColorStop(0, 'rgba(129, 140, 248, 0.45)');
    aura.addColorStop(0.5, 'rgba(192, 132, 252, 0.2)');
    aura.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = aura;
    ctx.fillRect(0, 0, 1024, 2048);

    // 3. Dynamic Island Notch
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.roundRect(412, 50, 200, 56, 28);
    ctx.fill();

    // Island Camera Lens reflection
    ctx.fillStyle = '#1e1b4b';
    ctx.beginPath();
    ctx.arc(580, 78, 12, 0, Math.PI * 2);
    ctx.fill();

    // 4. Status Bar
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 36px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('9:41', 90, 90);

    // 5G & Battery Icons
    ctx.font = '700 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('5G', 860, 90);
    ctx.strokeRect(915, 68, 50, 24);
    ctx.fillRect(919, 72, 36, 16);
    ctx.fillRect(966, 75, 4, 10);

    // 5. Lockscreen Time & Date
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
    ctx.font = '500 42px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('Tuesday, September 29', 512, 380);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 170px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.shadowColor = 'rgba(168, 85, 247, 0.5)';
    ctx.shadowBlur = 30;
    ctx.fillText('09:41', 512, 550);
    ctx.shadowBlur = 0;

    // 6. Holographic Central Widget: "Snapdragon 8 Elite / A18 Pro"
    ctx.fillStyle = 'rgba(15, 23, 42, 0.65)';
    ctx.strokeStyle = 'rgba(129, 140, 248, 0.5)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.roundRect(112, 700, 800, 240, 48);
    ctx.fill();
    ctx.stroke();

    // Widget content
    ctx.textAlign = 'left';
    ctx.fillStyle = '#818cf8';
    ctx.font = '700 32px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('⚡ NEXT-GEN FLAGSHIP ARCHITECTURE', 160, 770);

    ctx.fillStyle = '#ffffff';
    ctx.font = '800 52px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('Snapdragon 8 Elite • A18 Pro', 160, 840);

    ctx.fillStyle = '#94a3b8';
    ctx.font = '500 30px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
    ctx.fillText('4,500 nits Peak Brightness • ProMotion 120Hz', 160, 895);

    // 7. Grid of App Icons
    const apps = [
      { name: 'Store', color: '#6366f1', icon: '✦' },
      { name: 'Camera', color: '#0ea5e9', icon: '📸' },
      { name: 'Display', color: '#ec4899', icon: '⚡' },
      { name: 'Battery', color: '#10b981', icon: '🔋' },
    ];

    const startX = 142;
    const startY = 1040;
    const gap = 200;

    apps.forEach((app, i) => {
      const x = startX + i * gap;
      const y = startY;

      // Icon Box
      ctx.fillStyle = app.color;
      ctx.beginPath();
      ctx.roundRect(x, y, 140, 140, 36);
      ctx.fill();

      // Icon Symbol
      ctx.fillStyle = '#ffffff';
      ctx.font = '64px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.textAlign = 'center';
      ctx.fillText(app.icon, x + 70, y + 95);

      // Icon Label
      ctx.fillStyle = '#cbd5e1';
      ctx.font = '500 28px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto';
      ctx.fillText(app.name, x + 70, y + 195);
    });

    // 8. Bottom Home Indicator Bar
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.beginPath();
    ctx.roundRect(332, 1980, 360, 14, 7);
    ctx.fill();

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    return texture;
  }, []);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Dimensions
    const width = container.clientWidth || 400;
    const height = container.clientHeight || 500;

    // 1. Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 0, 12);

    // 3. WebGL Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xffffff, 2.5);
    mainKeyLight.position.set(5, 8, 8);
    scene.add(mainKeyLight);

    const rimLight = new THREE.DirectionalLight(0x818cf8, 4.0);
    rimLight.position.set(-6, -4, -6);
    scene.add(rimLight);

    const purpleSpot = new THREE.PointLight(0xa855f7, 3.0, 20);
    purpleSpot.position.set(4, -3, 5);
    scene.add(purpleSpot);

    const cyanPoint = new THREE.PointLight(0x38bdf8, 2.5, 20);
    cyanPoint.position.set(-4, 4, 4);
    scene.add(cyanPoint);

    // 5. Construct 3D Smartphone Assembly
    const phoneGroup = new THREE.Group();
    scene.add(phoneGroup);
    phoneGroupRef.current = phoneGroup;

    // Dimensions: 3.2 width x 6.6 height x 0.28 depth
    const phoneWidth = 3.2;
    const phoneHeight = 6.6;
    const phoneDepth = 0.28;
    const cornerRadius = 0.55;

    // Create 2D Rounded Rectangle Shape
    const shape = new THREE.Shape();
    const x = -phoneWidth / 2;
    const y = -phoneHeight / 2;
    shape.moveTo(x + cornerRadius, y);
    shape.lineTo(x + phoneWidth - cornerRadius, y);
    shape.quadraticCurveTo(x + phoneWidth, y, x + phoneWidth, y + cornerRadius);
    shape.lineTo(x + phoneWidth, y + phoneHeight - cornerRadius);
    shape.quadraticCurveTo(x + phoneWidth, y + phoneHeight, x + phoneWidth - cornerRadius, y + phoneHeight);
    shape.lineTo(x + cornerRadius, y + phoneHeight);
    shape.quadraticCurveTo(x, y + phoneHeight, x, y + phoneHeight - cornerRadius);
    shape.lineTo(x, y + cornerRadius);
    shape.quadraticCurveTo(x, y, x + cornerRadius, y);

    // Extrude geometry for phone frame with beveled edges
    const extrudeSettings = {
      depth: phoneDepth,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 1,
      bevelSize: 0.06,
      bevelThickness: 0.06,
    };
    const bodyGeometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
    bodyGeometry.center();

    // Metallic frame material
    const frameMaterial = new THREE.MeshPhysicalMaterial({
      color: selectedColor.hex,
      metalness: 0.88,
      roughness: 0.22,
      clearcoat: 0.9,
      clearcoatRoughness: 0.1,
      reflectivity: 0.9,
    });
    frameMaterialRef.current = frameMaterial;

    const phoneBody = new THREE.Mesh(bodyGeometry, frameMaterial);
    phoneGroup.add(phoneBody);

    // OLED Screen Face (Front Plane)
    const screenGeometry = new THREE.PlaneGeometry(phoneWidth - 0.16, phoneHeight - 0.16);
    const screenTexture = createScreenTexture();
    const screenMaterial = new THREE.MeshStandardMaterial({
      map: screenTexture,
      roughness: 0.15,
      metalness: 0.1,
      emissive: 0x111122,
      emissiveIntensity: 0.2,
    });
    const screenMesh = new THREE.Mesh(screenGeometry, screenMaterial);
    screenMesh.position.z = phoneDepth / 2 + 0.065;
    phoneGroup.add(screenMesh);

    // Glass Screen Protector Sheen Layer
    const glassGeometry = new THREE.PlaneGeometry(phoneWidth - 0.14, phoneHeight - 0.14);
    const glassMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.12,
      roughness: 0.05,
      transmission: 0.9,
      thickness: 0.05,
      clearcoat: 1.0,
    });
    const glassMesh = new THREE.Mesh(glassGeometry, glassMaterial);
    glassMesh.position.z = phoneDepth / 2 + 0.07;
    phoneGroup.add(glassMesh);

    // Back Camera Island (Top-Left on Back)
    const bumpWidth = 1.35;
    const bumpHeight = 1.55;
    const bumpRadius = 0.32;
    const bumpShape = new THREE.Shape();
    const bx = -bumpWidth / 2;
    const by = -bumpHeight / 2;
    bumpShape.moveTo(bx + bumpRadius, by);
    bumpShape.lineTo(bx + bumpWidth - bumpRadius, by);
    bumpShape.quadraticCurveTo(bx + bumpWidth, by, bx + bumpWidth, by + bumpRadius);
    bumpShape.lineTo(bx + bumpWidth, by + bumpHeight - bumpRadius);
    bumpShape.quadraticCurveTo(bx + bumpWidth, by + bumpHeight, bx + bumpWidth - bumpRadius, by + bumpHeight);
    bumpShape.lineTo(bx + bumpRadius, by + bumpHeight);
    bumpShape.quadraticCurveTo(bx, by + bumpHeight, bx, by + bumpHeight - bumpRadius);
    bumpShape.lineTo(bx, by + bumpRadius);
    bumpShape.quadraticCurveTo(bx, by, bx + bumpRadius, by);

    const bumpGeometry = new THREE.ExtrudeGeometry(bumpShape, {
      depth: 0.12,
      bevelEnabled: true,
      bevelSegments: 4,
      bevelSize: 0.03,
      bevelThickness: 0.03,
    });
    bumpGeometry.center();

    const bumpMaterial = new THREE.MeshPhysicalMaterial({
      color: selectedColor.hex,
      metalness: 0.85,
      roughness: 0.3,
      clearcoat: 0.8,
    });
    cameraBumpMaterialRef.current = bumpMaterial;

    const cameraBump = new THREE.Mesh(bumpGeometry, bumpMaterial);
    cameraBump.position.set(-0.75, 2.0, -phoneDepth / 2 - 0.08);
    phoneGroup.add(cameraBump);

    // 3 Camera Lenses with Sapphire Glass Rings
    const lensPositions = [
      { x: -0.98, y: 2.38 },
      { x: -0.98, y: 1.62 },
      { x: -0.52, y: 2.0 },
    ];

    lensPositions.forEach((pos) => {
      // Outer lens bezel
      const bezelGeom = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 32);
      bezelGeom.rotateX(Math.PI / 2);
      const bezelMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.9, roughness: 0.2 });
      const bezel = new THREE.Mesh(bezelGeom, bezelMat);
      bezel.position.set(pos.x, pos.y, -phoneDepth / 2 - 0.14);
      phoneGroup.add(bezel);

      // Inner sapphire lens element
      const lensGeom = new THREE.CylinderGeometry(0.18, 0.18, 0.09, 32);
      lensGeom.rotateX(Math.PI / 2);
      const lensMat = new THREE.MeshPhysicalMaterial({
        color: 0x0f172a,
        metalness: 0.9,
        roughness: 0.1,
        clearcoat: 1.0,
        clearcoatRoughness: 0.05,
      });
      const lens = new THREE.Mesh(lensGeom, lensMat);
      lens.position.set(pos.x, pos.y, -phoneDepth / 2 - 0.15);
      phoneGroup.add(lens);
    });

    // Flash & LiDAR
    const flashGeom = new THREE.CircleGeometry(0.08, 16);
    flashGeom.rotateY(Math.PI);
    const flashMat = new THREE.MeshBasicMaterial({ color: 0xfef08a });
    const flash = new THREE.Mesh(flashGeom, flashMat);
    flash.position.set(-0.52, 2.45, -phoneDepth / 2 - 0.15);
    phoneGroup.add(flash);

    // 6. Holographic Orbit Rings in 3D Space
    const ringsGroup = new THREE.Group();
    scene.add(ringsGroup);
    ringsRef.current = ringsGroup;

    const ring1Geom = new THREE.TorusGeometry(4.4, 0.015, 16, 100);
    const ring1Mat = new THREE.MeshBasicMaterial({ color: 0x818cf8, transparent: true, opacity: 0.45 });
    const ring1 = new THREE.Mesh(ring1Geom, ring1Mat);
    ring1.rotation.x = Math.PI / 3;
    ring1.rotation.y = Math.PI / 6;
    ringsGroup.add(ring1);

    const ring2Geom = new THREE.TorusGeometry(5.0, 0.012, 16, 100);
    const ring2Mat = new THREE.MeshBasicMaterial({ color: 0xc084fc, transparent: true, opacity: 0.35 });
    const ring2 = new THREE.Mesh(ring2Geom, ring2Mat);
    ring2.rotation.x = -Math.PI / 4;
    ring2.rotation.y = Math.PI / 4;
    ringsGroup.add(ring2);

    // 7. 3D Floating Particle Sparkles
    const particleCount = 140;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      particlePositions[i] = (Math.random() - 0.5) * 16;
      particlePositions[i + 1] = (Math.random() - 0.5) * 16;
      particlePositions[i + 2] = (Math.random() - 0.5) * 12;
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xa5b4fc,
      size: 0.06,
      transparent: true,
      opacity: 0.65,
    });
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
    particlesRef.current = particles;

    // 8. Contact Shadow Plane below phone
    const shadowCanvas = document.createElement('canvas');
    shadowCanvas.width = 128;
    shadowCanvas.height = 128;
    const sCtx = shadowCanvas.getContext('2d');
    if (sCtx) {
      const grad = sCtx.createRadialGradient(64, 64, 10, 64, 64, 60);
      grad.addColorStop(0, 'rgba(0, 0, 0, 0.7)');
      grad.addColorStop(0.5, 'rgba(0, 0, 0, 0.3)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 128, 128);
    }
    const shadowTexture = new THREE.CanvasTexture(shadowCanvas);
    const shadowGeom = new THREE.PlaneGeometry(5.5, 3.5);
    const shadowMat = new THREE.MeshBasicMaterial({ map: shadowTexture, transparent: true, opacity: 0.65 });
    const shadowMesh = new THREE.Mesh(shadowGeom, shadowMat);
    shadowMesh.rotation.x = -Math.PI / 2;
    shadowMesh.position.y = -4.2;
    scene.add(shadowMesh);

    // 9. Resize Observer
    const handleResize = () => {
      if (!container || !renderer || !camera) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 10. Animation Loop
    const clock = new THREE.Clock();

    const animate = () => {
      animFrameIdRef.current = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();

      // Smooth interpolation (lerp) towards target mouse/drag rotation
      currentRotation.current.x += (targetRotation.current.x - currentRotation.current.x) * 0.08;
      currentRotation.current.y += (targetRotation.current.y - currentRotation.current.y) * 0.08;

      if (phoneGroupRef.current) {
        // Natural floating bobbing motion
        const floatOffset = Math.sin(elapsedTime * 1.5) * 0.22;
        phoneGroupRef.current.position.y = floatOffset;

        // Base floating tilt + user interaction
        const idleX = Math.sin(elapsedTime * 0.8) * 0.05;
        const idleY = Math.cos(elapsedTime * 0.6) * 0.08;

        phoneGroupRef.current.rotation.x = currentRotation.current.x + idleX;
        phoneGroupRef.current.rotation.y = currentRotation.current.y + idleY;
        phoneGroupRef.current.rotation.z = Math.sin(elapsedTime * 0.7) * 0.03;

        // Scale shadow based on float height
        if (shadowMesh) {
          const shadowScale = 1 - floatOffset * 0.3;
          shadowMesh.scale.set(shadowScale, shadowScale, 1);
        }
      }

      // Rotate Holographic Orbit Rings
      if (ringsRef.current) {
        ringsRef.current.rotation.z = elapsedTime * 0.2;
        ringsRef.current.rotation.y = elapsedTime * 0.15;
      }

      // Gently rotate particle starfield
      if (particlesRef.current) {
        particlesRef.current.rotation.y = elapsedTime * 0.03;
      }

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup on unmount
    return () => {
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
      resizeObserver.disconnect();
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      bodyGeometry.dispose();
      screenGeometry.dispose();
      glassGeometry.dispose();
      bumpGeometry.dispose();
      particleGeometry.dispose();
      shadowGeom.dispose();
      frameMaterial.dispose();
      screenMaterial.dispose();
      glassMaterial.dispose();
      bumpMaterial.dispose();
      particleMaterial.dispose();
      shadowMat.dispose();
    };
  }, [createScreenTexture, selectedColor.hex]);

  // Mouse move handler for 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging.current) {
      const deltaX = e.clientX - previousMousePosition.current.x;
      const deltaY = e.clientY - previousMousePosition.current.y;
      targetRotation.current.y += deltaX * 0.012;
      targetRotation.current.x += deltaY * 0.012;
      previousMousePosition.current = { x: e.clientX, y: e.clientY };
      return;
    }

    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Clamp rotation range for smooth natural parallax
    targetRotation.current.y = -0.35 + x * 0.9;
    targetRotation.current.x = 0.15 - y * 0.7;
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDragging.current = true;
    setIsInteracting(true);
    previousMousePosition.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDragging.current = false;
    setIsInteracting(false);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      isDragging.current = true;
      setIsInteracting(true);
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (isDragging.current && e.touches.length === 1) {
      const deltaX = e.touches[0].clientX - previousMousePosition.current.x;
      const deltaY = e.touches[0].clientY - previousMousePosition.current.y;
      targetRotation.current.y += deltaX * 0.015;
      targetRotation.current.x += deltaY * 0.015;
      previousMousePosition.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleTouchEnd = () => {
    isDragging.current = false;
    setIsInteracting(false);
  };

  const handleResetOrientation = () => {
    targetRotation.current = { x: 0.15, y: -0.35 };
  };

  return (
    <div
      className="relative w-full flex flex-col items-center justify-center select-none"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        isDragging.current = false;
        setIsInteracting(false);
        targetRotation.current = { x: 0.15, y: -0.35 };
      }}
    >
      {/* 3D Holographic Canvas Area */}
      <div
        ref={mountRef}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative w-full h-[460px] sm:h-[540px] lg:h-[580px] cursor-grab active:cursor-grabbing touch-none transition-transform duration-300 ${
          isInteracting ? 'scale-[1.02]' : ''
        }`}
        aria-label="Interactive 3D Smartphone Display. Drag to rotate in 3D."
        role="region"
      >
        {/* Floating 3D Spec Badge: Top Left */}
        <div
          className="absolute left-2 sm:left-4 top-10 sm:top-14 z-20 pointer-events-none transform transition-all duration-300 backdrop-blur-md bg-slate-900/85 border border-indigo-500/30 rounded-2xl p-3 shadow-xl shadow-indigo-950/40"
          style={{ transform: `translateY(${isHovered ? '-4px' : '0px'})` }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-indigo-500/20 text-indigo-400 font-bold text-sm">
              3D
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">Interactive Model</p>
              <p className="text-xs font-extrabold text-white">Drag to Rotate 360°</p>
            </div>
          </div>
        </div>

        {/* Floating 3D Spec Badge: Bottom Right */}
        <div
          className="absolute right-2 sm:right-4 bottom-12 sm:bottom-16 z-20 pointer-events-none transform transition-all duration-300 backdrop-blur-md bg-slate-900/85 border border-violet-500/30 rounded-2xl p-3 shadow-xl shadow-violet-950/40"
          style={{ transform: `translateY(${isHovered ? '4px' : '0px'})` }}
        >
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-500/20 text-violet-400 font-bold text-sm">
              ⚡
            </span>
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-violet-400">Pro Display</p>
              <p className="text-xs font-extrabold text-white">120Hz ProMotion OLED</p>
            </div>
          </div>
        </div>

        {/* Floating Spec Badge: Bottom Left */}
        <div className="hidden sm:flex absolute left-4 bottom-10 z-20 pointer-events-none backdrop-blur-md bg-slate-900/80 border border-emerald-500/30 rounded-2xl p-2.5 shadow-lg">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
            <p className="text-xs font-bold text-slate-200">Titanium Aerospace Chassis</p>
          </div>
        </div>
      </div>

      {/* Interactive 3D Controls Bar */}
      <div className="mt-2 flex flex-wrap items-center justify-center gap-4 sm:gap-6 bg-slate-900/80 border border-slate-800/80 px-4 py-2.5 rounded-2xl backdrop-blur-md shadow-lg z-30">
        <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Finish:</span>

        {/* Color Palette Switcher */}
        <div className="flex items-center gap-2.5" role="radiogroup" aria-label="Smartphone Color Finishes">
          {COLOR_OPTIONS.map((opt) => {
            const isCurrent = selectedColor.name === opt.name;
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => handleColorChange(opt)}
                title={opt.name}
                aria-label={`Select ${opt.name} finish`}
                aria-checked={isCurrent}
                role="radio"
                className={`group relative h-7 w-7 rounded-full ${opt.bgClass} transition-transform duration-200 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 cursor-pointer ${
                  isCurrent ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110' : 'opacity-70 hover:opacity-100'
                }`}
              >
                <span className="sr-only">{opt.name}</span>
              </button>
            );
          })}
        </div>

        <div className="h-4 w-px bg-slate-700 hidden sm:block" />

        {/* Reset Angle Button */}
        <button
          type="button"
          onClick={handleResetOrientation}
          className="text-xs font-medium text-slate-400 hover:text-indigo-300 transition-colors flex items-center gap-1.5 cursor-pointer focus:outline-none"
          title="Reset 3D view orientation"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          <span>Reset 3D Angle</span>
        </button>
      </div>

      <p className="mt-2 text-[11px] text-slate-500 text-center font-medium">
        ✦ Drag or touch to rotate phone in 3D • Move cursor to tilt
      </p>
    </div>
  );
}
