module.exports = {
  hooks: {
    readPackageJson: async (pkg) => {
      if (['esbuild', 'unrs-resolver'].includes(pkg.name)) {
        pkg.pnpm = pkg.pnpm || {};
        pkg.pnpm.allowBuild = true;
      }
      return pkg;
    },
  },
};
