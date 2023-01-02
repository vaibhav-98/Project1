
const express = require('express')
const mongoose = require('mongoose')
const route = require("./route/route")

const app = express()

app.use(express.json())

<<<<<<< HEAD
mongoose.connect("mongodb+srv://gabhishek:GAbhishekPassword@gabhishek01.dq23z80.mongodb.net/miniBlogs", {
      useNewUrlParser: true
=======
mongoose.connect("mongodb+srv://gabhishek:GAbhishekPassword@gabhishek01.dq23z80.mongodb.net/miniBlogs",{
      useNewUrlParser:true
>>>>>>> 9f1615ef81c1597a3b3cff9636d7e85afd300ce9
})
      .then(() => console.error("My DB is connected"))
      .catch((err) => console.error(err))



app.use("/", route)

app.listen(3000, () => {
      console.error("Express app rinning on port " + 3000);
})