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
				

function CharacterCard(stats, owner, location, char) 
{
	//apply the characterStats to this new card
	this.title = stats.title;
	this.image = stats.image;
	this.attack = stats.attack;
	this.multi = stats.multi;
	this.char = char;

	//our health object will fire a different onHealthChange event depending on the owner of the card
	this.healthObject = {
		realHealth: stats.health,
		healthWatch: function(newValue) {},
		set health(newValue) {
			this.realHealth = newValue;
			this.healthWatch(newValue);
  		},
		get health() {
			return this.realHealth;
		},
  		onHealthChange: function(watch) {
    			this.healthWatch = watch;
  		}
	};
	
	if(owner === "Player")
	{
		this.healthObject.onHealthChange(function(newValue) {

			var firstAttackId = 'pText';
			var firstDamageString = "Player (" + chosenContainer[playerChosenCard].title + ")" + " took <span class='swap-text-inline' id='pTextAmount'>" + lastPlayerDamage + "</span> damage.";

			var attackId = document.getElementById('pText').textContent.indexOf("took") === -1 ? firstAttackId : 'pTextAmount';
	
			var damageString = document.getElementById('pText').textContent.indexOf("took") === -1 ? firstDamageString : lastPlayerDamage;
 
			flipText(attackId, damageString);

			setTimeout("chosenCard.children[2].textContent = chosenContainer[playerChosenCard].healthObject.health;", 300);

		});
	}
	else if(owner === "Enemy")
	{
		this.healthObject.onHealthChange(function(newValue) {

			var firstAttackId = 'eText';
			var firstDamageString = "Enemy (" + attackerContainer[enemyChosenCard].title + ")" + " took <span class='swap-text-inline' id='eTextAmount'>" + lastEnemyDamage + "</span> damage.";

			var attackId = document.getElementById('eText').textContent.indexOf("took") === -1 ? firstAttackId : 'eTextAmount';
	
			var damageString = document.getElementById('eText').textContent.indexOf("took") === -1 ? firstDamageString : lastEnemyDamage;
 
			flipText(attackId, damageString);

			setTimeout("attackerCard.children[2].textContent = attackerContainer[enemyChosenCard].healthObject.health;", 300);

		});
	}

	this.id = this.title.replace(/\s+/g, '').toLowerCase() + owner; //add a unique id based on the character's title and owner

	this.generate = function () { //creates a new div element to represent our character card in the div specified by the location parameter;
		
		var newCard = document.createElement("div");
		newCard.id = this.id;
		newCard.classList.add('card');

		if(owner === "StartCard") //if this card doesn't have an owner then we can add the chooseACharacter function to it
		{
			newCard.onclick = function() { chooseACharacter(newCard.id);};
			newCard.style="cursor: pointer;";
		}

		var newCardLabelName = document.createElement("span");
		newCardLabelName.classList.add('card-label-name');
		newCardLabelName.textContent = this.title;

		var newCardImage = document.createElement("img");
		newCardImage.classList.add('card-image');
		newCardImage.src = this.image;
		newCardImage.draggable = false;

		var newCardLabelHealth = document.createElement("span");
		newCardLabelHealth.classList.add('card-label-name');
		newCardLabelHealth.textContent = stats.health;
		
		document.getElementById(location).appendChild(newCard);		
		document.getElementById(newCard.id).appendChild(newCardLabelName);
		document.getElementById(newCard.id).appendChild(newCardImage);
		document.getElementById(newCard.id).appendChild(newCardLabelHealth);
	}
}

var startContainer = [];     //the array that holds all the characters currently in the characterContainer div element
var chosenContainer = [];    //the array that holds all the characters currently in the playerContainer div element
var attackerContainer = [];  //the array that holds all the characters currently in the enemyContainer div element

var playerChosenCard = -1;
var enemyChosenCard = -1;

var chosenCard;
var attackerCard;

var playerMultiplier = 0;

var lastEnemyDamage;
var lastPlayerDamage;

var enemiesDefeated = 0;

window.onload = function () {

	var charCount = 0;

	for (var startingCharacters in characterStats) 
	{
		var newStartChar = new CharacterCard(characterStats[startingCharacters], "StartCard", "characterContainer", startingCharacters);
  		startContainer.push(newStartChar);
		startContainer[charCount].generate();
		document.getElementById(startContainer[charCount].id).setAttribute("data", charCount);
		charCount++;
	}

	slideInChar(startContainer[0].id, 10);
	slideInChar(startContainer[1].id, 210);
	slideInChar(startContainer[2].id, 310);
	slideInChar(startContainer[3].id, 410);

	swapShadow('characterContainer', "off");
}

