/**
 * This file customizes dependency resolution for the pnpm package manager.
 * It ensures that vulnerable packages are replaced with patched versions.
 */
module.exports = {
  hooks: {
    readPackage(pkg) {
      // Force the brace-expansion package to use a patched version
      if (pkg.name === 'brace-expansion' && 
          (pkg.version.startsWith('1.') || pkg.version.startsWith('2.0.0') || pkg.version === '2.0.1')) {
        pkg.version = '2.0.2';
        console.log(`[Security] Upgrading brace-expansion to 2.0.2`);
      }

      // Also handle dependencies of minimatch and glob
      if (pkg.dependencies && pkg.dependencies['brace-expansion']) {
        const version = pkg.dependencies['brace-expansion'];
        if (version.startsWith('1.') || version.startsWith('2.0.0') || version === '2.0.1') {
          pkg.dependencies['brace-expansion'] = '^2.0.2';
          console.log(`[Security] Upgrading ${pkg.name}'s dependency brace-expansion to 2.0.2`);
        }
      }

      return pkg;
    }
  }
};
