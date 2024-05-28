const express = require('express')
const router = express.Router()
const fs = require('fs').promises
const path = require('path')

const carritoFilePath = path.join(__dirname, '../data/carrito.json')


router.post('/', async (req, res) => {
    const newCart = {
        id: Math.random().toString(36).substr(2, 9),
        products: []
    };
    try {
        const data = await fs.readFile(carritoFilePath, 'utf8')
        const carritos = JSON.parse(data)
        carritos.push(newCart)
        await fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2));
        res.status(201).json(newCart)
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

router.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
    try {
        const data = await fs.readFile(carritoFilePath, 'utf8');
        const carritos = JSON.parse(data);
        const cart = carritos.find(cart => cart.id === cartId);
        if (cart) {
            res.json(cart.products)
        } else {
            res.status(404).send('Carrito no encontrado')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

router.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    try {
        let data = await fs.readFile(carritoFilePath, 'utf8')
        let carritos = JSON.parse(data)
        const cartIndex = carritos.findIndex(cart => cart.id === cartId)
        if (cartIndex !== -1) {
            const productIndex = carritos[cartIndex].products.findIndex(product => product.id === productId)
            if (productIndex !== -1) {
                carritos[cartIndex].products[productIndex].quantity++;
            } else {
                carritos[cartIndex].products.push({ id: productId, quantity: 1 })
            }
            await fs.writeFile(carritoFilePath, JSON.stringify(carritos, null, 2))
            res.status(201).send('Producto agregado al carrito')
        } else {
            res.status(404).send('Carrito no encontrado')
        }
    } catch (error) {
        console.error(error)
        res.status(500).send('Error interno del servidor')
    }
})

module.exports = router