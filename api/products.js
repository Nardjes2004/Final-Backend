import { Router } from "express";
import { ordersCollections, productsCollection } from "../models/index.js";
import moment from "moment";
import authMiddleware from "../middlewares/auth.js";

export default () => {

    let router = Router()

    router.get("/get_all_products", async (req, res) => {
        try {
            const result = await productsCollection.find({});
            res.send({ success: true, response: result });
        } catch (err) {
            res.send({ success: false, message: "Error fetching products", error: err });
        }
    });


    router.get("/get_product/:id", async (req, res) => {
        try {
            const productId = req.params.id; // Convert id to a number
            // const productId = parseInt(req.params.id, 10); // Convert id to a number
    
            if (isNaN(productId)) {
                return res.status(400).json({
                    success: false,
                    message: "Invalid product ID",
                });
            }
    
            // Find product by ID
            const product = await productsCollection.findOne({ id: productId });
    
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: "Product not found",
                });
            }
    
            res.status(200).json({
                success: true,
                response: product,
            });
        } catch (err) {
            console.error("Error fetching product by ID:", err);
            res.status(500).json({
                success: false,
                message: "Error fetching product",
                error: err,
            });
        }
    });
    

//     // Endpoint to fetch product by ID
// router.get('/get_product/:id', async(req, res) => {
//     const productId = parseInt(req.params.id, 10); // Convert id to a number
//     const product = productsCollection.find((item) => item.id === productId);

//     if (!product) {
//         return res.status(404).json({
//             success: false,
//             message: "Product not found"
//         });
//     }

//     return res.status(200).json({
//         success: true,
//         response: product
//     });
// });

    // router.post('/get_products_by_ids', async (req, res) => {
    //     const { ids } = req.body; // Expecting an array of IDs in the request body
    //     try {
    //       if (!ids || !Array.isArray(ids)) {
    //         return res.status(400).send({ success: false, message: "Invalid IDs format" });
    //       }
      
    //       const products = await productsCollection.find({ id: { $in: ids } });
    //       res.send({ success: true, response: products });
    //     } catch (error) {
    //       console.error('Error fetching products by IDs:', error);
    //       res.status(500).send({ success: false, message: "Server error", error });
    //     }
    //   });
    router.post("/filter-dynamically", async (req, res) => {
        const options = {}
        let projection = null
        let filter = {}

        // Building the filter 
        if (req.body.name) {
            filter.name = { $regex: req.body.name }
        }
        if (req.body.category) {
            filter.category = { $regex: req.body.category }
        }
        if (req.body.price) {
            filter.price = { $gt: req.body.price }
        }
        if (req.body.stock) {
            filter.stock = { $gt: req.body.stock }
        }

        // Building the projection
        if (req.body.project) {
            projection = req.body.project
        }

        // Building the options
        if (req.query.skip) {
            options.skip = req.query.skip
        }
        if (req.query.limit) {
            options.limit = req.query.limit
        }
        console.log(filter)
        const list = await productsCollection.find(filter, projection, options)

        if (list) {
            res.send({
                success: true,
                count: list.length,
                data: list
            })
        } else {
            res.send({
                success: false,
                message: "Internal Server Error"
            })
        }
    })

    // Search products by term
    router.get('/', (req, res) => {
        const { search_term, size } = req.query

        // 

        res.send({
            success: true,
            message: `products of ${search_term} size ${size}`
        })
    })

    router.post('/', authMiddleware, async (req, res) => {
        const { name, category, price, stock } = req.body
        // !name || !category || !price || !stock
        if (name && category && price && stock) {
            const new_product = await productsCollection.create({ name, category, price, stock })
            if (new_product) {
                res.send({
                    success: true,
                    data: new_product
                })
            } else {
                res.send({
                    success: false,
                    message: "Internal Server Error"
                })
            }
        } else {
            res.send({
                success: false,
                message: "Please fill all the infos"
            })
        }
    })

    // Fetch all products that have price higher than :price parameter
    router.get("/filter_by_price/:price", async (req, res) => {
        const { price } = req.params

        // greater than or equal
        // $lte $eq
        const result = await productsCollection.find({ price: { $gt: price } }, 'name price', { skip: 1, limit: 1 })
        if (result) {
            res.send({ success: true, response: result })
        } else {
            res.send({ success: false, message: "Try again" })
        }
    })


    router.get("/filter_by_category/:category", async (req, res) => {
        const { category } = req.params

        const result = await productsCollection.find({ category: { $regex: category } })
        if (result) {
            res.send({ success: true, response: result })
        } else {
            res.send({ success: false, message: "Try again" })
        }
    })

    // Filter and fetch using skip and limit as optional parameters (query)
    // router.get("/filter", async (req, res) => {
    //     const options = {}

    //     if (req.query.skip) {
    //         options.skip = req.query.skip
    //     }
    //     if (req.query.limit) {
    //         options.limit = req.query.limit
    //     }
    //     const list = await productsCollection.find({}, null, options)

    //     if (list) {
    //         res.send({
    //             success: true,
    //             count: list.length,
    //             data: list
    //         })
    //     } else {
    //         res.send({
    //             success: false,
    //             message: "Internal Server Error"
    //         })
    //     }
    // })

    router.get('/test', async (req, res) => {
        const result = await productsCollection.aggregate([
            {
                $match: {
                    price: { $gt: 1 }
                }
            },
            {
                $project: {
                    name: 1,
                    price: 1,
                    category: 1
                }
            },
            {
                $group: {
                    _id: "$price",
                    sum_quantity: { $sum: "$price" },
                    products: { $push: '$$CURRENT' },
                }
            },
            // {
            //     $unwind: "$products" //Deconstruct by the field products
            // }
        ])

        res.send({ data: result, count: result.length })
    })

    // {
    //     $project: {
    //         name: 1,
    //             'orders._id': 1,
    //                 'orders.products': 1
    //     }
    // }
    //Get products that have been ordered in the past month
    router.get('/by_date/:month', async (req, res) => {
        const { month } = req.params
        try {
            const products = await productsCollection.aggregate([
                {
                    $lookup: {
                        from: 'orders',
                        localField: '_id',
                        foreignField: 'products.product_id',
                        as: 'orders'
                    }
                },
                // {
                //     $project: {
                //         name: 1,
                //             'orders._id': 1,
                //                 'orders.products': 1
                //     }
                // },
                {
                    $unwind: '$orders'
                },
                {
                    $unwind: '$orders.products'
                },
                {
                    $match: {
                        $expr: { $eq: ["$_id", "$orders.products.product_id"] },
                    }
                },
                {
                    $project: {
                        _id: 1,
                        name: 1,
                        'orders.createdAt': 1,
                        'orders.products': 1
                    }
                },
                {
                    $match: {
                        'orders.createdAt': { $gt: moment().subtract(month, 'month').toDate() }
                    }
                },
                {
                    $group: {
                        _id: "$_id",
                        sum_quantity: { $sum: "$orders.products.quantity" },
                        grouped_orders: { $push: "$orders" }
                    }
                },
            ])
            res.send(products)
        } catch (e) {
            res.send(e)
        }
    })


    return router

}