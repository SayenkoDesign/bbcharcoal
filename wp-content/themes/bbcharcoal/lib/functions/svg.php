<?php

function get_svg( $type = '' ) {
	
	$svgs = array(  
    		
        'menu-icon' => '<svg xmlns="http://www.w3.org/2000/svg" width="38" height="34" class="menu-icon" viewBox="0 0 38 34"><g fill="none" fill-rule="evenodd" stroke="#454C54" stroke-width="3" stroke-linecap="square"><path d="M2 22h34M2 12h34M2 32h27M2 2h27"/></g><span class="screen-reader-text">menu icon</span></svg>',
   
        
        'arrow-left' => '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 31 22">
  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1" transform="translate(-231.000000, -1931.000000) translate(245.500000, 1941.000000) rotate(-180.000000) translate(-245.500000, -1941.000000) translate(211.000000, 1908.000000) translate(20.000000, 21.000000)">
    <path fill="#FFFFFF" d="M16 22a1 1 0 0 0 2 0l11-10a1 1 0 0 0 0-2L18 0h-2v2l10 9-10 9v2z"/>
    <path stroke="#FFFFFF" stroke-linecap="square" stroke-width="3" d="M26 11H0"/>
  </g>
</svg>',

        'arrow-right' => '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 31 22">
  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1" transform="translate(-1177.000000, -1929.000000) translate(1160.000000, 1907.000000) translate(19.000000, 22.000000)">
    <path fill="#FFFFFF" d="M16 22a1 1 0 0 0 2 0l11-10a1 1 0 0 0 0-2L18 0h-2v2l10 9-10 9v2z"/>
    <path stroke="#FFFFFF" stroke-linecap="square" stroke-width="3" d="M26 11H0"/>
  </g>
</svg>',


    'arrow-left-red' => '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 31 22">
  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1" transform="translate(-231.000000, -1931.000000) translate(245.500000, 1941.000000) rotate(-180.000000) translate(-245.500000, -1941.000000) translate(211.000000, 1908.000000) translate(20.000000, 21.000000)">
    <path fill="#CD2533" d="M16 22a1 1 0 0 0 2 0l11-10a1 1 0 0 0 0-2L18 0h-2v2l10 9-10 9v2z"/>
    <path stroke="#CD2533" stroke-linecap="square" stroke-width="3" d="M26 11H0"/>
  </g>
</svg>',

        'arrow-right-red' => '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" viewBox="0 0 31 22">
  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1" transform="translate(-1177.000000, -1929.000000) translate(1160.000000, 1907.000000) translate(19.000000, 22.000000)">
    <path fill="#CD2533" d="M16 22a1 1 0 0 0 2 0l11-10a1 1 0 0 0 0-2L18 0h-2v2l10 9-10 9v2z"/>
    <path stroke="#CD2533" stroke-linecap="square" stroke-width="3" d="M26 11H0"/>
  </g>
</svg>',
        
        // social icons https://codepen.io/ruandre/pen/howFi
	
		'facebook' => '<svg viewBox="0 0 512 512"><path d="M211.9 197.4h-36.7v59.9h36.7V433.1h70.5V256.5h49.2l5.2-59.1h-54.4c0 0 0-22.1 0-33.7 0-13.9 2.8-19.5 16.3-19.5 10.9 0 38.2 0 38.2 0V82.9c0 0-40.2 0-48.8 0 -52.5 0-76.1 23.1-76.1 67.3C211.9 188.8 211.9 197.4 211.9 197.4z"></path><span class="screen-reader-text">facebook icon</span></svg>',
		
		'googleplus' => '<svg viewBox="0 0 512 512"><path d="M179.7 237.6L179.7 284.2 256.7 284.2C253.6 304.2 233.4 342.9 179.7 342.9 133.4 342.9 95.6 304.4 95.6 257 95.6 209.6 133.4 171.1 179.7 171.1 206.1 171.1 223.7 182.4 233.8 192.1L270.6 156.6C247 134.4 216.4 121 179.7 121 104.7 121 44 181.8 44 257 44 332.2 104.7 393 179.7 393 258 393 310 337.8 310 260.1 310 251.2 309 244.4 307.9 237.6L179.7 237.6 179.7 237.6ZM468 236.7L429.3 236.7 429.3 198 390.7 198 390.7 236.7 352 236.7 352 275.3 390.7 275.3 390.7 314 429.3 314 429.3 275.3 468 275.3"></path><span class="screen-reader-text">google plus icon</span></svg>',
		
		'linkedin' => '<svg viewBox="0 0 512 512"><path d="M186.4 142.4c0 19-15.3 34.5-34.2 34.5 -18.9 0-34.2-15.4-34.2-34.5 0-19 15.3-34.5 34.2-34.5C171.1 107.9 186.4 123.4 186.4 142.4zM181.4 201.3h-57.8V388.1h57.8V201.3zM273.8 201.3h-55.4V388.1h55.4c0 0 0-69.3 0-98 0-26.3 12.1-41.9 35.2-41.9 21.3 0 31.5 15 31.5 41.9 0 26.9 0 98 0 98h57.5c0 0 0-68.2 0-118.3 0-50-28.3-74.2-68-74.2 -39.6 0-56.3 30.9-56.3 30.9v-25.2H273.8z"></path><span class="screen-reader-text">linkedin icon</span></svg>',
		
		'twitter' => '<svg viewBox="0 0 512 512"><path d="M419.6 168.6c-11.7 5.2-24.2 8.7-37.4 10.2 13.4-8.1 23.8-20.8 28.6-36 -12.6 7.5-26.5 12.9-41.3 15.8 -11.9-12.6-28.8-20.6-47.5-20.6 -42 0-72.9 39.2-63.4 79.9 -54.1-2.7-102.1-28.6-134.2-68 -17 29.2-8.8 67.5 20.1 86.9 -10.7-0.3-20.7-3.3-29.5-8.1 -0.7 30.2 20.9 58.4 52.2 64.6 -9.2 2.5-19.2 3.1-29.4 1.1 8.3 25.9 32.3 44.7 60.8 45.2 -27.4 21.4-61.8 31-96.4 27 28.8 18.5 63 29.2 99.8 29.2 120.8 0 189.1-102.1 185-193.6C399.9 193.1 410.9 181.7 419.6 168.6z"></path><span class="screen-reader-text">twitter icon</span></svg>',

		'instagram' => '<svg viewBox="0 0 512 512"><g><path d="M256 109.3c47.8 0 53.4 0.2 72.3 1 17.4 0.8 26.9 3.7 33.2 6.2 8.4 3.2 14.3 7.1 20.6 13.4 6.3 6.3 10.1 12.2 13.4 20.6 2.5 6.3 5.4 15.8 6.2 33.2 0.9 18.9 1 24.5 1 72.3s-0.2 53.4-1 72.3c-0.8 17.4-3.7 26.9-6.2 33.2 -3.2 8.4-7.1 14.3-13.4 20.6 -6.3 6.3-12.2 10.1-20.6 13.4 -6.3 2.5-15.8 5.4-33.2 6.2 -18.9 0.9-24.5 1-72.3 1s-53.4-0.2-72.3-1c-17.4-0.8-26.9-3.7-33.2-6.2 -8.4-3.2-14.3-7.1-20.6-13.4 -6.3-6.3-10.1-12.2-13.4-20.6 -2.5-6.3-5.4-15.8-6.2-33.2 -0.9-18.9-1-24.5-1-72.3s0.2-53.4 1-72.3c0.8-17.4 3.7-26.9 6.2-33.2 3.2-8.4 7.1-14.3 13.4-20.6 6.3-6.3 12.2-10.1 20.6-13.4 6.3-2.5 15.8-5.4 33.2-6.2C202.6 109.5 208.2 109.3 256 109.3M256 77.1c-48.6 0-54.7 0.2-73.8 1.1 -19 0.9-32.1 3.9-43.4 8.3 -11.8 4.6-21.7 10.7-31.7 20.6 -9.9 9.9-16.1 19.9-20.6 31.7 -4.4 11.4-7.4 24.4-8.3 43.4 -0.9 19.1-1.1 25.2-1.1 73.8 0 48.6 0.2 54.7 1.1 73.8 0.9 19 3.9 32.1 8.3 43.4 4.6 11.8 10.7 21.7 20.6 31.7 9.9 9.9 19.9 16.1 31.7 20.6 11.4 4.4 24.4 7.4 43.4 8.3 19.1 0.9 25.2 1.1 73.8 1.1s54.7-0.2 73.8-1.1c19-0.9 32.1-3.9 43.4-8.3 11.8-4.6 21.7-10.7 31.7-20.6 9.9-9.9 16.1-19.9 20.6-31.7 4.4-11.4 7.4-24.4 8.3-43.4 0.9-19.1 1.1-25.2 1.1-73.8s-0.2-54.7-1.1-73.8c-0.9-19-3.9-32.1-8.3-43.4 -4.6-11.8-10.7-21.7-20.6-31.7 -9.9-9.9-19.9-16.1-31.7-20.6 -11.4-4.4-24.4-7.4-43.4-8.3C310.7 77.3 304.6 77.1 256 77.1L256 77.1z"></path><path d="M256 164.1c-50.7 0-91.9 41.1-91.9 91.9s41.1 91.9 91.9 91.9 91.9-41.1 91.9-91.9S306.7 164.1 256 164.1zM256 315.6c-32.9 0-59.6-26.7-59.6-59.6s26.7-59.6 59.6-59.6 59.6 26.7 59.6 59.6S288.9 315.6 256 315.6z"></path><circle cx="351.5" cy="160.5" r="21.5"></circle></g></svg>',
        
        'pinterest' => '<svg viewBox="0 0 512 512"><path d="M266.6 76.5c-100.2 0-150.7 71.8-150.7 131.7 0 36.3 13.7 68.5 43.2 80.6 4.8 2 9.2 0.1 10.6-5.3 1-3.7 3.3-13 4.3-16.9 1.4-5.3 0.9-7.1-3-11.8 -8.5-10-13.9-23-13.9-41.3 0-53.3 39.9-101 103.8-101 56.6 0 87.7 34.6 87.7 80.8 0 60.8-26.9 112.1-66.8 112.1 -22.1 0-38.6-18.2-33.3-40.6 6.3-26.7 18.6-55.5 18.6-74.8 0-17.3-9.3-31.7-28.4-31.7 -22.5 0-40.7 23.3-40.7 54.6 0 19.9 6.7 33.4 6.7 33.4s-23.1 97.8-27.1 114.9c-8.1 34.1-1.2 75.9-0.6 80.1 0.3 2.5 3.6 3.1 5 1.2 2.1-2.7 28.9-35.9 38.1-69 2.6-9.4 14.8-58 14.8-58 7.3 14 28.7 26.3 51.5 26.3 67.8 0 113.8-61.8 113.8-144.5C400.1 134.7 347.1 76.5 266.6 76.5z"/></svg>',
                		
		'vimeo' => '<svg viewBox="0 0 512 512"><path d="M420.1 197.9c-1.5 33.6-25 79.5-70.3 137.8 -46.9 60.9-86.5 91.4-118.9 91.4 -20.1 0-37.1-18.5-51-55.6 -9.3-34-18.5-68-27.8-102 -10.3-37.1-21.4-55.7-33.2-55.7 -2.6 0-11.6 5.4-27 16.2L75.7 209.1c17-14.9 33.8-29.9 50.3-44.9 22.7-19.6 39.7-29.9 51.1-31 26.8-2.6 43.3 15.8 49.5 55 6.7 42.4 11.3 68.7 13.9 79 7.7 35.1 16.2 52.7 25.5 52.7 7.2 0 18-11.4 32.5-34.2 14.4-22.8 22.2-40.1 23.2-52.1 2.1-19.7-5.7-29.5-23.2-29.5 -8.3 0-16.8 1.9-25.5 5.7 16.9-55.5 49.3-82.4 97.1-80.9C405.5 130 422.2 153 420.1 197.9z"></path><span class="screen-reader-text">vimeo icon</span></svg>',
        
        'youtube' => '<svg viewBox="0 0 512 512"><path d="M422.6 193.6c-5.3-45.3-23.3-51.6-59-54 -50.8-3.5-164.3-3.5-215.1 0 -35.7 2.4-53.7 8.7-59 54 -4 33.6-4 91.1 0 124.8 5.3 45.3 23.3 51.6 59 54 50.9 3.5 164.3 3.5 215.1 0 35.7-2.4 53.7-8.7 59-54C426.6 284.8 426.6 227.3 422.6 193.6zM222.2 303.4v-94.6l90.7 47.3L222.2 303.4z"/><span class="screen-reader-text">youtube icon</span></svg>',
	 
        'email' => '<svg viewBox="0 0 512 512"><path d="M101.3 141.6v228.9h0.3 308.4 0.8V141.6H101.3zM375.7 167.8l-119.7 91.5 -119.6-91.5H375.7zM127.6 194.1l64.1 49.1 -64.1 64.1V194.1zM127.8 344.2l84.9-84.9 43.2 33.1 43-32.9 84.7 84.7L127.8 344.2 127.8 344.2zM384.4 307.8l-64.4-64.4 64.4-49.3V307.8z"></path></svg>',
        
        'bush' => '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 17 28">

    <path d="M6 23c2-2-2-3-2-5-2-7 7-11 5-17-1 6-10 9-8 17 0 3 4 8 5 5" transform="translate(0 .355548)"/>
    <path d="M6 17c0 3 3 7 4 5 2-1-1-3-1-6 0-4 3-7 1-11 0 4-4 8-4 12"/>
    <path d="M11 22c0 2 1 2 2 1 2-1 3-4 3-6-1-4-3-6-5-7 2 3 2 7 1 10l-1 2"/>
    <path d="M16 1h-2l-4 2-3-1H1L0 3v1h2V3h1l3 1 2 1h3l4-1 2-2-1-1" transform="translate(0 23.172524)"/>
</svg>',
        
        'play' => '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="109" height="109" viewBox="0 0 118 118">
  <defs>
    <circle id="b" cx="52" cy="52" r="52"/>
    <filter id="a" width="119.2%" height="119.2%" x="-10%" y="-10%" filterUnits="objectBoundingBox">
      <feMorphology in="SourceAlpha" operator="dilate" radius="2.5" result="shadowSpreadOuter1"/>
      <feOffset dx="0" dy="0" in="shadowSpreadOuter1" result="shadowOffsetOuter1"/>
      <feGaussianBlur in="shadowOffsetOuter1" result="shadowBlurOuter1" stdDeviation="2.5"/>
      <feComposite in="shadowBlurOuter1" in2="SourceAlpha" operator="out" result="shadowBlurOuter1"/>
      <feColorMatrix in="shadowBlurOuter1" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 1 0"/>
    </filter>
  </defs>
  <g fill="none" fill-rule="evenodd" stroke="none" stroke-width="1" style="" transform="translate(-656.000000, -2350.000000) translate(341.000000, 2034.000000) translate(85.000000, 199.000000) translate(237.000000, 124.000000)">
    <use fill="black" fill-opacity="1" filter="url(#a)" xlink:href="#b"/>
    <use fill="#E0C68A" fill-opacity="0.6" fill-rule="evenodd" stroke="#FFFFFF" stroke-width="5" xlink:href="#b"/>
    <polygon fill="#FFFFFF" points="79 53 37 74 37 32"/>
  </g>
</svg>'
	);
	
	if( isset( $svgs[$type] ) ) {
		return $svgs[$type];	
	}
	
}


add_shortcode( 'bmp_svg', '_s_get_svg' );

function _s_get_svg( $atts = array() ) {
    $atts = shortcode_atts( array(
		'type' => '',
	), $atts, 'svg' );
    
    if( !isset( $atts['type'] ) ) {
        return;   
    }
    
    $svg = get_svg( $atts['type'] );
    
    return $svg;
}