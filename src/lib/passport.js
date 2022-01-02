const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const pool = require('../database')
const { encryptPassword, matchPassword } = require('./helpers')

passport.use('local.signin', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	const rows = await pool.query('SELECT * FROM users WHERE username = ?', username)
	if (rows.length > 0) {
		const user = rows[0]
		const validPassword = await matchPassword(password, user.password)
		if (validPassword) {
			return done(null, user, req.flash('success', 'Welcome ' + user.fullname))
		} else {
			return done(null, false, req.flash('message', 'Incorrect Password'))
		}
	} else {
		return done(null, false, req.flash('message', 'The Username does not exists'))
	}
}))

passport.use('local.signup', new LocalStrategy({
	usernameField: 'username',
	passwordField: 'password',
	passReqToCallback: true
}, async (req, username, password, done) => {
	 const { fullname } = req.body
	 const newUser = {
		 username,
		 password,
		 fullname
	 }
	newUser.password = await encryptPassword(password)
	const result = await pool.query('INSERT INTO users SET ?', newUser)
	newUser.id = result.insertId
	return done(null, newUser)
}))

passport.serializeUser((user, done) => {
	done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
	const rows = await pool.query('SELECT * FROM users WHERE id = ?', id)
	return done(null, rows[0])
})