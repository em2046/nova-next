import globby from 'globby';
import { camelCase } from 'lodash';
import { format } from '../helpers';
import fs from 'fs';
import path from 'path';

const fsPromises = fs.promises;
const vitePressDir = 'docs/.vitepress';
const componentDir = 'components';
const outputPath = 'theme/register-components.js';

function importTemplate(path: String, componentName: String) {
  return `import ${componentName} from '../${componentDir}/${path}';`;
}

function registerTemplate(path: String, componentName: String) {
  return `app.component('${componentName}', ${componentName});`;
}

function componentTemplate(path: String) {
  const componentName = camelCase(path.slice(0, -4).replace(/[/\\]/g, '-'));

  return {
    import: importTemplate(path, componentName),
    register: registerTemplate(path, componentName),
  };
}

function componentsTemplate(codeImports: string, codeRegisters: string) {
  return `${codeImports}

export function registerComponents(app) {
  ${codeRegisters}
}
`;
}

export async function registerComponents() {
  const dir = path.join(vitePressDir, componentDir);
  const files = await globby('**/*.vue', {
    cwd: dir,
  });
  const codes = files.map((file) => componentTemplate(file));
  const codeImports = codes.map((code) => code.import).join('\n');
  const codeRegisters = codes.map((code) => code.register).join('\n');
  const content = componentsTemplate(codeImports, codeRegisters);
  const formattedContent = await format(content, { parser: 'babel' });

  await fsPromises.writeFile(
    path.join(vitePressDir, outputPath),
    formattedContent
  );
}
