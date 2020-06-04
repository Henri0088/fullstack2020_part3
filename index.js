require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
morgan.token('post-data', (req) => JSON.stringify(req.body))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :post-data'))

app.get('/api/persons', (request, response) => {
    Contact.find({}).then(result => {
        response.json(result)
    })
})

app.post('/api/persons', (request, response, next) => {
    const person = Object.assign({}, request.body)
    
    const newPerson = new Contact({
        name: person.name,
        number: person.number,
    })

    newPerson.save().then(savedPerson => {
        console.log(`Saved ${savedPerson} successfully`)
        Contact.find({}).then(result => {
            response.json(result)
        })
    })
    .catch(error => next(error))
    
})

app.get('/api/persons/:id', (request, response) => {
    const id = request.params.id
    
    Contact.findById(id)
        .then(result => {
            response.json(result)
        })
        .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
    const newInfo = request.body

    const contact = {
        name: newInfo.name,
        number: newInfo.number
    }

    Contact.findByIdAndUpdate(request.params.id, contact, { new: true })
        .then(updatedContact => {
            response.json(updatedContact)
        })
        .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
    const id = request.params.id
    Contact.findByIdAndRemove(id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))
})

app.get('/info', (request, response) => {
    let date = new Date()
    let day = date.toDateString()
    let time = date.toTimeString()
    
    Contact.countDocuments({})
        .then(count => {
            const page = (`<p>Phonebook has info for ${count} people <br> ${day} ${time} </p>`)
        response.send(page)
        })
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({error: 'malformatted id'})
    } else if (error.name === "ValidationError") {
        return res.status(400).json({ error: error.message })
    }
    next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})