/**
 * Painted entity impostors: Y-axis (cylindrical) billboards with lighting,
 * soft ground shadows, optional fake thickness, and multi-view textures.
 *
 * Prefer these over crossed planes - they read less like cardboard when orbiting.
 * Magenta-keyed PNGs under public/assets/entities/sprites.
 *
 * Multi-view naming (optional extras):
 *   animal-lion.png          → view 0 (default / front-ish)
 *   animal-lion-side.png     → view 1 (profile)
 *   animal-lion-back.png     → view 2
 *   animal-lion-q.png        → view 3 (¾ reverse)
 * Missing angles fall back to the default sprite.
 */
import * as THREE from "three";

export type AnimalSpriteId =
  | "camel"
  | "kangaroo"
  | "panda"
  | "lion"
  | "elephant"
  | "bear"
  | "llama"
  | "toucan"
  | "eagle"
  | "rooster"
  | "ibex"
  | "wolf"
  | "sheep"
  | "cow"
  | "crane"
  | "giraffe"
  | "deer"
  | "penguin";

export type LandmarkSpriteId =
  | "liberty"
  | "christRedeemer"
  | "moai"
  | "kotel"
  | "eiffel"
  | "pyramid"
  | "colosseum"
  | "bigben"
  | "tajMahal"
  | "operaHouse"
  | "greatWall"
  | "windmill"
  | "torii"
  | "pisa"
  | "kremlin"
  | "machuPicchu"
  | "azrieli"
  | "burj"
  | "petra"
  | "neuschwanstein"
  | "niagara"
  | "fuji"
  | "redeemer";

export type SightSpriteId =
  | "deer"
  | "castle"
  | "windmill"
  | "waterfall"
  | "volcano"
  | "balloons"
  | "sheep"
  | "snowman"
  | "farm"
  | "ruins"
  | "tunnel"
  | "trainStation"
  | "city"
  | "island"
  | "cloudCastle";

export type EntitySpriteId = AnimalSpriteId | LandmarkSpriteId | SightSpriteId;

const ANIMAL_SPRITES: Record<AnimalSpriteId, string> = {
  camel: "entities/sprites/animal-camel.png",
  kangaroo: "entities/sprites/animal-kangaroo.png",
  panda: "entities/sprites/animal-panda.png",
  lion: "entities/sprites/animal-lion.png",
  elephant: "entities/sprites/animal-elephant.png",
  bear: "entities/sprites/animal-bear.png",
  llama: "entities/sprites/animal-llama.png",
  toucan: "entities/sprites/animal-toucan.png",
  eagle: "entities/sprites/animal-eagle.png",
  rooster: "entities/sprites/animal-rooster.png",
  ibex: "entities/sprites/animal-ibex.png",
  wolf: "entities/sprites/animal-wolf.png",
  sheep: "entities/sprites/animal-sheep.png",
  cow: "entities/sprites/animal-cow.png",
  crane: "entities/sprites/animal-crane.png",
  giraffe: "entities/sprites/animal-giraffe.png",
  deer: "entities/sprites/animal-deer.png",
  penguin: "entities/sprites/animal-penguin.png",
};

const LANDMARK_SPRITES: Record<LandmarkSpriteId, string> = {
  liberty: "entities/sprites/landmark-liberty.png",
  christRedeemer: "entities/sprites/landmark-christ-redeemer.png",
  moai: "entities/sprites/landmark-moai.png",
  kotel: "entities/sprites/landmark-kotel.png",
  eiffel: "entities/sprites/landmark-eiffel.png",
  pyramid: "entities/sprites/landmark-pyramid.png",
  colosseum: "entities/sprites/landmark-colosseum.png",
  bigben: "entities/sprites/landmark-bigben.png",
  tajMahal: "entities/sprites/landmark-tajmahal.png",
  operaHouse: "entities/sprites/landmark-opera.png",
  greatWall: "entities/sprites/landmark-greatwall.png",
  windmill: "entities/sprites/landmark-windmill.png",
  torii: "entities/sprites/landmark-torii.png",
  pisa: "entities/sprites/landmark-pisa.png",
  kremlin: "entities/sprites/landmark-kremlin.png",
  machuPicchu: "entities/sprites/landmark-machu.png",
  azrieli: "entities/sprites/landmark-azrieli.png",
  burj: "entities/sprites/landmark-burj.png",
  petra: "entities/sprites/landmark-petra.png",
  neuschwanstein: "entities/sprites/landmark-neuschwanstein.png",
  niagara: "entities/sprites/landmark-niagara.png",
  fuji: "entities/sprites/landmark-fuji.png",
  redeemer: "entities/sprites/landmark-christ-redeemer.png",
};

