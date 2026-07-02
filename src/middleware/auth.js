
import { UserModel } from "../models/Users.js";
import {verifyAccessToken} from "../utils/token.js"
import {generateAccessToken} from "../utils/token.js"
import {RefreshTokenModel} from "../models/RefreshToken.js"

const requireAuth = (req, res, next)=>{
    try{
        const authHeader = req.headers.authorization;

        if(!authHeader || !authHeader.startsWith('Bearer')){
            return res.status(401).json({
                error: "Authenticaiton required"
            })
        }

        const token = authHeader.substring(7);
        const payload = verifyAccessToken(token)

        req.user = {
            id: payload.sub,
            email: payload.email,
            role: payload.role
        }

        next()

    }catch(error){
        if(error.name === 'TokenExpiredError'){
            return res.status(401).json({error: "Token expired"});
        }        
        if(error.name === "JsonWebTokenError"){
            return res.status(401).json({error: "Invalid token"})
        }
        next(error)
    }
}

const requireRole=(...allowedRoles)=>{
    return (req, res, next)=>{
        if(!req.user){
            return res.status(401).json({error: "Authentication required"});
        }
        if(!allowedRoles.includes(req.user.role)){
            return res.status(403).json({error: "Insufficient Permission"})
        }
        next()
    }

}

const refresh = async(req, res, next)=>{
    try{
        const refreshToken = req.cookies.refreshToken;

        if(!refreshToken){
            return res.status(401).json({error: "Refresh Token required"})
        }

        const stored = await RefreshTokenModel.findOne({
            token: refreshToken,
            user: true,
        })

        if(!stored || stored.revoked){
            return res.status(401).json({ error: "Invalid refresh token"})
        }

        if(stored.expiresAt < new Date()){
            return res.status(401).json({error: "Refresh token required"})
        }

        const accessToken = generateAccessToken(stored.user)

        res.json({accessToken})

    }catch(error){
        next(error)

    }
}

const logout = async(req, res, next)=>{
    try{
        const refreshToken = req.cookies.refreshToken

        if(refreshToken){
            await RefreshTokenModel.updateMany({
                token: refreshToken,
                revoked: true,
            })
        }

        res.clearCookie("refreshToken", {path: "/auth/refresh"});
        res.json({message: "Logged out"})
    }catch(err){
        next(err)
    }

}

// const logoutAll = async(req, res, next) => {
//     try{
//         await RefreshTokenModel.updateMany({
//             userId: req.user.id, revoked: false,
//             revoked: true,
//         })
//         res.clearCookie('refreshToken', { path: "/auth/refresh"})
//         res.json({message: 'Logged out from all device'})

//     }catch(err){
//         next(err)
//     }
// }

export {
    requireAuth, requireRole, refresh, logout,
}