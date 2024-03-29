# rsc-builder

[![NPM](https://img.shields.io/npm/v/@randajan/rsc-builder.svg)](https://www.npmjs.com/package/@randajan/rsc-builder) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

rsc-builder is a easy to use utility library for MikroTik script development with bundling capabilities.

## Installation

Install the library using npm:

```bash
npm install -d @randajan/rsc-builder
```

Or using yarn:

```bash
yarn add @randajan/rsc-builder
```

## Usage

```javascript
import RSCbuild from "@randajan/rsc-builder";

RSCbuild({
    live: true, // Enables a watcher that triggers a build 500ms after the last source code change
    version: "1.0.0", // General variable present in all scripts, specifying the version of the entire build
    entries:[ // List of input files from which builds will be created
        "template.rsc",
        "script.rsc",
    ],
    srcDir: "src", // Folder where source files are stored
    distDir: "dist", // Folder where builds are exported
});
```

## General Builder Functions

### Importing another script file

```plaintext
%%./path/to/subscript.rsc%%
```

### Importing another script file with escaping

```plaintext
##./path/to/subscript.rsc##
```

Useful when creating a file for script import like

```plaintext
/system script add source="##./path/to/subscript.rsc##";
```

### Variable

```plaintext
${version}
```

This example will be replaced with the value of the version provided to builder

## Extra function

You can also pass extra variables to the imported script file that will be used to fill variable in that file.

```plaintext
%%./path/to/subscript.rsc { "extra":"variable" }%%
```

or 

```plaintext
##./path/to/subscript.rsc { "foo":"bar" }##
```

Builder is expecting JSON formated variables.
If there is present variable ${foo} at the file subscript.rsc it will be replaced by builder with string "bar".


## Known bugs
- Builder is recursive, but there is no check for possible loops.
- Every file provided in entries will be stored directly at dist folder even if it's source is at subfolder.


## License

MIT © [randajan](https://github.com/randajan)