<?php

/*
Hero
		
*/


if( ! class_exists( 'Hero_Section' ) ) {
    class Hero_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
                        
            $fields = get_field( 'hero' );            
            $this->set_fields( $fields );
            
            $settings = [];
            $this->set_settings( $settings );
            
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
                     $this->get_name() . '-hero'
                ]
            );
        }
        
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields(); 
            
            $heading        = $this->get_fields( 'heading' ) ? $this->get_fields( 'heading' ) : get_the_title();
            $heading        = _s_format_string( $heading, 'h1' );
            $subheading     = '';
            if( !empty( $this->get_fields( 'subheading' ) ) ) {
                $subheading = _s_format_string( sprintf( '<span>%s</span>', _s_wrap_string( $this->get_fields( 'subheading' ) ) ), 'p' );
            }
            
            $point = sprintf('<div class="point"><img src="%spage/tan-curve-top.png" class="" /></div>', 
                            trailingslashit( THEME_IMG ) );

            return sprintf( '<div class="row align-middle"><div class="column"><div class="caption">%s%s</div></div></div>%s', 
                            $heading, $subheading, $point );
        }
    }
}
   
new Hero_Section; 