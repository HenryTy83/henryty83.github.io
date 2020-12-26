class bot {
    constructor(color, maxDepth) {
        this.color = color
        this.maxDepth = maxDepth
        this.firstMove = true
    }

    move(vision) {
        let botMove = this.MinMax(vision.board, true, 0, -Infinity, Infinity)
        if (vision.move(this.color, botMove)) {
            move = [0, 2, 1][move]
            return 
        }

        console.error("MINMAX MACHINE BROKE")
    }

    MinMax(game, maxing, depth, alpha, beta) {    
        //start in the center
        if (this.firstMove) {
            this.firstMove = false
            return 3
        }

        //terminal state
        let gameState = game.fetchGameState()

        switch (gameState) {
            case -1: 
                break;
            case 0:
                return 0.5;
            case 1:
                return 1
            case 2:
                return -1
        }

        console.log("e")

        //don't go forever
        if (depth > this.maxDepth) {return 0}

        let a = alpha
        let b = beta
    
        if (maxing) {
            //red's turn
            let bestScore = -Infinity;
            let bestChoice = null;
    
            for (let i in game.board) {
                    let working = new game(game.board)
                    if (working.move(color, i)) { //find valid move
                        let possibleScore = this.MinMax(working, false, depth + 1, alpha, beta)
                        if (possibleScore > bestScore) {
                            bestChoice = i
                            bestScore = possibleScore
                        }

                        a = max(a, possibleScore)

                        if (a >= b) {return bestScore}
                    }
            }
        
    
            if (depth == 0) {
                return bestChoice
            }
    
            return bestScore
        }
    
        else {
             //red's turn
             let bestScore = Infinity;
             let bestChoice = null;
     
             for (let i in game.board) {
                     let working = new game(game.board)
                     if (working.move(color, i)) { //find valid move
                         let possibleScore = this.MinMax(working, true, depth + 1, alpha, beta)
                         if (possibleScore < bestScore) {
                            bestChoice = i
                            bestScore = possibleScore
                         }
 
                         b = min(b, possibleScore)
 
                         if (a >= b) {return bestScore}
                     }
             }
         
     
             if (depth == 0) {
                return bestChoice
             }
     
            return bestScore

            }
    }
}