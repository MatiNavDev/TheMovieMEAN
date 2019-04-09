const express = require('express');
const bodyParser = require('body-parser');

const path = require('path');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const commentRoutes = require('./routes/comment');
const imageUploadRoutes = require('./routes/image-upload');
const { connectToDB, connectToDBTestMode } = require('./db/mongooseDB');
const { isTest } = require('./services/enviroment');

if (isTest()) {
  connectToDBTestMode();
} else {
  connectToDB();
}

const app = express();

// habilita y parsea los requests al formato json
app.use(bodyParser.json());

// ------ rutas -----

app.use('/api/v1/comments', commentRoutes);
app.use('/api/v1/posts', postRoutes);
app.use('/api/v1/auth', userRoutes);
app.use('/api/v1', imageUploadRoutes);

// Configuracion para heroku
const appPath = path.join(__dirname, '..', 'dist/TheMovieMEAN');
app.use(express.static(appPath));

app.get('*', (req, res) => {
  res.sendFile(path.resolve(appPath, 'index.html'));
});

// Establece el puerto 3003 o el del entorno
const PORT = process.env.PORT || 3003;

app.listen(PORT, () => console.log(`I am running in port: ${PORT}`));

module.exports = {
  app
};
