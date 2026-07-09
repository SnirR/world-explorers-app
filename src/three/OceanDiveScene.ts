// Underwater dive engine: one ocean × one depth zone. Fog, god rays,
// drifting particles, rising bubbles, a themed floor, and low-poly creatures
// swimming on looping paths — every one tappable.

import * as THREE from "three";
import type { OceanSpec, OceanZoneId } from "../data/oceans";
import { creaturesFor, type MarineCreature } from "../data/marineLife";
import { buildCreature } from "./lowPolyLife";
import { makeTextSprite, mulberry32 } from "./proceduralTextures";

export interface OceanPick {
  id: string;
  screenX: number;
  screenY: number;
}

export interface OceanDiveOptions {
  ocean: OceanSpec;
  zone: OceanZoneId;
  discovered: Set<string>;
  reducedMotion: boolean;
  onPick: (pick: OceanPick | null) => void;
}

interface Swimmer {
  spec: MarineCreature;
  group: THREE.Group;
  label: THREE.Sprite;
  mystery: THREE.Sprite;
  center: THREE.Vector3;
  radius: number;
  angSpeed: number;   // signed
  angle: number;
  bobAmp: number;
  bobFreq: number;
  bobPhase: number;
  floorDweller: boolean;
}

const CAM_MIN = 7;
const CAM_MAX = 22;

export class OceanDiveScene {
  private container: HTMLElement;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private raycaster = new THREE.Raycaster();

  private swimmers: Swimmer[] = [];
  private rays: THREE.Mesh[] = [];
  private particles: THREE.Points | null = null;
  private bubbles: THREE.Mesh[] = [];

  private onPick: (pick: OceanPick | null) => void;
  private reducedMotion: boolean;
  private discovered: Set<string>;

  private camYaw = 0;
  private camPitch = -0.05;
  private camDist = 13;

  private pointers = new Map<number, { x: number; y: number }>();
  private pinchStartDist = 0;
  private pinchStartCamDist = 0;
  private moved = 0;
  private downTime = 0;

  private disposed = false;
  private animHandle = 0;
  private clock = new THREE.Clock();
  private resizeObserver: ResizeObserver;

  constructor(container: HTMLElement, opts: OceanDiveOptions) {
    this.container = container;
    this.onPick = opts.onPick;
    this.reducedMotion = opts.reducedMotion;
    this.discovered = new Set(opts.discovered);

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    container.appendChild(this.renderer.domElement);
    this.renderer.domElement.style.touchAction = "none";
    this.renderer.domElement.style.display = "block";

    const water = new THREE.Color(opts.ocean.waterColors[opts.zone]);
    this.scene = new THREE.Scene();
    this.scene.background = water;
    const fogDensity = opts.zone === "reef" ? 0.024 : opts.zone === "open" ? 0.03 : 0.052;
    this.scene.fog = new THREE.FogExp2(water, fogDensity);

    this.camera = new THREE.PerspectiveCamera(
      52,
      container.clientWidth / Math.max(1, container.clientHeight),
      0.1,
      600
    );

    // ── Lights per zone ──
    if (opts.zone === "reef") {
      this.scene.add(new THREE.AmbientLight(0xffffff, 1.05));
      const sun = new THREE.DirectionalLight(0xfff8e0, 1.5);
      sun.position.set(4, 20, 6);
      this.scene.add(sun);
    } else if (opts.zone === "open") {
      this.scene.add(new THREE.AmbientLight(0xbcd8ff, 0.75));
      const sun = new THREE.DirectionalLight(0xcfe6ff, 0.8);
      sun.position.set(2, 18, 4);
      this.scene.add(sun);
    } else {
      this.scene.add(new THREE.AmbientLight(0x5b7db8, 0.28));
      const dim = new THREE.DirectionalLight(0x33507a, 0.18);
      dim.position.set(0, 10, 4);
      this.scene.add(dim);
    }

    this.buildEnvironment(opts);
    this.buildCreatures(opts);

    const el = this.renderer.domElement;
    el.addEventListener("pointerdown", this.onPointerDown);
    el.addEventListener("pointermove", this.onPointerMove);
    el.addEventListener("pointerup", this.onPointerUp);
    el.addEventListener("pointercancel", this.onPointerCancel);
    el.addEventListener("wheel", this.onWheel, { passive: false });

    this.resizeObserver = new ResizeObserver(() => this.resize());
    this.resizeObserver.observe(container);

    this.animate();
  }

  // ─── Environment ───────────────────────────────────────────────────────────

