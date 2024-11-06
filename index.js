import express from 'express'
import logger from './middlewares/logger.js'
import api from './api/index.js'

const app = express()
const PORT = 8000

app.use(express.json())
app.use(logger)

app.use('/api', api())



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});