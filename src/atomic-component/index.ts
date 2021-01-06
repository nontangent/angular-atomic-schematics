import { 
	Rule, Tree, SchematicContext, apply, chain, externalSchematic, url,
	applyTemplates, mergeWith, move, noop, schematic
} from '@angular-devkit/schematics';
import * as strings from '@angular-devkit/core/src/utils/strings';
import { parseName } from '@schematics/angular/utility/parse-name';
import { buildDefaultPath, getWorkspace } from '@schematics/angular/utility/workspace';
import * as format from 'string-template';
import { join } from 'path';
import { getSourceNodes } from '@nrwl/workspace/src/utils/ast-utils';
import * as ts from 'typescript';

export default function atomicComponent(options: any): Rule {
	return async (host: Tree, _: SchematicContext) => {
		const workspace = await getWorkspace(host);
		const project = workspace.projects.get(options.project);

		if (options.path === undefined && project) {
			options.path = buildDefaultPath(project);
		}

		const parsedPath = parseName(options.path, options.name);
		options.name = parsedPath.name;
		options.path = parsedPath.path;

		const styleHeader = format(options.styleHeader, {
			name: options.name,
			type: options.type
		});

		return chain([
			externalSchematic('@schematics/angular', 'module', {
				name: options.name,
				path: options.path,
				project: options.project
			}),
			externalSchematic('angular-host-css-variable', 'component', {
				...options,
				styleHeader: styleHeader,
				export: true
			}),
			mergeWith(
				apply(url('./files'), [
					applyTemplates({
						...strings,
						name: options.name
					}),
					move(options.path)
				])
			),
			exportBarrel({ ...options })
		]);
	};
}

export function exportBarrel(options: any) {
	return (tree: Tree) => {
		const indexTsPath = join(options.path, 'index.ts');
		const line = `export * from './${strings.dasherize(options.name)}';`;

		if (tree.exists(indexTsPath)) {
			let src = tree.read(indexTsPath)!.toString('utf-8');
			src = src.endsWith('\n') ? src.slice(0, src.length - 1) : src;
			if (src.indexOf(line) == -1) {
				tree.overwrite(indexTsPath, src + '\n' + line);
			}
		} else {
			tree.create(indexTsPath, line);
		}

		return tree;
	};
}

export function addPathToRoutes(options: any) {
	return (host: Tree) => {
		console.log('routingModulePath:', options.routingModulePath);
		const src = ts.createSourceFile(
			options.routingModulePath,
			host.read(options.routingModulePath)!.toString('utf-8'),
			ts.ScriptTarget.Latest,
			true
		);

		const nodes = getSourceNodes(src);
		const routeNodes = nodes.filter((n: ts.Node) => {
			if (n.kind === ts.SyntaxKind.VariableDeclaration) {
				if (
					n.getChildren().findIndex(c => {
						return (
							c.kind === ts.SyntaxKind.Identifier && c.getText() === 'routes'
						);
					}) !== -1
				) {
					return true;
				}
			}
			return false;
		}).map((n: ts.Node) => {
			const arrNodes = n
				.getChildren()
				.filter(c => (c.kind === ts.SyntaxKind.ArrayLiteralExpression));
			return arrNodes[arrNodes.length - 1];
		});

		if (routeNodes.length === 1) {
			const n: ts.ArrayLiteralExpression = routeNodes[0] as ts.ArrayLiteralExpression;
			let toInsert = '';
			if (n.elements.length > 0 && !options.removeOtherRoutes) {
				toInsert = `${options.route},`;
			} else {
				toInsert = `${options.route}`;
			}
			const recorder = host.beginUpdate(options.routingModulePath);
			// if (options.removeOtherRoutes) {
			// 	recorder.remove(n.getStart() + 1, n.getEnd() - n.getFullStart() - 4);
			// }
			recorder.insertRight(n.getStart() + 1, toInsert);
			host.commitUpdate(recorder);
		}		

		return host;
	};
}

function buildPagesModuleRoute(name): string {
	return `
	{
		path: '${name}',
		loadChildren: () => import('./${
			strings.dasherize(name)
		}/${
			strings.dasherize(name)
		}.module').then(m => m.${
			strings.classify(name)
		}Module)
	}`;
}

function buildPageModuleRoute(name): string {
	return `
	{
		path: '',
		component: ${strings.classify(name)}Page,
		// loadChildren: () => import('./pages/pages.module').then(m => m.PagesModule)
	}`;
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

export function page(options: any): Rule {
	return async (host: Tree, _: SchematicContext) => {
		// pathに不足しているpagesディレクトリを補う
		const workspace = await getWorkspace(host);
		const project = workspace.projects.get(options.project);

		if (options.path === undefined && project) {
			options.path = buildDefaultPath(project);
		}

		const parsedPath = parseName(options.path, options.name);
		options.name = parsedPath.name;
		options.path = parsedPath.path;

		options.type = 'page';

		const styleHeader = format(options.styleHeader, {
			name: options.name,
			type: options.type
		});

		const fullPath = `${options.path}/${options.name}`;

		const paths = fullPath.split('/');
		// paths.shift();
		paths.pop();
		const pagesName = paths.pop();
		const pagesPath = paths.join('/');

		console.log(`${pagesPath}/${pagesName}.module.ts`);
		console.log(host.exists(`${pagesPath}/${pagesName}.module.ts`));

		return chain([
			host.exists(`${pagesPath}/${pagesName}/${pagesName}.module.ts`) ? 
			noop() : externalSchematic('angular-atomic-schematics', 'pages', {
				name: pagesName,
				path: pagesPath,
				project: options.project
			}),
			addPathToRoutes({
				...options,
				routingModulePath: `${pagesPath}/${pagesName}/${pagesName}.module.ts`,
				route: buildPagesModuleRoute(options.name),
				removeOtherRoutes: false

			}),
			externalSchematic('angular-atomic-schematics', 'pages', {
				name: options.name,
				path: options.path,
				project: options.project
			}),
			// externalSchematic('@schematics/angular', 'module', {
			// 	name: options.name,
			// 	path: options.path,
			// 	project: options.project
			// }),
			externalSchematic('angular-host-css-variable', 'component', {
				...options,
				styleHeader: styleHeader,
				export: true
			}),
			addPathToRoutes({
				...options,
				routingModulePath: `${options.path}/${options.name}/${options.name}.module.ts`,
				route: buildPageModuleRoute(options.name),
				removeOtherRoutes: true
			}),
		]);


		// let curPath = '';
		// for (let path of fullPath.split('/')) {
		// 	curPath += path
		// 	if (!host.exists(`${curPath}/${path}.module`)) {
		// 		// pages.module作成
		// 	}
		// 	// pages-routing.moduleのroutesにpathを追加

		// }
		
		// // pages.moduleがあるかを確認し、なければファイル追加
		// // atomicComponentを作成する上の階層のpages.moduleにrouteを追加
		// // atomicComponentを作成

	}
}
