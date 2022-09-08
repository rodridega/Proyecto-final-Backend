import fs from 'fs'
import { v4 as cartID } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const dbCart = path.join(__dirname, '../database/cart.txt')
const dbProducts = path.join(__dirname, '../database/products.txt')

const leerArchivo = async (file) => {  

    try {
        const data = await fs.promises.readFile(file, 'utf-8', (err, data) => {         
            if(err) throw err
            return data
        })
        return JSON.parse(data)                                                         
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const crearCarrito = async (req, res) => {    

    try {
        const dbData = await leerArchivo(dbCart)                                        
        const cart ={ id: cartID(), timestamp: Date.now(), products:[] }                     
        dbData.push(cart)                                                                    
        await fs.promises.writeFile(dbCart, JSON.stringify(dbData, null, 2), err => {        
            if(err) throw err
        })
        res.status(200).json({ messaje: `carrito creado con éxito, ID: ${cart.id}`})
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const borrarCarrito = async (req, res) => {   
    const { id } = req.params                                                                   
    try {
        const dbData = await leerArchivo(dbCart)
        const indexCart = dbData.findIndex(cart => cart.id == id)                               
        if (indexCart != -1) {                                                                  
            dbData.splice(indexCart, 1)                                                        
            await fs.promises.writeFile(dbCart, JSON.stringify(dbData, null, 2), err => {       
                if(err) throw err
            })
            res.status(200).json({ messaje: 'carrito borrado con éxito'})
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }

    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const getProductosDelCarrito = async (req, res) => {

    const { id } = req.params                                
     try {
        const dbData = await leerArchivo(dbCart)
        dbData.forEach(cart => {
            if (cart.id == id) {                             
            res.send(cart.products)                      
            }
        })
        
     } catch (error) {
        console.error(`El error es: ${error}`)
     }
}

const guardarProductoEnCarritoPorId = async (req, res) => { 
    const { id } = req.params                                           
    const { arrID } = req.body                                         
    try {
        const dbDataCart = await leerArchivo(dbCart)
        const cartIndex = dbDataCart.findIndex(cart => cart.id == id)   
        if (cartIndex != -1) {                                          
            const dbDataProducts = await leerArchivo(dbProducts)
            const infoProducts = []
            dbDataProducts.forEach(product => {                         
                arrID.forEach(id => {
                    if (product.id == id) infoProducts.push(product)
                })  
            })
            if (infoProducts.length != 0) {                                       
                let union = dbDataCart[cartIndex].products.concat(infoProducts)   
                dbDataCart[cartIndex].products = union
                await fs.promises.writeFile(dbCart, JSON.stringify(dbDataCart, null, 2), err => {   
                    if(err) throw err
                })
                res.status(200).json({ messaje: 'productos agregados con éxito'})
            } else {
                res.status(400).json({ error: 'productos no encontrados'})
            }
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const borrarProductoDeCarritoPorId = async (req, res) => { 

    const { id , id_prod } = req.params

    try {
        const dbDataCart = await leerArchivo(dbCart)
        const cartInfo = dbDataCart.find( cart => cart.id == id )                                   
        if (cartInfo) {                                                                             
            const prodIndex = cartInfo.products.findIndex(product => product.id == id_prod)         
            if (prodIndex != -1) {                                                                  
                cartInfo.products.splice(prodIndex, 1)
                await fs.promises.writeFile(dbCart, JSON.stringify(dbDataCart, null, 2), err => {   
                })
                res.status(200).json({ messaje: 'producto borrado con éxito'})
            } else {
                res.status(400).json({ error: 'producto no encontrado'})
            }
        } else {
            res.status(400).json({ error: 'carrito no encontrado'})
        }
        
    } catch (error) {
        
    }
}

export const carritoControllers = {
    crearCarrito,
    borrarCarrito,
    getProductosDelCarrito,
    guardarProductoEnCarritoPorId,
    borrarProductoDeCarritoPorId
}