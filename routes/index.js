var express = require('express');
var router = express.Router();
const fetch = require('node-fetch');
let fs = require('fs');
var FormData = require('form-data');
const dotenv = require('dotenv');
dotenv.config();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express'});
});

router.post('/', (req, res) => {
  let sampleFile;
  let uploadPath;

  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const d = new Date();
  const prefix = d.getFullYear().toString()+d.getMonth().toString()+d.getDate().toString()+d.getHours().toString()+d.getMinutes().toString()+d.getSeconds().toString();
  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  sampleFile = req.files.imageupload;
  uploadPath = __dirname + '/../public/uploads/' + prefix+"_"+sampleFile.name;

  // Use the mv() method to place the file somewhere on your server
  //res.send('File uploaded!');
     
  sampleFile.mv(uploadPath, async function(err) {
    if (err)
      return res.status(500).send(err);
    
      var data = new FormData();
      data.append('chat_id', 86118049);
      data.append('photo', fs.createReadStream(uploadPath));
      data.append('caption', 'Tess');

      const BOT_TOKEN = process.env.BOT_TOKEN;
      //const endpoint = "https://api.telegram.org/bot1084075493:AAHCpWvSUYGZiCyqmrlhrv3pYQ9LjJ3L_U0/sendMessage"
      const endpoint = "https://api.telegram.org/bot"+BOT_TOKEN+"/sendPhoto"

      fetch(endpoint, {
          method: 'POST',
          headers: {
            ...data.getHeaders()
          },
          body: data // Here, stringContent or bufferContent would also work
      })
      .then(function(res) {
        return res.json();
      }).then(function(json) {
          res.send(json);
          console.log(json);
          fs.rm(uploadPath, (err)=> {
            console.log(err)
          })
      });
  })
})

module.exports = router;
