import del from 'del';

export default async function cleanDirectories() {
  return await del(['dist', 'temp']);
}
