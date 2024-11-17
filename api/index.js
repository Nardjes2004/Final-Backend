import { Router } from "express";
import users from "./users.js";
import product from "./products.js";
import test from "./test.js";
import orders from "./orders.js";
import auth from "./auth.js";
import views from "./views.js";
import products from "./products.js";

export default () => {
    let api = Router();

    api.use('/users', users())

    api.use('/products', products())

    api.use('/orders', orders())

    api.use('/auth', auth())

    api.use('/views', views())

    api.use('/test', test())

    return api
}