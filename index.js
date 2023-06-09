const express = require("express");
const cookieParser = require("cookie-parser");
const env = require("./config/environment");
const app = express();
const port = 8000;
const expressLayouts = require("express-ejs-layouts");
const db = require("./config/mongoose");
const session = require("express-session");
const passport = require("passport");
const passportLocal = require("./config/passport-local-strategy");
const passportJWT = require("./config/passport-jwt-strategy");
const passportGoogle = require("./config/passport-google-oauth2-strategy");

const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const customMware = require("./config/middleware");
const multer = require("multer");

//setup the chat server
const chatServer = require("http").Server(app);
const chatSocket = require("./config/chat_sockets").chatSockets(chatServer);
chatServer.listen(5000);
console.log("Chat server is listining on port 5000");

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(cookieParser());
app.use(express.static(env.asset_path));
app.use("/uploads", express.static(__dirname + "/uploads"));

app.use(expressLayouts);

//extarct and style and scripts from sub pages into the layout
app.set("layout extractStyles", true);
app.set("layout extractScripts", true);

//set view engine
app.set("view engine", "ejs");
app.set("views", "./views");

//mongo store is used to store session cookie in db
app.use(
  session({
    name: "codeial",
    //change the secret before deployment
    secret: env.session_cookie_key,
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 1000 * 60 * 100,
    },
    store: MongoStore.create(
      {
        mongoUrl: "mongodb://0.0.0.0:27017/codeial",
        autoRemove: "disabled",
      },
      (err) => {
        console.log(err || "connect-mongodb setup ok");
      }
    ),
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(passport.setAuthenticatedUser);

app.use(flash());
app.use(customMware.setFlash);

//use express router
app.use("/", require("./routes"));

app.listen(port, (err) => {
  if (err) {
    console.log(`Error creating server:${err}`);
    return;
  }
  console.log(`Server is running on port:${port}`);
});
