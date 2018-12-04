<?php
// Columns

if( ! class_exists( 'Content_Section' ) ) {
    class Content_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            $fields = get_sub_field( 'content_elements' );
            $this->set_fields( $fields );
            
            $settings = get_sub_field( 'content_settings' );
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
                     $this->get_name() . '-content',
                     $this->get_name() . '-content' . '-' . $this->get_id(),
                ]
            );            
            
        }   
        
        
        public function before_render() {
                            
            $this->add_render_attribute( 'wrap', 'class', 'wrap' );
            
            $point = sprintf('<div class="point"><img src="%spage/tear-bottom-alt.png" class="" /></div>', 
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
            
            $point = sprintf('<div class="point"><img src="%spage/tear-top-alt.png" class="" /></div>', 
            trailingslashit( THEME_IMG ) );
            
            return sprintf( '</div>%s</%s>', $point, esc_html( $this->get_html_tag() ) );
        } 
        
        // Add content
        public function render() {
            
            $elements = $this->get_fields();
                        
            $settings = $this->get_settings();
                        
            $row = new Element_Row(); 
                        
            $column = new Element_Column(); 
            $column->set_settings( 
                array( 
                    'row_id' => $row->get_id(), 
                    'column_widths' => '1/2',
                    'small_even_order' => 'small-order-1',
                    'small_odd_order' => 'small-order-2',
                    'large_even_order' => 'large-order-2',
                    'large_odd_order' => 'large-order-1',
                ) 
                
            );
            
            // Header
            $header = new Element_Header( [ 'fields' => $elements ]  ); // set fields from Constructor
            $header->set_settings( array( 'heading_size' => 'h3' ) );
            $column->add_child( $header );
            
            // Editor
            $editor = new Element_Editor( [ 'fields' => $elements ]  ); // set fields from Constructor
            $column->add_child( $editor );
                                            
            // Button
            $button = new Element_Button( [ 'fields' => $elements ]  ); // set fields from Constructor
            $button->add_render_attribute( 'wrapper', 'class', [ 'red' ] ); 
            $column->add_child( $button );
            
            $row->add_child( $column );          
            
            $column = new Element_Column(); 
            $column->set_settings( 
                array( 
                    'row_id' => $row->get_id(), 
                    'column_widths' => '1/2',
                    'small_even_order' => 'small-order-1',
                    'small_odd_order' => 'small-order-2',
                    'large_even_order' => 'large-order-2',
                    'large_odd_order' => 'large-order-1',
                ) 
                
            );
            
            // Photo
            $photo = new Element_Photo( [ 'fields' => $elements ]  ); // set fields from Constructor
            $column->add_child( $photo );
            
            $row->add_child( $column );

            
            $this->add_child( $row );
        }
        
    }
}
   
new Content_Section;
