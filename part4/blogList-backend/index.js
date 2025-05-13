const app = require('./app')
const config = require('./utils/config')
const info = require('./utils/logger').info

app.listen(config.PORT, () => {
    info(`Server running on port ${config.PORT}`)
})