const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios');
app.use(bodyParser.urlencoded({ extended: true }))// for parsing (form data) i.e. application/x-www-form-urlencoded//this is the middleware we talked about using req.body
app.use(bodyParser.json())
const path = require('path');
app.set('view engine','ejs');//tell my app to use express and ejs
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/',(req,res)=>{
  res.send('heeello')
})
app.get('/user',(req,res)=>{
    res.render('form.ejs')
})
app.post('/user',async(req,res)=>{
  const {username}=req.body
    // console.log(username)
    try {
      const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
      // const userInfo = response.data.result[0];
      
      var udata = response.data.result[0]
      console.log(udata)
      // res.json(userInfo);
      res.render('display.ejs', {udata})
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch user information' });
    }
})
app.listen(3000,()=>{
    console.log("on port 3000!!!")
})
