// ========== OBJECTS ==========
let mars = {
    rows: 10,
    columns: 10,
    grid: []
}

let directions = {
    'N': {
        name: 'North',
        forward: 'N',
        backwards: 'S',
        left: 'W',
        right: 'E'
    },
    'S': {
        name: 'South',
        forward: 'S',
        backwards: 'N',
        left: 'E',
        right: 'W'
    },
    'W': {
        name: 'West',
        forward: 'W',
        backwards: 'E',
        left: 'S',
        right: 'N'
    },
    'E': {
        name: 'East',
        forward: 'E',
        backwards: 'W',
        left: 'N',
        right: 'S'
    }
}

let rovers = [
    {
        name: 'Curiosity',
        symbol: 'C',
        direction: 'N',
        x: 0,
        y: 0,
        travelLog: []
    },
    {
        name: 'Perseverance',
        symbol: 'P',
        direction: 'W',
        x: 7,
        y: 8,
        travelLog: []
    },
    {
        name: 'Opportunity',
        symbol: 'O',
        direction: 'E',
        x: 4,
        y: 5,
        travelLog: []
    }
];

let obstacles = [
    {x: 5, y: 5},
    {x: 2, y: 6},
    {x: 7, y: 6},
    {x: 7, y: 1},
    {x: 0, y: 3},
    {x: 8, y: 4},
    {x: 3, y: 1},
    {x: 1, y: 9},
    {x: 5, y: 8}
];

// ========== VARIABLES ==========
let freeTileSymbol = '\u25e6';
let obstacleSymbol = '\u25c6';
let commands = 'rbffbrfbffrlfffflfffllffffluibarfffflbrefbflrbfffffrlbrbfaiopsffff';
let moveLog = ''

// ========== CALLS ==========
initGrid();
printGrid('\n========== STARTING POSITIONS ==========\n');

getCommands(commands);

printTravelLogs();
printGrid('\n========== FINAL POSITIONS ==========\n');

// ========== FUNCTIONS ==========
function turnLeft(rover) {
    commandMessage('turnLeft', rover);
    rover.direction = directions[rover.direction].left;
    moveLog += `${rover.name} ${rover.symbol} turned left, now facing ${directions[rover.direction].name} in position ${rover.x},${rover.y}.\n`;
}

function turnRight(rover) {
    commandMessage('turnRight', rover);
    rover.direction = directions[rover.direction].right;
    moveLog += `${rover.name} ${rover.symbol} turned right, now facing ${directions[rover.direction].name} in position ${rover.x},${rover.y}.\n`;
}

function moveForward(rover) {
    commandMessage('moveForward', rover);
    checkClearPath(rover, directions[rover.direction].forward);
}

function moveBackwards(rover) {
    commandMessage('moveBackwards', rover);
    checkClearPath(rover, directions[rover.direction].backwards);
}

function checkClearPath(rover, direction) {
    let nextX = rover.x;
    let nextY = rover.y;

    switch(direction) {
        case 'N':
            nextY -= 1;
            break;
        case 'E':
            nextX += 1;
            break;
        case 'S':
            nextY += 1;
            break;
        case 'W':
            nextX -= 1;
    }

    if(nextX==-1 || nextX == mars.columns || nextY==-1 || nextY == mars.rows) {
        moveLog += `========== ERROR! PATH NOT CLEAR! ==========\n${rover.name} ${rover.symbol} can't move there, it's on the edge!\n`;
        noMoveLog(moveLog);
        return;
    }
    
    for (let i = 0; i < obstacles.length; i++) {
        if(nextX == obstacles[i].x && nextY == obstacles[i].y) {
            moveLog += `========== ERROR! PATH NOT CLEAR! ==========\n${rover.name} ${rover.symbol} can't move there, there's an obstacle!\n`;
            noMoveLog(moveLog);
            return;
        }
    }

    for (let i = 0; i < rovers.length; i++) {
        let otherRover = rovers[i];
        if(otherRover != rover && nextX == otherRover.x && nextY == otherRover.y) {
            moveLog += `========== ERROR! PATH NOT CLEAR! ==========\n${rover.name} ${rover.symbol} can't move there, ${otherRover.name} ${rover.symbol} is in the way!\n`;
            noMoveLog(moveLog);
            return;
        }
    }

    moveRover(rover, nextX, nextY);
    moveLog += `${rover.name} ${rover.symbol} moved ${directions[direction].name} to ${rover.x},${rover.y}. It's facing ${directions[rover.direction].name}.\n`;
    printGrid(moveLog);
}

function moveRover(rover, x, y) {
    rover.travelLog.push({x: rover.x, y: rover.y});
    rover.x = x;
    rover.y = y;
    updateGrid(rover);
}

function getCommands(s) {
    for (let i = 0; i < s.length; i++) {        
        let currentRover = rovers[i % rovers.length];
        let command = s.charAt(i);
        switch (command) {
            case 'l':
                turnLeft(currentRover);
                break;
            case 'r':
                turnRight(currentRover);
                break;
            case 'f':
                moveForward(currentRover);
                break;
            case 'b':
                moveBackwards(currentRover);
                break;
            default:
                moveLog += `\n========== ERROR! INVALID COMMAND! ==========\n'${command}' called for ${currentRover.name} is not a valid command!\n`;
                noMoveLog(moveLog);
        }
        moveLog = '';
    }      
}

function commandMessage(command, rover) {
    moveLog += `\nCOMMAND: ${command} | ROVER: ${rover.name} ${rover.symbol} | POSITION: ${rover.x},${rover.y} | FACING DIRECTION: ${directions[rover.direction].name}\n`;
}

function printTravelLogs() {
    for (let i = 0; i < rovers.length; i++) {
        let rover = rovers[i];
        let log = `${rover.name} ${rover.symbol} traveled the following path:`;
        for(let step = 0; step < rover.travelLog.length; step++)
            log += `\n${rover.travelLog[step].x},${rover.travelLog[step].y}`;
        log += `\n${rover.x},${rover.y}`;
        console.log(log);
    }   
}

function initGrid() {
    for(let y = 0; y < mars.rows; y++) {
        let row = [];
        for(let x = 0; x < mars.columns; x++)
            row.push(freeTileSymbol);
        mars.grid.push(row);
    }
    for (let i = 0; i < rovers.length; i++) {
        let rover = rovers[i];
        mars.grid[rover.y][rover.x] = rover.symbol;
    }

    for (let i = 0; i < obstacles.length; i++) {
        let obstacle = obstacles[i];
        mars.grid[obstacle.y][obstacle.x] = obstacleSymbol;
    }
}

function updateGrid(rover) {
    let previousPosition = rover.travelLog.slice(-1).pop();
    mars.grid[previousPosition.y][previousPosition.x] = freeTileSymbol;
    mars.grid[rover.y][rover.x] = rover.symbol;
}

function printGrid(s) {
    s += mars.grid.map(a => a.join(' ')).join('\n');
    s += `\n\n`;
    console.log(s);
}

function noMoveLog(s) {
    s += `\n`;
    console.log(s);
}