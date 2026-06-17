/**
 * Maintenance mode — NEXT_PUBLIC_MAINTENANCE_MODE or MAINTENANCE_MODE
 */

export const MAINTENANCE_PATH = '/maintenance';

const parseEnvFlag = (value: string | undefined): boolean => {
  if (!value) return false;
  const normalized = value.trim().toLowerCase();
  return normalized === 'true' || normalized === '1' || normalized === 'yes';
};

export const isMaintenanceMode = (): boolean =>
  parseEnvFlag(process.env.NEXT_PUBLIC_MAINTENANCE_MODE) ||
  parseEnvFlag(process.env.MAINTENANCE_MODE);
