import { useEffect, useRef, useState } from "react";
import { RotateCcw, Plus, Minus, Move, Maximize2 } from "lucide-react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Generated locally: no model download, external textures or remote render service.
function createLabel() {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 1024;
  const c = canvas.getContext("2d");
  c.fillStyle = "#b7f34a";
  c.fillRect(0, 0, 2048, 1024);
  c.fillStyle = "#17220d";
  c.textAlign = "center";
  c.font = "700 48px Outfit, sans-serif";
  c.fillText("POWER / SUPPS", 1024, 132);
  c.fillRect(760, 176, 528, 3);
  c.font = "800 110px Outfit, sans-serif";
  c.fillText("CREATINA", 1024, 343);
  c.font = "500 35px Outfit, sans-serif";
  c.fillText("MONOHIDRATADA", 1024, 403);
  c.font = "800 182px Outfit, sans-serif";
  c.fillText("300", 990, 650);
  c.font = "500 54px Outfit, sans-serif";
  c.fillText("g", 1153, 650);
  c.font = "500 27px Outfit, sans-serif";
  c.fillText("SUA EVOLUÇÃO É DIÁRIA.", 1024, 755);
  c.fillRect(770, 817, 508, 3);
  c.font = "400 25px Outfit, sans-serif";
  c.fillText("SUPLEMENTO ALIMENTAR EM PÓ", 1024, 873);
  c.font = "500 23px Outfit, sans-serif";
  c.fillText("CONCEITO VISUAL DA EMBALAGEM", 1024, 930);
  c.textAlign = "left";
  c.font = "700 35px Outfit, sans-serif";
  c.fillText("POWER / SUPPS", 115, 160);
  c.font = "400 25px Outfit, sans-serif";
  [
    "CREATINA MONOHIDRATADA",
    "Conteúdo líquido: 300 g",
    "",
    "Representação conceitual.",
    "Consulte o rótulo original",
    "para ingredientes, porções",
    "e modo de uso.",
  ].forEach((line, i) => c.fillText(line, 115, 255 + i * 49));
  for (let i = 0; i < 55; i++)
    c.fillRect(125 + i * 7, 775, i % 3 === 0 ? 4 : 2, 98);
  c.font = "600 34px Outfit, sans-serif";
  c.fillText("FEITO PARA", 1560, 360);
  c.fillText("ACOMPANHAR", 1560, 410);
  c.fillText("SEU RITMO.", 1560, 460);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

export default function ProductScene() {
  const host = useRef(null);
  const actions = useRef({});
  const [status, setStatus] = useState("loading");
  useEffect(() => {
    const element = host.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
        powerPreference: "low-power",
      });
    } catch {
      actions.current = {};
      queueMicrotask(() => setStatus("fallback"));
      return;
    }
    let disposed = false;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 0.7, 8.7);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    element.appendChild(renderer.domElement);
    renderer.domElement.setAttribute(
      "aria-label",
      "Pote 3D de creatina. Arraste para girar; use os botões abaixo para ampliar.",
    );
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.075;
    controls.enableZoom = true;
    // Wheel continues scrolling the page; two-finger pinch and explicit buttons zoom.
    const preservePageScroll = (event) => event.stopImmediatePropagation();
    renderer.domElement.addEventListener("wheel", preservePageScroll, {
      capture: true,
      passive: true,
    });
    controls.minDistance = 5.4;
    controls.maxDistance = 11;
    controls.minPolarAngle = 0.45;
    controls.maxPolarAngle = Math.PI - 0.45;
    controls.target.set(0, 0, 0);
    const group = new THREE.Group();
    scene.add(group);
    group.rotation.set(0.07, Math.PI, -0.14);
    const bodyMaterial = new THREE.MeshStandardMaterial({
      color: "#252724",
      roughness: 0.32,
      metalness: 0.26,
    });
    const profile = [
      [0, -1.48],
      [0.89, -1.48],
      [1.02, -1.42],
      [1.075, -1.29],
      [1.075, 0.84],
      [1.04, 1.04],
      [0.94, 1.18],
      [0.94, 1.32],
      [0, 1.32],
    ].map(([x, y]) => new THREE.Vector2(x, y));
    group.add(
      new THREE.Mesh(new THREE.LatheGeometry(profile, 80), bodyMaterial),
    );
    const labelTexture = createLabel();
    const label = new THREE.Mesh(
      new THREE.CylinderGeometry(1.079, 1.079, 1.99, 80, 1, true),
      new THREE.MeshStandardMaterial({
        map: labelTexture,
        roughness: 0.54,
        metalness: 0.03,
      }),
    );
    label.position.y = -0.21;
    group.add(label);
    const lidMaterial = new THREE.MeshStandardMaterial({
      color: "#1a1d19",
      roughness: 0.4,
      metalness: 0.22,
    });
    const lid = new THREE.Mesh(
      new THREE.CylinderGeometry(1.047, 1.047, 0.36, 80),
      lidMaterial,
    );
    lid.position.y = 1.3;
    group.add(lid);
    const ridgeGeometry = new THREE.BoxGeometry(0.026, 0.25, 0.032);
    for (let i = 0; i < 96; i++) {
      const a = (i / 96) * Math.PI * 2;
      const ridge = new THREE.Mesh(ridgeGeometry, lidMaterial);
      ridge.position.set(Math.sin(a) * 1.047, 1.3, Math.cos(a) * 1.047);
      ridge.rotation.y = a;
      group.add(ridge);
    }
    const top = new THREE.Mesh(
      new THREE.CylinderGeometry(1.012, 1.047, 0.08, 80),
      lidMaterial,
    );
    top.position.y = 1.51;
    group.add(top);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x323d22, 1.8));
    const key = new THREE.DirectionalLight(0xffffff, 3.5);
    key.position.set(-3, 5, 4);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xe4efdd, 2);
    fill.position.set(4, 2, 2);
    scene.add(fill);
    const rim = new THREE.DirectionalLight(0xc8ff86, 3);
    rim.position.set(2, 3, -3);
    scene.add(rim);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true,
      dirty = true,
      idleFrames = 0;
    const render = () => {
      if (!visible || document.hidden) return;
      const changed = controls.update();
      if (dirty || changed || idleFrames < 3) {
        renderer.render(scene, camera);
        dirty = false;
        idleFrames++;
      }
    };
    const invalidate = () => {
      dirty = true;
      idleFrames = 0;
    };
    controls.addEventListener("change", invalidate);
    controls.enableDamping = !reduced.matches;
    const resize = new ResizeObserver(() => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      invalidate();
    });
    resize.observe(element);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      invalidate();
    });
    observer.observe(element);
    const visibility = () => {
      invalidate();
    };
    document.addEventListener("visibilitychange", visibility);
    const zoom = (factor) => {
      camera.position
        .sub(controls.target)
        .multiplyScalar(factor)
        .clampLength(5.4, 11)
        .add(controls.target);
      invalidate();
    };
    actions.current = {
      zoom,
      reset: () => {
        camera.position.set(0, 0.7, 8.7);
        controls.target.set(0, 0, 0);
        group.rotation.set(0.07, Math.PI, -0.14);
        controls.update();
        invalidate();
      },
      rotate: (amount) => {
        group.rotation.y += amount;
        invalidate();
      },
    };
    const contextLost = (event) => {
      event.preventDefault();
      renderer.setAnimationLoop(null);
      setStatus("fallback");
    };
    renderer.domElement.addEventListener("webglcontextlost", contextLost);
    document.fonts.ready.then(() => {
      if (disposed) return;
      const updated = createLabel();
      label.material.map.dispose();
      label.material.map = updated;
      label.material.needsUpdate = true;
      invalidate();
      setStatus("ready");
    });
    renderer.setAnimationLoop(render);
    return () => {
      disposed = true;
      renderer.setAnimationLoop(null);
      resize.disconnect();
      observer.disconnect();
      document.removeEventListener("visibilitychange", visibility);
      controls.dispose();
      const geometries = new Set(),
        materials = new Set();
      scene.traverse((o) => {
        if (o.geometry) geometries.add(o.geometry);
        if (o.material) materials.add(o.material);
      });
      geometries.forEach((g) => g.dispose());
      materials.forEach((m) => {
        m.map?.dispose();
        m.dispose();
      });
      renderer.dispose();
      renderer.domElement.remove();
      actions.current = {};
    };
  }, []);
  return (
    <div className="product-experience">
      <div className="stage-word" aria-hidden="true">
        CREATINA
      </div>
      <div className="stage-halo" />
      <span className="stage-spec">
        MONOHIDRATADA <span>/ 300 G</span>
      </span>
      <div
        ref={host}
        className={`product-canvas ${status === "fallback" ? "is-hidden" : ""}`}
        role="group"
        tabIndex={0}
        aria-label="Visualização 3D do produto. Use setas para girar, mais e menos para zoom, zero para restaurar."
        onKeyDown={(e) => {
          if (["ArrowLeft", "ArrowRight", "+", "-", "0"].includes(e.key)) {
            e.preventDefault();
            if (e.key.startsWith("Arrow"))
              actions.current.rotate?.(e.key === "ArrowLeft" ? -0.2 : 0.2);
            else if (e.key === "0") actions.current.reset?.();
            else actions.current.zoom?.(e.key === "+" ? 0.9 : 1.1);
          }
        }}
      />
      {status !== "ready" && (
        <div className="product-fallback">
          <img
            src="/images/creatina.png"
            alt="Creatina Monohidratada 300 g PowerSupps"
          />
          <span>
            {status === "loading"
              ? "Preparando experiência 3D…"
              : "Visualização estática do produto"}
          </span>
        </div>
      )}
      <span className="stage-caption">
        <span className="live-dot" />{" "}
        {status === "ready"
          ? "EXPERIÊNCIA 3D EM TEMPO REAL"
          : "CREATINA POWERSUPPS"}
      </span>
      <div className="scene-toolbar">
        <span>
          <Move size={14} /> Arraste para explorar
        </span>
        <div>
          <button
            aria-label="Diminuir zoom"
            onClick={() => actions.current.zoom?.(1.12)}
          >
            <Minus size={16} />
          </button>
          <button
            aria-label="Aumentar zoom"
            onClick={() => actions.current.zoom?.(0.89)}
          >
            <Plus size={16} />
          </button>
          <button
            aria-label="Restaurar posição do produto"
            onClick={() => actions.current.reset?.()}
          >
            <RotateCcw size={15} />
          </button>
        </div>
      </div>
      <div className="concept-note">
        <Maximize2 size={11} /> Embalagem conceitual. Consulte o rótulo
        original.
      </div>
    </div>
  );
}
