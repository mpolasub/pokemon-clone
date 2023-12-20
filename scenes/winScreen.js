function setWin(worldState) {
    
    var sound = new Howl({
        src: ['music/gggalaxy.mp3']
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
            '       b          ',
            ' cddddddddddddde  ',
            ' 300000000000002  ',
            ' 300000000000000jj',
            ' 300000000000000ll',
            ' 300000000000002  ',
            ' 300030000008889  ',
            ' 300030000024445  ',
            ' 3000a8888897777  ',
            ' 300064444457777  ',
            ' 300000000000000  ',
            ' 300000000021111  ',
            ' 30000000002      ',
            ' 11111111111      ',
            '         b        ',
            '  b          b    ',
            '     b            '
        ], {
            tileWidth: 16,
            tileHeight: 16,
            tiles: {
                '7': () => makeTile('grass-m'),
                '1': () => makeTile('grass-water'),
                '2': () => makeTile('grass-r'),
                '3': () => makeTile('grass-l'),
                '4': () => makeTile('ground-m'),
                '5': () => makeTile('ground-r'),
                '6': () => makeTile('ground-l'),
                '0': () => makeTile('sand-1'),
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
            '                  ',
            '       12         ',
            '       34         ',
            ' 00 0    00       ',
            ' 0     00   12    ',
            ' 0          34    ',
            '          0       ',
            '                  ',
            '                  ',
            '  0   5       5   ',
            '  0   6   0   6   ',
            '                  ',
            '                  ',
            '                  '
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
            ' 000000000000000  ',
            '0      11       0 ',
            '0      11       00',
            '0                 ',
            '0           11    ',
            '0           11  00',
            '0    2         0  ',
            '0    2      3333  ',
            '0    2      0   0 ',
            '0    3333333  1 0 ',
            '0     0       1 0 ',
            '0           0000  ',
            '0           0     ',
            ' 00000000000      ',
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


    const player = add([
        sprite('player-down'),
        pos(500,750),
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



    player.onCollide('npc', () => {

        player.isInDialogue = true
        const dialogueBoxFixedContainer = add([fixed()])
        const dialogueBox = dialogueBoxFixedContainer.add([
            rect(1000, 200),
            outline(5),
            pos(150, 500),
            fixed()
        ])
        const dialogue = "nice"
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

        if (worldState.faintedMons < 4) {
            content.text = dialogue
        } else {
            content.text = "You did it! I love you, my princess!\n\n                             -Matt"
        }

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