function swapShadow(container, state)
{
	if(state === "off")
	{ 
		//the following code removes the pseudo element that creates the box shadow underneath the content of the div
		//it then adds the same box shadow to the container so that you can click the cards
		setTimeout(function() { document.getElementById(container).classList.add('remove-after');
					document.getElementById(container).classList.add('normal-shadow'); }, 810);
	}
	else if(state === "on")
	{
		document.getElementById(container).classList.remove('remove-after');
		document.getElementById(container).classList.remove('normal-shadow');
	}
}

function slideInChar(id, timing)
{
	setTimeout(function () { document.getElementById(id).style.transform = "translateY(0px)" } , timing);
}

function slideOutChar(id, timing)
{
	setTimeout(function () { document.getElementById(id).style.transform += "translateY(150px)" } , timing);
}

function FLIPchars(id)
{
	/* This function animates the layout changes that occur inside our containers
	   It calculates their ending positions by removing elements from the DOM and then adding them back
	   It then uses a transform with a value of the pixels between the before and after DOM element removal
	   This means our animations take place in the composite layer instead of the layout */

	/* This particular implementation is specific to our layout
	   It will center the first two elements that have a translateY of 0px regardless of the amount of elements.*/

	var cardsToMove = { firstX: false, secondX: false, newFirstX: false, newSecondX: false };
	var cardsToNotHide = [];
	var cardsToRestore = [];

	for (var currentCard = 0; currentCard < document.getElementById(id).childElementCount; currentCard++)
	{
		if(document.getElementById(id).children[currentCard].style.transform === "translateY(0px)" || document.getElementById(id).children[currentCard].style.transform === "scale(1, 1)")
		{
			cardsToNotHide.push(document.getElementById(id).children[currentCard]);			

			if(cardsToMove.firstX === false)
			{
				cardsToMove.firstX = document.getElementById(id).children[currentCard].offsetLeft;
			}
			else
			{
				cardsToMove.secondX = document.getElementById(id).children[currentCard].offsetLeft;
			}
		}
		else
		{
			cardsToRestore.push(document.getElementById(id).children[currentCard]);
		}
	}

	for (var currentCard2 in cardsToRestore)
	{
		cardsToRestore[currentCard2].style.display = "none";
	}

	for (var currentCard3 = 0; currentCard3 < document.getElementById(id).childElementCount; currentCard3++)
	{
		if(document.getElementById(id).children[currentCard3].style.transform === "translateY(0px)" || document.getElementById(id).children[currentCard3].style.transform === "scale(1, 1)")
		{
			if(cardsToMove.newFirstX === false)
			{
				cardsToMove.newFirstX = document.getElementById(id).children[currentCard3].offsetLeft;
				var cardDelta1 = cardsToMove.firstX - cardsToMove.newFirstX;
				setTimeout(function () { cardsToNotHide[0].style.transform = "translateX(" + -cardDelta1 + "px)" } , 10);
			}
			else
			{
				cardsToMove.newSecondX = document.getElementById(id).children[currentCard3].offsetLeft;
				var cardDelta2 = cardsToMove.secondX - cardsToMove.newSecondX ;
				setTimeout(function () { cardsToNotHide[1].style.transform = "translateX(" + -cardDelta2 + "px)" } , 10);
			}
		}
	}

	for (var currentCard4 in cardsToRestore)
	{
		cardsToRestore[currentCard4].style.display = "block";
	}
}

function swapText(id, newText)
{
	document.getElementById(id).style.transform = "translateX(-1000px)";
	setTimeout(function () { document.getElementById(id).style.transition = "none" }, 500);
	setTimeout(function () { document.getElementById(id).style.transform = "translateX(1000px)" }, 530);
	setTimeout(function () { document.getElementById(id).innerHTML = newText } , 530);
	setTimeout(function () { document.getElementById(id).style.transition = "transform 500ms" }, 560);
	setTimeout(function () { document.getElementById(id).style.transform = "translateX(0px)" }, 561);
}

function flipText(id, newText)
{
	document.getElementById(id).style.transform = "translateY(-50px)";
	setTimeout(function () { document.getElementById(id).style.transition = "none" }, 100);
	setTimeout(function () { document.getElementById(id).style.transform = "translateY(50px)" }, 130);
	setTimeout(function () { document.getElementById(id).innerHTML = newText } , 130);
	setTimeout(function () { document.getElementById(id).style.transition = "transform ease-in-out 100ms" }, 160);
	setTimeout(function () { document.getElementById(id).style.transform = "translateY(0px)" }, 161);
}

