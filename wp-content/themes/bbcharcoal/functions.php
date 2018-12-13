<?php
/**
 * _s functions and definitions.
 *
 * @link https://developer.wordpress.org/themes/basics/theme-functions/
 *
 * @package _s
 */

if ( ! function_exists( '_s_setup' ) ) :
	/**
	 * Sets up theme defaults and registers support for various WordPress features.
	 *
	 * Note that this function is hooked into the after_setup_theme hook, which
	 * runs before the init hook. The init hook is too late for some features, such
	 * as indicating support for post thumbnails.
	 */
	function _s_setup() {

		/****************************************
		Define Child Theme Definitions
		*****************************************/
		define( 'THEME_DIR', get_template_directory() );
		define( 'THEME_URL', get_template_directory_uri() );
		define( 'THEME_LANG', THEME_URL . '/languages' );
		define( 'THEME_FAVICONS', THEME_URL . '/favicons' );
		define( 'THEME_ASSETS', THEME_URL . '/assets' );
		define( 'THEME_LIB', THEME_URL . '/lib' );
		define( 'THEME_CSS', THEME_ASSETS . '/css' );
		define( 'THEME_IMG', THEME_ASSETS . '/images' );
		define( 'THEME_JS', THEME_ASSETS . '/scripts' );

		define( 'THEME_NAME', sanitize_title( wp_get_theme() ) );
		define( 'THEME_VERSION', '1.0' );

    	define( 'GOOGLE_API_KEY', 'AIzaSyCy-SPSX_CcRah5C4J4OLe0LMsfc5CM61g' );


		/**
		 * Make theme available for translation.
		 * Translations can be filed in the /languages/ directory.
		 * If you're building a theme based on _s, use a find and replace
		 * to change '_s' to the name of your theme in all the template files.
		 * You will also need to update the Gulpfile with the new text domain
		 * and matching destination POT file.
		 */
		load_theme_textdomain( '_s', get_template_directory() . '/languages' );

		// Add default posts and comments RSS feed links to head.
		add_theme_support( 'automatic-feed-links' );

		/**
		 * Let WordPress manage the document title.
		 * By adding theme support, we declare that this theme does not use a
		 * hard-coded <title> tag in the document head, and expect WordPress to
		 * provide it for us.
		 */
		add_theme_support( 'title-tag' );

		/**
		 * Enable support for Post Thumbnails on posts and pages.
		 *
		 * @link https://developer.wordpress.org/themes/functionality/featured-images-post-thumbnails/
		 */
		add_theme_support( 'post-thumbnails' );

		// This theme uses wp_nav_menu() in one location.
		register_nav_menus( array(
			'primary' => esc_html__( 'Primary Menu', '_s' ),
            'footer' => esc_html__( 'Footer Menu', '_s' )
		) );

		/**
		 * Switch default core markup for search form, comment form, and comments
		 * to output valid HTML5.
		 */
		add_theme_support( 'html5', array(
			'search-form',
			'comment-form',
			'comment-list',
			'gallery',
			'caption',
		) );



		/****************************************
		Theme Library
		*****************************************/

		include( THEME_DIR . '/lib/init.php' );

	}
endif; // _s_setup
add_action( 'after_setup_theme', '_s_setup' );

/**
 * Set the content width in pixels, based on the theme's design and stylesheet.
 *
 * Priority 0 to make it available to lower priority callbacks.
 *
 * @global int $content_width
 */
function _s_content_width() {
	$GLOBALS['content_width'] = apply_filters( '_s_content_width', 1200 );
}
add_action( 'after_setup_theme', '_s_content_width', 0 );

/**
 * Register widget area.
 *
 * @link https://developer.wordpress.org/themes/functionality/sidebars/#registering-a-sidebar
 */
