import through2 from 'through2';
import { Options } from 'prettier';
import { format } from '../helpers';

export default function prettierFormat(userOptions?: Options) {
  return through2.obj(async (chunk, enc, callback) => {
    const fileContent = chunk.contents.toString(enc);
    chunk.contents = Buffer.from(await format(fileContent, userOptions));
    callback(null, chunk);
  });
}
