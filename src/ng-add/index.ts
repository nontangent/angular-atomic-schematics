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
} from './package-config';
import {
	setDefaultCollectionToAngularJson,
	addSchematicToAngularJson,
	addStyleIncludePathToAngularJson
} from './angular-config';

export default function(options: any): Rule {
  return (host: Tree, context: SchematicContext) => {
		const packageName = 'angular-atomic-schematics';

		addPackageToPackageJson(host, packageName, '0.0.0');
		
		const collection = `${packageName}/dist/collection.json`;
		setDefaultCollectionToAngularJson(host, collection);

		['atom', 'molecule', 'organism', 'template'].forEach((component) => {
			addSchematicToAngularJson(host, options.project, collection, component, {
				'path': `${options.componentsDir}/${component}s`
			});
		});

		addStyleIncludePathToAngularJson(host, options.project, 'src/styles');

		/* const installTaskId = context.addTask(new NodePackageInstallTask()); */

		/* context.addTask(new RunSchematicTask('ng-add-setup-project', options), [installTaskId]) */

		context.addTask(new RunSchematicTask('ng-add-setup-project', options));
  }
}
