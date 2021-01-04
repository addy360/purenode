#! /bin/env node
const http = require('http')
const https = require('https')
const url = require('url')
const stringDecorder = require('string_decoder').StringDecoder
const fs = require('fs')

const {  getHandler   } = require('./routes')


const mainServer = (req,res)=>{
    const parsedUrl = url.parse(req.url,true)
    const path = parsedUrl.pathname
    const treamedPath = path.replace(/^\/+|\/$/g,'')
    const method = req.method.toLowerCase()
    const queryString = parsedUrl.query
    const headers = req.headers

    const decorder = new stringDecorder('utf-8')
    let buff = ''
    req.on('data',(data)=>buff += decorder.write(data))
    req.on('end',()=>{
        handler = getHandler(treamedPath)
        
        buff += decorder.end()
        const data = {
            treamedPath,
            method,
            queryString,
            headers,
            payload: buff
        }
        handler(data, (status, payload)=>{

            status = typeof(status) == 'number' ? status : 200
            payload = typeof(payload) == 'object'? payload : {}
         
            
            res.setHeader('Content-Type','application/json')
            res.writeHead(status)
            res.end(JSON.stringify(payload))
        })
        console.log(`${method.toUpperCase()} : ${treamedPath} `)
    })

    
}




const httpServer = http.createServer(mainServer)
const httpsServerOptions  = {
    key: fs.readFileSync('./https/key.pem'),
    cert: fs.readFileSync('./https/cert.pem')
}
const httpsServer = https.createServer(httpsServerOptions, mainServer)


const PORT = process.env.PORT || 3000
httpServer.listen(PORT,()=>{
    console.log(`http Server listening on port ${PORT}`)
})

httpsServer.listen(3001,()=>{
    console.log(`https Server listening on port ${3001}`)
})






