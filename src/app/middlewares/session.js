const User = require('../models/User')

function onlyUsers(req, res, next){
    if(!req.session.userId) 
    return res.redirect("/admin/login")

    next()
}

function isLoggedRedirectToUsers(req, res, next){
    if(req.session.userId) 
    return res.redirect("/admin/profile")
    
    next()
}

async function isAdmin(req, res, next) {
    const user = await User.findOne({ where:  { id: req.session.userId }  })

    if(user.is_admin != true)
    return res.redirect('/admin/profile')

    next()
}

module.exports = {
    onlyUsers,
    isLoggedRedirectToUsers,
    isAdmin
}