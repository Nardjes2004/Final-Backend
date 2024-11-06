import { Router } from "express";
import users from "./users.js";
import products from "./products.js";

export default () => {
    let api = Router();

    api.use('/users', users())

    api.use('/products', products())

    return api
}