import type { Request, Response } from 'express'
import { validationResult } from 'express-validator'
import slug from 'slug';
import User from "../models/User"
import { checkPassword, hashPassword } from '../utils/auth';


export const createAccount = async (req: Request, res: Response) => {

    const {email, password} = req.body;

    const userExists = await User.findOne({email})

    if(userExists) {
        const error = new Error('Un usuario con ese email ya esta registrado');
        return res.status(409).json({error: error.message})
    }

    const handle = slug(req.body.handle, '')
    const handlexists = await User.findOne({handle})
    if(handlexists) {
        const error = new Error('la url no esta disponible');
        return res.status(409).json({error: error.message})
    }

    const user = new User(req.body);
    user.password = await hashPassword(password)
    user.handle = handle;
    await user.save();
    res.status(201).send({"msg":"Registro creado correctamente."})
}

export const login = async (req: Request, res: Response) => {
        // Manejar errores
        let errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const {email, password} = req.body;

        // Comprobar si el usuario esta registrado
        const user = await User.findOne({email})
        if(!user) {
            const error = new Error('El usuario no existe');
            return res.status(404).json({error: error.message})
        }

        // Comprobar el password
        const isPasswordCorrect =  await checkPassword(password, user.password);
        if (!isPasswordCorrect) {
            const error = new Error('Password incorecto');
            return res.status(401).json({error: error.message})
        }

        res.send('Autenticado...')
}