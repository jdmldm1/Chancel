import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './apps/api/src/graphql/schema/typeDefs.ts',
  documents: './apps/web/src/**/*.graphql',
  generates: {
    './packages/types/src/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
      ],
      config: {
        avoidOptionals: false,
        maybeValue: 'T | null',
      },
    },
  },
}

export default config
