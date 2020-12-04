const express = require('express')
const FormData = require('form-data');
const ef = require('express-fileupload')
const axios = require('axios')
const formidable = require('formidable');
var cors = require('cors')

const fs = require('fs');
const app = express()
app.use(cors())
app.use(ef({
    useTempFiles : true,
    tempFileDir : 'C:/tmp/'
}));



function recognize(path){

    const form = new FormData();
    form.append("file", fs.createReadStream(path));
    form.append('api_token', '')
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



app.post("/recog", function(req, res){
   recognize(req.files.audioFile.tempFilePath)
   .then((response) => {
        res.send(response)
   }).catch((err)=>{
       res.send(err)
   })
})

app.listen(9000, function(req, res){
    console.log("Listening on port 9000")

})
