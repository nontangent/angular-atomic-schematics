# Angular Atomic Schematics

This is repository for a Angular Atomic Schematics.  
Don't touch this repository because I'm adjusting now.  


## Install
You can install this package with `ng add`.

### ng add

```bash
$ ng add angular-atomic-schematics
```

## How to Use
- `ng g atom <name>` Creating Atom Component. 
- `ng g molecule <name>` Creating Molecule Component.
- `ng g organism <name>` Creating Organism Component.
- `ng g template <name>` Creating Template Component.

## Host CSS Variable
You can use **Host CSS Variable** `host-variavle()` or `hvar()`.  
This is capcelized CSS Variavle that is not accessed by other Component.

### Example
``hoge.atom.scss
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

```hogehoge.molecule.scss
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
