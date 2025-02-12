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

//  - Gestion des données des formulaires
app.use(express.urlencoded());

//! Routing
app.get('/', (req, res) => {
    res.status(200).render('home/index');
});

app.get('/dest', (req, res) => {
    const destinations = data.destinations;
    res.status(200).render('dest/index', { destinations });
});

app.get('/dest/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if(isNaN(id)) {
        // Si le params est invalide, on rend la main au routing
        // (Il est également possible de déclancher une erreur)
        next();
        return;
    }

    const destination = data.destinations.find(d => d.id === id);
    if(!destination) {
        res.status(404).render('errors/404');
        return;
    }

    res.status(200).render('dest/detail', destination);
});

app.get('/contact', (req, res) => {
    res.status(200).render('contact/formulaire')
});

app.post('/contact', (req, res) => {
    const { email, pseudo, category, message } = req.body;

    // Validation des données
    if(!email || !category || !message) {
        res.status(200).render('contact/formulaire', { error: true })
        return;
    }

    // Traitement des données
    // Cas réel : Stockage en db, envoie de mail, ...
    console.log(`[${category}] ${chalk.redBright(email + ' ' + pseudo)} : ${message}`)

    // Redirection vers la page "response"
    res.status(303).redirect('/contact/response');
});

app.get('/contact/response', (req, res) => {
    res.status(200).render('contact/response')
});

//! Page 404 si aucune route n'a été trouvé !
app.use((req, res) => {
    res.status(404).render('errors/404');
});

//! Demarrage du web serveur
app.listen(8080, function () {
    console.log(chalk.cyanBright(`Web server is running on port ${8080}`));
});