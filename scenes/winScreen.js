function setWin(worldState) {
    
    var sound = new Howl({
        src: ['music/gggalaxy.mp3'],
        volume: 0.7,
        loop: true
        
    });

    sound.play()

    function makeTile(type) {
        return [
            sprite('tile'),
            {type}
        ]
    }

    const map = [
        addLevel([
            '                  ',
            ' cddddddddddddde  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 300000000000002  ',
            ' 111111111111111  ',
            '                  ',
            '                  ',
            '                  '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '7': () => makeTile('grass-m'),
                '1': () => makeTile('sand-bottom'),
                '2': () => makeTile('sand-r'),
                '3': () => makeTile('sand-l'),
                '4': () => makeTile('ground-m'),
                '5': () => makeTile('ground-r'),
                '6': () => makeTile('ground-l'),
                '0': () => makeTile('sand-1'),
                '8': () => makeTile('grass-mb'),
                '9': () => makeTile('grass-br'),
                'a': () => makeTile('grass-bl'),
                'b': () => makeTile('rock-water'),
                'c': () => makeTile('sand-tl'),
                'd': () => makeTile('sand-tm'),
                'e': () => makeTile('sand-tr'),
                'j': () => makeTile('bridge-l'),
                'k': () => makeTile('bridge-m'),
                'l': () => makeTile('bridge-r')
            }
        }),
        addLevel([
            '                  ',
            '                  ',
            '  0               ',
            '    5         0   ',
            '    6             ',
            '                  ',
            '             5    ',
            '   0         6    ',
            '                  ',
            '      5    0      ',
            '      6           ',
            '  0           0   ',
            '                  ',
            '                  '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '0': () => makeTile('rock'),
                '1': () => makeTile('bigtree-pt1'),
                '2': () => makeTile('bigtree-pt2'),
                '3': () => makeTile('bigtree-pt3'),
                '4': () => makeTile('bigtree-pt4'),
                '5': () => makeTile('cactus-t'),
                '6': () => makeTile('cactus-b'),
            }
        }),
        addLevel([
            ' 000000000000000  ',
            '0               0 ',
            '0 1             0 ',
            '0   2         1 0 ',
            '0   3           0 ',
            '0               0 ',
            '0            2  0 ',
            '0  1         3  0 ',
            '0               0 ',
            '0     2    1    0 ',
            '0     3         0 ',
            '0 1           1 0 ',
            '0               0 ',
            ' 2222222222222222 ',
            '                  '
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
                        offset: vec2(4, 3)
                    }),
                    body({isStatic: true})
                ],
                '2': () => [
                    area({shape: new Rect(vec2(0), 16, 16),
                        offset: vec2(0, 4)}),
                    body({isStatic: true})
                ],
                '3': () => [
                    area({
                    shape: new Rect(vec2(0), 16, 2),
                    offset: vec2(0, 0)
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

    add([ sprite('npc'), scale(4), pos(600,750), area(), body({isStatic: true}), 'npc'])

    add([ sprite('starship'), scale(4), pos(450,-50), area(), body({isStatic: true})])

    player.onCollide('npc', () => {

        player.isInDialogue = true
        const dialogueBoxFixedContainer = add([fixed()])
        const dialogueBox = dialogueBoxFixedContainer.add([
            rect(window.innerWidth, window.innerHeight/4 + 50),
            outline(5),
            pos(0, window.innerHeight - window.innerHeight/4 - 50),
            fixed()
        ])
        const dialogue = "I hope you enjoyed my game! I will miss you a lot when you go to Texas. Have fun at Starbase <3 -Matt"
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

        content.text = dialogue

        onUpdate(() => {
            if (isKeyDown('space')) {
                destroy(dialogueBox)
                player.isInDialogue = false
            }
        })
    })

    function flashScreen() {
        const flash = add([rect(window.innerWidth, window.innerHeight), color(10,10,10), fixed(), opacity(0)])
        tween(flash.opacity, 1, 0.5, (val) => flash.opacity = val, easings.easeInBounce)
    }



}

