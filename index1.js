const ts = require('typescript');
const { readFile } = require('fs');
// const file = require('./test.ts');

// console.log(ts);
// ts.
// console.log(file);

readFile('./test.ts', { 'encoding': 'utf-8' }, (error, data) => {
    // console.log(ts.createSourceFile('test', data, ts.ScriptTarget.ES2015))
    // ts.SyntaxKind.ForKeyword

    // const host = ts.createCompilerHost({});

    let output = [];
    const program = ts.createProgram(['./test.ts'], { strict: true, strictNullChecks: true });
    // const program = ts.createProgram(['./test.ts'], {  });
    let checker = program.getTypeChecker();
    // const result = program.emit();
    // const typeChecker = program.getTypeChecker();
    // const file = program.getSourceFile('test.ts');
    // typeChecker.
    // const v = ts.createLanguageService();
    // v.

    for (const sourceFile of program.getSourceFiles()) {
        if (!sourceFile.isDeclarationFile) {
            // Walk the tree to search for classes
            ts.forEachChild(sourceFile, visit);
          }
    }

    // console.log(output);
    // console.log(output[0].constructors);


      /** visit nodes finding exported classes */
  function visit(node) {
    // Only consider exported nodes
    // if (!isNodeExported(node)) {
    //   return;
    // }

    // console.log(node);
    if (ts.isPropertyAccessExpression(node) && node.questionDotToken) {
        // console.log(node.name.escapedText, '-------------', node.expression.name.escapedText);
        // console.log(checker.typeToString(checker.getTypeAtLocation(node)));
        const type = checker.getTypeAtLocation(node.expression);
        
        // console.log(
        //     // checker.getTypeOfSymbolAtLocation(checker.getSymbolAtLocation(node), checker.getSymbolAtLocation(node).valueDeclaration),
        //     checker.getTypeOfSymbolAtLocation(checker.getSymbolAtLocation(node.expression), checker.getSymbolAtLocation(node.expression).valueDeclaration),
        //     // checker.getTypeOfSymbolAtLocation(checker.getSymbolAtLocation(node.expression.parent), checker.getSymbolAtLocation(node.expression.parent).valueDeclaration),
        //     // checker.typeToString(checker.getTypeAtLocation(node.expression), node.expression.parent, ts.TypeFormatFlags.UseFullyQualifiedType),
        //     // checker.getIndexInfosOfType(checker.getTypeAtLocation(node.expression)),
        //     // checker.(checker.getTypeAtLocation(node.expression)),
        // );
        // console.log(type.isUnion())
        // console.log(type)

        if (type.isUnion()) {
            // type.types.forEach(type => {
            //     if (type.flags === ts.TypeFlags.Undefined || type.flags === ts.TypeFlags.Null) {
            //         console.log(type);
            //     }
            // })
        }
        // console.log(checker.typeToString(checker.getTypeAtLocation(node.expression.expression)));
        // console.log(checker.getTypeAtLocation(node.expression.expression).type);
        // console.log(checker.isUndefinedSymbol(checker.getTypeAtLocation(node.expression)));
        // console.log(checker.typeToString(checker.getTypeAtLocation(node.parent)));
        // console.log((checker.getTypeAtLocation(node.expression.expression).members.get(node.expression.name.escapedText)));
        // console.log((checker.getTypeAtLocation(node.expression.expression)));
        // console.log(checker.getTypeAtLocation(node.expression), checker.isUndefinedSymbol(node.expression));
      // This is a top level class, get its symbol
    //   let symbol = checker.getSymbolAtLocation(node.name);
    //   if (symbol) {
    //     output.push(serializeClass(symbol));
    //   }
      // No need to walk any further, class expressions/inner declarations
      // cannot be exported

    //   ts.forEachChild(node, (node) => console.log(node));
    } if (ts.isTypeAliasDeclaration(node)) {
        // console.log(checker.typeToString(checker.getTypeAtLocation(node.type)));
    } if (ts.isIdentifier(node)) {
      if (node.escapedText === 'foo' || node.escapedText === 'bar') {
        const type = checker.getTypeAtLocation(node);

        console.log(type, checker.typeToString(type), type.symbol.members);
      }
    } else {
      // This is a namespace, visit its children
      ts.forEachChild(node, visit);
    //   ts.get
    }
  }

    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol) {
        return {
          name: symbol.getName(),
          documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
          type: checker.typeToString(
            checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
          )
        };
      }
  
  /** Serialize a class symbol information */
  function serializeClass(symbol) {
    let details = serializeSymbol(symbol);

    // Get the construct signatures
    let constructorType = checker.getTypeOfSymbolAtLocation(
      symbol,
      symbol.valueDeclaration
    );
    details.constructors = constructorType
      .getConstructSignatures()
      .map(serializeSignature);
    return details;
  }

    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
        return {
          parameters: signature.parameters.map(serializeSymbol),
          returnType: checker.typeToString(signature.getReturnType()),
          documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
        };
      }

    // console.log(program.getSourceFiles());
})
