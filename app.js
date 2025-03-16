import express from 'express';
import { connect } from 'mongoose';
import cookieParser from 'cookie-parser';
import fileuploader from 'express-fileupload';
import authRoute from './routes/authRoutes.js'
import otherRoute from './routes/otherRoutes.js';
import adminRoute from './routes/adminRoutes.js';
import { tokenChecker } from './middlewares/tokencheckers.js';
import toonRoute from "./routes/toonRoutes.js"
import { config } from 'dotenv';
config()

const app= express();

const { PORT, MONGO_URI2 } = process.env;  

const port = PORT || 3001; 

connect(MONGO_URI2)     
.then(() => { 
    console.log('MongoDB connected');
}).catch(err => {
    console.log('MongoDB connection error: ', err.message);

});


// Middleware
app.set('view engine', 'ejs'); 

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json());
app.use(cookieParser());
app.use(fileuploader({useTempFiles: true}));

// if(!fs.existsSync('public/webtoonz')) fs.mkdirSync('public/webtoonz');


app.get('*', tokenChecker)

app.get('/', (req,res)=>{ res.redirect('/twp') });

app.use('/twp', otherRoute);

app.use('/twp/auth', authRoute);

app.use('/twp/admin', adminRoute);

app.use('/twp/webtoon', toonRoute)

app.use((req,res,next) => { 
    res.render('404', {user: res.locals.user, title: '404 Page'}) 
})

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
}); 