import {mkdir,copyFile} from 'node:fs/promises';
await mkdir('dist',{recursive:true});
for(const file of ['index.html','style.css','app.js','prompt.js']) await copyFile(file,`dist/${file}`);
console.log('Build complete: dist/');
