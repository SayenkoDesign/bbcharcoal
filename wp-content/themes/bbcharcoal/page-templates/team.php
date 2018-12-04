<?php
/*
Template Name: Team
*/


get_header(); ?>

<?php
get_template_part( 'template-parts/hero', 'team' );

?>

<div id="primary" class="content-area">

	<main id="main" class="site-main" role="main">
	<?php
    		            
        // Loop Through any additional terms and show them
        $post_type = 'team';
        $taxonomy  = 'team_cat';
        
        $terms = get_terms( $taxonomy );
    
        foreach ( $terms as $term_key => $term ) :
            
            $loop = new WP_Query( array(
                'post_type' => $post_type,
                'order' => 'ASC',
                'orderby' => 'menu_order title',
                'posts_per_page' => -1,
                'tax_query' => array(
                    array(
                        'taxonomy' => $taxonomy,
                        'field' => 'slug',
                        'terms' => array( $term->slug ),
                        'operator' => 'IN'
                    )
                )
            ) );
            
            
            if ( $loop->have_posts() ) : 
            
                $attr = array( 'class' => 'section team-members' );
    
                $args = array(
                    'html5'   => '<section %s>',
                    'context' => 'section',
                    'attr' => $attr,
                );
                
                _s_markup( $args );
                
                if( $term_key % 2 == 1 ) {
                    printf('<div class="point"><img src="%spage/tan-curve-bottom.png" class="" /></div>', 
                            trailingslashit( THEME_IMG ) );
                }
                
                _s_structural_wrap( 'open' );
            
                $icon = sprintf('<img src="%sicons/bbq.svg" class="" />', trailingslashit( THEME_IMG ) );
                $photo = new Element_HTML( [ 'fields' => ['html' => $icon ] ]  );
            
                printf( '<header class="column row text-center">%s<h2>%s</h2></header>', 
                        $icon, str_replace( 'of the', '<br /><span>of the</span><br />', $term->name ) );
                        
                $grid_columns = ! $term_key ? 'large-up-3' : 'large-up-4';
                
                printf( '<div class="row small-up-1 medium-up-2 %s align-center">', $grid_columns );
            ?>

               
               
               <?php
                while ( $loop->have_posts() ) :
    
                    $loop->the_post(); 
                    
                    
                    printf( '<article id="post-%s" class="%s">', get_the_ID(), join( ' ', get_post_class( 'column column-block' ) ) );
    
                    $background = sprintf( ' style="background-image: url(%s)"', get_the_post_thumbnail_url( get_the_ID(), 'team-thumbnail' ) );
                    if( has_post_thumbnail() ) {
                        $background_default = sprintf( ' data-background="%s"', get_the_post_thumbnail_url( get_the_ID(), 'team-thumbnail' ) );
                    }
                    
                    $background_hover = get_field( 'hover_photo' );
                    if( ! empty( $background_hover ) ) {
                        $background_hover_image = wp_get_attachment_image( $background_hover, 'team-thumbnail', false, array( 'class' => 'hide') );
                        $background_hover = wp_get_attachment_image_src( $background_hover, 'team-thumbnail' );
                        $background_hover = sprintf( ' data-background-hover="%s"', $background_hover[0] );
                    }
                    
                    $title  = the_title( '<h3>', '</h3>', false );
                    $description  = get_field( 'description' );
                    $description = _s_format_string( $description, 'h4' );
                    $location  = get_field( 'location' );
                    $location = _s_format_string( $location, 'h4' );
                    
                    $disable_link = get_field( 'disable_link' );
                    
                    $anchor_open = sprintf( '<a href="%s"class="panel">', get_permalink() );
                    $anchor_close = '</a>';
                    
                    if( $disable_link ) {
                        $anchor_open = '<span class="panel">';
                        $anchor_close = '</span>';
                    }
                    
                    printf( '%s<div class="thumbnail"%s%s%s>%s</div>%s%s%s%s', 
                            $anchor_open, $background, $background_default, $background_hover, $background_hover_image, $title, $description, $location, $anchor_close );
                    
                    echo '</article>';
    
                endwhile;
                
                ?>
                </div>
            <?php
            
            _s_structural_wrap( 'close' );
            
            if( $term_key % 2 == 1 ) {
                    printf('<div class="point"><img src="%spage/tan-curve-top.png" class="" /></div>', 
                            trailingslashit( THEME_IMG ) );
                }
            
	        echo '</section>';

            endif; 
            
            wp_reset_postdata();
        
        endforeach;
		
	?>
	</main>


</div>

<?php
get_footer();
