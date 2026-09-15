"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { GLOBE_CITIES } from "@/lib/site-data";

const GOLD = new THREE.Color("#e8b64c");
const GLOBE_R = 1.85;

/** lat/lon -> 3D position on sphere */
function latLonToVec3(lat: number, lon: number, radius: number): THREE.Vector3 {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((lon + 180) * Math.PI) / 180;
  return new THREE.Vector3(
    -radius * Math.sin(phi) * Math.cos(theta),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

/** Graticule (meridians + parallels) as a single LineSegments geometry */
function useGraticule() {
  return useMemo(() => {
    const pts: number[] = [];
    const push = (v: THREE.Vector3) => pts.push(v.x, v.y, v.z);

    // Meridians every 20°
    for (let lon = -180; lon < 180; lon += 20) {
      let prev: THREE.Vector3 | null = null;
      for (let lat = -90; lat <= 90; lat += 4) {
        const p = latLonToVec3(lat, lon, GLOBE_R + 0.002);
        if (prev) {
          push(prev);
          push(p);
        }
        prev = p;
      }
    }
    // Parallels every 20°
    for (let lat = -80; lat <= 80; lat += 20) {
      let prev: THREE.Vector3 | null = null;
      for (let lon = -180; lon <= 180; lon += 4) {
        const p = latLonToVec3(lat, lon, GLOBE_R + 0.002);
        if (prev) {
          push(prev);
          push(p);
        }
        prev = p;
      }
    }
    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.Float32BufferAttribute(pts, 3));
    return geo;
  }, []);
}

function Atmosphere() {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: /* glsl */ `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.62 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 3.2);
            gl_FragColor = vec4(0.91, 0.71, 0.30, 1.0) * intensity;
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      }),
    []
  );
  return (
    <mesh material={material} scale={1.24}>
      <sphereGeometry args={[GLOBE_R, 48, 48]} />
    </mesh>
  );
}

function CityMarker({ lat, lon, hub }: { lat: number; lon: number; hub: boolean }) {
  const ringRef = useRef<THREE.Mesh>(null);
  const pos = useMemo(() => latLonToVec3(lat, lon, GLOBE_R + 0.012), [lat, lon]);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (ringRef.current) {
      const s = 1 + 0.9 * (0.5 + 0.5 * Math.sin(t * 2.2 + phase));
      ringRef.current.scale.setScalar(s);
      (ringRef.current.material as THREE.MeshBasicMaterial).opacity =
        0.55 * (1 - (0.5 + 0.5 * Math.sin(t * 2.2 + phase)));
    }
  });

  return (
    <group position={pos}>
      <mesh>
        <sphereGeometry args={[hub ? 0.038 : 0.024, 12, 12]} />
        <meshBasicMaterial color={hub ? "#ffd98a" : GOLD} toneMapped={false} />
      </mesh>
      <mesh ref={ringRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.028, 0.042, 24]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.5} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </group>
  );
}

function FlightArc({ from, to, index, total }: { from: THREE.Vector3; to: THREE.Vector3; index: number; total: number }) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const curve = useMemo(() => {
    const mid1 = from.clone().lerp(to, 0.3).normalize().multiplyScalar(GLOBE_R + from.distanceTo(to) * 0.32);
    const mid2 = from.clone().lerp(to, 0.7).normalize().multiplyScalar(GLOBE_R + from.distanceTo(to) * 0.32);
    return new THREE.CubicBezierCurve3(from, mid1, mid2, to);
  }, [from, to]);

  const tube = useMemo(() => new THREE.TubeGeometry(curve, 64, 0.0065, 6, false), [curve]);

  useFrame(({ clock }) => {
    if (pulseRef.current) {
      const t = (clock.getElapsedTime() * 0.14 + index / total) % 1;
      pulseRef.current.position.copy(curve.getPoint(t));
      const fade = Math.sin(t * Math.PI);
      pulseRef.current.scale.setScalar(0.7 + fade * 0.9);
    }
  });

  return (
    <group>
      <mesh geometry={tube}>
        <meshBasicMaterial color={GOLD} transparent opacity={0.34} toneMapped={false} />
      </mesh>
      <mesh ref={pulseRef}>
        <sphereGeometry args={[0.02, 10, 10]} />
        <meshBasicMaterial color="#ffe3a0" toneMapped={false} />
      </mesh>
    </group>
  );
}

function FlyingPlane({ from, to }: { from: THREE.Vector3; to: THREE.Vector3 }) {
  const group = useRef<THREE.Group>(null);
  const curve = useMemo(() => {
    const mid1 = from.clone().lerp(to, 0.35).normalize().multiplyScalar(GLOBE_R + from.distanceTo(to) * 0.42);
    const mid2 = from.clone().lerp(to, 0.65).normalize().multiplyScalar(GLOBE_R + from.distanceTo(to) * 0.42);
    return new THREE.CubicBezierCurve3(from, mid1, mid2, to);
  }, [from, to]);

  useFrame(({ clock }) => {
    if (!group.current) return;
    const t = (clock.getElapsedTime() * 0.055) % 1;
    const p = curve.getPoint(t);
    const next = curve.getPoint(Math.min(t + 0.01, 1));
    group.current.position.copy(p);
    group.current.lookAt(next);
  });

  return (
    <group ref={group}>
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <coneGeometry args={[0.032, 0.12, 4]} />
        <meshBasicMaterial color="#ffffff" toneMapped={false} />
      </mesh>
      <mesh position={[0, 0, -0.02]} rotation={[0, 0, 0]}>
        <boxGeometry args={[0.11, 0.006, 0.045]} />
        <meshBasicMaterial color="#ffd98a" toneMapped={false} />
      </mesh>
    </group>
  );
}

function OrbitRings() {
  const r1 = useRef<THREE.Mesh>(null);
  const r2 = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (r1.current) r1.current.rotation.z = t * 0.12;
    if (r2.current) r2.current.rotation.z = -t * 0.09;
  });
  return (
    <group rotation={[Math.PI / 2.35, 0.2, 0]}>
      <mesh ref={r1}>
        <torusGeometry args={[GLOBE_R + 0.5, 0.0035, 8, 128]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.5} toneMapped={false} />
      </mesh>
      <mesh ref={r2} rotation={[0.12, 0.3, 0]}>
        <torusGeometry args={[GLOBE_R + 0.78, 0.002, 8, 128]} />
        <meshBasicMaterial color="#f5d38a" transparent opacity={0.28} toneMapped={false} />
      </mesh>
    </group>
  );
}

function DustField() {
  const ref = useRef<THREE.Points>(null);
  const geo = useMemo(() => {
    const N = 700;
    const positions = new Float32Array(N * 3);
    for (let i = 0; i < N; i++) {
      const r = GLOBE_R + 0.35 + Math.random() * 0.9;
      const theta = Math.random() * Math.PI * 2;
      const y = (Math.random() - 0.5) * 0.9;
      positions[i * 3] = r * Math.cos(theta);
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = r * Math.sin(theta);
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3));
    return g;
  }, []);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.05;
  });

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial color={GOLD} size={0.014} transparent opacity={0.55} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function Globe() {
  const group = useRef<THREE.Group>(null);
  const graticule = useGraticule();
  const hubCity = GLOBE_CITIES.find((c) => c.hub) ?? GLOBE_CITIES[0];
  const destinations = GLOBE_CITIES.filter((c) => !c.hub);

  const hubPos = useMemo(() => latLonToVec3(hubCity.lat, hubCity.lon, GLOBE_R + 0.012), [hubCity]);
  const destPos = useMemo(() => destinations.map((c) => latLonToVec3(c.lat, c.lon, GLOBE_R + 0.012)), [destinations]);
  const planeFrom = useMemo(() => latLonToVec3(hubCity.lat, hubCity.lon, GLOBE_R + 0.012), [hubCity]);
  const planeTo = useMemo(() => latLonToVec3(-33.87, 151.21, GLOBE_R + 0.012), []); // Sydney

  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.02;
  });

  return (
    <group ref={group} rotation={[0.12, -1.2, 0.08]}>
      {/* Core sphere */}
      <mesh>
        <sphereGeometry args={[GLOBE_R, 64, 64]} />
        <meshStandardMaterial color="#0e0e14" roughness={0.55} metalness={0.55} />
      </mesh>
      {/* Inner glow core */}
      <mesh scale={0.985}>
        <sphereGeometry args={[GLOBE_R, 48, 48]} />
        <meshBasicMaterial color="#15130d" transparent opacity={0.85} />
      </mesh>
      <lineSegments geometry={graticule}>
        <lineBasicMaterial color={GOLD} transparent opacity={0.13} toneMapped={false} />
      </lineSegments>
      <Atmosphere />
      <CityMarker lat={hubCity.lat} lon={hubCity.lon} hub />
      {destinations.map((c) => (
        <CityMarker key={c.name} lat={c.lat} lon={c.lon} hub={false} />
      ))}
      {destPos.map((p, i) => (
        <FlightArc key={`arc-${destinations[i].name}`} from={hubPos} to={p} index={i} total={destPos.length} />
      ))}
      <FlyingPlane from={planeFrom} to={planeTo} />
      <OrbitRings />
      <DustField />
    </group>
  );
}

export default function GlobeScene() {
  return (
    <Canvas
      camera={{ position: [0, 0.4, 5.4], fov: 42 }}
      dpr={[1, 1.8]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[5, 4, 6]} intensity={40} color="#f5d38a" />
      <pointLight position={[-6, -3, -4]} intensity={22} color="#ffffff" />
      <Stars radius={90} depth={40} count={2200} factor={3.4} saturation={0} fade speed={0.8} />
      <Globe />
      <OrbitControls
        enableZoom={false}
        enablePan={false}
        autoRotate
        autoRotateSpeed={0.55}
        minPolarAngle={Math.PI / 3.4}
        maxPolarAngle={Math.PI / 1.7}
      />
    </Canvas>
  );
}
