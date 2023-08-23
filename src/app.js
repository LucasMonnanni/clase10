import express from 'express';
import { router as productsRouter } from './routes/products.js';
import viewsRouter from './routes/views.js';
import { ProductManager } from './managers/products.js';
import { resolve } from 'path';
import handlebars from 'express-handlebars'
import { Server } from "socket.io";

const app = express();

app.engine('handlebars', handlebars.engine())
app.set('view engine', 'handlebars')
app.set('views', resolve('./src/views'))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/static',express.static(resolve('./src/public')));

const path = resolve('./products.json')
const pm = new ProductManager(path)

const beforeMiddleware = async (req, res, next) => {
    req.pm = pm
    next()
}
app.use('', beforeMiddleware)
app.use('', viewsRouter)

app.use('/api/products/',
    productsRouter,
    async (req, res, next) => {
        if (req.method != 'GET') {
            const products = await pm.getProducts()
            io.emit('productsUpdate', {products})
        }
        next()
    }
);

app.use((error, req, res, next)=>{
    console.log(error.stack)
    res.status(500).send()
})

const port = 8080
const server = app.listen(port, () => {
    console.log(`Server listening on port ${port}`)
})

const io = new Server(server)

io.on('connection', async socket => {
    const products = await pm.getProducts()
    socket.emit('productsUpdate', {products})
    socket.on('addProduct', async data => {
        try {
            const { title, description, price, code, stock, category } = data
            await pm.addProduct(title, description, price, undefined, code, stock, category)
            const products = await pm.getProducts()
            io.emit('productsUpdate', {products})
        } catch(error) {
            io.emit('error', error)
        }
    })
})
