import {createServer} from 'node:http';
import {readFile} from 'node:fs/promises';
const files={'/':'index.html','/index.html':'index.html','/style.css':'style.css','/app.js':'app.js','/prompt.js':'prompt.js'};
const mime={html:'text/html; charset=utf-8',css:'text/css; charset=utf-8',js:'text/javascript; charset=utf-8'};
const port=Number(process.env.PORT||5173);
createServer(async(req,res)=>{const file=files[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);res.end('Not found');return;}try{res.writeHead(200,{'Content-Type':mime[file.split('.').pop()]});res.end(await readFile(new URL('../'+file,import.meta.url)));}catch{res.writeHead(500);res.end('Unable to read file');}}).listen(port,'127.0.0.1',()=>console.log(`Local: http://localhost:${port}`));
