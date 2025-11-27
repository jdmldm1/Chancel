import { CodegenConfig } from '@graphql-codegen/cli'

const config: CodegenConfig = {
  overwrite: true,
  schema: './apps/api/src/graphql/schema/typeDefs.ts',
  documents: './apps/web/src/**/*.graphql', // Assuming GraphQL operations will be in .graphql files in the web app
  generates: {
    './packages/types/src/graphql.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo',
      ],
      config: {
        withHooks: true,
      },
    },
  },
}

export default config
