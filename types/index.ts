export type HeadRegion =
  | 'forehead'
  | 'temple_left'
  | 'temple_right'
  | 'crown'
  | 'back_of_head'
  | 'left_eye'
  | 'right_eye'
  | 'nose_bridge'
  | 'jaw_left'
  | 'jaw_right'
  | 'neck';

export type HeadacheType =
  | 'tension'
  | 'migraine'
  | 'cluster'
  | 'sinus'
  | 'cervicogenic'
  | 'other';

export type Trigger =
  | 'stress'
  | 'lack_of_sleep'
  | 'dehydration'
  | 'screen_time'
  | 'weather'
  | 'alcohol'
  | 'caffeine'
  | 'skipped_meal'
  | 'bright_light'
  | 'loud_noise'
  | 'exercise'
  | 'hormonal'
  | 'other';

export interface PainLocation {
  region: HeadRegion;
  intensity: number;
}

export interface HeadacheLog {
  id: string;
  date: string;
  severity: number;
  type: HeadacheType;
  painLocations: PainLocation[];
  durationMinutes: number;
  notes: string;
  triggers: Trigger[];
  createdAt: string;
}

export const HEAD_REGION_LABELS: Record<HeadRegion, string> = {
  forehead: 'Forehead',
  temple_left: 'Left Temple',
  temple_right: 'Right Temple',
  crown: 'Crown',
  back_of_head: 'Back of Head',
  left_eye: 'Left Eye',
  right_eye: 'Right Eye',
  nose_bridge: 'Nose Bridge',
  jaw_left: 'Left Jaw',
  jaw_right: 'Right Jaw',
  neck: 'Neck',
};

export const HEADACHE_TYPE_LABELS: Record<HeadacheType, string> = {
  tension: 'Tension',
  migraine: 'Migraine',
  cluster: 'Cluster',
  sinus: 'Sinus',
  cervicogenic: 'Cervicogenic',
  other: 'Other',
};

export const TRIGGER_LABELS: Record<Trigger, string> = {
  stress: 'Stress',
  lack_of_sleep: 'Lack of Sleep',
  dehydration: 'Dehydration',
  screen_time: 'Screen Time',
  weather: 'Weather Change',
  alcohol: 'Alcohol',
  caffeine: 'Caffeine',
  skipped_meal: 'Skipped Meal',
  bright_light: 'Bright Light',
  loud_noise: 'Loud Noise',
  exercise: 'Exercise',
  hormonal: 'Hormonal',
  other: 'Other',
};
