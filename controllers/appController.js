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

const category = async(req,res) => {
    const {id} = req.params

    //Comprobar que la categoria exista
    const categoria = await Categoria.findByPk(id)

    if(!categoria){
       return res.redirect('/404')
    }

    //Obtener propiedades de la categoeia

    const propiedades = await Propiedad.findAll({
        where:{
            categoriaId: id
        },
        include:[
            {
                model: Precio, as: 'precio'
            }
        ]
    })

    res.render('category',{
        pagina: `${categoria.nombre}s en Venta`,
        propiedades
    })
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
