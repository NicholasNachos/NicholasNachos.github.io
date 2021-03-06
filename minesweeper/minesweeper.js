var board = [];
var table = document.getElementById('board');
var bombs = [];
var numBombs = 40;
var dead = false;
var rows = 16;
var cols = 16;
var gameStart = true;
var win = false;
var done = false;

var flags = 0;
var sec = 0;
var min = 0;
var secStr = '00';
var minStr = '00';
var timer;
var time;

function num(td) {
    var count = getCount(td);
    td.style.backgroundImage = '';
    td.innerText = count;
    switch(count){
        case 1:
            td.style.color = 'blue';
            break;
        case 2:
            td.style.color = 'green';
            break;
        case 3:
            td.style.color = 'red';
            break;
        case 4:
            td.style.color = 'purple';
            break;
        case 5:
            td.style.color = 'maroon';
            break;
        case 6:
            td.style.color = 'turquoise';
            break;
        case 8:
            td.style.color = 'grey';
            break;
    }

}

function isWin(){
    for(v=0;v<board.length;v++){
        for(q=0;q<board[v].length;q++){
            var td = board[v][q];
            if(!testForBomb(parseInt(td.getAttribute('row')), parseInt(td.getAttribute('col'))) &&
                td.getAttribute('tile') !== 'none'){
                return false;
            }
        }
    }
    return true;
}

function contains(li, x) {
    for(v=0;v<li.length;v++){
        if(li[v][0] === x[0] && li[v][1] === x[1]){
            return true;
        }
    }
    return false;
}

function startGame() {
    gameStart = false;
    var firLi = [[x,y]];
    for(b=0;b<getSorounding(td).length;b++){
        firLi.push([parseInt(getSorounding(td)[b].getAttribute('row')), parseInt(getSorounding(td)[b].getAttribute('col'))])
    }
    bombs.push([Math.floor(Math.random()*rows), Math.floor(Math.random()*cols)]);
    for(bo=0;bo<(numBombs-1);bo++){
        console.log('bomb')
        var r = Math.floor(Math.random()*rows);
        var c = Math.floor(Math.random()*cols);
        var bomb = [r,c];
        while((testBombs(bomb) || bombs.length===0) || contains(firLi, bomb)){
            r = Math.floor(Math.random()*rows);
            c = Math.floor(Math.random()*cols);
            bomb = [r,c];
        }
        bombs.push(bomb);
    }
}

function click(td){
    var x = parseInt(td.getAttribute('row'));
    var y = parseInt(td.getAttribute('col'));
    if(gameStart){
        startGame()
    }
    if(!dead && !win && td.getAttribute('tile') !== 'flag'){
        var around = getSorounding(td);
        var count = 0;
        if(testForBomb(x, y)){
            dead = true;
            board[x][y].style.backgroundImage = "url('../png/bomb.png')";
            for(i=0;i<bombs.length;i++){
                board[bombs[i][0]][bombs[i][1]].style.backgroundImage = "url('../png/bomb2.png')"
            }
            board[x][y].style.backgroundImage = "url('../png/bomb.png')"
        }
        else{
            td.style.backgroundImage = '';
            td.setAttribute('tile', 'none');
            if(getCount(td)>0){
                num(td);
            }
            else{
                for(w=0;w<around.length;w++){
                    around[w].style.backgroundImage = '';
                    around[w].setAttribute('tile', 'none');
                    if(getCount(around[w])>0){
                        num(around[w]);
                    }
                    else{
                        var around2 = getSorounding(around[w]);
                        for(f=0;f<around2.length;f++){
                            if(!isTD(around2[f], around)){
                                around.push(around2[f]);
                            }
                        }
                    }
                }
            }
        }
    }
    if(dead){
        done=true;
        console.log('You died')
    }
    if(isWin()){
        done=true;
        win=true;
        for(bo=0;bo<bombs.length;bo++){
            board[bombs[bo][0]][bombs[bo][1]].style.backgroundImage = 'url(../png/flag.png)'
        }
    }
    if(done){
        console.log('stop');
        clearInterval(timer);
        time = sec + min * 60;
    }
    console.log(time);
}

function isTD(td, li){
    var x = parseInt(td.getAttribute('row'));
    var y = parseInt(td.getAttribute('col'));
    for(i=0;i<li.length;i++){
        var tx = parseInt(li[i].getAttribute('row'));
        var ty = parseInt(li[i].getAttribute('col'));
        if(x === tx && y === ty){
            return true;
        }
    }
    return false;
}

