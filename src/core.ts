import * as ts from 'typescript'

function getCompilerOptions(rootDir: string, configName = 'tsconfig.json') {
  const parseConfigHost: ts.ParseConfigHost = {
    fileExists: ts.sys.fileExists,
    readFile: ts.sys.readFile,
    readDirectory: ts.sys.readDirectory,
    useCaseSensitiveFileNames: true,
  }

  const configFileName = ts.findConfigFile(
    rootDir,
    ts.sys.fileExists,
    configName,
  )

  if (!configFileName) return

  const configFile = ts.readConfigFile(configFileName, ts.sys.readFile)
  const compilerOptions = ts.parseJsonConfigFileContent(
    configFile.config,
    parseConfigHost,
    rootDir,
  )

  return compilerOptions
}

function getTargetSource(program: ts.Program) {
  const result = program.getSourceFiles()
  return result
}

function collectAnyType(
  rootNames: Readonly<string>[],
  options: ts.CompilerOptions,
) {
  const program = ts.createProgram({
    options,
    rootNames,
  })
  console.log(getTargetSource(program))
}

function main() {
  const conf = getCompilerOptions('../')
  if (!conf) return
  collectAnyType(['../example/code.ts'], conf.options)
}

main()
