import express from 'express'
import logger from './middlewares/logger.js'

const app = express()
const PORT = 8000

app.use(express.json())
app.use(logger)


// Un ensemble de fonction/ endpoint / actions defined by a URL and a method
app.get('/', (req, res) => {
    // Manipulating DB
    // Fetching data
    res.send('Hello World !')
})

app.get('/second_endpoint', (req, res) => {
    res.send('Second Endpoint')
})

//Creating a new user
//We are going to receive data about user (In the body of the request)
app.post('/user', (req, res) => {
    const data = req.body
    console.log(req.params)
    // Operations to DB

    res.send({
        message: "Success",
        user: data
    })
})


//Update a user
app.put('/user/:id', (req, res) => {
    const { id } = req.params
    console.log(id)
    //Let's look for the user with id
    //If it exists we update it
    res.send({
        success: true,
        message: `User with id = ${id} has been updated`
    })
})

// Search products by term
app.get('/products', (req, res) => {
    const {search_term, size} = req.query
    
    
    res.send({
        success: true,
        message: `products of ${search_term} size ${size}`
    })
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});