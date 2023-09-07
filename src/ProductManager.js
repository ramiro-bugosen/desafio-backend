import fs from "fs";

export class ProductManager{
    constructor(filePath){
        this.filePath = filePath;
    }

    fileExist(){
        return fs.existsSync(this.filePath);
    }
    async GenerateId() {
        try {
            const products = await this.getProducts();
            if (products.length === 0) {
                return 1;
            }
            const maxId = Math.max(...products.map(product => product.id));
            return maxId + 1;
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
    async getProducts(){
        try{
            if(this.fileExist()){
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                const contenidoJson = JSON.parse(contenido);
                return contenidoJson;
            } else{
                throw new Error("No se pudo mostrar los productos")
            }
        } catch(error){
            console.log(error.message);
            throw error;
        }
    }
    
    async getProductById(productId) {
        try {
            const products = await this.getProducts();
            const product = products.find(product => product.id === productId);
            if (product) {
                return product;
            } else {
                throw new Error("Producto no encontrado.");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
    async updateProduct(productId, newProduct) {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex(product => product.id === productId);
    
            if (productIndex !== -1) {
                products[productIndex] = { id: productId, ...newProduct };
                await fs.promises.writeFile(this.filePath, JSON.stringify(products, null, "\t"));
                console.log("Producto actualizado");
            } else {
                throw new Error("Producto no encontrado.");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
    async deleteProduct(productId) {
        try {
            const products = await this.getProducts();
            const updatedProducts = products.filter(product => product.id !== productId);
    
            if (updatedProducts.length < products.length) {
                await fs.promises.writeFile(this.filePath, JSON.stringify(updatedProducts, null, "\t"));
                console.log("Producto eliminado");
            } else {
                throw new Error("Producto no encontrado.");
            }
        } catch (error) {
            console.log(error.message);
            throw error;
        }
    }
    async addProducts(productsInfo){
        try{
            const { title, description, price, thumbnail, code, stock } = productsInfo;

        if (!title || !description || !price || !thumbnail || !code || !stock) {
            throw new Error("Todos los campos deben estar completos.");
        }
        const products = await this.getProducts();
        const duplicateCode = products.some(product => product.code === code);
        if (duplicateCode) {
            throw new Error("Ya existe un producto con este codigo.");
        }
            if(this.fileExist()){
                const contenido = await fs.promises.readFile(this.filePath,"utf-8");
                 const contenidoJson = JSON.parse(contenido);
                 const newProductId = await this.GenerateId();
                 const newProduct = {
                 id: newProductId, ...productsInfo
            };
                 contenidoJson.push(newProduct);
                 await fs.promises.writeFile(this.filePath,JSON.stringify(contenidoJson,null,"\t"));
                 console.log("Producto agregado");
            }else{
                 throw new Error("Error al agregar el producto")
            }
        }catch (error) {
            console.log(error.message);
            throw error;
        }
    }
};

const operations = async ()=>{
    try {
        const manager = new ProductManager("./products.json");
        const products = await manager.getProducts();
        console.log(products);
        await manager.addProducts(  //agrego un producto
           {title:"Computadora AMD", 
            description:"Computadora AMD, Ryzen 5 3400g",
            price: 87000,
            thumbnail: "Sin Imagen",
            code: "abc001",
            stock: 8}
        )
        await manager.addProducts(  //agrego un producto
            {title: "Computadora Intel",
             description: "Computadora Intel, i7 11700k",
             price: 92000,
             thumbnail: "Sin Imagen",
             code: "abc002",
             stock: 13}
        )
        await manager.updateProduct(1, { // modifico el producto con id 1 
            title: "Computadora de la prehistoria",
            description: "Computadora de hace 50 años de antiguedad",
            price: 120000,
            thumbnail: "Sin Imagen",
            code: "abc003",
            stock: 1
        });
        await manager.deleteProduct(2)// elimina un producto
        
    } catch (error) {
        console.log(error.message);
    }
}
