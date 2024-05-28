import { Router } from 'express';
import productManager from '../dao/clases/productManager.js';

const router = Router();

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener un producto por ID
router.get('/:pid', async (req, res) => {
  try {
    const product = await productManager.getProductById(req.params.id);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  try {
    const product = await productManager.addProduct(req.body);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar un producto
router.put('/:pid', async (req, res) => {
  try {
    const product = await productManager.updateProduct(req.params.id, req.body);
    if (!product) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar un producto
router.delete('/:pid', async (req, res) => {
  try {
    await productManager.deleteProduct(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

