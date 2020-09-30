/*!
* NIGHTLY.JS
*
* Main scripts file. Contains theme functionals.
*
* Version 2.0
* Since 2.0
*/

/*
-----------------------------------------------------------------------------------------------------------*/

$(document).ready(function($) {

    "use strict";

		jQuery.mobile.ajaxEnabled = false;
		jQuery.event.special.swipe.durationThreshold = 600;
		jQuery.event.special.swipe.horizontalDistanceThreshold = 80;
    var aSearchClicked = false;

    jQuery(".sub-menu").hide().removeClass("active");
    jQuery(".container").hide();

    if("ontouchstart" in document.documentElement){ // SEZIONE CELLULARI

        jQuery(document).on('tap', '.menu-item-has-children', function(event){
            event.preventDefault();
            var $this = jQuery(this);

            $(".menu-item-has-children").not(this).removeClass("sub-menu-active").children(".sub-menu").removeClass("active").hide(350); // Chiudo eventuali sottomenù aperti

            $this.toggleClass("sub-menu-active");
            $this.children(".sub-menu").toggleClass("active").toggle(350);

            /*if ( $this.hasClass('scroll_bottom') && $this.find('ul').hasClass('active') ){ // scollo il menù laterale per mettere le sotto-voci in primo piano
                setTimeout(function(){
                  var actual_scrollTop = $this.eq(0)[0].scrollHeight;
                  var sub_height = $this.children(".sub-menu").height();
                  //console.log("Actual scroll="+actual_scrollTop+' -- sub_height='+sub_height);
                  $('div[data-role=panel]').stop().animate({
                      scrollTop: actual_scrollTop + sub_height
                  }, 400);
                }, 350); // scrollo a fondo-menù
            }*/
            return false;
        });

        jQuery(document).find(".sub-menu").children("li").on('touchstart touchon', function(event) {
            var to = jQuery(this).children("a").attr("href");
            console.log('Redirect to: '+to);
            if ( to != '' && to != '#' ) window.location.href = to;
        });

        $('#a-sidebar').bind('touchstart touchon', function(event){
            if(aSearchClicked){
                $('#searchform').removeClass('moved');
                aSearchClicked = false;
            }
         });

        $('#a-search').bind('touchstart touchon', function(event){
            if(aSearchClicked){
                $('#searchform').removeClass('moved');
                aSearchClicked = false;
            }else{
                $('#searchform').addClass('moved');
                aSearchClicked = true;
            }
        });

    } else { // SEZIONE BROWSER PC

        jQuery(".menu-item-has-children").bind('click', function(event){
            event.preventDefault();
            var $this = jQuery(this);

            $(".menu-item-has-children").not(this).removeClass("sub-menu-active").children(".sub-menu").removeClass("active").hide(350); // Chiudo eventuali sottomenù aperti

            jQuery(this).toggleClass("sub-menu-active");
            $this.children(".sub-menu").toggleClass("active").toggle(350);
            console.log('toggle pc');

            if ( $this.hasClass('scroll_bottom') && $this.find('ul').hasClass('active') ){ // scollo il menù laterale per mettere le sotto-voci in primo piano
                setTimeout(function(){
                  var actual_scrollTop = $this.eq(0)[0].scrollHeight;
                  var sub_height = $this.children(".sub-menu").height();
                  //console.log("Actual scroll="+actual_scrollTop+' -- sub_height='+sub_height);
                  $('div[data-role=panel]').stop().animate({
                      scrollTop: actual_scrollTop + sub_height
                  }, 400);
                }, 350); // scrollo a fondo-menù
            }
            return false;
        }).children(".sub-menu").children("li").bind('click', function(event) {
            window.location.href = jQuery(this).children("a").attr("href");
        });

        jQuery('#header-menu-icon').bind('click', function(event){
            if(aSearchClicked){
                jQuery('#searchform').removeClass('moved');
                aSearchClicked = false;
            }
         });

        $('#a-search').bind('click', function(event){
            if(aSearchClicked){
                $('#searchform').removeClass('moved');
                aSearchClicked = false;
            }else{
                $('#searchform').addClass('moved');
                aSearchClicked = true;
            }
        });
    }

    /* If you want to disable swipe on cetrtain elements add .disableswipe
    *
    * Example:
    * <div class="disableswipe">This is swipe disabled block</div>
    *
    * @since 1.0
    *
    */

    /*
    jQuery( document ).on( "swipeleft swiperight", '.disableswipe', function ( e ) {
        e.stopPropagation();
        e.preventDefault();
    });

    jQuery( document ).on( "swipeleft swiperight", 'input', function ( e ) {
        e.stopPropagation();
        e.preventDefault();
    });

    jQuery( document ).on( "swipeleft swiperight", '.card', function ( e ) {
        e.stopPropagation();
        e.preventDefault();
        console.log('Swipe card: '+e.type);
        if ( e.type == 'swipeleft' ){
            $('.btn-unlike-encounters').trigger('tap');
        }
        if ( e.type == 'swiperight' ){
            $('.btn-like-encounters').trigger('tap');
        }
    });
    */

    /* Sidebar swipe for opening / closing
    *
    * Default IDs for sidebars:
    *
    * #left-sidebar
    * #right-sidebar
    *
    * @since 1.0
    *
    */

	// Sidebar swipe opening/closing
	/*
  jQuery( document ).on( "swipeleft swiperight", function( e ) {

		if ( $.mobile.activePage.jqmData( "panel" ) !== "open" ) { // if panel isn't already open
	  	if ( e.type === "swipeleft"  ) { // if the swipe is from right to left
	  		jQuery( "#sidebar-right" ).panel( "open" ); // open right sidebar
	  		if(aSearchClicked){
	  		    jQuery('#searchform').removeClass('moved');
	  		    aSearchClicked = false;
	  		}
	    } else if ( e.type === "swiperight" ) { // if the swipe is from left to right
	    	jQuery( "#sidebar" ).panel( "open" ); // open (left) sidebar with ID #sidebar
	    	if(aSearchClicked){
	    	    jQuery('#searchform').removeClass('moved');
	    	    aSearchClicked = false;
	    	}
	  	}

	 	}
	 });
   */

});
