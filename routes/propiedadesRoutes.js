import express from 'express'
import { body } from 'express-validator'
import { addImage, admin, createProperty, deleteProperty, editProperty, saveChanges, saveImage, saveProperty, showProperty } from '../controllers/propiedadController.js'
import protegerRuta from '../middlewares/protegerRuta.js'
import upload from '../middlewares/subirImagen.js'

const router = express.Router()

router.get('/mis-propiedades',protegerRuta,admin)

router.get('/propiedades/agregar-imagen/:id',protegerRuta,addImage)
router.post('/propiedades/agregar-imagen/:id',
    upload.single('imagen'),
    protegerRuta,
    saveImage
    )

router.get('/propiedades/crear',protegerRuta,createProperty)
router.post('/propiedades/crear',
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción del Anuncio es obligatorio')
        .isLength({max: 200}).withMessage('La descripción del Anuncio es muy larga'),
    body('categoria').isNumeric().withMessage('Se debe seleccionar una categoria'),
    body('precio').isNumeric().withMessage('Se debe seleccionar un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Se debe seleccionar la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Se debe seleccionar la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Se debe seleccionar la cantidad de baños'),
    body('lat').notEmpty().withMessage('Se debe ubicar la propiedad en el mapa'),
    protegerRuta,
    saveProperty
)

router.get('/propiedades/editar/:id',protegerRuta ,editProperty)
router.post('/propiedades/editar/:id',
    body('titulo').notEmpty().withMessage('El titulo del Anuncio es obligatorio'),
    body('descripcion')
        .notEmpty().withMessage('La descripción del Anuncio es obligatorio')
        .isLength({max: 200}).withMessage('La descripción del Anuncio es muy larga'),
    body('categoria').isNumeric().withMessage('Se debe seleccionar una categoria'),
    body('precio').isNumeric().withMessage('Se debe seleccionar un rango de precios'),
    body('habitaciones').isNumeric().withMessage('Se debe seleccionar la cantidad de habitaciones'),
    body('estacionamiento').isNumeric().withMessage('Se debe seleccionar la cantidad de estacionamientos'),
    body('wc').isNumeric().withMessage('Se debe seleccionar la cantidad de baños'),
    body('lat').notEmpty().withMessage('Se debe ubicar la propiedad en el mapa'),
    protegerRuta,
    saveChanges
)
router.post('/propiedades/eliminar/:id', protegerRuta,deleteProperty)


//Area publicca

router.get('/propiedad/:id', showProperty)




export default router