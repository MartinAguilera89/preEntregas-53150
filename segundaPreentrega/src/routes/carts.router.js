import { Router } from "express";
import cartModel from "../dao/models/cart.model.js";
import productModel from "../dao/models/product.model.js";

const cartRouter = Router();

cartRouter.get("/:cid", async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartModel.findById(cartId).populate('products.product');
    if (cart) {
      res.send({ cart });
    } else {
        res.status(404).send({ error: "Carrito no encontrado" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Error al obtener el carrito" });
    }
  });
  
  cartRouter.post("/:cid/add/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartModel.findById(cid);
      const product = await productModel.findById(pid);
  
      if (!cart) {
        return res.status(404).send({ error: "Carrito no encontrado" });
      }
  
      if (!product) {
        return res.status(404).send({ error: "Producto no encontrado" });
      }
  
      const existingProductIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      );
  
      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += 1;
      } else {
        cart.products.push({ product: pid, quantity: 1 });
      }
  
      await cart.save();
      res.send({ message: "Producto agregado al carrito", payload: cart });
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Error al agregar producto al carrito" });
    }
  });
  
  cartRouter.delete("/:cid/remove/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
      const cart = await cartModel.findById(cid);
  
      if (!cart) {
        return res.status(404).send({ error: "Carrito no encontrado" });
      }
  
      const productIndex = cart.products.findIndex(
        (item) => item.product.toString() === pid
      );
  
      if (productIndex >= 0) {
        cart.products.splice(productIndex, 1);
        await cart.save();
        res.send({ message: "Producto eliminado del carrito", payload: cart });
      } else {
        res.status(404).send({ error: "Producto no encontrado en el carrito" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Error al eliminar producto del carrito" });
    }
  });
  
  export default cartRouter;
  
   
