const { execSync } = require('child_process');

const afterAllInstalled = (project) => {
  // `project.cwd` has a leading `/` on Windows, which breaks `cwd` of `execSync`
  const cwd = process.platform === 'win32' ? project.cwd.slice(1) : project.cwd;
  execSync('yarn build', { cwd, stdio: 'inherit' });
};

module.exports = {
  name: 'plugin-build',
  factory: () => {
    return {
      default: {
        hooks: {
          afterAllInstalled
        }
      }
    };
  }
};
