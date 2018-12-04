<?php

get_header(); ?>

<?php
get_template_part( 'template-parts/hero' );
?>
    
<div id="primary" class="content-area">

    <main id="main" class="site-main" role="main">
        <?php
        while ( have_posts() ) :

            the_post();
            
            /*
            - icon
            - title
            - description
            - location
            - share icons
            */
            
            $previous = sprintf( '%s<span class="%s"></span>', 
            get_svg( 'arrow-left-red' ), __( 'Previous Post', '_s') );
            
            $next = sprintf( '%s<span class="%s"></span>', 
                             get_svg( 'arrow-right-red' ), __( 'Next Post', '_s') );
            
            $navigation = _s_get_the_post_navigation( array( 'prev_text' => $previous, 'next_text' => $next ) );
            
            $icon = sprintf('<img src="%sicons/bbq.svg" class="" />', trailingslashit( THEME_IMG ) );
            $photo = new Element_HTML( [ 'fields' => ['html' => $icon ] ]  );
                
            printf( '<div class="section team-navigation"><div class="row align-middle"><div class="column text-center">%s%s</div></div></div>', 
                    $navigation, $icon );
            
            $description  = get_field( 'description' );
            $description = _s_format_string( $description, 'h4' );
            $location  = get_field( 'location' );
            $location = _s_format_string( $location, 'h4' );
            
            $profiles = array( 
                  'linkedin' => get_field( 'linkedin' ),
                  'facebook' => get_field( 'facebook' ),
                  'youtube' => get_field( 'youtube' ),
                  'instagram' => get_field( 'instagram' ),
                  'pinterest' => get_field( 'pinterest' ),
                  'twitter' => get_field( 'twitter' ),
                  'bush' => get_field( 'bush' ),
             );
            
            $social_icons = _s_get_social_icons( $profiles );
            
            print( '<div class="row align-center"><div class="large-9 columns">' );
                            
            printf( '<header class="column row text-center"><h1>%s</h1>%s%s%s</header>', 
                    get_the_title(), $description, $location, $social_icons );

            get_template_part( 'template-parts/content', 'team' );
            
            print( '</div></div>' );
            
            get_template_part( 'template-parts/team-favorite-product' );

            

        endwhile;
       ?>

    </main>

</div>
    


<?php
/*
- favorite product
- page builder
- posts carousel
*/


get_template_part( 'template-parts/page-builder' );

get_template_part( 'template-parts/team-related-posts' );
?>



<?php
get_footer();
