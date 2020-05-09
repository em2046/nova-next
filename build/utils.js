import path from 'path';

export function fromTheRoot(p) {
  const projectRootDir = path.resolve(__dirname, '..');
  return path.join(projectRootDir, p);
}
