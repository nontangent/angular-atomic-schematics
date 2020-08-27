import {
	Rule,
	Tree,
	SchematicContext,
	apply,
	chain,
	externalSchematic,
	url,
	applyTemplates,
	mergeWith,
	move
} from '@angular-devkit/schematics';
import { normalize } from 'path';
import * as strings from '@angular-devkit/core/src/utils/strings';
import { parseName } from '@schematics/angular/utility/parse-name';
import { 
	validateHtmlSelector, 
	validateName 
} from '@schematics/angular/utility/validation';
import { 
	buildDefaultPath,
 	getWorkspace 
} from '@schematics/angular/utility/workspace';
import * as format from 'string-template';
import { join } from 'path';

export default function atomicComponent(options: any): Rule {
	return async (host: Tree, _: SchematicContext) => {
		const workspace = await getWorkspace(host);
		const project = workspace.projects.get(options.project);

		if (options.path === undefined && project) {
			options.path = buildDefaultPath(project)
		}

    const parsedPath = parseName(options.path, options.name);
		options.name = parsedPath.name;
		options.path = parsedPath.path;

		const styleHeader = format(options.styleHeader, {
			name: options.name,
			type: options.type
		});

		return chain([
			externalSchematic(
				'@schematics/angular',
				'module',
				{
					name: options.name,
					path: options.path,
					project: options.project,
				}
			),
			externalSchematic(
				'angular-host-css-variable',
				'component',
				{
					...options,
					styleHeader: styleHeader,
					export: true,	
				}
			),
			mergeWith(
				apply(url('./files'), [
					applyTemplates({
						...strings,
						name: options.name
					}),
					move(options.path)
				]),
			),
			exportBarrel({...options})
		]);

	} 
}

export function exportBarrel(options: any){
	return (tree: Tree) => {
	  const indexTsPath = join(options.path, 'index.ts');
	  const line = `export * from './${strings.dasherize(options.name)}';`;
	
	  if (tree.exists(indexTsPath)) {
	    let src = tree.read(indexTsPath)!.toString('utf-8');
			src = src.endsWith('\n') ? src.slice(0, src.length-1) : src;
			if (src.indexOf(line) == -1) {
				tree.overwrite(indexTsPath, src + '\n' + line);
			}
	  } else {
	    tree.create(indexTsPath, line);
	  }
	
	  return tree;
	}
}

export function atom(options: any): Rule {
	return atomicComponent({
		...options, 
		type: 'atom', 
		prefix: options.prefix || 'atoms'
	});
}

export function molecule(options: any): Rule {
	return atomicComponent({
		...options, 
		type: 'molecule',
		prefix: options.prefix || 'molecules'
	});
}

export function organism(options: any): Rule {
	return atomicComponent({
		...options, 
		type: 'organism',
		prefix: options.prefix || 'organisms'
	});
}

export function template(options: any): Rule {
	return atomicComponent({
		...options, 
		type: 'template',
		prefix: options.prefix || 'templates'
	});
}

