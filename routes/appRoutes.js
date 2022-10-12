import express from 'express'
import { category, home, noFound, searcher } from '../controllers/appController.js'


const router = express.Router()

router.get('/', home)

router.get('/categorias/:id', category)

router.get('/404',noFound)

router.post('/buscador',searcher)



export default router