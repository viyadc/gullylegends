'use strict';
function buildWorld(){
  const rand=rng(7);
  buildSky();buildGround();buildRoads();buildBuildings(rand);buildGate();buildTemple();buildGarage();buildMarket();buildLamps();buildNotes();buildNature(rand);
}
