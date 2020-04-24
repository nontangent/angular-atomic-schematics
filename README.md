# Angular Atomic Schematics

This is repository for a Angular Atomic Schematics.  
**DON'T TOUCH THIS REPOSITORY BECAUSE I'M ADJUSTING NOW.**  


## Install
You can install this package with `ng add`.

```bash
$ ng add angular-atomic-schematics
Skipping installation: Package already installed
? Where do you setup Angular Atomic Components? src/app/shared/components
? Where do you setup Angular Atomic Styles? src/styles
```

## How to Use
- `ng g atom <name>` create Atom in `<conponentsDir>/atoms/<name>`. 
- `ng g molecule <name>` create Molecule in `<componentsDir>/molecules/<name>`.
- `ng g organism <name>` create Organism in `<componentsDir>/organisms/<name>`.
- `ng g template <name>` create Template in `<componentsDir>/templates/<name>`.

`<componentsDir>` is configed when you run `ng add`.  
In above case, `<componentsDir>` is `src/app/shared/components`  


## Host CSS Variable
You can use **Host CSS Variable** `host-variavle()` or `hvar()`.  
This is capcelized CSS Variavle that is not accessed by other Component.

### Example
```scss
// hoge.atom.scss
$host: "--hoge-atom";
@import 'atomic/host-variable';
@import 'atomic/atom';

:host {
	@include atom();

	// Define Host CSS Variable.
	@include host-variable(--width, 1000px);
	// You can defined `hvar()` alias of `host-variable()`.
	@include hvar(--height, calc(var(--width) / 2));
}

:host {
	// You can call Host CSS Variable by `host-variable()` or `hvar()`. 
	width: host-variable(--width);
	height: hvar(--height);
}

```

and you can setting CSS Variable from Molecules.

```scss
// hogehoge.molecule.scss
$host: "--hogehoge-molecule";
@import 'atomic/host-variable';
@import 'atomic/molecule';

:host {
	@include molecule();
	@include hvar(--width, 300px);
}

:host {
	// `hoge` is selector of above Hoge Component.
	hoge {
		--width: calc(var(#{$host}--width) / 2);
	}
}

```
