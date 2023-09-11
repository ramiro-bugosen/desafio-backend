import express from "express";
import {ProductManager} from "./ProductManager.js"
const port = 8080;
const app = express();

const productManager = new ProductManager("./src/products.json");

app.use(express.urlencoded({extended:true}));

app.get("/products", async (req, res) => {
    try {
        const limit = parseInt(req.query.limit);
        const products = await productManager.getProducts();

        if ((limit)) {
            const limitProducts = products.slice(0, limit);
            res.json(limitProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        console.log("Error al obtener los productos");
    }
});

app.get("/products/:productId", async (req, res) => {
    try {
        const productId = parseInt(req.params.productId); 
        const product = await productManager.getProductById(productId);

        if (product) {
            res.json(product);
        } 
    } catch {
        res.send("<h2>Error al buscar el producto</h2>")
    }
});

app.listen(port,()=>console.log("Servidor en linea"));