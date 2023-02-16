module.exports = {
  root: true,
  // This tells ESLint to load the config from the package `eslint-config-synapse`
  extends: ["synapse"],
  settings: {
    next: {
      rootDir: ["apps/*/"],
    },
  },
};
