import http from 'http'
import path from 'path'
import fs from 'fs/promises'
import url from 'url'

const server = http.createServer(async (req, res) => {
  if (req.method === 'GET') {
    let filePath = path.join(import.meta.dirname, 'public', req.url === '/' ? 'index.html' : req.url)
    let extName = path.extname(filePath)
    let contentType = 'text/html'

    switch (extName) {
      case '.js':
        contentType = 'text/javascript'
        break
      case '.css':
        contentType = 'text/css'
        break
      case '.json':
        contentType = 'application/json'
        break
      case '.png':
        contentType = 'image/png'
        break
      case '.jpg':
        contentType = 'image/jpg'
        break
    }

    await fs.readFile(
      filePath,
      { encoding: 'utf-8' }
    )
      .then(file => {
        res.writeHead(200, { 'Content-Type': contentType })
        res.end(file)
      })
      .catch(async (err) => {
        const errPage = err.code === 'ENOENT' ?
          await fs.readFile(path.join(import.meta.dirname, 'public', '404.html'), { encoding: 'utf-8' })
          : 'Oopsies, there was a server issue'

        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.end(errPage)
      })
  }

})

server.listen({ port: 3000, host: '0.0.0.0' }, () => console.log('Server started'))