const express = require('express');
const app = express();
const bodyParser = require('body-parser')
const axios = require('axios');
const session = require('express-session')
app.use(session({ secret: 'thisIsSecret' }))
app.use(bodyParser.urlencoded({ extended: true }))// for parsing (form data) i.e. application/x-www-form-urlencoded//this is the middleware we talked about using req.body
app.use(bodyParser.json())
const path = require('path');
app.set('view engine', 'ejs');//tell my app to use express and ejs
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))
// app.get('*',(req,res)=>{
//   res.render('infoError.ejs')
// })
// app.post('*',(req,res)=>{
//   res.render('infoError.ejs')
// })
app.get('/', (req, res) => {
  // res.send('heeello')
  res.render('info.ejs')
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
    console.log(username)
    let udata = response.data.result[0]
    // console.log(udata)
    // res.json(userInfo);
    res.render('display.ejs', { udata })
  } catch (error) {
    res.render('error1.ejs')
  }
})
/*yha user ke problems ka route bna */
app.get('/user/problems', (req, res) => {
  res.render('problems.ejs')
})
/**yha pr dropdown se post request accept kro */
// var mySolvedProblemsFinal = []
// var solvedProblemsFinal = []
app.post('/:user/topic', async (req, res) => {
  let solvedProblemsFinal = []
  //  let mySolvedProblemsFinal = []
  let solvedProblems = []
  const { tag, username } = req.body;
  req.session.tag = tag
  req.session.username = username
  console.log(`${username} + ${tag}`)
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
              rating: prob.problem.rating,
              green: "cardProblems"
            })
          }
        }
      }
    }
    solvedProblems.sort((a, b) => {
      return a.rating - b.rating;
    });
    let lastName = solvedProblems[0].name
    solvedProblemsFinal.push(solvedProblems[0]);
    for (let prob of solvedProblems) {
      if (prob.name !== lastName) {
        solvedProblemsFinal.push({
          name: prob.name,
          contestId: prob.contestId,
          index: prob.index,
          rating: prob.rating,
          green: "cardProblems"
        })
        lastName = prob.name;
      }
    }
    // console.log(solvedProblems.length)
    res.render('problems.ejs', { solvedProblemsFinal, tag, username })
  }
  catch (error) {
    res.render('error2.ejs', { tag, username })
  }
})
app.post('/user/topic/progress', async (req, res) => {
  //console.log(req.body)
  // console.log(`${req.session.tag}`)
  // console.log(`${req.session.username}`)
  let username = `${req.session.username}`
  let username1 = username
  let tag = `${req.session.tag}`
  let tag1 = tag
  let solvedProblems = []
  let solvedProblemsFinal2 = []
  /********************************************** */
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
              rating: prob.problem.rating,
              green: "cardProblems"
            })
          }
        }
      }
    }
    solvedProblems.sort((a, b) => {
      return a.rating - b.rating;
    });
    let lastName = solvedProblems[0].name
    solvedProblemsFinal2.push(solvedProblems[0]);
    for (let prob of solvedProblems) {
      if (prob.name !== lastName) {
        solvedProblemsFinal2.push({
          name: prob.name,
          contestId: prob.contestId,
          index: prob.index,
          rating: prob.rating,
          green: "cardProblems"
        })
        lastName = prob.name;
      }
    }
    // console.log(solvedProblems.length)
    // res.render('problems.ejs', { solvedProblemsFinal2, tag, username })
  }
  catch (error) {
    res.render('error2.ejs', { tag, username })
  }
  /******************************************************************* */

  for (let prob of solvedProblemsFinal2) prob['green'] = "cardProblems"
  let mySolvedProblemsFinal = []
  const { yourHandle, hiddenTag } = req.body;
  // console.log(yourHandle)
  // console.log(hiddenTag)
  let mySolvedProblems = []
  try {
    const response = await axios.get(`https://codeforces.com/api/user.status?handle=${yourHandle}&from=1&count=100000`)
    var myAllProblems = response.data.result
    // console.log(myAllProblems)
    for (let prob of myAllProblems) {
      if (prob.verdict == 'OK') {
        for (let tagSearched of prob.problem.tags) {
          if (tagSearched == hiddenTag) {
            mySolvedProblems.push({
              name: prob.problem.name,
              contestId: prob.problem.contestId,
              index: prob.problem.index,
              rating: prob.problem.rating,
              green: "cardProblems"
            })
          }
        }
      }
    }
    mySolvedProblems.sort((a, b) => {
      return a.rating - b.rating;
    });
    let lastName = mySolvedProblems[0].name
    mySolvedProblemsFinal.push(mySolvedProblems[0]);
    for (let prob of mySolvedProblems) {
      if (prob.name !== lastName) {
        mySolvedProblemsFinal.push({
          name: prob.name,
          contestId: prob.contestId,
          index: prob.index,
          rating: prob.rating,
          green: "cardProblems"
        })
        lastName = prob.name;
      }
    }
    // console.log(mySolvedProblemsFinal)
    // const setOfMyAllSolvedProblemsFinal = new Set(mySolvedProblemsFinal);/
    // console.log(setOfMyAllSolvedProblemsFinal)
    // console.log(solvedProblemsFinal)
    for (let prob of solvedProblemsFinal2) {
      for (let myProb of mySolvedProblemsFinal) {
        if (prob.name == myProb.name) {
          prob['green'] = "greenCardProblems";
        }
      }
    }
    console.log(`${username1} + ${tag1} + ${yourHandle}`)
    // console.log(solvedProblemsFinal)
    res.render('progress.ejs', { solvedProblemsFinal2, tag1, username1, yourHandle, hiddenTag })
    // res.send("it worked")
  }
  catch (error) {
    res.render('error1.ejs')
  }

})
app.listen(4000, () => {
  console.log("on port 3000!!!")
})