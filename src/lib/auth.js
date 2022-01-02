const userLogin = {}

userLogin.isLoggedIn = (req, res, next) => {
	if (req.isAuthenticated()) {
		return next()
	} else {
		return res.redirect('/signin')
	}
}

userLogin.isNotLoggedIn = (req, res, next) => {
	if (!req.isAuthenticated()){
		return next()
	} else {
		return res.redirect('/profile')
	}
}

module.exports = userLogin