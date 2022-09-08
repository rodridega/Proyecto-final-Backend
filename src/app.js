import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url'
import carritoRouter from './routes/carrito.routes.js'
import productosRouter from './routes/productos.routes.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const app = express()
const PORT = process.env.PORT || 8080

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static(path.join(__dirname, 'public')))

app.set('port', PORT)

app.use('/api/productos', productosRouter)
app.use('/api/carrito', carritoRouter)

export default app