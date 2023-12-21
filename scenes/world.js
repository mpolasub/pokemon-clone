function setWorld(worldState) {


    function makeTile(type) {
        return [
            sprite('tile'),
            {type}
        ]
    }

    const map = [
        addLevel([
            '       b          b             ',
            ' cddddddddddddde      cddddde   ',
            ' 300000000000002      3000002  b',
            ' 300000000000000jjjjjj0000002   ',
            ' 300000000000000llllll0000002   ',
            ' 300000000000002      3000002   ',
            ' 300030000008889      a888889 b ',
            ' 300030000024445      6444445   ',
            ' 3000a8888897777                ',
            ' 300064444457777                ',
            ' 300000000000000   b      b     ',
            ' 300000000021111                ',
            ' 30000000002                b   ',
            ' 11111111111      b             ',
            '         b                      ',
            '  b          b                  ',
            '     b                          '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => makeTile('grass-m'),
                '1': () => makeTile('grass-water'),
                '2': () => makeTile('grass-r'),
                '3': () => makeTile('grass-l'),
                '4': () => makeTile('ground-m'),
                '5': () => makeTile('ground-r'),
                '6': () => makeTile('ground-l'),
                '7': () => makeTile('sand-1'),
                '8': () => makeTile('grass-mb'),
                '9': () => makeTile('grass-br'),
                'a': () => makeTile('grass-bl'),
                'b': () => makeTile('rock-water'),
                'c': () => makeTile('grass-tl'),
                'd': () => makeTile('grass-tm'),
                'e': () => makeTile('grass-tr'),
                'j': () => makeTile('bridge-l'),
                'k': () => makeTile('bridge-m'),
                'l': () => makeTile('bridge-r')
            }
        }),
        addLevel([
            '                           5    ',
            '       12                  6    ',
            '       34             00        ',
            ' 00 0    00                     ',
            ' 0     00   12             0    ',
            ' 0          34         0        ',
            '          0                     ',
            '                                ',
            '                                ',
            '  0   5       5                 ',
            '  0   6   0   6                 ',
            '                                ',
            '                                ',
            '                                '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => makeTile(),
                '1': () => makeTile('bigtree-pt1'),
                '2': () => makeTile('bigtree-pt2'),
                '3': () => makeTile('bigtree-pt3'),
                '4': () => makeTile('bigtree-pt4'),
                '5': () => makeTile('tree-t'),
                '6': () => makeTile('tree-b'),
            }
        }),
        addLevel([
            ' 000000000000000      0000000   ',
            '0      11       0    0     0 0  ',
            '0      11       000000       0  ',
            '0                            0  ',
            '0           11               0  ',
            '0           11  000000       0  ',
            '0    2         0     0       0  ',
            '0    2      3333      3333333   ',
            '0    2      0   0               ',
            '0    3333333  1 0               ',
            '0     0       1 0               ',
            '0           0000                ',
            '0           0                   ',
            ' 00000000000                    ',
            '                                '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => [
                    area({shape: new Rect(vec2(0), 16, 16)}),
                    body({isStatic: true})
                ],
                '1': () => [
                    area({
                        shape: new Rect(vec2(0), 8, 8),
                        offset: vec2(4, 4)
                    }),
                    body({isStatic: true})
                ],
                '2': () => [
                    area({shape: new Rect(vec2(0), 2, 16)}),
                    body({isStatic: true})
                ],
                '3': () => [
                    area({
                    shape: new Rect(vec2(0), 16, 20),
                    offset: vec2(0, -4)
                    }),
                    body({isStatic: true})
                ]
            }
        })
    ]

    for (const layer of map) {
        layer.use(scale(4))
        for (const tile of layer.children) {
            if (tile.type) {
                tile.play(tile.type)
            }
        }
    }

    const laptopMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(1650,215), scale(4), 'Crashy laptop'])
    laptopMon.flipX = true
    
    const ghostMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(500,400), scale(4), 'Scary ghost'])
    ghostMon.play('Scary ghost')
    ghostMon.flipX = true

    const breadMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(100,700), scale(4), 'Loaf bread'])
    breadMon.play('Loaf bread')
    breadMon.flipX = true

    const racistMon = add([sprite('mini-mons'), area(), body({isStatic: true}), pos(100, 100), scale(4), 'Racist man'])
    racistMon.play('Racist man')

    add([ sprite('npc'), scale(4), pos(600,750), area(), body({isStatic: true}), 'npc'])

    const player = add([
        sprite('player-down'),
        pos(450,750),
        scale(4),
        area(),
        body(),
        {
            currentSprite: 'player-down',
            speed: 300,
            isInDialogue: false
        },
    ])

    // camera
    let tick = 0
    onUpdate(() => {
        camPos(player.pos)
        tick++
        if ((isKeyDown('down') || isKeyDown('up')) 
        && tick % 14 === 0 
        && !player.isInDialogue) {
            player.flipX = !player.flipX
        }
    })

    function setSprite(player, spriteName) {
        if (player.currentSprite !== spriteName) {
            player.use(sprite(spriteName))
            player.currentSprite = spriteName
        }
    }

    // player movement
    onKeyDown('down', () => {
        if (player.isInDialogue) return
        setSprite(player, 'player-down')
        player.move(0, player.speed)
    })

    onKeyDown('up', () => {
        if (player.isInDialogue) return
        setSprite(player, 'player-up')
        player.move(0, -player.speed)
    })

    onKeyDown('left', () => {
        if (player.isInDialogue) return
        player.flipX = false
        if (player.curAnim() !== 'walk') {
            setSprite(player, 'player-side')
            player.play('walk')
        }
        player.move(-player.speed, 0)

    })

    onKeyDown('right', () => {
        if (player.isInDialogue) return
        player.flipX = true
        if (player.curAnim() !== 'walk') {
            setSprite(player, 'player-side')
            player.play('walk')
        }
        player.move(player.speed, 0)
    })


    onKeyRelease('left', () => {
        player.stop()
    })

    onKeyRelease('right', () => {
        player.stop()
    })

    if (!worldState) {
        worldState = {
            playerPos : player.pos,
            faintedMons: [],
            ticker: 1,
            sound: new Howl({
                src: ['music/parasail.mp3'],
                loop: true
            }),
            battle_sound: new Howl({
            src: ['music/pokemon_battle.mp3'],
            volume: 0.6
            })
        }
    }

    player.pos = vec2(worldState.playerPos)
    for (const faintedMon of worldState.faintedMons) {
        destroy(get(faintedMon)[0])
    }

    player.onCollide('npc', () => {


        player.isInDialogue = true
        const dialogueBoxFixedContainer = add([fixed()])
        const dialogueBox = dialogueBoxFixedContainer.add([
            rect(1000, 200),
            outline(5),
            pos(150, 500),
            fixed()
        ])
        const dialogue = "There's bad stuff scattered around the island. Defeat all 4 and come back when you're done!"
        const content = dialogueBox.add([
            text('', 
            {
                size: 42,
                width: 900,
                lineSpacing: 15,
            }),
            color(10,10,10),
            pos(40,30),
            fixed()
        ])

        if (worldState.faintedMons.length < 4) {
            content.text = dialogue
        } else {
            content.text = "You did it! I love you, my princess!\nPress 'ENTER' to proceed.\n                             -Matt"
        }

        onUpdate(() => {
            if (isKeyDown('space')) {
                destroy(dialogueBox)
                player.isInDialogue = false 
            }
            if (isKeyDown('enter')) {
                worldState.sound.pause()
                go('winScreen')
            }
        })
    })

    function flashScreen() {
        const flash = add([rect(window.innerWidth, window.innerHeight), color(10,10,10), fixed(), opacity(0)])
        tween(flash.opacity, 1, 0.5, (val) => flash.opacity = val, easings.easeInBounce)
    }

    function onCollideWithPlayer(enemyName, player, worldState) {
        player.onCollide(enemyName, () => {
            worldState.sound.pause()
            worldState.battle_sound.play()
            flashScreen()
            setTimeout(() => {
                worldState.playerPos = player.pos
                worldState.enemyName = enemyName
                go('battle', worldState) 
            }, 1000)
        })
    }

    if (worldState.ticker == 1) {
        worldState.ticker += 1;
        worldState.sound.play();
    }


    onCollideWithPlayer('Crashy laptop', player, worldState)
    onCollideWithPlayer('Scary ghost', player, worldState)
    onCollideWithPlayer('Loaf bread', player, worldState)
    onCollideWithPlayer('Racist man', player, worldState)
}

