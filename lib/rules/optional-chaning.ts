import * as ts from 'typescript';

import { Rule } from 'eslint';
import { TSESTree } from '@typescript-eslint/typescript-estree';
import { ParserServices } from '@typescript-eslint/parser';

function isNullishType(flags: ts.TypeFlags): boolean {
  return flags === ts.TypeFlags.Undefined || flags === ts.TypeFlags.Null;
}

function getNameFromExpression(expression: ts.Expression): string {
  let name = '';

  if (expression.kind === ts.SyntaxKind.PropertyAccessExpression) {
    name = (expression as ts.PropertyAccessExpression).name.escapedText as string;
  } else if (expression.kind === ts.SyntaxKind.Identifier) {
    name = (expression as ts.Identifier).escapedText as string;
  }

  return name;
}

function createError(checker: ts.TypeChecker, expression: ts.Expression, node: any, type: ts.Type) {
  const name = getNameFromExpression(expression);

  return ({
    messageId: "redundantOptionalChaining",
    node,
    data: {
      varName: name,
      type: checker.typeToString(type),
    }
  });
}

module.exports = {
  meta: {
    messages: {
      'redundantOptionalChaining': "Redundant optional chaning. Varible '{{ varName }}' has type '{{ type }}'"
    }
  },

  create(context: Rule.RuleContext): Rule.RuleListener {
    const parserServices = context.parserServices as ParserServices;
    const checker = parserServices.program.getTypeChecker();

    return {
      MemberExpression(node) {
        if (!node.optional) {
          return;
        }

        const accessExpNode = parserServices.esTreeNodeToTSNodeMap.get<
          TSESTree.MemberExpression
        >(node as TSESTree.MemberExpression);
        const propertyExp = accessExpNode.expression;

        if (
          !accessExpNode.questionDotToken ||
          // to skip array access like array[0]?.foo
          // TODO: add check for index access
          (propertyExp.kind !== ts.SyntaxKind.PropertyAccessExpression && propertyExp.kind !== ts.SyntaxKind.Identifier)
        ) {
          return;
        }

        const propertyType = checker.getTypeAtLocation(propertyExp);

        if (propertyType.isUnion()) {
          const isObjDefined = !propertyType.types.some(type => isNullishType(type.flags));

          if (isObjDefined) {

            context.report(createError(checker, propertyExp, node, propertyType));
          }
        } else if (
            !(
              propertyType.flags === ts.TypeFlags.Any || propertyType.flags === ts.TypeFlags.Unknown ||
              isNullishType(propertyType.flags)
            )
          ) {
            const name = getNameFromExpression(propertyExp);


            context.report(createError(checker, propertyExp, node, propertyType));
        }
      }
    };
  },
};
