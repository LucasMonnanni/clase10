import { Router } from 'express'
import { ProductManager, ProductError } from '../managers/products.js';
import { resolve } from 'path';

const router = Router()

router.get('/', async (req, res) => {
    let products = await req.pm.getProducts()
    res.render('home', {products})
})

router.get('/realtimeproducts', async (req, res) => {
    res.render('realtimeProducts', {})
})

export default router