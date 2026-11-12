import React, { Suspense, useState, useRef, useEffect, useLayoutEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { OrbitControls, ContactShadows } from '@react-three/drei';
import * as THREE from 'three';
import { ElevatorConfiguration } from '../../types/elevator';
import { ElevatorModel } from './ElevatorModel';
import { ViewControls, CameraPreset } from './ViewControls';
import { WebGLFallback } from './WebGLFallback';

interface ElevatorCanvasProps {
  config: ElevatorConfiguration;
  onUpdateConfig: (partial: Partial<ElevatorConfiguration>) => void;
}

// Compute target camera position, lookAt target, and FOV for a given preset and dimensions
const getPresetTarget = (
  preset: CameraPreset,
  dimensions: ElevatorConfiguration['dimensions']
) => {
  const w = dimensions.widthMm / 1000;
  const d = dimensions.depthMm / 1000;
  const h = dimensions.heightMm / 1000;

  const targetPos = new THREE.Vector3();
  const targetLookAt = new THREE.Vector3();
  let targetFov = 48;

  switch (preset) {
    case 'inside':
      // Zoomed out to show the complete interior: walls, floor, ceiling, mirror, fittings
      targetPos.set(0, h * 0.52, d * 0.46);
      targetLookAt.set(0, h * 0.48, -d * 0.15);
      targetFov = 75;
      break;

    case 'entrance':
      // Straight-on entrance portal view showing doors and frame
      targetPos.set(0, h * 0.5, d + 1.6);
      targetLookAt.set(0, h * 0.5, 0);
      targetFov = 50;
      break;

    case 'cop':
      // Close, crisp focus on the Control Column screen (showing 'G') and 23 floor buttons
      targetPos.set(w * 0.5 - 0.44, 1.20, d * 0.18 + 0.14);
      targetLookAt.set(w * 0.5 - 0.01, 1.20, d * 0.18);
      targetFov = 48;
      break;

    case 'ceiling':
      // Looking straight up at the ceiling from cabin floor with ultra-wide angle to view entire ceiling
      targetPos.set(0, 0.32, 0.001);
      targetLookAt.set(0, h, 0);
      targetFov = 78;
      break;

    case 'isometric':
    default:
      // Default 3D Cutaway isometric overview
      targetPos.set(w * 1.7, h * 1.2, d * 1.8);
      targetLookAt.set(0, h * 0.45, 0);
      targetFov = 48;
      break;
  }

  return { targetPos, targetLookAt, targetFov };
};

// Camera transition controller
const CameraController: React.FC<{
  preset: CameraPreset;
  dimensions: ElevatorConfiguration['dimensions'];
  controlsRef: React.RefObject<any>;
  transitionTrigger: number;
}> = ({ preset, dimensions, controlsRef, transitionTrigger }) => {
  const { camera, gl } = useThree();
  const isTransitioning = useRef(false);
  const isUserInteracting = useRef(false);
  const targetLookAt = useRef(new THREE.Vector3());
  const targetPos = useRef(new THREE.Vector3());
  const targetFov = useRef(48);
  const isInitialized = useRef(false);

  // Initialize camera & controls target on initial layout
  useLayoutEffect(() => {
    const { targetPos: initialPos, targetLookAt: initialLookAt, targetFov: initialFov } = getPresetTarget(
      preset,
      dimensions
    );
    targetPos.current.copy(initialPos);
    targetLookAt.current.copy(initialLookAt);
    targetFov.current = initialFov;
    camera.position.copy(initialPos);
    camera.lookAt(initialLookAt);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.fov = initialFov;
      camera.updateProjectionMatrix();
    }
    if (controlsRef.current) {
      controlsRef.current.target.copy(initialLookAt);
      controlsRef.current.update();
    }
    isInitialized.current = true;
    isTransitioning.current = false;
  }, []);

  // When preset or transitionTrigger changes, trigger a smooth transition
  useEffect(() => {
    if (!isInitialized.current) return;
    const { targetPos: nextPos, targetLookAt: nextLookAt, targetFov: nextFov } = getPresetTarget(
      preset,
      dimensions
    );
    targetPos.current.copy(nextPos);
    targetLookAt.current.copy(nextLookAt);
    targetFov.current = nextFov;
    isTransitioning.current = true;
  }, [preset, transitionTrigger]);

  // Immediately cancel scripted transition upon user interaction (press & hold, drag, zoom)
  useEffect(() => {
    const controls = controlsRef.current;
    const dom = gl.domElement;

    const handleInteractionStart = () => {
      isTransitioning.current = false;
      isUserInteracting.current = true;
    };

    const handleInteractionEnd = () => {
      isUserInteracting.current = false;
    };

    if (controls) {
      controls.addEventListener('start', handleInteractionStart);
      controls.addEventListener('end', handleInteractionEnd);
    }

    dom.addEventListener('pointerdown', handleInteractionStart);
    dom.addEventListener('wheel', handleInteractionStart, { passive: true });
    dom.addEventListener('touchstart', handleInteractionStart, { passive: true });

    return () => {
      if (controls) {
        controls.removeEventListener('start', handleInteractionStart);
        controls.removeEventListener('end', handleInteractionEnd);
      }
      dom.removeEventListener('pointerdown', handleInteractionStart);
      dom.removeEventListener('wheel', handleInteractionStart);
      dom.removeEventListener('touchstart', handleInteractionStart);
    };
  }, [controlsRef.current, gl]);

  useFrame((_, delta) => {
    // If not yet initialized (e.g. controlsRef wasn't ready during layout), initialize now
    if (!isInitialized.current) {
      const { targetPos: initialPos, targetLookAt: initialLookAt, targetFov: initialFov } = getPresetTarget(
        preset,
        dimensions
      );
      targetPos.current.copy(initialPos);
      targetLookAt.current.copy(initialLookAt);
      targetFov.current = initialFov;
      camera.position.copy(initialPos);
      camera.lookAt(initialLookAt);
      if (camera instanceof THREE.PerspectiveCamera) {
        camera.fov = initialFov;
        camera.updateProjectionMatrix();
      }
      if (controlsRef.current) {
        controlsRef.current.target.copy(initialLookAt);
        controlsRef.current.update();
      }
      isInitialized.current = true;
      isTransitioning.current = false;
      return;
    }

    // Smoothly transition only when triggered by preset button or refresh button
    if (isTransitioning.current && !isUserInteracting.current) {
      const step = Math.min(delta * 4.5, 1);
      camera.position.lerp(targetPos.current, step);
      if (controlsRef.current) {
        controlsRef.current.target.lerp(targetLookAt.current, step);
        controlsRef.current.update();
      }
      if (camera instanceof THREE.PerspectiveCamera) {
        const curFov = camera.fov;
        const newFov = THREE.MathUtils.lerp(curFov, targetFov.current, step);
        if (Math.abs(newFov - curFov) > 0.05) {
          camera.fov = newFov;
          camera.updateProjectionMatrix();
        }
      }

      const posDist = camera.position.distanceTo(targetPos.current);
      const targetDist = controlsRef.current
        ? controlsRef.current.target.distanceTo(targetLookAt.current)
        : 0;

      // Finish transition when arrived at target
      if (posDist < 0.008 && targetDist < 0.008) {
        camera.position.copy(targetPos.current);
        if (camera instanceof THREE.PerspectiveCamera) {
          camera.fov = targetFov.current;
          camera.updateProjectionMatrix();
        }
        if (controlsRef.current) {
          controlsRef.current.target.copy(targetLookAt.current);
          controlsRef.current.update();
        }
        isTransitioning.current = false;
      }
    } else {
      // User manual navigation: OrbitControls damping smoothly settles and rests where unheld
      if (controlsRef.current) {
        controlsRef.current.update();
      }
    }
  });

  return null;
};

