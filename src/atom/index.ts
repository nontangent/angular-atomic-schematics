import { Rule } from '@angular-devkit/schematics';
import { createAtomicComponent } from '../utils';

export function atom(options: any): Rule {
  return createAtomicComponent(options);
}
