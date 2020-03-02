const express = require('express')
const cors = require('cors')
const app = express()

const db = require('../db/database')
const models = require('../models')

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

models.sequelize
  .sync()
  .then(() => {
    initial()
    console.log('Seems like the backend is running fine...')
  })
  .catch(err => {
    console.log(err, 'Something went wrong with the operation')
  })

app.use(cors())
app.use(express.json())

app.listen(process.env.PORT || 4000, err => {
  if (err) {
    console.log(err)
  }
  console.log(`listening port ${process.env.PORT || 4000}`)
})
