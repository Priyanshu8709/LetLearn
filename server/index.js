const express = require('express')
const app = express()
const port = 3000
const db = require('./config/db')

db.connect()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use('/api', require('./routes'))

app.get('/', (req, res) => res.send('Hello World!'))
app.listen(port, () => console.log(`App listening on port ${port}!`))