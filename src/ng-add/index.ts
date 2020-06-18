import {
  chain,
  Rule,
  schematic,
  SchematicContext,
  Tree
} from '@angular-devkit/schematics';
import { 
	NodePackageInstallTask, 
	RunSchematicTask 
} from '@angular-devkit/schematics/tasks';
import { 
	addPackageToPackageJson,
} from '../utilities';

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
		const packageName = 'angular-atomic-schematics';

		addPackageToPackageJson(
			host, 
			packageName, 
			'^0.0.0',
			'devDependencies'
		);
		
		const installTaskId = context.addTask(new NodePackageInstallTask());
		context.addTask(new RunSchematicTask('ng-add-setup-project', {...options}), [installTaskId])
  }
}
