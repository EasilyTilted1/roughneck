import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Five setting configurations
const SETTINGS = {
  forest: {
    bgColor: 0x0a1a0a,
    fogColor: 0x1a3320,
    fogNear: 8,
    fogFar: 40,
    ambientColor: 0x224422,
    ambientIntensity: 0.6,
    dirColor: 0x88ffaa,
    dirIntensity: 0.8,
    dirPosition: [5, 12, 5],
    groundColor: 0x1a3320,
    buildGeometry: buildForest,
  },
  urban: {
    bgColor: 0x080810,
    fogColor: 0x101018,
    fogNear: 10,
    fogFar: 60,
    ambientColor: 0x334466,
    ambientIntensity: 0.5,
    dirColor: 0xaabbff,
    dirIntensity: 1.0,
    dirPosition: [-5, 15, 8],
    groundColor: 0x222233,
    buildGeometry: buildUrban,
  },
  interior: {
    bgColor: 0x100c08,
    fogColor: 0x2a1e14,
    fogNear: 5,
    fogFar: 25,
    ambientColor: 0x664422,
    ambientIntensity: 0.7,
    dirColor: 0xffcc88,
    dirIntensity: 0.9,
    dirPosition: [2, 8, -2],
    groundColor: 0x3d2b1f,
    buildGeometry: buildInterior,
  },
  ocean: {
    bgColor: 0x000d1a,
    fogColor: 0x001833,
    fogNear: 8,
    fogFar: 50,
    ambientColor: 0x002244,
    ambientIntensity: 0.4,
    dirColor: 0x44aaff,
    dirIntensity: 0.7,
    dirPosition: [0, 20, -10],
    groundColor: 0x001122,
    buildGeometry: buildOcean,
  },
  void: {
    bgColor: 0x000000,
    fogColor: 0x080008,
    fogNear: 5,
    fogFar: 30,
    ambientColor: 0x220033,
    ambientIntensity: 0.3,
    dirColor: 0xcc44ff,
    dirIntensity: 0.6,
    dirPosition: [0, 10, 0],
    groundColor: 0x0a000a,
    buildGeometry: buildVoid,
  },
};

// ─── Geometry builders ───────────────────────────────────────────────────────

function buildForest(scene) {
  const objects = [];

  // Ground
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshLambertMaterial({ color: 0x1a3320 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  objects.push(ground);

  // Trees
  const treeMat = new THREE.MeshLambertMaterial({ color: 0x2d5a27 });
  const trunkMat = new THREE.MeshLambertMaterial({ color: 0x5c3d1e });

  for (let i = 0; i < 24; i++) {
    const angle = (i / 24) * Math.PI * 2 + Math.random() * 0.4;
    const r = 4 + Math.random() * 12;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const h = 2 + Math.random() * 3;

    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.18, h, 5), trunkMat);
    trunk.position.set(x, h / 2, z);
    scene.add(trunk);
    objects.push(trunk);

    const canopy = new THREE.Mesh(new THREE.ConeGeometry(0.8 + Math.random() * 0.5, h * 1.2, 6), treeMat);
    canopy.position.set(x, h + 0.8, z);
    scene.add(canopy);
    objects.push(canopy);
  }

  // Fireflies (particles)
  const ffGeo = new THREE.BufferGeometry();
  const ffPos = [];
  for (let i = 0; i < 80; i++) {
    ffPos.push((Math.random() - 0.5) * 20, 0.5 + Math.random() * 4, (Math.random() - 0.5) * 20);
  }
  ffGeo.setAttribute('position', new THREE.Float32BufferAttribute(ffPos, 3));
  const ffMat = new THREE.PointsMaterial({ color: 0x88ffaa, size: 0.08, transparent: true, opacity: 0.8 });
  const ff = new THREE.Points(ffGeo, ffMat);
  scene.add(ff);
  objects.push(ff);

  return objects;
}

