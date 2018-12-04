<?php

section_team_related_articles();
function section_team_related_articles() {
    global $post;
    
    $name = get_field( 'posts_name_in_title' );
    if( ! empty( $name ) ) {
        $name = _s_format_string( $name, 'span' ) . ' ';
    }
    
    $title = sprintf( '<h2>%sblog posts & favorite recipes</h2>', $name );
    
    $icon = sprintf('<img src="%sicons/bbq.svg" class="" />', trailingslashit( THEME_IMG ) );
                $photo = new Element_HTML( [ 'fields' => ['html' => $icon ] ]  );
    
    $posts = get_field( 'posts' );
    
    if( empty( $posts ) ) {
        return false;
    }
    
    $loop = new WP_Query( array(
        'post_type' => array( 'post', 'external_post' ),
        'order' => 'ASC',
        'orderby' => 'post__in',
        'posts_per_page' => -1,
        'post__in' => $posts
    ) );
            
    $items = '';
    
    if ( $loop->have_posts() ) : 
    
        $attr = array( 'id' => 'team-related-posts', 'class' => 'section team-related-posts' );
    
        $args = array(
            'html5'   => '<section %s>',
            'context' => 'section',
            'attr' => $attr,
        );
        
        _s_markup( $args );
        
        printf('<div class="point"><img src="%spage/tan-curve-bottom.png" class="" /></div>', 
                trailingslashit( THEME_IMG ) );
        
        _s_structural_wrap( 'open' );
        
        print( '<div class="column row">' );
        
        printf( '<header class="header">%s%s</header>', $icon, $title );
        
        print( '<div id="slick-posts" class="slick-posts" data-equalizer>' );
                                
        while ( $loop->have_posts() ) : $loop->the_post();
              
            if( 'post' == get_post_type() ) {
                get_template_part( 'template-parts/content', 'post-column' );
            }
            else {
                get_template_part( 'template-parts/content', 'external-post-column' );
            }
            
 
        endwhile; 
        
        print( '</div>' );
        
        printf( '<p class="all text-center"><a href="%s">See All Ambassadors</a></p>', get_permalink( 10 ) );
        
        print( '</div>' );
        
        printf('<div class="point"><img src="%spage/tan-curve-top.png" class="" /></div>', 
                            trailingslashit( THEME_IMG ) );
                                            
        _s_section_close();	
         
    endif;
    
    
    // Reset things, for good measure
    $loop = null;
    
    wp_reset_postdata();
        
}