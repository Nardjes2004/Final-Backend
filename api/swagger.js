import { Router } from "express"

import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger.json' with {type: 'json'};


export default () => {

    let router = Router()

    router.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

    return router
}