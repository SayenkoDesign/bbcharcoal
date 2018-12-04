<?php
/**
 * The header for our theme.
 *
 * This is the template that displays all of the <head> section and everything up until <div id="content">
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package _s
 */
?><!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
<meta charset="<?php bloginfo( 'charset' ); ?>">
<meta name="viewport" content="width=device-width, initial-scale=1">
<link rel="profile" href="http://gmpg.org/xfn/11">
<link rel="pingback" href="<?php bloginfo( 'pingback_url' ); ?>">
<link rel="dns-prefetch" href="//fonts.googleapis.com">
<link rel="apple-touch-icon" sizes="180x180" href="<?php echo THEME_FAVICONS;?>/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="32x32" href="<?php echo THEME_FAVICONS;?>/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="16x16" href="<?php echo THEME_FAVICONS;?>/favicon-16x16.png">
<link rel="manifest" href="<?php echo THEME_FAVICONS;?>/site.webmanifest">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="msapplication-TileColor" content="#da532c">
<meta name="theme-color" content="#ffffff">
<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>

<a class="skip-link screen-reader-text" href="#content"><?php esc_html_e( 'Skip to content', '_s' ); ?></a>

    <header id="masthead" class="site-header" role="banner">
		<div class="wrap">

            <div class="row expanded align-middle align-right show-for-large">

                <div class="large-6 columns header-widgets hide-for-xxxlarge">
                    <?php
                    if(is_active_sidebar('header')){
                        dynamic_sidebar('header');
                    }
                    ?>
                </div>

                <div class="shrink before-header-widgets text-right">

                    <?php
                    if(is_active_sidebar('before-header')){
                        dynamic_sidebar('before-header');
                    }
                    ?>
                </div>
            </div>

			<div class="row align-bottom expanded small-collapse large-uncollapse relative-parent">

                <div class="site-branding columns small-12 large-3">
                    <div class="site-title">
                    <?php
                    $site_url = home_url();
                    $logo = sprintf('<img src="%slogo.png" class="" />', trailingslashit( THEME_IMG ) );
                    printf('<a href="%s" title="%s">%s</a>',
                            $site_url, get_bloginfo( 'name' ), $logo );
                    ?>
                    </div>
                </div><!-- .site-branding -->

                <nav id="site-navigation" class="nav-primary small-12  xxxlarge-6 columns" role="navigation">
                    <?php
                        // Desktop Menu
                        $args = array(
                            'theme_location' => 'primary',
                            'menu' => 'Primary Menu',
                            'container' => 'div',
                            'container_class' => '',
                            'container_id' => '',
                            'menu_id'        => 'primary-menu',
                            'menu_class'     => 'dropdown menu',
                            'before' => '',
                            'after' => '',
                            'link_before' => '',
                            'link_after' => '',
                            'items_wrap' => '<ul id="%1$s" class="%2$s">%3$s</ul>'
                         );
                        wp_nav_menu($args);
                    ?>
                </nav>

                <!-- <div class="large-3 columns header-widgets show-for-xxxlarge"> -->
                    <?php
                    if(is_active_sidebar('header')){
                        //dynamic_sidebar('header');
                    }
                    ?>
                <!-- </div> -->
                <?php
                global $woocommerce;
                $cart_url = $woocommerce->cart->get_cart_url();
                ?>
                <a href="<?php echo $cart_url; ?>" class="header-cart"><span><?php echo $woocommerce->cart->get_cart_contents_count(); ?></span><img src="/wp-content/themes/bbcharcoal/assets/images/header/shopping-cart.svg" alt="Cart"></a>

			</div>

		</div><!-- wrap -->

	</header><!-- #masthead -->

<div id="page" class="site-container">

	<div id="content" class="site-content">
