import { Router } from "express";

export default () => {
    let router = Router()

    // /api/views
    router.get('/', (req, res) => {
        res.render('index',
            { title: 'MY EMAIL', message: 'HEEY!' }
        )
    })

    router.get('/email', (req, res) => {
        res.render('email',
            { name: 'Fouzi', couponCode: "ADZCODE" }
        )
    })

    // nodemailer
    return router

}