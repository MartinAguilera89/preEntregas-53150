import { Router } from 'express';
import productManager from '../dao/clases/productManager.js';

const router = Router();

router.get('/products', async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    const options = {
      limit: parseInt(limit, 10),
      page: parseInt(page, 10),
      sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
    };

    const filter = query ? { category: query, status: true } : {};

    const products = await productManager.getProducts(filter, options);

    res.render('products', {
      products: products.docs,
      totalPages: products.totalPages,
      prevPage: products.prevPage,
      nextPage: products.nextPage,
      page: products.page,
      hasPrevPage: products.hasPrevPage,
      hasNextPage: products.hasNextPage,
      prevLink: products.hasPrevPage ? `/products?limit=${limit}&page=${products.prevPage}&sort=${sort}&query=${query}` : null,
      nextLink: products.hasNextPage ? `/products?limit=${limit}&page=${products.nextPage}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
