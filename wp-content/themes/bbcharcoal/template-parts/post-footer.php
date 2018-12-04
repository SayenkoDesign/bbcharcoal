<?php

/*
Post Footer
		
*/


if( ! class_exists( 'Post_Footer' ) ) {
    class Post_Footer extends Element_Section {
        
        public function __construct() {
            parent::__construct();
                                    
            // Render the section
            $this->render();
            
            // print the section
            $this->print_element();        
        }
              
        // Add default attributes to section        
        protected function _add_render_attributes() {
            
            // use parent attributes
            parent::_add_render_attributes();
    
            $this->add_render_attribute(
                'wrapper', 'class', [
                     $this->get_name() . '-post-footer'
                ]
            );
        }
        
        
        public function before_render() {
                            
            $this->add_render_attribute( 'wrap', 'class', 'wrap' );
            
            $point = sprintf('<div class="point"><img src="%spage/tan-curve-bottom.png" class="" /></div>', 
            trailingslashit( THEME_IMG ) );
            
            return sprintf( '<%s %s>%s<div %s>', 
                            esc_html( $this->get_html_tag() ), 
                            $this->get_render_attribute_string( 'wrapper' ), 
                            $point,
                            $this->get_render_attribute_string( 'wrap' )
                            );
        }
    
        /**
         * After section rendering.
         *
         * Used to add stuff after the section element.
         *
         * @since 1.0.0
         * @access public
         */
        public function after_render() {
            
            $point = sprintf('<div class="point"><img src="%spage/tan-curve-top.png" class="" /></div>', 
            trailingslashit( THEME_IMG ) );
            
            return sprintf( '</div>%s</%s>', $point, esc_html( $this->get_html_tag() ) );
        }
        
        // Add content
        public function render() {
                                
            $previous = sprintf( '%s<span class="%s"></span>', 
                    get_svg( 'arrow-left-red' ), __( 'Previous Post', '_s') );
                    
            $next = sprintf( '%s<span class="%s"></span>', 
                             get_svg( 'arrow-right-red' ), __( 'Next Post', '_s') );
            
            $navigation = _s_get_the_post_navigation( array( 'prev_text' => $previous, 'next_text' => $next ) );
            
            $share = sprintf( '<h3>%s</h3>%s', __( 'Share This:', '_s' ), _s_get_addtoany_share_icons() );
            
            return sprintf( '<div class="row align-middle"><div class="column text-center">%s%s</div></div>', 
                            $navigation, $share );
                            
        }
    }
}
   
new Post_Footer; 