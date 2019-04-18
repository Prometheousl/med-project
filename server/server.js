// server.js
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

const fs = require('fs');
const path = "./formData.txt"

// Set default middlewares
server.use(middlewares)

server.post('/submit', function(req, res) {
  console.log('submit called****************************');
  let body = '';

  var writer = fs.createWriteStream(path,
    {flags: 'w', encoding: 'utf-8', mode: 0666});
  writer.on('error', function(e) {
    console.error(e);
  });

  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', () => {
    console.log(JSON.stringify(body));
    writer.write(JSON.stringify(body));
    writer.end();
    res.end('ok');
  });
});

// use default router
server.use(router)
server.listen(3000, () => {
  console.log('JSON Server is running')
})