  private buildEnvironment(opts: OceanDiveOptions) {
    const rng = mulberry32(opts.ocean.id.length * 7 + opts.zone.length);

    // god rays (sunlit zones only)
    if (opts.zone !== "deep") {
      for (let i = 0; i < 7; i++) {
        const ray = new THREE.Mesh(
          new THREE.ConeGeometry(2.2 + rng() * 2, 26, 6, 1, true),
          new THREE.MeshBasicMaterial({
            color: 0xfffbe8,
            transparent: true,
            opacity: opts.zone === "reef" ? 0.075 : 0.045,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
          })
        );
        ray.position.set((rng() - 0.5) * 34, 12, (rng() - 0.5) * 30 - 4);
        ray.rotation.z = (rng() - 0.5) * 0.16;
        this.scene.add(ray);
        this.rays.push(ray);
      }
    }

    // drifting particles (plankton / marine snow)
    const COUNT = 300;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      positions[i * 3] = (rng() - 0.5) * 44;
      positions[i * 3 + 1] = (rng() - 0.5) * 26;
      positions[i * 3 + 2] = (rng() - 0.5) * 44;
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    this.particles = new THREE.Points(
      pGeo,
      new THREE.PointsMaterial({
        color: opts.zone === "deep" ? 0x9fd8ff : 0xffffff,
        size: opts.zone === "deep" ? 2.4 : 1.7,
        sizeAttenuation: false,
        transparent: true,
        opacity: opts.zone === "deep" ? 0.65 : 0.45,
        depthWrite: false,
      })
    );
    this.scene.add(this.particles);

    // rising bubbles
    const bubbleMat = new THREE.MeshStandardMaterial({
      color: 0xdff3ff,
      transparent: true,
      opacity: 0.35,
      roughness: 0.1,
      metalness: 0.2,
    });
    for (let i = 0; i < 16; i++) {
      const b = new THREE.Mesh(new THREE.SphereGeometry(0.06 + rng() * 0.1, 8, 8), bubbleMat);
      b.position.set((rng() - 0.5) * 26, -8 + rng() * 16, (rng() - 0.5) * 26);
      b.userData.speed = 0.8 + rng() * 1.4;
      this.scene.add(b);
      this.bubbles.push(b);
    }

    // floor
    if (opts.zone !== "open") {
      const floorColor = opts.zone === "reef" ? 0xd9c58f : 0x14202e;
      const floor = new THREE.Mesh(
        new THREE.CircleGeometry(45, 36),
        new THREE.MeshStandardMaterial({ color: floorColor, roughness: 1 })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.position.y = -7;
      this.scene.add(floor);

      if (opts.zone === "reef") {
        // coral garden
        const corals = ["#ff6f61", "#f59e0b", "#e879f9", "#34d399", "#f43f5e", "#38bdf8"];
        for (let i = 0; i < 22; i++) {
          const cluster = new THREE.Group();
          const cx = (rng() - 0.5) * 34;
          const cz = (rng() - 0.5) * 34;
          const n = 2 + Math.floor(rng() * 4);
          for (let j = 0; j < n; j++) {
            const color = corals[Math.floor(rng() * corals.length)];
            const kind = rng();
            let m: THREE.Mesh;
            if (kind < 0.4) {
              m = new THREE.Mesh(
                new THREE.ConeGeometry(0.25 + rng() * 0.3, 0.9 + rng() * 1.3, 5),
                new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9 })
              );
              m.position.y = 0.5;
            } else if (kind < 0.7) {
              m = new THREE.Mesh(
                new THREE.SphereGeometry(0.35 + rng() * 0.35, 7, 6),
                new THREE.MeshStandardMaterial({ color, flatShading: true, roughness: 0.9 })
              );
              m.position.y = 0.3;
            } else {
              m = new THREE.Mesh(
                new THREE.CylinderGeometry(0.06, 0.09, 1.2 + rng() * 1.2, 5),
                new THREE.MeshStandardMaterial({ color: "#2f9e44", flatShading: true, roughness: 1 })
              );
              m.position.y = 0.7;
              m.rotation.z = (rng() - 0.5) * 0.35;
            }
            m.position.x = (rng() - 0.5) * 1.6;
            m.position.z = (rng() - 0.5) * 1.6;
            cluster.add(m);
          }
          cluster.position.set(cx, -7, cz);
          this.scene.add(cluster);
        }
      } else {
        // deep: hydrothermal vents ("black smokers") with a warm glow
        for (let i = 0; i < 5; i++) {
          const vent = new THREE.Mesh(
            new THREE.ConeGeometry(0.7 + rng() * 0.5, 2.4 + rng() * 1.6, 6),
            new THREE.MeshStandardMaterial({ color: 0x1f1a17, flatShading: true, roughness: 1 })
          );
          const vx = (rng() - 0.5) * 26;
          const vz = (rng() - 0.5) * 26;
          vent.position.set(vx, -6, vz);
          this.scene.add(vent);
          const glow = new THREE.PointLight(0xff5a2a, 5, 7, 2);
          glow.position.set(vx, -4.6, vz);
          this.scene.add(glow);
        }
      }
    }
  }

  // ─── Creatures ─────────────────────────────────────────────────────────────

  private buildCreatures(opts: OceanDiveOptions) {
    const list = creaturesFor(opts.ocean.id, opts.zone);
    const rng = mulberry32(opts.ocean.id.charCodeAt(0) * 13 + opts.zone.charCodeAt(0));

    list.forEach((spec, i) => {
      const group = buildCreature(spec);
      const floorDweller = spec.speed === 0 || spec.style === "crab" || spec.style === "starfish";

      const a = (i / list.length) * Math.PI * 2 + rng() * 0.5;
      const dist = 5 + rng() * 7;
      const center = new THREE.Vector3(
        Math.cos(a) * dist,
        floorDweller ? -6.6 : -3 + rng() * 7,
        Math.sin(a) * dist
      );

      const label = makeTextSprite(spec.nameHebrew, { fontSize: 56 });
      label.scale.multiplyScalar(1.6 + spec.size * 0.55);
      label.visible = this.discovered.has(spec.id);
      const mystery = makeTextSprite("❓", { fontSize: 56 });
      mystery.scale.multiplyScalar(1.0);
      mystery.visible = !this.discovered.has(spec.id);
      this.scene.add(label, mystery);

      this.scene.add(group);
      this.swimmers.push({
        spec,
        group,
        label,
        mystery,
        center,
        radius: floorDweller ? 0.6 + rng() * 0.8 : 2 + rng() * 4,
        angSpeed: (0.1 + rng() * 0.14) * spec.speed * (rng() > 0.5 ? 1 : -1),
        angle: rng() * Math.PI * 2,
        bobAmp: floorDweller ? 0 : 0.3 + rng() * 0.5,
        bobFreq: 0.5 + rng(),
        bobPhase: rng() * Math.PI * 2,
        floorDweller,
      });
    });
  }

  // ─── Public API ────────────────────────────────────────────────────────────

  setDiscovered(discovered: Set<string>) {
    this.discovered = new Set(discovered);
    for (const s of this.swimmers) {
      const on = this.discovered.has(s.spec.id);
      s.label.visible = on;
      s.mystery.visible = !on;
    }
  }

  resize() {
    const w = this.container.clientWidth;
    const h = Math.max(1, this.container.clientHeight);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.animHandle);
    this.resizeObserver.disconnect();
    const el = this.renderer.domElement;
    el.removeEventListener("pointerdown", this.onPointerDown);
    el.removeEventListener("pointermove", this.onPointerMove);
    el.removeEventListener("pointerup", this.onPointerUp);
    el.removeEventListener("pointercancel", this.onPointerCancel);
    el.removeEventListener("wheel", this.onWheel);
    this.scene.traverse((obj) => {
      const mesh = obj as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const m = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(m)) m.forEach((mm) => mm.dispose());
      else if (m) m.dispose();
    });
    this.renderer.dispose();
    el.remove();
  }

  // ─── Picking & interaction ─────────────────────────────────────────────────

  private pickAt(clientX: number, clientY: number): OceanPick | null {
    const rect = this.renderer.domElement.getBoundingClientRect();
    const ndc = new THREE.Vector2(
      ((clientX - rect.left) / rect.width) * 2 - 1,
      -((clientY - rect.top) / rect.height) * 2 + 1
    );
    this.raycaster.setFromCamera(ndc, this.camera);
    const hits = this.raycaster.intersectObjects(
      this.swimmers.map((s) => s.group),
      true
    );
    for (const hit of hits) {
      const id = hit.object.userData.creatureId as string | undefined;
      if (id) return { id, screenX: clientX, screenY: clientY };
    }
    // nearest creature center within 48px
    let best: string | null = null;
    let bestPx = 48;
    const v = new THREE.Vector3();
    for (const s of this.swimmers) {
      s.group.getWorldPosition(v);
      v.project(this.camera);
      if (v.z > 1) continue;
      const sx = ((v.x + 1) / 2) * rect.width + rect.left;
      const sy = ((1 - v.y) / 2) * rect.height + rect.top;
      const d = Math.hypot(sx - clientX, sy - clientY);
      if (d < bestPx) {
        bestPx = d;
        best = s.spec.id;
      }
    }
    return best ? { id: best, screenX: clientX, screenY: clientY } : null;
  }

  private onPointerDown = (e: PointerEvent) => {
    this.renderer.domElement.setPointerCapture(e.pointerId);
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) {
      this.moved = 0;
      this.downTime = performance.now();
    } else if (this.pointers.size === 2) {
      const pts = [...this.pointers.values()];
      this.pinchStartDist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      this.pinchStartCamDist = this.camDist;
    }
  };

  private onPointerMove = (e: PointerEvent) => {
    if (!this.pointers.has(e.pointerId)) return;
    const prev = this.pointers.get(e.pointerId)!;
    this.pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (this.pointers.size === 1) {
      const dx = e.clientX - prev.x;
      const dy = e.clientY - prev.y;
      this.moved += Math.abs(dx) + Math.abs(dy);
      this.camYaw -= dx * 0.0042;
      this.camPitch = Math.min(0.55, Math.max(-0.6, this.camPitch - dy * 0.0035));
    } else if (this.pointers.size === 2 && this.pinchStartDist > 0) {
      const pts = [...this.pointers.values()];
      const dist = Math.hypot(pts[1].x - pts[0].x, pts[1].y - pts[0].y);
      this.camDist = Math.min(
        CAM_MAX,
        Math.max(CAM_MIN, this.pinchStartCamDist * (this.pinchStartDist / Math.max(1, dist)))
      );
    }
  };

  private onPointerUp = (e: PointerEvent) => {
    const wasSingle = this.pointers.size === 1;
    this.pointers.delete(e.pointerId);
    if (wasSingle && this.moved < 9 && performance.now() - this.downTime < 600) {
      this.onPick(this.pickAt(e.clientX, e.clientY));
    }
    if (this.pointers.size < 2) this.pinchStartDist = 0;
  };

  private onPointerCancel = (e: PointerEvent) => {
    this.pointers.delete(e.pointerId);
    if (this.pointers.size < 2) this.pinchStartDist = 0;
  };

  private onWheel = (e: WheelEvent) => {
    e.preventDefault();
    this.camDist = Math.min(CAM_MAX, Math.max(CAM_MIN, this.camDist * (e.deltaY > 0 ? 1.08 : 0.92)));
  };

  zoomIn() { this.camDist = Math.max(CAM_MIN, this.camDist / 1.25); }
  zoomOut() { this.camDist = Math.min(CAM_MAX, this.camDist * 1.25); }

  // ─── Animation ─────────────────────────────────────────────────────────────

  private animate = () => {
    if (this.disposed) return;
    this.animHandle = requestAnimationFrame(this.animate);
    const dt = Math.min(0.05, this.clock.getDelta());
    const t = performance.now() / 1000;
    const speedScale = this.reducedMotion ? 0.15 : 1;

    // creatures swim their loops
    for (const s of this.swimmers) {
      s.angle += s.angSpeed * dt * speedScale;
      const bob = s.bobAmp * Math.sin(t * s.bobFreq + s.bobPhase);
      const x = s.center.x + Math.cos(s.angle) * s.radius;
      const z = s.center.z + Math.sin(s.angle) * s.radius;
      s.group.position.set(x, s.center.y + bob, z);
      if (!s.floorDweller || s.spec.style === "crab") {
        // face the swim direction (tangent of the circle)
        s.group.rotation.y = -s.angle + (s.angSpeed > 0 ? Math.PI : 0);
      }
      // jellyfish bell pulse
      if (s.spec.style === "jellyfish") {
        const bell = s.group.getObjectByName("bell");
        if (bell) {
          const p = 1 + 0.14 * Math.sin(t * 2.2 + s.bobPhase);
          bell.scale.set(1 / Math.sqrt(p), p, 1 / Math.sqrt(p));
        }
        s.group.position.y += Math.sin(t * 2.2 + s.bobPhase) * 0.15;
      }
      // labels float above
      const labelY = s.group.position.y + 1.1 * s.spec.size + 0.7;
      s.label.position.set(x, labelY, z);
      s.mystery.position.set(x, labelY, z);
    }

    // god rays sway gently
    this.rays.forEach((r, i) => {
      r.rotation.z = Math.sin(t * 0.22 + i * 1.7) * 0.14;
    });

    // marine snow drifts down
    if (this.particles) {
      const pos = this.particles.geometry.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < pos.count; i++) {
        let y = pos.getY(i) - dt * 0.35 * speedScale;
        if (y < -13) y = 13;
        pos.setY(i, y);
      }
      pos.needsUpdate = true;
    }

    // bubbles rise
    for (const b of this.bubbles) {
      b.position.y += dt * (b.userData.speed as number) * speedScale;
      b.position.x += Math.sin(t * 1.4 + b.position.z) * dt * 0.25;
      if (b.position.y > 10) b.position.y = -9;
    }

    // camera: orbit around the center + a gentle current sway
    const sway = this.reducedMotion ? 0 : Math.sin(t * 0.4) * 0.02;
    const yaw = this.camYaw + sway;
    const pitch = this.camPitch;
    this.camera.position.set(
      Math.sin(yaw) * Math.cos(pitch) * this.camDist,
      Math.sin(-pitch) * this.camDist * 0.6,
      Math.cos(yaw) * Math.cos(pitch) * this.camDist
    );
    this.camera.lookAt(0, -0.5, 0);

    this.renderer.render(this.scene, this.camera);
  };
}
