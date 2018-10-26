const express = require('express');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const imageUploadRoutes = require('./routes/image-upload');
const path = require('path');
const DB = require('./db/mongooseDB');

DB.connectToDB();

const app = express();


// habilita y parsea los requests al formato json
app.use(bodyParser.json());


// ------ rutas -----


app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1', imageUploadRoutes);



// Configuracion para heroku
const appPath = path.join(__dirname, '..', 'dist/TheMovieMEAN');
app.use(express.static(appPath));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
})



// Establece el puerto 3001 o el del entorno
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log('I am running in port: ' + PORT));


module.exports = {
    app
}