function buildUrban(scene) {
  const objects = [];

  // Ground (road)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshLambertMaterial({ color: 0x1a1a28 })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  objects.push(ground);

  // Buildings
  const buildingColors = [0x1e1e2e, 0x252535, 0x1a1a2a, 0x2a2a3a];
  const windowMat = new THREE.MeshLambertMaterial({ color: 0xffcc66, emissive: 0xffcc66, emissiveIntensity: 0.4 });

  for (let i = 0; i < 16; i++) {
    const angle = (i / 16) * Math.PI * 2;
    const r = 5 + Math.random() * 8;
    const x = Math.cos(angle) * r;
    const z = Math.sin(angle) * r;
    const w = 1 + Math.random() * 1.5;
    const h = 3 + Math.random() * 10;
    const d = 1 + Math.random() * 1.5;

    const building = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshLambertMaterial({ color: buildingColors[i % buildingColors.length] })
    );
    building.position.set(x, h / 2, z);
    scene.add(building);
    objects.push(building);

    // Windows
    for (let j = 0; j < 3; j++) {
      const win = new THREE.Mesh(new THREE.BoxGeometry(0.15, 0.15, 0.05), windowMat);
      win.position.set(x + (Math.random() - 0.5) * w * 0.6, h * 0.3 + j * 1.2, z + d / 2 + 0.01);
      scene.add(win);
      objects.push(win);
    }
  }

  // Streetlight glow particles
  const pGeo = new THREE.BufferGeometry();
  const pPos = [];
  for (let i = 0; i < 40; i++) {
    pPos.push((Math.random() - 0.5) * 18, Math.random() * 8, (Math.random() - 0.5) * 18);
  }
  pGeo.setAttribute('position', new THREE.Float32BufferAttribute(pPos, 3));
  const pMat = new THREE.PointsMaterial({ color: 0xaaaaff, size: 0.05, transparent: true, opacity: 0.5 });
  scene.add(new THREE.Points(pGeo, pMat));

  return objects;
}

function buildInterior(scene) {
  const objects = [];
  const wallMat = new THREE.MeshLambertMaterial({ color: 0x3d2b1f, side: THREE.BackSide });

  // Room box
  const room = new THREE.Mesh(new THREE.BoxGeometry(12, 5, 10), wallMat);
  room.position.set(0, 2.5, 0);
  scene.add(room);
  objects.push(room);

  // Floor
  const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(12, 10),
    new THREE.MeshLambertMaterial({ color: 0x5c3d1e })
  );
  floor.rotation.x = -Math.PI / 2;
  scene.add(floor);
  objects.push(floor);

  // Table
  const table = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 0.1, 1.2),
    new THREE.MeshLambertMaterial({ color: 0x7a5230 })
  );
  table.position.set(0, 0.9, 1);
  scene.add(table);
  objects.push(table);

  // Candle flame (point light sphere)
  const candle = new THREE.Mesh(
    new THREE.SphereGeometry(0.06, 6, 6),
    new THREE.MeshLambertMaterial({ color: 0xffaa33, emissive: 0xffaa33, emissiveIntensity: 1 })
  );
  candle.position.set(0.3, 1.12, 1);
  scene.add(candle);
  objects.push(candle);

  const candleLight = new THREE.PointLight(0xffaa33, 1.5, 8);
  candleLight.position.set(0.3, 1.2, 1);
  scene.add(candleLight);
  objects.push(candleLight);

  // Dust motes
  const dustGeo = new THREE.BufferGeometry();
  const dustPos = [];
  for (let i = 0; i < 60; i++) {
    dustPos.push((Math.random() - 0.5) * 10, Math.random() * 4.5, (Math.random() - 0.5) * 8);
  }
  dustGeo.setAttribute('position', new THREE.Float32BufferAttribute(dustPos, 3));
  const dustMat = new THREE.PointsMaterial({ color: 0xffddaa, size: 0.04, transparent: true, opacity: 0.4 });
  scene.add(new THREE.Points(dustGeo, dustMat));

  return objects;
}

function buildOcean(scene) {
  const objects = [];

  // Ocean plane (animated in tick)
  const oceanGeo = new THREE.PlaneGeometry(60, 60, 32, 32);
  const oceanMat = new THREE.MeshLambertMaterial({ color: 0x003366, transparent: true, opacity: 0.85 });
  const ocean = new THREE.Mesh(oceanGeo, oceanMat);
  ocean.rotation.x = -Math.PI / 2;
  ocean.userData.isOcean = true;
  scene.add(ocean);
  objects.push(ocean);

  // Rocks
  const rockMat = new THREE.MeshLambertMaterial({ color: 0x334455 });
  for (let i = 0; i < 8; i++) {
    const rock = new THREE.Mesh(
      new THREE.DodecahedronGeometry(0.3 + Math.random() * 0.5, 0),
      rockMat
    );
    rock.position.set((Math.random() - 0.5) * 10, -0.1, (Math.random() - 0.5) * 10);
    rock.rotation.set(Math.random(), Math.random(), Math.random());
    scene.add(rock);
    objects.push(rock);
  }

  // Sea foam particles
  const foamGeo = new THREE.BufferGeometry();
  const foamPos = [];
  for (let i = 0; i < 100; i++) {
    foamPos.push((Math.random() - 0.5) * 20, 0.05 + Math.random() * 0.2, (Math.random() - 0.5) * 20);
  }
  foamGeo.setAttribute('position', new THREE.Float32BufferAttribute(foamPos, 3));
  const foamMat = new THREE.PointsMaterial({ color: 0xaaddff, size: 0.1, transparent: true, opacity: 0.6 });
  scene.add(new THREE.Points(foamGeo, foamMat));

  return objects;
}

