import {
  Rule,
  Tree,
  SchematicContext,
  SchematicsException,
  apply,
  mergeWith,
  template,
  url,
  move,
  chain
} from '@angular-devkit/schematics';
import * as strings from '@angular-devkit/core/src/utils/strings';
import { parseName } from '@schematics/angular/utility/parse-name';
import {
  buildDefaultPath,
  getWorkspace
} from '@schematics/angular/utility/workspace';

export function createAtomicComponent(options: any) {
  return async (host: Tree, _: SchematicContext) => {
    const workspace = await getWorkspace(host);
    const project = workspace.projects.get(options.project as string);

    // console.debug('options.path:', options.path);
    // console.debug('options.name:', options.name);

    if (options.path === undefined && project) {
      options.path = buildDefaultPath(project);
    }

    const { name, path } = parseName(options.path as string, options.name);
    options = {
      ...options,
      name: name,
      path: path == options.path ? options.path : path
    };

    // console.debug('prpject:', project);
    // console.debug('path:', options.path);
    // console.debug('name:', options.name);

    const selector =
      options.selector ||
      buildSelector(options, (project && project.prefix) || '');
    // const selector = strings.dasherize(name);

    return chain([
      mergeWith(
        apply(url('./files'), [
          template({
            ...strings,
            name: name,
            selector: selector
          }),
          move(path)
        ])
      ),

      (tree: Tree) => mergeIndexTs(tree, path, name)
    ]);
  };
}

function buildSelector(options: any, projectPrefix: string) {
  let selector = strings.dasherize(options.name);
  if (options.prefix) {
    selector = `${options.prefix}-${selector}`;
  } else if (options.prefix === undefined && projectPrefix) {
    selector = `${projectPrefix}-${selector}`;
  }

  return selector;
}

export function mergeIndexTs(tree: Tree, path: string, name: string) {
  const indexTsPath = `${path}/index.ts`;
  const exportLine = getExportLine(name);

  if (tree.exists(indexTsPath)) {
    const text = tree.read(indexTsPath);
    if (text === null) {
      throw new SchematicsException(`File ${indexTsPath} does not exist.`);
    }

    const sourceText = text.toString('utf-8');
    tree.overwrite(indexTsPath, sourceText + '\n' + exportLine);
  } else {
    tree.create(indexTsPath, exportLine);
  }

  return tree;
}

function getExportLine(name: string): string {
  return `export { ${getModuleName(name)} } from './${strings.dasherize(
    name
  )}';`;
}

export function getModuleName(name: string): string {
  return `${strings.classify(name)}Module`;
}
