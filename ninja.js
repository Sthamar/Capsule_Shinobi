document.addEventListener('DOMContentLoaded', () => {
    const player = document.querySelector('.player-left');
    const pg = document.querySelector('.play-ground');
    const score = document.querySelector('.score-count');
    const gameOverMessage = document.querySelector('.game-over');
    const playAgainButton = document.querySelector('.play-again');
    const backgroundMusic = new Audio('sounds/bgm.mp3');
        backgroundMusic.loop = true;  // Make it loop
        backgroundMusic.volume = 0.2;
    const arigato = new Audio('sounds/play-again.mp3');
    const jump = new Audio('sounds/jump.mp3');
    jump.volume = 0.2;
    const coin = new Audio('sounds/coin.mp3');
    const gameOverSound = new Audio('/sounds/gameOver.mp3');
    const slashSound = new Audio('/sounds/sword.mp3')
    
    let current_score = 0;
    let gameOver = false;

    let obstacleInterval;
    let coinInterval;

    // Function to handle Game Over
    function gameOverHandler(){
        gameOver = true;
        gameOverMessage.style.display = 'block';
        playAgainButton.style.display = 'block';
        backgroundMusic.pause();
        gameOverSound.play();
        slashSound.play();

        // Disable animations
        const animatedElements = document.querySelectorAll('.player-left, .player-right, .obs, .obs-right, .coin, .coin-right, .windows');
        animatedElements.forEach(element => {
            element.classList.add('no-animations');
        });
    }

    // Function to reset the game
    function resetGame(){
        current_score = 0;
        score.textContent = current_score;
        gameOverMessage.style.display = 'none';
        playAgainButton.style.display = 'none';
        gameOver = false;

        // Clear existing intervals
        clearInterval(obstacleInterval);
        clearInterval(coinInterval);

        const animatedElements = document.querySelectorAll('.player-left, .player-right, .obs, .obs-right, .coin, .coin-right, .windows');
        animatedElements.forEach(element => {
            element.classList.remove('no-animations');
        });
        arigato.play()
        // Start new game
        startGame();
    }

    // Create obstacle
    function createObstacle(){
        if(gameOver){
            return;
        }
        const obstacle = document.createElement('div');
        const isLeft = Math.random() > 0.5;

        if(isLeft){
            obstacle.classList.add('obs');
        }else{
            obstacle.classList.add('obs-right');
        }

        pg.appendChild(obstacle);

        // Check for collision only when obstacle is added
        const collisionCheckInterval = setInterval(() => {
            if (checkCollision(player, obstacle)) {
                clearInterval(collisionCheckInterval); // Stop checking once collision happens
                gameOverHandler();
            }
        }, 50);

        setTimeout(() => {
            obstacle.remove();
            clearInterval(collisionCheckInterval); // Clear the collision check when the obstacle is removed
        }, 4000);
    }

    // Check collision
    function checkCollision(player, obstacle) {
        const playerRect = player.getBoundingClientRect();
        const obsRect = obstacle.getBoundingClientRect();

        return !(
            playerRect.right < obsRect.left ||
            playerRect.left > obsRect.right ||
            playerRect.bottom < obsRect.top ||
            playerRect.top > obsRect.bottom
        );
    }

    // Create coin
    function createCoin(){
        if(gameOver){
            return;
        }
        const coins = document.createElement('div');
        const isLeft = Math.random() > 0.5;

        if(isLeft){
            coins.classList.add('coin');
        }else{
            coins.classList.add('coin-right');
        }

        pg.appendChild(coins);

        // Check for coin collision
        const coinCollisionInterval = setInterval(() => {
            if(checkCollision(player, coins)){
                coin.play();
                coins.remove();
                current_score += 10;
                score.textContent = current_score;
                clearInterval(coinCollisionInterval); // Stop checking once the coin is collected
            }
        }, 50);

        setTimeout(() => {
            coins.remove();
            clearInterval(coinCollisionInterval); // Clear the coin collision check when the coin is removed
        }, 4000);
    }

    // Start the game
    function startGame(){

         // Set the background music volume
        backgroundMusic.play();
        obstacleInterval = setInterval(() => {
            createObstacle();
        }, 1500);

        coinInterval = setInterval(() => {
            createCoin();
        }, 10000);
    }

    startGame();

    // Restart game on "Play Again"
    playAgainButton.addEventListener('click', () => {
        
        resetGame();
    });

    //jump handle
    function jumpHandle(){
        if(player.classList.contains('player-right')){
            player.classList.remove('player-right');
            player.classList.add('player-left');
        } else {
            player.classList.remove('player-left');
            player.classList.add('player-right');
        }
    }
    // Player control (toggle left/right)
    document.addEventListener('keydown', (event) => {
        if(event.code == 'Space'){
            jump.play();
            jumpHandle()
        }
    });

    document.addEventListener('touchstart', () => {
        jump.play();
        jumpHandle();
    });
    
});
