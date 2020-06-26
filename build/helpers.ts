import prettier, { Options } from 'prettier';
import path from 'path';
import fs from 'fs';

const fsPromises = fs.promises;
const prettierConfigPath = '../.prettierrc';

export async function format(
  content: string,
  userOptions: Options = { parser: 'typescript' }
) {
  const defaultOptionBuffer = await fsPromises.readFile(
    path.resolve(__dirname, prettierConfigPath)
  );
  const defaultOptions = JSON.parse(defaultOptionBuffer.toString());
  const options = Object.assign({}, defaultOptions, userOptions);
  return prettier.format(content, options);
}
