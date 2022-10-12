import jwt from 'jsonwebtoken'
import { Usuario } from '../models/index.js'

const protegerRuta = async(req,res,next) => {

    //Verificar token
    const {_token} = req.cookies

    if(!_token){
        res.redirect('/auth/login')
    }

    //Comprobar token

    try {
        
        const decoded = jwt.verify(_token,process.env.JWT_SECRET)

        const usuario = await Usuario.scope('eliminarPassword').findByPk(decoded.id)

        //Almacenar el usaurio en el req

        if(usuario){
            req.usuario = usuario
        }else{
            res.redirect('/auth/login')
        }

        return next()

    } catch (error) {
        console.log(error)
        res.clearCookie('_token').redirect('/auth/login')
    }

    next()
}

export default protegerRuta