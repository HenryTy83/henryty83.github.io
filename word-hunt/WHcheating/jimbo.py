import math 

with open('./sanitized.txt') as f:
    rawWords = f.read()
    rawWords = rawWords.lower()
    words = rawWords.split('\n') # init dictionary as array

board = input('Board: (left to right, top to bottom): ')


def formWord(path):
    output = ''
    for c in path:
        output += board[c]
    return output

def getNeighbors(pos, path):
    #find all unvisited valid neighbors
    neighbors = []
    posx = pos % 4
    posy = int(math.floor(pos/4))
    for x in range(posx-1, posx+2):
        for y in range(posy-1, posy+2):
            if (x >= 0 and x <= 3 and y >= 0 and y <= 3 and not((4*y + x) in path)):
                neighbors.append(4*y + x)
    return neighbors

found = []

def search(pos, path):
    word = formWord(path)
    if not(word in rawWords): #not even a fragment anywhere
        return
    if (len(path)>=5) and (word in words):
        if not(word in found):
            found.append(word)
            print(word)
        return
    n = getNeighbors(pos, path)
    if len(n) > 0:
        for newPos in n:
            working = path.copy()
            working.append(newPos)
            search(newPos, working)

for i in range(0, 16):
    search(i, [i])