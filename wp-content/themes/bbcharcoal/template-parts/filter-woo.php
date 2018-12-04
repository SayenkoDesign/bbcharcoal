<div class="filter-full-width-wrapper">
  <?php
  if( function_exists( 'facetwp_display' ) ) {

      $reset = "<div><button class=\"button red\" onclick=\"FWP.reset()\">Reset</button></div>";

      printf( '<div class="filters row column"><span>%s</span>%s%s%s</div>',
      'Filter By:',
      facetwp_display( 'facet', 'price' ),
      facetwp_display( 'sort' ),
      $reset
      );
  }
  ?>
  <div class="point"><img src="/wp-content/themes/bbcharcoal/assets/images/page/tan-curve-bottom.png" class="" /></div>
</div>
