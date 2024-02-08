const mongoose = require('mongoose');

const userCollection = "users"
const usersSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    email:{type: String, unique: true},
    password: String,
    carts: {type:[
        {
            cart:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"carts"
            }
        }
    ]},
    role: String

})

// const usersSchema = new mongoose.Schema({
//     name: String,

//     email: 
//     {
//         type: String, unique: true
//     },
//     password: String

// },
//     {
//         timestamps: {
//             updateAt: "FechaUltMod", createdAt: "FechaAlta"
//         }
//     }

// )
const usersModel = mongoose.model(userCollection, usersSchema)
module.exports = usersModel 