function _s_widgets_init() {

	// Define sidebars.
	$sidebars = array(
 		//'primary'  => esc_html__( 'Primary', '_s' ),
        'before-header'  => esc_html__( 'Before Header', '_s' ),
				'header'  => esc_html__( 'Woocommerce', '_s' ),
        'woocommerce'  => esc_html__( 'Header', '_s' ),
        'footer-1'  => esc_html__( 'Footer 1', '_s' ),
        'footer-2'  => esc_html__( 'Footer 2', '_s' ),
        'footer-3'  => esc_html__( 'Footer 3', '_s' ),
        //'footer-4'  => esc_html__( 'Footer 4', '_s' ),
	);

	// Loop through each sidebar and register.
	foreach ( $sidebars as $sidebar_id => $sidebar_name ) {
		register_sidebar( array(
			'name'          => $sidebar_name,
			'id'            => $sidebar_id,
			'description'   => sprintf( esc_html__( 'Widget area for %s', '_s' ), $sidebar_name ),
			'before_widget' => '<aside class="widget %2$s">',
			'after_widget'  => '</aside>',
			'before_title'  => '<h3 class="widget-title">',
			'after_title'   => '</h3>',
		) );
	}

}
add_action( 'widgets_init', '_s_widgets_init' );


// Login Styles
function _s_login_stylesheet() {
    wp_enqueue_style( 'custom-login', trailingslashit( THEME_CSS ) . '/login.css' );
}
add_action( 'login_enqueue_scripts', '_s_login_stylesheet' );

// changing the login logo
function _s_login_logo() {
	$logo = sprintf('%slogo.png', trailingslashit( THEME_IMG ) );
	printf( '<style type="text/css">h1 a { background-image:url(%s)!important; }</style>', $logo );
}
add_action('login_head', '_s_login_logo');

/**
 * Apply theme's stylesheet to the visual editor.
 *
 * @uses add_editor_style() Links a stylesheet to visual editor
 * @uses get_stylesheet_uri() Returns URI of theme stylesheet
 */
function _s_add_editor_styles() {
    add_editor_style( trailingslashit( THEME_CSS ) . '/editor.css' );
}
add_action( 'init', '_s_add_editor_styles' );

/**
 * Load WooCommerce compatibility file.
 */
if ( class_exists( 'WooCommerce' ) ) {
	require get_template_directory() . '/lib/includes/add_woocommerce_suport.php';
}

/**
 * Change number of products that are displayed per page (shop page)
 */
add_filter( 'loop_shop_per_page', 'new_loop_shop_per_page', 20 );

function new_loop_shop_per_page( $cols ) {
  // $cols contains the current number of products per page based on the value stored on Options -> Reading
  // Return the number of products you wanna show per page.
  $cols = 9;
  return $cols;
}

// Remove the sorting dropdown from Woocommerce
remove_action( 'woocommerce_before_shop_loop' , 'woocommerce_catalog_ordering', 30 );

// Remove the result count from WooCommerce
remove_action( 'woocommerce_before_shop_loop' , 'woocommerce_result_count', 20 );

// Remove breadcrumbs
remove_action('woocommerce_before_main_content', 'woocommerce_breadcrumb', 20, 0);

// Single Product Meta
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 40 );
add_action('woocommerce_single_product_summary', 'woocommerce_template_single_meta', 5 );
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
add_action('woocommerce_single_product_summary', 'woocommerce_template_single_title', 5 );
remove_action('woocommerce_single_product_summary', 'woocommerce_template_single_excerpt', 20 );
add_action('woocommerce_after_single_product_summary', 'wc_lower_custom_fields', 15 );

