<?php

// Add modals to footer
function _s_footer() {
    get_template_part( 'template-parts/modal', 'video' );   
}
add_action( 'wp_footer', '_s_footer' );