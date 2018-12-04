<?php

function _s_get_treatment_term() {
    $taxonomy = 'treatment_cat';
    $term = false;
    $terms = wp_get_post_terms( get_the_id(), $taxonomy );
    if( ! is_wp_error( $terms ) && !empty( $terms ) ) {
        $term = $terms[0];        
    }
    
    return $term;
}