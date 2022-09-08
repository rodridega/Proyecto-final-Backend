import fs from 'fs'
import { v4 as prodID } from 'uuid'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const productosDB = path.join(__dirname, '../database/products.txt')

const admin = true

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

const getProductoPorId = async (req, res) => {  
    const { id } = req.params
    try {
        const dbData = await leerArchivo(productosDB)                    
        if (!id) {
            res.send(dbData)                                                 
        } else {
            const info = dbData.find(product => product.id == id)            
            if (info) {                                                      
                res.send(info)
            } else { 
                res.status(400).json({ error : 'producto no encontrado' })
            }
        }
    
    } catch (error) {
        console.error(`El error es: ${error}`)
    }
}

const guardarProducto = async (req, res) => {       
    if (admin == true) {
        const { name, price, urlImage, description, code, stock } = req.body                              
    
        if ( !name || !price || !urlImage || !description || !code || !stock ) {                         
            res.status(400).json({ error : 'por favor ingrese todos los datos del producto' })   

        } else {                 
                                                                            
            const product = req.body                                                                      

            try {
                const dbData = await leerArchivo(productosDB)                                        
                product.id = prodID()                                                                     
                product.timeStamp = Date.now()                                                            
                dbData.push(product)                                                                      
                await fs.promises.writeFile(productosDB, JSON.stringify(dbData, null, 2), err => {        
                    if(err) throw err
                })
                res.status(200).json({ messaje: 'producto cargado con exito'})
            } catch (error) {
                console.error(`El error es: ${error}`)
            }
        }
    } else {
        res.status(400).json({ messaje: 'usted no tiene permisos para consultar esta url'})
    }
}

const actualizarProductoPorId = async (req, res) => {  
    if (admin == true) {
        const { id } = req.params                                                                   
        const { name, price, urlImage, description, code, stock } = req.body                        
        
        if ( !name || !price || !urlImage || !description || !code || !stock ) {                    
            res.status(400).json({ error : 'por favor ingrese todos los datos del producto' })                          
        } else {
            try {
                const dbData = await leerArchivo(productosDB)
                let contador = 0
                for ( let prod = 0; prod < dbData.length; prod++) {                    
                    if (dbData[prod].id == id) {
                        dbData[prod].name = name
                        dbData[prod].price = price
                        dbData[prod].urlImage = urlImage
                        dbData[prod].description = description
                        dbData[prod].code = code
                        dbData[prod].stock = stock
                        dbData[prod].timeStamp = Date.now()
                        contador += 1
                        break
                    }
                }
                if ( contador != 0 ) {
                    await fs.promises.writeFile(productosDB, JSON.stringify(dbData, null, 2), err => {    
                        if(err) throw err
                    })
                    res.status(200).json({ messaje : 'producto actualizado con exito' })
                } else {
                    res.status(400).json({ error : 'producto no encontrado' })                           
                }
            } catch (error) {
                console.error(`El error es: ${error}`)
            }
        }
    } else {
        res.status(400).json({ messaje: 'usted no tiene permisos para consultar esta url'})
    }
}

const borrarProductoPorId = async (req, res) => {   
    if (admin == true) {
        const { id } = req.params                                                                       
        try {
            const dbData = await leerArchivo(productosDB)
            const pordIndex = dbData.findIndex(product => product.id == id)                             
            if ( pordIndex != -1) {                                                                     
                dbData.splice(pordIndex, 1)                                                             
                await fs.promises.writeFile(productosDB, JSON.stringify(dbData, null, 2), err => {      
                    if(err) throw err
                })
                res.status(200).json({ messaje : 'producto borrado con exito' })
            } else {
                res.status(400).json({ error : 'producto no encontrado' })
            }

        } catch (error) {
            console.error(`El error es: ${error}`)
        }
    } else {
        res.status(400).json({ messaje: 'usted no tiene permisos para consultar esta url'})
    }
}

export const productsController = {
    getProductoPorId,
    guardarProducto,
    actualizarProductoPorId,
    borrarProductoPorId
}