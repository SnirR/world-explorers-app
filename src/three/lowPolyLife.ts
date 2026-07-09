// Low-poly marine-creature builders — every animal is assembled from a few
// primitives with flat shading. No model files, fully procedural.

import * as THREE from "three";
import type { MarineCreature } from "../data/marineLife";

function mat(color: string, opts?: { emissive?: string; opacity?: number; metalness?: number }) {
  return new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.75,
    metalness: opts?.metalness ?? 0,
    emissive: opts?.emissive ? new THREE.Color(opts.emissive) : undefined,
    emissiveIntensity: opts?.emissive ? 0.9 : 0,
    transparent: opts?.opacity !== undefined,
    opacity: opts?.opacity ?? 1,
  });
}

function ellipsoid(rx: number, ry: number, rz: number, m: THREE.Material, detail = 12): THREE.Mesh {
  const mesh = new THREE.Mesh(new THREE.SphereGeometry(1, detail, detail), m);
  mesh.scale.set(rx, ry, rz);
  return mesh;
}

function eye(x: number, y: number, z: number, r = 0.09): THREE.Group {
  const g = new THREE.Group();
  const white = new THREE.Mesh(new THREE.SphereGeometry(r, 8, 8), mat("#ffffff"));
  const pupil = new THREE.Mesh(new THREE.SphereGeometry(r * 0.5, 8, 8), mat("#0f172a"));
  pupil.position.z = r * 0.6;
  white.add(pupil);
  white.position.set(x, y, z);
  g.add(white);
  return g;
}

function tailFin(color: string, size = 0.5, vertical = true): THREE.Mesh {
  const fin = new THREE.Mesh(new THREE.ConeGeometry(size, size * 1.3, 4), mat(color));
  fin.rotation.z = Math.PI / 2;
  if (!vertical) fin.rotation.x = Math.PI / 2;
  fin.scale.z = vertical ? 0.25 : 1;
  fin.scale.y = vertical ? 1 : 0.25;
  return fin;
}

// Each builder returns a group facing +x (swim direction).
type Builder = (c: MarineCreature) => THREE.Group;

