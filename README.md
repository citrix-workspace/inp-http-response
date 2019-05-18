[![GitHub license](https://img.shields.io/github/license/Naereen/StrapDown.js.svg)](https://github.com/leojaimesson/typescript-package-boilerplate/blob/master/LICENSE.md)
[![nodejs badge](https://img.shields.io/badge/type-nodejs-green.svg)](https://nodejs.org/en/)
[![typescript badge](https://img.shields.io/badge/type-typescript-blue.svg)](https://www.typescriptlang.org/)

# typescript-package-boilerplate

Minimalistic boilerplate to start a package in Node Js with TypeScript for personal projects.

## Quick start

To start, just clone the repository with following commands:

- clone using `HTTP`

```sh
git clone https://github.com/leojaimesson/typescript-package-boilerplate.git
cd typescript-package-boilerplate
npm install
```

- clone using `SSH`

```sh
git clone git@github.com:leojaimesson/typescript-package-boilerplate.git
cd typescript-package-boilerplate
npm install
```

## Available scripts

+ `clean` - remove coverage data, Nyc cache and transpiled files,
+ `clean:modules` - remove and reinstall node_modules packages and package-lock.json,
+ `build` - transpile TypeScript to ES5,
+ `lint` - lint source files and tests,
+ `test` - run tests,
+ `test:watch` - interactive watch mode to automatically re-run tests
+ `test:coverage` - run tests and create code coverage reports
