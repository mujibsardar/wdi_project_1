// ************************* Global Variables ******************************** //
// determine size of board set between 0 and 10
var boardSize = 6;
var horizontalLetters = ["a", "b", "c", "d", "e", "f", "g", "h"];
var verticalCounter = 7;
var horizontalCounter = 0;
var player1Turn = true;
var player_1 = new Player("Avan");
var player_2 = new Player("Android");
var capturedPieces = {player_1: [], player_2: []};
var boardCells2D = [['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','',''],['','','','','','','','']];
var showingDestinationCells = false;
var piecesOrder = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"];
var pieceValue = {pawn: 1, knight: 3, bishop: 3, rook: 5, queen: 9, king: 100}

// ************************* Objects ******************************** //
function Piece(_name, _color, _player, _moveRule, _imgText){
  this.name = _name;
  this.color = _color;
  this.player = _player;
  this.moveRule = _moveRule;
  this.imgText = _imgText;
  //this.value = pieceValue._name;
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
function ValidMove(_canMove, _canCapture, _numberOfMovesPositive, _numberOfMovesNegative){
      this.canMove = _canMove;
      this.canCapture = _canCapture;
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
    /////////// PAWN
    var pieceName = "pawn";
    var pieceColor = "black"
    var location = new Location(i,1);
    var imageText = createImageText(pieceName, pieceColor);
    var piece = new Piece(pieceName, pieceColor, player_2, returnMovingCaptureRules(pieceName), imageText);
    placePieceInCell(location, piece);

    pieceName = "pawn";
    pieceColor = "white"
    location = new Location(i,6);
    imageText = createImageText(pieceName, pieceColor);
    piece = new Piece(pieceName, pieceColor, player_2, returnMovingCaptureRules(pieceName), imageText);
    placePieceInCell(location, piece);
    }

    for(var i=0; i < piecesOrder.length; i++){
      pieceName = piecesOrder[i];
      pieceColor = "black"
      location = new Location(i,0);
      imageText = createImageText(pieceName, pieceColor);
      piece = new Piece(pieceName, pieceColor, player_2, returnMovingCaptureRules(pieceName), imageText);
      placePieceInCell(location, piece);
    }

    for(var i=0; i < piecesOrder.length; i++){
      pieceName = piecesOrder[i];
      pieceColor = "white"
      location = new Location(i,7);
      imageText = createImageText(pieceName, pieceColor);
      piece = new Piece(pieceName, pieceColor, player_2, returnMovingCaptureRules(pieceName), imageText);
      placePieceInCell(location, piece);
    }
}


