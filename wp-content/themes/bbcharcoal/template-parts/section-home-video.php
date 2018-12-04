<?php
// Home Video

if( ! class_exists( 'Home_Video_Section' ) ) {
    class Home_Video_Section extends Element_Section {
        
        public function __construct() {
            parent::__construct();
                        
            $fields['video'] = get_field( 'video' );
            $fields['photo'] = get_field( 'video_photo' );
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
                     $this->get_name() . '-home-video'
                ]
            );            
            
        }  
        
        
        
       
        
        // Add content
        public function render() {
            
            $fields = $this->get_fields();
                         
            $video = $this->get_video();
            
            return $video;    
        }
        
        
        private function get_video() {
        
            $fields = $this->get_fields();
        
            $video = $fields['video'];
            $photo = $fields['photo'];
            
            if( empty( $video ) ) {
                return false;
            }
            
            $photo = _s_get_acf_image( $photo );
            
            $video_url = youtube_embed( $video );
            $content = sprintf( '<div class="element-video"><button class="play-video" data-open="modal-video" data-src="%s">%s</button>%s</div>',
                                $video_url, get_svg( 'play' ), $photo );
                                
            $content .= sprintf('<div class="point"><img src="%spage/tan-curve-top.png" class="" /></div>', 
            trailingslashit( THEME_IMG ) );
            return $content;
            
        }
        
        
    }
}
   
new Home_Video_Section;
