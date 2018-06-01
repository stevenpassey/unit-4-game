var characterStats = {		yoda:{		title: "Yoda", 
						image: "./assets/images/char_yoda.png", 
						health: 120, 
						attack: 8,
						multi: 8},

				storm:{		title: "Stormtrooper", 
						image: "./assets/images/char_storm.png", 
						health: 100, 
						attack: 5,
						multi: 15},

				vader:{		title: "Darth Vader", 
						image: "./assets/images/char_vader.png", 
						health: 150, 
						attack: 20,
						multi: 2},
				
				ren:{		title: "Kylo Ren",
						image: "./assets/images/char_ren.png", 
						health: 180, 
						attack: 25,
						multi: 1}};
				

function CharacterCard(stats, location, char) 
{
	this.title = stats.title;
	this.image = stats.image;
	this.attack = stats.attack;
	this.multi = stats.multi;
	this.health = stats.health;
	this.char = char;

	this.id = this.title.replace(/\s+/g, '').toLowerCase(); //add a unique id based on the character's title

	this.generate = function () { //creates a new div element to represent our character card in the div specified by the location parameter;
		
		var newCard = $("<div>");
		newCard.attr('id', this.id);
		newCard.addClass("card")

		newCard.attr("onclick", "chooseACharacter('" + newCard.attr('id') + "')");
		newCard.css({cursor: "pointer"});
		
		var newCardLabelName = $("<span>");
		newCardLabelName.addClass("card-label-name");
		newCardLabelName.text(this.title);

		var newCardImage = $("<img>");
		newCardImage.addClass("card-image");
		newCardImage.attr("src", this.image);
		newCardImage.attr("draggable", false);

		var newCardLabelHealth = $("<span>");
		newCardLabelHealth.addClass("card-label-name");
		newCardLabelHealth.text(stats.health);
		
		$('#' + location).append(newCard);		
		$('#' + newCard.attr("id")).append(newCardLabelName);
		$('#' + newCard.attr("id")).append(newCardImage);
		$('#' + newCard.attr("id")).append(newCardLabelHealth);
	}
}

var whichChar = [];

var playerCardNumber = -1;
var enemyCardNumber = -1;

var playerCardDiv;
var enemyCardDiv;

var playerCard;
var enemyCard;

var playerMultiplier = 0;

var lastEnemyDamage;
var lastPlayerDamage;

var enemiesDefeated = 0;

$( document ).ready(function() {

var charCount = 0;

	for (var startingCharacters in characterStats) 
	{
		var newStartChar = new CharacterCard(characterStats[startingCharacters], "characterContainer", startingCharacters);
		whichChar.push(newStartChar);
		whichChar[charCount].generate();
		$("#" + whichChar[charCount].id).attr("data", charCount);
		charCount++
	}

	setTimeout(function () { $('#' + whichChar[0].id).css("transform", "translateY(0px)"); } , 10);
	setTimeout(function () { $('#' + whichChar[1].id).css("transform", "translateY(0px)"); } , 210);
	setTimeout(function () { $('#' + whichChar[2].id).css("transform", "translateY(0px)"); } , 310);
	setTimeout(function () { $('#' + whichChar[3].id).css("transform", "translateY(0px)"); } , 410);

	swapShadow('characterContainer', "off");
});

function swapShadow(container, state)
{
	if(state === "off")
	{ 
		//the following code removes the pseudo element that creates the box shadow underneath the content of the div
		//it then adds the same box shadow to the container so that you can click the cards
		setTimeout(function() { $("#" + container).addClass('remove-after');
						$("#" + container).addClass('normal-shadow'); }, 810);
	}
	else if(state === "on")
	{
		$("#" + container).removeClass("remove-after");
		$("#" + container).removeClass("normal-shadow");
	}
}

