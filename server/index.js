const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user');
const path = require('path');

// configuracion de mongoose
mongoose.connect(config.DB_URL, { useNewUrlParser: true })
    .then((res) => {

    })
mongoose.set('useCreateIndex', true);


const app = express();


// habilita y parsea los requests al formato json
app.use(bodyParser.json());


// ------ rutas -----
app.use('/api/v1/auth', userRoutes);



/*
// Configuracion para heroku
const appPath = path.join(__dirname, '..', 'dist/the-complete-angular-react-node-guide');
app.use(express.static(appPath));

app.get('*', function (req, res) {
    res.sendFile(path.resolve(appPath, 'index.html'));
})
*/

// Establece el puerto 3001 o el del entorno
const PORT = process.env.PORT || 3002;

app.listen(PORT, () => console.log('I am running in port: ' + PORT));