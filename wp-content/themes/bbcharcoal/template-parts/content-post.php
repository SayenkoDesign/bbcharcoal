<?php
/**
 * Template part for displaying single posts.
 *
 * @link https://codex.wordpress.org/Template_Hierarchy
 *
 * @package _s
 */
?>

<?php
$post_author = _s_get_team_author();
$post_author_class = $post_author ? 'has-post-author' : '';
?>

<article id="post-<?php the_ID(); ?>" <?php post_class( $post_author_class ); ?>>
	
	<?php
    echo  _s_get_team_author();
    
    
    $intro = get_field( 'intro' );
    
    if( ! empty( $intro ) ) {
        printf( '<div class="intro">%s</div>', $intro );
    }
    ?>
    
    
    <div class="entry-content">
	
		<?php 
		the_content(); 		
		?>
		
	</div><!-- .entry-content -->

	<footer class="entry-footer">
              
	</footer><!-- .entry-footer -->
    
</article><!-- #post-## -->
