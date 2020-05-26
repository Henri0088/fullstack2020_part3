const express = require('express')
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

app.get('/api/persons', (request, response) => {
    response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
    console.log('yep')
    const id = Number(request.params.id)
    persons = persons.filter(p => p.id !== id)

    response.status(204).end()
})

app.get('/info', (request, response) => {
    let date = new Date()
    let day = date.toDateString()
    let time = date.toTimeString()

    const page = (`<p>Phonebook has info for ${persons.length} people <br> ${day} ${time} </p>`)
    response.send(page)
})

const port = 3001
app.listen(port, () => {
    console.log(`Server running on port ${port}`)
})