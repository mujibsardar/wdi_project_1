// ************************* Global Variables ******************************** //
// determine size of board set between 0 and 10
var boardSize = 6;
var horizontalLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
var verticalCounter = 7;
var horizontalCounter = 0;
var player1Turn = true;
var player_1 = new Player("Avan");
var player_2 = new Player("Android");
var boardCells2D = [['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','','']];
var showingDestinationCells = false;


// ************************* Objects ******************************** //
function Piece(_name, _color, _player, _moveRule){
  this.name = _name;
  this.color = _color;
  this.player = _player;
  this.moveRule = _moveRule;
}

function Player(_name){
  this.name = _name;
}

function MoveRule(_horizontal, _vertical, _diagonal, _hop){
  // All attributes/variables are ValidMove objects
  this.horizontal = _horizontal;
  this.vertical = _vertical;
  this.diagonal = _diagonal;
  this.hop = _hop;
}

function Location(_x, _y){
  this.x = _x;
  this.y = _y;
}

// Object to represent a possible move and or capture for a piece
function ValidMove(_isValidCapture, _numberOfMovesPositive, _numberOfMovesNegative){
      this.isValidCapture = _isValidCapture;
      this.numberOfMovesPositive = _numberOfMovesPositive;
      this.numberOfMovesNegative = _numberOfMovesNegative;
}




// ************************* BEGIN ******************************** //
startGame();


// ************************* 1st ******************************** //
function startGame(){
    setupBoard();
    setupPieces();
    makePiecesClickable();
}


// ************************* 2nd ******************************** //
function setupBoard(){
  flip = true;

  var $board = $("#container");
  $board.css("width", boardSize * 10 * 8 + 64 + "px");
  $board.css("height", boardSize * 10 * 8 + 64 + "px");

  for(i = 0; i < 64; i++){
    var $elem = jQuery('<div/>', { 'class': "cell" });
        $elem.css({"width": (boardSize*10 + "px"),"height": (boardSize*10 + "px"), "display": "inline-block", "border-style": "solid"})

    if(i % 8 == 0 && i != 0 ){
      flip = !flip;
      verticalCounter--;
      horizontalCounter = 0;
    }

    var cellObject = {horizontalValue: horizontalLetters[horizontalCounter], verticalValue: verticalCounter, piece: null, divRef: $elem}
    boardCells2D[horizontalCounter][verticalCounter] = cellObject;
    $elem.attr("data-xValue", horizontalCounter);
    $elem.attr("data-yValue", verticalCounter);

    if(i%2 == 0){
      if(flip){
        $elem.css("background-color", "BurlyWood");
        $elem.attr("color", "white");
      }
      else {
        $elem.css("background-color", "Brown");
        $elem.attr("color", "black");

      }
    } else {
      if(flip){
        $elem.css("background-color", "Brown");
        $elem.attr("color", "black");
      }
      else {
        $elem.css("background-color", "BurlyWood");
        $elem.attr("color", "white");
      }
    }

    horizontalCounter++;

    $board.append($elem);

  }
}


// ************************* 3rd ******************************** //
function setupPieces(){
  for(i=0; i < 8; i++){
    var location = new Location(i,1);
    var piece = new Piece("pawn", "black", player_2, returnMovingCaptureRules("pawn"));
    var imageText = '<img src="pawn_black.png" alt="black pawn">';
    placePieceInCell(location, piece, imageText);

    location = new Location(i,6);
    piece = new Piece("pawn", "white", player_1, returnMovingCaptureRules("pawn"));
    imageText = '<img src="pawn_white.png" alt="white pawn">';
    placePieceInCell(location, piece, imageText)
  }
}


