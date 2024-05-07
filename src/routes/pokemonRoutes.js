const { Router } = require("express");
const router = Router();
const { getPokemonHandler, getPokemonIdHandler, createPokemonHandler, DeletePokemonIdHandler } = require('./handlers/pokemonHandler')

router.get("/", getPokemonHandler); // GET | /pokemons && GET | /pokemons/name?="..."
router.get("/:id", getPokemonIdHandler); // GET | /pokemons/:idPokemon
router.post("/", createPokemonHandler); //  POST | /pokemons
router.delete("/:id", DeletePokemonIdHandler); // DELETE | /pokemons/:idPokemon

module.exports = router;