function chooseACharacter(char)
{
	if(!chosenContainer[0])
	{
		var charCount = 0;

		for (var startingCharacters in characterStats) 
		{
			var newPlayerChar = new CharacterCard(characterStats[startingCharacters], "Player", "playerContainer", startingCharacters);
  			chosenContainer.push(newPlayerChar);
			chosenContainer[charCount].generate();
			document.getElementById(chosenContainer[charCount].id).setAttribute("data", charCount);
			charCount++;
		}

		swapShadow('characterContainer', "on");
		swapShadow('characterContainer', "off");
		slideOutChar(char, 10);
	
		playerChosenCard = document.getElementById(char).getAttribute('data');
		chosenCard = document.getElementById(chosenContainer[playerChosenCard].id);

		slideInChar(chosenContainer[playerChosenCard].id, 310);

		setTimeout(function () { swapText("talkText", "Choose an Enemy:") }, 810);
		setTimeout(function () { swapText("pText", "Player (" + chosenContainer[playerChosenCard].title + ")") }, 810); 

		document.getElementById(startContainer[0].id).onclick = function () { chooseAnEnemy(startContainer[0].id); };
		document.getElementById(startContainer[1].id).onclick = function () { chooseAnEnemy(startContainer[1].id); };
		document.getElementById(startContainer[2].id).onclick = function () { chooseAnEnemy(startContainer[2].id); };
		document.getElementById(startContainer[3].id).onclick = function () { chooseAnEnemy(startContainer[3].id); };

		if(playerChosenCard === "3")
		{
			chosenContainer[playerChosenCard].attack = 10;
		}
	}
}

function chooseAnEnemy(char)
{
	if(!attackerContainer[0])
	{
		var charCount = 0;

		for (var startingCharacters in characterStats) 
		{
			var newEnemyChar = new CharacterCard(characterStats[startingCharacters], "Enemy", "enemyContainer", startingCharacters);
  			attackerContainer.push(newEnemyChar);
			attackerContainer[charCount].generate();
			document.getElementById(attackerContainer[charCount].id).setAttribute("data", charCount);
			charCount++;
		}

		swapShadow('characterContainer', "on");
		slideOutChar(char, 10);

		enemyChosenCard = document.getElementById(char).getAttribute('data');
		attackerCard = document.getElementById(attackerContainer[enemyChosenCard].id);

		slideInChar(chosenContainer[enemyChosenCard].id, 310);
		setTimeout(function () { FLIPchars("characterContainer"); }, 500);
		slideOutChar(chosenContainer[enemyChosenCard].id, 800);
		setTimeout(function () { FLIPchars("playerContainer"); }, 1300);
		slideInChar(attackerContainer[enemyChosenCard].id, 1300);
		setTimeout(function () { FLIPchars("enemyContainer"); }, 1800);
	
		setTimeout(function () { swapText("eText", "Enemy (" + attackerContainer[enemyChosenCard].title + ")") }, 1810);
		
		setTimeout(function () { document.getElementById('talkText').style.height = document.getElementById('pText').offsetHeight + "px";
						 swapText("talkText", "<span class='attack-button'>Attack</span>");
						 }, 1810);
		setTimeout(function () { document.getElementsByClassName('attack-button')[0].onclick = playerAttack; }, 2500);

		setTimeout(function () { document.getElementById('talkText').style.transition = "transform ease-in-out 100ms";
						 document.getElementById('pText').style.transition = "transform ease-in-out 100ms";
						 document.getElementById('eText').style.transition = "transform ease-in-out 100ms"; }, 2500);
	}
}

