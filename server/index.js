require("dotenv").config();
const express = require("express");
const app = express();
const session = require("express-session");
const massive = require("massive");
//IMPORT CONTROLLER FILES
const authCtrl = require("./controllers/authController");
const treasureCtrl = require("./controllers/treasureController");
const auth = require("./middleware/authMiddleware");

//DECONSTRUCT .ENV VARIABLES
const {CONNECTION_STRING, SESSION_SECRET} = process.env;

//SETTING UP MASSIVE
massive(CONNECTION_STRING).then(db => {
    app.set("db", db);
    console.log("Database Connected");
});
//MIDDLEWARE
app.use(express.json());
app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET
}))

//ENDPOINTS

//REGISTER ENDPOINT
app.post("/auth/register", authCtrl.register);
//LOGIN ENDPOINT
app.post("/auth/login", authCtrl.login);
//LOGOUT ENDPOINT
app.get("/auth/logout", authCtrl.logout);

//ENDPOINT TO GET DRAGON TREASURE
app.get("/api/treasure/dragon", treasureCtrl.dragonTreasure);
//ENDPOINT TO GET USER TREASURE
app.get("/api/treasure/user", auth.usersOnly, treasureCtrl.getUserTreasure);
//ENDPOINT TO POST TO ADD TO TREASURE
app.post("/api/treasure/user", auth.usersOnly, treasureCtrl.addUserTreasure);
//ENDPOINT TO GET ALL TREASURE(ADMINS ONLY)
app.get("/api/treasure/all", auth.usersOnly, auth.adminsOnly, treasureCtrl.getAllTreasure);

//CONSOLE LOGGING APP.LISTEN
const PORT = 4000;
app.listen(PORT, () => {
    console.log(`Listening on Port ${PORT}`)
});