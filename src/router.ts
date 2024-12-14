import { Router } from 'express';
import { body } from 'express-validator'
import { createAccount } from './handlers';

const router = Router();

// Autenticacion y resgistro
router.post('/auth/register', 
    body('handle')
        .notEmpty()
        .withMessage('El handle no puede ir vacio.'),
    body('name')
        .notEmpty()
        .withMessage('El Nombre no puede ir vacio.'),
    body('email')
        .isEmail()
        .withMessage('Email no valido.'),
    body('password')
        .isLength({min: 8})
        .withMessage('El Password es muy corto, minimo 8 caracteres.'),
    createAccount)

export default router;