const { Router } = require('express');
const usersModel = require('../dao/models/users.model');
const router = Router();
const crypto = require('crypto');
const passport = require('passport');


const { generateToken, authCall, passportCall } = require('../utils')

// router.get('/github',passport.authenticate('github',{}), (req, res)=> {
// })
// router.get('/callbackGithub',passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req, res)=> {
// })
// router.get('/errorGithub',passport.authenticate('github',{failureRedirect:"/api/sessions/errorGithub"}), (req, res)=> {
// })

// router.get("/pruebas", passport.authenticate('jwt', {session:false}), (req,res)=>{
//     res.send("PRUEBAS...!!!")
// })

// // app.get('/usuario', auth, (req,res)=>{
//     router.get('/usuario', passport.authenticate('jwt', {session:false}), (req,res)=>{
//     res.send("PRUEBAS...!!!")

// })

router.post('/login', async (req, res) => {
    let { email, password } = req.body

    if (!email || !password) {
        return res.redirect('/login?error=Complete todos los datos')
    }

    password = crypto.createHmac("sha256", "coderCoder123").update(password).digest("hex")

    let usuarios = await usersModel.find({ email, password })

    let usuario = usuarios.find(u => u.email === email && u.password === password)

    if (!usuario) {
        res.setHeader('Content-Type', 'text/html');
        return res.status(400).redirect(`/login?error=credenciales invalidas!!!`)
    }
    //req.session.usuario = {nombre:usuarios.name, email:usuarios.email}
    let token = generateToken(usuarios)
    res.cookie("userCookie", token, { maxAge: 1000 * 60 * 60, httpOnly: true })
    console.log(token)
    return res.render('home')
})

router.get('/perfil', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //res.status(200).json({message:"user logged!!!", usuario:user})
    //router.get('/usuario', authCall, (req,res)=>{
        
    return res.render('perfil')
    // res.status(200).json({
    //     mensaje:'Usuario Logueado...!!!',
    //     usuario: req.user
    // });
});

router.post('/register', async (req, res) => {
    //let {name, email, password } = req.body
    let { first_name, last_name, email, rol, password, age } = req.body

    if (!first_name || !last_name || !email || !password) {
        return res.redirect('/register?error=Complete todos los datos')
    }

    let usuario = await usersModel.findOne({ email })

    console.log(usuario)

    if (usuario) {
        return res.redirect(`/register?error=Existen usuarios con email${email} en base de datos!!`)
    }

    password = crypto.createHmac("sha256", "coderCoder123").update(password).digest("hex")
    let users
    try {

        users = await usersModel.create({ first_name, last_name, email, role: rol === 'adm' ? 'adm' : 'user', password, age })
        console.log(users)
        res.redirect(`/login?message=Usuario ${email} registro correctamente`)

    } catch (error) {
        console.log(error.message)
        res.redirect('/register?error=Error unexpected. Reload a fel minutes!!')
    }
})




router.get('/logout', (req, res) => {
    req.usuario(error => {
        if (error) {
            res.redirect('/login?error=fallo en el logout!!!')
        }
    })

    res.redirect('/login')
})


module.exports = router

