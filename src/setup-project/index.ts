import {
	chain, 
	Rule, 
	SchematicContext, 
	Tree, 
	template, 
	move, 
	url, 
	apply,
	mergeWith
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';
import {
	addSchematicToAngularJson,
	addStyleIncludePathToAngularJson,
	setDefaultCollectionToAngularJson,
	addPathsToTsConfig
} from '../utilities';

export default function(options: any): Rule {
	return chain([
		// angular.jsonの更新
		setUpAngularJson({...options}),
		// Angular Commons Stylesの追加
		addStyleFiles({...options}),
		setUpTsConfig({...options})
	]);
}

export function setUpAngularJson(options: any) {
	return (host: Tree, context: SchematicContext) => {
		const packageName = 'angular-atomic-schematics';

		// デフォルトのSchematicsをAngular Atomic Schematicsに変更
		setDefaultCollectionToAngularJson(
			host, 
			packageName			
		);

		// 各Atomic ComponentのSchematicsの設定を追加
		['atom', 'molecule', 'organism', 'template'].forEach((component) => {
			addSchematicToAngularJson(
				host, 
				options.project, 
				packageName, 
				component, 
				{'path': `${options.componentsDir}/${component}s`}
			);
		});

		// Atomic Common Stylesにパスを通す
		addStyleIncludePathToAngularJson(host, options.project, options.stylesDir);

		return host;
	};
}


export function addStyleFiles(options: any) {
	return (host: Tree, context: SchematicContext) => {
		if (host.exists(`${options.stylesDir}/atomic`)) {
			return host
		}
		
		return mergeWith(apply(url('./files'), [
			template({}),
			move(options.stylesDir)
		]));
	}
}

export function setUpTsConfig(options: any) {
	return (host: Tree, context: SchematicContext) => {

		// ts.configにパスを通す
		addPathsToTsConfig(host, options.componentsDir);

		return host;
	}
}