function swapText(id, newText)
{
	$("#" + id).css({transform: "translateX(-1000px)"});
	setTimeout(function () { $("#" + id).css({transition: "none" }); }, 500);
	setTimeout(function () { $("#" + id).css({transform: "translateX(1000px)" }); }, 530);
	setTimeout(function () { $("#" + id).html(newText) }, 530);
	setTimeout(function () { $("#" + id).css({transition: "transform 500ms" }); }, 560);
	setTimeout(function () { $("#" + id).css({transform: "translateX(0px)" }); }, 561);
}

function flipText(id, newText)
{
	$("#" + id).css({transform: "translateY(-50px)"});
	setTimeout(function () { $("#" + id).css({transition: "none" }); }, 100);
	setTimeout(function () { $("#" + id).css({transform: "translateY(50px)" }); }, 130);
	setTimeout(function () { $("#" + id).html(newText) }, 130);
	setTimeout(function () { $("#" + id).css({transition: "transform ease-in-out 100ms" }); }, 160);
	setTimeout(function () { $("#" + id).css({transform: "translateX(0px)" }); }, 161);
}

function updateUI(owner)
{
	if(owner === "Enemy")
	{
		var firstAttackId = 'eText';
		var firstDamageString = "Enemy (" + enemyCard.title + ")" + " took <span class='swap-text-inline' id='eTextAmount'>" + lastEnemyDamage + "</span> damage.";

		var attackId = $("#eText").text().indexOf("took") === -1 ? firstAttackId : 'eTextAmount';
	
		var damageString = $("#eText").text().indexOf("took") === -1 ? firstDamageString : lastEnemyDamage;
 
		flipText(attackId, damageString);


		setTimeout(function () { $("#" + enemyCard.id + " .card-label-name:nth-of-type(2)").html(enemyCard.health); }, 300);		
	}
	else if(owner === "Player")
	{
		var firstAttackId = 'pText';
		var firstDamageString = "Player (" + playerCard.title + ")" + " took <span class='swap-text-inline' id='pTextAmount'>" + lastPlayerDamage + "</span> damage.";

		var attackId = $("#pText").text().indexOf("took") === -1 ? firstAttackId : 'pTextAmount';
	
		var damageString = $("#pText").text().indexOf("took") === -1 ? firstDamageString : lastPlayerDamage;
 
		flipText(attackId, damageString);


		setTimeout(function () { $("#" + playerCard.id + " .card-label-name:nth-of-type(2)").html(playerCard.health); }, 300);
	}
}

function chooseACharacter(char)
{
	if($('#playerContainer').children().length < 1)
	{
		$("#" + char).appendTo($("#playerContainer"));

		playerCardNumber = $("#" + char).attr("data");
		playerCardDiv = $("#" + char);
		playerCard = whichChar[playerCardNumber];

		setTimeout(function () { swapText("talkText", "Choose an Enemy:") }, 10);
		setTimeout(function () { swapText("pText", "Player (" + playerCard.title + ")") }, 10);

		for(var checkOther = 0; checkOther <= $('#characterContainer').children().length; checkOther++)
		{ 
			$("#" + whichChar[checkOther].id).attr("onclick", "chooseAnEnemy('" + whichChar[checkOther].id + "')");
		}

		playerCard.attack = playerCardNumber === "3" ? 10 : playerCard.attack;
	}
}

function chooseAnEnemy(char)
{
	if($('#enemyContainer').children().length < 1)
	{
		$("#" + char).appendTo($("#enemyContainer"));

		enemyCardNumber = $("#" + char).attr("data");
		enemyCardDiv = $("#" + char);
		enemyCard = whichChar[enemyCardNumber];
		
		setTimeout(function () { swapText("eText", "Enemy (" + enemyCard.title + ")");
						 $("#talkText").css("height", $("#pText").outerHeight() + "px");
						 swapText("talkText", "<span class='attack-button' onclick='playerAttack()'>Attack</span>"); }, 10);

		setTimeout(function () { $(["#talkText", "#pText", "#eText"]).css({transition: "transform ease-in-out 100ms"}); }, 210);
		
	}
}

