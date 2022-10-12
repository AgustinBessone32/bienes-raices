import { Categoria, Precio, Propiedad } from '../models/index.js'

const home = async(req,res) => {

    const [categorias,precios,casas,deptos] =await Promise.all([
        Categoria.findAll({raw:true}),
        Precio.findAll({raw:true}),
        Propiedad.findAll({
                limit: 3,
                where: {
                    categoriaId: 1
                },
                include:[
                    {
                        model: Precio,
                        as: 'precio'
                    }
                ],
                order: [
                    ['createdAt', 'DESC']
                ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                categoriaId: 2
            },
            include:[
                {
                    model: Precio,
                    as: 'precio'
                }
            ],
            order: [
                ['createdAt', 'DESC']
            ]
    }),
    ])

    res.render('home',{
        pagina: 'Inicio',
        categorias,
        precios,
        casas,
        deptos
    })
}

const category = (req,res) => {

}

const noFound = (req,res) => {

}

const searcher = (req,res) => {

}

export {
    home,
    category,
    noFound,
    searcher
}
