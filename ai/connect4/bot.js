class bot {
    constructor(color, maxDepth) {
        this.color = color
        this.maxDepth = maxDepth
        this.firstMove = true
    }

    move(vision) {
        let botMove = this.MinMax(vision, true, 0, -Infinity, Infinity)
        if (vision.move(this.color, botMove)) {
            turn = [0, 2, 1][turn]
            return 
        }

        console.error("MINMAX MACHINE BROKE")
    }

    MinMax(vision, maxing, depth, alpha, beta) { 
        //start in the center
        if (this.firstMove) {
            this.firstMove = false
            return 3
        }

        //terminal state
        let gameState = vision.fetchGameState()

        if (gameState != -1) {
            console.log(vision, gameState)
        }

        switch (gameState) {
            case -1: 
                break;
            case 0:
                return 0.5;
            case 1:
            case 2:
                if (gameState == this.color) {
                    return 1
                }
                return -1
        }

        //don't go forever
        if (depth > this.maxDepth) {return 0}

        let a = alpha
        let b = beta
    
        if (maxing) {
            //red's turn
            let bestScore = -Infinity;
            let bestChoice = null;
    
            for (let i in vision.board) {
                    let working = new game(vision.board)
                    if (working.move(color, i)) { //find valid move
                        let possibleScore = this.MinMax(working, false, depth + 1, alpha, beta)
    
                        if (possibleScore > bestScore) {
                            bestChoice = i
                            bestScore = possibleScore
                        }

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
     
             for (let i in vision.board) {
                     let working = new game(vision.board)
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