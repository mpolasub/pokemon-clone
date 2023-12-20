kaboom({
    width: window.innerWidth,
    height: window.innerHeight,
    scale: 1
});

setBackground(Color.fromHex('#36A6E0'));

loadAssets();



scene('winScreen', (worldState) => setWin(worldState));
scene('world', (worldState) => setWorld(worldState));
scene('battle', (worldState) => setBattle(worldState));



go('world');