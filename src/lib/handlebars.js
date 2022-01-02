const {format} = require('timeago.js')

const helpers = {}

helpers.timeago = (timespamp) => {
	return format(timespamp)
}

module.exports = helpers