function getCount(td){
    var li = getSorounding(td);
    var count = 0;
    for(q=0;q<li.length;q++){
        var x = parseInt(li[q].getAttribute('row'));
        var y = parseInt(li[q].getAttribute('col'));
        if(testForBomb(x,y)){
            count ++
        }
    }
    return count;
}

function getSorounding(td){
    var around = [];
    var x = parseInt(td.getAttribute('row'));
    var y = parseInt(td.getAttribute('col'));
    if(x>0){
        around.push(board[x-1][y]);
        if(y>0){
            around.push(board[x-1][y-1])
        }
    }
    if(x<rows){
        around.push(board[x+1][y]);
        if(y<cols){
            around.push(board[x+1][y+1])
        }
    }
    if(y>0){
        around.push(board[x][y-1]);
        if(x<rows){
            around.push(board[x+1][y-1])
        }
    }
    if(y<cols){
        around.push(board[x][y+1]);
        if(x>0){
            around.push(board[x-1][y+1])
        }
    }
    return around;
}

function testBombs (bomb){
    var rep = false;
    for(f=0;f<bombs.length;f++){
        if(bombs[f][0] === bomb[0] && bombs[f][1] === bomb[1]){
            rep = true;
        }
    }
    return rep;
}

function testForBomb(x, y){
    var isBomb = false;
    for(i=0;i<bombs.length;i++){
        if(bombs[i][0] === x && bombs[i][1] === y){
            return true;
        }
    }
    return false;
}

var difChange = function(specs){

};

var dif = document.getElementsByClassName('dif');
var specs = [[9,9,10], [16,16,40], [16, 30, 99]];
var easy = dif[0];
console.log(dif, easy);

easy.addEventListener('click', function () {
    if(!done || gameStart){
        rows = 9;
        cols = 9;
        numBombs = 10;
        console.log(rows, cols);
        makeBoard();
    }
});
var med = dif[1];
med.addEventListener('click', function () {
    if(!done || gameStart){
        rows = 16;
        cols = 16;
        numBombs = 40;
        console.log(rows, cols);
        makeBoard();
    }
});
var hard = dif[2];
hard.addEventListener('click', function () {
    if(!done && gameStart){
        rows = 16;
        cols = 30;
        numBombs = 99;
        console.log(rows, cols);
        makeBoard();
    }
});

function makeBoard() {
    document.getElementById('flagsMax').innerHTML = numBombs;
    console.log(rows, cols);
    board = [];
    table.innerHTML = '';
    for(i=0;i<rows+1;i++){
        var boardRow = [];
        var tr = document.createElement('TR');
        for(f=0;f<cols+1;f++){
            var td = document.createElement('TD');
            boardRow.push(td);
            td.setAttribute('row', i);
            td.setAttribute('col', f);
            td.setAttribute('tile', 'square');
            td.style.backgroundImage = "url('../png/square.png')";
            td.addEventListener('click', function(e){
                if(gameStart){
                    timer = setInterval(function () {
                        sec ++;
                        if(sec>59){
                            sec = 0;
                            min ++;
                        }
                        secStr = sec;
                        minStr = min;
                        if(sec<10){
                            secStr = '0' + sec;
                        }
                        if(min<10){
                            minStr = '0' + min;
                        }
                        document.getElementById('clock').innerText = minStr + ':' + secStr;
                    }, 1000);
                }
                if(!done){
                    click(e.path[0])
                }
            });
            td.addEventListener('contextmenu', function (e) {
                e.preventDefault();
                if(e.path[0].getAttribute('tile') === 'square'){
                    e.path[0].style.backgroundImage = "url('../png/flag.png')";
                    e.path[0].setAttribute('tile', 'flag');
                    flags++;
                }
                else if(e.path[0].getAttribute('tile') === 'flag'){
                    e.path[0].style.backgroundImage = "url(../png/square.png)";
                    e.path[0].setAttribute('tile', 'square')
                    flags--;
                }
                document.getElementById('flagsNum').innerHTML = flags;
                if(flags>numBombs){
                    document.getElementById('flags').style.color = 'red';
                }
                else if(flags<=numBombs) {
                    document.getElementById('flags').style.color = '';
                }
            });
            tr.appendChild(td);
        }
        table.appendChild(tr);
        board.push(boardRow);

    }
    console.log(board);
}

makeBoard();