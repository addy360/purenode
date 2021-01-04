#! /bin/env node
const http = require('http')
const url = require('url')
const stringDecorder = require('string_decoder').StringDecoder

const server = http.createServer((req,res)=>{
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
         
            res.statusCode = status
            res.end(JSON.stringify(payload))
            console.log({status, payload})
        })
        console.log(`${method} : ${treamedPath} `)
    })

    
})

server.listen(3000,()=>{
    console.log(`Server listening on port 3000`)
})


const handlers = {}
handlers.sample = (data, cb)=>{
    cb(200,{'msg':'Sample'})
}

handlers._404 = (data, cb)=>{
    cb(404,{'msg':'Not found'})
}

const router = {}
router.sample = handlers.sample

router._404 = handlers._404

function getHandler(pathname){
    return pathname in router ? router[pathname] : router['_404']
}