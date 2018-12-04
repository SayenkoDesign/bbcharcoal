<?php

/*
Logos
		
*/    
    
if( ! class_exists( 'Logos_Section' ) ) {
    class Logos_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
            
            $fields = [];
            $fields['logos'] = get_sub_field( 'logos' );
            $this->set_fields( $fields );
            
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
                     $this->get_name() . '-logos',
                     $this->get_name() . '-logos' . '-' . $this->get_id(),
                ]
            );
        }
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields();
            
            $logos = '';
            
            $columns = '';
            
            $args = array(
                'post_type'      => 'logo',
                'posts_per_page' => -1,
                'post_status'    => 'publish',
                'orderby'        => 'menu_order',
                'order'          => 'ASC'
            );
        
            // Use $loop, a custom variable we made up, so it doesn't overwrite anything
            $loop = new WP_Query( $args );
                    
            // have_posts() is a wrapper function for $wp_query->have_posts(). Since we
            // don't want to use $wp_query, use our custom variable instead.
            if ( $loop->have_posts() ) : 
                
                while ( $loop->have_posts() ) : $loop->the_post(); 
                    $url = get_field( 'url' );
                    $image = get_the_post_thumbnail( get_the_ID(), 'medium' );
                    $tag = 'span';
                    if( !empty( $url ) ) {
                        $tag = 'a';
                        $this->add_render_attribute( 'anchor', 'href', $url, true );
                    }
                    $columns .= sprintf( '<div class="logo"><%1$s %2$s>%3$s</%1$s></div>', 
                                        $tag, 
                                        $this->get_render_attribute_string( 'anchor' ), 
                                        $image ); 
                endwhile;
                
                //$classes = ( $loop->post_count > 4 ) ? '' : '';
                
                //$logos = sprintf( '<div class="row small-up-1 medium-up-2 large-up-4 align-middle align-center logos">%s</div>', $columns );
                
                $logos = sprintf( '<div class="row column align-middle align-center logos">%s</div>', $columns );
                
            endif;
        
            wp_reset_postdata();
  
            return $logos;
        }
    }
}
   
new Logos_Section;

    