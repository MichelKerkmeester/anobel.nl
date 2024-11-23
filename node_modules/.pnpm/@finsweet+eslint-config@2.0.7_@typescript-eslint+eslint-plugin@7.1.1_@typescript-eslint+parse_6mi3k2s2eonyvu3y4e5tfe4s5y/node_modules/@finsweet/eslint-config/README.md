# eslint-config

Finsweet's official configuration for ESLint.

## How to start

First, install all the devDependencies:

```bash
pnpm add -D eslint prettier typescript @finsweet/eslint-config eslint-config-prettier eslint-plugin-prettier eslint-plugin-simple-import-sort @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

Then, create a `.eslintrc.json` file with the following configuration:

```json
{ "extends": ["@finsweet"] }
```
