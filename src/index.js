const express = require('express')
const cors = require('cors')
const app = express()

const db = require('../db/database')
const authRouter = require('./router/auth')
const uploadRouter = require('./router/upload')
const userRouter = require('./router/user')
require('dotenv').config({ path: 'variables.env' })

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch(err => console.log('Error: ' + err))

app.use(express.json())
app.use(cors())

app.use('/api', authRouter)
app.use('/api', uploadRouter)
app.use('/api', userRouter)

app.listen(process.env.PORT || 4000, err => {
  if (err) {
    console.log(err)
  }
  console.log(`listening port ${process.env.PORT || 4000}`)
})
