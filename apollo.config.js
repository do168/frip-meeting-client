import { resolve } from 'path';

// Load .env files
import { loadEnv } from 'vue-cli-plugin-apollo/utils/load-env';
const env = loadEnv([resolve(__dirname, '.env'), resolve(__dirname, '.env.local')]);

export const client = {
  service: env.VUE_APP_APOLLO_ENGINE_SERVICE,
  includes: ['src/**/*.{js,jsx,ts,tsx,vue,gql}'],
};
export const service = {
  name: env.VUE_APP_APOLLO_ENGINE_SERVICE,
  localSchemaFile: resolve(__dirname, './node_modules/.temp/graphql/schema.json'),
};
export const engine = {
  endpoint: process.env.APOLLO_ENGINE_API_ENDPOINT,
  apiKey: env.VUE_APP_APOLLO_ENGINE_KEY,
};
