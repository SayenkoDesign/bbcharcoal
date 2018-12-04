(function (document, window, $) {

	'use strict';

	$('.logos').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 980,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
    
    
    $('.slick-posts').slick({
        dots: false,
        centerMode: false,
        //centerPadding: 0,
        slidesToShow: 4,
        arrows: true,
        //nextArrow: '<div class="arrow-right"><span class="screen-reader-text">Next</span></div>',
        //prevArrow: '<div class="arrow-left"><span class="screen-reader-text">Previous</span></div>',
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                centerMode: false,
                slidesToShow: 3,
              }
            },
            {
              breakpoint: 980,
              settings: {
                centerMode: false,
                slidesToShow: 2,
              }
            },
            {
              breakpoint: 600,
              settings: {
                centerMode: false,
                slidesToShow: 1,
              }
            }
        ]
    });
    
    
    $('.slick-posts').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        new Foundation.Equalizer($('#slick-posts'));
    });
   
    
}(document, window, jQuery));


