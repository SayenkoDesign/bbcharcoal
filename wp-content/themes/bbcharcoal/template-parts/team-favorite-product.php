<?php

/*
Team - Featured Product
		
*/

if( ! class_exists( 'Featured_Product_Section' ) ) {
    class Featured_Product_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
                        
            $fields['product'] = get_field( 'product' );            
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
                     $this->get_name() . '-favorite-product'
                ]
            );
        }
        
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields(); 
            
            $product = $this->get_fields( 'product' );
            
            if( empty( $product ) ) {
                return false;
            }
            
            $subheading     = '<h4><span>Favorite Product</span></h4>';
            $heading        = _s_format_string( get_the_title( $product->ID ), 'h2' );
             
            // Button
            $button = get_field( 'button', $product->ID );

            if( ! empty( $button ) ) {
                $button = new Element_Button( [ 'fields' => $button ]  ); // set fields from Constructor
                $button->add_render_attribute( 'wrapper', 'class', 'dashed' ); 
                $button = $button->get_element();
            }
            
            $content = sprintf( '<div class="caption">%s%s%s%s</div>', 
                            $subheading, $heading, apply_filters( 'the_content', $product->post_content ), $button );
                            
                           
            
            $html = new Element_HTML( [ 'fields' => [ 'html' => $content ] ]  );
            
            $background_image       = get_the_post_thumbnail_url( $product->ID, 'hero' );
            $background_position_x  = 'center';
            $background_position_y  = 'center';
            
            if( ! empty( $background_image ) ) {
                                
                $html->add_render_attribute( 'wrapper', 'style', sprintf( 'background-image: url(%s);', $background_image ) );
                $html->add_render_attribute( 'wrapper', 'style', sprintf( 'background-position: %s %s;', 
                                                                          $background_position_x, $background_position_y ) );
               
                $this->add_render_attribute( 'wrap', 'class', 'background-overlay' ); 
                                                                          
            } 
            
            return sprintf( '<div class="row align-middle"><div class="column">%s</div></div>', 
                            $html->get_element() );
                        
        }
    }
}
   
new Featured_Product_Section; 