const { Router } = require("express");
const router = Router();
const { getPokemonHandler, getPokemonIdHandler, createPokemonHandler } = require('./handlers/pokemonHandler')

router.get("/", getPokemonHandler); // GET | /pokemons && GET | /pokemons/name?="..."
router.get("/:id", getPokemonIdHandler); // GET | /pokemons/:idPokemon
router.post("/", createPokemonHandler); //  POST | /pokemons

module.exports = router;
