const handlers = {}
handlers.ping = (data, cb)=>{
    cb(200)
}

handlers._404 = (data, cb)=>{
    cb(404,{'msg':'Not found'})
}

module.exports = handlers