import { Rule } from '@angular-devkit/schematics';
import { createAtomicComponent } from '../utils';

export function template(options: any): Rule {
  return createAtomicComponent(options);
}
