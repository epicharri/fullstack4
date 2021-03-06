const mongoose = require('mongoose')
const config = require('./../utils/config')

mongoose.set('useFindAndModify', true)

const url = config.MONGODB_URI

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

mongoose
  .connect(url, {
    useNewUrlParser: true
  })
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log(
      'Error connection to MongoDB:', error)
  })

const Blog = mongoose.model(
  'Blog',
  blogSchema
)

blogSchema.set('toJSON', {
  transform: (
    document,
    returnedObject
  ) => {
    returnedObject.id =
      returnedObject._id
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model(
  'Blog',
  blogSchema
)
