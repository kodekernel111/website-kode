import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import Lenis from "lenis";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
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
    // We'll place the renderer as a fixed fullscreen background so the 3D scene
    // becomes the app's background. Create or reuse a dedicated container
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.position = "fixed";
    renderer.domElement.style.left = "0";
    renderer.domElement.style.top = "0";
  // place canvas behind the overlay and content
  renderer.domElement.style.zIndex = "-2";
    renderer.domElement.style.pointerEvents = "none";

    // prefer an existing background container so multiple mounts don't create duplicates
    let bgContainer = document.getElementById("site-3d-bg");
    let createdBg = false;
    if (!bgContainer) {
      bgContainer = document.createElement("div");
      bgContainer.id = "site-3d-bg";
      // ensure container fills the viewport and sits behind content
      Object.assign(bgContainer.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        zIndex: -2,
        overflow: "hidden",
        pointerEvents: "none",
      });
      document.body.appendChild(bgContainer);
      createdBg = true;
    }
    bgContainer.appendChild(renderer.domElement);

    // create a subtle overlay between canvas and page content to preserve contrast
    let overlay = document.getElementById("site-3d-overlay");
    let createdOverlay = false;
    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = "site-3d-overlay";
      Object.assign(overlay.style, {
        position: "fixed",
        left: "0",
        top: "0",
        width: "100%",
        height: "100%",
        zIndex: -1,
        pointerEvents: "none",
        // subtle translucent layer to keep text readable on top of animated background
        background: "linear-gradient(180deg, rgba(10,12,22,0.02), rgba(10,12,22,0.06))",
        mixBlendMode: "normal",
      });
      document.body.appendChild(overlay);
      createdOverlay = true;
    }

    const camera = new THREE.PerspectiveCamera(50, mount.clientWidth / mount.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 6);

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambient);
    const dir = new THREE.DirectionalLight(0xffffff, 0.6);
    dir.position.set(5, 5, 5);
    scene.add(dir);

    // Geometry: create a subtle torus knot fallback and try loading a GLTF model
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

    // centerObject is the thing we animate; start with the torus knot as fallback
    let centerObject = knot;

    // --- Post-processing composer (bloom + FXAA) ---
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    const bloom = new UnrealBloomPass(new THREE.Vector2(mount.clientWidth, mount.clientHeight), 0.6, 0.8, 0.1);
    bloom.threshold = 0.15;
    bloom.strength = 0.9;
    bloom.radius = 0.6;
    composer.addPass(bloom);

    const fxaa = new ShaderPass(FXAAShader);
    const pixelRatio = renderer.getPixelRatio();
    fxaa.material.uniforms["resolution"].value.x = 1 / (mount.clientWidth * pixelRatio);
    fxaa.material.uniforms["resolution"].value.y = 1 / (mount.clientHeight * pixelRatio);
    composer.addPass(fxaa);

    // helper to apply rim shader via onBeforeCompile to a MeshStandardMaterial
    const applyRim = (mat, color = new THREE.Color(0x7c3aed), intensity = 0.9, power = 2.0) => {
      if (!mat || !mat.onBeforeCompile) return;
      mat.onBeforeCompile = (shader) => {
        shader.uniforms.rimColor = { value: color };
        shader.uniforms.rimIntensity = { value: intensity };
        shader.uniforms.rimPower = { value: power };
        shader.fragmentShader = 'uniform vec3 rimColor; uniform float rimIntensity; uniform float rimPower;\n' + shader.fragmentShader;
        shader.fragmentShader = shader.fragmentShader.replace(
          'void main() {',
          'void main() {\n    vec3 viewDir = normalize(-vViewPosition);\n    float rim = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), rimPower);\n    vec3 rimAdd = rimColor * rim * rimIntensity;'
        );
        shader.fragmentShader = shader.fragmentShader.replace('#include <output_fragment>', '#include <output_fragment>\n    gl_FragColor.rgb += rimAdd;');
      };
      mat.needsUpdate = true;
    };

    // apply rim to fallback material
    applyRim(material, new THREE.Color(0x9f7aea), 0.7, 1.9);

    // Try to load a GLTF model at /models/centerpiece.glb (place your exported GLB there).
    const loader = new GLTFLoader();
    let gltfScene = null;
    loader.load(
      "/models/centerpiece.glb",
      (gltf) => {
        try {
          gltfScene = gltf.scene || gltf.scenes[0];
          // apply our material style to the meshes to match the look
          gltfScene.traverse((c) => {
            if (c.isMesh) {
              c.castShadow = true;
              c.receiveShadow = true;
              // create a fresh standard material to ensure consistent shading
              const mat = new THREE.MeshStandardMaterial({
                color: 0x4f46e5,
                metalness: 0.6,
                roughness: 0.2,
                emissive: 0x0b1022,
                emissiveIntensity: 0.2,
              });
              // preserve textures if the model provided them
              if (c.material && c.material.map) mat.map = c.material.map;
              c.material = mat;
              // apply rim to model material too
              try { applyRim(c.material, new THREE.Color(0x9f7aea), 0.6, 2.2); } catch (e) {}
            }
          });

          // swap into scene
          gltfScene.scale.setScalar(0.9);
          gltfScene.position.copy(knot.position);
          scene.add(gltfScene);
          // remove fallback knot
          scene.remove(knot);
          centerObject = gltfScene;
          // dispose fallback geometry/material
          try { geometry.dispose(); material.dispose(); } catch (e) {}
        } catch (e) {
          console.warn("Error applying GLTF scene", e);
        }
      },
      undefined,
      (err) => {
        console.warn("GLTF load failed, using fallback knot:", err);
      }
    );

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
      // fullscreen background uses viewport size
      const w = window.innerWidth;
      const h = window.innerHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
      try {
        composer.setSize(w, h);
        const pixelRatio = renderer.getPixelRatio();
        if (fxaa && fxaa.material && fxaa.material.uniforms && fxaa.material.uniforms["resolution"]) {
          fxaa.material.uniforms["resolution"].value.x = 1 / (w * pixelRatio);
          fxaa.material.uniforms["resolution"].value.y = 1 / (h * pixelRatio);
        }
      } catch (e) {
        // composer may not be initialized in some cases
      }
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

    // Lenis smooth scroll instance — we'll use it to drive camera movement
    const lenis = new Lenis({
      smooth: true,
      duration: 1.2,
      lerp: 0.12,
    });

    // Integrate Lenis RAF with our rendering loop by calling lenis.raf(time)
    // Also handle resize of page height if necessary
    const onLenisScroll = () => {
      // no-op: we sample lenis.scroll inside the render loop for smooth camera updates
    };
    lenis.on("scroll", onLenisScroll);

    let rafId;
    const animate = (time) => {
      const t = time * 0.001;

      // update lenis
      try {
        lenis.raf(time);
      } catch (e) {}

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

      // use composer when available to include post-processing
      try {
        composer.render();
      } catch (e) {
        // camera scroll-driven positioning via Lenis
        try {
          const maxScroll = Math.max(document.body.scrollHeight - window.innerHeight, 1);
          const scrollVal = Math.max(0, Math.min(lenis.scroll || 0, maxScroll));
          const n = maxScroll > 0 ? scrollVal / maxScroll : 0;
          // map normalized scroll to camera transforms
          const targetZ = 6 - n * 2.8; // zoom in slightly when scrolling
          const targetY = -n * 2.0; // move camera down as user scrolls
          camera.position.y += (targetY - camera.position.y) * 0.06;
          camera.position.z += (targetZ - camera.position.z) * 0.06;
        } catch (e) {}

        // use composer when available to include post-processing
        try {
          composer.render();
        } catch (e) {
          renderer.render(scene, camera);
        }
      }
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    // cleanup
    return () => {
      cancelAnimationFrame(rafId);
  window.removeEventListener("resize", onResize);
  window.removeEventListener("pointermove", onPointerMove);
  // remove renderer DOM element from whichever parent it was appended to
  try {
    if (renderer.domElement && renderer.domElement.parentElement) {
      renderer.domElement.parentElement.removeChild(renderer.domElement);
    }
  } catch (e) {}
      // dispose geometries/materials
      try {
        geometry.dispose();
      } catch (e) {}
      try {
        material.dispose();
      } catch (e) {}
      try {
        particles.dispose();
      } catch (e) {}
      try {
        pMaterial.dispose();
      } catch (e) {}

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

      // remove background container if we created it
      try {
        if (createdBg && bgContainer && bgContainer.parentElement) {
          bgContainer.parentElement.removeChild(bgContainer);
        }
      } catch (e) {}

      // remove overlay if we created it
      try {
        if (createdOverlay && overlay && overlay.parentElement) {
          overlay.parentElement.removeChild(overlay);
        }
      } catch (e) {}

      // remove lenis listeners and destroy
      try {
        lenis.off && lenis.off("scroll", onLenisScroll);
        lenis.destroy && lenis.destroy();
      } catch (e) {}

      // dispose any loaded GLTF scene or centerObject meshes
      try {
        if (centerObject) {
          scene.remove(centerObject);
          if (centerObject.traverse) {
            centerObject.traverse((c) => {
              if (c.isMesh) {
                try {
                  if (c.geometry) c.geometry.dispose();
                } catch (e) {}
                try {
                  if (c.material) {
                    if (Array.isArray(c.material)) {
                      c.material.forEach((m) => m.dispose());
                    } else {
                      c.material.dispose();
                    }
                  }
                } catch (e) {}
              }
            });
          }
        }
      } catch (e) {}

      // dispose composer and passes
      try {
        if (composer) {
          composer.passes && composer.passes.forEach((p) => {
            try {
              if (p.dispose) p.dispose();
            } catch (e) {}
          });
          if (composer.dispose) composer.dispose();
        }
      } catch (e) {}

      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} />;
}