// Canvas fallback error boundary
class CanvasErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err: any) {
    console.warn('Canvas Error Boundary caught error:', err);
  }
  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export const ElevatorCanvas: React.FC<ElevatorCanvasProps> = ({ config, onUpdateConfig }) => {
  const [currentPreset, setCurrentPreset] = useState<CameraPreset>('isometric');
  const [transitionTrigger, setTransitionTrigger] = useState(0);
  const [showDimensions, setShowDimensions] = useState(false);
  const [webGlAvailable, setWebGlAvailable] = useState(true);
  const controlsRef = useRef<any>(null);

  // Check WebGL support
  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlAvailable(false);
      }
    } catch {
      setWebGlAvailable(false);
    }
  }, []);

  const handleSelectPreset = (preset: CameraPreset) => {
    setCurrentPreset(preset);
    setTransitionTrigger(prev => prev + 1);
  };

  const handleResetCamera = () => {
    setCurrentPreset('isometric');
    setTransitionTrigger(prev => prev + 1);
  };

  if (!webGlAvailable) {
    return <WebGLFallback config={config} onRetry={() => setWebGlAvailable(true)} />;
  }

  return (
    <div className="relative w-full h-full min-h-[460px] lg:min-h-[580px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
      {/* 3D Viewport Toolbar Controls */}
      <ViewControls
        currentPreset={currentPreset}
        onSelectPreset={handleSelectPreset}
        config={config}
        onUpdateConfig={onUpdateConfig}
        showDimensions={showDimensions}
        onToggleDimensions={() => setShowDimensions(!showDimensions)}
        onResetCamera={handleResetCamera}
      />

      {/* Floating Viewport Status Badges */}
      <div className="absolute bottom-4 left-4 z-20 pointer-events-none flex items-center gap-2 text-[11px] text-stone-300 bg-stone-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-800 font-barlow">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="font-medium">
          {config.dimensions.widthMm} × {config.dimensions.depthMm} × {config.dimensions.heightMm} mm
        </span>
        <span className="text-stone-600">|</span>
        <span>{config.dimensions.capacityKg} kg · {config.dimensions.persons} Persons</span>
      </div>

      <div className="absolute bottom-4 right-4 z-20 pointer-events-none text-[11px] text-stone-400 hidden sm:block bg-stone-950/80 backdrop-blur px-3 py-1.5 rounded-lg border border-stone-800 font-barlow">
        Press &amp; Drag: 360° Free Orbit · Scroll: Zoom (Pauses on Unhold)
      </div>

      <CanvasErrorBoundary
        fallback={
          <WebGLFallback config={config} onRetry={() => setWebGlAvailable(true)} />
        }
      >
        <Suspense
          fallback={
            <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 space-y-3">
              <div className="w-8 h-8 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest text-slate-500">
                Building 3D Cabin Geometry...
              </p>
            </div>
          }
        >
          <Canvas
            shadows
            camera={{ position: [2.5, 2.0, 2.8], fov: 48, near: 0.1, far: 50 }}
            gl={{ antialias: true, alpha: true, preserveDrawingBuffer: true, localClippingEnabled: true }}
            className="w-full h-full cursor-grab active:cursor-grabbing"
          >
            {/* Architectural Studio Lighting */}
            <ambientLight intensity={0.65} />
            <directionalLight
              position={[4, 6, 4]}
              intensity={1.2}
              castShadow
              shadow-mapSize-width={1024}
              shadow-mapSize-height={1024}
              shadow-bias={-0.0001}
            />
            <directionalLight position={[-4, 3, -3]} intensity={0.4} color="#94a3b8" />
            <directionalLight position={[0, -2, 2]} intensity={0.2} color="#475569" />

            {/* Elevator 3D Assembly */}
            <ElevatorModel config={config} showDimensions={showDimensions} />

            {/* Soft Floor Shadow Contact */}
            <ContactShadows
              position={[0, -0.04, 0]}
              opacity={0.6}
              scale={6}
              blur={1.8}
              far={2}
            />

            {/* Orbit & Camera Controller */}
            <OrbitControls
              ref={controlsRef}
              makeDefault
              enableDamping
              dampingFactor={0.08}
              minDistance={0.2}
              maxDistance={9.5}
              minPolarAngle={0.02}
              maxPolarAngle={Math.PI - 0.05}
            />
            <CameraController
              preset={currentPreset}
              dimensions={config.dimensions}
              controlsRef={controlsRef}
              transitionTrigger={transitionTrigger}
            />
          </Canvas>
        </Suspense>
      </CanvasErrorBoundary>
    </div>
  );
};
