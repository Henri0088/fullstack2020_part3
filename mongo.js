const mongoose = require('mongoose')

const password = process.argv[2]
const url = `mongodb+srv://fullstack2020:${password}@cluster0-qt5am.mongodb.net/phonebook?retryWrites=true&w=majority`

mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true})

const conSchema = new mongoose.Schema({
    name: String,
    number: String,
})

var Contact = mongoose.model("Contact", conSchema)

if (process.argv.length <= 3) {
    Contact.find({}).then(result => {
        console.log('Phonebook:')
        result.forEach(contact => {
            console.log(`${contact.name} ${contact.number}`)
        })
        mongoose.connection.close()
    })
} else {
    const newContact = new Contact({
        name: process.argv[3],
        number: process.argv[4],
    })
    
    newContact.save().then(response => {
        console.log(`added ${response.name} number ${response.number} to phonebook`)
        mongoose.connection.close()
    })
}

