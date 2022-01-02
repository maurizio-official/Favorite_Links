const express = require('express')
const router = express.Router()

const pool = require('../database')

const { isLoggedIn } = require('../lib/auth')

router.get('/add', isLoggedIn, (req, res) => {
	res.render('links/add')
})

router.post('/add', isLoggedIn, async (req, res) => {
	const { title, url, description } = req.body
	const newLink = {
		title,
		url,
		description,
		user_id: req.user.id
	}
	await pool.query('INSERT INTO links SET ?', newLink)
	req.flash('success', 'Links saved successfully')
	res.redirect('/links')
})

router.get('/', isLoggedIn, async (req, res) => {
	const links = await pool.query('SELECT * FROM links WHERE user_id = ?', req.user.id)
	res.render('links/list', { links })
})

router.get('/delete/:id', isLoggedIn, async (req, res) => {
	await pool.query('DELETE FROM links WHERE id = ?', req.params.id)
	req.flash('success', 'Links removed successfully')
	res.redirect('/links')
})

router.get('/edit/:id', isLoggedIn, async (req, res) => {
	const links = await pool.query('SELECT * FROM links WHERE id = ?', req.params.id)
	res.render('links/edit', { link: links[0] })
})

router.post('/edit/:id', isLoggedIn, async (req, res) => {
	const { title, description, url } = req.body
	const newLink = {
		title,
		description,
		url
	}
	await pool.query('UPDATE links SET ? WHERE id = ?', [newLink, req.params.id])
	req.flash('success', 'Links edited successfully')
	res.redirect('/links')
})

module.exports = router