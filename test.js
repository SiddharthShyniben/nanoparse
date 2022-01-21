import process from 'node:process';
import nanoparse from './index.js';

console.log(nanoparse(process.argv.slice(2)));
