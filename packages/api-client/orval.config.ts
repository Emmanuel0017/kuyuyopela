import { defineConfig } from 'orval';

export default defineConfig({
  kuyuyopela: {
    // input: 'http://localhost:3000/api/docs-json',
    input: 'https://kuyuyopela.onrender.com/api/docs-json',
    output: {
      target: 'src/generated/client.ts',
      client: 'react-query',
      mode: 'tags-split',
      override: {
        mutator: {
          path: 'src/axios-instance.ts',
          name: 'customInstance',
        },
      },
    },
  },
});