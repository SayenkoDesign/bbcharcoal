<?php
/*
Template Name: Contact
*/


get_header(); ?>

<?php
get_template_part( 'template-parts/hero' );

?>

<div id="primary" class="content-area">

	<main id="main" class="site-main" role="main">
	<?php
 	// Default
	section_default();
	function section_default() {
				
		global $post;
		
		$attr = array( 'class' => 'section default' );
		
		$args = array(
            'html5'   => '<section %s>',
            'context' => 'section',
            'attr' => $attr,
        );
        
        _s_markup( $args );
        
        _s_structural_wrap( 'open' );
		
		print( '<div class="row">' );
        
            print( '<div class="column column-block small-12 large-4">' );
            
            while ( have_posts() ) :
    
                the_post();
                            
                echo '<div class="entry-content">';
                
                the_content();
                                
                echo '</div>';
                    
            endwhile;
            
                // Add social share, atches the footer
                if( is_active_sidebar( 'footer-1') ){
                    dynamic_sidebar( 'footer-1' );
                }
            
            print( '</div>' );
            
            print( '<div class="column column-block small-12 large-8">' );
            
                printf( '<div class="entry-content">%s</div>', 
                        do_shortcode( '[gravityform id="2" title="false" description="false" ajax="true"]' ) );
            
            print( '</div>' );
        
        print( '</div>' );
        
		_s_structural_wrap( 'close' );
	    echo '</section>';
	}
	?>
	</main>


</div>

<?php
get_footer();
