import express from 'express'
import logger from './middlewares/logger.js'
import api from './api/index.js'
import CONFIG from './config.json' with {type:"json"}
import mongoose from 'mongoose'
import cors from 'cors'
import swagger from './api/swagger.js'

const app = express()

app.use(cors({
    origin: CONFIG.corsOrigin,
    optionsSuccessStatus: 200,
}));


mongoose
    .connect(CONFIG.mongo_url)
    .then(() => {
        app.use(express.json())
        app.use(logger)

        app.use('/api', api())

        //template engine config
        app.set('view engine', 'pug')
        app.set('views', './views')

        app.use('/api-docs', swagger())


        app.listen(CONFIG.port, () => {
            console.log(`Server listening on port ${CONFIG.port}`);
        });
    })