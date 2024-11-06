import { Router } from 'express'

export default () => { 
    let router = Router()

    //Creating a new user
    //We are going to receive data about user (In the body of the request)
    // /api/users
    router.post('/', (req, res) => {
        const data = req.body
        console.log(req.params)
        // Operations to DB

        res.send({
            message: "Success",
            user: data
        })
    })


    //Update a user
    router.put('/:id', (req, res) => {
        const { id } = req.params
        console.log(id)
        //Let's look for the user with id
        //If it exists we update it

        res.send({
            success: true,
            message: `User with id = ${id} has been updated`
        })
    })


    return router

}