function playerAttack()
{
	//disable attack button
	document.getElementsByClassName('attack-button')[0].onclick = "";
	document.getElementsByClassName('attack-button')[0].classList.add('attack-button-disabled')
	document.getElementsByClassName('attack-button')[0].innerHTML = "&nbsp;";

	//get the current health of the currently selected enemy
	var getEnemyHealth = attackerContainer[enemyChosenCard].healthObject.health;

	//Calculate the amount of damage: the player's attack multiplied by the current player's multiplier
	lastEnemyDamage = chosenContainer[playerChosenCard].attack + (playerMultiplier * chosenContainer[playerChosenCard].multi); //Note: it's a global variable so our event listener can update the UI
	
	//subtract the amount of damage
	var newEnemyHealth = getEnemyHealth - lastEnemyDamage;

	//increase the players multiplier by 1
	playerMultiplier++;
	
	if(newEnemyHealth > 0)
	{
		//set the currently selected enemy's health to the cacluated attack amount
		attackerContainer[enemyChosenCard].healthObject.health = newEnemyHealth; //Note: the onHealthChange event listener will automatically update the UI when we modify the health on any enemy character

		//counterAttack
		enemyAttack();
	}
	else
	{
		//Calculate the amount of damage: the enemy's remaining health;
		lastEnemyDamage = getEnemyHealth;
	
		//set the currently selected enemy's health to 0
		attackerContainer[enemyChosenCard].healthObject.health = 0;

		//remove attack button
		document.getElementsByClassName('attack-button')[0].style.transform = "scale(0,0)";
		
		setTimeout(enemyDeath, 1500);	
	}
}

function enemyAttack()
{
	//get the current health of the currently selected player
	var getPlayerHealth = chosenContainer[playerChosenCard].healthObject.health;

	//Calculate the amount of damage: it is the enemy's attack
	lastPlayerDamage = attackerContainer[enemyChosenCard].attack; //Note: it's a global variable so our event listener can update the UI
	
	//subtract the amount of damage
	var newPlayerHealth = getPlayerHealth - lastPlayerDamage;
	
	if(newPlayerHealth > 0)
	{
		//set the currently selected player's health to the cacluated attack amount
		chosenContainer[playerChosenCard].healthObject.health = newPlayerHealth; //Note: the onHealthChange event listener will automatically update the UI when we modify the health on any player character

	
		//enable attack button
		setTimeout(function () { document.getElementsByClassName('attack-button')[0].onclick = playerAttack; 
					 	 document.getElementsByClassName('attack-button')[0].classList.remove('attack-button-disabled')
						 document.getElementsByClassName('attack-button')[0].innerHTML = "Attack"; }, 1000);
	}
	else
	{
		//Calculate the amount of damage: the player's remaining health;
		lastPlayerDamage = getPlayerHealth;

		//set the currently selected player's health to 0
		chosenContainer[playerChosenCard].healthObject.health = 0;

		//remove attack button
		document.getElementsByClassName('attack-button')[0].style.transform = "scale(0,0)";

		setTimeout(playerDeath, 1500);	
	}
}

function enemyDeath()
{
	//Show messages
	swapText('eText', "Enemy (" + attackerContainer[enemyChosenCard].title + ") fainted.");

	//Remove the current enemy
	setTimeout(function () { document.getElementById(attackerContainer[enemyChosenCard].id).style.transform += "translateY(150px)" } , 1000);

	//increment enemies defeated
	enemiesDefeated++;

	if(enemiesDefeated !== 3)
	{
		swapText('talkText', "Choose an Enemy:");
		setTimeout(function () { swapText('pText', "Player (" + chosenContainer[playerChosenCard].title + ")") } , 1000);

		//Remove shadow overlay on character selection
		setTimeout(function () { swapShadow('characterContainer', "off");
						 document.getElementById("enemyContainer").innerHTML="";
						 attackerContainer = []; } , 1400);

		//line up
		chosenCard.style.transform = "scale(1,1)";

		for (var currentCharCard = 0; currentCharCard < document.getElementById("characterContainer").childElementCount; currentCharCard++)
		{
			if(document.getElementById("characterContainer").children[currentCharCard].style.transform.indexOf("translateX") !== -1)
			{
				document.getElementById("characterContainer").children[currentCharCard].style.transform = "scale(1,1)";
			}
		}
	}
	else
	{
		swapText('talkText', "<span class='restart-button' onclick='window.location.reload()'>Play Again</span>");
		swapText("pText", "Player (" + chosenContainer[playerChosenCard].title + ")" + " wins!")
		swapText('eText', "&nbsp;");
	}
}

function playerDeath()
{
	//Show messages
	swapText('pText', "Player (" + chosenContainer[playerChosenCard].title + ") fainted.");

	//Remove the current player
	setTimeout(function () { document.getElementById(chosenContainer[playerChosenCard].id).style.transform += "translateY(150px)" } , 1000);

	swapText('talkText', "<span class='restart-button' onclick='window.location.reload()'>Play Again</span>");
	swapText("eText", "Enemy (" + attackerContainer[enemyChosenCard].title + ")" + " wins!")
}


