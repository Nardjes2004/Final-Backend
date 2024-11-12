import { Router } from "express";
import { ordersCollections } from "../models/index.js";

export default () => {

    const router = Router()

    router.get('/', async (req, res) => {

        const options = {}
        if (req.query.skip) {// query has skip
            options.skip = req.query.skip
        }
        // continue with limit same as skip
        const result = await ordersCollections.find({}, 'username email', options)
    })



    router.post('/create', async (req, res) => {
        const { user, products, total_price, status } = req.body;

        try {
            for (let item of products) {
                const product = await productsCollection.findById(item.product_id);
                if (!product) {
                    return res.status(400).send(`Product with ID ${item.product_id} not found`);
                }
                if (product.stock < item.quantity) {
                    return res.status(400).send(`Insufficient stock for product ${product.name}`);
                }
            }


            const order = await ordersCollections.create({
                user,
                products,
                total_price,
                status
            });


            res.json({ success: true, order });

        } catch (error) {
            res.status(500).send('Error creating order');
        }
    });


    const STATUSES = ["shipped", "processing", "delivered"];
    router.put("/:orderid/:status", async (req, res) => {
        const orderid = req.params.orderid
        const status = req.params.status

        const check = await ordersCollections.findById(orderid)

        const newIndex = STATUSES.indexOf(status)
        const oldIndex = STATUSES.indexOf(check.status)
        if (oldIndex >= newIndex) {
            res.send({
                success: false,
                message: "You can't change the status to a lower one"
            })
        } else {
            check.status = status
            const newUpdate = await ordersCollections.findOneAndUpdate({ _id: orderid }, { status: status })
            res.send({
                success: true,
                message: newUpdate
            })
        }

    })

    
    return router
}