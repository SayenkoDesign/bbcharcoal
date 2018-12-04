<?php

// Register scripts to load later as needed
add_action( 'wp_enqueue_scripts', '_s_register_scripts' );
function _s_register_scripts() {

	// Foundation
	wp_register_script( 'foundation', trailingslashit( THEME_JS ) . 'foundation.min.js', array('jquery'), '', true );
        
    // Isotopes
    wp_register_script( 'isotope', trailingslashit( THEME_JS ) . 'isotope.pkgd.min.js', array('jquery'), '', true );
            
	// Project
 	wp_register_script( 'project' , trailingslashit( THEME_JS ) . 'project.js',
			array(
					'jquery',
 					'foundation',
 					),
				NULL, TRUE );
                
    
    
    // Localize responsive menus script.
    wp_localize_script( 'project', 'genesis_responsive_menu', array(
        'mainMenu'         => __( 'Menu', '_s' ),
        'subMenu'          => __( 'Menu', '_s' ),
        'menuIconClass'    => null,
        'subMenuIconClass' => null,
        'menuClasses'      => array(
            'combine' => array(
                '.nav-primary',
            ),
            //'others'  => array( '.nav-secondary' ),
        ),
    ) );
    
}


// Load Scripts
add_action( 'wp_enqueue_scripts', '_s_load_scripts' );
function _s_load_scripts() {

		if( is_post_type_archive( 'case_study' ) || is_tax( 'case_study_cat' ) || is_page_template( 'page-templates/faq.php' ) ) {
            wp_enqueue_script( 'isotope');
        }
        
        
        wp_enqueue_script( 'project' );

		if( is_front_page() ) {
 			wp_enqueue_script( 'front-page');
		}
}

// Testing Async and Defer
function add_defer_attribute($tag, $handle) {
   // add script handles to the array below
   $scripts_to_defer = array( 'project', 'front-page' );

   foreach($scripts_to_defer as $defer_script) {
      if ($defer_script === $handle) {
         return str_replace(' src', ' defer="defer" src', $tag);
      }
   }
   return $tag;
}

//add_filter('script_loader_tag', 'add_defer_attribute', 10, 2);


function add_async_attribute($tag, $handle) {
   // add script handles to the array below
   $scripts_to_defer = array( 'project' );

   foreach($scripts_to_defer as $defer_script) {
      if ($defer_script === $handle) {
         return str_replace(' src', ' async src', $tag);
      }
   }
   return $tag;
}

//add_filter('script_loader_tag', 'add_async_attribute', 10, 2);
