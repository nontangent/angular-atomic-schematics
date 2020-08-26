import { Tree } from '@angular-devkit/schematics';

export function setDefaultCollectionToAngularJson(
  host: Tree,
  defaultCollection: string
): Tree {
  if (host.exists('angular.json')) {
    const sourceText = host.read('angular.json')!.toString('utf-8');
    const json = JSON.parse(sourceText);

    if (!json.cli) {
      json.cli = {};
    }

    json.cli.defaultCollection = defaultCollection;

    host.overwrite('angular.json', JSON.stringify(json, null, 2));
  }

  return host;
}

export function addSchematicToAngularJson(
	host: Tree,
	projectName: string,
	collection: string,
	schematic: string,
 	options: any,
): Tree {
	if (host.exists('angular.json')) {
		const sourceText = host.read('angular.json')!.toString('utf-8');
		const json = JSON.parse(sourceText)

		if (!json.projects[projectName].schematics) {
			json.projects[projectName].schematics = {}
		}

		json.projects[projectName].schematics[`${collection}:${schematic}`] = options;
		host.overwrite('angular.json', JSON.stringify(json, null, 2));
	}

	return host;
}

export function addStyleIncludePathToAngularJson(
	host: Tree,
	projectName: string,
	path: string
): Tree {
	if (host.exists('angular.json')) {
			const sourceText = host.read('angular.json')!.toString('utf-8');
			const json = JSON.parse(sourceText);

			const options = json.projects[projectName].architect.build.options;
			if (!options.stylePreprocessorOptions) {
				options.stylePreprocessorOptions = {};
			}

			if (!options.stylePreprocessorOptions.includePaths) {
				options.stylePreprocessorOptions.includePaths = [];
			}

			const includePaths = new Set(options.stylePreprocessorOptions.includePaths);
			includePaths.add(path);
			options.stylePreprocessorOptions.includePaths = Array.from(includePaths);

			json.projects[projectName]
			host.overwrite('angular.json', JSON.stringify(json, null, 2));

	}

	return host;

}