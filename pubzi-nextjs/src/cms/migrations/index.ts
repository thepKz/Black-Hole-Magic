import * as migration_20261006_050829_initial from './20261006_050829_initial';

export const migrations = [
  {
    up: migration_20261006_050829_initial.up,
    down: migration_20261006_050829_initial.down,
    name: '20261006_050829_initial'
  },
];
