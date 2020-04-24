import {
  SchematicTestRunner,
  UnitTestTree
} from '@angular-devkit/schematics/testing';
import * as path from 'path';

const collectionPath = path.join(__dirname, '../collection.json');

describe('molecule', () => {
  const runner = new SchematicTestRunner('schematics', collectionPath);

  const defaultOptions = {
    project: 'bar',
    target: 'build',
    configuration: 'production',
    title: 'Fake Title',
    name: 'shared/components/molecules/test'
  };

  let appTree: UnitTestTree;

  // tslint:disable-next-line:no-any
  const workspaceOptions: any = {
    name: 'workspace',
    newProjectRoot: 'projects',
    version: '6.0.0'
  };

  // tslint:disable-next-line:no-any
  const appOptions: any = {
    name: 'bar',
    inlineStyle: false,
    inlineTemplate: false,
    routing: false,
    style: 'css',
    skipTests: false
  };

  beforeEach(async () => {
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'workspace',
        workspaceOptions
      )
      .toPromise();
    appTree = await runner
      .runExternalSchematicAsync(
        '@schematics/angular',
        'application',
        appOptions,
        appTree
      )
      .toPromise();

    runner
      .runSchematicAsync(
        'molecule',
        {
          ...defaultOptions,
          name: 'shared/components/molecules/initial'
        },
        appTree
      )
      .toPromise()
      .then(tree => {});
  });

  it('create first molecule', done => {
    runner
      .runSchematicAsync('molecule', defaultOptions, appTree)
      .toPromise()
      .then(tree => {
        // console.log('tree:', tree.files);
        const content = tree.readContent(
          'projects/bar/src/app/shared/components/moleculeic/index.ts'
        );
        // content.toMatch(/<link rel="manifest" href="manifest.webmanifest">/);
        // console.log('content', content);

        done();
      }, done.fail);
  });

  it('create second molecule.', done => {
    runner
      .runSchematicAsync(
        'molecule',
        {
          ...defaultOptions,
          name: 'shared/components/molecules/test2'
        },
        appTree
      )
      .toPromise()
      .then(tree => {
        // console.log('tree:', tree.files);
        const content = tree.readContent(
          'projects/bar/src/app/shared/components/molecules/index.ts'
        );
        // content.toMatch(/<link rel="manifest" href="manifest.webmanifest">/);
        // console.log('content:', content);

        done();
      }, done.fail);
  });
});
