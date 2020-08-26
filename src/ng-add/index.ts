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

		// 必要なパッケージの追加
		addPackageToPackageJson(
			host, 
			packageName, 
			'0.1.x',
			'devDependencies'
		);

		addPackageToPackageJson(
			host,
			'angular-host-css-variable',
			'0.2.x',
			'devDependencies'
		);

		// angular-host-css-variableのインストール
		const runSchematicTask = context.addTask(new RunSchematicTask(
			'angular-host-css-variable',
			'ng-add',
			{ project: options.project }
		));
		
		// Set Up Angular Atomic Schematics
		const installTaskId = context.addTask(new NodePackageInstallTask(), [runSchematicTask]);
		context.addTask(new RunSchematicTask('setup-project', {...options}), [installTaskId])

		return host
  }
}
