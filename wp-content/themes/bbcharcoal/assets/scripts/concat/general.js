(function (document, window, $) {

	'use strict';

	// Load Foundation
	$(document).foundation();
    
    
    $(window).on('load changed.zf.mediaquery', function(event, newSize, oldSize) {
        
        $( '.nav-primary' ).doubleTapToGo();
        
        if( ! Foundation.MediaQuery.atLeast('xlarge') ) {
          $( '.nav-primary' ).doubleTapToGo( 'destroy' );
        }
        
        // need to reset sticky on resize. Otherwise ti breaks
        if( ! Foundation.MediaQuery.atLeast('xxlarge') ) {
            $(document).foundation();
        }
        
        
                
    });
    
    $('.footer-widgets .vertical.menu  .sub-menu').each( function() {
        $(this).addClass('menu vertical nested');
    });
    
    // Toggle menu
    
    $('li.menu-item-has-children > a').on('click',function(e){
        
        var $toggle = $(this).parent().find('.sub-menu-toggle');
        
        if( $toggle.is(':visible') ) {
            $toggle.trigger('click');
        }
        
        e.preventDefault();

    });
    
    
    
    $(document).on('click', '.play-video', playVideo);
    
    function playVideo() {
                
        var $this = $(this);
        
        var url = $this.data('src');
                
        var $modal = $('#' + $this.data('open'));
        
        /*
        $.ajax(url)
          .done(function(resp){
            $modal.find('.flex-video').html(resp).foundation('open');
        });
        */
        
        var $iframe = $('<iframe>', {
            src: url,
            id:  'video',
            frameborder: 0,
            scrolling: 'no'
            });
        
        $iframe.appendTo('.video-placeholder', $modal );        
        
        
        
    }
    
    // Make sure videos don't play in background
    $(document).on(
      'closed.zf.reveal', '#modal-video', function () {
        $(this).find('.video-placeholder').html('');
      }
    );
    
    
    // Reset Equalizr
    $(document).on('facetwp-loaded', function() {
        new Foundation.Equalizer($('#posts-grid'));
     });
     
     
     
     $('.page-template-team article.type-team .thumbnail')
     .mouseover(function() {
        if( $(this).data( 'background-hover' ) ) {
            $(this).css( 'background-image', 'url(' + $(this).data( 'background-hover' ) + ')' );
            console.log($(this).data( 'background-hover' ));
        }
      })
      .mouseout(function() {
        if( $(this).data( 'background-hover' ) ) {
            $(this).css( 'background-image', 'url(' + $(this).data( 'background' ) + ')' );
        }
      });
    
}(document, window, jQuery));
