import { Router } from "express"
import { productsController } from "../controller/products.controller.js"

const productosRouter = Router()



// LISTA UN PRODUCTO SEGUN SU ID (SI NO HAY ID, LISTA TODOS)
productosRouter.get('/:id?', productsController.getProductoPorId)

// GUARDA UN PRODUCTO
productosRouter.post('/', productsController.guardarProducto)

// ACTUALIZA UN PRODUCTO SEGUN SU ID
productosRouter.put('/:id', productsController.actualizarProductoPorId)

// BORRA UN PRODUCTO SEGUN SU ID
productosRouter.delete('/:id', productsController.borrarProductoPorId)

export default productosRouter