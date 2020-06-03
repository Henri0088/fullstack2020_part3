require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')
const app = express()

let persons = [
    {
        name: "Arto Hellas",
        number: "040-123456",
        id: 1
    },
    {
        name: "Ada Lovelace",
        number: "39-44-532523523",
        id: 2
    },
    {
        name: "Dan Abramov",
        number: "12-23-7858595",
        id: 3
    },
    {
        name: "Mary Poppendieck",
        number: "44-23-9293222",
        id: 4
    }
]

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

app.post('/api/persons', (request, response) => {
    const person = Object.assign({}, request.body)
    if (!person.name) {
        response.status(400).json({error: 'no name found'})
        return
    } else if (!person.number) {
        response.status(400).json({error: 'no number found'})
        return
    }

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
    
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(p =>  p.id === id)

    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
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

    const page = (`<p>Phonebook has info for ${persons.length} people <br> ${day} ${time} </p>`)
    response.send(page)
})

const unknownEndpoint = (req, res) => {
    res.status(404).send({error: 'unknown endpoint'})
}

app.use(unknownEndpoint)

const errorHandler = (error, req, res, next) => {
    if (error.name === "CastError") {
        return res.status(400).send({error: 'malformatted id'})
    }
    next(error)
}

app.use(errorHandler)

const port = process.env.PORT || 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})