// ************************* 4th ******************************** //
// Handles Pieces ONLY
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
              xValue = $(this).attr("data-xValue");
              yValue = $(this).attr("data-yValue");
                  // Is it the first time user is clicking a piece?
                  // Yes
                 if(!showingDestinationCells){
                   showingDestinationCells = true;
                   makeDestinationCellsClickable(new Location(xValue,yValue));
                 }
                  // No
                 else {
                   // User clicked on piece while destination cells were highlighted
                   showingDestinationCells = false;
                   // Remove click event listener on old destination cells
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
              xValue = $(this).attr("data-xValue");
              yValue = $(this).attr("data-yValue");
              if(!showingDestinationCells){
                showingDestinationCells = true;
                makeDestinationCellsClickable(new Location(xValue,yValue));
               } else {
                 showingDestinationCells = false;
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
function createImageText(_pieceName, _color){
  return '<img src="' + _pieceName + '_' + _color +'.png" alt="' + _color +' ' + _pieceName + '">';
}


// ************************* Helper Function ******************************** //
function returnMovingCaptureRules(_pieceName){
  switch(_pieceName){
    case "pawn":
    var horizontal = new ValidMove(false, false, 0, 0);
    var vertical = new ValidMove(true, false, 1, 0); // move forward but can't capture
    var diagonal = new ValidMove(false, true, 1, 0); // forward capture diagonal only
    var hop = new ValidMove(false, false, 0, 0);
    return new MoveRule(horizontal, vertical, diagonal, hop);
    break;
    case "rook":
    var horizontal = new ValidMove(true, true, 7, 7);
    var vertical = new ValidMove(true, true, 7, 7);
    var diagonal = new ValidMove(false, false, 0, 0);
    var hop = new ValidMove(false, false, 0, 0);
    return new MoveRule(horizontal, vertical, diagonal, hop);
    break;
    case "knight":
    var horizontal = new ValidMove(false, false, 0, 0);
    var vertical = new ValidMove(false, false, 0, 0);
    var diagonal = new ValidMove(false, false, 0, 0);
    var hop = new ValidMove(true, true, 3, 3);
    return new MoveRule(horizontal, vertical, diagonal, hop);
    break;
    case "bishop":
    var horizontal = new ValidMove(false, false, 0, 0);
    var vertical = new ValidMove(false, false, 0, 0);
    var diagonal = new ValidMove(true, true, 7, 7);
    var hop = new ValidMove(false, false, 0, 0);
    return new MoveRule(horizontal, vertical, diagonal, hop);
    break;
    case "queen":
    var horizontal = new ValidMove(true, true, 7, 7);
    var vertical = new ValidMove(true, true, 7, 7);
    var diagonal = new ValidMove(true, true, 7, 7);
    var hop = new ValidMove(false, false, 0, 0);
    return new MoveRule(horizontal, vertical, diagonal, hop);
    break;
    case "king":
    var horizontal = new ValidMove(true, true, 1, 1);
    var vertical = new ValidMove(true, true, 1, 1);
    var diagonal = new ValidMove(true, true, 1, 1);
    var hop = new ValidMove(false, false, 0, 0);
    return new MoveRule(horizontal, vertical, diagonal, hop);
    break;
    default:
    alert("Exception, not a valid piece. Return null.");
    return null;
  }
}


// ************************* Helper Function ******************************** //
function placePieceInCell(_location, _piece){
  var x = _location.x;
  var y = _location.y;
  boardCells2D[x][y].piece = _piece;
  boardCells2D[x][y].divRef.append(_piece.imgText);
}


// ************************* Helper Function ******************************** //
function makeDestinationCellsClickable(_location){
  var xValue;
  var yValue;
  var selectedPiece = getPieceBasedOnLocation(_location);
  var location = _location;

  var arrayOfAllPossibleCells = returnAllPossibleDestinationCell(selectedPiece, location);
  arrayOfAllPossibleCells.forEach(function(element) {
      // What happens when user clicks on one of the destination cells
      boardCells2D[element.x][element.y].divRef.on("click", function(){
      xValue = $(this).attr("data-xValue");
      yValue = $(this).attr("data-yValue");
      movePieceToNewLocation(location, new Location(xValue, yValue));
      removeCellHighlights();
      switchPlayersOrEndGame();
    })
    // Highlight all destination cells
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
}


// ************************* Helper Function ******************************** //
function switchPlayersOrEndGame(){
  checkForWinnerOrCheck();
  player1Turn = !player1Turn;
  removeAllClickEventListeners();
  makePiecesClickable();
}


// ************************* Helper Function ******************************** //
function movePieceToNewLocation(_originLocation, _destinationLocation){
  showingDestinationCells = false;
  // var color = (player1Turn ? "white" : "black");
  var colorOpponent = (!player1Turn ? "white" : "black");
  var piece = boardCells2D[_originLocation.x][_originLocation.y].piece;
  var location = _destinationLocation;

  removePieceAt(_originLocation);

  if(opponentOccupied(location, colorOpponent)){
    capture(location);
  }
  placePieceInCell(location, piece);
  makePiecesClickable();
}


// ************************* Helper Function ******************************** //
function opponentOccupied(_location, _opponentColor){
  if(_location.x < 8 && _location.x > -1 && _location.y < 8 && _location.y > -1){
    if(boardCells2D[_location.x][_location.y].piece != null){
      if(boardCells2D[_location.x][_location.y].piece.color === _opponentColor){
        return true;
      }
      return false;
    }
    return false;
  } else {
    return false;
  }

}


// ************************* Helper Function ******************************** //
function capture(_location){
  capturePieceAt(_location);
  removePieceAt(_location);
}


// ************************* Helper Function ******************************** //
function capturePieceAt(_location){
  var piece = boardCells2D[_location.x][_location.y].piece;
  if(player1Turn){
    capturedPieces.player_1.push(piece);
    $(".player_1_capture").append(piece.imgText);
  }
  else {
    capturedPieces.player_2.push(piece);
    $(".player_2_capture").append(piece.imgText);
  }
}


// ************************* Helper Function ******************************** //
function removePieceAt(_location){
  boardCells2D[_location.x][_location.y].piece = null;
  boardCells2D[_location.x][_location.y].divRef.children("img:first").remove();
}



// ************************* Helper Function ******************************** //
function opponentColor(){
  return (player1Turn ? "black" : "white");
}

// ************************* Helper Function ******************************** //
function returnAllPossibleDestinationCell(_piece, _location){
  var originX = parseInt(_location.x);
  var originY = parseInt(_location.y);
  var moveRule = _piece.moveRule;
  var returnArray = [];
  var playingDown = player1Turn;
  var destinationX;
  var destinationY;
  var destLocation;
  var capturable;
  var validMove;

  // horizontal // horizontal //  horizontal // horizontal //
  validMove = moveRule.horizontal;
  if (validMove.canMove || validMove.canCapture){

    for(var i = 1; i < validMove.numberOfMovesPositive+1; i++){
      destinationX = originX + i;
      destinationY = originY;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
        if(capturable){
          break;
        }
      }
      else {
        break;
      }
    }

    for(var i = 1; i < validMove.numberOfMovesNegative+1; i++){
      destinationX = originX - i;
      destinationY = originY;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
        if(capturable){
          break;
        }
      }
      else {
        break;
      }
    }

  }

  // vertical // vertical // vertical // vertical // vertical
  validMove = moveRule.vertical;
  if (validMove.canMove || validMove.canCapture){

    for(var i = 1; i < validMove.numberOfMovesPositive+1; i++){
      if(playingDown){
        destinationX = originX;
        destinationY = originY - i;
      } else {
        destinationX = originX;
        destinationY = originY + i;
      }
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
        if(capturable){
          break;
        }
      }
      else {
        break;
      }
    }

    for(var i = 1; i < validMove.numberOfMovesNegative+1; i++){
      if(playingDown){
        destinationX = originX;
        destinationY = originY + i;
      } else {
        destinationX = originX;
        destinationY = originY - i;
      }
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
        if(capturable){
          break;
        }
      }
      else {
        break;
      }
    }
  }

  // diagonal // diagonal // diagonal // diagonal // diagonal
  validMove = moveRule.diagonal;
  if (validMove.canMove || validMove.canCapture){

        // White
        if(playingDown){
          // Right Down
          for(var i = 1; i < validMove.numberOfMovesPositive+1; i++){
            destinationX = originX - i;
            destinationY = originY - i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }


          // Left Down
          for(var i = 1; i < validMove.numberOfMovesPositive+1; i++){
            destinationX = originX + i;
            destinationY = originY - i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }

          // Right Up
          for(var i = 1; i < validMove.numberOfMovesNegative+1; i++){
            destinationX = originX - i;
            destinationY = originY + i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }

          // Right Up
          for(var i = 1; i < validMove.numberOfMovesNegative+1; i++){
            destinationX = originX + i;
            destinationY = originY + i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }

        } //////////////// END of if(playingDown)

        else {
          // Right Down
          for(var i = 1; i < validMove.numberOfMovesPositive+1; i++){
            destinationX = originX + i;
            destinationY = originY + i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }


          // Left Down
          for(var i = 1; i < validMove.numberOfMovesPositive+1; i++){
            destinationX = originX - i;
            destinationY = originY + i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }

          for(var i = 1; i < validMove.numberOfMovesNegative+1; i++){
            destinationX = originX + i;
            destinationY = originY - i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }

          for(var i = 1; i < validMove.numberOfMovesNegative+1; i++){
            destinationX = originX - i;
            destinationY = originY - i;
            destLocation = new Location(destinationX, destinationY);
            capturable = opponentOccupied(destLocation, opponentColor());
            if (okToMoveTo(destLocation, validMove)){
              returnArray.push(destLocation);
              if(capturable){
                break;
              }
            }
            else {
              break;
            }
          }
        } ////////////////////// END of else (
    }

  // hop  // hop // hop // hop // hop // hop
  validMove = moveRule.hop;
  if (validMove.canMove || validMove.canCapture){
      destinationX = originX + 2;
      destinationY = originY - 1;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX + 2;
      destinationY = originY + 1;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX - 2;
      destinationY = originY + 1;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX - 2;
      destinationY = originY - 1;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX + 1;
      destinationY = originY - 2;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX + 1;
      destinationY = originY + 2;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX - 1;
      destinationY = originY + 2;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

      destinationX = originX - 1;
      destinationY = originY - 2;
      destLocation = new Location(destinationX, destinationY);
      capturable = opponentOccupied(destLocation, opponentColor());
      if (okToMoveTo(destLocation, validMove)){
        returnArray.push(destLocation);
      }

  }



  return returnArray;
}


// ************************* Helper Function ******************************** //
// Checks if it is an acceptable cell to move into
function okToMoveTo(_location, _validMove){
  if(_location.x > 7 || _location.y > 7 || _location.x < 0 || _location.y < 0){
    return false;
  }
  if (ownPlayeroccupied(_location)){
    return false;
  }
  if(opponentOccupied(_location, opponentColor())){
    return _validMove.canCapture;
  }
  return _validMove.canMove;
}


// ************************* Helper Function ******************************** //
function ownPlayeroccupied(_location){
  var color =  (player1Turn ? "white" : "black");
  // REPLACE ALL THESE CALLS WITH getPieceBasedOnLocation()
  if(boardCells2D[_location.x][_location.y].piece != null) {
    if(boardCells2D[_location.x][_location.y].piece.color === color){
      return true;
    }
    return false;
  }
  return false;
}

// ************************* Helper Function ******************************** //
function removeAllClickEventListeners(){
  $(".cell").unbind();
}


// ************************* Helper Function ******************************** //
function getPieceBasedOnLocation(_location){
  var x = _location.x;
  var y = _location.y;
  return boardCells2D[x][y].piece;
}