const SIGHT_SPRITES: Record<SightSpriteId, string> = {
  deer: "entities/sprites/sight-deer.png",
  castle: "entities/sprites/sight-castle.png",
  windmill: "entities/sprites/sight-windmill.png",
  waterfall: "entities/sprites/sight-waterfall.png",
  volcano: "entities/sprites/sight-volcano.png",
  balloons: "entities/sprites/sight-balloons.png",
  sheep: "entities/sprites/sight-sheep.png",
  snowman: "entities/sprites/sight-snowman.png",
  farm: "entities/sprites/sight-farm.png",
  ruins: "entities/sprites/sight-ruins.png",
  tunnel: "entities/sprites/sight-tunnel.png",
  trainStation: "entities/sprites/sight-train-station.png",
  city: "entities/sprites/sight-city.png",
  island: "entities/sprites/sight-island.png",
  cloudCastle: "entities/sprites/sight-cloud-castle.png",
};

const ALL_SPRITES: Record<string, string> = {
  ...ANIMAL_SPRITES,
  ...LANDMARK_SPRITES,
  ...SIGHT_SPRITES,
};

/** Optional multi-view suffixes actually available on disk (processed into public/). */
const MULTI_VIEWS: Record<string, readonly string[]> = {
  lion: ["", "-side", "-back"],
  elephant: ["", "-side"],
  camel: ["", "-side"],
  panda: ["", "-side"],
  kangaroo: ["", "-side"],
  bear: ["", "-side"],
  deer: ["", "-side"],
  liberty: ["", "-side", "-back"],
  redeemer: ["", "-side", "-back"],
  christRedeemer: ["", "-side", "-back"],
  moai: ["", "-side"],
  kotel: ["", "-side"],
  eiffel: ["", "-side"],
  pyramid: ["", "-side"],
};

const loader = new THREE.TextureLoader();
const texCache = new Map<string, THREE.Texture>();
const matCache = new Map<string, THREE.Material>();

/** Soft radial shadow texture (shared). */
let shadowTex: THREE.Texture | null = null;

const _wp = new THREE.Vector3();
const _wq = new THREE.Quaternion();
const _front = new THREE.Vector3();
const _toCam = new THREE.Vector3();

export interface EntityImpostorData {
  kind: string;
  face: THREE.Object3D;
  mats: THREE.MeshStandardMaterial[];
  views: THREE.Texture[];
  lastView: number;
  thickness?: THREE.Mesh[];
}

function assetUrl(rel: string): string {
  const base = import.meta.env.BASE_URL || "/";
  return `${base}assets/${rel}`.replace(/\/{2,}/g, "/").replace(":/", "://");
}

function loadSpriteTex(rel: string): THREE.Texture {
  const key = `ent:${rel}`;
  const cached = texCache.get(key);
  if (cached) return cached;
  let tex: THREE.Texture;
  if (typeof document === "undefined") {
    tex = new THREE.DataTexture(new Uint8Array([255, 255, 255, 255]), 1, 1);
    tex.needsUpdate = true;
  } else {
    tex = loader.load(assetUrl(rel));
  }
  tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.colorSpace = THREE.SRGBColorSpace;
  texCache.set(key, tex);
  return tex;
}

/** Try loading optional multi-view textures; always includes the default. */
function loadViewsForKind(
  kind: string,
  prefer?: "animal" | "landmark" | "sight"
): THREE.Texture[] {
  const base = spriteRel(kind, prefer);
  if (!base) return [];
  const suffixes = MULTI_VIEWS[kind];
  if (!suffixes || suffixes.length <= 1) {
    return [loadSpriteTex(base)];
  }
  const m = base.match(/^(.*\/)([^/]+)\.png$/);
  if (!m) return [loadSpriteTex(base)];
  const dir = m[1];
  const stem = m[2];
  return suffixes.map((suf) =>
    suf === "" ? loadSpriteTex(base) : loadSpriteTex(`${dir}${stem}${suf}.png`)
  );
}

function spriteRel(
  kind: string,
  prefer?: "animal" | "landmark" | "sight"
): string | null {
  if (prefer === "animal") return ANIMAL_SPRITES[kind as AnimalSpriteId] ?? null;
  if (prefer === "landmark") return LANDMARK_SPRITES[kind as LandmarkSpriteId] ?? null;
  if (prefer === "sight") return SIGHT_SPRITES[kind as SightSpriteId] ?? null;
  return ALL_SPRITES[kind] || null;
}

