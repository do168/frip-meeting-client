// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');
export const configureWebpack = {
  resolve: {
    alias: {
      '@': path(__dirname, 'src/'),
    },
  },
};
