import Product from '../models/product.model.js';

class ProductManager {
  async getProducts() {
    try {
      return await Product.find();
    } catch (error) {
      throw new Error('Error al obtener los productos');
    }
  }

  async getProductById(id) {
    try {
      return await Product.findById(id);
    } catch (error) {
      throw new Error('Error al obtener el producto por ID');
    }
  }

  async addProduct(productData) {
    try {
      const product = new Product(productData);
      await product.save();
      return product;
    } catch (error) {
      throw new Error('Error al agregar el producto');
    }
  }

  async updateProduct(id, productData) {
    try {
      return await Product.findByIdAndUpdate(id, productData, { new: true });
    } catch (error) {
      throw new Error('Error al actualizar el producto');
    }
  }

  async deleteProduct(id) {
    try {
      await Product.findByIdAndDelete(id);
    } catch (error) {
      throw new Error('Error al eliminar el producto');
    }
  }
}

export default new ProductManager();
