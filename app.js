const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
const session = require("express-session");
const flash = require("connect-flash");


const sessionOptions = {
    secret : "secret-code", 
    resave:false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 1000*60*60*24*7,
        maxAge : 1000*60*60*24*7,
        httpOnly : true,
    }
};

app.use(session(sessionOptions));
app.use(flash());


const MONGO_URL = "mongodb://127.0.0.1:27017/WanderStay";
main()
     .then((res)=>{
    console.log("Connected to DB");
    })
    .catch((err) => {
    console.log(err);
    });

async function main() {
  await mongoose.connect(MONGO_URL);
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/",(req,res)=>{
    res.send("Hi, i am root");
});

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);

app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
});

app.use((err,req,res,next)=>{
    
    let{status = 500,message ="Something went wrong!"} = err;
    //res.status(status).send(message);
    res.status(status).render("error.ejs",{message});
});

app.listen(8080, ()=>{
    console.log("server is listening to port 8080");
});

