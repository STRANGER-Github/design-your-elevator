import React, { useMemo, useRef, useLayoutEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { ElevatorConfiguration } from '../../types/elevator';
import { WALL_FINISHES, FLOOR_FINISHES, CEILING_OPTIONS, DOOR_OPTIONS } from '../../data/materials';
import { MIRROR_OPTIONS, HANDRAIL_OPTIONS, CONTROL_PANEL_OPTIONS, SKIRTING_OPTIONS } from '../../data/accessories';

interface ElevatorModelProps {
  config: ElevatorConfiguration;
  showDimensions?: boolean;
}

export const ElevatorModel: React.FC<ElevatorModelProps> = ({ config, showDimensions = false }) => {
  const { dimensions, walls, floor, ceiling, door, mirror, handrail, controlPanel, skirting, doorsOpen, lightingTempMode } = config;

  // Dimensions in meters
  const w = dimensions.widthMm / 1000;
  const d = dimensions.depthMm / 1000;
  const h = dimensions.heightMm / 1000;

  // Lookup selections
  const leftWallFinish = WALL_FINISHES.find(f => f.id === walls.left) || WALL_FINISHES[0];
  const rearWallFinish = WALL_FINISHES.find(f => f.id === (walls.allSame ? walls.left : walls.rear)) || WALL_FINISHES[0];
  const rightWallFinish = WALL_FINISHES.find(f => f.id === (walls.allSame ? walls.left : walls.right)) || WALL_FINISHES[0];
  const floorFinish = FLOOR_FINISHES.find(f => f.id === floor) || FLOOR_FINISHES[0];
  const ceilingOption = CEILING_OPTIONS.find(c => c.id === ceiling) || CEILING_OPTIONS[0];
  const doorOption = DOOR_OPTIONS.find(d => d.id === door) || DOOR_OPTIONS[0];
  const mirrorOption = MIRROR_OPTIONS.find(m => m.id === mirror) || MIRROR_OPTIONS[0];
  const handrailOption = HANDRAIL_OPTIONS.find(h => h.id === handrail) || HANDRAIL_OPTIONS[0];
  const copOption = CONTROL_PANEL_OPTIONS.find(c => c.id === controlPanel) || CONTROL_PANEL_OPTIONS[0];
  const skirtingOption = SKIRTING_OPTIONS.find(s => s.id === skirting) || SKIRTING_OPTIONS[0];

  // Dynamic light color based on lightingTempMode
  const lightColor = useMemo(() => {
    switch (lightingTempMode) {
      case 'warm_3000k':
        return new THREE.Color('#ffe1b3');
      case 'cool_5000k':
        return new THREE.Color('#dbeafe');
      case 'neutral_4000k':
      default:
        return new THREE.Color('#fff7ed');
    }
  }, [lightingTempMode]);

  // Door opening animation reference
  const leftDoorRef = useRef<THREE.Group>(null);
  const rightDoorRef = useRef<THREE.Group>(null);
  const rearLeftDoorRef = useRef<THREE.Group>(null);
  const rearRightDoorRef = useRef<THREE.Group>(null);

  const wallThickness = 0.04;
  const doorWidth = Math.min(0.9, w * 0.75);
  const doorHeight = Math.min(2.1, h * 0.9);
  const sideJambWidth = (w - doorWidth) / 2;
  const headerHeight = h - doorHeight;
  const doorLeafWidth = doorWidth / 2 + 0.01;

  const closedLeftX = -doorWidth / 4;
  const closedRightX = doorWidth / 4;
  const openSlideDistance = doorWidth / 2 + 0.006;

  const targetLeftX = doorsOpen ? closedLeftX - openSlideDistance : closedLeftX;
  const targetRightX = doorsOpen ? closedRightX + openSlideDistance : closedRightX;

  // Clipping planes ensuring sliding door leaves NEVER protrude beyond elevator exterior walls (no wings)
  const doorClipPlanes = useMemo(() => {
    const leftPlane = new THREE.Plane(new THREE.Vector3(1, 0, 0), w / 2);
    const rightPlane = new THREE.Plane(new THREE.Vector3(-1, 0, 0), w / 2);
    return [leftPlane, rightPlane];
  }, [w]);

  const doorsInitialized = useRef(false);

  useLayoutEffect(() => {
    const initLeft = doorsOpen ? targetLeftX : closedLeftX;
    const initRight = doorsOpen ? targetRightX : closedRightX;
    if (leftDoorRef.current) leftDoorRef.current.position.x = initLeft;
    if (rightDoorRef.current) rightDoorRef.current.position.x = initRight;
    if (rearLeftDoorRef.current) rearLeftDoorRef.current.position.x = initLeft;
    if (rearRightDoorRef.current) rearRightDoorRef.current.position.x = initRight;
    doorsInitialized.current = true;
  }, []);

  useFrame((_, delta) => {
    if (!doorsInitialized.current) {
      const initLeft = doorsOpen ? targetLeftX : closedLeftX;
      const initRight = doorsOpen ? targetRightX : closedRightX;
      if (leftDoorRef.current) leftDoorRef.current.position.x = initLeft;
      if (rightDoorRef.current) rightDoorRef.current.position.x = initRight;
      if (rearLeftDoorRef.current) rearLeftDoorRef.current.position.x = initLeft;
      if (rearRightDoorRef.current) rearRightDoorRef.current.position.x = initRight;
      doorsInitialized.current = true;
      return;
    }

    if (leftDoorRef.current) {
      leftDoorRef.current.position.x = THREE.MathUtils.damp(
        leftDoorRef.current.position.x,
        targetLeftX,
        10,
        delta
      );
    }
    if (rightDoorRef.current) {
      rightDoorRef.current.position.x = THREE.MathUtils.damp(
        rightDoorRef.current.position.x,
        targetRightX,
        10,
        delta
      );
    }
    if (rearLeftDoorRef.current) {
      rearLeftDoorRef.current.position.x = THREE.MathUtils.damp(
        rearLeftDoorRef.current.position.x,
        targetLeftX,
        10,
        delta
      );
    }
    if (rearRightDoorRef.current) {
      rearRightDoorRef.current.position.x = THREE.MathUtils.damp(
        rearRightDoorRef.current.position.x,
        targetRightX,
        10,
        delta
      );
    }
  });

  // Display screen texture showing bold illuminated 'G'
  const copDisplayTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 320;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    // Dark LCD glossy background
    const grad = ctx.createLinearGradient(0, 0, 0, 320);
    grad.addColorStop(0, '#040711');
    grad.addColorStop(1, '#0b1424');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 512, 320);

    // Subtle inner bezel outline
    ctx.strokeStyle = '#1e293b';
    ctx.lineWidth = 4;
    ctx.strokeRect(4, 4, 504, 312);

    // Top status header
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(6, 6, 500, 42);
    ctx.fillStyle = '#94a3b8';
    ctx.font = '600 17px -apple-system, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('ELEVATOR 1  ·  CAPACITY 630 KG (8 PERS)', 20, 34);

    // Glowing direction arrow
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 56px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▲', 85, 175);

    // BOLD "G" FLOOR DISPLAY
    const haloColor = copOption.illuminatedHalo || '#f59e0b';
    ctx.fillStyle = haloColor;
    ctx.shadowColor = haloColor;
    ctx.shadowBlur = 28;
    ctx.font = '900 165px -apple-system, BlinkMacSystemFont, "Segoe UI", Arial, sans-serif';
    ctx.fillText('G', 260, 200);
    ctx.shadowBlur = 0;

    // Floor description subtitle
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 22px -apple-system, sans-serif';
    ctx.fillText('GROUND FLOOR  ·  LOBBY', 260, 255);

    // Live door indicator
    ctx.fillStyle = doorsOpen ? '#10b981' : '#64748b';
    ctx.font = 'bold 16px monospace';
    ctx.fillText(doorsOpen ? '◄ DOORS OPENING / OPEN ►' : '■ DOORS CLOSED / READY ■', 260, 292);

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, [copOption.illuminatedHalo, doorsOpen]);

  // Texture atlas for 23 floors (1..23) + 'G' + essential buttons (open, close, alarm, call)
  const buttonTextures = useMemo(() => {
    const labels = [
      '23', '22', '21', '20', '19', '18', '17', '16', '15', '14',
      '13', '12', '11', '10', '9', '8', '7', '6', '5', '4',
      '3', '2', '1', 'G', '◄||►', '►||◄', '🔔', '📞'
    ];
    const map = new Map<string, THREE.CanvasTexture>();
    const haloColor = copOption.illuminatedHalo || '#f59e0b';

    labels.forEach(lbl => {
      const canvas = document.createElement('canvas');
      canvas.width = 128;
      canvas.height = 128;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const isG = lbl === 'G';
      const isAlarm = lbl === '🔔';
      const isPhone = lbl === '📞';

      // Background disc
      ctx.fillStyle = isG ? '#1e293b' : '#0a0f1d';
      ctx.beginPath();
      ctx.arc(64, 64, 58, 0, Math.PI * 2);
      ctx.fill();

      // Outer bezel ring
      ctx.strokeStyle = isG ? haloColor : isAlarm ? '#eab308' : isPhone ? '#22c55e' : '#64748b';
      ctx.lineWidth = isG ? 6 : 4;
      if (isG) {
        ctx.shadowColor = haloColor;
        ctx.shadowBlur = 10;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner label text
      ctx.fillStyle = isG ? haloColor : isAlarm ? '#fde047' : isPhone ? '#86efac' : '#f8fafc';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      if (isAlarm) {
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText('🔔', 64, 64);
      } else if (isPhone) {
        ctx.font = 'bold 44px sans-serif';
        ctx.fillText('📞', 64, 64);
      } else if (lbl === '◄||►') {
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('◄||►', 64, 64);
      } else if (lbl === '►||◄') {
        ctx.font = 'bold 24px sans-serif';
        ctx.fillText('►||◄', 64, 64);
      } else {
        ctx.font = 'bold 50px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.fillText(lbl, 64, 64);
      }

      const tex = new THREE.CanvasTexture(canvas);
      tex.colorSpace = THREE.SRGBColorSpace;
      map.set(lbl, tex);
    });

    return map;
  }, [copOption.illuminatedHalo]);

  // Button positions: 12 rows of 2 for 23 floors + G, plus 2 rows of 2 for essential buttons
  const copButtons = useMemo(() => {
    const rows = [
      ['22', '23'],
      ['20', '21'],
      ['18', '19'],
      ['16', '17'],
      ['14', '15'],
      ['12', '13'],
      ['10', '11'],
      ['8', '9'],
      ['6', '7'],
      ['4', '5'],
      ['2', '3'],
      ['G', '1'],
      ['◄||►', '►||◄'],
      ['🔔', '📞'],
    ];

    const startY = 1.34;
    const rowStep = 0.027;
    const colZ = [-0.038, 0.038];

    const list: { id: string; label: string; y: number; z: number; isG: boolean }[] = [];
    rows.forEach((row, rIdx) => {
      row.forEach((label, cIdx) => {
        list.push({
          id: `btn-${rIdx}-${cIdx}-${label}`,
          label,
          y: startY - rIdx * rowStep,
          z: colZ[cIdx],
          isG: label === 'G',
        });
      });
    });

    return list;
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* ================= FLOOR ================= */}
      <mesh position={[0, -0.02, 0]} receiveShadow>
        <boxGeometry args={[w, 0.04, d]} />
        <meshStandardMaterial
          color={floorFinish.hex}
          roughness={floorFinish.roughness}
          metalness={floorFinish.metalness}
        />
      </mesh>

      {/* Skirting Baseboards (Bottom Kick Plates) */}
      <group position={[0, (skirtingOption.heightMm / 1000) / 2, 0]}>
        {/* Left Skirting */}
        <mesh position={[-w / 2 + 0.008, 0, 0]}>
          <boxGeometry args={[0.016, skirtingOption.heightMm / 1000, d - 0.02]} />
          <meshStandardMaterial
            color={skirtingOption.finishHex}
            roughness={skirtingOption.roughness}
            metalness={skirtingOption.metalness}
          />
        </mesh>
        {/* Right Skirting */}
        <mesh position={[w / 2 - 0.008, 0, 0]}>
          <boxGeometry args={[0.016, skirtingOption.heightMm / 1000, d - 0.02]} />
          <meshStandardMaterial
            color={skirtingOption.finishHex}
            roughness={skirtingOption.roughness}
            metalness={skirtingOption.metalness}
          />
        </mesh>
        {/* Rear Skirting (if not through entrance) */}
        {dimensions.entranceType !== 'through_180' && (
          <mesh position={[0, 0, -d / 2 + 0.008]}>
            <boxGeometry args={[w - 0.02, skirtingOption.heightMm / 1000, 0.016]} />
            <meshStandardMaterial
              color={skirtingOption.finishHex}
              roughness={skirtingOption.roughness}
              metalness={skirtingOption.metalness}
            />
          </mesh>
        )}
      </group>

      {/* Bumpers protection strip if enabled */}
      {skirtingOption.hasBumperProtection && (
        <group position={[0, 0.75, 0]}>
          <mesh position={[-w / 2 + 0.012, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, d - 0.04]} />
            <meshStandardMaterial color="#1e2229" roughness={0.7} metalness={0.2} />
          </mesh>
          <mesh position={[w / 2 - 0.012, 0, 0]}>
            <boxGeometry args={[0.02, 0.08, d - 0.04]} />
            <meshStandardMaterial color="#1e2229" roughness={0.7} metalness={0.2} />
          </mesh>
          {dimensions.entranceType !== 'through_180' && (
            <mesh position={[0, 0, -d / 2 + 0.012]}>
              <boxGeometry args={[w - 0.04, 0.08, 0.02]} />
              <meshStandardMaterial color="#1e2229" roughness={0.7} metalness={0.2} />
            </mesh>
          )}
        </group>
      )}

      {/* ================= LEFT WALL ================= */}
      <mesh position={[-w / 2 - wallThickness / 2, h / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, h, d]} />
        <meshStandardMaterial
          color={leftWallFinish.hex}
          roughness={leftWallFinish.roughness}
          metalness={leftWallFinish.metalness}
        />
      </mesh>

      {/* ================= RIGHT WALL ================= */}
      <mesh position={[w / 2 + wallThickness / 2, h / 2, 0]} receiveShadow castShadow>
        <boxGeometry args={[wallThickness, h, d]} />
        <meshStandardMaterial
          color={rightWallFinish.hex}
          roughness={rightWallFinish.roughness}
          metalness={rightWallFinish.metalness}
        />
      </mesh>

      {/* ================= REAR WALL / REAR DOORS ================= */}
      {dimensions.entranceType === 'through_180' ? (
        /* Rear Through Entrance Portals & Doors */
        <group position={[0, 0, -d / 2 - wallThickness / 2]}>
          {/* Left Jamb */}
          <mesh position={[-w / 2 + sideJambWidth / 2, doorHeight / 2, 0]}>
            <boxGeometry args={[sideJambWidth, doorHeight, wallThickness]} />
            <meshStandardMaterial color={doorOption.finishHex} roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Right Jamb */}
          <mesh position={[w / 2 - sideJambWidth / 2, doorHeight / 2, 0]}>
            <boxGeometry args={[sideJambWidth, doorHeight, wallThickness]} />
            <meshStandardMaterial color={doorOption.finishHex} roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Transom Header */}
          <mesh position={[0, doorHeight + headerHeight / 2, 0]}>
            <boxGeometry args={[w, headerHeight, wallThickness]} />
            <meshStandardMaterial color={doorOption.finishHex} roughness={0.3} metalness={0.85} />
          </mesh>
          {/* Rear Left Door Leaf */}
          <group ref={rearLeftDoorRef} position-y={doorHeight / 2} position-z={0.01}>
            <mesh>
              <boxGeometry args={[doorLeafWidth, doorHeight, 0.02]} />
              <meshStandardMaterial
                color={doorOption.finishHex}
                roughness={doorOption.roughness}
                metalness={doorOption.metalness}
                clippingPlanes={doorClipPlanes}
              />
            </mesh>
          </group>
          {/* Rear Right Door Leaf */}
          <group ref={rearRightDoorRef} position-y={doorHeight / 2} position-z={0.01}>
            <mesh>
              <boxGeometry args={[doorLeafWidth, doorHeight, 0.02]} />
              <meshStandardMaterial
                color={doorOption.finishHex}
                roughness={doorOption.roughness}
                metalness={doorOption.metalness}
                clippingPlanes={doorClipPlanes}
              />
            </mesh>
          </group>
        </group>
      ) : (
        /* Solid Rear Wall */
        <mesh position={[0, h / 2, -d / 2 - wallThickness / 2]} receiveShadow castShadow>
          <boxGeometry args={[w, h, wallThickness]} />
          <meshStandardMaterial
            color={rearWallFinish.hex}
            roughness={rearWallFinish.roughness}
            metalness={rearWallFinish.metalness}
          />
        </mesh>
      )}

      {/* ================= FRONT WALL & ENTRANCE DOORS ================= */}
      <group position={[0, 0, d / 2 + wallThickness / 2]}>
        {/* Left Portal Jamb */}
        <mesh position={[-w / 2 + sideJambWidth / 2, doorHeight / 2, 0]}>
          <boxGeometry args={[sideJambWidth, doorHeight, wallThickness]} />
          <meshStandardMaterial color={doorOption.finishHex} roughness={0.35} metalness={0.85} />
        </mesh>
        {/* Right Portal Jamb */}
        <mesh position={[w / 2 - sideJambWidth / 2, doorHeight / 2, 0]}>
          <boxGeometry args={[sideJambWidth, doorHeight, wallThickness]} />
          <meshStandardMaterial color={doorOption.finishHex} roughness={0.35} metalness={0.85} />
        </mesh>
        {/* Transom Header Panel */}
        <mesh position={[0, doorHeight + headerHeight / 2, 0]}>
          <boxGeometry args={[w, headerHeight, wallThickness]} />
          <meshStandardMaterial color={doorOption.finishHex} roughness={0.35} metalness={0.85} />
        </mesh>

        {/* Sliding Front Door Leaves */}
        <group ref={leftDoorRef} position-y={doorHeight / 2} position-z={-0.01}>
          <mesh>
            <boxGeometry args={[doorLeafWidth, doorHeight, 0.025]} />
            <meshStandardMaterial
              color={doorOption.finishHex}
              roughness={doorOption.roughness}
              metalness={doorOption.metalness}
              clippingPlanes={doorClipPlanes}
            />
          </mesh>
          {doorOption.hasGlassVisionPanels && (
            <mesh position={[0, 0, 0.002]}>
              <boxGeometry args={[0.12, doorHeight * 0.7, 0.03]} />
              <meshPhysicalMaterial
                color="#88b5d8"
                transmission={0.9}
                opacity={1}
                transparent
                roughness={0.05}
                ior={1.5}
                clippingPlanes={doorClipPlanes}
              />
            </mesh>
          )}
        </group>
        <group ref={rightDoorRef} position-y={doorHeight / 2} position-z={-0.01}>
          <mesh>
            <boxGeometry args={[doorLeafWidth, doorHeight, 0.025]} />
            <meshStandardMaterial
              color={doorOption.finishHex}
              roughness={doorOption.roughness}
              metalness={doorOption.metalness}
              clippingPlanes={doorClipPlanes}
            />
          </mesh>
          {doorOption.hasGlassVisionPanels && (
            <mesh position={[0, 0, 0.002]}>
              <boxGeometry args={[0.12, doorHeight * 0.7, 0.03]} />
              <meshPhysicalMaterial
                color="#88b5d8"
                transmission={0.9}
                opacity={1}
                transparent
                roughness={0.05}
                ior={1.5}
                clippingPlanes={doorClipPlanes}
              />
            </mesh>
          )}
        </group>
      </group>

      {/* ================= CEILING & LIGHTING ================= */}
      {/* Outer Ceiling Slab */}
      <mesh position={[0, h + 0.02, 0]}>
        <boxGeometry args={[w, 0.04, d]} />
        <meshStandardMaterial color="#2d3139" roughness={0.7} metalness={0.3} />
      </mesh>

      {/* Under-Ceiling Architectural Fixture */}
      <group position={[0, h - 0.02, 0]}>
        {/* Perimeter Halo Cove */}
        {ceilingOption.lightingType === 'perimeter_halo' && (
          <group>
            {/* Suspended Central Island */}
            <mesh position={[0, -0.01, 0]}>
              <boxGeometry args={[w - 0.18, 0.02, d - 0.18]} />
              <meshStandardMaterial color="#f8fafc" roughness={0.3} metalness={0.1} />
            </mesh>
            {/* Emissive Halo Strip around cove */}
            <mesh position={[0, -0.005, 0]}>
              <boxGeometry args={[w - 0.12, 0.01, d - 0.12]} />
              <meshBasicMaterial color={lightColor} />
            </mesh>
            <pointLight position={[0, -0.15, 0]} color={lightColor} intensity={ceilingOption.lightIntensity * 15} distance={3.5} />
          </group>
        )}

        {/* Recessed Quad Spots */}
        {ceilingOption.lightingType === 'spots' && (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[w - 0.04, 0.015, d - 0.04]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.4} metalness={0.4} />
            </mesh>
            {/* 4 Spotlights */}
            {[-w * 0.28, w * 0.28].map((sx, i) =>
              [-d * 0.28, d * 0.28].map((sz, j) => (
                <group key={`spot-${i}-${j}`} position={[sx, -0.01, sz]}>
                  {/* Outer Bezel */}
                  <mesh rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.04, 0.04, 0.01, 24]} />
                    <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
                  </mesh>
                  {/* Glowing lens */}
                  <mesh position={[0, -0.005, 0]} rotation={[Math.PI / 2, 0, 0]}>
                    <cylinderGeometry args={[0.03, 0.03, 0.005, 24]} />
                    <meshBasicMaterial color={lightColor} />
                  </mesh>
                  <spotLight
                    position={[0, 0, 0]}
                    target-position={[sx, 0, sz]}
                    color={lightColor}
                    intensity={ceilingOption.lightIntensity * 12}
                    angle={0.7}
                    penumbra={0.6}
                    distance={3.2}
                    castShadow
                  />
                </group>
              ))
            )}
          </group>
        )}

        {/* Full Luminous Diffuser Panel */}
        {ceilingOption.lightingType === 'full_luminous' && (
          <group>
            <mesh position={[0, -0.008, 0]}>
              <boxGeometry args={[w - 0.08, 0.015, d - 0.08]} />
              <meshStandardMaterial
                color="#ffffff"
                emissive={lightColor}
                emissiveIntensity={0.8}
                roughness={0.2}
              />
            </mesh>
            <pointLight position={[0, -0.2, 0]} color={lightColor} intensity={ceilingOption.lightIntensity * 18} distance={3.8} />
          </group>
        )}

        {/* Linear Architectural Slits */}
        {ceilingOption.lightingType === 'linear_slit' && (
          <group>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[w - 0.04, 0.02, d - 0.04]} />
              <meshStandardMaterial color="#1e242d" roughness={0.6} metalness={0.3} />
            </mesh>
            {/* Dual parallel linear light bars */}
            {[-w * 0.22, w * 0.22].map((lx, idx) => (
              <group key={`slit-${idx}`} position={[lx, -0.01, 0]}>
                <mesh>
                  <boxGeometry args={[0.035, 0.01, d - 0.25]} />
                  <meshBasicMaterial color={lightColor} />
                </mesh>
                <pointLight position={[0, -0.1, 0]} color={lightColor} intensity={ceilingOption.lightIntensity * 10} distance={3} />
              </group>
            ))}
          </group>
        )}
      </group>

      {/* Cabin Interior Ambient/Fill Light */}
      <pointLight position={[0, h * 0.5, 0]} color={lightColor} intensity={2.5} distance={2.5} />

      {/* ================= MIRROR ================= */}
      {mirrorOption.position === 'rear' && dimensions.entranceType !== 'through_180' && (
        <group position={[0, 0, -d / 2 + 0.006]}>
          {mirrorOption.coverage === 'half_height' && (
            <mesh position={[0, h * 0.65, 0]}>
              <boxGeometry args={[w * 0.85, h * 0.5, 0.008]} />
              <meshStandardMaterial
                color={mirrorOption.tint === 'bronze' ? '#d4b483' : '#e2e8f0'}
                roughness={0.03}
                metalness={0.97}
              />
            </mesh>
          )}
          {mirrorOption.coverage === 'full_height_narrow' && (
            <mesh position={[0, h * 0.5, 0]}>
              <boxGeometry args={[w * 0.35, h * 0.85, 0.008]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.03} metalness={0.97} />
            </mesh>
          )}
          {mirrorOption.coverage === 'full_height_wide' && (
            <mesh position={[0, h * 0.5, 0]}>
              <boxGeometry args={[w * 0.94, h * 0.88, 0.008]} />
              <meshStandardMaterial color="#e2e8f0" roughness={0.03} metalness={0.97} />
            </mesh>
          )}
        </group>
      )}

      {/* ================= HANDRAIL ================= */}
      {handrailOption.position !== 'none' && (
        <group position={[0, 0.9, 0]}>
          {/* Rear Handrail (if not through entrance) */}
          {dimensions.entranceType !== 'through_180' && (
            <group position={[0, 0, -d / 2 + 0.05]}>
              {handrailOption.shape === 'cylindrical' && (
                <mesh rotation={[0, 0, Math.PI / 2]}>
                  <cylinderGeometry args={[0.02, 0.02, w * 0.8, 20]} />
                  <meshStandardMaterial
                    color={handrailOption.finishHex}
                    roughness={handrailOption.roughness}
                    metalness={handrailOption.metalness}
                  />
                </mesh>
              )}
              {handrailOption.shape === 'flat_blade' && (
                <mesh>
                  <boxGeometry args={[w * 0.82, 0.05, 0.015]} />
                  <meshStandardMaterial
                    color={handrailOption.finishHex}
                    roughness={handrailOption.roughness}
                    metalness={handrailOption.metalness}
                  />
                </mesh>
              )}
              {/* Standoff brackets connecting to rear wall */}
              {[-w * 0.3, w * 0.3].map((bx, idx) => (
                <mesh key={`bracket-r-${idx}`} position={[bx, 0, -0.025]} rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.01, 0.01, 0.05, 12]} />
                  <meshStandardMaterial color="#475569" metalness={0.9} roughness={0.2} />
                </mesh>
              ))}
            </group>
          )}

          {/* Three sides handrails */}
          {handrailOption.position === 'three_sides' && (
            <>
              {/* Left Wall Rail */}
              <group position={[-w / 2 + 0.05, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, d * 0.75, 20]} />
                  <meshStandardMaterial
                    color={handrailOption.finishHex}
                    roughness={handrailOption.roughness}
                    metalness={handrailOption.metalness}
                  />
                </mesh>
              </group>
              {/* Right Wall Rail */}
              <group position={[w / 2 - 0.05, 0, 0]}>
                <mesh rotation={[Math.PI / 2, 0, 0]}>
                  <cylinderGeometry args={[0.02, 0.02, d * 0.75, 20]} />
                  <meshStandardMaterial
                    color={handrailOption.finishHex}
                    roughness={handrailOption.roughness}
                    metalness={handrailOption.metalness}
                  />
                </mesh>
              </group>
            </>
          )}
        </group>
      )}

      {/* ================= CAR OPERATING PANEL (COP) ================= */}
      <group position={[w / 2 - 0.008, 0, d * 0.18]}>
        {/* Column plate */}
        <mesh position={[0, copOption.columnHeight === 'full_height' ? h / 2 : 1.15, 0]}>
          <boxGeometry
            args={[
              0.016,
              copOption.columnHeight === 'full_height' ? h * 0.95 : 0.94,
              0.22,
            ]}
          />
          <meshStandardMaterial
            color={copOption.finishHex}
            roughness={0.3}
            metalness={0.88}
          />
        </mesh>

        {/* Display Screen displaying bold 'G' */}
        <group position={[-0.01, 1.48, 0]}>
          {/* Bezel frame */}
          <mesh>
            <boxGeometry args={[0.006, 0.12, 0.18]} />
            <meshStandardMaterial color="#0f172a" roughness={0.4} metalness={0.6} />
          </mesh>
          {/* Glowing display face showing 'G' */}
          <mesh position={[-0.004, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <planeGeometry args={[0.165, 0.105]} />
            <meshBasicMaterial map={copDisplayTexture} />
          </mesh>
        </group>

        {/* 23 Floor Buttons (1..23 + 'G') + Essential Buttons (Doors Open/Close, Alarm, Help) */}
        {copButtons.map((btn) => (
          <group key={btn.id} position={[-0.011, btn.y, btn.z]}>
            {/* Stainless steel circular bezel ring */}
            <mesh rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.0115, 0.0115, 0.004, 24]} />
              <meshStandardMaterial color="#cbd5e1" metalness={0.9} roughness={0.2} />
            </mesh>
            {/* Illuminated Tactile Face */}
            <mesh position={[-0.0025, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
              <circleGeometry args={[0.01, 24]} />
              <meshBasicMaterial
                map={buttonTextures.get(btn.label)}
                transparent
              />
            </mesh>
          </group>
        ))}
      </group>

      {/* ================= OPTIONAL 3D DIMENSION GUIDES ================= */}
      {showDimensions && (
        <group position={[0, 0, 0]}>
          {/* Width Dimension Line (Front Bottom) */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -w / 2, -0.08, d / 2 + 0.15,
                    w / 2, -0.08, d / 2 + 0.15,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>

          {/* Depth Dimension Line (Right Bottom) */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    w / 2 + 0.15, -0.08, -d / 2,
                    w / 2 + 0.15, -0.08, d / 2,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>

          {/* Height Dimension Line (Left Rear Vertical) */}
          <lineSegments>
            <bufferGeometry>
              <bufferAttribute
                attach="attributes-position"
                args={[
                  new Float32Array([
                    -w / 2 - 0.15, 0, -d / 2 - 0.05,
                    -w / 2 - 0.15, h, -d / 2 - 0.05,
                  ]),
                  3,
                ]}
              />
            </bufferGeometry>
            <lineBasicMaterial color="#d97706" linewidth={2} />
          </lineSegments>
        </group>
      )}
    </group>
  );
};
