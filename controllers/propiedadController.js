import { validationResult } from 'express-validator'
import { unlink } from 'node:fs/promises'
import { Categoria, Precio, Propiedad } from '../models/index.js'


const admin = async(req,res) => {

    //Leer queryString

    const {pagina: paginaActual} = req.query

    const er = /^[1-9]$/

    if(!er.test(paginaActual)){
        return res.redirect('/mis-propiedades?pagina=1')
    }

    try {
        const {id} = req.usuario

        const limite = 10
        const offset = ((paginaActual * limite) - limite)

        const [propiedades, total] = await Promise.all([
            Propiedad.findAll({
                limit: limite,
                offset,
                where: {usuarioID : id
                },
                include: [
                    { model: Categoria, as: 'categoria'},
                    { model: Precio, as: 'precio'}
                ],
            }),
            Propiedad.count({
                where: {
                    usuarioId: id
                }
            })
        ])


    
        res.render('properties/admin',{
            pagina:'Mis Propiedades',
            propiedades,
            paginas: Math.ceil(total/limite),
            paginaActual: Number(paginaActual),
            total,
            offset,
            limite
        })
        
    } catch (error) {
        console.log(error)
    }


}


const createProperty = async (req,res) => {
    //consultar modelo de precios y categorias
    const [categorias,precios] = await Promise.all([
        Categoria.findAll(),
        Precio.findAll()
    ])

    res.render('properties/create',{
        pagina:'Crear Propiedad',
        categorias,
        precios,
        datos: {}
    })
}

const saveProperty = async (req,res) => {
    //Validacion
    let resultado = validationResult(req)

    if(!resultado.isEmpty()){

        const [categorias,precios] = await Promise.all([
            Categoria.findAll(),
            Precio.findAll()
        ])

        return res.render('properties/create',{
            pagina:'Crear Propiedad',
            categorias,
            precios,
            errores: resultado.array(),
            datos: req.body
        })
    }

    //Crear registro

    const {titulo,descripcion,habitaciones,estacionamiento,wc, calle,lat,lng, precio: precioId,categoria: categoriaId} = req.body

    const {id: usuarioId} = req.usuario

    try {
        const propiedadGuardada = await Propiedad.create({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId,
            usuarioId,
            imagen: ''
        })

        const {id} = propiedadGuardada

        res.redirect(`/propiedades/agregar-imagen/${id}`)
    } catch (error) {
        console.log(error)
    }
}

const addImage = async (req,res) => {
    const {id} = req.params

    //Validar que la ropiedad exista

     const propiedad = await Propiedad.findByPk(id)

     if(!propiedad){
         return res.redirect('/mis-propiedades')
     }

    res.render('properties/add-image',{
        pagina:'Agregar imagen',
    })

    //Validar que la propiedad este publicada

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad sea del usuario

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }

    console.log(propiedad)

    res.render('properties/add-image',{
        pagina:`Agregar imagen a: ${propiedad.titulo}`,
        propiedad
    })

}

const saveImage = async (req,res,next) => {
    const {id} = req.params

    //Validar que la ropiedad exista

     const propiedad = await Propiedad.findByPk(id)

     if(!propiedad){
         return res.redirect('/mis-propiedades')
     }

    res.render('properties/add-image',{
        pagina:'Agregar imagen',
    })

    //Validar que la propiedad este publicada

    if(propiedad.publicado){
        return res.redirect('/mis-propiedades')
    }

    //Validar que la propiedad sea del usuario

    if(req.usuario.id.toString() !== propiedad.usuarioId.toString()){
        return res.redirect('/mis-propiedades')
    }
    
    try {
        
      //Almacenar la imagen y publicar propiedad 
        propiedad.imagen = req.file.filename
        propiedad.publicado = 1

        await propiedad.save()

        next()

    } catch (error) {
        console.log(error)
    }

}

const editProperty = async (req,res) => {
    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

   //consultar modelo de precios y categorias
   const [categorias,precios] = await Promise.all([
    Categoria.findAll(),
    Precio.findAll()
    ])

    res.render('properties/edit',{
        pagina:`Editar propiedad: ${propiedad.titulo}`,
        categorias,
        precios,
        datos: propiedad
    }) 
}

const saveChanges = async (req,res) => {
      //Validacion
      let resultado = validationResult(req)

      if(!resultado.isEmpty()){
  
          const [categorias,precios] = await Promise.all([
              Categoria.findAll(),
              Precio.findAll()
          ])
  
          return res.render('properties/edit',{
            pagina:'Editar Propiedad',
            categorias,
            precios,
            errores,
            datos: req.body
        }) 
      }

    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    //Actualizar la propiedad

    try {
        const {titulo,descripcion,habitaciones,estacionamiento,wc, calle,lat,lng, precio: precioId,categoria: categoriaId} = req.body

        propiedad.set({
            titulo,
            descripcion,
            habitaciones,
            estacionamiento,
            wc,
            calle,
            lat,
            lng,
            precioId,
            categoriaId
        })

        await propiedad.save()

        res.redirect('/mis-propiedades')
        
    } catch (error) {
        console.log(error)
    }


}

const deleteProperty = async (req,res) => {
    const {id} = req.params
    const propiedad = await Propiedad.findByPk(id)

    if(!propiedad){
        return res.redirect('/mis-propiedades')
    }

    if(propiedad.usuarioId.toString() !== req.usuario.id.toString()){
        return res.redirect('/mis-propiedades')
    }

    //Eliminar la imagen
    await unlink(`public/uploads/${propiedad.imagen}`)
    
    //Eliminar la propiedad

    await propiedad.destroy()

    res.redirect('/mis-propiedades')
}

const showProperty = async (req,res) => {
    
    const {id} = req.params

    // Comprobar que la propiedad exista

    const propiedad = await Propiedad.findByPk(
        id,{
        include: [
            { model: Categoria, as: 'categoria'},
            { model: Precio, as: 'precio'}
        ]
    })

    if(!propiedad){
        res.resdirect('/404')
    }
    
    res.render('properties/show',{
        propiedad,
        pagina: propiedad.titulo
    })
}

export {
    admin,
    createProperty,
    saveProperty,
    addImage,
    saveImage,
    editProperty,
    saveChanges,
    deleteProperty,
    showProperty
}
