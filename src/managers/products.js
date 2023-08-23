import fs from 'fs'

export class ProductError extends Error {
    constructor(code, message) {
        super()
        this.code = code
        this.message = message
    }
}

export class ProductManager {
    constructor(path) {
        this.path = path
        if (fs.existsSync(path)) {
            const data = fs.readFileSync(path, 'utf8')
            const products = JSON.parse(data)
            this.nextProductID = Math.max(...products.map((p)=> p.id)) + 1
        } else {
            this.nextProductID = 0
        }
    }

    addProduct = async (title, description, price, thumbnails, code, stock, category, status = true) => {
        const products = await this.getProducts()
        const idx = products.findIndex((v) => v.code == code)
        if (idx != -1) {
            const error = 'Código de producto ya utilizado'
            throw new ProductError(409, error)
        }

        price = +price
        stock = +stock
        status = !!status
        if (!title || !description || !price || !code || !category || (!stock && stock != 0) ) {
            const error = `Todos los campos son obligatorios`
            throw new ProductError(400, error)
        }

        const id = this.nextProductID
        this.nextProductID += 1
        const product = {
            id,
            title, 
            description,
            price,
            code,
            category,
            stock,
            status,
            thumbnails,
        }
        
        products.push(product)
        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    getProductIndexByID = (products, id) => {
        const idx = products.findIndex((v, i) => v.id == id)
        if (idx == -1) {
            const error = `Producto con ID ${id} no encontrado`
            throw new ProductError(404, error)
        }
        return idx
    }

    getProductById = async (id) => {
        const products = await this.getProducts()
        const idx = this.getProductIndexByID(products, id)
        return products[idx]
    }

    getProducts = async () => {
        if (fs.existsSync(this.path)) {
            const data = await fs.promises.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } else {
            return []
        }
    }

    updateProduct = async (pid, productData) => {
        const products = await this.getProducts()
        const idx = this.getProductIndexByID(products, pid)

        const product = products[idx]

        // Separo el posible campo 'id' para no sobreescribirlo, los de precio, stock y status para forzar al tipo correcto,
        // y thumbnails para agregar al array en vez de sobreescribirlo (no aclara nada la consigna pero me parece mas logico, usted dira)
        const { id, price, stock, thumbnails, status, ...data } = productData
        if (price) {data.price = +price}
        if (stock) {data.stock = +stock}
        if (status) {data.status = !!status}
        if (Array.isArray(thumbnails)) {product.thumbnails = [...product.thumbnails, ...thumbnails]}

        Object.assign(product, data)

        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }

    deleteProduct = async (id) => {
        const products = await this.getProducts()
        const idx = this.getProductIndexByID(products, id)
        products.splice(idx, 1)

        await fs.promises.writeFile(this.path, JSON.stringify(products))
    }
}