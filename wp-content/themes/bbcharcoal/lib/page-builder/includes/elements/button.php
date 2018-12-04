<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}


class Element_Button extends Element_Base {

	static public $count;
    
    /**
	 * Get widget name.
	 *
	 * Retrieve button widget name.
	 *
	 * @since 1.0.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'button';
	}
    
	
	/**
	 * Render button widget output on the frontend.
	 *
	 * Written in PHP and used to generate the final HTML.
	 *
	 * @since 1.0.0
	 * @access protected
	 */
	public function render() {
                                
		$fields = $this->get_fields();
                                                                
        if ( ! isset( $fields['button'] ) || empty( $fields['button'] ) ) {
            return;
        }
        
        $button = $fields['button'];
        
        
        
        if( empty( $button['text'] ) ) {
            return;
        }
        
        
                
        if ( 'Page' == $button['link'] ) {
                        
			$this->add_render_attribute( 'wrapper', 'href', $button['page'] );
		}
        
		if ( 'Absolute URL' == $button['link'] ) {
                        
			$this->add_render_attribute( 'wrapper', 'href', $button['url'] );
		}
        
        $this->add_render_attribute( 'wrapper', 'class', 'button' ); 
        
        $this->add_render_attribute( 'element', 'class', 'element-button' );
        $this->add_render_attribute( 'element', 'class', 'entry-content' );
                                    
        return sprintf( '<div %s><p><a %s><span>%s</span></a></p></div>', $this->get_render_attribute_string( 'element' ), $this->get_render_attribute_string( 'wrapper' ), $button['text'] );
	}
    	
}