// ************************* 4th ******************************** //
function makePiecesClickable(){
  var xValue;
  var yValue;
  //                        White                        //
  if(player1Turn){
    for(var i = 0; i < boardCells2D.length; i++){
      for(var j = 0; j < boardCells2D[i].length; j++){
        if (boardCells2D[i][j].piece != null){
          if(boardCells2D[i][j].piece.color === "white"){
            boardCells2D[i][j].divRef.on("click", function(){
              console.log("White Clicked");
              xValue = $(this).attr("data-xValue");
              yValue = $(this).attr("data-yValue");
                  // Is it the first time user is clicking a piece?
                  // Yes
                 if(!showingDestinationCells){
                   showingDestinationCells = !showingDestinationCells;
                   makeDestinationCellsClickable(new Location(xValue,yValue));
                 }
                  // No
                 else {
                   // User clicked on piece while destination cell were highlighted
                   showingDestinationCells = !showingDestinationCells;
                   // Remove click event listener on destination cells
                   unMakeDestinationCellsClickable();
                   // Remove the css highlights for those cells
                   removeCellHighlights(); // this works
                   // make all appropriate pieces clickable again
                   makePiecesClickable();
                 }
               })
          }
        }
      }
    }

  }
  //                        Black                        //
  else {
    for(var i = 0; i < boardCells2D.length; i++){
      for(var j = 0; j < boardCells2D[i].length; j++){
        if (boardCells2D[i][j].piece != null){
          if(boardCells2D[i][j].piece.color === "black"){
            boardCells2D[i][j].divRef.on("click", function(){
              console.log("Black Clicked");
              showingDestinationCells = !showingDestinationCells;
              xValue = $(this).attr("data-xValue");
              yValue = $(this).attr("data-yValue");
              // console.log("y: " + $(this).toSource());//.divRef.attr());
              if(!showingDestinationCells){
                // console.log("Black NOT Highlighted");
                showingDestinationCells = !showingDestinationCells;
                // console.log("changed to " + showingDestinationCells);
                makeDestinationCellsClickable(new Location(xValue,yValue));
               } else {
                //  console.log("Black Highlighted");
                 showingDestinationCells = !showingDestinationCells;
                //  console.log("changed to " + showingDestinationCells);
                 unMakeDestinationCellsClickable();
                 removeCellHighlights();
                 makePiecesClickable();
               }

               })
          }
        }
      }
    }
  }
}


// ************************* Helper Function ******************************** //
function returnMovingCaptureRules(_pieceName){
  switch(_pieceName){
    case "pawn":
    var pawnHorizontal = new ValidMove(false, 0, 0);
    var pawnVertical = new ValidMove(false, 1, 0); // move forward but can't capture
    var pawnDiagonal = new ValidMove(true, 1, 0); // forward capture diagonal only
    var pawnHop = new ValidMove(false, 0, 0);
    return new MoveRule(pawnHorizontal, pawnVertical, pawnDiagonal, pawnHop);
    break;
    default:
    alert("Exception, not a valid piece. Return null.");
    return null;
  }
}


// ************************* Helper Function ******************************** //
function placePieceInCell(_location, _piece, _imageText){
  var x = _location.x;
  var y = _location.y;

  boardCells2D[x][y].piece = _piece;
  boardCells2D[x][y].divRef.append(_imageText);
}


// ************************* Helper Function ******************************** //
function makeDestinationCellsClickable(_location){
  var xValue;
  var yValue;
  var selectedPiece = getPieceBasedOnLocation(_location);
  var location = _location;

  var arrayOfAllPossibleCells = returnAllPossibleDestinationCell(selectedPiece, location);
  arrayOfAllPossibleCells.forEach(function(element) {
      boardCells2D[element.x][element.y].divRef.on("click", function(){
      console.log("Destination Cell says Hey, you clicked me...Stop it.");
      xValue = $(this).attr("data-xValue");
      yValue = $(this).attr("data-yValue");
      removeOldClickableCells();
      removeCellHighlights();
      movePieceToNewLocation(location, new Location(xValue, yValue));
      checkForWinnerOrCheck();
      removeOldClickableCells();
    })
    highlightNewCells(new Location(element.x, element.y));
  })
}


// ************************* Helper Function ******************************** //
function unMakeDestinationCellsClickable(){
  $(".cell").unbind();
}


// ************************* Helper Function ******************************** //
function removeCellHighlights(){
  $(".cell").css("border-color", "black");
}