export function hasEntitySprite(kind: string): boolean {
  return Boolean(spriteRel(kind));
}

export function hasAnimalSprite(id: string): boolean {
  return id in ANIMAL_SPRITES;
}

export function hasLandmarkSprite(id: string): boolean {
  return id in LANDMARK_SPRITES;
}

export function hasSightSprite(id: string): boolean {
  return id in SIGHT_SPRITES;
}

function getShadowTexture(): THREE.Texture {
  if (shadowTex) return shadowTex;
  if (typeof document === "undefined") {
    shadowTex = new THREE.DataTexture(new Uint8Array([0, 0, 0, 80]), 1, 1);
    shadowTex.needsUpdate = true;
    return shadowTex;
  }
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const ctx = c.getContext("2d")!;
  const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 60);
  g.addColorStop(0, "rgba(0,0,0,0.45)");
  g.addColorStop(0.55, "rgba(0,0,0,0.18)");
  g.addColorStop(1, "rgba(0,0,0,0)");
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  shadowTex = new THREE.CanvasTexture(c);
  shadowTex.colorSpace = THREE.SRGBColorSpace;
  return shadowTex;
}

function makeLitMat(map: THREE.Texture): THREE.MeshStandardMaterial {
  return new THREE.MeshStandardMaterial({
    map,
    transparent: true,
    alphaTest: 0.22,
    depthWrite: true,
    side: THREE.DoubleSide,
    roughness: 0.72,
    metalness: 0.05,
    fog: true,
  });
}

