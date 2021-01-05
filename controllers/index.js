const handlers = {}
handlers.ping = (data, cb)=>{
    cb(200)
}

handlers._404 = (data, cb)=>{
    cb(404,{'msg':'Not found'})
}

handlers.users = (data, cb)=>{
    const allowed_methods = ['get', 'post', 'delete','put']
    if(!allowed_methods.includes(data.method.toLocaleLowerCase())) return cb(406)
    handlers.userResource[data.method.toLocaleLowerCase()](data,cb)
    
    
}

handlers.userResource =  {}

handlers.userResource.get = (data, cb)=>{
    cb(303,data)
}

handlers.userResource.post = (data, cb)=>{
    try {
        const  { first_name, last_name, email } =  validateUserInput(data)
    } catch (error) {
        cb(400,{error:error.message})
    }
    
}

handlers.userResource.put = (data, cb)=>{
    cb(303,data)
}

handlers.userResource.delete = (data, cb)=>{
    cb(303,data)
}

function validateUserInput(data){
    const errors = []
    const  { payload:  { firstname, lastname, email } } = data
    const first_name =  typeof firstname == 'string' && firstname.trim().length > 0 ? firstname.trim : ''
    const last_name =  typeof lastname == 'string' && lastname.trim().length > 0 ? lastname.trim : ''
    const email_address =  typeof email == 'string' && email.trim().length > 0 ? email.trim : ''
    if(!first_name) errors.push({fieldname:'firstname',msg:'Valid firstname is required'})
    if(!last_name) errors.push({fieldname:'lastname',msg:'Valid lastname is required'})
    if(!email_address) errors.push({fieldname:'email',msg:'Valid email is required'})
    if(errors.length > 0) throw new Error(JSON.stringify(errors))
    return { first_name, last_name, email_address }
}



module.exports = handlers