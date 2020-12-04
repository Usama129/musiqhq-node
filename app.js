const express = require('express')
const FormData = require('form-data');
const ef = require('express-fileupload')
const axios = require('axios')
var cors = require('cors')

const PORT = process.env.PORT || 5000;

const fs = require('fs');
const app = express()
app.use(cors())
app.use(ef({
    useTempFiles : true,
    tempFileDir : '/tmp/'
}));



function recognize(path){

    const form = new FormData();
    form.append("file", fs.createReadStream(path));
    form.append('api_token', '210f7e7fb7de8c169995e9649ad94956')
    const request_config = {
        headers: {
            ...form.getHeaders()
        },
    data: form
    }

    return new Promise((resolve, reject) => {
        axios.post("https://api.audd.io/recognize/", form, request_config)
        .then(function (response) {
            resolve(response.data)
        })
        .catch(function (error) {
            reject(error)
        })
    })
}

app.get("/", function(req, res){
    res.send("Unviewable")
})

app.post("/recog", function(req, res){
   recognize(req.files.audioFile.tempFilePath)
   .then((response) => {
        res.send(response)
   }).catch((err)=>{
       res.send(err)
   })
})

app.listen(PORT, function(){
    console.log("Listening on " + PORT)
})
