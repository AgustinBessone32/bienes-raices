import express from 'express'
import { autenticar, comprobarToken, confirmar, formularioforgetPassword, formularioLogin, formularioRegistro, nuevoPass, registrar, resetPassword } from '../controllers/usuarioController.js'

const router = express.Router()

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/register',formularioRegistro )
router.post('/register',registrar )

router.get('/forget-password',formularioforgetPassword )
router.post('/forget-password',resetPassword )


router.get('/confirmar/:token', confirmar)

//Almacena el nuevo pass
router.get('/forget-password/:token', comprobarToken)
router.post('/forget-password/:token', nuevoPass)


export default router
