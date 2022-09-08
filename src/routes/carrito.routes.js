import { Router } from "express"
import { carritoControllers } from "../controller/carrito.controller.js"

const carritoRouter = Router()

// CREA CARRITO Y RETORNA EL ID
carritoRouter.post('/', carritoControllers.crearCarrito)

// VACIA EL CARRITO Y LO ELIMINA
carritoRouter.delete('/:id', carritoControllers.borrarCarrito)

// LISTAR PRODUCTOS DE UN CARRITO SEGUN SU ID
carritoRouter.get('/:id/productos', carritoControllers.getProductosDelCarrito)

// AGREGAR PRODUCTOS A UN CARRITO SEGUN SU ID
carritoRouter.post('/:id/productos', carritoControllers.guardarProductoEnCarritoPorId)

// ELIMINAR UN PRODUCTO DE UN CARRITO SEGUN ID DE CARRITO Y DE PRODUCTO
carritoRouter.delete('/:id/productos/:id_prod', carritoControllers.borrarProductoDeCarritoPorId)

export default carritoRouter