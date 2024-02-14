const mongoose = require('mongoose')

if (process.argv.length<3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb+srv://ruusu:${password}@cluster0.7g9zz2x.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
  })

const Person = mongoose.model('Person', personSchema)

if (process.argv.length>4){
    const name=process.argv[3]
    const number=process.argv[4]
      
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4],
      })
      
      person.save().then(result => {
        console.log('person saved!')
        mongoose.connection.close()
      })

}

else {
    console.log("phonebook:")
    Person.find({}).then(result => {
        result.forEach(note => {
          console.log(note.name, note.number)
        })
        mongoose.connection.close()
      })
}