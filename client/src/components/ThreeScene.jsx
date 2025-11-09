import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

export default function ThreeScene({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight, false);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    mount.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    // Geometry: a subtle torus knot + particle field
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.35, 128, 32);
    const material = new THREE.MeshStandardMaterial({
      color: 0x4f46e5,
      metalness: 0.6,
      roughness: 0.2,
      emissive: 0x0b1022,
      emissiveIntensity: 0.2,
    });
    const knot = new THREE.Mesh(geometry, material);
    knot.scale.setScalar(0.9);
    scene.add(knot);

    // Particles
    const particleCount = 120;
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3 + 0] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    particles.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMaterial = new THREE.PointsMaterial({ color: 0xc7b8ff, size: 0.06, sizeAttenuation: true, opacity: 0.9, transparent: true });
    const particlePoints = new THREE.Points(particles, pMaterial);
    scene.add(particlePoints);

    // Responsive resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    // Entrance animation via GSAP
    gsap.fromTo(
      knot.rotation,
      { y: 0.6, x: 0.2 },
      { y: 0, x: 0, duration: 1.6, ease: "power3.out" }
    );

    let rafId;
    const animate = (time) => {
      const t = time * 0.001;
      knot.rotation.x = 0.2 * Math.sin(t * 0.6);
      knot.rotation.y += 0.005 + Math.sin(t * 0.5) * 0.002;
      particlePoints.rotation.y += 0.0008;
      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", onResize);
      mount.removeChild(renderer.domElement);
      // dispose geometries/materials
      geometry.dispose();
      material.dispose();
      particles.dispose();
      pMaterial.dispose();
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
