const vueCompiler = require('vue-template-compiler')
const convertSourceMap = require('convert-source-map')
const compileTemplate = require('./template-compiler')
const generateSourceMap = require('./generate-source-map')
const addTemplateMapping = require('./add-template-mapping')
const compileBabel = require('./compilers/babel-compiler')
const compileTypescript = require('./compilers/typescript-compiler')
const compileCoffeeScript = require('./compilers/coffee-compiler')

const splitRE = /\r?\n/g

function processScript (scriptPart) {
  if (/^typescript|tsx?$/.test(scriptPart.lang)) {
    return compileTypescript(scriptPart.content)
  }

  if (scriptPart.lang === 'coffee' || scriptPart.lang === 'coffeescript') {
    return compileCoffeeScript(scriptPart.content)
  }

  return compileBabel(scriptPart.content)
}

module.exports = function (src, path) {
  var parts = vueCompiler.parseComponent(src, { pad: true })

  const result = processScript(parts.script)
  const script = result.code
  const inputMap = result.sourceMap

  const map = generateSourceMap(script, '', path, src, inputMap)
  let output = ';(function(){\n' + script + '\n})()\n' +
    'if (module.exports.__esModule) module.exports = module.exports.default\n' +
    'var __vue__options__ = (typeof module.exports === "function"' +
    '? module.exports.options' +
    ': module.exports)\n'

  if (parts.template) {
    const renderFunctions = compileTemplate(parts.template)

    output += '__vue__options__.render = ' + renderFunctions.render + '\n' +
      '__vue__options__.staticRenderFns = ' + renderFunctions.staticRenderFns + '\n'

    if (map) {
      const beforeLines = output.split(splitRE).length
      addTemplateMapping(script, parts, output, map, beforeLines)
    }
  }

  if (map) {
    output += '\n' + convertSourceMap.fromJSON(map.toString()).toComment()
  }

  return output
}