function addGroundShadow(g: THREE.Group, size: number) {
  const shadow = new THREE.Mesh(
    new THREE.CircleGeometry(size * 0.38, 24),
    new THREE.MeshBasicMaterial({
      map: getShadowTexture(),
      transparent: true,
      depthWrite: false,
      opacity: 0.9,
    })
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = 0.02;
  shadow.name = "entityShadow";
  g.add(shadow);
}

/**
 * Y-axis cylindrical impostor: one (or a few stacked) lit planes that face the
 * camera horizontally each frame via updateEntityImpostors().
 */
export function entityBillboard(
  kind: string,
  size = 2,
  opts: {
    widthScale?: number;
    tint?: number;
    sway?: number;
    thickness?: boolean;
    prefer?: "animal" | "landmark" | "sight";
  } = {}
): THREE.Group | null {
  const rel = spriteRel(kind, opts.prefer);
  if (!rel) return null;

  const views = loadViewsForKind(kind, opts.prefer);
  const mat = makeLitMat(views[0]);
  if (opts.tint != null) mat.color = new THREE.Color(opts.tint);

  const h = size;
  const w = size * (opts.widthScale || 0.75);
  const geo = new THREE.PlaneGeometry(w, h);
  geo.translate(0, h / 2, 0);

  const g = new THREE.Group();
  const face = new THREE.Group();
  face.name = "entityFace";

  const main = new THREE.Mesh(geo, mat);
  main.name = "entityPlane";
  face.add(main);

  const mats = [mat];
  const thicknessMeshes: THREE.Mesh[] = [];

  // Soft fake volume: two slightly offset copies (reads less paper-thin).
  if (opts.thickness !== false) {
    const backMat = mat.clone();
    backMat.opacity = 0.92;
    backMat.transparent = true;
    mats.push(backMat);
    const back = new THREE.Mesh(geo, backMat);
    back.position.z = -size * 0.04;
    back.name = "entityThickness";
    face.add(back);
    thicknessMeshes.push(back);

    const midMat = mat.clone();
    midMat.opacity = 0.55;
    mats.push(midMat);
    const mid = new THREE.Mesh(geo, midMat);
    mid.position.z = -size * 0.02;
    mid.name = "entityThickness";
    face.add(mid);
    thicknessMeshes.push(mid);
  }

  g.add(face);
  addGroundShadow(g, size);

  const data: EntityImpostorData = {
    kind,
    face,
    mats,
    views,
    lastView: 0,
    thickness: thicknessMeshes,
  };
  g.userData.entityImpostor = data;

  if (opts.sway != null) {
    g.userData.sway = { node: g, ph: Math.random() * 10, amt: opts.sway };
  }
  return g;
}

/** @deprecated Prefer entityBillboard (Y-impostor). Kept for rare Sprite uses. */
export function entitySprite(
  kind: string,
  size = 2,
  opts: { widthScale?: number; y?: number; tint?: number } = {}
): THREE.Sprite | null {
  const rel = spriteRel(kind);
  if (!rel) return null;
  const matKey = `entSpr:${kind}`;
  let m = matCache.get(matKey) as THREE.SpriteMaterial | undefined;
  if (!m) {
    m = new THREE.SpriteMaterial({
      map: loadSpriteTex(rel),
      transparent: true,
      depthWrite: true,
      alphaTest: 0.2,
    });
    matCache.set(matKey, m);
  }
  const s = new THREE.Sprite(m);
  s.scale.set(size * (opts.widthScale || 0.85), size, 1);
  s.center.set(0.5, 0);
  s.position.y = opts.y ?? 0;
  s.name = "noshadow";
  return s;
}

export function paintedAnimal(
  id: AnimalSpriteId | string,
  size = 2.2,
  opts: { widthScale?: number } = {}
): THREE.Group | null {
  const bb = entityBillboard(id, size, {
    widthScale: opts.widthScale ?? 0.9,
    thickness: true,
    prefer: "animal",
  });
  if (!bb) return null;
  const hit = new THREE.Mesh(
    new THREE.BoxGeometry(size * 0.45, size * 0.85, size * 0.35),
    new THREE.MeshBasicMaterial({ visible: false })
  );
  hit.position.y = size * 0.42;
  hit.name = "hitproxy";
  bb.add(hit);
  return bb;
}

export function paintedLandmark(
  id: LandmarkSpriteId | string,
  size = 3.5,
  opts: { widthScale?: number } = {}
): THREE.Group | null {
  return entityBillboard(id, size, {
    widthScale: opts.widthScale ?? 0.7,
    thickness: true,
    prefer: "landmark",
  });
}

export function paintedSight(
  id: SightSpriteId | string,
  size = 3,
  opts: { widthScale?: number } = {}
): THREE.Group | null {
  return entityBillboard(id, size, {
    widthScale: opts.widthScale ?? 0.8,
    thickness: true,
    prefer: "sight",
  });
}

export function landmarkSpriteKeyForWonder(id: string): LandmarkSpriteId | null {
  const map: Record<string, LandmarkSpriteId> = {
    kotel: "kotel",
    liberty: "liberty",
    redeemer: "redeemer",
    moai: "moai",
    eiffel: "eiffel",
    pyramids: "pyramid",
    colosseum: "colosseum",
    bigben: "bigben",
    tajmahal: "tajMahal",
    opera: "operaHouse",
    greatwall: "greatWall",
    burj: "burj",
    petra: "petra",
    neuschwanstein: "neuschwanstein",
    niagara: "niagara",
    fuji: "fuji",
    machu: "machuPicchu",
  };
  return map[id] ?? null;
}

/**
 * Call once per frame from scene animate loops.
 * - Rotates each impostor face around Y to face the camera (cylindrical)
 * - Swaps multi-view texture by orbit angle when extra views exist
 */
export function updateEntityImpostors(
  root: THREE.Object3D,
  camera: THREE.Camera
): void {
  root.traverse((obj) => {
    const data = obj.userData.entityImpostor as EntityImpostorData | undefined;
    if (!data) return;

    const face = data.face;
    face.getWorldPosition(_wp);
    // Cylindrical lookAt: face camera, keep upright
    face.lookAt(camera.position.x, _wp.y, camera.position.z);

    if (data.views.length <= 1) return;

    obj.getWorldQuaternion(_wq);
    _front.set(0, 0, 1).applyQuaternion(_wq);
    _front.y = 0;
    if (_front.lengthSq() < 1e-6) _front.set(0, 0, 1);
    else _front.normalize();

    _toCam.copy(camera.position).sub(_wp);
    _toCam.y = 0;
    if (_toCam.lengthSq() < 1e-6) return;
    _toCam.normalize();

    // Signed angle from entity front to camera (XZ)
    const cross = _front.x * _toCam.z - _front.z * _toCam.x;
    const dot = _front.x * _toCam.x + _front.z * _toCam.z;
    let ang = Math.atan2(cross, dot); // -PI..PI
    if (ang < 0) ang += Math.PI * 2;

    const n = data.views.length;
    const idx = Math.round((ang / (Math.PI * 2)) * n) % n;
    if (idx === data.lastView) return;
    data.lastView = idx;
    const tex = data.views[idx];
    for (const m of data.mats) {
      m.map = tex;
      m.needsUpdate = true;
    }
  });
}
