
const express = require('express')
const app = express()
require('dotenv').config()

const Person = require('./models/person')

app.use(express.static('dist'))

const errorHandler = (error, request, response, next) => {
  console.error(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
  return response.status(400).json({ error: error.message })
  }
  next(error)
}

const cors = require('cors')

app.use(cors())
app.use(express.json())

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}


var morgan = require('morgan')
morgan.token('type', function (req, res) { return req.headers['content-type'] })
app.use(morgan('tiny'))


app.get('/', (req, res) => {
  res.send('<h1>Hello World!</h1>')
})

const persons = []

app.get('/api/persons', (req, res) => {
  Person.find({}).then(ps => {
    res.json(ps)
  })
})


app.post('/api/persons', (request, response, next) => {
  const body = request.body

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person.save().then(p => {
    response.json(p)
  })
    .catch(error => next(error))
})


app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(p => {
    if (p) {
      response.json(p)
    } else {
      response.status(404).end()
    }
  })
  .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(n => {
      if (n > 0) {
        const now = new Date();
        response.send(`Phonebook has info for ${n} people.<br>${now}`);
      } else {
        response.status(404).end();
      }
    })
    .catch(error => next(error));
});



app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})