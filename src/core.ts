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

function collectAnyType(
  rootNames: Readonly<string>[],
  options: ts.CompilerOptions,
) {
  const program = ts.createProgram({
    rootNames,
    options,
  })

  const checker = program.getTypeChecker()
  const source = program.getSourceFile('test.ts')
  if (!source) return
  const result: unknown[] = []
  ts.forEachChild(source, (node) => {
    const type = checker.getTypeAtLocation(node)
    const matcher = /any/
    if (checker.typeToString(type).match(matcher)) {
      result.push(node.getFullText())
    }
  })
  console.log(result)
}

function main() {
  const conf = getCompilerOptions('../')
  if (!conf) return
  collectAnyType(['test.ts'], conf.options)
}

main()
