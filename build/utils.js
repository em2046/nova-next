import path from 'path';

export function fromRoot(p) {
  const projectRootDir = path.resolve(__dirname, '..');
  return path.join(projectRootDir, p);
}
