function start() { // Inicio da função start()

	$("#inicio").hide();
	
	$("#fundoGame").append("<div id='nave'></div>");
	$("#fundoGame").append("<div id='inimigo1' class='anima1'></div>");
	$("#fundoGame").append("<div id='inimigo2' class='anima2'></div>");
	$("#fundoGame").append("<div id='inimigo3' class='anima3'></div>");
	$("#fundoGame").append("<div id='placar'></div>");
	$("#fundoGame").append("<div id='vida'></div>");
	$("#fundoGame").append("<div id='escudo'></div>");	


	// Principais variáveis do jogo

	var jogo = {}
	var TECLA = {
		left: 37,
		right: 39,
		up: 38,
		down: 40,
		Z: 90
	}

	jogo.pressionou = [];

	var velocidade=5;
	var posicaoX = parseInt((Math.random() * 380)+250);
	var podeAtirar = true;
	var fimDeJogo= false;

	var podeAtirarInimigo1 = true;
	var podeAtirarInimigo2 = true;
	var podeAtirarInimigo3 = true;
	var podeAtirarBoss = true;

	var pontos=0;
	var vidaAgora = 3;
	var escudoAgora = 3;
	
	var spawnBoss = 1;
	var spawnPortal = 1;
	var bossRight = true;
	var bossLeft = false;
	var lifeBoss = 8;

	
	var audioBoss=document.getElementById("audioBoss");
	var audioExplosion=document.getElementById("audioExplosion");
	var audioGameplay=document.getElementById("audioGameplay");
	var audioLose=document.getElementById("audioLose");
	var audioShoot=document.getElementById("audioShoot");
	var audioWin=document.getElementById("audioWin");
	var playAudioBoss = 1;

	// Musica em loop
	audioGameplay.addEventListener("ended", function(){ audioGameplay.currentTime=0; audioGameplay.play();}, false);
	audioGameplay.play();

	// Verifica se o usuário pressionou alguma tecla
	$(document).keydown(function(e){
		jogo.pressionou[e.which] = true;
		});
	
	
	$(document).keyup(function(e){
	   jogo.pressionou[e.which] = false;
	});



	// Game Loop
	jogo.timer = setInterval(loop,30);


	function loop() {
		moveJogador();
		moveInimigo1();
		colisao();
		placar();
		vida();
		escudo();
		boss();

	} // Fim da função loop()

	// Disparos em Looping

	jogo.primeiroDisparoInimigo1 = setTimeout(disparoInimigo1,50);
	jogo.disparosInimigo1 = setInterval(disparoInimigo1,1500);


	jogo.disparosInimigo2 = setInterval(disparoInimigo2,3000);

	jogo.disparosInimigo2 = setInterval(disparoInimigo3,2500);


	// Move fundo
	$("#fundoGame").css("animation", "animaMovimento1 10s linear infinite");




	// Move Jogador
	function moveJogador() {
		if (jogo.pressionou[TECLA.left]) {
			var moveHorizontal = parseInt($("#nave").css("left"));
			$("#nave").css("left",moveHorizontal-10);
			if (moveHorizontal<=0) {
				$("#nave").css("left",moveHorizontal+10);				
			}
		}

		if (jogo.pressionou[TECLA.right]) {
			var moveHorizontal = parseInt($("#nave").css("left"));
			$("#nave").css("left",moveHorizontal+10);
			if (moveHorizontal>=840) {
				$("#nave").css("left",moveHorizontal-10);				
			}
		}

		if(pontos>=500 && $("#inimigo1").length<=0 && $("#inimigo2").length<=0 && $("#inimigo3").length<=0){
			realocaoNaveY = parseInt($("#nave").css("top"));

			if(realocaoNaveY<650){
				$("#nave").css("top",realocaoNaveY+5);
			}
		}else{
			if (jogo.pressionou[TECLA.up]) {
				var moveVertical = parseInt($("#nave").css("top"));
				$("#nave").css("top",moveVertical-10);
				if (moveVertical<=0) {
					$("#nave").css("top",moveVertical+10);				
				}
			}
		}


		if(pontos>=500 && $("#inimigo1").length<=0 && $("#inimigo2").length<=0 && $("#inimigo3").length<=0){
			realocaoNaveY = parseInt($("#nave").css("top"));

			if(realocaoNaveY<650){
				$("#nave").css("top",realocaoNaveY+5);
			}
		}else{
			if (jogo.pressionou[TECLA.down]) {
				var moveVertical = parseInt($("#nave").css("top"));
				$("#nave").css("top",moveVertical-10);
				if (moveVertical<=650) {
					$("#nave").css("top",moveVertical+10);				
				}
			}
		}
		

		
		if (jogo.pressionou[TECLA.Z]) {
			disparo();
		}

	}

	// Move Inimigo
	function moveInimigo1() {

		posicaoY = parseInt($("#inimigo1").css("top"));
		$("#inimigo1").css("top",posicaoY+velocidade);
		$("#inimigo1").css("left",posicaoX);
			
			if (posicaoY>=750) {
			posicaoX = parseInt((Math.random() * 380)+250);
			$("#inimigo1").css("top",0);
			$("#inimigo1").css("left",posicaoX);
			}
	} //Fim da função moveinimigo1()
	
	// Disparo
	function disparo() {
	
		if (podeAtirar==true) {
		
		audioShoot.play();	
		podeAtirar=false;
		
		posicaoTiroY = parseInt($("#nave").css("top"));
		posicaoTiroX= parseInt($("#nave").css("left"));
		tiroX = posicaoTiroX+38;
		topoTiro=posicaoTiroY-45;
		$("#fundoGame").append("<div id='disparo'></div");
		$("#disparo").css("top",posicaoTiroY);
		$("#disparo").css("left",tiroX);
		
		var tempoDisparo=window.setInterval(executaDisparo, 30);
		
		}

		function executaDisparo() {
			posicaoTiroY = parseInt($("#disparo").css("top"));
			$("#disparo").css("top",posicaoTiroY-15); 
	
				if (posicaoTiroY<=0) {
					window.clearInterval(tempoDisparo);
					tempoDisparo=null;
					$("#disparo").remove();
					podeAtirar=true;	
					}
		} // Fecha executaDisparo()
	} // Fecha disparo()


	function colisao() {
		var colisao1 = ($("#nave").collision($("#inimigo1")));
		var colisao2 = ($("#nave").collision($("#inimigo2")));
		var colisao3 = ($("#nave").collision($("#inimigo3")));
		var colisao4 = ($("#disparo").collision($("#inimigo1")));
		var colisao5 = ($("#disparo").collision($("#inimigo2")));
		var colisao6 = ($("#disparo").collision($("#inimigo3")));
		var colisao7 = ($("#disparoInimigo1").collision($("#nave")));
		var colisao8 = ($("#disparoInimigo2").collision($("#nave")));
		var colisao9 = ($("#disparoInimigo3").collision($("#nave")));
		var colisao10 = ($("#disparo").collision($("#boss")));
		var colisao11 = ($("#disparoBoss").collision($("#nave")));

		// Nave x Inimigo1
		if (colisao1.length>0) {
			
			vidaAgora--;

			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
			explosao1(inimigo1X,inimigo1Y);

			$("#inimigo1").remove();
		}
	

		// Nave x Inimigo2
		if (colisao2.length>0) {

			vidaAgora--;

			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
			explosao2(inimigo2X,inimigo2Y);
			
			$("#inimigo2").remove();
		}

		// Nave x Inimigo3
		if (colisao3.length>0) {

			vidaAgora--;

			inimigo3X = parseInt($("#inimigo3").css("left"));
			inimigo3Y = parseInt($("#inimigo3").css("top"));
			explosao3(inimigo3X,inimigo3Y);
			
			$("#inimigo3").remove();
		}


		// Disparo x Inimigo1
		if (colisao4.length>0) {
		
			pontos = pontos+100;

			inimigo1X = parseInt($("#inimigo1").css("left"));
			inimigo1Y = parseInt($("#inimigo1").css("top"));
				
			explosao1(inimigo1X,inimigo1Y);
			$("#disparo").css("top",0);
				
			$("#inimigo1").remove();
		}

		// Disparo x Inimigo2
		if (colisao5.length>0) {
		
			pontos = pontos+50;

			inimigo2X = parseInt($("#inimigo2").css("left"));
			inimigo2Y = parseInt($("#inimigo2").css("top"));
				
			explosao2(inimigo2X,inimigo2Y);
			$("#disparo").css("top",0);
				
			$("#inimigo2").remove();
		}
		
		// Disparo x Inimigo3
		if (colisao6.length>0) {
		
			pontos = pontos+50;

			inimigo3X = parseInt($("#inimigo3").css("left"));
			inimigo3Y = parseInt($("#inimigo3").css("top"));
				
			explosao3(inimigo3X,inimigo3Y);
			$("#disparo").css("top",0);
				
			$("#inimigo3").remove();

		}

		// DisparoInimigo1 x Nave
		if (colisao7.length>0) {
		
			if(escudoAgora>0){
				escudoAgora--;
			}else if(escudoAgora==0){
				escudoAgora--;
				vidaAgora--;
			}else if(escudoAgora<0) {
				vidaAgora--;
			}

			naveX = parseInt($("#nave").css("left"));
			naveY = parseInt($("#nave").css("top"));
			
			posicaoYNave = naveY - 80;

			explosao4(naveX,posicaoYNave);
			$("#disparoInimigo1").css("top",900);
			podeAtirarInimigo1 = false;
		}

		// DisparoInimigo2 x Nave
		if (colisao8.length>0) {
		
			if(escudoAgora>0){
				escudoAgora--;
			}else if(escudoAgora==0){
				escudoAgora--;
				vidaAgora--;
			}else if(escudoAgora<0) {
				vidaAgora--;
			}

			naveX = parseInt($("#nave").css("left"));
			naveY = parseInt($("#nave").css("top"));
			
			posicaoYNave = naveY - 80;

			explosao5(naveX,posicaoYNave);
			$("#disparoInimigo2").css("top",900);
			podeAtirarInimigo2 = false;
		}

		// DisparoInimigo3 x Nave
		if (colisao9.length>0) {
		
			if(escudoAgora>0){
				escudoAgora--;
			}else if(escudoAgora==0){
				escudoAgora--;
				vidaAgora--;
			}else if(escudoAgora<0) {
				vidaAgora--;
			}
			naveX = parseInt($("#nave").css("left"));
			naveY = parseInt($("#nave").css("top"));
			
			posicaoYNave = naveY - 80;

			explosao6(naveX,posicaoYNave);
			$("#disparoInimigo3").css("top",900);
			podeAtirarInimigo3 = false;
		}


		// Disparo x Boss
		if (colisao10.length>0) {

			disparoX = parseInt($("#disparo").css("left"));
			disparoY = parseInt($("#disparo").css("top"));
				
			explosao8(disparoX,disparoY);
			$("#disparo").css("top",0);

			lifeBoss--;
			
			if(lifeBoss==0){
				bossX = parseInt($("#boss").css("left"));
				bossY = parseInt($("#boss").css("top"));
		
				explosao10(bossX,bossY);
				setTimeout(congrats,400);

			}
		
		}

		// DisparoBoss x Nave
		if (colisao11.length>0) {
			
			vidaAgora--;
			
			naveX = parseInt($("#nave").css("left"));
			naveY = parseInt($("#nave").css("top"));
			
			posicaoYNave = naveY - 80;

			explosao9(naveX,posicaoYNave);
			$("#disparoBoss").css("top",900);

		}

	}

	function explosao1(inimigo1X,inimigo1Y){
		audioExplosion.play();
		$("#fundoGame").append("<div id='explosao1'></div>");
		$("#explosao1").css("top", inimigo1Y+3);
		$("#explosao1").css("left", inimigo1X+3);
		$("#explosao1").animate({opacity:0}, "slow");

		var tempoExplosao1=window.setInterval(removeExplosao, 1000);
			function removeExplosao(){
				$("#explosao1").remove();
				window.clearInterval(tempoExplosao1);
				tempoExplosao1=null;
				if (fimDeJogo==false && pontos<500){
					$("#fundoGame").append("<div id='inimigo1' class='anima1'></div>");
					posicaoX = parseInt((Math.random() * 380)+250);
					$("#inimigo1").css("top",0);
					$("#inimigo1").css("left",posicaoX);
					podeAtirarInimigo1 = true;
				}
			}
	} // Fim explosao1()

	function explosao2(inimigo2X,inimigo2Y){
		audioExplosion.play();
		$("#fundoGame").append("<div id='explosao2'></div>");
		$("#explosao2").css("top", inimigo2Y);
		$("#explosao2").css("left", inimigo2X);
		$("#explosao2").animate({opacity:0}, "slow");

		var tempoExplosao2=window.setInterval(removeExplosao, 1500);
			function removeExplosao(){
				$("#explosao2").remove();
				window.clearInterval(tempoExplosao2);
				tempoExplosao2=null;

				if (fimDeJogo==false && pontos<500){
					$("#fundoGame").append("<div id='inimigo2' class='anima2'></div>");

					$("#inimigo2").css("top",120);
					$("#inimigo2").css("left",10);
					podeAtirarInimigo2 = true;
				}
			}
	} // Fim explosao2()


	function explosao3(inimigo3X,inimigo3Y){
		audioExplosion.play();
		$("#fundoGame").append("<div id='explosao3'></div>");
		$("#explosao3").css("top", inimigo3Y);
		$("#explosao3").css("left", inimigo3X);
		$("#explosao3").animate({opacity:0}, "slow");

		var tempoExplosao3=window.setInterval(removeExplosao, 1500);
			function removeExplosao(){
				$("#explosao3").remove();
				window.clearInterval(tempoExplosao3);
				tempoExplosao3=null;
				if (fimDeJogo==false && pontos<500){
					$("#fundoGame").append("<div id='inimigo3' class='anima3'></div>");
		
					$("#inimigo3").css("top",120);
					$("#inimigo3").css("left",730);
					podeAtirarInimigo3 = true;
				}
			}
	} // Fim explosao3()


	function explosao4(naveX,naveY){
		audioExplosion.play();
		if($("#explosao4").length<=0){
			if(escudoAgora>=0){
				$("#fundoGame").append("<div id='explosao4'></div>");
				$("#explosao4").css("top", naveY-10);
				$("#explosao4").css("left", naveX);
				$("#explosao4").animate({opacity:0}, "slow");
				$("#disparoInimigo1").css("top",750);
	
				var tempoExplosao4=window.setInterval(removeExplosao, 500);
					function removeExplosao(){
						$("#explosao4").remove();
						window.clearInterval(tempoExplosao4);
						tempoExplosao4=null;
					}
			}else{
				$("#fundoGame").append("<div id='explosao7'></div>");
				$("#explosao7").css("top", naveY-10);
				$("#explosao7").css("left", naveX);
				$("#explosao7").animate({opacity:0}, "slow");
				$("#disparoInimigo1").css("top",750);
	
				var tempoExplosao7=window.setInterval(removeExplosao, 500);
					function removeExplosao(){
						$("#explosao7").remove();
						window.clearInterval(tempoExplosao7);
						tempoExplosao7=null;
					}
			}

		}
	} // Fim explosao4()

	function explosao5(naveX,naveY){
		audioExplosion.play();
		if(escudoAgora>=0){
			if($("#explosao5").length<=0){
				$("#fundoGame").append("<div id='explosao5'></div>");
				$("#explosao5").css("top", naveY-10);
				$("#explosao5").css("left", naveX);
				$("#explosao5").animate({opacity:0}, "slow");
				$("#disparoInimigo2").css("top",750);
	
				var tempoExplosao5=window.setInterval(removeExplosao, 500);
					function removeExplosao(){
						$("#explosao5").remove();
						window.clearInterval(tempoExplosao5);
						tempoExplosao5=null;
				}
			}
		}else{
			if($("#explosao7").length<=0){
				$("#fundoGame").append("<div id='explosao7'></div>");
				$("#explosao7").css("top", naveY-10);
				$("#explosao7").css("left", naveX);
				$("#explosao7").animate({opacity:0}, "slow");
				$("#disparoInimigo2").css("top",750);
	
				var tempoExplosao7=window.setInterval(removeExplosao, 500);
					function removeExplosao(){
						$("#explosao7").remove();
						window.clearInterval(tempoExplosao7);
						tempoExplosao7=null;
				}
			}
		}

	} // Fim explosao5()

	function explosao6(naveX,naveY){
		audioExplosion.play();
		if(escudoAgora>=0){
			if($("#explosao6").length<=0){
				$("#fundoGame").append("<div id='explosao6'></div>");
				$("#explosao6").css("top", naveY-10);
				$("#explosao6").css("left", naveX);
				$("#explosao6").animate({opacity:0}, "slow");
				$("#disparoInimigo3").css("top",750);
	
				var tempoExplosao6=window.setInterval(removeExplosao, 500);
					function removeExplosao(){
						$("#explosao6").remove();
						window.clearInterval(tempoExplosao6);
						tempoExplosao6=null;
					}
			}
		}else{
			if($("#explosao7").length<=0){
				$("#fundoGame").append("<div id='explosao7'></div>");
				$("#explosao7").css("top", naveY-10);
				$("#explosao7").css("left", naveX);
				$("#explosao7").animate({opacity:0}, "slow");
				$("#disparoInimigo3").css("top",750);
	
				var tempoExplosao7=window.setInterval(removeExplosao, 500);
					function removeExplosao(){
						$("#explosao7").remove();
						window.clearInterval(tempoExplosao7);
						tempoExplosao7=null;
					}
			}
		}

	} // Fim explosao6()

	function explosao8(disparoX,disparoY){
		audioExplosion.play();
		$("#fundoGame").append("<div id='explosao8'></div>");
		$("#explosao8").css("top", disparoY);
		$("#explosao8").css("left", disparoX);
		$("#explosao8").animate({opacity:0}, "slow");

		var tempoExplosao8=window.setInterval(removeExplosao, 500);
			function removeExplosao(){
				$("#explosao8").remove();
				window.clearInterval(tempoExplosao8);
				tempoExplosao8=null;
			}
	} // Fim explosao8()



	function explosao9(naveX,naveY){
		audioExplosion.play();
		if($("#explosao9").length<=0){
			$("#fundoGame").append("<div id='explosao9'></div>");
			$("#explosao9").css("top", naveY-10);
			$("#explosao9").css("left", naveX);
			$("#explosao9").animate({opacity:0}, "slow");
			$("#disparoBoss").css("top",750);
	
			var tempoExplosao9=window.setInterval(removeExplosao, 500);
				function removeExplosao(){
					$("#explosao9").remove();
					window.clearInterval(tempoExplosao9);
					tempoExplosao9=null;
				}
		}
	
	} // Fim explosao9()



	function explosao10(bossX,bossY){
		audioExplosion.play();
		$("#boss").remove();
		if($("#explosao10").length<=0){
			$("#fundoGame").append("<div id='explosao10'></div>");
			$("#explosao10").css("top", bossY-100);
			$("#explosao10").css("left", bossX-10);
			$("#explosao10").animate({opacity:0}, "slow");
	
			var tempoExplosao10=window.setInterval(removeExplosao, 5000);
				function removeExplosao(){
					$("#explosao10").remove();
					window.clearInterval(tempoExplosao10);
					tempoExplosao10=null;
				}
		}
	
	} // Fim explosao10()


	function disparoInimigo1() {

		if($("#inimigo1").length<=0){
			podeAtirarInimigo1 = false;
		} 

		if (podeAtirarInimigo1 == true) {
		
		podeAtirarInimigo1 = false;
		
		posicaoTiroInimigo1Y = parseInt($("#inimigo1").css("top"));
		posicaoTiroInimigo1X= parseInt($("#inimigo1").css("left"));
		tiroInimigo1X = posicaoTiroInimigo1X+37;
		tiroInimigo1Y = posicaoTiroInimigo1Y+100;
		
		if(tiroInimigo1Y <= 100){
			tiroInimigo1Y = 850;
		}

		$("#fundoGame").append("<div id='disparoInimigo1'></div");
		$("#disparoInimigo1").css("top",tiroInimigo1Y);
		$("#disparoInimigo1").css("left",tiroInimigo1X);

		var tempoDisparoInimigo1=window.setInterval(executaDisparoInimigo1, 30);
		
		}

		function executaDisparoInimigo1() {
			posicaoTiroInimigo1Y = parseInt($("#disparoInimigo1").css("top"));
			$("#disparoInimigo1").css("top",posicaoTiroInimigo1Y+15); 
	
				if (posicaoTiroInimigo1Y>=750) {
					window.clearInterval(tempoDisparoInimigo1);
					tempoDisparoInimigo1=null;
					$("#disparoInimigo1").remove();
					podeAtirarInimigo1 = true;
					}
		} // Fecha executaDisparoInimigo1()
	} // Fecha disparoInimigo1()



	function disparoInimigo2() {
	
		if($("#inimigo2").length<=0){
			podeAtirarInimigo2 = false;
		} 

		if (podeAtirarInimigo2==true) {
		
		podeAtirarInimigo2=false;
		

		$("#fundoGame").append("<div id='disparoInimigo2'></div");
		$("#disparoInimigo2").css("top",350);
		$("#disparoInimigo2").css("left",107);
		
		var tempoDisparoInimigo2=window.setInterval(executaDisparoInimigo2, 30);
		
		}

		function executaDisparoInimigo2() {
			posicaoTiroInimigo2Y = parseInt($("#disparoInimigo2").css("top"));
			$("#disparoInimigo2").css("top",posicaoTiroInimigo2Y+20); 
	
				if (posicaoTiroInimigo2Y>=750) {
					window.clearInterval(tempoDisparoInimigo2);
					tempoDisparoInimigo2=null;
					$("#disparoInimigo2").remove();
					podeAtirarInimigo2 = true;
					}
		} // Fecha executaDisparoInimigo2()
	} // Fecha disparoInimigo2()

	function disparoInimigo3() {
	
		if($("#inimigo3").length<=0){
			podeAtirarInimigo3 = false;
		} 

		if (podeAtirarInimigo3==true) {
		
		podeAtirarInimigo3=false;
		

		$("#fundoGame").append("<div id='disparoInimigo3'></div");
		$("#disparoInimigo3").css("top",350);
		$("#disparoInimigo3").css("left",800);
		
		var tempoDisparoInimigo3=window.setInterval(executaDisparoInimigo3, 30);
		
		}

		function executaDisparoInimigo3() {
			posicaoTiroInimigo3Y = parseInt($("#disparoInimigo3").css("top"));
			$("#disparoInimigo3").css("top",posicaoTiroInimigo3Y+20); 
	
				if (posicaoTiroInimigo3Y>=750) {
					window.clearInterval(tempoDisparoInimigo3);
					tempoDisparoInimigo3=null;
					$("#disparoInimigo3").remove();
					podeAtirarInimigo3 = true;
					}
		} // Fecha executaDisparoInimigo3()
	} // Fecha disparoInimigo3()



	function disparoBoss() {

		if($("#boss").length<=0){
			podeAtirarBoss = false;
		} 

		if (podeAtirarBoss == true) {
		
		podeAtirarBoss = false;
		
		posicaoTiroBossY = parseInt($("#boss").css("top"));
		posicaoTiroBossX= parseInt($("#boss").css("left"));
		tiroBossX = posicaoTiroBossX;
		tiroBossY = posicaoTiroBossY;
		

		$("#fundoGame").append("<div id='disparoBoss'></div");
		$("#disparoBoss").css("top",tiroBossY+200);
		$("#disparoBoss").css("left",tiroBossX+150);

		var tempoDisparoBoss=window.setInterval(executaDisparoBoss, 30);
		
		}

		function executaDisparoBoss() {
			posicaoTiroBossY = parseInt($("#disparoBoss").css("top"));
			$("#disparoBoss").css("top",posicaoTiroBossY+10); 
	
				if (posicaoTiroBossY>=600) {
					window.clearInterval(tempoDisparoBoss);
					tempoDisparoBoss=null;
					$("#disparoBoss").remove();
					podeAtirarBoss = true;
					}
		} // Fecha executaDisparoBoss()
	} // Fecha disparoBoss()


	function placar() {
		$("#placar").html("<h2> Pontos: " + pontos + "</h2>");
	} // Fim da função placar

	function escudo() {
		if (escudoAgora==3){
			$("#escudo").css("background-image", "url(media/imgs/shieldProtect3.png)")
		}

		if (escudoAgora==2){
			$("#escudo").css("background-image", "url(media/imgs/shieldProtect2.png)")
		}

		if (escudoAgora==1){
			$("#escudo").css("background-image", "url(media/imgs/shieldProtect1.png)")
		}

		if (escudoAgora<=0){
			$("#escudo").css("background-image", "url(media/imgs/shieldProtect.png)")
		}

	}

	function vida() {
		if (vidaAgora==3){
			$("#vida").css("background-image", "url(media/imgs/naveVida3.png)")
		}

		if (vidaAgora==2){
			$("#vida").css("background-image", "url(media/imgs/naveVida2.png)")
		}

		if (vidaAgora==1){
			$("#vida").css("background-image", "url(media/imgs/naveVida1.png)")
		}

		if (vidaAgora==0){
			$("#vida").css("background-image", "url(media/imgs/naveVida.png)")
			
			gameOver();
			
		}

	}


	function boss(){
		if(pontos>=500 && $("#inimigo1").length<=0 && $("#inimigo2").length<=0 && $("#inimigo3").length<=0){
			setTimeout(portal,2500);
			setTimeout(showBoss,5000);
		}
		
	}


	function portal(){
		while(playAudioBoss==1){
			audioGameplay.pause();
			audioBoss.play();
			playAudioBoss++
		}
		while(spawnPortal==1){
			$("#fundoGame").append("<div id='portal' class='anima4'></div>");
			spawnPortal++;
		}
		setInterval(removePortal,3500);	
	}


	function removePortal(){
		$("#portal").remove();	

	}

	function showBoss(){
		while(spawnBoss==1){
			$("#fundoGame").append("<div id='boss'></div>")
			spawnBoss--
		}
		moveBoss();
		disparoBoss();

	}


	function moveBoss() {
		posicaoBossX = parseInt($("#boss").css("left"));

		if(bossRight==true){
			$("#boss").css("left",posicaoBossX+5);
			if(posicaoBossX==450){
				bossRight=false;
				bossLeft=true;
			}
		}

		if(bossLeft==true){
			$("#boss").css("left",posicaoBossX-5);
			if(posicaoBossX==10){
				bossLeft=false;
				bossRight=true;
			}
		}
	} //Fim da função moveBoss()


	function congrats(){
		fimDeJogo=true;

		audioBoss.pause();
		audioGameplay.pause();
		audioWin.play();


		window.clearInterval(jogo.timer);
		jogo.timer=null;

		$("#nave").remove();
		$("#disparo").remove();
		$("#disparoInimigo1").remove();
		$("#disparoInimigo2").remove();
		$("#disparoInimigo3").remove();
		$("#disparoBoss").remove();
		$("#portal").remove();	

		$("#fundoGame").append("<div id='congrats'></div>");
		
        $("#congrats").html("<h1> Parabéns!!! </h1><p>Você derrotou a invasão cósmica e salvou o universo!</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h4>Jogar Novamente</h4></div>");
	}

	function gameOver(){
		fimDeJogo=true;
		
		audioBoss.pause();
		audioGameplay.pause();
		
	
		audioLose.play();


		window.clearInterval(jogo.timer);
		jogo.timer=null;

		$("#nave").remove();
		$("#inimigo1").remove();
		$("#inimigo2").remove();
		$("#inimigo3").remove();
		$("#boss").remove();
		$("#disparo").remove();
		$("#disparoInimigo1").remove();
		$("#disparoInimigo2").remove();
		$("#disparoInimigo3").remove();
		$("#disparoBoss").remove();
		$("#fundoGame").append("<div id='fim'></div>");
		
        $("#fim").html("<h1> Game Over </h1><p>Sua pontuação foi: " + pontos + "</p>" + "<div id='reinicia' onClick=reiniciaJogo()><h3>Jogar Novamente</h3></div>");
	}


} // Fim da função start


function reiniciaJogo() {
	audioLose.pause();
	audioWin.pause();
   	$("#fim").remove();
	$("#congrats").remove();
    start();
}