const {
  getPokemonsByName,
  getPokemons,
  getPokemonId,
  createPokemon,
} = require("../controllers/pokemonController");
const { Type } = require("../../db");

//------- GET | /pokemons && GET | /pokemons/name?="..."
const getPokemonHandler = async (req, res) => {
  const { name } = req.query;
  try {
    if (name) {
      //si nombre existe se le pide al controller que busque en db y en api
      const pokemonByName = await getPokemonsByName(name);
      if (pokemonByName) {
        return res.json(pokemonByName);
      } else {
        return res.send(`${name} no fue encontrado`);
      }
    } else {
      // sino dame todo
      const allPokemons = await getPokemons();
      return res.json(allPokemons);
    }
  } catch (error) {
    //manejo si hay un error
    return res.status(400).send({ error: error.message });
  }
};

//-------  GET | /pokemons/:idPokemon
const getPokemonIdHandler = async (req, res) => {
  const { id } = req.params;
  try {
    // pido a la db o a la api si id.length<5 el pokemon por id
    const pokemonId = await getPokemonId(id);
    if (pokemonId.length === 0) {
      // reviso q sea un id valido
      return res.send("No puede ser 0");
    } else {
      return res.json(pokemonId);
    }
  } catch (error) {
    //manejo si hay un error
    return res.status(400).send({ error: error.message });
  }
};
//-------  POST | /pokemons
const createPokemonHandler = async (req, res) => {
  const { name, sprites, hp, attack, defense, speed, height, weight, types } =
    req.body;
  try {
    if (
      !name ||
      !sprites ||
      !hp ||
      !attack ||
      !defense ||
      !speed ||
      !height ||
      !weight ||
      !types
    ) {
      // me aseguro que los datos existan
      throw Error("missing data");
    }

    let poketTypes = [];
    for (const typeName of types) {
      let typeDB = await Type.findOne({ where: { name: typeName } });
      poketTypes.push(typeDB);
    }
    if (poketTypes.length) {
      const newPokemon = await createPokemon({
        name,
        sprites,
        hp,
        attack,
        defense,
        speed,
        height, 
        weight,
        types: poketTypes.map(type => type.name),
      });
      return res.status(201).json(newPokemon);
    } else {
      for (const typeName of types) {
        const newType = await Type.create({ name: typeName });
      }
      const newPokemon = await createPokemon({
        name,
        sprites,
        hp,
        attack,
        defense,
        speed,
        height,
        weight,
        types: newType.name,
      });
      return res.status(201).json(newPokemon);
    }
  } catch (error) {
    //manejo si hay un error
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getPokemonHandler,
  getPokemonIdHandler,
  createPokemonHandler,
};
