const { Router } = require('express');
const pokemonRoutes = require('./pokemonRoutes');
const typeRoutes = require('./typeRoutes')
// Importar todos los routers;
// Ejemplo: const authRouter = require('./auth.js');

const router = Router();

// Configurar los routers
// Ejemplo: router.use('/auth', authRouter);

router.use('/pokemon', pokemonRoutes); // asigno al url mis rutas de pokemon

router.use('/type', typeRoutes); // asigno al url mis rutas de type

module.exports = router;
