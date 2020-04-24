import {
	chain, Rule, SchematicContext, Tree, template, move, url, apply,
	mergeWith
} from '@angular-devkit/schematics';
import { getWorkspace } from '@schematics/angular/utility/config';


export default function(options: any): Rule {
	return chain([
		addStyleFiles(options)
	]);
}

export function addStyleFiles(options: any) {
	return (host: Tree, context: SchematicContext) => {
		/* const workspace = getWorkspace(host); */
		/* const project = getProjectFromWorkspace(workspace, options.project); */
	
		console.log('stylesDir:', options.stylesDir);
		/* return host; */
		return mergeWith(apply(url('./files'), [
			template({}),
			move(options.stylesDir)
		]));
	}
}
