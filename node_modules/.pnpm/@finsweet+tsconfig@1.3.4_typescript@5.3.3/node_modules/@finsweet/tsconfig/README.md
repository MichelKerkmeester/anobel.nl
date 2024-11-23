# @finsweet/tsconfig

Shared TypeScript config for all Finsweet projects.

## Installation

```bash
pnpm add -D @finsweet/tsconfig
npm install -D @finsweet/tsconfig
yarn add --dev @finsweet/tsconfig
```

## Usage

Create the following `tsconfig.json` file:

```json
{
  "extends": "@finsweet/tsconfig"
}
```

You can override any rule in your file, like:

```json
{
  "extends": "@finsweet/tsconfig",
  "paths": {
    "$lib/*": ["src/lib/*"]
  }
}
```
