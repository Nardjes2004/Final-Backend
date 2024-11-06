import express from 'express'
import logger from './middlewares/logger.js'
import api from './api/index.js'

const app = express()
const PORT = 8000

app.use(express.json())
app.use(logger)

app.use('/api', api())

// Un ensemble de fonction/ endpoint / actions defined by a URL and a method
app.get('/', (req, res) => {
    // Manipulating DB
    // Fetching data
    res.send('Hello World !')
})

app.get('/second_endpoint', (req, res) => {
    res.send('Second Endpoint')
})




app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});