import express from "express";
import {ProductManager} from "./ProductManager.js"
const port = 8080;
const app = express();

const productManager = new ProductManager("./src/products.json");

app.use(express.urlencoded({extended:true}));

app.get("/products", async (req, res) => {
    try {
        const products = await productManager.getProducts();
        res.json(products);
    } catch (error) {
        ("Error al obtener los productos");
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