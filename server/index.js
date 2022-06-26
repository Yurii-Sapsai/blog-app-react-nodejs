import express  from "express";


const app = express()
app.get('/', (req, res) => {
    res.send('hello world!')
})

app.listen(4444, (error) => {
    if(error){
        return console.log(error)
    }
    
    console.log("Server start!")
})A