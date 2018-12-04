<?php
/**
 * The template for displaying the footer.
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */
?>

</div><!-- #content -->

<?php
$hide_footer_cta_logos = get_field( 'hide_footer_cta_logos' ) ? get_field( 'hide_footer_cta_logos' ) : false ;
if( ! $hide_footer_cta_logos ) {
    
    get_template_part( 'template-parts/section', 'footer-cta' );
  
    get_template_part( 'template-parts/section', 'logos' );
    
}

?>

<footer id="colophon" class="site-footer" role="contentinfo">

    <div class="wrap">
        <div class="footer-widgets">
            
            <div class="row align-top align-center large-unstack">
            
                <div class="column column-block small-order-2 large-order-1">
                <?php
                if( is_active_sidebar( 'footer-1') ){
                    dynamic_sidebar( 'footer-1' );
                }
                ?>
                </div>
                
                <div class="column column-block small-order-1 large-order-2">
                <?php
                
                if( is_active_sidebar( 'footer-2') ){
                    dynamic_sidebar( 'footer-2' );
                }
                ?>
                </div>
                
                <div class="column column-block small-order-3 large-order-3">
                <?php
                if( is_active_sidebar( 'footer-3') ){
                    dynamic_sidebar( 'footer-3' );
                }
                ?>
                </div>
            
            </div>
        
        </div>
        
        <div class="footer-copyright">
                
            <div class="row expanded text-center">
                  <div class="column">                      
                    <?php
                    
                    $args = array( 
                    'theme_location'  => 'footer', 
                     'container'       => false,
                     'echo'            => false,
                     'items_wrap'      => '%3$s',
                     'link_before'     => '<span>',
                     'link_after'      => '</span>',
                     'depth'           => 0,
                    ); 
                
                    $footer_menu =  str_replace('<a', '<b> &bull; </b><a', strip_tags( wp_nav_menu( $args ), '<a>' ) );
                    
                    printf( '<div class="menu">%s</div>', $footer_menu );
                    
                    echo '<div class="copyright">';
                    printf( '<p>&copy; %s by B&B Charcoil Inc.. All rights reserved.</p>', 
                    date( 'Y' ) );
                    
                    printf( '<p><a href="%1$s">Seattle Web Design</a> by <a href="%1$s" target="_blank">Sayenko Design</a></p>', 
                            'https://www.sayenkodesign.com' );
                            
                    echo '</div>';
                    
                    ?>
                </div>
            </div>
            
         </div>
     
     </div>
 
 </footer><!-- #colophon -->

<?php 
 
wp_footer(); 
?>
</body>
</html>
