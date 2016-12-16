var makeGround = function(rows, cols) {
  var table = $("<table border = 1>");
  var tbody = $("<tbody>");

  for(var row = 0; row < rows; row++) {
    var tr = $("<tr>");
    for(var col = 0; col < cols; col++) {
      var td = $("<td>");
      td.attr("id","td" + "r" + row + "c" + col);
      tr.append(td);
    }
    tbody.append(tr);
  }
  table.append(tbody);
  return table;
}

var init = function(rows, cols, wormLength, difficulty) {
  if(wormLength >=cols) {
    alert("Wrong game information!!");
    return;
  }
  var gameInfo = {
    rows : rows,
    cols : cols,
    direction : 1,
    wormLength : wormLength,
    difficulty : difficulty,
    moveDirectionArray : [{x : -1, y : 0},
                          {x : 0, y: -1},
                          {x : 1, y : 0},
                          {x : 0, y : 1},],
    worm : {
      bodys : ["#tdr0c0"],
      curX : 0,
      curY : 0,
      curDirection : 2,
      toDirection : 2
    }
  };

  $(".ground").append(makeGround(gameInfo.rows, gameInfo.cols));
  $("#tdr0c0").addClass("worm_body");
  for(var index = 1; index < gameInfo.wormLength; index++) {
    pushBody(gameInfo);
  }
  return gameInfo;
}

var pushBody = function(gameInfo) {
  var lastElem = $(gameInfo.worm.bodys[gameInfo.worm.bodys.length - 1]);
  lastElem.removeClass("worm_head");
  lastElem.addClass("worm_body");
  gameInfo.worm.curX += gameInfo.moveDirectionArray[gameInfo.worm.toDirection].x;
  gameInfo.worm.curY += gameInfo.moveDirectionArray[gameInfo.worm.toDirection].y;

  var id = "#td" + "r" + gameInfo.worm.curY + "c" + gameInfo.worm.curX;

  $(id).addClass("worm_head");
  gameInfo.worm.bodys.push(id);
}

var popBody = function(gameInfo) {
  $(gameInfo.worm.bodys[0]).removeClass("worm_body");
  $(gameInfo.worm.bodys[0]).removeClass("worm_head");
  gameInfo.worm.bodys.splice(0, 1);
}

var makeRandomPosition = function(rows,cols) {
  return {row : Math.floor(Math.random() * rows),
          col : Math.floor(Math.random() * cols)};
}

var moveworm = function(gameInfo) {
  pushBody(gameInfo);
  var id = "#td" + "r" + gameInfo.worm.curY + "c" + gameInfo.worm.curX;
  if(gameInfo.worm.curX >= gameInfo.cols || gameInfo.worm.curY >= gameInfo.rows
      || gameInfo.worm.curX < 0 || gameInfo.worm.curY < 0
      || $(id).hasClass("worm_body")) {
    alert("Game Over!!");
    $("#stop").trigger("click");
    $("#reset").trigger("click");
    $("#start").removeClass("disabled");
    return;
  }

  var head = $(gameInfo.worm.bodys[gameInfo.worm.bodys.length - 1]);
  if(head.hasClass("pizza")) {
    head.removeClass("pizza");
    makePizza(gameInfo);
  } else {
    popBody(gameInfo);
  }
  gameInfo.worm.curDirection = gameInfo.worm.toDirection;
}

var changeDirection = function(gameInfo, toDirection) {
  if(Math.abs(gameInfo.worm.curDirection - toDirection) != 2) {
    gameInfo.worm.toDirection = toDirection;
  }
}

var makePizza = function(gameInfo) {
  while(true) {
    var position = makeRandomPosition(gameInfo.rows, gameInfo.cols);
    var positionId = $("#tdr" + position.row + "c" + position.col)

    if(!positionId.hasClass("worm_body") && !positionId.hasClass("worm_head")) {
      $(positionId).addClass("pizza");
      break;
    }
  }
}

var gameStart = function(gameInfo) {
  var watch = setInterval(function() {
    moveworm(gameInfo);
  }, gameInfo.difficulty);
  return watch;
}

$(document).ready(function(){
  var difficultyInfo = {
    "hard" : 100,
    "mid" : 500,
    "easy" : 1000
  }
  var rows = 10;
  var cols = 10;
  var wormLength = 3;
  var difficulty = "mid";
  var gameInfo = init(rows, cols, wormLength, difficultyInfo[difficulty]);
  var watch = {};
  $("#start").on("click", function(e) {
    makePizza(gameInfo);
    watch = gameStart(gameInfo);
    $(e.target).attr("disabled", true);
    $("#stop").removeAttr("disabled");
    $("#reset").attr("disabled",true);
  });
  $("#stop").on("click", function(e) {
    clearInterval(watch);
    $(e.target).attr("disabled", false);
    $("#start").removeAttr("disabled");
    $("#reset").removeAttr("disabled");
  });
  $("#reset").on("click", function(e) {
    $(".ground").empty();
    gameInfo = init(rows, cols, wormLength, difficultyInfo[difficulty]);
    $(e.target).removeAttr("disabled");
    $("#start").removeAttr("disabled");
    $("#reset").attr("disabled",true);
  });
  $("body").on("keydown", function(e) {
    if(e.keyCode >= 37 && e.keyCode <= 40)
    changeDirection(gameInfo, e.keyCode - 37);
  });
});
