class bot {
    constructor(color, maxDepth) {
        this.color = color
        this.otherColor = [0, 2, 1][color]
        this.maxDepth = maxDepth
        this.firstMove = true
        this.rageQuit = false;
    }

    move(vision) {
        turn = [0, 2, 1][turn]
        
        //start in the center
        if (this.firstMove) {
            this.firstMove = false
            vision.move(this.color, 3)
            return 
        }

        let botMove = this.MinMax(vision, true, 0, -Infinity, Infinity)
        if (vision.move(this.color, botMove)) {
            return 
        }

        console.error("MINMAX MACHINE BROKE")
    }

    angery() { 
        this.rageQuit = true;
        this.maxDepth = 1
    }

    MinMax(vision, maxing, depth, alpha, beta) {

        //terminal state
        let gameState = vision.fetchGameState()

        switch (gameState) {
            case -1: 
                break;
            case 0:
                return 0.5;
            default:
                if (gameState == this.color) {
                    return 1
                }
                return -1
        }

        //don't go forever
        if (depth > this.maxDepth) {return 0}
    
        let bestScore
        if (maxing) { bestScore = -Infinity;}
        else { bestScore = Infinity }
        
        let bestChoice = null;

        for (let i in vision.board) {
            let working = new game(vision.board)
            let possibleMoveValid;

            if (maxing) { possibleMoveValid = working.move(this.color, i) }
            else { possibleMoveValid = working.move(this.otherColor, i) }
            
            if (possibleMoveValid) { //find valid move
                let possibleScore = this.MinMax(working, !maxing, depth + 1, alpha, beta)



                if (maxing) {
                    alpha = max(possibleScore, alpha)
                    if (possibleScore > bestScore) {
                        bestChoice = i
                        bestScore = possibleScore
                    }
                }

                else {
                    beta = min(possibleScore, beta)
                   if (possibleScore < bestScore) {
                        bestChoice = i
                       bestScore = possibleScore
                    } 
                }

                if (alpha >= beta) { 
                    break
                }
            }
        }
    

        if (depth == 0) {

            if (bestScore == 0) { 
                bestChoice = round(random(6))
                while (vision.board[bestChoice][0] != 0) { 
                    bestChoice = (bestChoice + 1) % 7
                }
            }

            return bestChoice
        }

        return bestScore
    
    }
}