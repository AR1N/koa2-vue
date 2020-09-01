const jwt = require('jsonwebtoken')
const config = require('../../config')

const verifyAuth = {
    verify(token){
        return new Promise((resolve,reject)=>{
             jwt.verify(token,config.jwtKey,{issuer:'Aren'},function(err,decoded){
                if(err){
                    reject('err:'+err)
                }else{
                    resolve(decoded)
                }
            })
        })
    }
}

module.exports = verifyAuth