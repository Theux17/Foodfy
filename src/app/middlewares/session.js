module.exports = function onlyUsers(req, res, next){
    if(!req.session.userId) 
    return res.redirect("/admin/login")

    next()
}
