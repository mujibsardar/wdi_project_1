// determine size of board set between 0 and 10
var boardSize = 6;
var horizontalLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
var verticalCounter = 8;
var horizontalCounter = 0;
var boardDimensionValue = 8;

// Chess Pieces
// var piece = {name: "PAWN", color: "black"};

var boardCellsRaw = [];
var boardCells2D = [['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','','']];

function setupBoard(){
  // setupBoardCells2D();
  flip = true;

  for(i = 0; i < 64; i++){
    var board = document.getElementById("container");
    board.style.width = boardSize * 10 * 8 + 64 + "px";
    board.style.height = boardSize * 10 * 8 + 64 + "px";
    board.style.backgroundColor = "green";
    board.style.marginLeft = "40px";
    board.style.marginTop = "20px";
    board.style.borderStyle = "solid";


    var newElement = document.createElement("div");
    newElement.style.width = boardSize*10 + "px";
    newElement.style.height = boardSize*10 + "px";
    newElement.style.display = "inline-block";
    newElement.className = "cell";
    newElement.style.borderStyle = "solid";
    if(i % 8 == 0 && i != 0 ){
      flip = !flip;
      verticalCounter--;
      horizontalCounter = 0;
    }
    newElement.setAttribute('horizontalValue', horizontalLetters[horizontalCounter]);
    newElement.setAttribute('verticalValue', verticalCounter);
    newElement.addEventListener("click", showPosition);
    var cellObject = {horizontalValue: horizontalLetters[horizontalCounter], verticalValue: verticalCounter, piece: null, divRef: newElement}
    boardCells2D[horizontalCounter][verticalCounter] = cellObject;


    horizontalCounter++;

    if(i%2 == 0){
      if(flip){
        newElement.style.backgroundColor = "white";
        newElement.setAttribute("color", "white");
      }
      else {
        newElement.style.backgroundColor = "black";
        newElement.setAttribute("color", "black");

      }
    } else {
      if(flip){
        newElement.style.backgroundColor = "black";
        newElement.setAttribute("color", "black");
      }
      else {
        newElement.style.backgroundColor = "white";
        newElement.setAttribute("color", "white");

      }
    }

    boardCellsRaw.push(newElement);
    board.appendChild(newElement);

    // boardCells = makeTwoDArray(boardCells);
  }
  //
  // boardCellsRaw[5].innerHTML = '<img src="pawn.png" alt="">'
}

function showPosition(){
  alert(this.getAttribute("horizontalValue") + " " + this.getAttribute("verticalValue"));
}

// function makeTwoDArray(singleArray){
//   var return2Darray = [];
//   var top
// }

function setupPieces(){
  for(i=0; i < 8; i++){
    boardCells2D[i][2].piece = createPiece("pawn", "black");
    boardCells2D[i][2].divRef.innerHTML = '<img src="pawn_black.png" alt="black pawn">';

    boardCells2D[i][7].piece = createPiece("pawn", "white");
    boardCells2D[i][7].divRef.innerHTML = '<img src="pawn_white.png" alt="white pawn">';
  }

}

function createPiece(nameArg, colorArg){
  return {name: nameArg, color: colorArg}
}

setupBoard();
setupPieces();
