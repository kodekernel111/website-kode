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

  // Tag-universe: render HTML-like tags as sprites that orbit the scene
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
    const tags = ["<div>", "<h1>", "<p>", "<button>", "<svg>", "<canvas>", "<script>", "<a>", "<section>", "<header>", "<footer>"];
    const tagGroup = new THREE.Group();
    const tagResources = [];

    const createTagSprite = (text) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // smaller font for a more delicate look
      const fontSize = 26;
      ctx.font = `${fontSize}px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto`;
      // size canvas to fit text
      const measure = ctx.measureText(text);
      const padding = 14;
      const baseWidth = Math.ceil(measure.width + padding * 2);
      const baseHeight = fontSize + padding * 2;

      // high DPI support
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = baseWidth * dpr;
      canvas.height = baseHeight * dpr;
      // draw at CSS size, but scale the context for DPR
      ctx.scale(dpr, dpr);

      // rounded rect background with subtle gradient and glow
      const wCSS = baseWidth;
      const hCSS = baseHeight;
      const radius = 10;
      const grad = ctx.createLinearGradient(0, 0, wCSS, 0);
      grad.addColorStop(0, "rgba(124,58,237,0.14)");
      grad.addColorStop(1, "rgba(96,165,250,0.06)");

      ctx.shadowColor = "rgba(99,102,241,0.22)";
      ctx.shadowBlur = 12;
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(radius, 0);
      ctx.arcTo(wCSS, 0, wCSS, hCSS, radius);
      ctx.arcTo(wCSS, hCSS, 0, hCSS, radius);
      ctx.arcTo(0, hCSS, 0, 0, radius);
      ctx.arcTo(0, 0, wCSS, 0, radius);
      ctx.closePath();
      ctx.fill();

      // subtle border glow
      ctx.shadowBlur = 0;
      ctx.strokeStyle = "rgba(99,102,241,0.08)";
      ctx.lineWidth = 1.2;
      ctx.stroke();

      // text gradient fill
      const textGrad = ctx.createLinearGradient(0, 0, wCSS, 0);
      textGrad.addColorStop(0, "#F0ABFC");
      textGrad.addColorStop(1, "#60A5FA");
      ctx.font = `${fontSize}px ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto`;
      ctx.fillStyle = textGrad;
      ctx.textBaseline = "middle";
      // slight shadow for depth
      ctx.shadowColor = "rgba(2,6,23,0.35)";
      ctx.shadowBlur = 8;
      ctx.fillText(text, padding, hCSS / 2 + 2);

      // small accent dot to the left
      ctx.shadowBlur = 0;
      ctx.fillStyle = "rgba(99,102,241,0.95)";
      ctx.beginPath();
      ctx.arc(padding / 2, hCSS / 2, 4, 0, Math.PI * 2);
      ctx.fill();

      const texture = new THREE.CanvasTexture(canvas);
      texture.needsUpdate = true;
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.encoding = THREE.sRGBEncoding;

      const material = new THREE.SpriteMaterial({ map: texture, transparent: true, depthTest: true });
      const sprite = new THREE.Sprite(material);

      // scale to reasonable world units (smaller than before)
      const w = (wCSS) * 0.0045;
      const h = (hCSS) * 0.0045;
      sprite.scale.set(w, h, 1);

      tagResources.push({ texture, material, canvas });
      return sprite;
    };

    for (let i = 0; i < tags.length; i++) {
      const s = createTagSprite(tags[i]);
      // spherical placement
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = 3.2 + Math.random() * 2.4;
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.cos(phi);
      const z = r * Math.sin(phi) * Math.sin(theta);
      s.position.set(x, y, z);
      // slight random orientation
      s.material.rotation = Math.random() * Math.PI * 2;
      tagGroup.add(s);
    }
    scene.add(tagGroup);

    // Responsive resize
    const onResize = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };
    window.addEventListener("resize", onResize);

    // Entrance animation via GSAP (initial pose)
    gsap.fromTo(
      knot.rotation,
      { y: 0.6, x: 0.2 },
      { y: 0, x: 0, duration: 1.6, ease: "power3.out" }
    );

    // GSAP breathing pulse on emissive intensity
    gsap.to(material, { emissiveIntensity: 0.8, duration: 2.4, repeat: -1, yoyo: true, ease: "sine.inOut" });
    // tag entrance stagger
    gsap.from(tagGroup.children.map((c) => c.scale), {
      x: 0.12,
      y: 0.12,
      duration: 0.9,
      ease: "back.out(1.7)",
      stagger: 0.06,
    });

    // Pointer / parallax support
    const pointer = { x: 0, y: 0 };
    const targetRot = { x: 0, y: 0 };
    const onPointerMove = (e) => {
      const rect = mount.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5; // -0.5..0.5
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      pointer.x = nx;
      pointer.y = ny;
      // subtle target rotation scaled for pleasant motion
      targetRot.y = nx * 1.2;
      targetRot.x = -ny * 0.9;
    };
    window.addEventListener("pointermove", onPointerMove);

    let rafId;
    const animate = (time) => {
      const t = time * 0.001;

      // smoothly approach target rotation (lerp)
      knot.rotation.x += (targetRot.x - knot.rotation.x) * 0.06;
      knot.rotation.y += (targetRot.y - knot.rotation.y) * 0.06;

      // additional subtle procedural motion
      knot.rotation.x += 0.08 * Math.sin(t * 0.6);
      knot.rotation.y += 0.006 + Math.sin(t * 0.5) * 0.002;

      // bobbing and pulsing scale for more life
      knot.position.y = Math.sin(t * 1.2) * 0.14;
      const scale = 0.95 + 0.06 * Math.sin(t * 2.0);
      knot.scale.setScalar(scale);

      // particle motion: gentle orbit + vertical drift
        // orbit the tag group to create the 'universe' motion
        tagGroup.rotation.y += 0.0016 + 0.0005 * Math.sin(t * 0.7);
        // make each tag gently face the camera and spin slowly
        tagGroup.children.forEach((child, idx) => {
          // small individual oscillation
          child.position.x += Math.sin(t * 0.4 + idx) * 0.0002;
          child.position.y += Math.cos(t * 0.3 + idx) * 0.0002;
          child.material.rotation += 0.0009 + (idx % 2 ? -0.0006 : 0.0006);
        });

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("pointermove", onPointerMove);
      mount.removeChild(renderer.domElement);
      // dispose geometries/materials
      geometry.dispose();
      material.dispose();
      particles.dispose();
      pMaterial.dispose();

      // dispose tag resources (textures & materials)
      try {
        if (tagGroup) scene.remove(tagGroup);
        tagResources.forEach((r) => {
          try {
            if (r.material) {
              if (r.material.map) r.material.map = null;
              r.material.dispose();
            }
            if (r.texture) r.texture.dispose();
          } catch (e) {
            // ignore individual dispose errors
          }
        });
      } catch (e) {
        // ignore
      }

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
