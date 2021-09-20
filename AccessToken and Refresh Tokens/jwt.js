const jwt =require('jsonwebtoken');
const createError = require('http-errors');


module.exports={
    signAccessToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={
            }
            const secret =process.env.ACCESS_TOKEN_SECRET
            const options={
                expiresIn:"1h",
                issuer:"abc.com",
                audience:userId,
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err) {
                    reject (createError.InternalServerError())
                }
                    
                resolve(token);
            })
        })
    },
    verifyAccessToken:(req,res,next)=>{
        if (!req.headers['authorization']) return next(createError.Unauthorized())
        const authHeader= req.headers['authorization']
        const bearsToken = authHeader.split(' ');
        const token = bearsToken[1];
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload)=>{
            if (err) 
            {
                const message = err.name ==='JsonWebTokenError'?'Unauthorized':err.message
                return next(createError.Unauthorized(message))
            }
            req.payload=payload;
            next()
        })
    },
    signRefreshToken:(userId)=>{
        return new Promise((resolve,reject)=>{
            const payload={
            }
            const secret =process.env.REFRESH_TOKEN_SECRET
            const options={
                expiresIn:"1y",
                issuer:"abc.com",
                audience:userId,
            }
            jwt.sign(payload,secret,options,(err,token)=>{
                if(err) {
                    reject (createError.InternalServerError())
                }
                    
                resolve(token);
            })
        })
    },
    verifyRefreshToken:(refreshToken)=>{
        return new Promise((resolve,reject)=>{
            jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET,(err,payload)=>{
                if (err) return reject(createError.Unauthorized())
                const userId = payload.audience

                resolve(userId);
            })
        })
    },
}