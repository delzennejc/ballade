import * as migration_20260225_111545 from './20260225_111545';

export const migrations = [
  {
    up: migration_20260225_111545.up,
    down: migration_20260225_111545.down,
    name: '20260225_111545'
  },
];
