import chalk from 'chalk';
import express from 'express';
import morgan from 'morgan';
import data from './data/japon.json' with { type: 'json' }

//! Configuration du web serveur
const app = express();

app.set('view engine', 'ejs');
app.set('views', './views');

//! App Middleware
//  - Logger
app.use(morgan('tiny'));

//  - Fichier public
app.use(express.static('public'));

//  - Custom middleware for render (inject layout)
app.use((req, res, next) => {
    res.originalRender = res.render;

    res.render = (view, data) => {
        res.originalRender('_layout', { view, data });
    };

    next();
});

//! Routing
app.get('/', (req, res) => {
    res.status(200).render('home/index');
});

app.get('/dest', (req, res) => {
    const destinations = data.destinations;
    res.status(200).render('dest/index', { destinations });
});

app.get('/dest/:id([0-9]+)', (req, res) => {
    const id = parseInt(req.params.id);
    const destination = data.destinations.find(d => d.id === id);

    if(!destination) {
        res.status(404).render('errors/404');
    }

    res.status(200).render('dest/detail', destination);
});

//! Page 404 si aucune route n'a été trouvé !
app.use((req, res) => {
    res.status(404).render('errors/404');
});

//! Demarrage du web serveur
app.listen(8080, function () {
    console.log(chalk.cyanBright(`Web server is running on port ${8080}`));
});