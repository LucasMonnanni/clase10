document.addEventListener('DOMContentLoaded', () =>{

const socket = io()

socket.on('productsUpdate', data => {
    const productsDiv = document.getElementById('products')
    productsDiv.innerHTML = ''
    data.products.forEach(product => {
        const d = document.createElement('div')

        d.innerHTML = `<p><b>ID: </b> ${product.id}</p>
        <p><b>Título: </b> ${product.title}</p>
        <p><b>Descripción: </b></p>
        <p>${product.description}</p>
        <p><b>Precio: </b>${product.price}</p>
        <p><b>Código: </b>${product.code}</p>
        <p><b>Categoría: </b>${product.category}</p>
        <p><b>Stock: </b>${product.stock}</p>
        <hr>`
        productsDiv.appendChild(d)
    });
})

const form = document.getElementById('form')
form.addEventListener("submit",(e)=>{
    e.preventDefault()
    const formData = new FormData(e.target);
    const payload = {};
    formData.forEach((value, key) => (payload[key] = value));
    socket.emit('addProduct', payload)
    if (socket.hasListeners('error')) return 
    socket.on('error', error => {
        console.log(error)
        const productsDiv = document.getElementById('products')
        const p = document.createElement('p')
        p.style.color = '#ff0000'
        p.innerHTML = `Error: ${error.message}`
        productsDiv.appendChild(p)
    })
})

})