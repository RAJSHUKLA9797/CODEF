const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios');
app.use(bodyParser.urlencoded({ extended: true }))// for parsing (form data) i.e. application/x-www-form-urlencoded//this is the middleware we talked about using req.body
app.use(bodyParser.json())
const path = require('path');
app.set('view engine', 'ejs');//tell my app to use express and ejs
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
app.get('/', (req, res) => {
  // res.send('heeello')
  res.redirect('/user')
})


/**get user root */
app.get('/user', (req, res) => {
  res.render('form.ejs')
})
app.post('/user', async (req, res) => {
  const { username } = req.body
  // console.log(username)
  try {
    const response = await axios.get(`https://codeforces.com/api/user.info?handles=${username}`);
    // const userInfo = response.data.result[0];

    var udata = response.data.result[0]
    // console.log(udata)
    // res.json(userInfo);
    res.render('display.ejs', { udata })
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user information' });
  }
})
/*yha user ke problems ka route bna */
app.get('/user/problems', (req, res) => {
  res.render('problems.ejs')
})
/**yha pr dropdown se post request accept kro */
app.post('/:user/topic', async (req, res) => {
  let solvedProblems = []
  const { tag, username } = req.body;
  // console.log(tag);
  // console.log(username);
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${username}&from=1&count=100000`)
    var allproblems = response.data.result
    for (let prob of allproblems) {
      if (prob.verdict == 'OK') {
        for (let tagSearched of prob.problem.tags) {
          if (tagSearched == tag) {
            solvedProblems.push({
              name: prob.problem.name,
              contestId: prob.problem.contestId,
              index: prob.problem.index,
              rating: prob.problem.rating
            })
          }
        }
      }
    }
    solvedProblems.sort((a, b) => {
      return a.rating - b.rating;
    });
    console.log(allproblems)
    res.render('problems.ejs', { solvedProblems })
  }
  catch (error) {
    res.status(500).json({ error: 'failed' })
  }
})
app.listen(4000, () => {
  console.log("on port 3000!!!")
})