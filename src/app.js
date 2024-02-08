//const handlebars = require('express-handlebars')
//file = fileStore(sessions)
// /const fileStore = require('session-file-store');
//const { Server } = require('socket.io');
//const sessions = require('express-session');

const express = require('express');
const path = require('path');
const { engine } = require('express-handlebars');
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const passport = require('passport');
const  usersModel  = require('./dao/models/users.model');
const {initPassport} = require('./config/passport.config');
const cookieParser = require('cookie-parser');
const {authCall} = require('./utils')

//routers
const routerProducts = require('./routes/products.router');
const sessionRouter = require('./routes/session.router');
const routerCarts = require('./routes/carts.router');
const routerViews = require('./routes/views.router');

const PORT = 8080
const app = express();

const server = app.listen(PORT, () => console.log("Server online port " + PORT))

// /const io = new Server(server)


// app.use(sessions(
//     {
//         secret: "codercoder123",
//         resave: true, saveUninitialized: true,
//         store: mongoStore.create(
//             {
//                 mongoUrl: 'mongodb+srv://oliveiradiogo00:**********************@cluster0.pgeuig7.mongodb.net/?retryWrites=true&w=majority',
//                 mongoOptions: { dbName: "ecommerce" },
//                 ttl: 3600
//             }
//         )
//     }
// ))


//app.use(passport.session())
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
initPassport()
app.use(cookieParser())

app.use(passport.initialize())
//app.use("/api/sessions", passport.authenticate("jwt", {session:false}), sessionRouter)

//app.engine('handlebars', handlebars.engine());
app.engine('handlebars', engine());



app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '/views'));
app.use(express.static(path.join(__dirname, '/public')));

app.use('/', routerViews)
app.use('/api/products', routerProducts)
app.use('/api/carts', routerCarts)
app.use('/api/sessions', sessionRouter)

// app.get('/current', authCall(), passport.authenticate('jwt', {session:false}), (req,res)=>{
//     res.send(req.user)
// })



async function dataBase() {
    try {
        //await mongoose.connect('mongodb+srv://oliveiradiogo00:*********************@cluster0.pgeuig7.mongodb.net/?retryWrites=true&w=majority',{dbName:'carts'})
        await mongoose.connect('mongodb+srv://oliveiradiogo00:z2xGXgqIUN2fgTzo@cluster0.pgeuig7.mongodb.net/?retryWrites=true&w=majority', { dbName: 'ecommerce' })
        console.log('DB online')
    } catch (error) {
        console.log(error.message)
    }
}

dataBase()


//module.exports = {io}