function wc_lower_custom_fields() {
	$page_id = get_queried_object_id();
	echo '<div class="lower-product-content">';
	if( get_field('content_row_1', $page_id)) :
		$content_group = get_field('content_row_1', $page_id);

		if( $content_group['row_1_content'] ) :
			?>
			<div class="lower-content-row row-one">
				<div class="row">
					<div class="image-wrapper large-6 small-10 columns">
						<?php echo wp_get_attachment_image( $content_group['row_1_image'], 'full' ); ?>
					</div>
					<div class="content-wrapper large-4 small-10 columns">
						<h3><?=$content_group['row_1_title']?></h3>
						<p><?=$content_group['row_1_content']?></p>
						<?php if ($content_group['button']['page']) : ?>
							<a href="<?=$content_group['button']['page']?>" class="red button"><?=$content_group['button']['text']?></a>
						<?php elseif ($content_group['button']['url']) :?>
							<a href="<?=$content_group['button']['url']?>" class="red button" target="_blank"><?=$content_group['button']['text']?></a>
						<?php endif; ?>
					</div>
				</div>
			</div>
		<?php
		endif;
	endif;

	if( get_field('content_row_2', $page_id)) :
		$content_group = get_field('content_row_2', $page_id);
		if( $content_group['row_2_content'] ) :
			?>
			<div class="lower-content-row row-two">
				<div class="row">
					<div class="content-wrapper large-4 small-10 large-offset-2 columns">
						<h3><?=$content_group['row_2_title']?></h3>
						<p><?=$content_group['row_2_content']?></p>
						<?php if ($content_group['button']['page']) : ?>
							<a href="<?=$content_group['button']['page']?>" class="red button"><?=$content_group['button']['text']?></a>
						<?php elseif ($content_group['button']['url']) :?>
							<a href="<?=$content_group['button']['url']?> " class="red button" target="_blank"><?=$content_group['button']['text']?></a>
						<?php endif; ?>
					</div>
					<div class="image-wrapper large-6 small-10 columns">
						<?php echo wp_get_attachment_image( $content_group['row_2_image'], 'full' ); ?>
					</div>
				</div>
			</div>
		<?php
		endif;
	endif;
	echo '</div>';
}

//Move sale
remove_action('woocommerce_before_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 10 );
add_action('woocommerce_after_shop_loop_item_title', 'woocommerce_show_product_loop_sale_flash', 5 );
remove_action('woocommerce_before_single_product_summary', 'woocommerce_show_product_sale_flash', 10 );
add_action('woocommerce_single_product_summary', 'woocommerce_show_product_sale_flash', 5 );

//WooCom theme support functions
add_action( 'after_setup_theme', 'sayenko_remove_theme_support', 100 );

function sayenko_remove_theme_support() {
	remove_theme_support( 'wc-product-gallery-zoom' );
}

add_filter( 'woocommerce_single_product_carousel_options', 'ud_update_woo_flexslider_options' );

function ud_update_woo_flexslider_options( $options ) {

    $options['directionNav'] = true;
		$options['controlNav'] = false;

    return $options;
}

// define the woocommerce_cart_item_quantity callback
function filter_woocommerce_cart_item_quantity( $product_quantity, $cart_item_key ) {
    // make filter magic happen here...
    return '<span class="minus-product">-</span>' . $product_quantity . '<span class="plus-product">+</span>';
};

// add the filter
add_filter( 'woocommerce_cart_item_quantity', 'filter_woocommerce_cart_item_quantity', 10, 2 );

// Checkout placeholder text
add_filter('woocommerce_default_address_fields', 'override_default_address_fields' );
function override_default_address_fields( $address_fields ) {
    $address_fields['first_name']['placeholder'] = 'First';
		$address_fields['last_name']['placeholder'] = 'Last';
    $address_fields['company']['placeholder'] = 'Company';
    $address_fields['address_1']['placeholder'] = 'Address';
    $address_fields['state']['placeholder'] = 'State';
    $address_fields['postcode']['placeholder'] = 'Zip Code';
		$address_fields['city']['placeholder'] = 'City';
    return $address_fields;
}

add_filter( 'woocommerce_checkout_fields', 'override_default_checkout_fields' );
function override_default_checkout_fields( $address_fields ) {
	$address_fields['billing']['billing_phone']['placeholder'] = 'Phone (Optional)';
	return $address_fields;
}
