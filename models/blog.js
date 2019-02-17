const mongoose = require('mongoose')

mongoose.set('useFindAndModify', false)

const url = process.env.MONGODB_URI

const blogSchema = mongoose.Schema({
  title: String,
  author: String,
  url: String,
  likes: Number
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
      'Error connection to MongoDB:'
    ),
    error
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
