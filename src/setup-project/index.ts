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
	setDefaultCollectionToAngularJson
} from '../utilities';

export default function(options: any): Rule {
	return chain([
		setUpAngularJson({...options}),
		addStyleFiles({...options})
	]);
}

export function setUpAngularJson(options: any) {
	return (host: Tree, context: SchematicContext) => {
		const packageName = 'angular-atomic-schematics';

		setDefaultCollectionToAngularJson(
			host, 
			packageName			
		);

		['atom', 'molecule', 'organism', 'template'].forEach((component) => {
			addSchematicToAngularJson(
				host, 
				options.project, 
				packageName, 
				component, 
				{'path': `${options.componentsDir}/${component}s`}
			);
		});

		addStyleIncludePathToAngularJson(host, options.project, 'src/styles');

	};
}


export function addStyleFiles(options: any) {
	return (host: Tree, context: SchematicContext) => {
		return mergeWith(apply(url('./files'), [
			template({}),
			move(options.stylesDir)
		]));
	}
}