function playerAttack()
{
	//disable attack button
	$(".attack-button").attr("onclick", "");
	$(".attack-button").addClass('attack-button-disabled')
	$(".attack-button").html("&nbsp;");

	//get the current health of the currently selected enemy
	var getEnemyHealth = enemyCard.health;

	//Calculate the amount of damage: the player's attack multiplied by the current player's multiplier
	lastEnemyDamage = playerCard.attack + (playerMultiplier * playerCard.multi);
	
	//subtract the amount of damage
	var newEnemyHealth = getEnemyHealth - lastEnemyDamage;

	//increase the players multiplier by a factor of 1
	playerMultiplier++;

	if(newEnemyHealth > 0)
	{
		//set the currently selected enemy's health to the cacluated attack amount
		enemyCard.health = newEnemyHealth;

		//updateUI
		updateUI("Enemy");

		//counterAttack
		enemyAttack();
	}
	else
	{
		//Calculate the amount of damage: the player's damage minus the remaining enemy health;
		lastEnemyDamage = getEnemyHealth;
	
		//set the currently selected enemy's health to 0
		enemyCard.health = 0;

		//updateUI
		updateUI("Enemy");

		//remove attack button
		$(".attack-button").css({transform: "scale(0,0)"});
		
		setTimeout(enemyDeath, 1500);	
	}
}

function enemyAttack()
{
	//get the current health of the currently selected player
	var getPlayerHealth = playerCard.health;

	//Calculate the amount of damage: it is the enemy's attack
	lastPlayerDamage = enemyCard.attack;
	
	//subtract the amount of damage
	var newPlayerHealth = getPlayerHealth - lastPlayerDamage;

	
	if(newPlayerHealth > 0)
	{
		//set the currently selected player's health to the cacluated attack amount
		playerCard.health = newPlayerHealth;

		//updateUI
		updateUI("Player");
	
		//enable attack button
		setTimeout(function () { $(".attack-button").attr("onclick", "playerAttack()");
					 	 $(".attack-button").removeClass('attack-button-disabled')
					 	 $(".attack-button").html("Attack"); }, 1000);
	}
	else
	{
		//Calculate the amount of damage: the player's remaining health;
		lastPlayerDamage = getPlayerHealth;

		//set the currently selected player's health to 0
		playerCard.health = 0;

		//updateUI
		updateUI("Player");

		//remove attack button
		$(".attack-button").css({transform: "scale(0,0)"});

		setTimeout(playerDeath, 1500);	
	}
}

function enemyDeath()
{
	//Show messages
	swapText('eText', "Enemy (" + enemyCard.title + ") fainted.");

	//Remove the current enemy
	setTimeout(function () { enemyCardDiv.css({transform: "translateY(150px)"}); } , 1000);

	//increment enemies defeated
	enemiesDefeated++;

	if(enemiesDefeated !== 3)
	{
		swapText('talkText', "Choose an Enemy:");
		setTimeout(function () { swapText('pText', "Player (" + playerCard.title + ")") } , 1000);

		setTimeout(function () { $("#enemyContainer").html("&nbsp;"); } , 1400);
	}
	else
	{
		swapText('talkText', "<span class='restart-button' onclick='window.location.reload()'>Play Again</span>");
		swapText("pText", "Player (" + playerCard.title + ")" + " wins!")
		swapText('eText', "&nbsp;");
	}
}

function playerDeath()
{
	//Show messages
	swapText('pText', "Player (" + playerCard.title + ") fainted.");

	//Remove the current player
	setTimeout(function () { playerCardDiv.css({transform: "translateY(150px)"}); }, 1000);

	swapText('talkText', "<span class='restart-button' onclick='window.location.reload()'>Play Again</span> ");
	swapText("eText", "Enemy (" + enemyCard.title + ")" + " wins!")
}


