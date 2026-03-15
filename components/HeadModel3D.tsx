import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, Sphere } from '@react-three/drei';
import * as THREE from 'three';
import { View, StyleSheet, Text as RNText } from 'react-native';
import { Colors, Severity } from '../constants/theme';
import type { HeadRegion, PainLocation } from '../types';
import { HEAD_REGION_LABELS } from '../types';

interface RegionDef {
  region: HeadRegion;
  position: [number, number, number];
  scale: number;
}

const HEAD_REGIONS: RegionDef[] = [
  { region: 'forehead', position: [0, 0.55, 0.85], scale: 0.18 },
  { region: 'temple_left', position: [-0.85, 0.25, 0.45], scale: 0.15 },
  { region: 'temple_right', position: [0.85, 0.25, 0.45], scale: 0.15 },
  { region: 'crown', position: [0, 0.95, 0], scale: 0.2 },
  { region: 'back_of_head', position: [0, 0.3, -0.85], scale: 0.2 },
  { region: 'left_eye', position: [-0.35, 0.25, 0.88], scale: 0.12 },
  { region: 'right_eye', position: [0.35, 0.25, 0.88], scale: 0.12 },
  { region: 'nose_bridge', position: [0, 0.15, 0.95], scale: 0.1 },
  { region: 'jaw_left', position: [-0.6, -0.55, 0.5], scale: 0.14 },
  { region: 'jaw_right', position: [0.6, -0.55, 0.5], scale: 0.14 },
  { region: 'neck', position: [0, -0.9, -0.2], scale: 0.18 },
];

interface HeadModel3DProps {
  selectedLocations: PainLocation[];
  onToggleRegion: (region: HeadRegion) => void;
  readonly?: boolean;
}

function HeadMesh() {
  const meshRef = useRef<THREE.Mesh>(null);

  return (
    <group>
      {/* Main head - elongated sphere */}
      <Sphere ref={meshRef} args={[1, 64, 64]} scale={[0.9, 1.05, 0.95]}>
        <meshStandardMaterial
          color="#c4a882"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.6}
        />
      </Sphere>
      {/* Jaw area */}
      <Sphere
        args={[0.5, 32, 32]}
        position={[0, -0.6, 0.15]}
        scale={[1.2, 0.8, 1]}
      >
        <meshStandardMaterial
          color="#c4a882"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.5}
        />
      </Sphere>
      {/* Neck */}
      <mesh position={[0, -1.0, -0.1]}>
        <cylinderGeometry args={[0.35, 0.4, 0.6, 32]} />
        <meshStandardMaterial
          color="#c4a882"
          roughness={0.7}
          metalness={0.1}
          transparent
          opacity={0.4}
        />
      </mesh>
    </group>
  );
}

interface RegionMarkerProps {
  def: RegionDef;
  selected: PainLocation | undefined;
  onToggle: (region: HeadRegion) => void;
  readonly: boolean;
}

function RegionMarker({ def, selected, onToggle, readonly }: RegionMarkerProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = React.useState(false);

  const color = useMemo(() => {
    if (selected) return Severity.getColor(selected.intensity);
    if (hovered) return Colors.primaryLight;
    return '#ffffff';
  }, [selected, hovered]);

  const opacity = useMemo(() => {
    if (selected) return 0.85;
    if (hovered) return 0.5;
    return 0.25;
  }, [selected, hovered]);

  const scale = useMemo(() => {
    const base = def.scale;
    if (selected) return base * 1.3;
    if (hovered) return base * 1.15;
    return base;
  }, [def.scale, selected, hovered]);

  useFrame(() => {
    if (meshRef.current && selected) {
      meshRef.current.scale.setScalar(
        scale + Math.sin(Date.now() * 0.003) * 0.02
      );
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    if (readonly) return;
    e.stopPropagation();
    onToggle(def.region);
  };

  return (
    <Sphere
      ref={meshRef}
      args={[1, 16, 16]}
      position={def.position}
      scale={scale}
      onClick={handleClick}
      onPointerOver={() => !readonly && setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <meshStandardMaterial
        color={color}
        transparent
        opacity={opacity}
        emissive={selected ? color : '#000000'}
        emissiveIntensity={selected ? 0.4 : 0}
      />
    </Sphere>
  );
}

function Scene({ selectedLocations, onToggleRegion, readonly }: HeadModel3DProps) {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, 3, -5]} intensity={0.3} />
      <pointLight position={[0, 0, 3]} intensity={0.4} />

      <HeadMesh />

      {HEAD_REGIONS.map((def) => {
        const selected = selectedLocations.find((l) => l.region === def.region);
        return (
          <RegionMarker
            key={def.region}
            def={def}
            selected={selected}
            onToggle={onToggleRegion}
            readonly={readonly ?? false}
          />
        );
      })}

      <OrbitControls
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={6}
        autoRotate={false}
        target={[0, 0, 0]}
      />
    </>
  );
}

export default function HeadModel3D({
  selectedLocations,
  onToggleRegion,
  readonly = false,
}: HeadModel3DProps) {
  return (
    <View style={styles.container}>
      <Canvas
        camera={{ position: [0, 0, 3.5], fov: 45 }}
        style={styles.canvas}
      >
        <Scene
          selectedLocations={selectedLocations}
          onToggleRegion={onToggleRegion}
          readonly={readonly}
        />
      </Canvas>
      <View style={styles.legend}>
        {selectedLocations.length === 0 ? (
          <RNText style={styles.hint}>
            {readonly ? 'No pain locations recorded' : 'Tap regions on the head to mark pain locations'}
          </RNText>
        ) : (
          <View style={styles.selectedList}>
            {selectedLocations.map((loc) => (
              <View
                key={loc.region}
                style={[
                  styles.selectedBadge,
                  { backgroundColor: Severity.getColor(loc.intensity) + '33' },
                ]}
              >
                <View
                  style={[
                    styles.dot,
                    { backgroundColor: Severity.getColor(loc.intensity) },
                  ]}
                />
                <RNText style={styles.badgeText}>
                  {HEAD_REGION_LABELS[loc.region]}
                </RNText>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    aspectRatio: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: Colors.surface,
  },
  canvas: {
    flex: 1,
  },
  legend: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    backgroundColor: 'rgba(15, 15, 35, 0.85)',
  },
  hint: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: 'center',
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    justifyContent: 'center',
  },
  selectedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 5,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  badgeText: {
    color: Colors.text,
    fontSize: 12,
  },
});
