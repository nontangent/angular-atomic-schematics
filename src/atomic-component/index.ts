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
import * as strings from '@angular-devkit/core/src/utils/strings';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
	buildDefaultPath,
	getWorkspace
} from '@schematics/angular/utility/workspace';
import * as format from 'string-template';
import { join } from 'path';
import {
	insertImport,
	getSourceNodes,
	InsertChange
  } from '@nrwl/workspace/src/utils/ast-utils';
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
		// const routingModulePath = 'src/app/app-routing.module.ts';

		// const route = `{
		// 	path: 'test',
		// 	loadChildren: '() => import('./test/test.module').then(m => m.TestModule)'
		// }`;

		// const src = host.read(routingModulePath)?.toString('utf-8');
		// const nodes = getSourceNodes(src);
		// const routeNodes = nodes.filter((n: ts.Node) => {
		// 	if (n.kind === ts.SyntaxKind.VariableDeclaration) {
		// 		if (
		// 			n.getChildren().findIndex(c => {
		// 				return (
		// 					c.kind === ts.SyntaxKind.Identifier && c.getText() === 'routes'
		// 				);
		// 			}) !== -1
		// 		) {
		// 			return true;
		// 		}
		// 	}
		// 	return false;
		// }).map((n: ts.Node) => {
		// 	const arrNodes = n
		// 		.getChildren()
		// 		.filter(c => (c.kind = ts.SyntaxKind.ArrayLiteralExpression));
		// 	return arrNodes[arrNodes.length - 1];
		// });

		// if (routeNodes.length === 1) {
		// 	const navigation: ts.ArrayLiteralExpression = routeNodes[0] as ts.ArrayLiteralExpression;
		// 	const fullText = navigation.getFullText();
		// 	let toInsert = '';
		// 	if (navigation.elements.length > 0) {
		// 		if (fullText.match(/\r\n/)) {
		// 			toInsert = `${fullText.match(/\r\n(\r?)\s*/)[0]}${route},`;
		// 		} else {
		// 			toInsert = `${route},`;
		// 		}
		// 	} else {
		// 		toInsert = `${route}`;
		// 	}
		// 	const recorder = host.beginUpdate(routingModulePath);
		// 	recorder.insertRight(navigation.getStart() + 1, toInsert);
		// 	host.commitUpdate(recorder);
		// }

		// const componentChange = insertImport(
		// 	src,
		// 	routingModulePath,
		// 	`${containerComponent}`,
		// 	`./${strings.dasherize(options.feature)}-container/${strings.dasherize(
		// 		options.feature
		// 	)}-container.component`,
		// 	false
		// );
		// if (componentChange instanceof InsertChange) {
		// 	recorder.insertLeft(
		// 		(componentChange as InsertChange).pos,
		// 		(componentChange as InsertChange).toAdd
		// 	);
		// }
		

		return host;
	};
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

		const fullPath = 'pages/test2';
		let curPath = '';
		for (let path of fullPath.split('/')) {
			curPath += path
			if (!host.exists(`${curPath}/${path}.module`)) {
				// pages.module作成
			}
			// pages-routing.moduleのroutesにpathを追加

		}
		
		// pages.moduleがあるかを確認し、なければファイル追加
		// atomicComponentを作成する上の階層のpages.moduleにrouteを追加
		// atomicComponentを作成

	}
}
