const router = require('express').Router()
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session)
const {
    SESS_LIFETIME = 1000 * 60 * 60 * 24 * 14,
    SESSION_URI_LOCAL,
    SESSION_DB,
    SESSION_COLLECTION,
    SESS_SECRET,
    NODE_ENV
} = process.env

const storeDB = new MongoDBStore({
    uri: SESSION_URI_LOCAL,
    databaseName: SESSION_DB,
    collection: SESSION_COLLECTION,
    connectionOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 10000
    }
}, err => {
    if(err)
        console.error(err)
})
const IN_PROD = NODE_ENV === 'production'
router.use(session({
    secret: SESS_SECRET,
    saveUninitialized: true,
    resave: false,
    store: storeDB,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD,
        path:'/'
    }
}))

module.exports = router