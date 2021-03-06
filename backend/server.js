require('dotenv').config()
const app = require('express')()
const cors = require('cors')
const demux = require('./demux')
const postRoutes = require('./api/post/post.route')
const scoreRoutes = require('./api/score/score.route')
const io = require('./utils/io')

app.use(cors())

app.use('/posts', postRoutes)
app.use('/score', scoreRoutes)

const server = app.listen(process.env.PORT, () => console.info(`Example app listening on port ${process.env.PORT}!`))

io.connect(server)

demux.watch()
