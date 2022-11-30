import app from './app'
import './db/mongoose'

const port: number = parseInt(process.env.PORT!) || 8080

app.listen(port, () => {
  console.log('good-food: listening on port ' + port)
})
