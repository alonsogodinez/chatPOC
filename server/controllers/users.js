const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwt: { secret : JWT_SECRET} } = require('../config')

module.exports = {
    add(req, res) {
        const { name, password } = req.body;
        const user = new User({ username, password });
        return user.save()
            .then( user => res.json({ user: { username } }))
            .catch(err => res.status(500).send({ error: err}))
    },

    list(req, res) {
        return User.find()
            .then(users => res.json({users}))
            .catch(err => res.status(500).send({ error: err}))
    },
    login(req, res) {

        const { username, password } = req.body;

        User.findOne({username})
            .then((user) => {
                return bcrypt.compare(password, user.password)
            })
            .then(match => {
                if (match) {
                    const payload = { username };
                    const options = { expiresIn: '2d' };
                    const token = jwt.sign(payload, JWT_SECRET, options);
                    res.json({ success: true, token })
                } else {
                    res.status(401).send({ error: 'Authentication error'})
                }

            })
            .catch(err => res.status(500).send({ error: err}))

    }

};