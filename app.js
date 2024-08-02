
if(process.env.NODE_ENV !="production"){
  require('dotenv').config()
}

console.log(process.env.CLOUD_NAME);
const express=require("express");
const app=express();
const mongoose=require("mongoose");

const path=require("path");
const methodOverride = require("method-override");
const ejsMate=require('ejs-mate');
const ExpressError = require("./utils/ExpressError.js");


const listingRouter=require("./routes/listing.js")
const reviewRouter=require("./routes/review.js");
const userRouter=require("./routes/user.js")

const session =require("express-session");
const MongoStore = require('connect-mongo');
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const { serialize } = require("v8");
const user = require("./models/user.js");



//  we have developed our core backend in phase 1&2 which can be useful for any backend 

// in hase 3  it is not necessary for all web sites but for some 

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

app.use(express.static(path.join(__dirname,"/public")));
app.use(express.urlencoded({ extended: true }));
// this will only parse urlencoded data 
app.use(express.json());
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);


const dbUrl=process.env.ATLASDB_URL;
// console.log(dbUrl);


main().then(()=>{
  console.log("connected to DB");
}).catch((error)=>{
  console.log(error);
})

async function main(){
  await  mongoose.connect(dbUrl);
  console.log("connected with database");
  
}

app.listen(8080,()=>{
  console.log("server is listening on port 8080");
})




// passport always  require sessions 




// const store = MongoStore.create({
//   mongoUrl:dbUrl,
//   crypto:{
//     secret:"mysupersecretstring",
//   },
//   touchAfter: 24 * 3600
// });

// store.on("error",()=>{
//   console.log(" ERROR IN MONGO STORE SESSION", err);
  
// })


const store=MongoStore.create({
  mongoUrl:dbUrl,
  crypto:{
    secret:process.env.SECRET,
  },
  touchAfter:24*3600, 
});

store.on("error",()=>{
  console.log("ERROR in MONGO STORE ",err);
  
})

const sessionOptions={
 store,
  secret:process.env.SECRET,
  resave:false,
  saveUninitialized:true,
  cookie:{
    expires:Date.now()+7 * 24 * 60 * 60 * 1000,
  maxAge:7* 24 * 60 * 60 * 1000,
  httpOnly:true,
  },
};

// app.get("/", (req, res) => {
//   res.send("Hi, I am root");
// });

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session()); 
// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()))
// authenticate() Generates a function that is used in Passport's LocalStrategy

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// serializeUser() Generates a function that is used by Passport to serialize users into the session
// deserializeUser() Generates a function that is used by Passport to deserialize users into the session
// serialize means user se related jitni bhi information ho usko session me  store karwana \
// deserialize means user se related jitni bhi information ho usko session se  remove karwana 
app.use((req,res,next)=>{
  res.locals.success=req.flash("success");
  res.locals.error=req.flash("error");
  // console.log(res.locals.success);
  res.locals.currUser=req.user; 
  next();
})

// register(user, password, cb) Convenience method to register a new user instance with a given password. Checks if username is unique. See login example. cb is callback function
// app.get("/demouser", async(req,res)=>{
//   let fakeUser=new User({
//     email:"student@gmail.com",
//     username:"delta-farman",
//   })

//   let registeredUser= await User.register(fakeUser,"helloWorld");
// res.send(registeredUser);
// })


app.use("/listings",listingRouter);
app.use("/listings/:id/reviews",reviewRouter)
app.use("/",userRouter);





app.all("*",(req,res,next)=>{
  next ( new ExpressError(404,"page not found"));
})
app.use((err,req,res,next)=>{
  let {statusCode=500,message="something went wrong!"}=err;

//  res.status(statusCode).send(message);
res.status(statusCode ).render("error.ejs",{err});
})





