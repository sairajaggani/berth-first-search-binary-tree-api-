const express= require("express")
const cors= require("cors")
const mongoose= require("mongoose")
require("dotenv/config")
const app= express()


app.use(cors({
    origin: '*'
}));


app.use(express.json())

const nodeRoute= require("./routes/node")
// const entryRoute= require("./routes/entry")

app.use("/api/node", nodeRoute)
// app.use("/api/entry", entryRoute)


mongoose.set('strictQuery', true);
mongoose.connect(
    process.env.DB_CONNECTION
    ).then(
        () => console.log("Connected to DB")
        ).catch(
            (err)=> {
                console.log(err)
            })


app.listen(process.env.PORT || 5000, ()=> {
    console.log("Listening on port: 5000")
})