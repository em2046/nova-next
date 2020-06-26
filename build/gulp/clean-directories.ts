import del from 'del';

export default function cleanDirectories() {
  return del(['dist']);
}
