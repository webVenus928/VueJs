# jest-vue

Jest Vue transformer with source map support

## Usage

```
npm install --save-dev jest-vue
```

## Setup

Note: this step is only required if you are using babel-jest with additional code preprocessors.

To define jest-vue as a transformer for your .vue code, map .vue files to the babel-jest module.

```
"transform": {
  ".*\\.(vue)$": "<rootDir>/node_modules/jest-vue"
},
```

## Examples

Example repositories testing Vue components with jest and jest-vue:

- [Avoriaz with Jest](https://github.com/eddyerburgh/avoriaz-jest-example)
- [Vue Test Utils with Jest](https://github.com/eddyerburgh/vue-test-utils-jest-example)
