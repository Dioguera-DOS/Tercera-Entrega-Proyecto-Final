const CartsManager = require('../dao/manager/cartsManager');
const cartsManager = new CartsManager();

const { Router } = require('express');
const router = Router();
const { mongoose } = require('mongoose');
const cartsModel = require('../dao/models/carts.model');


router.get('/', async (req, res) => {
    try {
        const carts = await cartsModel.find({});
        res.status(200).json(carts);
    } catch (error) {
        res.status(500).json({ error: "Error de servidor" });
    }
});

router.get('/:cid', async (req, res) => {
    try {
        const cartId = req.params.cid
        const cart = await cartsModel.findOne({_id:cartId});
        //const cart = await cartsManager.getCartById(cartId);
        if (cart ) {res.status(200).json({message: `carts with ${cartId}, found it`, cart})} 
    } catch (error) {
        return res.status(500).json({message: "Carrito no encontrado"});
    }
});


router.post('/', async (req, res) => {
    const product = req.body

    if (!product) {
        return res.status(400).json({
            status: 'error',
            error: "Incomplete data, make sure specify the products to be added to the cart"
        })
    }
    try {
        let createCart = await cartsModel.create({ product });
        if (createCart) {
            res.setHeader('Content-Type', 'application/json');
            return res.status(201).json({ message: `Cart created!!` });
        } else {
            res.status(500).json({ error: "Error creando carrito" });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/:cid/product/:pid', async (req, res) => {
    //const cartId = parseInt(req.params.cid);
    const cartId = req.params.cid;
    //const productId = parseInt(req.params.pid);
    const productId = req.params.pid
    const result = await cartsManager.addProductToCart(cartId, productId);
    if (result.status === 200) {
        res.status(200).json({ message: result.message });
    } else if (result.status === 404) {
        res.status(404).json({ error: result.error });
    } else {
        res.status(500).json({ error: result.error });
    }
});




module.exports = router