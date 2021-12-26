const rule = require('../../../lib/rules/optional-chaning');
const RuleTester = require('eslint').RuleTester;

const ruleTester = new RuleTester({ parser: require.resolve('@typescript-eslint/parser') });

ruleTester.run('optional-chaning', rule, {
  valid: [
    {
      code: `
      type Foo = { field: { bar: string } };

      const obj: Foo = { field: { bar: 'bar' } };
      const bar = obj.field.bar;`,
    },
    {
      code: `
      const foo: any = 6;

      foo?.bar;`
    }
  ],

  invalid: [
    {
      code: `
      type Foo = { field: { bar: string } };

      const obj: Foo = { field: { bar: 'bar' } };
      const bar = obj?.field.bar;`,
      errors: [{ messageId: 'redundantOptionalChaining' }],
    },
    {
      code: `
      type Foo = { field: { bar: string } };

      const obj: Foo = { field: { bar: 'bar' } };
      const bar = obj.field?.bar;`,
      errors: [{ messageId: 'redundantOptionalChaining' }],
    },
  ],
});
