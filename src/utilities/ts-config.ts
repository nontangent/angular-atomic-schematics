import { Tree } from '@angular-devkit/schematics';
import { parse } from "jsonc-parser";

export function addPathsToTsConfig(
	host: Tree,
	componentsDir: string
): Tree {
	let targetFile;
	
	if (host.exists('tsconfig.base.json')) {
		targetFile = 'tsconfig.base.json';
	} else if (host.exists('tsconfig.json')) {
		targetFile = 'tsconfig.json';
	}

	if (targetFile) {
		const src = host.read(targetFile)!.toString('utf-8');
		const json = parse(src);

		json.compilerOptions.paths = json.compilerOptions?.paths || {};
		json.compilerOptions.paths = {
			...json.compilerOptions.paths,
			"@components": [
				componentsDir
			],
			"@components/*": [
				`${componentsDir}/*`
			]
		};

		host.overwrite(targetFile, JSON.stringify(json, null, 2));
	}

	return host;
}

