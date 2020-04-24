import { Rule } from '@angular-devkit/schematics';
import { createAtomicComponent } from '../utils';

export function molecule(options: any): Rule {
  return createAtomicComponent(options);
}
