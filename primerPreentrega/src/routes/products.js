const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')

const productosFilePath = path.join(__dirname, '../data/productos.json')


router.get('/', async (req, res) => {
    try {
        const data = await fs.readFile(productosFilePath, 'utf8')
        const productos = JSON.parse(data)
        res.json(productos)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

router.get('/:pid', async (req, res) => {
    const productId = req.params.pid
    try {
        const data = await fs.readFile(productosFilePath, 'utf8')
        const productos = JSON.parse(data)
        const producto = productos.find(producto => producto.id === productId)
        if (producto) {
            res.json(producto)
        } else {
            res.status(404).send('Producto no encontrado')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

router.post('/', async (req, res) => {
    const newProduct = req.body

    const requiredFields = ['title', 'description', 'code', 'price', 'stock', 'category']
    for (const field of requiredFields) {
        if (!(field in newProduct)) {
            return res.status(400).send(`Falta el campo obligatorio: ${field}`)
        }
    }

    newProduct.id = Math.random().toString(36).substr(2, 9)
    if (!('status' in newProduct)) {
        newProduct.status = true
    }
    if (!('thumbnails' in newProduct)) {
        newProduct.thumbnails = []
    }

    try {
        const data = await fs.readFile(productosFilePath, 'utf8')
        const productos = JSON.parse(data)
        productos.push(newProduct)
        await fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2))
        res.status(201).json(newProduct)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor');
    }
})

router.put('/:pid', async (req, res) => {
    const productId = req.params.pid
    const updatedProduct = req.body
    try {
        let data = await fs.readFile(productosFilePath, 'utf8')
        let productos = JSON.parse(data)
        const index = productos.findIndex(producto => producto.id === productId)
        if (index !== -1) {
            productos[index] = { ...productos[index], ...updatedProduct }
            await fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2))
            res.json(productos[index]);
        } else {
            res.status(404).send('Producto no encontrado')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

router.delete('/:pid', async (req, res) => {
    const productId = req.params.pid
    try {
        let data = await fs.readFile(productosFilePath, 'utf8')
        let productos = JSON.parse(data)
        const index = productos.findIndex(producto => producto.id === productId);
        if (index !== -1) {
            productos.splice(index, 1)
            await fs.writeFile(productosFilePath, JSON.stringify(productos, null, 2));
            res.status(204).send()
        } else {
            res.status(404).send('Producto no encontrado')
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Error interno del servidor')
    }
})

module.exports = router