const builders: Record<string, Builder> = {
  fish(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(0.75, 0.42, 0.3, mat(c.color)));
    const tail = tailFin(c.accentColor, 0.4);
    tail.position.x = -0.85;
    g.add(tail);
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.42, 4), mat(c.accentColor));
    dorsal.position.set(0, 0.5, 0);
    g.add(dorsal);
    g.add(eye(0.5, 0.12, 0.24), eye(0.5, 0.12, -0.24));
    return g;
  },

  shark(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(1.25, 0.42, 0.36, mat(c.color)));
    const belly = ellipsoid(1.0, 0.3, 0.3, mat(c.accentColor));
    belly.position.y = -0.12;
    g.add(belly);
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.62, 4), mat(c.color));
    dorsal.position.set(0.05, 0.6, 0);
    g.add(dorsal);
    const tail = new THREE.Mesh(new THREE.ConeGeometry(0.45, 0.7, 4), mat(c.color));
    tail.rotation.z = Math.PI / 2;
    tail.scale.z = 0.25;
    tail.position.set(-1.35, 0.1, 0);
    g.add(tail);
    for (const s of [1, -1]) {
      const fin = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.5, 4), mat(c.color));
      fin.rotation.x = (s * Math.PI) / 2.4;
      fin.position.set(0.25, -0.2, s * 0.34);
      g.add(fin);
    }
    g.add(eye(0.85, 0.1, 0.26), eye(0.85, 0.1, -0.26));
    return g;
  },

  whale(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(1.7, 0.62, 0.58, mat(c.color)));
    const belly = ellipsoid(1.45, 0.45, 0.5, mat(c.accentColor));
    belly.position.y = -0.22;
    g.add(belly);
    // horizontal fluke
    const tail = tailFin(c.color, 0.55, false);
    tail.position.set(-1.85, 0.1, 0);
    g.add(tail);
    for (const s of [1, -1]) {
      const flipper = ellipsoid(0.42, 0.09, 0.2, mat(c.color));
      flipper.position.set(0.35, -0.3, s * 0.6);
      flipper.rotation.x = s * 0.4;
      g.add(flipper);
    }
    g.add(eye(1.15, 0.05, 0.45, 0.08), eye(1.15, 0.05, -0.45, 0.08));
    return g;
  },

  dolphin(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(1.15, 0.4, 0.34, mat(c.color)));
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.5, 8), mat(c.color));
    snout.rotation.z = -Math.PI / 2;
    snout.position.set(1.25, -0.05, 0);
    g.add(snout);
    const dorsal = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.42, 4), mat(c.color));
    dorsal.position.set(-0.1, 0.5, 0);
    dorsal.rotation.z = 0.35;
    g.add(dorsal);
    const tail = tailFin(c.color, 0.42, false);
    tail.position.set(-1.3, 0.05, 0);
    g.add(tail);
    const belly = ellipsoid(0.95, 0.28, 0.28, mat(c.accentColor));
    belly.position.y = -0.14;
    g.add(belly);
    g.add(eye(0.8, 0.12, 0.26), eye(0.8, 0.12, -0.26));
    return g;
  },

  narwhal(c) {
    const g = builders.whale(c);
    const tusk = new THREE.Mesh(new THREE.ConeGeometry(0.07, 1.5, 6), mat("#f5f0e6"));
    tusk.rotation.z = -Math.PI / 2;
    tusk.position.set(2.3, 0.1, 0);
    g.add(tusk);
    return g;
  },

  turtle(c) {
    const g = new THREE.Group();
    const shell = ellipsoid(0.85, 0.4, 0.72, mat(c.color, { metalness: 0.1 }));
    g.add(shell);
    const shellTop = ellipsoid(0.62, 0.3, 0.52, mat(c.accentColor));
    shellTop.position.y = 0.18;
    g.add(shellTop);
    const head = ellipsoid(0.28, 0.22, 0.22, mat("#8a9a5b"));
    head.position.set(0.95, 0.05, 0);
    g.add(head);
    g.add(eye(1.12, 0.14, 0.12, 0.06), eye(1.12, 0.14, -0.12, 0.06));
    for (const [x, z] of [[0.5, 0.7], [0.5, -0.7], [-0.5, 0.7], [-0.5, -0.7]]) {
      const flipper = ellipsoid(0.4, 0.07, 0.18, mat("#8a9a5b"));
      flipper.position.set(x, -0.12, z);
      flipper.rotation.y = x > 0 ? -0.5 * Math.sign(z) : 0.5 * Math.sign(z);
      g.add(flipper);
    }
    return g;
  },

  jellyfish(c) {
    const g = new THREE.Group();
    const bell = new THREE.Mesh(
      new THREE.SphereGeometry(0.7, 14, 10, 0, Math.PI * 2, 0, Math.PI / 2),
      mat(c.color, { opacity: 0.68, emissive: c.glows ? c.color : undefined })
    );
    bell.name = "bell";
    g.add(bell);
    for (let i = 0; i < 7; i++) {
      const a = (i / 7) * Math.PI * 2;
      const t = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.015, 1.1, 5), mat(c.accentColor, { opacity: 0.65 }));
      t.position.set(Math.cos(a) * 0.4, -0.6, Math.sin(a) * 0.4);
      t.rotation.x = Math.sin(a) * 0.18;
      t.rotation.z = Math.cos(a) * 0.18;
      g.add(t);
    }
    return g;
  },

  octopus(c) {
    const g = new THREE.Group();
    const head = ellipsoid(0.55, 0.62, 0.55, mat(c.color));
    head.position.y = 0.35;
    g.add(head);
    g.add(eye(0.32, 0.5, 0.3, 0.1), eye(0.32, 0.5, -0.3, 0.1));
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.03, 0.95, 5), mat(c.accentColor));
      arm.position.set(Math.cos(a) * 0.4, -0.32, Math.sin(a) * 0.4);
      arm.rotation.x = Math.sin(a) * 0.65;
      arm.rotation.z = -Math.cos(a) * 0.65;
      g.add(arm);
    }
    return g;
  },

  ray(c) {
    const g = new THREE.Group();
    const body = ellipsoid(0.85, 0.12, 1.05, mat(c.color));
    g.add(body);
    const tail = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.008, 1.3, 5), mat(c.accentColor));
    tail.rotation.z = Math.PI / 2;
    tail.position.set(-1.35, 0, 0);
    g.add(tail);
    g.add(eye(0.55, 0.12, 0.2, 0.06), eye(0.55, 0.12, -0.2, 0.06));
    return g;
  },

  seahorse(c) {
    const g = new THREE.Group();
    const body = ellipsoid(0.28, 0.55, 0.22, mat(c.color));
    g.add(body);
    const head = ellipsoid(0.18, 0.2, 0.15, mat(c.color));
    head.position.set(0.12, 0.62, 0);
    g.add(head);
    const snout = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.3, 6), mat(c.accentColor));
    snout.rotation.z = Math.PI / 2.4;
    snout.position.set(0.36, 0.58, 0);
    g.add(snout);
    const curl = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.05, 6, 10, Math.PI * 1.5), mat(c.accentColor));
    curl.position.set(-0.05, -0.62, 0);
    g.add(curl);
    g.add(eye(0.22, 0.68, 0.1, 0.05));
    return g;
  },

  crab(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(0.6, 0.3, 0.45, mat(c.color)));
    for (const s of [1, -1]) {
      const claw = ellipsoid(0.22, 0.16, 0.14, mat(c.accentColor));
      claw.position.set(0.55, 0.1, s * 0.5);
      g.add(claw);
      for (let i = 0; i < 3; i++) {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.02, 0.5, 5), mat(c.color));
        leg.position.set(-0.1 - i * 0.22, -0.15, s * 0.5);
        leg.rotation.x = (s * Math.PI) / 3;
        g.add(leg);
      }
    }
    g.add(eye(0.45, 0.32, 0.15, 0.07), eye(0.45, 0.32, -0.15, 0.07));
    return g;
  },

  penguin(c) {
    const g = new THREE.Group();
    const body = ellipsoid(0.55, 0.42, 0.42, mat(c.color)); // swimming horizontally
    g.add(body);
    const belly = ellipsoid(0.45, 0.32, 0.34, mat(c.accentColor));
    belly.position.y = -0.1;
    g.add(belly);
    const beak = new THREE.Mesh(new THREE.ConeGeometry(0.08, 0.25, 6), mat("#f59e0b"));
    beak.rotation.z = -Math.PI / 2;
    beak.position.set(0.68, 0.05, 0);
    g.add(beak);
    for (const s of [1, -1]) {
      const wing = ellipsoid(0.3, 0.06, 0.15, mat(c.color));
      wing.position.set(0, 0, s * 0.42);
      wing.rotation.x = s * 0.5;
      g.add(wing);
    }
    g.add(eye(0.45, 0.18, 0.18, 0.06), eye(0.45, 0.18, -0.18, 0.06));
    return g;
  },

  seal(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(1.0, 0.42, 0.42, mat(c.color)));
    const head = ellipsoid(0.3, 0.26, 0.26, mat(c.color));
    head.position.set(1.0, 0.12, 0);
    g.add(head);
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), mat("#1f2937"));
    nose.position.set(1.3, 0.1, 0);
    g.add(nose);
    const tail = tailFin(c.accentColor, 0.3, true);
    tail.position.set(-1.1, 0, 0);
    g.add(tail);
    g.add(eye(1.15, 0.24, 0.14, 0.06), eye(1.15, 0.24, -0.14, 0.06));
    return g;
  },

  bear(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(0.95, 0.55, 0.5, mat(c.color)));
    const head = ellipsoid(0.34, 0.3, 0.3, mat(c.color));
    head.position.set(1.0, 0.3, 0);
    g.add(head);
    for (const s of [1, -1]) {
      const ear = new THREE.Mesh(new THREE.SphereGeometry(0.1, 6, 6), mat(c.color));
      ear.position.set(0.92, 0.62, s * 0.18);
      g.add(ear);
      for (const x of [0.5, -0.5]) {
        const paw = ellipsoid(0.22, 0.3, 0.16, mat(c.color));
        paw.position.set(x, -0.5, s * 0.32);
        g.add(paw);
      }
    }
    const nose = new THREE.Mesh(new THREE.SphereGeometry(0.08, 6, 6), mat("#1f2937"));
    nose.position.set(1.34, 0.26, 0);
    g.add(nose);
    g.add(eye(1.22, 0.42, 0.13, 0.05), eye(1.22, 0.42, -0.13, 0.05));
    return g;
  },

  anglerfish(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(0.65, 0.5, 0.4, mat(c.color)));
    // huge open jaw
    const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.32, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2), mat(c.color));
    jaw.rotation.x = Math.PI;
    jaw.rotation.z = -0.5;
    jaw.position.set(0.45, -0.15, 0);
    g.add(jaw);
    for (let i = 0; i < 5; i++) {
      const tooth = new THREE.Mesh(new THREE.ConeGeometry(0.025, 0.12, 4), mat("#f8fafc"));
      tooth.position.set(0.5 + (i % 3) * 0.08, -0.05, -0.16 + i * 0.08);
      tooth.rotation.x = Math.PI;
      g.add(tooth);
    }
    // the glowing lure!
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.015, 0.015, 0.55, 4), mat(c.accentColor));
    rod.position.set(0.35, 0.6, 0);
    rod.rotation.z = -0.6;
    g.add(rod);
    const lure = new THREE.Mesh(
      new THREE.SphereGeometry(0.09, 8, 8),
      mat(c.accentColor, { emissive: c.accentColor })
    );
    lure.position.set(0.55, 0.82, 0);
    lure.name = "lure";
    g.add(lure);
    const light = new THREE.PointLight(new THREE.Color(c.accentColor), 3.2, 5, 2);
    light.position.copy(lure.position);
    g.add(light);
    g.add(eye(0.42, 0.2, 0.28, 0.09), eye(0.42, 0.2, -0.28, 0.09));
    const tail = tailFin(c.color, 0.32);
    tail.position.x = -0.75;
    g.add(tail);
    return g;
  },

  squid(c) {
    const g = new THREE.Group();
    const bodyCone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 1.4, 8), mat(c.color));
    bodyCone.rotation.z = Math.PI / 2; // point backward
    bodyCone.position.x = -0.5;
    g.add(bodyCone);
    const head = ellipsoid(0.32, 0.34, 0.32, mat(c.color));
    head.position.x = 0.3;
    g.add(head);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.015, 1.0, 5), mat(c.accentColor));
      arm.rotation.z = Math.PI / 2 + 0.12 * Math.cos(a);
      arm.position.set(0.95, Math.sin(a) * 0.16, Math.cos(a) * 0.16);
      g.add(arm);
    }
    g.add(eye(0.42, 0.16, 0.3, 0.12), eye(0.42, 0.16, -0.3, 0.12));
    return g;
  },

  starfish(c) {
    const g = new THREE.Group();
    const core = ellipsoid(0.22, 0.1, 0.22, mat(c.color));
    g.add(core);
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const arm = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.55, 4), mat(c.color));
      arm.rotation.z = Math.PI / 2;
      arm.rotation.y = -a;
      arm.position.set(Math.cos(a) * 0.35, 0, Math.sin(a) * 0.35);
      arm.scale.y = 0.35;
      g.add(arm);
    }
    return g;
  },

  pufferfish(c) {
    const g = new THREE.Group();
    g.add(ellipsoid(0.55, 0.55, 0.55, mat(c.color)));
    for (let i = 0; i < 14; i++) {
      const u = Math.acos(2 * ((i + 0.5) / 14) - 1);
      const v = Math.PI * (1 + Math.sqrt(5)) * i;
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.22, 4), mat(c.accentColor));
      const dir = new THREE.Vector3(Math.sin(u) * Math.cos(v), Math.cos(u), Math.sin(u) * Math.sin(v));
      spike.position.copy(dir.clone().multiplyScalar(0.58));
      spike.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);
      g.add(spike);
    }
    const tail = tailFin(c.accentColor, 0.28);
    tail.position.x = -0.7;
    g.add(tail);
    g.add(eye(0.4, 0.18, 0.3), eye(0.4, 0.18, -0.3));
    return g;
  },
};

/** Build a creature mesh group; every child gets userData.creatureId for picking. */
export function buildCreature(c: MarineCreature): THREE.Group {
  const builder = builders[c.style] ?? builders.fish;
  const g = builder(c);
  g.scale.multiplyScalar(c.size);
  g.traverse((obj) => {
    obj.userData.creatureId = c.id;
  });
  return g;
}
