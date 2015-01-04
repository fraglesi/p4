(function( $, undefined ) {

// Fraglesi.eu was here
// cześć podglądacze ;-)
// AD 2014

var KNFG0 = {

    sections: { scrollOrientation:'vertical' },

    appSecWrapper: { height: '100%' },
    appHeader: { slideDown: true },
    appHeader_minAfter: 100,

    stellarInit: { },
    cookies: { display: 'yes'},
    onePageScroll: { keyboard: false  },
    velocity: { trigger: 99999} ,
    onePageScrollAnimationTime: 1000,
    goup: { display: 'yes'},
    ekranKontrolny: true,

    overlay: { transitionOn:   { x:'0px', opacity: 1 , visibility: 'visible'},
               transitionOff:  { x:'100%',opacity: 0 , visibility: 'hidden'},
               transitionOff2: { x:'-200%'}, 

               velocityOn:   { opacity:1, translateX: "0px" },
               velocityOff:  { translateX: "-200%", opacity:0},
               velocityOff2: { translateX: "-200%"},
               velocityScrollPrev:  { translateX: "100%" },
               velocityScrollNext:  { translateX: "-100%" },
               velocityScrollMain:  { translateX: "0%" },

               velocityAppWrapperOn:   { translateX: "100%" },
               velocityAppWrapperOff:  { translateX: "" }
             },

    mainOverlay: { mode: 0 },

    tinymce: { selector: "textarea.tinymce",
               theme: "modern",
               width: 600,
               height: 300,
               plugins: ["advlist autolink link image lists charmap print preview hr anchor pagebreak spellchecker",
                         "searchreplace wordcount visualblocks visualchars code fullscreen insertdatetime media nonbreaking",
                         "save table contextmenu directionality emoticons template paste textcolor"
                        ],
               content_css: "css/content.css",
               toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | l      ink image | print preview media fullpage | forecolor backcolor emoticons" 

             },
    toAppend_mainOverlay: '<div id="mainOverlay" class="mainOverlay"><a href="#" class="close"></a>  <div class="mainOverlayNav"><div class="arrow-navigation left"><div id="prevPageArrow" class="arrow arrowAnim"></div></div><div class="arrow-navigation right"><div id="nextPageArrow" class="arrow arrowAnim"></div></div></div><div id="mainOverlayContent" class="content"> <div id="mainOverlayContentPrev" class="content"></div><div id="mainOverlayContentMain" class="content"><div style="height:1000px"></div></div><div id="mainOverlayContentNext" class="content"></div></div> </div><div class="mainOverlay_modal"></div>',
    toAppend_nav: '<div id="nav-toggle" class="nav-toggle"><div class="nav-toggle-icon"><a href="#" class="btn-nav-toggle"></a></div></div>'
    };

  var KNFG = $.extend({}, KNFG0,KNFG2);

  var SEMAPHORES = { appReset : false };

// ##################################################################################################################
// ### AppMenu ######################################################################################################
// ##################################################################################################################

var AppMenu = function (id) {
  this.id=id;
  this.$el= $('.appMenu');
  //$('.appMenu')

  return this; 
}

 AppMenu.prototype.reset = function() {

    function hereIam(link){

        var alvo = $(link).children('a').attr("href");

	if ( alvo.match(/^[\*\?\!\@]/)) { return true }

        var alvo = alvo.replace(/^\/+#/,"");

	var alvo = alvo.replace(/\//g,"");

        var positionLeft = $(window).scrollLeft();
        var positionTop  = $(window).scrollTop();

        var appHeaderHeight = $('.appHeader').height();
        if ( KNFG.appHeader.slideDown || KNFG.sections.scrollOrientation=='vertical' ) { appHeaderHeight=0 }
        var wrapperHeight = $(window).height() - appHeaderHeight;

        var alvoJQ=$('#'+alvo);
  
        if (alvoJQ.length == 0) { return true };

        var alvoPosLeft = alvoJQ.offset().left;
        var alvoPosTop  = alvoJQ.offset().top;
 
        if ( (KNFG.sections.scrollOrientation=='horizontal' && (positionLeft <= alvoPosLeft)) || 
             (KNFG.sections.scrollOrientation=='vertical'   && (positionTop <= alvoPosTop + wrapperHeight/2 )) ) {

            var $activeSection=$('section.active');
             
            var id1=$activeSection.attr('id');
            var id2=alvoJQ.attr('id');        
        
            if ($activeSection.attr('id') != alvoJQ.attr('id')) {  
               $activeSection.removeClass('active').trigger('activeOff');
          
            }

            $(link).addClass("active");

            if (!alvoJQ.hasClass("active") || SEMAPHORES.appReset ) {
                alvoJQ.addClass("active").trigger('activeOn');
            };
           
            return false;
        } else {
            return true;
        }
    }

    function hereIam2(link){

        var alvo = '#' + $(link).attr('id');
        var alvo = alvo.replace(/^#subnav_/,"#");

        var positionLeft = $(window).scrollLeft();
        var positionTop  = $(window).scrollTop();

        var appHeaderHeight = $('.appHeader').height();
        if ( KNFG.appHeader.slideDown || KNFG.sections.scrollOrientation=='vertical' ) { appHeaderHeight=0 }
        var wrapperHeight = $(window).height() - appHeaderHeight;

        var alvoJQ=$(alvo);
  
        if (alvoJQ.length == 0) { return true };
  
        var alvoPosLeft = alvoJQ.offset().left;
        var alvoPosTop  = alvoJQ.offset().top;
 
        if ( (KNFG.sections.scrollOrientation=='horizontal' && (positionLeft <= alvoPosLeft )) || 
             (KNFG.sections.scrollOrientation=='vertical'   && (positionTop  >= (alvoPosTop - wrapperHeight/2) ) && (positionTop  < (alvoPosTop + wrapperHeight/2)) ) ) {
           $(link).addClass("active");
          return false;
        } else {
          return true;
        }
    }

        $('#nav li').removeClass('active').each(function() { return hereIam(this); })

        $('#subnav').fadeIn();
        $('#subnav ul').removeClass('active').each(function() { return hereIam2(this); });

        // reset animacji ?
        //$('.animatedOnScroll').removeClass('animatedOnScroll');  


    // centrowanie menu na razie wyłączone
    //this.$el.position({
    //     my: "center",
    //     at: "center",
    //     of: "#header"
    //});

 }; 

// ##################################################################################################################
// ### AppOverlay ###################################################################################################
// ##################################################################################################################

var AppOverlay = function (id) {
  this.id=id;
  this.$el= $('.appMenu');

  return this; 
}


AppOverlay.prototype.init=function() {

        this.build(); 
        this.eventsInit();    
};

AppOverlay.prototype.build = function() { 
    var _self = this;      

    $('body').append( KNFG.toAppend_mainOverlay ); 

    _self.$overlay             = $('#mainOverlay');
    _self.$overlayMd           = $('.mainOverlay_modal');

    _self.$overlay.$content     = $('#mainOverlayContent');
    _self.$overlay.$contentMain = $('#mainOverlayContentMain');
    _self.$overlay.$contentPrev = $('#mainOverlayContentPrev');
    _self.$overlay.$contentNext = $('#mainOverlayContentNext');

    _self.$overlay.$nav        = $('div.mainOverlayNav');
    _self.$overlay.$nav.$prev  = $('#prevPageArrow');
    _self.$overlay.$nav.$next  = $('#nextPageArrow');
    _self.$overlay.$nav.$close = $('#mainOverlay a.close');
    _self.$overlay.velocity(KNFG.overlay.velocityOff);
}

AppOverlay.prototype.reset = function() {
    var _self = this;      

    var $page=_self.$overlay.$contentMain.find('#page');
    var scrollBarsMode = $page.hasClass('noScrollBars'); 

    var prevPage = $page.data('prevpage');
    var nextPage = $page.data('nextpage');

    if ( prevPage ) { 
       _self.$overlay.$nav.$prev.attr('data-page', prevPage); 
       _self.$overlay.$nav.$prev.css({visibility: 'visible'}); 
    } else {
       _self.$overlay.$nav.$prev.attr('data-page', ''); 
       _self.$overlay.$nav.$prev.css({visibility: 'invisible'}); 
    }

    if ( nextPage ) {
       _self.$overlay.$nav.$next.attr('data-page', nextPage); 
       _self.$overlay.$nav.$next.css({visibility: 'visible'}); 
    } else {
       _self.$overlay.$nav.$next.attr('data-page', ''); 
       _self.$overlay.$nav.$next.css({visibility: 'invisible'}); 
    }


    $('body').addClass('overlay-show'); 

    _self.$overlay.mCustomScrollbar("destroy");
    _self.$overlayMd.addClass('overlay-show').velocity({opacity:1});
    _self.$overlayMd.css({visibility: 'visible'}).velocity({opacity:1},{display: "block"});
    _self.$overlay.addClass('overlay-show').velocity(KNFG.overlay.velocityOn);

    if (!scrollBarsMode) {
       _self.$overlay.mCustomScrollbar({ scrollButtons:{enable:true},theme:"dark-thick"});
       setTimeout(function() {   
          _self.$overlay.mCustomScrollbar("update");
       }, 500);
    };

};

AppOverlay.prototype.close = function () {
    var _self = this;      

    var overlayMode = $('body').hasClass('overlay-show2'); 

    $('body').removeClass('overlay-show').removeClass('overlay-show2'); 

             if (overlayMode) {  
                _self.$main.velocity(KNFG.overlay.velocityAppWrapperOff); //.css({transform : none});
              } else {
                _self.$overlay.removeClass('overlay-show').velocity(KNFG.overlay.velocityOff,{
                         complete: function() {  
                            // do dupy ten complete...
                            setTimeout(function() {
                                       _self.$overlay.$contentPrev.html('').attr('style','');
                                       _self.$overlay.$contentMain.html('').attr('style','');
                                       _self.$overlay.$contentNext.html('').attr('style','');
                            }, 500); 
                         }

                     });
                _self.$overlayMd.velocity({opacity:0},{display: "none"}); //.removeClass('overlay-show')
              }

             _self.$overlay.mCustomScrollbar("destroy");

             _self.$overlay.$nav.$prev.css({visibility: 'hidden'});
             _self.$overlay.$nav.$next.css({visibility: 'hidden'});
             _self.$overlay.$nav.$prev.attr('data-page', ''); 
             _self.$overlay.$nav.$next.attr('data-page', ''); 

}

AppOverlay.prototype.eventsInit = function() {
    var _self = this;      

     _self.$overlay.$nav.$prev.click(function(event) {
            var href=_self.$overlay.$nav.$prev.data('page');
           _self.load(href,'prev');     
           //_self.scroll('prev'); 
     });

     _self.$overlay.$nav.$next.click(function(event) {
            var href=_self.$overlay.$nav.$next.data('page');
           _self.load(href,'next');     
           //_self.scroll('next'); 
     });

     _self.$overlay.$nav.$close.click(function(event) {
         
         _self.close();   
         event.preventDefault();
  
     });

     // swipe

     _self.$overlay.swipe( {

            swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
              switch(direction) {
                 case 'right':
                       var href=_self.$overlay.$nav.$prev.attr('data-page');
                       if (href) {
                          _self.load(href,'prev')}
                       else {      
                          _self.close();}   
                       break;
                 case 'left':
                       var href=_self.$overlay.$nav.$next.attr('data-page');
                       if (href) {
                          _self.load(href,'next')}
                       else {      
                          _self.close();}   
                       break;

                 default: return;
              }


             event.preventDefault();
           },
           //Default is 75px, set to 0 for demo so any distance triggers swipe
           threshold:0
        });

};

AppOverlay.prototype.load = function(href,into) {
    var _self = this;      
    var content;

    switch(into) {
        case 'prev': content = _self.$overlay.$contentPrev; break;
        case 'next': content = _self.$overlay.$contentNext; break;
        case 'main': content = _self.$overlay.$contentMain; break;

        default: return;
    }

    var toLoad = 'pageGet.cgi'+'?pg='+href+' #page';
    content.load(toLoad, function (responseText, textStatus, XMLHttpRequest) {
           if (textStatus == "success") {
              switch(into) {
                case 'prev': _self.$overlay.$contentPrev.css({'z-index':'1'}).transition({ x : '100%' },1000,'ease',  
                                  function() {
                                     _self.$overlay.$contentMain.html( _self.$overlay.$contentPrev.html() ).css({transform : 'none'});
                                     _self.$overlay.$contentPrev.html('').attr('style','');
                                     _self.reset();
                                   }
                              );  
                              break;
                case 'next': _self.$overlay.$contentNext.css({'z-index':'1'}).transition({ x : '-100%' },1000,'ease',  
                                  function() {
                                     _self.$overlay.$contentMain.html( _self.$overlay.$contentNext.html() ).css({transform : 'none'});
                                     _self.$overlay.$contentNext.html('').attr('style','');
                                     _self.reset();
                                   }
                              );   
                              break;

                case 'main':  _self.$overlay.velocity(KNFG.overlay.velocityOn); _self.reset(); break;
                default: return;
              }

           }
           if (textStatus == "error") {
                 alertify.alert("poszedłem w krzaki :-(");        
           }
     });

};


// ##################################################################################################################
// ### App ##########################################################################################################
// ##################################################################################################################


var App = function(){
  
  this.appMenu = new AppMenu(); 
  this.appOverlay = new AppOverlay();  

  return this; 
};


 App.prototype.init=function() {
   var _self = this;      
   var  lastAnimation = 0,quietPeriod = 500;

        console.log(this + ' init start ');
      
        _self.build(); 

        _self.ons();
        _self.eventsInit(1);    
          
        _self.appMenu.reset();
        _self.appOverlay.init();

        _self.reset(); 

        if (KNFG.cookies.display != 'none') { this.cookiesInfo(); } 

        Placeholdem( document.querySelectorAll( '[placeholder]' ) );
        console.log('app init done');

 };

 App.prototype.build=function() {
    var _self = this;      


        KNFG.admin=$('body').hasClass('admin');

        _self.$main           = $('#main');
        _self.$appHeader      = $('#header'); 
        _self.$appMenu        = $('.appMenu'); 

        _self.$appWrapper     = $('.appWrapper'); 
        _self.$appSecWrapper  = $('.appSecWrapper'); 
        _self.$appSections    = $('section'); 

        _self.$ekranKontrolny = $('#ekranKontrolny');

        _self.$appHeader.append( KNFG.toAppend_nav );     
        _self.$appNav         = $('nav#nav.appNav'); 

      
 };

 App.prototype.ons=function(){ 
    var _self = this;      

    $(this).on('appReset', function(event) {
        SEMAPHORES.appReset=true;   
        _self.reset();        
        SEMAPHORES.appReset=false;   
    });

 };

 App.prototype.onScroll=function(){ 
    var _self = this;      

 
        if(($(window).scrollTop()) > KNFG.appHeader_minAfter){
            _self.$appHeader.addClass('minimized');
            //$('#gototop').css({ opacity : 1 });
        } else {
            _self.$appHeader.removeClass('minimized');
            //$('#gototop').css({ opacity : 0 });
        }

	$('.animatedOnScroll').each(function(){
	    var elemPos     = $(this).offset().top;
	    var elemTrigger = $(this).data('animationtrigger');
	    var elemAddClass= $(this).data('animationclass');

            $(this).espy(function (entered, state) {
                if (entered) {
                  // element entered the viewport
                  // state === 'inside'

            	  $(this).addClass(elemAddClass);

                } else {
 
            	  $(this).removeClass(elemAddClass);

                  // element left the viewport
                  if (state === 'up') {
                     // element is now above the trigger area
                  } else if (state === 'down') {
                     // element is now below the trigger area
                  }
                }
            }); 

//                	var topOfWindow = $(window).scrollTop();
//			if (elemPos < topOfWindow+elemTrigger) {
//                 	   $(this).addClass(elemAddClass);
//			}

	});

//

//        var fixmeTop = $('.fixMeOnTop').offset().top;
//        var currentScroll = $(window).scrollTop();

        var $nav_bar = $('.fixMeOnTop');

	var window_height,scroll_top;
	    window_height = $(window).height();
	    scroll_top = $(window).scrollTop();

	if((window_height - $nav_bar.height()) <= scroll_top){

            $nav_bar.addClass('fixed'); //css({ position: 'fixed', top: '10px', left: '0' });
        } else {
            $nav_bar.removeClass('fixed'); //css({ position: 'absolute' });
        }


    this.reset(); 
 };

 App.prototype.scrollToSection=function(section) {
    var _self = this;      

    var offset = section.offset();
    var roznica = Math.abs(offset.top - $(window).scrollTop());
    var ilePieter = Math.floor( roznica / _self.$appSecWrapper.height() ); 

    if (typeof offset === 'undefined') { return false }
    var hash    = '#' + section.attr('id');

    if (KNFG.sections.scrollOrientation=='horizontal') { 

        alertify.alert("scrollToSection dla horizontal nie zaimplementowana:-(");        

        //$('html, body').stop().animate({ scrollLeft: offset.left }, 1500, 'easeInOutExpo', 
        //            function() { 
        //               window.location.hash = hash; 
        //               ref.reset(); 
        //            });
    } else { 
         
        if (ilePieter <= KNFG.velocity.trigger ) {

           section.velocity("scroll",{ duration: 1000,
                                       complete: function() { 
                                                   window.location.hash = hash; 
                                                   _self.reset();

                                                }
                           });

        } else {
         
           _self.$ekranKontrolny.fadeIn(500, function () {
              window.location.hash = hash; 
              _self.reset();
              _self.$ekranKontrolny.fadeOut(1000);  

            });
        } 
   };         
 };

 App.prototype.scrollTo=function(direction) {
      var ref = this;      

      var hash = window.location.hash;
      if (hash.length == 0) { hash='#start' };
      var $section=$(hash);

      var $next=$section.next('section');
      var $prev=$section.prev('section');
 
      switch(direction) {
            case 'prev':  ref.scrollToSection($prev);  break;
            case 'next':  ref.scrollToSection($next);  break;
            default: return;
     }
 }

 App.prototype.reset = function() {
    var _self = this;      

        //if (KNFG.appHeader.slideDown) { 
        //   _self.$appMenu.animate({ opacity:0,top:'-90px'},1000);
        //   $('.appHeaderBg').animate({ opacity:0,top:'-90px'},1000);
        //};

        $('a.btn-show-overlay').parent('li').removeClass('selected'); 

        //_self.$appSections.removeClass('active'); 
        _self.appMenu.reset();

        try {
          cbpHorizontalMenu.close();
        } catch(e){  } 
         

        // hmmmmm ech życie życie
//        _self.$appWrapper     = $('.appWrapper'); 
//        _self.$appSecWrapper  = $('.appSecWrapper'); 
        // hmmmm


        _self.setAppWrapperWidth();
        _self.setAppSecWrapperHeight();
// TUTAJ??
        $('body').trigger('appReset');

        $('.mCustomScrollbarOn').mCustomScrollbar({ scrollButtons:{enable:true},theme:"dark-thick"});
        setTimeout(function() {   
          $('.mCustomScrollbarOn').mCustomScrollbar("update");
        }, 500);



    };

 App.prototype.setAppWrapperWidth=function(){

        var wrapperWidth = $(window).width();
        var wrapperHeight= $(window).height();

        this.$appWrapper.width(wrapperWidth);
 };

 App.prototype.setAppSecWrapperHeight=function(){
        var _self = this;      

        // na hu..steczkę ponowne przypisanie ? 
        _self.$appSecWrapper=$('.appSecWrapper');
        //
       
        if ( KNFG.appSecWrapper.height == '100%' || _self.$appSecWrapper.hasClass('setAppSecWrapperHeight') ) {

           var appHeaderHeight = $('.appHeader').height();
           if ( KNFG.appHeader.slideDown || KNFG.sections.scrollOrientation=='vertical' ) { appHeaderHeight=0 }

           var wrapperHeight = $(window).height() - appHeaderHeight;

           _self.$appSecWrapper.height(wrapperHeight);

         //  $('.appSecWrapper').height(wrapperHeight);

           // Na chama, a co, jak się nie da to młotkiem
           $(".bxslider-item").height(wrapperHeight);
        };
 };

 App.prototype.getAppWrapper = function ( href ) {
    var _self = this;      
    var content;

    var into = 'main';

    switch(into) {
        case 'prev': content = _self.$overlay.$contentPrev; break;
        case 'next': content = _self.$overlay.$contentNext; break;
        case 'main': content = _self.$main; break;

        default: return;
    }

    _self.$ekranKontrolny.fadeIn(500, function () {
         
  

    var toLoad = '/appWrapperGet.cgi'+'?maska='+href+' .appWrapper';

    content.load(toLoad, function (responseText, textStatus, XMLHttpRequest) {
           if (textStatus == "success") {
              switch(into) {
                case 'prev': _self.$overlay.$contentPrev.css({'z-index':'1'}).transition({ x : '100%' },1000,'ease',  
                                  function() {
                                     _self.$overlay.$contentMain.html( _self.$overlay.$contentPrev.html() ).css({transform : 'none'});
                                     _self.$overlay.$contentPrev.html('').attr('style','');
                                     _self.reset();
                                   }
                              );  
                              break;
                case 'next': _self.$overlay.$contentNext.css({'z-index':'1'}).transition({ x : '-100%' },1000,'ease',  
                                  function() {
                                     _self.$overlay.$contentMain.html( _self.$overlay.$contentNext.html() ).css({transform : 'none'});
                                     _self.$overlay.$contentNext.html('').attr('style','');
                                     _self.reset();
                                   }
                              );   
                              break;

                case 'main':  /* _self.$overlay.velocity(KNFG.overlay.velocityOn); */  

                        
                               // przypisane od nowa bo nastąpiła wymiana
                               _self.$appWrapper     = $('.appWrapper'); 
                               _self.$appSecWrapper  = $('.appSecWrapper'); 
                               _self.$appSections    = $('section'); 


                               _self.reset(); 

                               //_self.init();

                               _self.eventsInit(0);    

                               window.scrollTo(0,0);

                               _self.$ekranKontrolny.fadeOut(1000);  

                               break;
                default: return;
              }

           }
           if (textStatus == "error") {
                 alertify.alert("poszedłem w krzaki :-(");        
           }
     });

 //    _self.$ekranKontrolny.fadeOut(1000);  
   });

 };

 App.prototype.eventsInit = function(level) {
    var ref = this;      
    var _self = this;      
       
    if (level>0) {    
        console.log('p3: eventsInit');

        $(window).scroll(function(event) {
            _self.onScroll();
        });

        $(window).bind('resize', function() {   
            _self.setAppWrapperWidth();
            _self.setAppSecWrapperHeight();
            return true;
        });

        if (KNFG.ekranKontrolny) {
           $(window).bind('load', function(){
  	       $('#ekranKontrolny').fadeOut(1500, function(){ 
                  $('body').show();
 	       });
           });
        };

        // nav

        _self.$appNav.find('a').each( function () {

          $ala=this;
          $(this).addClass('cmd-nav-off');  

      //    $(this).click(function(event) {
      //        $('body').toggleClass('nav-is-toggled'); 
      //   });

         });  

        $('a.btn-nav-toggle').click(function(event) {

           $('body').toggleClass('nav-is-toggled'); 
           event.preventDefault();
        });

       //

    // scroll od sekcji do sekcji po naciśnięciu strzałki góra lub dół

    if(KNFG.onePageScroll.keyboard == true) {
      $(document).keydown(function(e) {
          var tag = e.target.tagName.toLowerCase();
 
          switch(e.which) {
            case 38:
              if (tag != 'input' && tag != 'textarea') _self.scrollTo('prev');
            break;
            case 40:
              if (tag != 'input' && tag != 'textarea') _self.scrollTo('next');
            break;
            default: return;
          }
                
      });
    };

   // scroll od sekcji do sekcji poprzez kręcenie kołkiem myszy

    if(KNFG.onePageScroll.mousewheel && !KNFG.admin) {
       $(document).bind('mousewheel DOMMouseScroll', function(event) {
           event.preventDefault();
           var delta = event.originalEvent.wheelDelta || -event.originalEvent.detail;
           _self.init_scroll(event, delta);
       });
    };

  } // level >0

    // Przesuwanie sekcji i overleje

     _self.$appSections.each(function() {
        var $section = $(this);
        var hash  = '/#' + this.id;
        var hash2 = '#' + this.id;
          
        // linki z ustawioną sekcją jako hasz

        $('a[href="' + hash + '"]').click(function(event) {

            if ($(this).hasClass('cmd-nav-off')) {
              $('body').removeClass('nav-is-toggled');              
            };

            _self.scrollToSection($section);
            event.preventDefault();
        });

        // butonolinki (fajna nazwa?) wyklikające do następnej sekcji

        $section.find('a.btn-section').each( function () {
          $(this).click(function(event) {
             if ($(this).hasClass('next')) { 
                $next=$section.next('section');
             } else {
                $next=$section.prev('section');
             }
             _self.scrollToSection($next);
             event.preventDefault();
          });
        });
       
        // swipe

        $section.swipe( {
          //Generic swipe handler for all directions
            swipe:function(event, direction, distance, duration, fingerCount, fingerData) {
              //alertify.alert("You swiped " + direction );        

              switch(direction) {
                 case 'down':
                       $next=$section.prev('section');
                       break;
                 case 'up':
                       $next=$section.next('section');
                       break;
                 default: return;
              }

             _self.scrollToSection($next);
             event.preventDefault();
           },
           //Default is 75px, set to 0 for demo so any distance triggers swipe
           threshold:0
        });
    
    });  // sections.each



    // Strony edytowalne ładowane w mainOverlay - linkowane przez "!treedict"

       $('a[href^="\\!"]').each( function () {
          $(this).off('click').on('click',function(event) {
             var href=$(this).attr('href').substring(1); 
             _self.appOverlay.load(href,'main');
             event.preventDefault();
          });
        });

       $('a[href^="\\?"]').each( function () {
          $(this).off('click').on('click',function(event) {
             var href=$(this).attr('href').substring(1); 
              $('body').removeClass('nav-is-toggled');              
             _self.getAppWrapper(href);
             event.preventDefault();
          });
        });


 /* ##############################################################################################################
    ############ PONIŻEJ STAROCIE ################################################################################
    ############################################################################################################## */
    
    // pokazywanie i chowanie owerleji ( cokolwiek to znaczy )    
    // stare ale musi pozostać ( vide Littwin )

        $('a.btn-show-overlay').each( function () {
          $(this).click(function(event) {

             $('div.overlay-show').transition({ y: '200%', opacity: 0, visibility: 'hidden' },1500,'ease').transition({y:'-200%'}).removeClass('overlay-show');

             $('a.btn-show-overlay').parent('li').removeClass('selected'); 

             var href=$(this).attr('href');
             $overlay=$('div'+href+'.overlay');

             // ========= eksperyment =============================

	     // var toLoad = '/page.cgi?treeDict='+href+' #overlay';

             //$overlay.load(toLoad,'');

             // ===================================================


            $overlay.addClass('overlay-show');
            $overlay.transition({ y: '0px', opacity: 1 , visibility: 'visible'},1500,'easeInOutBack');


             $(this).parent('li').addClass('selected');
             event.preventDefault();
          }); 
        });       

        $('a.btn-hide-overlay').each( function () {
          $(this).click(function(event) {
             $('a.btn-show-overlay').parent('li').removeClass('selected'); 
             $overlay=$('div.overlay');

             $overlay.removeClass('overlay-show');
             $overlay.transition({ y: '100%', opacity: 0, visibility: 'hidden' },1500,'ease').transition({y:'-200%'});

             event.preventDefault();
          });
        });       


        $('a.btn-next-overlay').each( function () {
         
          $(this).click(function(event) {

//           $('div.overlay-show').removeClass('overlay-show'); 
             $('div.overlay-show').transition({ y: '200%', opacity: 0, visibility: 'hidden' },1500,'ease').transition({y:'-200%'}).removeClass('overlay-show');

             $('a.btn-show-overlay').parent('li').removeClass('selected'); 
   
             var $overlay=$(this).parents('div.overlay').next('div.overlay');

             // ========= eksperyment =============================

	     // var toLoad = '/page.cgi?treeDict='+href+' #overlay';

             //$overlay.load(toLoad,'');

             // ===================================================
           
             $overlay.addClass('overlay-show');
             $overlay.transition({ y: '0px', opacity: 1 , visibility: 'visible'},1500,'ease');

             var hash ='#' + $overlay.attr('id');  
             $('a[href="' + hash + '"].btn-show-overlay').parent('li').addClass('selected');
             
             event.preventDefault();
          });

        });       

        $('a.btn-prev-overlay').each( function () {
         
          $(this).click(function(event) {

//           $('div.overlay-show').removeClass('overlay-show'); 
             $('div.overlay-show').transition({ y: '200%', opacity: 0, visibility: 'hidden' },1500,'ease').transition({y:'-200%'}).removeClass('overlay-show');

             $('a.btn-show-overlay').parent('li').removeClass('selected'); 
   
             var $overlay=$(this).parents('div.overlay').prev('div.overlay');

             // ========= eksperyment =============================

	     // var toLoad = '/page.cgi?treeDict='+href+' #overlay';

             //$overlay.load(toLoad,'');

             // ===================================================
           
             $overlay.addClass('overlay-show');
             $overlay.transition({ y: '0px', opacity: 1, visibility: 'visible' },1500,'ease');

             var hash ='#' + $overlay.attr('id');  
             $('a[href="' + hash + '"].btn-show-overlay').parent('li').addClass('selected');
             
             event.preventDefault();
          });

        });       


 // to poniżej do przeróbki albo do śmieci
 /*
       $('a[href^="\\@"]').each( function () {
          $(this).click(function(event) {

                var $content = _self.$overlay.find('#mainOverlayContent');               
                var href=$(this).attr('href').substring(1); 
                var toLoad = 'pageGet.cgi'+'?pg='+href+' #page';

                $content.load(toLoad, function (responseText, textStatus, XMLHttpRequest) {
                     if (textStatus == "success") {

                         $('body').addClass('overlay-show2'); 

                         _self.$overlay.mCustomScrollbar("destroy");

                         _self.$overlay.css({'z-index':'1'}).addClass('overlay-show').velocity(KNFG.overlay.velocityOn);
                         _self.$main.velocity(KNFG.overlay.velocityAppWrapperOn);

                         _self.$overlay.mCustomScrollbar({ scrollButtons:{enable:true},theme:"dark-thick"});
                         setTimeout(function() {
                             //   _self.$overlay.mCustomScrollbar({horizontalScroll:true,scrollButtons:{enable:true},theme:"dark-thick"});
                                _self.$overlay.mCustomScrollbar("update");

                         }, 500);

                     }
                     if (textStatus == "error") {
                         alertify.alert("poszedłem w krzaki :-(");        
                     }
                });

             event.preventDefault();
          });
        });       
*/
 
 // Pokazywanie i chowanie menu
 // do śmieci?
 /*
    if ( KNFG.appHeader.slideDown ) { 
       $('.appHeader').bind('mouseover mouseout', function(event) {
          event.stopPropagation();
          if(event.type == 'mouseover'){
            $('.appHeaderBg').stop().animate({ opacity:1,top:'0px'},1000);
            $('.appMenu').stop().animate({ opacity:1,top:'0px'},1000);
          }
          else {
            $('.appMenu').stop().animate({ opacity:0,top:'-90px'},1000);
            $('.appHeaderBg').stop().animate({ opacity:0,top:'-90px'},1000);
          }
       });
    };
*/

// Pokazywanie i chowanie lead4  

        $('a.lead5-overlay-show').each( function () {
         
          $(this).click(function(event) {

             var $overlay=$(this).parent().find('div.overlay');

             if ($overlay.hasClass('overlay-show')) {           
                $('div.overlay').removeClass('overlay-show');    
             } else {
                $('div.overlay').removeClass('overlay-show');
                 $overlay.addClass('overlay-show');
             };
             
             event.preventDefault();
          });

        });       

  

}; // eventsInit


 App.prototype.init_scroll = function(event, delta) {
    var ref = this;      
        deltaOfInterest = delta;
        var timeNow = new Date().getTime();
        // Cancel scroll if currently animating or within quiet period
        if ( timeNow - ref.lastAnimation < ref.quietPeriod + KNFG.onePageScrollAnimationTime ) {
            event.preventDefault();
            return;
        }

        if (deltaOfInterest < 0) {
          ref.scrollTo('next')
        } else {
          ref.scrollTo('prev')
        }
        ref.lastAnimation = timeNow;
 }


 App.prototype.cookiesInfo = function(){

         $('body').append('<div class="cookiesInfo" ><p>Ta strona używa ciasteczek (cookies). <a href="http://wszystkoociasteczkach.pl" target="_blank">Dowiedz się więcej</a><br>Korzystając ze strony wyrażasz zgodę na ich używanie.</p><a href="#" class="zamknij">ok</a></div>');

         $('.cookiesInfo .zamknij').bind('click',function(event) { 
	   $('.cookiesInfo').fadeOut(); 
	   if (this=='.zamknij') { event.preventDefault();}
	 }); 

         var cookiePolityka = $.cookie("cookiePolityka");
       
         if (cookiePolityka != 'FraglesiWasHere') {
       
            $('.cookiesInfo').fadeIn();
        
            $.cookie("cookiePolityka",'FraglesiWasHere', { expires : 99999, path : '/' });        
       
         };

 };

 App.prototype.plugins = {

     _suport3D: function(){
	
        // na razie nie używane ale może kiedyś się przyda
	//$.support.css3d = supportsCSS3D();   

	function supportsCSS3D() {
		var props = ['perspectiveProperty', 'WebkitPerspective', 'MozPerspective'], testDom = document.createElement('a');
		for(var i=0; i<props.length; i++){
			if(props[i] in testDom.style){
				return true;
			}
		} 
		return false;
	}
     },
    _tinyMCE: function () {
        tinymce.init( KNFG.tinymce );
     },
    _goup: function () {

            if (0) {
            if (KNFG.goup.display != 'none')  {
                  $('body').append("<div id='goup'></div>");
                  $('#goup').goup(KNFG.goup);
               };
            }
     },
    _parallax: function (){  
           if (typeof( KNFG.stellarInit ) === 'object') {
              $.stellar( KNFG.stellarInit)
           }
           else {
              $.stellar()}
    },
    _scrollorama: function (){
            scrollorama = $.scrollorama({ blocks:'.scrollblock' });
    },
    _lightbox: function (){
             $('.lightbox').lightbox();
    },
    _venobox: function (){
	$('.venobox').venobox(); 
    },
    _prettyPhoto: function (){

	    $("a[rel^='prettyPhoto']").prettyPhoto({ overlay_gallery:false,
                                                    theme:'light_square',
                                                    slideshow: false, 
                                                    autoplay_slideshow:false,
					            social_tools:'' 
                                               });
    },
    _datepicker_pl: function () {

                      /* Polish initialisation for the jQuery UI date picker plugin. */
                      /* Written by Jacek Wysocki (jacek.wysocki@gmail.com). */

             $.datepicker.regional['pl'] = {

                closeText: 'Zamknij',
                prevText: '&#x3c;Poprzedni',
                nextText: 'Następny&#x3e;',
                currentText: 'Dziś',
                monthNames: ['Styczeń','Luty','Marzec','Kwiecień','Maj','Czerwiec',
                'Lipiec','Sierpień','Wrzesień','Październik','Listopad','Grudzień'],
                monthNamesShort: ['Sty','Lu','Mar','Kw','Maj','Cze',
                'Lip','Sie','Wrz','Pa','Lis','Gru'],
                dayNames: ['Niedziela','Poniedziałek','Wtorek','Środa','Czwartek','Piątek','Sobota'],
                dayNamesShort: ['Nie','Pn','Wt','Śr','Czw','Pt','So'],
                dayNamesMin: ['N','Pn','Wt','Śr','Cz','Pt','So'],
                weekHeader: 'Tydz',
                dateFormat: 'yy-mm-dd',
                firstDay: 1,
                isRTL: false,
                showMonthAfterYear: false,
                yearSuffix: '',
                onClose: function () { $( this ).removeClass( 'placeholder' ); }

            };

            $.datepicker.setDefaults($.datepicker.regional['pl']);
       },
    _bLazy: function (){
        $.bLazy = new Blazy();	 
    },
    _cbpHorizontalMenu: function (){
        cbpHorizontalMenu.init();
    }
   
 };

 App.prototype.pluginsInit = function () {

    for (var plugin in this.plugins) {
       try {
          this.plugins[plugin]();
        } catch(e){  } 
    }  

 };



// #################################################################################################################################
// #################################################################################################################################
// #################################################################################################################################
// #################################################################################################################################


var myApp=window.App=new App();
  
var isMobile = false;

if( navigator.userAgent.match(/Android/i) || 
	navigator.userAgent.match(/webOS/i) ||
	navigator.userAgent.match(/iPhone/i) || 
	navigator.userAgent.match(/iPad/i)|| 
	navigator.userAgent.match(/iPod/i) || 
	navigator.userAgent.match(/BlackBerry/i)){			
	isMobile = true;          
}  
/*iOS5 fixed-menu fix*/
var iOS5 = false;   
if (navigator.userAgent.match(/OS 5(_\d)+ like Mac OS X/i)){
	iOS5 = true;    
}

// ################################################################################################################################	

$(document).ready(function(){

	if(isMobile == true){ 
                $('body').addClass('mobile'); 
	}else{ 
		$('body').addClass('desktop');
	};

        myApp.init();
        myApp.pluginsInit();
        $.myApp=myApp;

        console.log('init done');
        
});


})( jQuery );





