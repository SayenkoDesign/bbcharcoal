(function($) {
	
	'use strict';	
	
	// Hero Options  
	var slider_opts = {
		transitionType: 'move',
		controlNavigation:'bullets',
        controlsInside: false,
        navigateByClick: false,
		imageScaleMode: 'fill',
		imageAlignCenter:false,
		arrowsNav: true,
		arrowsNavAutoHide: false,
		sliderTouch: false,
		addActiveClass: true,
		sliderDrag:false,
		fullscreen: false,
		loop: true,
		autoHeight: true,
		slidesSpacing: 0,
		transitionSpeed: 500,
        autoScaleSlider: true, 
		autoScaleSliderWidth: 1440,     
		autoScaleSliderHeight: 536,
        globalCaption: true,
        
		autoPlay: {
				// autoplay options go gere
				enabled: false,
				pauseOnHover: false,
				delay: 5000
			}
	  };
          
      
    // Testimonials Options  
	var testimonials_opts = {
		transitionType: 'move',
		controlNavigation:'none',
		imageAlignCenter:false,
        navigateByClick: false,
		arrowsNav: true,
		arrowsNavAutoHide: false,
		sliderTouch: false,
		addActiveClass: true,
		sliderDrag:false,
		fullscreen: false,
		loop: true,
		autoHeight: true,
		slidesSpacing: 0,
		transitionSpeed: 500,
        
		autoPlay: {
				// autoplay options go gere
				enabled: false,
				pauseOnHover: false,
				delay: 5000
			}
	  };
      
        
    var $slider = $(".element-slideshow .royalSlider");
    $slider.royalSlider( slider_opts );
    
    if ( $slider.data('royalSlider') && $slider.data('royalSlider').numSlides <= 1 ) { 
        $slider.find('.rsNav').hide();
        $slider.find('.rsArrow').hide();
    }
    
    var $testimonials = $(".section-testimonials .royalSlider");
    $testimonials.royalSlider( testimonials_opts );
      
    if ( $testimonials.data('royalSlider') && $testimonials.data('royalSlider').numSlides <= 1 ) { 
        $testimonials.find('.rsNav').hide();
    }
    else {
        $testimonials.find('.rsArrow').appendTo('.section-testimonials .royalSlider');
    }
        
	
})(jQuery);