import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface RotaryWheel3DProps {
  className?: string;
  imageSrc?: string;
}

export const RotaryWheel3D: React.FC<RotaryWheel3DProps> = ({
  className = '',
  imageSrc = '/rotary-wheel.png'
}) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const width = mount.clientWidth || 500;
    const height = mount.clientHeight || 500;

    // 1. Scene, Camera, Transparent Renderer
    const scene = new THREE.Scene();
    // Camera positioned with wider view (z = 270) so no orbital lines can ever reach frustum boundaries
    const camera = new THREE.PerspectiveCamera(42, width / height, 0.1, 1000);
    camera.position.z = 270;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);

    // 2. Master Rig Group (tilts and rotates when user moves / drags mouse)
    const rigGroup = new THREE.Group();
    scene.add(rigGroup);

    // Wheel-only group (holds the actual rotary gear wheel so only it spins continuously and stops on drag)
    const wheelGroup = new THREE.Group();
    rigGroup.add(wheelGroup);

    // 3. Extruded Depth Layers using Flat Unlit Shader with Thin Black Edge Linework
    const textureLoader = new THREE.TextureLoader();
    textureLoader.load(imageSrc, (texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;

      const size = 130;
      const depth = 8;
      const layerCount = 14;

      const createFaceMaterial = () =>
        new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true,
          alphaTest: 0.05,
          side: THREE.FrontSide,
        });

      // Front Face
      const frontMesh = new THREE.Mesh(new THREE.PlaneGeometry(size, size), createFaceMaterial());
      frontMesh.position.z = depth / 2;
      wheelGroup.add(frontMesh);

      // Back Face (Unmirrored reading)
      const backGeo = new THREE.PlaneGeometry(size, size);
      backGeo.rotateY(Math.PI);
      const backMesh = new THREE.Mesh(backGeo, createFaceMaterial());
      backMesh.position.z = -depth / 2;
      wheelGroup.add(backMesh);

      // Subtle thin black edge contour silhouettes
      const edgeLineMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        color: 0x111111,
        alphaTest: 0.05,
        side: THREE.DoubleSide,
        opacity: 0.85,
        depthWrite: false,
      });

      const frontLineMesh = new THREE.Mesh(new THREE.PlaneGeometry(size * 1.008, size * 1.008), edgeLineMat);
      frontLineMesh.position.z = depth / 2 - 0.2;
      wheelGroup.add(frontLineMesh);

      const backLineMesh = new THREE.Mesh(new THREE.PlaneGeometry(size * 1.008, size * 1.008), edgeLineMat);
      backLineMesh.position.z = -depth / 2 + 0.2;
      wheelGroup.add(backLineMesh);

      // Sliced Depth Infill for 3D thickness with dark edge line accents
      const step = depth / layerCount;
      for (let i = 1; i < layerCount; i++) {
        const zPos = -depth / 2 + i * step;
        const isOuterEdge = i === 1 || i === layerCount - 1;

        const sliceMesh = new THREE.Mesh(
          new THREE.PlaneGeometry(size, size),
          new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            color: isOuterEdge ? 0x1c1c1c : 0xffffff,
            alphaTest: 0.05,
            side: THREE.DoubleSide,
            depthWrite: false,
          })
        );
        sliceMesh.position.z = zPos;
        wheelGroup.add(sliceMesh);
      }
    });

    // 4. Elegant Aura Orbital Rings in Three Distinct Rotary Theme Colors:
    // Placed directly on the rigGroup with ample radius margins
    // Ring 1: Rotary Gold (#F7A81B)
    const ringGeo1 = new THREE.RingGeometry(75, 76.5, 64);
    const ringMat1 = new THREE.MeshBasicMaterial({
      color: 0xF7A81B,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.45,
    });
    const ringMesh1 = new THREE.Mesh(ringGeo1, ringMat1);
    ringMesh1.rotation.x = Math.PI / 3;
    rigGroup.add(ringMesh1);

    // Ring 2: Rotaract Cranberry Crimson (#D41B2C)
    const ringGeo2 = new THREE.RingGeometry(83, 84.5, 64);
    const ringMat2 = new THREE.MeshBasicMaterial({
      color: 0xD41B2C,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.4,
    });
    const ringMesh2 = new THREE.Mesh(ringGeo2, ringMat2);
    ringMesh2.rotation.y = Math.PI / 3.2;
    ringMesh2.rotation.x = -Math.PI / 4.5;
    rigGroup.add(ringMesh2);

    // Ring 3: Rotary Azure Sky Blue (#38BDF8)
    const ringGeo3 = new THREE.RingGeometry(91, 92.5, 64);
    const ringMat3 = new THREE.MeshBasicMaterial({
      color: 0x38BDF8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.38,
    });
    const ringMesh3 = new THREE.Mesh(ringGeo3, ringMat3);
    ringMesh3.rotation.z = Math.PI / 4;
    ringMesh3.rotation.y = -Math.PI / 3.8;
    rigGroup.add(ringMesh3);

    // 5. Interactive Mouse & Drag Physics
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let mouseNormX = 0;
    let mouseNormY = 0;
    const spinVelocity = 0.0025;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      const rect = mount.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      mouseNormX = (x / rect.width) * 2;
      mouseNormY = -(y / rect.height) * 2;

      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        rigGroup.rotation.y += deltaX * 0.008;
        rigGroup.rotation.x += deltaY * 0.008;
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    mount.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);

    // Touch support for mobile devices
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        isDragging = true;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (isDragging && e.touches.length === 1) {
        const deltaX = e.touches[0].clientX - prevMouseX;
        const deltaY = e.touches[0].clientY - prevMouseY;
        rigGroup.rotation.y += deltaX * 0.008;
        rigGroup.rotation.x += deltaY * 0.008;
        prevMouseX = e.touches[0].clientX;
        prevMouseY = e.touches[0].clientY;
      }
    };

    const onTouchEnd = () => {
      isDragging = false;
    };

    mount.addEventListener('touchstart', onTouchStart);
    window.addEventListener('touchmove', onTouchMove);
    window.addEventListener('touchend', onTouchEnd);

    // 6. Animation Loop
    let animationFrameId: number;
    let baseTime = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      baseTime += 0.01;

      // When dragging with mouse, ONLY the central wheel auto-rotation pauses.
      // All three orbital aura lines ALWAYS continue their orbital rotation smoothly!
      if (!isDragging) {
        wheelGroup.rotation.z -= spinVelocity;

        const targetTiltX = -mouseNormY * 0.22;
        const targetTiltY = mouseNormX * 0.32;
        rigGroup.rotation.x += (targetTiltX - rigGroup.rotation.x) * 0.04;
        rigGroup.rotation.y += (targetTiltY - rigGroup.rotation.y) * 0.04;

        rigGroup.position.y = Math.sin(baseTime * 1.2) * 2.5;
      }

      // Continuous independent orbit animation for all 3 aura lines
      ringMesh1.rotation.z += 0.003;
      ringMesh2.rotation.z -= 0.0035;
      ringMesh3.rotation.x += 0.0028;

      renderer.render(scene, camera);
    };

    animate();

    const handleResize = () => {
      if (!mount) return;
      const newW = mount.clientWidth;
      const newH = mount.clientHeight;
      camera.aspect = newW / newH;
      camera.updateProjectionMatrix();
      renderer.setSize(newW, newH);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      mount.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      mount.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [imageSrc]);

  return (
    <div 
      ref={mountRef} 
      className={`w-full h-full min-h-[460px] flex items-center justify-center cursor-grab active:cursor-grabbing select-none ${className}`} 
    />
  );
};
