<?php
// Home Intro

if( ! class_exists( 'Home_Products_Section' ) ) {
    class Home_Products_Section extends Element_Section {

        public function __construct() {
            parent::__construct();

            $fields['products'] = get_field( 'products' );
            $this->set_fields( $fields );

            // Render the section
            $this->render();

            // print the section
            $this->print_element();
        }

        // Add default attributes to section
        protected function _add_render_attributes() {

            // use parent attributes
            parent::_add_render_attributes();

            $this->add_render_attribute(
                'wrapper', 'class', [
                     $this->get_name() . '-hot-products'
                ]
            );

        }


        // Add content
        public function render() {

            $fields = $this->get_fields();

            $heading = '<br /><span>hot</span><br /> Products';
            $heading = _s_format_string( $heading, 'h2' );
            $heading = sprintf( '<header class="row column header">%s</header>', $heading );

            $products = $this->get_products();

            if( ! empty( $products ) ) {
                return sprintf( '%s%s', $heading, $products );
            }
        }


        private function get_products() {

            $fields = $this->get_fields();

            $post_ids = $fields['products'];

            if( empty( $post_ids ) ) {
                return false;
            }


            $loop = new WP_Query( array(
                'post_type' => 'our_product',
                'posts_per_page' => -1,
                'post__in' => $post_ids,
                'orderby' => 'post__in'
            ) );

            $items = [];

            $output = '';

            if ( $loop->have_posts() ) :

                while ( $loop->have_posts() ) :

                    $loop->the_post();

                    $background = get_the_post_thumbnail_url( get_the_ID(), 'large' );

                    if( ! empty( $background ) ) {
                        $background = sprintf( ' style="background-image:url(%s);"', $background );
                    }

                    $link = get_field( 'link' );

                    $items[] = sprintf( '<div class="column column-block"><a href="%s" %s>%s</a></div>', $link, $background, the_title( '<h3>', '</h3>', false ) );

                endwhile;


                if( ! empty( $items ) ) {
                    $featured = array_slice( $items, 0, 2 );   // returns "a", "b"
                    $columns = array_slice( $items, 2 );      // returns "c", "d", and "e"

                    $output = sprintf( '<div class="row small-up-1 medium-up-2 products featured">%s</div>', join( '', $featured ) );

                    if( ! empty( $columns ) ) {
                        $output .= sprintf( '<div class="row small-up-1 medium-up-2 large-up-4 products">%s</div>', join( '', $columns ) );
                    }
                }

            endif;

            wp_reset_postdata();

            return $output;
        }


    }
}

new Home_Products_Section;
