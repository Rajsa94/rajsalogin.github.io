const express = require('express')
const app = express()
const port = 8000
const hbs = require("hbs")
const path = require("path")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken');
const session = require("express-session")
var cookieParser = require('cookie-parser')
require("./db/conn")
const Register = require("./models/registration")
const auth = require("../middleware/auth")


// console.log(path.join(__dirname, '../public/css'))
const publicsatic = path.join(__dirname, "../public")
const templatesatic = path.join(__dirname, "../templates/views")
const partialssatic = path.join(__dirname, "../templates/partials")

app.use(express.static(publicsatic))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  
}))


app.set("view engine", "hbs")
app.set("views", templatesatic);
hbs.registerPartials(partialssatic)

app.get('/', (req, res) => {
  res.render('registration')
})
app.get('/login', (req, res) => {
  res.render("login")
})
// app.get('/home', (req, res) => {
//   res.render("home")
// })
app.get('/home', auth,async(req, res) => {
   const raj = await Register.find({})
  //  console.log(raj)
   res.render("home", { list: raj })
})

app.post('/', async (req, res) => {
  const Password = req.body.password;
  const CPassword = req.body.cpassword;

  if (Password === CPassword) {
    const registeremp = new Register({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
    })

    const token = await registeremp.generateAuthToken();
    console.log("the error part" + token);

    res.cookie("jwt", token)


    const raj = await registeremp.save();
    res.render("login", { raj })
    // res.redirect("login", raj)
  } else {
    res.send("paswoord is not matching")
  }


})
app.post('/login', async(req, res) => {
  try {
    const Email = req.body.email;
    const Password = req.body.password;
    var useremail = await Register.findOne({email:Email})
    
    
    

    const isMatch = bcrypt.compare(Password, useremail.password);
    
    const token = await useremail.generateAuthToken();
    console.log("the error part" + token);

    res.cookie("jwt", token)

    
    
    //  if (useremail.password === Password) {
    //         res.status(201).render("login")
            
    //     }else{
    //         res.send("pasward are not matching")
    //     }
    if (isMatch) {
      // res.render("home", {data:useremail})

      req.session.user_id = useremail._id;
      
      res.redirect("empprofile")
      
      
  }else{
      res.send("pasward are not matching")
  }


  } catch (e) {
    res.send("paswoord is not login matching")
  }
  
});


// edit & delete
app.get('/registration/edit/:id', async(req, res) => {
  try {
    const raj = await Register.findById(req.params.id)
    res.render("empprofile", {
                   viewTitle: "update Employee",
                   registration: raj
               })
} catch (e) {
    res.status(400).send(e);
}
})
app.post('/registration/edit/:id', async(req, res) => {
  try {
    const registeremp = ({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      cpassword: req.body.cpassword,
    })
    const raj = await Register.findByIdAndUpdate(req.params.id, registeremp)
    res.render("home",{registration: raj})
} catch (e) {
    res.status(400).send(e);
}
res.redirect("/home")
})
app.get("/registration/delete/:id", async(req, res) => {
  // Employee.findByIdAndRemove(req.params.id, (err, doc) => {
  //     if (!err) {
  //         res.render("list")

  //     }
  // })
  try {
      const rajb = await Register.findByIdAndRemove(req.params.id)
      res.redirect("/home")
  } catch (error) {
      res.status(400).send(e);
  }
  
});

// app.get('/empprofile', (req, res) => {
//   res.render("empprofile")
// })
app.get('/empprofile',auth, async(req, res) => {
  
    const raj = await Register.findById({_id:req.session.user_id})
    console.log(req.session.user_id)
    res.render("empprofile",{data:raj})

})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
