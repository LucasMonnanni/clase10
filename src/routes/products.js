import { Router } from 'express';
import { ProductError } from '../managers/products.js';
import { uploader } from '../utils.js';

export const router = Router();

router.get('/', async (req, res, next) => {
    let products = await req.pm.getProducts()
    const start = req.query.start ?? 0
    const limit = req.query.limit
    if (limit) {
        products = products.splice(start, limit)
    }
    res.send(products)
    next()
})

router.get('/:pid', async (req, res, next) => {
    try {
        const id = req.params.pid
        const product = await req.pm.getProductById(id)
        res.send(product)
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
    next()
})

router.post('/', uploader.array('thumbnails'), async (req, res, next) => {
    try {
        const thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`)
        const { title, description, price, code, stock, category, status } = req.body

        const product = await req.pm.addProduct(title, description, price, thumbnails, code, stock, category, status)
        
        console.log('during')
        res.send({ status: 'success' })
    } catch (error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
    next()
})

router.put('/:pid', uploader.array('thumbnails'), async (req, res, next) => {
    try {
        const pid = req.params.pid
        const productData = req.body

        if (req.files) { productData.thumbnails = req.files.map((f) => `${f.destination}/${f.filename}`) }

        const product = await req.pm.updateProduct(pid, productData)
        res.send({ status: 'success' })
    } catch (error) {
        console.log(error.stack)
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
    next()
})

router.delete('/:pid', async (req, res, next) => {
    try {
        const pid = req.params.pid
        await req.pm.deleteProduct(pid)
        res.send({ status: 'success' })
    } catch(error) {
        if (error instanceof ProductError) {
            res.status(error.code).send({ status: 'error', error: error.message })
        } else {
            console.log(error)
            res.status(500).send()
        }
    }
    next()
})
