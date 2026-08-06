const Person = require('../models/person')
const personRouter = require('express').Router()
personRouter.use((request, response, next) => {
  console.log(`\n[HTTP] ${request.method} ${request.path}`)
  console.log('[HTTP] query =>', JSON.stringify(request.query))
  console.log('[HTTP] body  =>', JSON.stringify(request.body))
  next()
})

personRouter.get('/', async (request, response, next) => {
  console.log('[ROUTE] GET / start')
  try {
    const result = await Person.find({})
    console.log(`[ROUTE] GET / success (${result.length} people)`)
    response.json(result)
  } catch (error) {
    console.error('[ROUTE] GET / error', error)
    next(error)
  }
})

personRouter.get('/info', async (request, response, next) => {
  const now = new Date()
  console.log('[ROUTE] GET /info start')
  try {
    const l = await Person.countDocuments({})
    console.log(`[ROUTE] GET /info success count=${l}`)
    response.send(
      `The PHONEBOOK has info of ${l} people<br/>${now.toString()}`,
    )
  } catch (error) {
    console.error('[ROUTE] GET /info error', error)
    next(error)
  }
})

personRouter.get('/:id', async (request, response, next) => {
  console.log(`[ROUTE] GET /${request.params.id} start`)
  try {
    const person = await Person.findById(request.params.id)
    if (person) {
      console.log('[ROUTE] GET /:id found person')
      return response.json(person)
    } else {
      console.warn('[ROUTE] GET /:id person not found')
      return response.status(404).json({ error: 'Person not found' })
    }
  } catch (error) {
    console.error('[ROUTE] GET /:id error', error)
    next(error)
  }
})

personRouter.put('/:id', async (request, response, next) => {
  const body = request.body
  console.log(`[ROUTE] PUT /${request.params.id} start`, body)
  try {
    const updatedContact = await Person.findByIdAndUpdate(
      request.params.id,
      {
        name: body.name,
        number: body.number,
      },
      {
        new: true,
        runValidators: true,
      },
    )

    if (!updatedContact) {
      console.warn('[ROUTE] PUT /:id person not found')
      return response.status(404).json({ error: 'Person not found' })
    }

    console.log('[ROUTE] PUT /:id success', updatedContact)
    response.json(updatedContact)
  } catch (error) {
    console.error('[ROUTE] PUT //:id error', error)
    next(error)
  }
})

personRouter.post('/', (request, response, next) => {
  const body = request.body
  console.log('[ROUTE] POST / start', body)

  if (!body.name) {
    console.warn('[ROUTE] POST / validation failed: missing name')
    return response.status(400).json({
      error: 'name is missing',
    })
  }

  if (!body.number) {
    console.warn('[ROUTE] POST / validation failed: missing number')
    return response.status(400).json({
      error: 'number is missing',
    })
  }
  const savedContact = new Person({
    name: body.name,
    number: body.number,
  })
  savedContact
    .save()
    .then((result) => {
      console.log('[ROUTE] POST / success', result)
      response.json(result)
    })
    .catch((error) => {
      console.error('[ROUTE] POST / error', error)
      next(error)
    })
})

personRouter.delete('/:id', (request, response, next) => {
  console.log(`[ROUTE] DELETE /${request.params.id} start`)
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      if (result) {
        console.log('[ROUTE] DELETE /:id deleted')
        response.status(204).end()
      } else {
        console.warn('[ROUTE] DELETE /:id not found')
        response.status(404).json({ error: 'not found' })
      }
    })
    .catch((error) => {
      console.error('[ROUTE] DELETE /:id error', error)
      next(error)
    })
})

module.exports=personRouter