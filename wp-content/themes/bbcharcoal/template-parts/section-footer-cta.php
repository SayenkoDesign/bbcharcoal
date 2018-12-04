<?php

/*
Footer CTA
		
*/    
    
if( ! class_exists( 'Footer_CTA_Section' ) ) {
    class Footer_CTA_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            $fields = [];
            $fields = get_field( 'footer_cta', 'option' );
            $fields['phone'] = get_field( 'phone', 'option' );
            $this->set_fields( $fields );
            
            $settings = get_sub_field( 'logos_settings' );
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
                     $this->get_name() . '-footer-cta'
                ]
            );
        }
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields();
            
            $fields['button']['button_type'] = 'cta';
            
            $settings = $this->get_settings();
                                    
            $button = new Element_Button( [ 'fields' => $fields ]  ); // set fields from Constructor
            $button->add_render_attribute( 'wrapper', 'class', 'find-store' ); 
            $button = $button->get_element();
            
            if( !empty( $button ) ) {
                $button = sprintf( '<p>%s</p>', $button );
            }
            
            $phone = '';
            if( !empty( $fields['phone'] ) ) {
                $phone_number = _s_format_telephone_url( $fields['phone'] );
                $phone = sprintf( '<a href="%s">%s</a>', $phone_number, $fields['phone'] );
                $phone = sprintf( '<p>%s</p>', $phone );
            }
               
            return sprintf( '<div class="row column">%s%s</div>', $button, $phone );
        }
    }
}
   
new Footer_CTA_Section;

    