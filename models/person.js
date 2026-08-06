const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

const phoneSchema = new mongoose.Schema({
  name: { type: String, minLength: 3, required: true },
  number: { type: String, minlength: 10, required: true },
})
phoneSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  },
})

const Phone = mongoose.model('Phone', phoneSchema)

module.exports = Phone
