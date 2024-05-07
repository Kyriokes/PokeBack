const { Type } = require("../../db");
const axios = require("axios");

const getTypes = async () => {
  const types = await Type.findAll(); //me traigo toda la bd
  if(!types.length){ // si existe no hace nada
  const apiTypes = (await axios.get("https://pokeapi.co/api/v2/type"));
  const apiTypesRes = apiTypes.data.results
    
  let arrayTypes = [];

  for (const element of apiTypesRes) {
    const types = await Type.create({name : element.name})
    arrayTypes.push(types)
  }
  return arrayTypes;
}
else{ // si ya hay tipos creados o traidos de la api entra aqui
  return types; 
}
};


module.exports = {
  getTypes,
};