function buildVoid(scene) {
  const objects = [];

  // Ground plane (dark)
  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(60, 60),
    new THREE.MeshLambertMaterial({ color: 0x0a000a })
  );
  ground.rotation.x = -Math.PI / 2;
  scene.add(ground);
  objects.push(ground);

  // Floating shards
  const shardMat = new THREE.MeshLambertMaterial({ color: 0x440055, transparent: true, opacity: 0.8 });
  for (let i = 0; i < 20; i++) {
    const shard = new THREE.Mesh(
      new THREE.TetrahedronGeometry(0.2 + Math.random() * 0.4, 0),
      shardMat
    );
    shard.position.set(
      (Math.random() - 0.5) * 14,
      0.5 + Math.random() * 4,
      (Math.random() - 0.5) * 14
    );
    shard.userData.floatOffset = Math.random() * Math.PI * 2;
    shard.userData.isShard = true;
    scene.add(shard);
    objects.push(shard);
  }

  // Stars
  const starGeo = new THREE.BufferGeometry();
  const starPos = [];
  for (let i = 0; i < 200; i++) {
    starPos.push((Math.random() - 0.5) * 40, 1 + Math.random() * 15, (Math.random() - 0.5) * 40);
  }
  starGeo.setAttribute('position', new THREE.Float32BufferAttribute(starPos, 3));
  const starMat = new THREE.PointsMaterial({ color: 0xcc88ff, size: 0.06, transparent: true, opacity: 0.9 });
  scene.add(new THREE.Points(starGeo, starMat));

  return objects;
}

// ─── Component ───────────────────────────────────────────────────────────────

export default function ThreeScene({ settingType }) {
  const mountRef = useRef(null);
  const stateRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const config = SETTINGS[settingType] ?? SETTINGS.void;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(config.bgColor);
    scene.fog = new THREE.Fog(config.fogColor, config.fogNear, config.fogFar);

    // Camera
    const camera = new THREE.PerspectiveCamera(60, mount.clientWidth / mount.clientHeight, 0.1, 200);
    camera.position.set(0, 2.2, 5);
    camera.lookAt(0, 1, 0);

    // Lights
    const ambient = new THREE.AmbientLight(config.ambientColor, config.ambientIntensity);
    scene.add(ambient);

    const dir = new THREE.DirectionalLight(config.dirColor, config.dirIntensity);
    dir.position.set(...config.dirPosition);
    scene.add(dir);

    // Geometry
    const objects = config.buildGeometry(scene);

    // Animation
    let animId;
    const clock = new THREE.Clock();

    function tick() {
      animId = requestAnimationFrame(tick);
      const t = clock.getElapsedTime();

      // Slow camera orbit
      camera.position.x = Math.sin(t * 0.07) * 3;
      camera.position.z = 4 + Math.cos(t * 0.07) * 2;
      camera.lookAt(0, 1, 0);

      // Ocean waves
      if (settingType === 'ocean') {
        const ocean = scene.children.find(c => c.userData.isOcean);
        if (ocean) {
          const pos = ocean.geometry.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const x = pos.getX(i);
            const z = pos.getZ(i);
            pos.setY(i, Math.sin(x * 0.5 + t) * 0.2 + Math.sin(z * 0.4 + t * 1.3) * 0.15);
          }
          pos.needsUpdate = true;
        }
      }

      // Void shards float
      if (settingType === 'void') {
        scene.children.forEach(c => {
          if (c.userData.isShard) {
            c.position.y += Math.sin(t + c.userData.floatOffset) * 0.003;
            c.rotation.y += 0.004;
          }
        });
      }

      renderer.render(scene, camera);
    }

    tick();

    // Resize handler
    function onResize() {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    }
    const ro = new ResizeObserver(onResize);
    ro.observe(mount);

    stateRef.current = { renderer, scene, camera, animId, ro };

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
      renderer.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [settingType]);

  return (
    <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
  );
}
