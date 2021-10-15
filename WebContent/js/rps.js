/**
 * JavaScript file with logic and UI functions for Rock Paper Scissors project
 */
var RPS = {};
RPS.url="http://localhost:8084/game";
RPS.chooseOpponentId = "chooseOpponent";
RPS.createButtonId = "createGameButton";
RPS.playRoundButtonId="playRoundButton";
RPS.restartBurronId = "restartButton";
RPS.showStatisticsButtonId = "showStatistics";
RPS.selectHandId="selectHand";
RPS.playgroundId = "playground";
RPS.opponentDetails="opponentDetails";
RPS.opponentHandId="opponentHand";
RPS.roundResultId="roundResult";
RPS.showSetUrlDialogButtonId="setUrl";
RPS.acceptUrlButtonId="acceptUrl";
RPS.gameId;
RPS.playerTypeMap = new Array();
RPS.playerTypeMap.rockPlayer = "ROCK";
RPS.playerTypeMap.randomPlayer = "RANDOM";


/**
 * Sets the Back end service URL
 */
RPS.setServiceUrl = function(serviceUrl) {
	RPS.url=serviceUrl;
}
/**
 * Initializes the divs for image selection
 */
RPS.initSelectImage = function(parentId, buttonId){
	$("#"+parentId +" .selectImage").click(function() {
		//$(this).siblings().removeClass("selected");
		$("#"+parentId +" .selectImage").removeClass("selected");
		$(this).addClass("selected");
		$("#"+buttonId).removeClass("button-disabled");
	})
}

/**
 * Initializes the Create new game button
 */
RPS.initCreateGameButton = function(elementId) {
	$("#"+elementId).click(function(event) { 
		event.preventDefault();
		RPS.createGame()});
}

/**
 * Creates a new game
 */
RPS.createGame = function() {
	var playerTypeElementList = $("#"+RPS.chooseOpponentId + " .selected");
	if (playerTypeElementList.length > 0) {
		var playerTypeValue = playerTypeElementList[0].id;
		$.post(RPS.url+"/createGame?playerType="+RPS.playerTypeMap[playerTypeValue], function( data ) { //RPS.playerTypeMap[playerTypeValue]
			  RPS.gameId = data.gameId;
			  $("#"+RPS.chooseOpponentId).hide();
			  //get chosen opponent
			  $("#"+RPS.opponentDetails).html($("#"+playerTypeValue).html());
			  $("#"+RPS.playgroundId).show();
			});
	}
	
}

/**
 * Initializes the Play Round button
 */
RPS.initPlayRoundButton = function(elementId) {
	$("#"+elementId).click(function(event) { 
		event.preventDefault();
		RPS.playRound()});
}

/**
 * Play one round
 */
RPS.playRound = function() {
	var selectedHandElementList = $("#"+RPS.selectHandId + " .selected");
	if (selectedHandElementList.length > 0) {
		var selectedHand = selectedHandElementList[0].id;
		$.post(RPS.url+"/"+RPS.gameId+"/?hand="+selectedHand, function( data ) { 
			  
			  var handClass = RPS.getHandClass(data.p2Hand);
			  $("#"+RPS.opponentHandId).attr("class",handClass);
			  //set result
			  var roundResult = RPS.getResultClass(data.result);
			  $("#"+RPS.roundResultId).attr("class",roundResult);
			  $("#"+RPS.roundResultId).text(roundResult.toUpperCase());
			  
			  RPS.printGameRounds();
			 
			});
	}
	
}

/**
 * Returns the class for the given hand
 */
RPS.getHandClass = function(hand) {
	var result = "prsIcon ";
	if (hand == 'ROCK') {
		result += "rockIcon";
	} else if (hand == 'PAPER') {
		result += "paperIcon";
	} else {
		result += "scissorsIcon";
	}
	return result;
}

/**
 * Returns the result class
 */
RPS.getResultClass = function(result) {
	var resultClass = "draw";
	if (result == 'P1WINS') {
		resultClass = "win";
	} else if (result == 'P2WINS') {
		resultClass = "loss";
	} 
	return resultClass;
}

/**
 * Prints game rounds table
 */
RPS.printGameRounds = function() {
	$.get(RPS.url+"/"+RPS.gameId, function( data ) { 
		  var tableBody = $("#resultTable tbody");
		  $(tableBody).children().remove();
		  
		  for (i = 0; i<data.length;i++) {
			  $(tableBody).append("<tr><td>"+data[i].p1Hand+"</td><td>"+data[i].p2Hand+"</td><td>"+data[i].result+"</td></tr>");
		  }
		  
		  $("#resultTable").show();
		 
		});
}

/**
 * Initializes Restart Game button
 */
RPS.initRestartButton = function(elementId) {
	$("#"+elementId).click(function(event) { 
		event.preventDefault();
		RPS.restartGame()});
}

/**
 * Restarts the Game
 */
RPS.restartGame = function() {
	if (RPS.gameId != null) {
		$.post(RPS.url+"/"+RPS.gameId+"/restart", function( data ) { 
			 $("#resultTable").hide();  
			 $("#"+RPS.selectHandId +" .selectImage").removeClass("selected");
			$("#"+RPS.playRoundButtonId).addClass("button-disabled");
			$("#"+RPS.roundResultId).attr("class","");
			$("#"+RPS.roundResultId).text("");
			$("#"+RPS.opponentHandId).attr("class","prsIcon");
			});
	}
	
}

/**
 * Init statistics button
 */
RPS.initStatisticsButton = function(elementId) {
	
	$("#"+elementId).click(function(event) { 
		event.preventDefault();
		RPS.showStatistics()});
}

/**
 * Init Set URL Dialog Button
 */
RPS.initSetUrlDialogButton = function(elementId) {
	$("#"+elementId).click(function(event) { 
		event.preventDefault();
		$("#setUrlDialog").dialog({
			  modal: true
		});
		});
}

RPS.initAcceptUrlButton = function(elementId) {
	$("#"+elementId).click(function(event) { 
		event.preventDefault();
		RPS.setServiceUrl($("#serviceUrl").val());
		$("#setUrlDialog").dialog("close");
	});
}

/**
 * Shows statistics pop up window
 */
RPS.showStatistics = function() {
	$.get(RPS.url+"/", function( data ) { 
		$("#statisticsRounds").text(data.rounds);
		$("#statisticPlayer1Wins").text(data.p1Wins);
		$("#statisticPlayer2Wins").text(data.p2Wins);
		$("#statisticDraws").text(data.draws);
		$("#dialog").dialog({
			  modal: true
		});
		  		 
		});
}


/**
 * JQuery initialization
 * @returns
 */
$(document).ready(function() {
//   var currentUrl = $(location).attr('href');
//   if (currentUrl.charAt(currentUrl.length -1) == "/") {
//	currentUrl = currentUrl.substring(0, currentUrl.length -1)	  
//   }
//   RPS.url = currentUrl + "/services/game";
   RPS.initSelectImage(RPS.chooseOpponentId, RPS.createButtonId);
   RPS.initCreateGameButton(RPS.createButtonId);
   RPS.initPlayRoundButton(RPS.playRoundButtonId);
   RPS.initSelectImage(RPS.selectHandId, RPS.playRoundButtonId);
   RPS.initRestartButton(RPS.restartBurronId);
   RPS.initStatisticsButton(RPS.showStatisticsButtonId);
   RPS.initSetUrlDialogButton(RPS.showSetUrlDialogButtonId);
   RPS.initAcceptUrlButton(RPS.acceptUrlButtonId);
});