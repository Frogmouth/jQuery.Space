(function($){
	$.space = {};													//Oggetto utile per immagazzinare informazioni
	$.fn.space = function(option){
		var that = $(this);
		var settings = $.extend({
			
			wd : {													//Dimensioni del box Model preso come "Contesto"
				w : $(window).width(),	
				h : $(window).height()	
			},
			n_ : [5,5], 											//Dimensioni della girglia dei frame
			origin : "f01", 										//Frame di origine
			hh_ : null,												//Altezza della griglia
			ww_ : null,												//Larghezza della griglia (da ora in poi definita "Lente")
			l : "#lens",											//Wrapper "Finestra" figlio del contesto e padre della griglia (delle dimensioni del contesto)
			cFrm : ".frame",										//Classe che definisce un tag come Frame
			frms : {},												//Posizione dei Frame all'internodella griglia
			tab : null												//Array di oggetti JQuery rappresentante i Frame
		}, option);
		
		getFrame = function(){										//Ricerco i Frame (Jquery Obj) all'interno dell'HTML
			settings.tab = that.find(settings.cFrm);
			return settings.tab;
		}
		
		setLens = function(){										//Dispongo e setto le dimensioni della Lente in base al Contesto
			settings.l = $(settings.l);
			settings.l.css({
				"width" : settings.wd.w,
				"height" : settings.wd.h,
				"top" : 0,
				"left" : 0,
				"margin" : 0
			});
		}
		
		setFrame = function(){										//Setto le dimensioni dei Frame
			settings.tab.css({
				"width" : settings.wd.w,
				"height" : settings.wd.h
			});
		}
		
		makeSpace = function(){										//Setto lo Spazio e lo centro sul Frame prescelto
			settings.hh_ = settings.wd.h * settings.n_[0];
			settings.ww_ = settings.wd.w * settings.n_[1];
			
			var origin = (typeof settings.origin != "object" && typeof settings.origin != "string" ) ? [0,0]  : (typeof settings.origin != "object") ? ispCoordinate(settings.frms[settings.origin]) : settings.frms[settings.origin] ;
			
			that.css({
				"width" : settings.ww_,
				"height" : settings.hh_,
				"left" : "-"+origin[0],
				"top" : "-"+origin[1]
			});
		}
		
		ispCoordinate = function(el){								//Helper per trasforamre lo spazio definito in "numero di celle" in spazio definito in "px" in base al Contesto
			el[0] = (typeof el[0] == "string") ? el[0] : (settings.wd.w * el[0])+"px";
			el[1] = (typeof el[1] == "string") ? el[1] : (settings.wd.h * el[1])+"px";
			return el;
		}
		
		placeFrame = function(){									//Metodo che dispone i Frame nel Contesto e ne salva le coordinate (in px) all'interno della variabile "settings.frms"
			var frame = settings.frms;
			var $frames = settings.tab;
			
			$frames.each(function(){
				var id = $(this).attr("id");
				if(typeof frame[id] == "undefined"){
					frame[id] = [$(this).css("left"), $(this).css("left")];
				}else{
					frame[id] = ispCoordinate(frame[id]);
					$(this).css({
						"left" : frame[id][0],
						"top" : frame[id][1]
					});
				}
			});
		}
		
		//gstori
		
		$(".travel").on("click", function(e){						//Metodo gestore dell'evento di spostamento da un Frame all'altro
			e.preventDefault();
			var id = $(this).attr("rel");
			var f = settings.frms[id];
			that.animate({
				"left" : "-"+f[0],
				"top" : "-"+f[1]
			},"slow");
		});
		
		$(window).on("resize", function(){							//Metodo gestore della Modale durante un resize della finestra
			if($("#modal p").length < 1){
				var html = '<i class="closeModal ico">x</i><p>Ridimensionando la pagina alteri le impostazioni di Space. Per evitare calcoli inutili al Browser ridimensiona la pagina e poi ricaricala.</p>'
				$("#modal").html(html);
			}
			
			$("#modal").fadeIn();
			$("#overlay").show();
			
			$(".closeModal").on("click", function(){
				$("#modal").fadeOut(function(){
					$(this).remove();
					$("#overlay").fadeOut("fast");
				});
			});
		});
		
		//costruttore
		setLens();
		getFrame();
		setFrame();
		placeFrame();
		makeSpace();
		
		//debug
		console.log(settings);
	}
}( jQuery ))
