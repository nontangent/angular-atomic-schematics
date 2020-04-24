import { Rule } from '@angular-devkit/schematics';
import { createAtomicComponent } from '../utils';

export function organism(options: any): Rule {
  return createAtomicComponent(options);
}
