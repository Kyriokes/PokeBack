const { Pokemon, Type } = require("../../db");
const axios = require("axios");

function pokeData(poke) {
  //para crear los objetos con la info de los pokemons
  return {
    id: poke.data.id,
    name:  poke.data.name.charAt(0).toUpperCase() + poke.data.name.slice(1).toLowerCase(),
    // poke.data.name,
    image: poke.data['sprites']['versions']['generation-v']['black-white']['animated']['front_default'] || poke.data.sprites.front_default,
    // image: poke.data.sprites.front_default,
    height: poke.data.height,
    weight: poke.data.weight,
    hp: poke.data.stats.find((element) => element.stat.name === "hp").base_stat,
    attack: poke.data.stats.find((element) => element.stat.name === "attack")
      .base_stat,
    defense: poke.data.stats.find((element) => element.stat.name === "defense")
      .base_stat,
    speed: poke.data.stats.find((element) => element.stat.name === "speed")
      .base_stat,
    types: poke.data.types.map((types) => types.type.name),
  };
}

function typeFilter(obj) {
  // para filtrar el objeto en el que viene los tipos de los poke de la db a un array como el de la api
  let array = [];
  for (const typeName of obj.types) {
    let nueva = typeName.name;
    array.push(nueva);
  }
  return array;
}
function pokeTypeFromObjToStr(poke) {
  //para filtrar la info de los poke de la db
  return {
    id: poke.id,
    name: poke.name.charAt(0).toUpperCase() + poke.name.slice(1).toLowerCase(),
    image: poke.sprites,
    height: poke.height,
    weight: poke.weight,
    hp: poke.hp,
    attack: poke.attack,
    defense: poke.defense,
    speed: poke.speed,
    types: typeFilter(poke),
  };
}

const getPokemons = async () => {
  //trae de la base de datos
  const dbPokemonsNofilter = await Pokemon.findAll({
    include: [{ model: Type, attributes: ["name"] }],
  }); //include estaria agregando los datos de la relacion

  const dbPokemons = [];
  for (const pokemon of dbPokemonsNofilter) {
    dbPokemons.push(pokeTypeFromObjToStr(pokemon));
  }

  //trae de la api
  const apiPokemons = (
    await axios.get("https://pokeapi.co/api/v2/pokemon?limit=151")
  ).data.results;
  const apiPokemonsUrl = await Promise.all(
    apiPokemons.map(async (element) => {
      const response = await axios.get(element.url);
      return pokeData(response);
    })
  );
  // retorna
  return [...dbPokemons, ...apiPokemonsUrl];
};

const getPokemonsByName = async (PokeName) => {
  let PokemonByName = await Pokemon.findOne({
    where: { name: PokeName },
    include: [{ model: Type, attributes: ["name"] }],
  });
  if (PokemonByName) {
    return pokeTypeFromObjToStr(PokemonByName);
  } else {
    PokemonByName = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${PokeName}`
    );
    return pokeData(PokemonByName);
  }
};

const getPokemonId = async (PokeId) => {
  let PokemonByID = 0;
  if (PokeId.length < 6) {
    PokemonByID = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${PokeId}`
    );
    return pokeData(PokemonByID);
  } else {
    PokemonByID = await Pokemon.findOne({
      where: { id: PokeId },
      include: [{ model: Type, attributes: ["name"] }],
    });
    return pokeTypeFromObjToStr(PokemonByID);
  }
};

const createPokemon = async ({
  name,
  sprites,
  hp,
  attack,
  defense,
  speed,
  height,
  weight,
  types,
}) => {
  console.log(name);
  let objPokemon = {
    name,
    sprites,
    hp,
    attack,
    defense,
    speed,
    height,
    weight,
    types,
  };
  let allTypes = [];
  for (const typeName of types) {
    //recorro el arreglo que llega por el post
    const newType = await Type.findOne({ where: { name: typeName } }); //busco los valores de dicho arreglo en el modelo
    allTypes.push(newType); //los almaceno en un arreglo
  }
  const newPokemon = await Pokemon.create(objPokemon); // crea el nuevo pokemon
  await newPokemon.addTypes(allTypes); // asigna los tipos al nuevo pokemon
  return newPokemon;
};

module.exports = {
  getPokemonsByName,
  getPokemons,
  getPokemonId,
  createPokemon,
};

