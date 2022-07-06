const grid = document.querySelector('.grid')
const resultsDisplay = document.querySelector('.results')
let currentShooterIndex = 202
let width = 15
let direction = 1
let encroachersId
let goingRight = true
let encroachersRemoved = []
let results = 0

for(let i = 0; i<225; i++){
    const square = document.createElement('div')
    grid.appendChild(square)
}

const squares = Array.from(document.querySelectorAll('.grid div'))

const alienEncroachers = [
    0,1,2,3,4,5,6,7,8,9,
    15,16,17,18,19,20,21,22,23,24,
    30,31,32,33,34,35,36,37,38,39
]

function draw(){
    for(let i = 0; i<alienEncroachers.length; i++){
        if(!encroachersRemoved.includes(i)){
            squares[alienEncroachers[i]].classList.add('encroacher')
        }
       
    }
}

draw()

function remove(){
    for(let i = 0; i<alienEncroachers.length; i++){
        squares[alienEncroachers[i]].classList.remove('encroacher')
    }
}

squares[currentShooterIndex].classList.add('shooter')

function moveShooter(e){
    squares[currentShooterIndex].classList.remove('shooter')
    switch(e.key){
        case 'ArrowLeft':
            if(currentShooterIndex % width !==0)
                    currentShooterIndex-=1
                    break;
        case 'ArrowRight':
            if(currentShooterIndex% width < width -1)
                currentShooterIndex+=1
                   break;

    }
    squares[currentShooterIndex].classList.add('shooter')
}
document.addEventListener('keydown', moveShooter)

function moveEncroachers(){
    const leftEdge = alienEncroachers[0] %width===0
    const rightEdge = alienEncroachers[alienEncroachers.length-1] %width === width-1
    remove()

    if(rightEdge && goingRight){
        for(let i = 0; i<alienEncroachers.length; i++){
            alienEncroachers[i] += width+1
            direction = -1
            goingRight=false
        }
    }

    if(leftEdge && !goingRight){
        for(let i = 0; i<alienEncroachers.length; i++){
            alienEncroachers[i] += width-1
            direction = 1
            goingRight=true
        }
    }


    for(let i=0; i<alienEncroachers.length; i++){
        alienEncroachers[i] += direction
    }
    draw()

    if(squares[currentShooterIndex].classList.contains('encroacher','shooter')){
        resultsDisplay.innerHTML = 'GAME OVER'
        clearInterval(encroachersId)
    }
    for(let i = 0; i<alienEncroachers.length; i++){
        if(alienEncroachers[i] > squares.length){
            resultsDisplay.innerHTML = 'GAME OVER'
            clearInterval(encroachersId)
        }
    }

    if(encroachersRemoved.length===alienEncroachers.length){
        resultsDisplay.innerHTML = 'YOU WIN'
        clearInterval(encroachersId)
    }

}

encroachersId = setInterval(moveEncroachers, 300)

function shoot(e){
    let laserId
    let currentLaserIndex = currentShooterIndex
    function moveLaser(){
        squares[currentLaserIndex].classList.remove('laser')
        currentLaserIndex -= width
        squares[currentLaserIndex].classList.add('laser')

        if(squares[currentLaserIndex].classList.contains('encroacher')){
            squares[currentLaserIndex].classList.remove('laser')
            squares[currentLaserIndex].classList.remove('encroacher')
            squares[currentLaserIndex].classList.add('boom')
            setTimeout(()=>squares[currentLaserIndex].classList.remove('boom'),300)
            clearInterval(laserId)

            const encroacherRemoval = alienEncroachers.indexOf(currentLaserIndex)
            encroachersRemoved.push(encroacherRemoval)
            results++
            resultsDisplay.innerHTML = results
            console.log(encroacherRemoval)
            
        }
        
    }
    switch(e.key){
        case 'ArrowUp':
        laserId = setInterval(moveLaser, 100)
    }
}

document.addEventListener('keydown', shoot)