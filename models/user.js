const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const config = require('./../utils/config')

mongoose.set('useFindAndModify', true)
const url = config.MONGODB_URI

mongoose
  .connect(url, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log(
      'Error connection to MongoDB:',
      error
    )
  })

const userSchema = mongoose.Schema({
  username: {
    type: String,
    minLength: 3,
    unique: true,
    required: true
  },
  name: String,
  passWordHash: String,
  blogs: [
    {
      type:
        mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ]
})

userSchema.set('toJSON', {
  transform: (
    document,
    returnedObject
  ) => {
    returnedObject.id =
      returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passWordHash
  }
})

userSchema.plugin(uniqueValidator)

module.exports = mongoose.model(
  'User',
  userSchema
)
