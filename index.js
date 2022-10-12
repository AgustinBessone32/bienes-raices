import cookieParser from 'cookie-parser'
import express from 'express'
import db from './config/db.js'
import apiRoutes from './routes/apiRoutes.js'
import appRoutes from './routes/appRoutes.js'
import propiedadRoutes from './routes/propiedadesRoutes.js'
import usuarioRoutes from './routes/usuarioRoutes.js'


const app = express()



//Habilitar lectura de datos de formulario
app.use(express.urlencoded({extended: true}))

//Habilitar cookie-parser
app.use(cookieParser())

//Conexion a BD
try {
    await db.authenticate()
    db.sync()
    console.log('conexion correcta a BD')
} catch (error) {
    console.log(error)
}

//Puerto
const port = process.env.PORT || 3333


//Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//Carpeta Pública (contiene archivos estaticos)
app.use(express.static('public'))


//Rutas
app.use('/auth',usuarioRoutes)
app.use('/',propiedadRoutes)
app.use('/',appRoutes)
app.use('/api',apiRoutes)


app.listen(port , () =>{
    console.log(`Servidor OK en el puerto ${port}`)
})