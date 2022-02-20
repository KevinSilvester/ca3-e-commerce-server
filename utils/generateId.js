const { customAlphabet } = require('nanoid')
const { alphanumeric } = require('nanoid-dictionary')

const nanoid = customAlphabet(alphanumeric, 17)

const generateId = name => `${name}-${nanoid()}`

module.exports = generateId
