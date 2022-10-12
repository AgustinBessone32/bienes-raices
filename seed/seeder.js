import db from '../config/db.js'
import { Categoria, Precio, Usuario } from '../models/index.js'
import categorias from './categorias.js'
import precios from './precios.js'
import usuarios from './usuarios.js'


const importarDatos = async() => {
    try {
        await db.authenticate()

        await db.sync()


        await Promise.all([
            Categoria.bulkCreate(categorias),
            Precio.bulkCreate(precios),
            Usuario.bulkCreate(usuarios)
        ])

        console.log('Datos importados correctamente')

        process.exit()
        
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


const clearDB = async() => {
    try {
        await Promise.all([
            Categoria.destroy({where:{}, trucate: true}),
            Precio.destroy({where:{}, trucate: true})
        ])
        await db.sync({force: true})

        console.log('Datos eliminados correctamente')

        process.exit()
    } catch (error) {
        console.log(error)
        process.exit(1)
    }
}


//Se ejecuta desde los scripts de package.json
if(process.argv[2] === '-i'){
    importarDatos()
}

if(process.argv[2] === '-e'){
    clearDB()
}