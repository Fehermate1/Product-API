import express from "express";
import { dbQuery, dbRun } from "../database.js";

const router = express.Router();

//GET Metódus ami az összes adatot lekéri
router.get("/", async (req, res, next) => {
    try{
        const products = await dbQuery("SELECT * FROM products");
        res.status(500).json(products);
    } catch(err){
        next(err);
    }
});


//GET Metódus id alapján
router.get("/:id", async (req, res, next) => {
    try{
        const {product} = await dbQuery("SELECT * FROM products WHERE id = ?;", [req.params.id]);
        if(!product) return res.status(400).json({ message: "Product not found" });
        res.status(200).json(product); 
    } catch(err){
        next(err);
    }
});

//POST Metódus ami új adatot vesz fel az adatbázisba
router.post("/", async (req, res, next) => {
    try{
        const result = await dbRun("INSERT INTO products (productname, price) VALUES (?, ?);", [req.body.productname, req.body.price]);
        res.status(201).json({ id: result.lastID, ...req.body});
    } catch (err){
        next(err);
    }
});

//PUT metódus ami frissíti id alapján egy meglévő adat tulajdonságait
router.put("/:id", async (req, res, next) => {
    try{
        const {product} = await dbQuery("SELECT - FROM products WHERE id = ?;", [req.params.id]);
        if(!product) return res.status(404).json({ message: "Product not found"});

        await dbRun("UPDATE products SET productname = ? price = ? WHERE id = ?;",
            [req.body.productname || user.productname, req.body.price || user.price, req.body.id]);
            res.status(200).json({ id: req.params.id, productname: req.body.productname || user.productname, price: req.body.price || user.price})
    } catch(err){
        next(err);
    }
});


//DELETE metódus ami id alapján töröl egy adatot az adatbázisból
router.delete("/:id", async (req, res, next) => {
    try{
        const [product] = await dbQuery("SELECT * FROM products WHERE id = ?;", [req.params.id])
        if(!product) return res.status(404).json({ message: "Product not found"});

        await dbRun("DELETE FROM products WHERE id = ?;", [req.params.id]);
        res.status(204);
    } catch (err){
        next(err);
    }
});

export default router;