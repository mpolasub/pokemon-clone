function setBattle(worldState) {
    add([
        sprite('battle-background'),
        scale(1.3),
        pos(0,0)
    ])

    const enemyMon = add([
        sprite(worldState.enemyName + '-mon'),
        scale(5),
        pos(1300,100),
        opacity(1), 
        {
            fainted: false
        }
    ])
    enemyMon.flipX = true

    tween(
        enemyMon.pos.x, 
        1000, 
        0.3, 
        (val) => enemyMon.pos.x = val,
        easings.easeInSine
    )

    const playerMon = add([
        sprite('CHICHI-mon'),
        scale(8),
        pos(-100, 300),
        opacity(1),
        {
            fainted: false
        }
    ])

    tween(
        playerMon.pos.x, 
        300, 
        0.3, 
        (val) => playerMon.pos.x = val, 
        easings.easeInSine
    )

    const playerMonHealthBox = add([
       rect(400, 100),
       outline(4),
       pos(1000, 400) 
    ])

    playerMonHealthBox.add([
        text('CHICHI', {size: 32}),
        color(10,10,10),
        pos(10, 10)
    ])

    playerMonHealthBox.add([
        rect(370, 10),
        color(200,200,200),
        pos(15, 50)
    ])

    const playerMonHealthBar = playerMonHealthBox.add([
        rect(370, 10),
        color(0,200,0),
        pos(15, 50)
    ])

    tween(playerMonHealthBox.pos.x, 850, 0.3, (val) => playerMonHealthBox.pos.x = val, easings.easeInSine)

    const enemyMonHealthBox = add([
        rect(400, 100),
        outline(4),
        pos(-100, 50) 
    ])

    enemyMonHealthBox.add([
        text(worldState.enemyName.toUpperCase(), {size: 32}),
        color(10,10,10),
        pos(10, 10)
    ])

    enemyMonHealthBox.add([
        rect(370, 10),
        color(200,200,200),
        pos(15, 50)
    ])

    const enemyMonHealthBar = enemyMonHealthBox.add([
        rect(370, 10),
        color(0,200,0),
        pos(15, 50)
    ])

    tween(enemyMonHealthBox.pos.x, 100, 0.3, (val) => enemyMonHealthBox.pos.x = val, easings.easeInSine)

    const box = add([
        rect(window.innerWidth, 300),
        outline(4),
        pos(-2, 530)
    ])

    const content = box.add([
        text('CHICHI is ready to battle!', { size: 42}),
        color(10,10,10),
        pos(20,20)
    ])

    function reduceHealth(healthBar, damageDealt) {
        tween(
            healthBar.width,
            healthBar.width - damageDealt,
            0.5,
            (val) => healthBar.width = val,
            easings.easeInSine
        )
    }

    function increaseHealth(healthBar, healthHealed) {
        tween(
            healthBar.width,
            healthBar.width + healthHealed + 40,
            0.5,
            (val) => {
                healthBar.width = val
                if(healthBar.width>=370) {
                    healthBar.width = 370
                    content.text = "CHICHI is at max health."
                }
            },
            easings.easeInSine
        )

    }

    function makeMonFlash(mon) {
        tween(
            mon.opacity,
            0,
            0.3,
            (val) => {
                mon.opacity = val
                if (mon.opacity === 0) {
                    mon.opacity = 1
                }
            },
            easings.easeInBounce
        )
    }

    let phase = 'player-selection'
    onKeyPress('space', () => {
        if (playerMon.fainted || enemyMon.fainted) return

        if (phase === 'player-selection') {
            let move = 1
            content.text = '> Bite     Eat a Snack'
            phase = 'player-turn'

            onKeyPress('right', () => {
                move = 2
                content.text = '  Bite   > Eat a Snack'
                phase = 'player-turn2'

            })
            onKeyPress('left', () => {
                move = 1
                content.text = '> Bite     Eat a Snack'
                phase = 'player-turn'

            })
            // onKeyPress('up', () => {
            //     if (move === 1) {
            //         content.text = 'O Bite     Eat a Snack'
            //         phase = 'player-turn'
            //     }
            //     else if (move=== 2) {
            //         content.text = '  Bite   O Eat a Snack'
            //         phase = 'player-turn2'
            //     }
            // })
            return
        }

        if (phase === 'enemy-turn') {
            var attack
            var crit
            if(worldState.enemyName == "Racist man") {
                attack = " said something racist!"
                crit = " used OFFENSIVE RACIAL SLUR. \nIt's a critical hit!"
            }
            else if(worldState.enemyName == "Crashy laptop") {
                attack = " used CRASH!"
                crit = " shut down with an unsaved essay.. \nIt's a critical hit!"
            }
            else if(worldState.enemyName == "Scary ghost") {
                attack = " used SPOOK!"
                crit = " used SCARY FACE. It's a critical hit!"
            }
            else {
                attack = " slapped CHICHI in the face!"
                crit = " covered you with mold! It's a critical hit!"
            }
            
            content.text = worldState.enemyName.toUpperCase() + attack
            const damageDealt = Math.random() * 230

            if (damageDealt > 150) {
                content.text = worldState.enemyName.toUpperCase() + crit
            }

            reduceHealth(playerMonHealthBar, damageDealt)
            makeMonFlash(playerMon)

            phase = 'player-selection'
            return
        }

        // player attack move prompt
        if (phase === 'player-turn') {
            const damageDealt = Math.random() * 170 + 20

            if (damageDealt > 150) {
                content.text = 'CHICHI bit '+worldState.enemyName.toUpperCase()+" IN THE FACE."
            } else {
                content.text = 'CHICHI bit '+worldState.enemyName.toUpperCase()+"."
            }

            reduceHealth(enemyMonHealthBar, damageDealt)
            makeMonFlash(enemyMon)

            phase = 'enemy-turn'
        }

        // player heal move prompt
        if (phase === 'player-turn2') {
            const healthHealed = Math.random() * 180 + 20

            if (healthHealed > 110) {
                content.text = "CHICHI must've eaten something delicious\nbecause she healed a lot."
            } else {
                content.text = 'CHICHI ate a snack.'
            }

            increaseHealth(playerMonHealthBar, healthHealed)
            makeMonFlash(playerMon)

            phase = 'enemy-turn'
        }



    })

    function colorizeHealthBar(healthBar) {
        if (healthBar.width >= 200) {
            healthBar.use(color(0, 200, 0))
        }

        if (healthBar.width < 200) {
            healthBar.use(color(250, 150, 0))
        }

        if (healthBar.width < 100) {
            healthBar.use(color(200, 0, 0))
        }

    }

    function makeMonDrop(mon) {
        tween(
            mon.pos.y,
            800,
            0.5,
            (val) => mon.pos.y = val,
            easings.easeInSine
        )
    }

    onUpdate(() => {
        colorizeHealthBar(playerMonHealthBar)
        colorizeHealthBar(enemyMonHealthBar)

        if (enemyMonHealthBar.width < 0 && !enemyMon.fainted) {
            makeMonDrop(enemyMon)
            content.text = worldState.enemyName.toUpperCase() + ' DIED!'
            enemyMon.fainted = true
            setTimeout(() => {
                content.text = 'CHICHI won the battle!'
            }, 1000)
            setTimeout(() => {
                worldState.faintedMons.push(worldState.enemyName)
                worldState.battle_sound.stop()
                worldState.sound.play()
                go('world', worldState)
            }, 2000)
        }

        if (playerMonHealthBar.width < 0 && !playerMon.fainted) {
            makeMonDrop(playerMon)
            content.text = 'CHICHI fainted!'
            playerMon.fainted = true
            setTimeout(() => {
                content.text = 'You rush to get CHICHI healed!'
            }, 1500)
            setTimeout(() => {
                location.reload();
            }, 2000)

        }
    })
}