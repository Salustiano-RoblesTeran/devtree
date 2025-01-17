import jwt, { JwPayload } from 'jsonwebtoken'

export const generateJWT = (payload : JwPayload) => {
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '180d'
    })
    return token
}