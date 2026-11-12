import { ElevatorConfiguration } from '../types/elevator';
import { INITIAL_CONFIGURATION } from '../data/presets';

const STORAGE_KEY = 'design_your_elevator_v1';

export const loadStoredConfiguration = (): ElevatorConfiguration => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_CONFIGURATION };
    const parsed = JSON.parse(raw);
    return {
      ...INITIAL_CONFIGURATION,
      ...parsed,
      dimensions: {
        ...INITIAL_CONFIGURATION.dimensions,
        ...(parsed.dimensions || {}),
      },
      walls: {
        ...INITIAL_CONFIGURATION.walls,
        ...(parsed.walls || {}),
      },
    };
  } catch (err) {
    console.warn('Could not restore stored elevator configuration:', err);
    return { ...INITIAL_CONFIGURATION };
  }
};

export const saveStoredConfiguration = (config: ElevatorConfiguration): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
  } catch (err) {
    console.warn('Could not persist elevator configuration:', err);
  }
};

export const clearStoredConfiguration = (): void => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Could not clear elevator configuration:', err);
  }
};
