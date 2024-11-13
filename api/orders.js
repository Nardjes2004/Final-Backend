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
    router.patch('/:orderId/products', async (req, res) => {
        const { orderId } = req.params;
        const { products } = req.body;


        try {

            const order = await ordersCollection.findById(orderId);
            if (!order) {
                return res.status(404).send('Order not found');
            }

            if (['shipped', 'delivered'].includes(order.status)) {
                return res.status(400).send('Cannot modify an order that has been shipped or delivered');
            }

            for (let item of products) {
                const product = await productsCollection.findById(item.product_id);
                if (!product) {
                    return res.status(400).send(`Product with ID ${item.product_id} not found`);
                }
                if (product.stock < item.quantity) {
                    return res.status(400).send(`Insufficient stock for product ${product.name}`);
                }

                const newUpdatePro = await productsCollection.findOneAndUpdate({ _id: item.product_id }, { stock: product.stock - item.quantity }, { returnDocument: 'after' })
            }

            const newUpdate = await ordersCollection.findOneAndUpdate({ _id: orderId }, { products: [...order.products, ...products] }, { returnDocument: 'after' })

            if (newUpdate) {
                res.send({ success: true, user: newUpdate })
            } else {
                res.send({ success: false, message: 'Server Error' })
            }

        } catch {
            res.status(500).send('Error updating order');
        }
    });

    router.delete('/:orderId', async (req, res) => {
        const { orderId } = req.params;

        try {
            const order = await ordersCollection.findById(orderId);
            if (!order) {
                return res.status(404).send('Order not found');
            }

            for (let item of order.products) {
                const product = await productsCollection.findById(item.product_id);
                if (!product) {
                    return res.status(400).send(`Product with ID ${item.product_id} not found`);
                }
            }

            const deletedOrder = await ordersCollection.findByIdAndDelete(orderId)

            if (deletedOrder) {
                for (let item of order.products) {
                    const inc = await productsCollection.findByIdAndUpdate({ _id: item.product_id }, { $inc: { stock: item.quantity } }, { returnDocument: 'after' });
                    res.send('Success of deleting order');
                }
            }

            if (deletedOrder) {
                res.send({ success: true, message: 'Order deleted successfully' });
            } else {
                res.status(500).send('Error deleting order');
            }
        } catch (error) {
            res.status(500).send('Error deleting order');
        }
    });

    router.get('/by_status', async (req, res) => {
        const stat = (req.query.status || '').split(',')
        const result = await ordersCollections.find({ status: { $in: stat } })
        if (result) {
            res.send({
                success: true,
                response: result
            })
        } else {
            res.send({
                success: true,
                message: 'try again'
            })
        }

    })
    
    return router
}