// ************************* Helper Function ******************************** //
function highlightNewCells(_location){
  boardCells2D[_location.x][_location.y].divRef.css("border-color", "blue");
}


// ************************* Helper Function ******************************** //
function checkForWinnerOrCheck(){
  switchTurns();
}


// ************************* Helper Function ******************************** //
function switchTurns(){
  player1Turn = !player1Turn;
  makePiecesClickable();
}


// ************************* Helper Function ******************************** //
function movePieceToNewLocation(_originLocation, _destinationLocation){
  var color = (player1Turn ? "white" : "black")
  console.log("movePiceToNewLocation " + color);
  var imgElementText = '<img src="pawn_' + color + '.png" alt="' + color + ' pawn">';
  var piece = boardCells2D[_originLocation.x][_originLocation.y].piece;
  var location = _destinationLocation;
  boardCells2D[_originLocation.x][_originLocation.y].divRef.children("img:first").remove();
  placePieceInCell(location, piece, imgElementText);
  makePiecesClickable();
}


// ************************* Helper Function ******************************** //
function returnAllPossibleDestinationCell(_piece, _location){
  var originX = parseInt(_location.x);
  var originY = parseInt(_location.y);
  var moveRule = _piece.moveRule;
  var returnArray = [];
  var playingDown = (_piece.color === "white");
  var destinationX;
  var destinationY;
  var validMove;

  // horizontal
  validMove = moveRule.horizontal;
  if (validMove.numberOfMovesPositive != 0 || validMove.numberOfMovesNegative != 0){
    destinationX = originX + validMove.numberOfMovesPositive;
    destinationY = originY;
    returnArray.push(new Location(destinationX, destinationY));
  }
  // vertical
  validMove = moveRule.vertical;
  if (validMove.numberOfMovesPositive != 0 || validMove.numberOfMovesNegative != 0){
    if(playingDown){
      destinationX = originX;
      destinationY = originY - validMove.numberOfMovesPositive;
    } else {
      destinationX = originX;
      destinationY = originY + validMove.numberOfMovesPositive;
    }
    returnArray.push(new Location(destinationX, destinationY));
  }

  // diagonal
  validMove = moveRule.diagonal;
  if (validMove.numberOfMovesPositive != 0 || validMove.numberOfMovesNegative != 0){

    if(playingDown){
    destinationX = originX - validMove.numberOfMovesPositive;
    destinationY = originY - validMove.numberOfMovesPositive;
    returnArray.push(new Location(destinationX, destinationY));
    destinationX = originX + validMove.numberOfMovesPositive;
    destinationY = originY - validMove.numberOfMovesPositive;
    returnArray.push(new Location(destinationX, destinationY));
  } else {
    destinationX = originX + validMove.numberOfMovesPositive;
    destinationY = originY + validMove.numberOfMovesPositive;
    returnArray.push(new Location(destinationX, destinationY));
    destinationX = originX - validMove.numberOfMovesPositive;
    destinationY = originY + validMove.numberOfMovesPositive;
    returnArray.push(new Location(destinationX, destinationY));
  }

  }
  // hop NEEDS FIXING
  validMove = moveRule.hop;
  if (validMove.numberOfMovesPositive != 0 || validMove.numberOfMovesNegative != 0){

    if(playingDown){
      destinationX = originX - validMove.numberOfMovesPositive;
      destinationY = originY - validMove.numberOfMovesPositive;
  } else {
      destinationX = originX + validMove.numberOfMovesPositive;
      destinationY = originY + validMove.numberOfMovesPositive;
  }
    returnArray.push(new Location(destinationX, destinationY));
  }
  return returnArray;


}


// ************************* Helper Function ******************************** //
function removeOldClickableCells(){
  $(".cell").unbind();
  // for(var i = 0; i < boardCells2D.length; i++){
  //   for(var j=0; j <boardCells2D[i].length; j++){
  //     boardCells2D[i][j].divRef.unbind();
  //   }
  // }
}


// ************************* Helper Function ******************************** //
function getPieceBasedOnLocation(_location){
  var x = _location.x;
  var y = _location.y;
  return boardCells2D[x][y].piece;
}
