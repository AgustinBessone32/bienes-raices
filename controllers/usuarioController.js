import bcrypt from 'bcrypt'
import { check, validationResult } from 'express-validator'
import { emailOlvidePass, emailRegistro } from '../helpers/emails.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import Usuario from '../models/Usuario.js'


const formularioLogin = (req,res) => {
    res.render('auth/login', {
        pagina: 'Iniciar Sesión'
    })
}

const autenticar = async(req,res) => {
    await check('email').isEmail().withMessage('El email es obligatorio').run(req)
    await check('password').notEmpty().withMessage('La contraseña es obligatoria').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/login', {
            pagina: 'Inicar Sesión',
            errores: resultado.array(),
        })
    }

    const {email,password} = req.body

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/login', {
            pagina: 'Inicar Sesión',
            errores: [{msg: 'El usuario no existe'}]
        })
    }

    //Comprobar si el user esta confirmado

    if(!usuario.confirmado){
        return res.render('auth/login', {
            pagina: 'Inicar Sesión',
            errores: [{msg: 'Tu cuenta no ha sido confirmada'}]
        })
    }

    //Comprobar si las pass coinciden
    if(!usuario.verificarPassword(password)){
        return res.render('auth/login', {
            pagina: 'Inicar Sesión',
            errores: [{msg: 'La contraseña es incorrecta'}]
        })
    }

    //Autenticar user
    const token = generarJWT({id:usuario.id,nombre: usuario.nombre})

    return res.cookie('_token', token,{
        httpOnly: true,
        //secure: true
    }).redirect('/mis-propiedades')
}


const formularioRegistro = (req,res) => {
    res.render('auth/registro', {
        pagina: 'Crear cuenta'
    })
}

const formularioforgetPassword = (req,res) => {
    res.render('auth/forget-password', {
        pagina: 'Recuperar tu acceso a Bienes Raices'
    })
}


const resetPassword = async (req,res) => {

    //validacion
    await check('email').isEmail().withMessage('Debe ser formato email').run(req)
    
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/forget-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            errores: resultado.array(),
        })
    }

    //Buscar el usuario
    const {email} = req.body

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auth/forget-password', {
            pagina: 'Recupera tu acceso a Bienes Raices',
            errores: [{msg: 'El email no pertenece a ningun usuario'}],
        })
    }

    //Generar token
    usuario.token = generarId()
    await usuario.save()

    //Enviar email
    emailOlvidePass({
        email: usuario.email,
        nombre: usuario.nombre,
        token: usuario.token
    })

    //Mostrar mensaje
    return res.render('templates/mensaje', {
        pagina: 'Reestablece tu contraseña',
        mensaje: 'Hemos enviado un email con instrucciones'
    })
}


const registrar = async (req, res) => {
    const {nombre, email,password} = req.body

    //validacion
    await check('nombre').notEmpty().withMessage('Debe insertar un nombre').run(req)
    await check('email').isEmail().withMessage('Debe ser formato email').run(req)
    await check('password').isLength({min:6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Las contraseñas no coinciden').run(req)
    
    
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: nombre,
                email: email
            }
        })
    }

    //Verificar si el usuario ya existe
    
    const existeUser = await Usuario.findOne({where: {email: email}})

    if(existeUser){
        return res.render('auth/registro', {
            pagina: 'Crear cuenta',
            errores: [{msg: 'Ya existe un usuario con este email'}],
            usuario: {
                nombre: nombre,
                email: email
            }
        })
    }
    
    const usuario = await Usuario.create({
        nombre,
        email,
        password,
        token: generarId()
    })

    //Envio de email de confirmacion
    emailRegistro({
        nombre: usuario.nombre,
        email: usuario.email,
        token: usuario.token
    })

   
    res.render('templates/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje:'Hemos enviado un email de confirmacion, presiona en el enlace'
    })
    

}

const confirmar = async (req,res) => {
    const {token} = req.params

    //Verificar si el token es valido
    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        res.render("auth/confirm-account", {
            pagina: 'Error al confirmar tu cuenta',
            mensaje: "Hubo un error al confirmar tu cuenta,intenta de nuevo",
            error: true
        })
    }

    //Confirmar cuenta
    usuario.token = null
    usuario.confirmado = true
    await usuario.save()


    res.render("auth/confirm-account", {
        pagina: 'Cuenta confirmada',
        mensaje: "La cuenta se confirmó correctamente",
        error: false
    })


}

const comprobarToken = async (req,res) => {

    const {token} = req.params

    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render("auth/confirm-account", {
            pagina: 'Reestablece tu contraseña',
            mensaje: "Hubo un error al validar tu informacion, intentalo de nuevo",
            error: true
        })
    }

    //Mostrar form para modificar pass
    res.render('auth/reset-password',{
        pagina: 'Reestablece tu contraseña'
    })
}

const nuevoPass = async (req,res) => {
    //Validar nuevo pass
    await check('password').isLength({min:6}).withMessage('La contraseña debe tener al menos 6 caracteres').run(req)

    let resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auth/reset-password', {
            pagina: 'Reestablece contraseña',
            errores: resultado.array()
    })
}

    const {token} = req.params
    const {password} = req.body


    const usuario = await Usuario.findOne({where: {token}})

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password,salt)
    usuario.token = null

    await usuario.save()

    res.render('auth/confirm-account', {
        pagina: 'Contraseña reestablecida',
        mensaje: 'La contraseña se guardo correctamente'
    })
}



export {
    formularioLogin,
    formularioRegistro,
    formularioforgetPassword,
    resetPassword,
    registrar,
    confirmar,
    comprobarToken,
    nuevoPass,
    autenticar
}

