
const express = require('express')
const mongoose = require('mongoose')
const route = require("./route/route")

const app = express()

app.use(express.json())

mongoose.connect("mongodb+srv://gabhishek:GAbhishekPassword@gabhishek01.dq23z80.mongodb.net/miniBlogs",{
      useNewUrlParser:true
})
.then( () => console.error("My DB is connected"))
.catch((err) => console.error(err))





app.use("/", route)

app.listen(3000 , () => {
      console.error("Express app rinning on port " + 3000);
})