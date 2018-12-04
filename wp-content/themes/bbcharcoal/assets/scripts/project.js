/**
 * This script adds the accessibility-ready responsive menus Genesis Framework child themes.
 *
 * @author StudioPress
 * @link https://github.com/copyblogger/responsive-menus
 * @version 1.1.3
 * @license GPL-2.0+
 */

( function ( document, $, undefined ) {

	'use strict';

	$('body').removeClass('no-js');

	var genesisMenuParams      = typeof genesis_responsive_menu === 'undefined' ? '' : genesis_responsive_menu,
		genesisMenusUnchecked  = genesisMenuParams.menuClasses,
		genesisMenus           = {},
		menusToCombine         = [];

	/**
	 * Validate the menus passed by the theme with what's being loaded on the page,
	 * and pass the new and accurate information to our new data.
	 * @param {genesisMenusUnchecked} Raw data from the localized script in the theme.
	 * @return {array} genesisMenus array gets populated with updated data.
	 * @return {array} menusToCombine array gets populated with relevant data.
	 */
	$.each( genesisMenusUnchecked, function( group ) {

		// Mirror our group object to populate.
		genesisMenus[group] = [];

		// Loop through each instance of the specified menu on the page.
		$.each( this, function( key, value ) {

			var menuString = value,
				$menu      = $(value);

			// If there is more than one instance, append the index and update array.
			if ( $menu.length > 1 ) {

				$.each( $menu, function( key, value ) {

					var newString = menuString + '-' + key;

					$(this).addClass( newString.replace('.','') );

					genesisMenus[group].push( newString );

					if ( 'combine' === group ) {
						menusToCombine.push( newString );
					}

				});

			} else if ( $menu.length == 1 ) {

				genesisMenus[group].push( menuString );

				if ( 'combine' === group ) {
					menusToCombine.push( menuString );
				}

			}

		});

	});

	// Make sure there is something to use for the 'others' array.
	if ( typeof genesisMenus.others == 'undefined' ) {
		genesisMenus.others = [];
	}

	// If there's only one menu on the page for combining, push it to the 'others' array and nullify our 'combine' variable.
	if ( menusToCombine.length == 1 ) {
		genesisMenus.others.push( menusToCombine[0] );
		genesisMenus.combine = null;
		menusToCombine = null;
	}

	var genesisMenu         = {},
		mainMenuButtonClass = 'menu-toggle',
		subMenuButtonClass  = 'sub-menu-toggle',
		responsiveMenuClass = 'genesis-responsive-menu';

	// Initialize.
	genesisMenu.init = function() {

		// Exit early if there are no menus to do anything.
		if ( $( _getAllMenusArray() ).length == 0 ) {
			return;
		}

		var menuIconClass     = typeof genesisMenuParams.menuIconClass !== 'undefined' ? genesisMenuParams.menuIconClass : 'dashicons-before dashicons-menu',
			subMenuIconClass  = typeof genesisMenuParams.subMenuIconClass !== 'undefined' ? genesisMenuParams.subMenuIconClass : 'dashicons-before dashicons-arrow-down-alt2',
			toggleButtons     = {
				menu : $( '<button />', {
					'class' : mainMenuButtonClass,
					'aria-expanded' : false,
					'aria-pressed' : false,
					'role'			: 'button',
					} )
					.append( $( '<span />', {
						'class' : 'screen-reader-text',
						'text' : genesisMenuParams.mainMenu
					} ) ),
				submenu : $( '<button />', {
					'class' : subMenuButtonClass,
					'aria-expanded' : false,
					'aria-pressed'  : false,
					'text'			: ''
					} )
					.append( $( '<span />', {
						'class' : 'screen-reader-text',
						'text' : genesisMenuParams.subMenu
					} ) )
			};

		// Add the responsive menu class to the active menus.
		_addResponsiveMenuClass();

		// Add the main nav button to the primary menu, or exit the plugin.
		_addMenuButtons( toggleButtons );

		// Setup additional classes.
		$( '.' + mainMenuButtonClass ).addClass( menuIconClass );
		$( '.' + subMenuButtonClass ).addClass( subMenuIconClass );
		$( '.' + mainMenuButtonClass ).on( 'click.genesisMenu-mainbutton', _mainmenuToggle ).each( _addClassID );
		$( '.' + subMenuButtonClass ).on( 'click.genesisMenu-subbutton', _submenuToggle );
		$( window ).on( 'resize.genesisMenu', _doResize ).triggerHandler( 'resize.genesisMenu' );
	};

	/**
	 * Add menu toggle button to appropriate menus.
	 * @param {toggleButtons} Object of menu buttons to use for toggles.
	 */
	function _addMenuButtons( toggleButtons ) {

		// Apply sub menu toggle to each sub-menu found in the menuList.
		$( _getMenuSelectorString( genesisMenus ) ).find( '.sub-menu' ).before( toggleButtons.submenu );


		if ( menusToCombine !== null ) {

			var menusToToggle = genesisMenus.others.concat( menusToCombine[0] );

		 	// Only add menu button the primary menu and navs NOT in the combine variable.
		 	$( _getMenuSelectorString( menusToToggle ) ).before( toggleButtons.menu );

		} else {

			// Apply the main menu toggle to all menus in the list.
			$( _getMenuSelectorString( genesisMenus.others ) ).before( toggleButtons.menu );

		}

	}

	/**
	 * Add the responsive menu class.
	 */
	function _addResponsiveMenuClass() {
		$( _getMenuSelectorString( genesisMenus ) ).addClass( responsiveMenuClass );
	}

	/**
	 * Execute our responsive menu functions on window resizing.
	 */
	function _doResize() {
		var buttons   = $( 'button[id^="genesis-mobile-"]' ).attr( 'id' );
		if ( typeof buttons === 'undefined' ) {
			return;
		}
		_maybeClose( buttons );
		_superfishToggle( buttons );
		_changeSkipLink( buttons );
		_combineMenus( buttons );
	}

	/**
	 * Add the nav- class of the related navigation menu as
	 * an ID to associated button (helps target specific buttons outside of context).
	 */
	function _addClassID() {
		var $this = $( this ),
			nav   = $this.next( 'nav' ),
			id    = 'class';

		$this.attr( 'id', 'genesis-mobile-' + $( nav ).attr( id ).match( /nav-\w*\b/ ) );
	}

	/**
	 * Combine our menus if the mobile menu is visible.
	 * @params buttons
	 */
	function _combineMenus( buttons ){

		// Exit early if there are no menus to combine.
		if ( menusToCombine == null ) {
			return;
		}

		// Split up the menus to combine based on order of appearance in the array.
		var primaryMenu   = menusToCombine[0],
			combinedMenus = $( menusToCombine ).filter( function(index) { if ( index > 0 ) { return index; } });

		// If the responsive menu is active, append items in 'combinedMenus' object to the 'primaryMenu' object.
		if ( 'none' !== _getDisplayValue( buttons ) ) {

			$.each( combinedMenus, function( key, value ) {
				$(value).find( '.menu > li' ).addClass( 'moved-item-' + value.replace( '.','' ) ).appendTo( primaryMenu + ' ul.genesis-nav-menu' );
			});
			$( _getMenuSelectorString( combinedMenus ) ).hide();

		} else {

			$( _getMenuSelectorString( combinedMenus ) ).show();
			$.each( combinedMenus, function( key, value ) {
				$( '.moved-item-' + value.replace( '.','' ) ).appendTo( value + ' ul.genesis-nav-menu' ).removeClass( 'moved-item-' + value.replace( '.','' ) );
			});

		}

	}

	/**
	 * Action to happen when the main menu button is clicked.
	 */
	function _mainmenuToggle() {
		var $this = $( this );
		_toggleAria( $this, 'aria-pressed' );
		_toggleAria( $this, 'aria-expanded' );
		$this.toggleClass( 'activated' );
		$this.next( 'nav' ).slideToggle( 'fast' );
	}

	/**
	 * Action for submenu toggles.
	 */
	function _submenuToggle() {

		var $this  = $( this ),
			others = $this.closest( '.menu-item' ).siblings();
		_toggleAria( $this, 'aria-pressed' );
		_toggleAria( $this, 'aria-expanded' );
		$this.toggleClass( 'activated' );
		$this.next( '.sub-menu' ).slideToggle( 'fast' );

		others.find( '.' + subMenuButtonClass ).removeClass( 'activated' ).attr( 'aria-pressed', 'false' );
		others.find( '.sub-menu' ).slideUp( 'fast' );

	}

	/**
	 * Activate/deactivate superfish.
	 * @params buttons
	 */
	function _superfishToggle( buttons ) {
		var _superfish = $( '.' + responsiveMenuClass + ' .js-superfish' ),
			$args      = 'destroy';
		if ( typeof _superfish.superfish !== 'function' ) {
			return;
		}
		if ( 'none' === _getDisplayValue( buttons ) ) {
			$args = {
				'delay': 0,
				'animation': {'opacity': 'show'},
				'speed': 300,
				'disableHI': true
			};
		}
		_superfish.superfish( $args );
	}

	/**
	 * Modify skip link to match mobile buttons.
	 * @param buttons
	 */
	function _changeSkipLink( buttons ) {

		// Start with an empty array.
		var menuToggleList = _getAllMenusArray();

		// Exit out if there are no menu items to update.
		if ( ! $( menuToggleList ).length > 0 ) {
			return;
		}

		$.each( menuToggleList, function ( key, value ) {

			var newValue  = value.replace( '.', '' ),
				startLink = 'genesis-' + newValue,
				endLink   = 'genesis-mobile-' + newValue;

			if ( 'none' == _getDisplayValue( buttons ) ) {
				startLink = 'genesis-mobile-' + newValue;
				endLink   = 'genesis-' + newValue;
			}

			var $item = $( '.genesis-skip-link a[href="#' + startLink + '"]' );

			if ( menusToCombine !== null && value !== menusToCombine[0] ) {
				$item.toggleClass( 'skip-link-hidden' );
			}

			if ( $item.length > 0 ) {
				var link  = $item.attr( 'href' );
					link  = link.replace( startLink, endLink );

				$item.attr( 'href', link );
			} else {
				return;
			}

		});

	}

	/**
	 * Close all the menu toggles if buttons are hidden.
	 * @param buttons
	 */
	function _maybeClose( buttons ) {
		if ( 'none' !== _getDisplayValue( buttons ) ) {
			return true;
		}

		$( '.' + mainMenuButtonClass + ', .' + responsiveMenuClass + ' .sub-menu-toggle' )
			.removeClass( 'activated' )
			.attr( 'aria-expanded', false )
			.attr( 'aria-pressed', false );

		$( '.' + responsiveMenuClass + ', .' + responsiveMenuClass + ' .sub-menu' )
			.attr( 'style', '' );
	}

	/**
	 * Generic function to get the display value of an element.
	 * @param  {id} $id ID to check
	 * @return {string}     CSS value of display property
	 */
	function _getDisplayValue( $id ) {
		var element = document.getElementById( $id ),
			style   = window.getComputedStyle( element );
		return style.getPropertyValue( 'display' );
	}

	/**
	 * Toggle aria attributes.
	 * @param  {button} $this     passed through
	 * @param  {aria-xx} attribute aria attribute to toggle
	 * @return {bool}           from _ariaReturn
	 */
	function _toggleAria( $this, attribute ) {
		$this.attr( attribute, function( index, value ) {
			return 'false' === value;
		});
	}

	/**
	 * Helper function to return a comma separated string of menu selectors.
	 * @param {itemArray} Array of menu items to loop through.
	 * @param {ignoreSecondary} boolean of whether to ignore the 'secondary' menu item.
	 * @return {string} Comma-separated string.
	 */
	function _getMenuSelectorString( itemArray ) {

		var itemString = $.map( itemArray, function( value, key ) {
			return value;
		});

		return itemString.join( ',' );

	}

	/**
	 * Helper function to return a group array of all the menus in
	 * both the 'others' and 'combine' arrays.
	 * @return {array} Array of all menu items as class selectors.
	 */
	function _getAllMenusArray() {

		// Start with an empty array.
		var menuList = [];

		// If there are menus in the 'menusToCombine' array, add them to 'menuList'.
		if ( menusToCombine !== null ) {

			$.each( menusToCombine, function( key, value ) {
				menuList.push( value.valueOf() );
			});

		}

		// Add menus in the 'others' array to 'menuList'.
		$.each( genesisMenus.others, function( key, value ) {
			menuList.push( value.valueOf() );
		});

		if ( menuList.length > 0 ) {
			return menuList;
		} else {
			return null;
		}

	}

	$(document).ready(function () {

		if ( _getAllMenusArray() !== null ) {

			genesisMenu.init();

		}

	});


})( document, jQuery );

/*!
 * headroom.js v0.9.4 - Give your page some headroom. Hide your header until you need it
 * Copyright (c) 2017 Nick Williams - http://wicky.nillia.ms/headroom.js
 * License: MIT
 */

!function(a,b){"use strict";"function"==typeof define&&define.amd?define([],b):"object"==typeof exports?module.exports=b():a.Headroom=b()}(this,function(){"use strict";function a(a){this.callback=a,this.ticking=!1}function b(a){return a&&"undefined"!=typeof window&&(a===window||a.nodeType)}function c(a){if(arguments.length<=0)throw new Error("Missing arguments in extend function");var d,e,f=a||{};for(e=1;e<arguments.length;e++){var g=arguments[e]||{};for(d in g)"object"!=typeof f[d]||b(f[d])?f[d]=f[d]||g[d]:f[d]=c(f[d],g[d])}return f}function d(a){return a===Object(a)?a:{down:a,up:a}}function e(a,b){b=c(b,e.options),this.lastKnownScrollY=0,this.elem=a,this.tolerance=d(b.tolerance),this.classes=b.classes,this.offset=b.offset,this.scroller=b.scroller,this.initialised=!1,this.onPin=b.onPin,this.onUnpin=b.onUnpin,this.onTop=b.onTop,this.onNotTop=b.onNotTop,this.onBottom=b.onBottom,this.onNotBottom=b.onNotBottom}var f={bind:!!function(){}.bind,classList:"classList"in document.documentElement,rAF:!!(window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame)};return window.requestAnimationFrame=window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame,a.prototype={constructor:a,update:function(){this.callback&&this.callback(),this.ticking=!1},requestTick:function(){this.ticking||(requestAnimationFrame(this.rafCallback||(this.rafCallback=this.update.bind(this))),this.ticking=!0)},handleEvent:function(){this.requestTick()}},e.prototype={constructor:e,init:function(){if(e.cutsTheMustard)return this.debouncer=new a(this.update.bind(this)),this.elem.classList.add(this.classes.initial),setTimeout(this.attachEvent.bind(this),100),this},destroy:function(){var a=this.classes;this.initialised=!1;for(var b in a)a.hasOwnProperty(b)&&this.elem.classList.remove(a[b]);this.scroller.removeEventListener("scroll",this.debouncer,!1)},attachEvent:function(){this.initialised||(this.lastKnownScrollY=this.getScrollY(),this.initialised=!0,this.scroller.addEventListener("scroll",this.debouncer,!1),this.debouncer.handleEvent())},unpin:function(){var a=this.elem.classList,b=this.classes;!a.contains(b.pinned)&&a.contains(b.unpinned)||(a.add(b.unpinned),a.remove(b.pinned),this.onUnpin&&this.onUnpin.call(this))},pin:function(){var a=this.elem.classList,b=this.classes;a.contains(b.unpinned)&&(a.remove(b.unpinned),a.add(b.pinned),this.onPin&&this.onPin.call(this))},top:function(){var a=this.elem.classList,b=this.classes;a.contains(b.top)||(a.add(b.top),a.remove(b.notTop),this.onTop&&this.onTop.call(this))},notTop:function(){var a=this.elem.classList,b=this.classes;a.contains(b.notTop)||(a.add(b.notTop),a.remove(b.top),this.onNotTop&&this.onNotTop.call(this))},bottom:function(){var a=this.elem.classList,b=this.classes;a.contains(b.bottom)||(a.add(b.bottom),a.remove(b.notBottom),this.onBottom&&this.onBottom.call(this))},notBottom:function(){var a=this.elem.classList,b=this.classes;a.contains(b.notBottom)||(a.add(b.notBottom),a.remove(b.bottom),this.onNotBottom&&this.onNotBottom.call(this))},getScrollY:function(){return void 0!==this.scroller.pageYOffset?this.scroller.pageYOffset:void 0!==this.scroller.scrollTop?this.scroller.scrollTop:(document.documentElement||document.body.parentNode||document.body).scrollTop},getViewportHeight:function(){return window.innerHeight||document.documentElement.clientHeight||document.body.clientHeight},getElementPhysicalHeight:function(a){return Math.max(a.offsetHeight,a.clientHeight)},getScrollerPhysicalHeight:function(){return this.scroller===window||this.scroller===document.body?this.getViewportHeight():this.getElementPhysicalHeight(this.scroller)},getDocumentHeight:function(){var a=document.body,b=document.documentElement;return Math.max(a.scrollHeight,b.scrollHeight,a.offsetHeight,b.offsetHeight,a.clientHeight,b.clientHeight)},getElementHeight:function(a){return Math.max(a.scrollHeight,a.offsetHeight,a.clientHeight)},getScrollerHeight:function(){return this.scroller===window||this.scroller===document.body?this.getDocumentHeight():this.getElementHeight(this.scroller)},isOutOfBounds:function(a){var b=a<0,c=a+this.getScrollerPhysicalHeight()>this.getScrollerHeight();return b||c},toleranceExceeded:function(a,b){return Math.abs(a-this.lastKnownScrollY)>=this.tolerance[b]},shouldUnpin:function(a,b){var c=a>this.lastKnownScrollY,d=a>=this.offset;return c&&d&&b},shouldPin:function(a,b){var c=a<this.lastKnownScrollY,d=a<=this.offset;return c&&b||d},update:function(){var a=this.getScrollY(),b=a>this.lastKnownScrollY?"down":"up",c=this.toleranceExceeded(a,b);this.isOutOfBounds(a)||(a<=this.offset?this.top():this.notTop(),a+this.getViewportHeight()>=this.getScrollerHeight()?this.bottom():this.notBottom(),this.shouldUnpin(a,c)?this.unpin():this.shouldPin(a,c)&&this.pin(),this.lastKnownScrollY=a)}},e.options={tolerance:{up:0,down:0},offset:0,scroller:window,classes:{pinned:"headroom--pinned",unpinned:"headroom--unpinned",top:"headroom--top",notTop:"headroom--not-top",bottom:"headroom--bottom",notBottom:"headroom--not-bottom",initial:"headroom"}},e.cutsTheMustard="undefined"!=typeof f&&f.rAF&&f.bind&&f.classList,e});
/*
 Original Plugin by Osvaldas Valutis, www.osvaldas.info
 http://osvaldas.info/drop-down-navigation-responsive-and-touch-friendly
 Available for use under the MIT License
 */
/**
 * jquery-doubleTapToGo plugin
 * Copyright 2017 DACHCOM.DIGITAL AG
 * @author Marco Rieser
 * @author Volker Andres
 * @author Stefan Hagspiel
 * @version 3.0.2
 * @see https://github.com/dachcom-digital/jquery-doubletaptogo
 */
(function ($, window, document, undefined) {
    'use strict';
    var pluginName = 'doubleTapToGo',
        defaults = {
            automatic: true,
            selectorClass: 'doubletap',
            selectorChain: 'li:has(ul)'
        };

    function DoubleTapToGo (element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = pluginName;
        this.init();
    }

    $.extend(DoubleTapToGo.prototype, {
        preventClick: false,
        currentTap: $(),
        init: function () {
            $(this.element)
                .on('touchstart', '.' + this.settings.selectorClass, this._tap.bind(this))
                .on('click', '.' + this.settings.selectorClass, this._click.bind(this))
                .on('remove', this._destroy.bind(this));

            this._addSelectors();
        },

        _addSelectors: function () {
            if (this.settings.automatic !== true) {
                return;
            }
            $(this.element)
                .find(this.settings.selectorChain)
                .addClass(this.settings.selectorClass);
        },

        _click: function (event) {
            if (this.preventClick) {
                event.preventDefault();
            } else {
                this.currentTap = $();
            }
        },

        _tap: function (event) {
            var $target = $(event.target).closest('li');
            if (!$target.hasClass(this.settings.selectorClass)) {
                this.preventClick = false;
                return;
            }
            if ($target.get(0) === this.currentTap.get(0)) {
                this.preventClick = false;
                return;
            }
            this.preventClick = true;
            this.currentTap = $target;
            event.stopPropagation();
        },

        _destroy: function () {
            $(this.element).off();
        },

        reset: function () {
            this.currentTap = $();
        }
    });

    $.fn[pluginName] = function (options) {
        var args = arguments,
            returns;
        if (options === undefined || typeof options === 'object') {
            return this.each(function () {
                if (!$.data(this, pluginName)) {
                    $.data(this, pluginName, new DoubleTapToGo(this, options));
                }
            });
        } else if (typeof options === 'string' && options[0] !== '_' && options !== 'init') {
            this.each(function () {
                var instance = $.data(this, pluginName),
                    methodName = (options === 'destroy' ? '_destroy' : options);
                if (instance instanceof DoubleTapToGo && typeof instance[methodName] === 'function') {
                    returns = instance[methodName].apply(instance, Array.prototype.slice.call(args, 1));
                }
                if (options === 'destroy') {
                    $.data(this, pluginName, null);
                }
            });
            return returns !== undefined ? returns : this;
        }
    };
})(jQuery, window, document);

// jQuery RoyalSlider plugin. Custom build. (c) Dmitry Semenov http://dimsemenov.com 
// http://dimsemenov.com/private/home.php?build=bullets_autoplay_auto-height_global-caption 
// jquery.royalslider v9.5.9
(function(l){function v(b,e){var d,a=this,c=window.navigator,g=c.userAgent.toLowerCase();a.uid=l.rsModules.uid++;a.ns=".rs"+a.uid;var f=document.createElement("div").style,h=["webkit","Moz","ms","O"],k="",m=0;for(d=0;d<h.length;d++){var p=h[d];!k&&p+"Transform"in f&&(k=p);p=p.toLowerCase();window.requestAnimationFrame||(window.requestAnimationFrame=window[p+"RequestAnimationFrame"],window.cancelAnimationFrame=window[p+"CancelAnimationFrame"]||window[p+"CancelRequestAnimationFrame"])}window.requestAnimationFrame||
(window.requestAnimationFrame=function(a,b){var c=(new Date).getTime(),d=Math.max(0,16-(c-m)),f=window.setTimeout(function(){a(c+d)},d);m=c+d;return f});window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)});a.isIPAD=g.match(/(ipad)/);a.isIOS=a.isIPAD||g.match(/(iphone|ipod)/);d=function(a){a=/(chrome)[ \/]([\w.]+)/.exec(a)||/(webkit)[ \/]([\w.]+)/.exec(a)||/(opera)(?:.*version|)[ \/]([\w.]+)/.exec(a)||/(msie) ([\w.]+)/.exec(a)||0>a.indexOf("compatible")&&/(mozilla)(?:.*? rv:([\w.]+)|)/.exec(a)||
[];return{browser:a[1]||"",version:a[2]||"0"}}(g);h={};d.browser&&(h[d.browser]=!0,h.version=d.version);h.chrome&&(h.webkit=!0);a._browser=h;a.isAndroid=-1<g.indexOf("android");a.slider=l(b);a.ev=l(a);a._doc=l(document);a.st=l.extend({},l.fn.royalSlider.defaults,e);a._currAnimSpeed=a.st.transitionSpeed;a._minPosOffset=0;!a.st.allowCSS3||h.webkit&&!a.st.allowCSS3OnWebkit||(d=k+(k?"T":"t"),a._useCSS3Transitions=d+"ransform"in f&&d+"ransition"in f,a._useCSS3Transitions&&(a._use3dTransform=k+(k?"P":"p")+
"erspective"in f));k=k.toLowerCase();a._vendorPref="-"+k+"-";a._slidesHorizontal="vertical"===a.st.slidesOrientation?!1:!0;a._reorderProp=a._slidesHorizontal?"left":"top";a._sizeProp=a._slidesHorizontal?"width":"height";a._prevNavItemId=-1;a._isMove="fade"===a.st.transitionType?!1:!0;a._isMove||(a.st.sliderDrag=!1,a._fadeZIndex=10);a._opacityCSS="z-index:0; display:none; opacity:0;";a._newSlideId=0;a._sPosition=0;a._nextSlidePos=0;l.each(l.rsModules,function(b,c){"uid"!==b&&c.call(a)});a.slides=[];
a._idCount=0;(a.st.slides?l(a.st.slides):a.slider.children().detach()).each(function(){a._parseNode(this,!0)});a.st.randomizeSlides&&a.slides.sort(function(){return.5-Math.random()});a.numSlides=a.slides.length;a._refreshNumPreloadImages();a.st.startSlideId?a.st.startSlideId>a.numSlides-1&&(a.st.startSlideId=a.numSlides-1):a.st.startSlideId=0;a._newSlideId=a.staticSlideId=a.currSlideId=a._realId=a.st.startSlideId;a.currSlide=a.slides[a.currSlideId];a._accelerationPos=0;a.pointerMultitouch=!1;a.slider.addClass((a._slidesHorizontal?
"rsHor":"rsVer")+(a._isMove?"":" rsFade"));f='<div class="rsOverflow"><div class="rsContainer">';a.slidesSpacing=a.st.slidesSpacing;a._slideSize=(a._slidesHorizontal?a.slider.width():a.slider.height())+a.st.slidesSpacing;a._preload=0<a._numPreloadImages;1>=a.numSlides&&(a._loop=!1);a._loopHelpers=a._loop&&a._isMove?2===a.numSlides?1:2:0;a._maxImages=6>a.numSlides?a.numSlides:6;a._currBlockIndex=0;a._idOffset=0;a.slidesJQ=[];for(d=0;d<a.numSlides;d++)a.slidesJQ.push(l('<div style="'+(a._isMove?"":
d!==a.currSlideId?a._opacityCSS:"z-index:0;")+'" class="rsSlide "></div>'));a._sliderOverflow=f=l(f+"</div></div>");k=function(b,c,d,f,e){a._downEvent=b+c;a._moveEvent=b+d;a._upEvent=b+f;e&&(a._cancelEvent=b+e)};d=c.pointerEnabled;a.pointerEnabled=d||c.msPointerEnabled;a.pointerEnabled?(a.hasTouch=!1,a._lastItemFriction=.2,a.pointerMultitouch=1<c[(d?"m":"msM")+"axTouchPoints"],d?k("pointer","down","move","up","cancel"):k("MSPointer","Down","Move","Up","Cancel")):(a.isIOS?a._downEvent=a._moveEvent=
a._upEvent=a._cancelEvent="":k("mouse","down","move","up"),"ontouchstart"in window||"createTouch"in document?(a.hasTouch=!0,a._downEvent+=" touchstart",a._moveEvent+=" touchmove",a._upEvent+=" touchend",a._cancelEvent+=" touchcancel",a._lastItemFriction=.5,a.st.sliderTouch&&(a._hasDrag=!0)):(a.hasTouch=!1,a._lastItemFriction=.2));a.st.sliderDrag&&(a._hasDrag=!0,h.msie||h.opera?a._grabCursor=a._grabbingCursor="move":h.mozilla?(a._grabCursor="-moz-grab",a._grabbingCursor="-moz-grabbing"):h.webkit&&
-1!=c.platform.indexOf("Mac")&&(a._grabCursor="-webkit-grab",a._grabbingCursor="-webkit-grabbing"),a._setGrabCursor());a.slider.html(f);a._controlsContainer=a.st.controlsInside?a._sliderOverflow:a.slider;a._slidesContainer=a._sliderOverflow.children(".rsContainer");a.pointerEnabled&&a._slidesContainer.css((d?"":"-ms-")+"touch-action",a._slidesHorizontal?"pan-y":"pan-x");a._preloader=l('<div class="rsPreloader"></div>');c=a._slidesContainer.children(".rsSlide");a._currHolder=a.slidesJQ[a.currSlideId];
a._selectedSlideHolder=0;a._eventCallbacks={dragStart:function(b){a._onDragStart(b)},dragStartThumb:function(b){a._onDragStart(b,!0)},touchmoveFix:function(){}};a._useCSS3Transitions?(a._TP="transition-property",a._TD="transition-duration",a._TTF="transition-timing-function",a._yProp=a._xProp=a._vendorPref+"transform",a._use3dTransform?(h.webkit&&!h.chrome&&a.slider.addClass("rsWebkit3d"),a._tPref1="translate3d(",a._tPref2="px, ",a._tPref3="px, 0px)"):(a._tPref1="translate(",a._tPref2="px, ",a._tPref3=
"px)"),a._isMove?a._slidesContainer[a._vendorPref+a._TP]=a._vendorPref+"transform":(h={},h[a._vendorPref+a._TP]="opacity",h[a._vendorPref+a._TD]=a.st.transitionSpeed+"ms",h[a._vendorPref+a._TTF]=a.st.css3easeInOut,c.css(h))):(a._xProp="left",a._yProp="top");a._slidesHorizontal&&a.slider.css("touch-action","pan-y");var n;l(window).on("resize"+a.ns,function(){n&&clearTimeout(n);n=setTimeout(function(){a.updateSliderSize()},50)});a.ev.trigger("rsAfterPropsSetup");a.updateSliderSize();a.st.keyboardNavEnabled&&
a._bindKeyboardNav();a.st.arrowsNavHideOnTouch&&(a.hasTouch||a.pointerMultitouch)&&(a.st.arrowsNav=!1);a.st.arrowsNav&&(c=a._controlsContainer,l('<div class="rsArrow rsArrowLeft"><div class="rsArrowIcn"></div></div><div class="rsArrow rsArrowRight"><div class="rsArrowIcn"></div></div>').appendTo(c),a._arrowLeft=c.children(".rsArrowLeft").click(function(b){b.preventDefault();a.prev()}),a._arrowRight=c.children(".rsArrowRight").click(function(b){b.preventDefault();a.next()}),a.st.arrowsNavAutoHide&&
!a.hasTouch&&(a._arrowLeft.addClass("rsHidden"),a._arrowRight.addClass("rsHidden"),c.one("mousemove.arrowshover",function(){a._arrowLeft.removeClass("rsHidden");a._arrowRight.removeClass("rsHidden")}),c.hover(function(){a._arrowsAutoHideLocked||(a._arrowLeft.removeClass("rsHidden"),a._arrowRight.removeClass("rsHidden"))},function(){a._arrowsAutoHideLocked||(a._arrowLeft.addClass("rsHidden"),a._arrowRight.addClass("rsHidden"))})),a.ev.on("rsOnUpdateNav",function(){a._updateArrowsNav()}),a._updateArrowsNav());
a.hasTouch&&a.st.sliderTouch||!a.hasTouch&&a.st.sliderDrag?(a._bindPassiveEvent(a._slidesContainer[0],a._downEvent,a._eventCallbacks.dragStart,!1),a._bindPassiveEvent(a.slider[0],a._moveEvent,a._eventCallbacks.touchmoveFix,!1)):a.dragSuccess=!1;var r=["rsPlayBtnIcon","rsPlayBtn","rsCloseVideoBtn","rsCloseVideoIcn"];a._slidesContainer.click(function(b){if(!a.dragSuccess){var c=l(b.target).attr("class");if(-1!==l.inArray(c,r)&&a.toggleVideo())return!1;if(a.st.navigateByClick&&!a._blockActions){if(l(b.target).closest(".rsNoDrag",
a._currHolder).length)return!0;a._mouseNext(b)}a.ev.trigger("rsSlideClick",b)}}).on("click.rs","a",function(b){if(a.dragSuccess)return!1;a._blockActions=!0;setTimeout(function(){a._blockActions=!1},3)});a.ev.trigger("rsAfterInit")}l.rsModules||(l.rsModules={uid:0});v.prototype={constructor:v,_mouseNext:function(b){b=b[this._slidesHorizontal?"pageX":"pageY"]-this._sliderOffset;b>=this._nextSlidePos?this.next():0>b&&this.prev()},_refreshNumPreloadImages:function(){var b=this.st.numImagesToPreload;if(this._loop=
this.st.loop)2===this.numSlides?(this._loop=!1,this.st.loopRewind=!0):2>this.numSlides&&(this.st.loopRewind=this._loop=!1);this._loop&&0<b&&(4>=this.numSlides?b=1:this.st.numImagesToPreload>(this.numSlides-1)/2&&(b=Math.floor((this.numSlides-1)/2)));this._numPreloadImages=b},_parseNode:function(b,e){function d(b,d){d?c.images.push(b.attr(d)):c.images.push(b.text());if(g){g=!1;c.caption="src"===d?b.attr("alt"):b.contents();c.image=c.images[0];c.videoURL=b.attr("data-rsVideo");var f=b.attr("data-rsw"),
e=b.attr("data-rsh");"undefined"!==typeof f&&!1!==f&&"undefined"!==typeof e&&!1!==e?(c.iW=parseInt(f,10),c.iH=parseInt(e,10)):a.st.imgWidth&&a.st.imgHeight&&(c.iW=a.st.imgWidth,c.iH=a.st.imgHeight)}}var a=this,c={},g=!0;b=l(b);a._currContent=b;a.ev.trigger("rsBeforeParseNode",[b,c]);if(!c.stopParsing){b=a._currContent;c.id=a._idCount;c.contentAdded=!1;a._idCount++;c.images=[];c.isBig=!1;if(!c.hasCover){if(b.hasClass("rsImg")){var f=b;var h=!0}else f=b.find(".rsImg"),f.length&&(h=!0);h?(c.bigImage=
f.eq(0).attr("data-rsBigImg"),f.each(function(){var a=l(this);a.is("a")?d(a,"href"):a.is("img")?d(a,"src"):d(a)})):b.is("img")&&(b.addClass("rsImg rsMainSlideImage"),d(b,"src"))}f=b.find(".rsCaption");f.length&&(c.caption=f.remove());c.content=b;a.ev.trigger("rsAfterParseNode",[b,c]);e&&a.slides.push(c);0===c.images.length&&(c.isLoaded=!0,c.isRendered=!1,c.isLoading=!1,c.images=null);return c}},_bindKeyboardNav:function(){var b=this,e,d,a=function(a){37===a?b.prev():39===a&&b.next()};b._doc.on("keydown"+
b.ns,function(c){if(!b.st.keyboardNavEnabled)return!0;if(!(b._isDragging||(d=c.keyCode,37!==d&&39!==d||e))){if(document.activeElement&&/(INPUT|SELECT|TEXTAREA)/i.test(document.activeElement.tagName))return!0;b.isFullscreen&&c.preventDefault();a(d);e=setInterval(function(){a(d)},700)}}).on("keyup"+b.ns,function(a){e&&(clearInterval(e),e=null)})},goTo:function(b,e){b!==this.currSlideId&&this._moveTo(b,this.st.transitionSpeed,!0,!e)},destroy:function(b){this.ev.trigger("rsBeforeDestroy");this._doc.off("keydown"+
this.ns+" keyup"+this.ns);this._eventCallbacks.dragMove&&(this._unbindPassiveEvent(document,this._moveEvent,this._eventCallbacks.dragMove,!0),this._unbindPassiveEvent(document,this._upEvent,this._eventCallbacks.dragRelease,!0));this._eventCallbacks.downEvent&&(this._unbindPassiveEvent(this._slidesContainer[0],this._downEvent,this._eventCallbacks.dragStart,!1),this._unbindPassiveEvent(this.slider[0],this._moveEvent,this._eventCallbacks.touchmoveFix,!1));this._slidesContainer.off(this._downEvent+" click");
this.slider.data("royalSlider",null);l.removeData(this.slider,"royalSlider");l(window).off("resize"+this.ns);this.loadingTimeout&&clearTimeout(this.loadingTimeout);b&&this.slider.remove();this.ev=this.slider=this.slides=null},_updateBlocksContent:function(b,e){function d(d,e,g){d.isAdded?(a(e,d),c(e,d)):(g||(g=f.slidesJQ[e]),d.holder?g=d.holder:(g=f.slidesJQ[e]=l(g),d.holder=g),d.appendOnLoaded=!1,c(e,d,g),a(e,d),f._addBlockToContainer(d,g,b),d.isAdded=!0)}function a(a,c){c.contentAdded||(f.setItemHtml(c,
b),b||(c.contentAdded=!0))}function c(a,b,c){f._isMove&&(c||(c=f.slidesJQ[a]),c.css(f._reorderProp,(a+f._idOffset+x)*f._slideSize))}function g(a){if(m){if(a>p-1)return g(a-p);if(0>a)return g(p+a)}return a}var f=this,h,k,m=f._loop,p=f.numSlides;if(!isNaN(e))return g(e);var n=f.currSlideId,r=b?Math.abs(f._prevSlideId-f.currSlideId)>=f.numSlides-1?0:1:f._numPreloadImages,t=Math.min(2,r),w=!1,u=!1;for(k=n;k<n+1+t;k++){var q=g(k);if((h=f.slides[q])&&(!h.isAdded||!h.positionSet)){w=!0;break}}for(k=n-1;k>
n-1-t;k--)if(q=g(k),(h=f.slides[q])&&(!h.isAdded||!h.positionSet)){u=!0;break}if(w)for(k=n;k<n+r+1;k++){q=g(k);var x=Math.floor((f._realId-(n-k))/f.numSlides)*f.numSlides;(h=f.slides[q])&&d(h,q)}if(u)for(k=n-1;k>n-1-r;k--)q=g(k),x=Math.floor((f._realId-(n-k))/p)*p,(h=f.slides[q])&&d(h,q);if(!b)for(t=g(n-r),n=g(n+r),r=t>n?0:t,k=0;k<p;k++)t>n&&k>t-1||!(k<r||k>n)||(h=f.slides[k])&&h.holder&&(h.holder.detach(),h.isAdded=!1)},setItemHtml:function(b,e){var d=this,a=function(){if(!b.images)b.isRendered=
!0,b.isLoaded=!0,b.isLoading=!1,f(!0);else if(!b.isLoading){if(b.content.hasClass("rsImg")){var a=b.content;var e=!0}else a=b.content.find(".rsImg:not(img)");a&&!a.is("img")&&a.each(function(){var a=l(this),c='<img class="rsImg" src="'+(a.is("a")?a.attr("href"):a.text())+'" />';e?b.content=l(c):a.replaceWith(c)});a=e?b.content:b.content.find("img.rsImg");k();a.eq(0).addClass("rsMainSlideImage");b.iW&&b.iH&&(b.isLoaded||d._resizeImage(b),f());b.isLoading=!0;if(b.isBig)l("<img />").on("load.rs error.rs",
function(a){l(this).off("load.rs error.rs");c([this],!0)}).attr("src",b.image);else{b.loaded=[];b.numStartedLoad=0;a=function(a){l(this).off("load.rs error.rs");b.loaded.push(this);b.loaded.length===b.numStartedLoad&&c(b.loaded,!1)};for(var g=0;g<b.images.length;g++){var h=l("<img />");b.numStartedLoad++;h.on("load.rs error.rs",a).attr("src",b.images[g])}}}},c=function(a,c){if(a.length){var d=a[0];if(c!==b.isBig)(d=b.holder.children())&&1<d.length&&m();else if(b.iW&&b.iH)g();else if(b.iW=d.width,
b.iH=d.height,b.iW&&b.iH)g();else{var e=new Image;e.onload=function(){e.width?(b.iW=e.width,b.iH=e.height,g()):setTimeout(function(){e.width&&(b.iW=e.width,b.iH=e.height);g()},1E3)};e.src=d.src}}else g()},g=function(){b.isLoaded=!0;b.isLoading=!1;f();m();h()},f=function(){if(!b.isAppended&&d.ev){var a=d.st.visibleNearby,c=b.id-d._newSlideId;e||b.appendOnLoaded||!d.st.fadeinLoadedSlide||0!==c&&(!(a||d._isAnimating||d._isDragging)||-1!==c&&1!==c)||(a={visibility:"visible",opacity:0},a[d._vendorPref+
"transition"]="opacity 400ms ease-in-out",b.content.css(a),setTimeout(function(){b.content.css("opacity",1)},16));b.holder.find(".rsPreloader").length?b.holder.append(b.content):b.holder.html(b.content);b.isAppended=!0;b.isLoaded&&(d._resizeImage(b),h());b.sizeReady||(b.sizeReady=!0,setTimeout(function(){d.ev.trigger("rsMaybeSizeReady",b)},100))}},h=function(){!b.loadedTriggered&&d.ev&&(b.isLoaded=b.loadedTriggered=!0,b.holder.trigger("rsAfterContentSet"),d.ev.trigger("rsAfterContentSet",b))},k=function(){d.st.usePreloader&&
b.holder.html(d._preloader.clone())},m=function(a){d.st.usePreloader&&(a=b.holder.find(".rsPreloader"),a.length&&a.remove())};b.isLoaded?f():e?!d._isMove&&b.images&&b.iW&&b.iH?a():(b.holder.isWaiting=!0,k(),b.holder.slideId=-99):a()},_addBlockToContainer:function(b,e,d){this._slidesContainer.append(b.holder);b.appendOnLoaded=!1},_onDragStart:function(b,e){var d=this,a="touchstart"===b.type;d._isTouchGesture=a;d.ev.trigger("rsDragStart");if(l(b.target).closest(".rsNoDrag",d._currHolder).length)return d.dragSuccess=
!1,!0;!e&&d._isAnimating&&(d._wasAnimating=!0,d._stopAnimation());d.dragSuccess=!1;if(d._isDragging)a&&(d._multipleTouches=!0);else{a&&(d._multipleTouches=!1);d._setGrabbingCursor();if(a){var c=b.touches;if(c&&0<c.length){var g=c[0];1<c.length&&(d._multipleTouches=!0)}else return}else b.preventDefault(),g=b;d._isDragging=!0;d._eventCallbacks.dragMove&&(d._unbindPassiveEvent(document,d._moveEvent,d._eventCallbacks.dragMove,!0),d._unbindPassiveEvent(document,d._upEvent,d._eventCallbacks.dragRelease,
!0));d._eventCallbacks.dragMove=function(a){d._onDragMove(a,e)};d._eventCallbacks.dragRelease=function(a){d._onDragRelease(a,e)};d._bindPassiveEvent(document,d._moveEvent,d._eventCallbacks.dragMove,!0);d._bindPassiveEvent(document,d._upEvent,d._eventCallbacks.dragRelease,!0);d._currMoveAxis="";d._hasMoved=!1;d._pageX=g.pageX;d._pageY=g.pageY;d._startPagePos=d._accelerationPos=(e?d._thumbsHorizontal:d._slidesHorizontal)?g.pageX:g.pageY;d._horDir=0;d._verDir=0;d._currRenderPosition=e?d._thumbsPosition:
d._sPosition;d._startTime=(new Date).getTime();if(a)d._sliderOverflow.on(d._cancelEvent,function(a){d._onDragRelease(a,e)})}},_renderMovement:function(b,e){if(this._checkedAxis){var d=this._renderMoveTime,a=b.pageX-this._pageX,c=b.pageY-this._pageY,g=this._currRenderPosition+a,f=this._currRenderPosition+c,h=e?this._thumbsHorizontal:this._slidesHorizontal;g=h?g:f;f=this._currMoveAxis;this._hasMoved=!0;this._pageX=b.pageX;this._pageY=b.pageY;"x"===f&&0!==a?this._horDir=0<a?1:-1:"y"===f&&0!==c&&(this._verDir=
0<c?1:-1);f=h?this._pageX:this._pageY;a=h?a:c;e?g>this._thumbsMinPosition?g=this._currRenderPosition+a*this._lastItemFriction:g<this._thumbsMaxPosition&&(g=this._currRenderPosition+a*this._lastItemFriction):this._loop||(0>=this.currSlideId&&0<f-this._startPagePos&&(g=this._currRenderPosition+a*this._lastItemFriction),this.currSlideId>=this.numSlides-1&&0>f-this._startPagePos&&(g=this._currRenderPosition+a*this._lastItemFriction));this._currRenderPosition=g;200<d-this._startTime&&(this._startTime=
d,this._accelerationPos=f);e?this._setThumbsPosition(this._currRenderPosition):this._isMove&&this._setPosition(this._currRenderPosition)}},_onDragMove:function(b,e){var d=this,a="touchmove"===b.type;if(!d._isTouchGesture||a){if(a){if(d._lockAxis)return;var c=b.touches;if(c){if(1<c.length)return;var g=c[0]}else return}else g=b;d._hasMoved||(d._useCSS3Transitions&&(e?d._thumbsContainer:d._slidesContainer).css(d._vendorPref+d._TD,"0s"),function h(){d._isDragging&&(d._animFrame=requestAnimationFrame(h),
d._renderMoveEvent&&d._renderMovement(d._renderMoveEvent,e))}());if(d._checkedAxis)b.preventDefault(),d._renderMoveTime=(new Date).getTime(),d._renderMoveEvent=g;else if(c=e?d._thumbsHorizontal:d._slidesHorizontal,g=Math.abs(g.pageX-d._pageX)-Math.abs(g.pageY-d._pageY)-(c?-7:7),7<g){if(c)b.preventDefault(),d._currMoveAxis="x";else if(a){d._completeGesture(b);return}d._checkedAxis=!0}else if(-7>g){if(!c)b.preventDefault(),d._currMoveAxis="y";else if(a){d._completeGesture(b);return}d._checkedAxis=!0}}},
_completeGesture:function(b,e){this._lockAxis=!0;this._hasMoved=this._isDragging=!1;this._onDragRelease(b)},_onDragRelease:function(b,e){function d(a){return 100>a?100:500<a?500:a}function a(a,b){if(c._isMove||e)u=(-c._realId-c._idOffset)*c._slideSize,g=Math.abs(c._sPosition-u),c._currAnimSpeed=g/b,a&&(c._currAnimSpeed+=250),c._currAnimSpeed=d(c._currAnimSpeed),c._animateTo(u,!1)}var c=this,g;var f=-1<b.type.indexOf("touch");if(!c._isTouchGesture||f)if(c._isTouchGesture=!1,c.ev.trigger("rsDragRelease"),
c._renderMoveEvent=null,c._isDragging=!1,c._lockAxis=!1,c._checkedAxis=!1,c._renderMoveTime=0,cancelAnimationFrame(c._animFrame),c._hasMoved&&(e?c._setThumbsPosition(c._currRenderPosition):c._isMove&&c._setPosition(c._currRenderPosition)),c._eventCallbacks.dragMove&&(c._unbindPassiveEvent(document,c._moveEvent,c._eventCallbacks.dragMove,!0),c._unbindPassiveEvent(document,c._upEvent,c._eventCallbacks.dragRelease,!0)),f&&c._sliderOverflow.off(c._cancelEvent),c._setGrabCursor(),!c._hasMoved&&!c._multipleTouches&&
e&&c._thumbsEnabled){var h=l(b.target).closest(".rsNavItem");h.length&&c.goTo(h.index())}else{h=e?c._thumbsHorizontal:c._slidesHorizontal;if(!c._hasMoved||"y"===c._currMoveAxis&&h||"x"===c._currMoveAxis&&!h)if(!e&&c._wasAnimating){c._wasAnimating=!1;if(c.st.navigateByClick){c._mouseNext(b);c.dragSuccess=!0;return}c.dragSuccess=!0}else{c._wasAnimating=!1;c.dragSuccess=!1;return}else c.dragSuccess=!0;c._wasAnimating=!1;c._currMoveAxis="";var k=c.st.minSlideOffset;f=f?b.changedTouches[0]:b;var m=h?f.pageX:
f.pageY,p=c._startPagePos,n=c.currSlideId,r=c.numSlides,t=h?c._horDir:c._verDir,v=c._loop;f=m-c._accelerationPos;h=(new Date).getTime()-c._startTime;h=Math.abs(f)/h;if(0===t||1>=r)a(!0,h);else{if(!v&&!e)if(0>=n){if(0<t){a(!0,h);return}}else if(n>=r-1&&0>t){a(!0,h);return}if(e){var u=c._thumbsPosition;if(u>c._thumbsMinPosition)u=c._thumbsMinPosition;else if(u<c._thumbsMaxPosition)u=c._thumbsMaxPosition;else{m=h*h/.006;var q=-c._thumbsPosition;p=c._thumbsContainerSize-c._thumbsViewportSize+c._thumbsPosition;
0<f&&m>q?(q+=c._thumbsViewportSize/(15/(m/h*.003)),h=h*q/m,m=q):0>f&&m>p&&(p+=c._thumbsViewportSize/(15/(m/h*.003)),h=h*p/m,m=p);q=Math.max(Math.round(h/.003),50);u+=m*(0>f?-1:1);if(u>c._thumbsMinPosition){c._animateThumbsTo(u,q,!0,c._thumbsMinPosition,200);return}if(u<c._thumbsMaxPosition){c._animateThumbsTo(u,q,!0,c._thumbsMaxPosition,200);return}}c._animateThumbsTo(u,q,!0)}else q=function(a){var b=Math.floor(a/c._slideSize);a-b*c._slideSize>k&&b++;return b},p+k<m?0>t?a(!1,h):(q=q(m-p),c._moveTo(c.currSlideId-
q,d(Math.abs(c._sPosition-(-c._realId-c._idOffset+q)*c._slideSize)/h),!1,!0,!0)):p-k>m?0<t?a(!1,h):(q=q(p-m),c._moveTo(c.currSlideId+q,d(Math.abs(c._sPosition-(-c._realId-c._idOffset-q)*c._slideSize)/h),!1,!0,!0)):a(!1,h)}}},_setPosition:function(b){b=this._sPosition=b;this._useCSS3Transitions?this._slidesContainer.css(this._xProp,this._tPref1+(this._slidesHorizontal?b+this._tPref2+0:0+this._tPref2+b)+this._tPref3):this._slidesContainer.css(this._slidesHorizontal?this._xProp:this._yProp,b)},updateSliderSize:function(b){if(this.slider){if(this.st.autoScaleSlider){var e=
this.st.autoScaleSliderWidth,d=this.st.autoScaleSliderHeight;if(this.st.autoScaleHeight){var a=this.slider.width();a!=this.width&&(this.slider.css("height",d/e*a),a=this.slider.width());var c=this.slider.height()}else c=this.slider.height(),c!=this.height&&(this.slider.css("width",e/d*c),c=this.slider.height()),a=this.slider.width()}else a=this.slider.width(),c=this.slider.height();if(b||a!=this.width||c!=this.height){this.width=a;this.height=c;this._wrapWidth=a;this._wrapHeight=c;this.ev.trigger("rsBeforeSizeSet");
this.ev.trigger("rsAfterSizePropSet");this._sliderOverflow.css({width:this._wrapWidth,height:this._wrapHeight});this._slideSize=(this._slidesHorizontal?this._wrapWidth:this._wrapHeight)+this.st.slidesSpacing;this._imagePadding=this.st.imageScalePadding;for(a=0;a<this.slides.length;a++)b=this.slides[a],b.positionSet=!1,b&&b.images&&b.isLoaded&&(b.isRendered=!1,this._resizeImage(b));if(this._cloneHolders)for(a=0;a<this._cloneHolders.length;a++)b=this._cloneHolders[a],b.holder.css(this._reorderProp,
(b.id+this._idOffset)*this._slideSize);this._updateBlocksContent();this._isMove&&(this._useCSS3Transitions&&this._slidesContainer.css(this._vendorPref+"transition-duration","0s"),this._setPosition((-this._realId-this._idOffset)*this._slideSize));this.ev.trigger("rsOnUpdateNav")}this._sliderOffset=this._sliderOverflow.offset();this._sliderOffset=this._sliderOffset[this._reorderProp]}},appendSlide:function(b,e){var d=this._parseNode(b);if(isNaN(e)||e>this.numSlides)e=this.numSlides;this.slides.splice(e,
0,d);this.slidesJQ.splice(e,0,l('<div style="'+(this._isMove?"position:absolute;":this._opacityCSS)+'" class="rsSlide"></div>'));e<=this.currSlideId&&this.currSlideId++;this.ev.trigger("rsOnAppendSlide",[d,e]);this._refreshSlides(e);e===this.currSlideId&&this.ev.trigger("rsAfterSlideChange")},removeSlide:function(b){var e=this.slides[b];e&&(e.holder&&e.holder.remove(),b<this.currSlideId&&this.currSlideId--,this.slides.splice(b,1),this.slidesJQ.splice(b,1),this.ev.trigger("rsOnRemoveSlide",[b]),this._refreshSlides(b),
b===this.currSlideId&&this.ev.trigger("rsAfterSlideChange"))},_refreshSlides:function(b){var e=this;b=e.numSlides;b=0>=e._realId?0:Math.floor(e._realId/b);e.numSlides=e.slides.length;0===e.numSlides?(e.currSlideId=e._idOffset=e._realId=0,e.currSlide=e._oldHolder=null):e._realId=b*e.numSlides+e.currSlideId;for(b=0;b<e.numSlides;b++)e.slides[b].id=b;e.currSlide=e.slides[e.currSlideId];e._currHolder=e.slidesJQ[e.currSlideId];e.currSlideId>=e.numSlides?e.goTo(e.numSlides-1):0>e.currSlideId&&e.goTo(0);
e._refreshNumPreloadImages();e._isMove&&e._slidesContainer.css(e._vendorPref+e._TD,"0ms");e._refreshSlidesTimeout&&clearTimeout(e._refreshSlidesTimeout);e._refreshSlidesTimeout=setTimeout(function(){e._isMove&&e._setPosition((-e._realId-e._idOffset)*e._slideSize);e._updateBlocksContent();e._isMove||e._currHolder.css({display:"block",opacity:1})},14);e.ev.trigger("rsOnUpdateNav")},_setGrabCursor:function(){this._hasDrag&&this._isMove&&(this._grabCursor?this._sliderOverflow.css("cursor",this._grabCursor):
(this._sliderOverflow.removeClass("grabbing-cursor"),this._sliderOverflow.addClass("grab-cursor")))},_setGrabbingCursor:function(){this._hasDrag&&this._isMove&&(this._grabbingCursor?this._sliderOverflow.css("cursor",this._grabbingCursor):(this._sliderOverflow.removeClass("grab-cursor"),this._sliderOverflow.addClass("grabbing-cursor")))},next:function(b){this._moveTo("next",this.st.transitionSpeed,!0,!b)},prev:function(b){this._moveTo("prev",this.st.transitionSpeed,!0,!b)},_moveTo:function(b,e,d,a,
c){var g=this;g.ev.trigger("rsBeforeMove",[b,a]);var f="next"===b?g.currSlideId+1:"prev"===b?g.currSlideId-1:b=parseInt(b,10);if(!g._loop){if(0>f){g._doBackAndForthAnim("left",!a);return}if(f>=g.numSlides){g._doBackAndForthAnim("right",!a);return}}g._isAnimating&&(g._stopAnimation(!0),d=!1);var h=f-g.currSlideId;f=g._prevSlideId=g.currSlideId;var k=g.currSlideId+h;a=g._realId;var m;g._loop?(k=g._updateBlocksContent(!1,k),a+=h):a=k;g._newSlideId=k;g._oldHolder=g.slidesJQ[g.currSlideId];g._realId=a;
g.currSlideId=g._newSlideId;g.currSlide=g.slides[g.currSlideId];g._currHolder=g.slidesJQ[g.currSlideId];k=g.st.slidesDiff;var l=0<h;h=Math.abs(h);var n=Math.floor(f/g._numPreloadImages),r=Math.floor((f+(l?k:-k))/g._numPreloadImages);n=(l?Math.max(n,r):Math.min(n,r))*g._numPreloadImages+(l?g._numPreloadImages-1:0);n>g.numSlides-1?n=g.numSlides-1:0>n&&(n=0);f=l?n-f:f-n;f>g._numPreloadImages&&(f=g._numPreloadImages);if(h>f+k)for(g._idOffset+=(h-(f+k))*(l?-1:1),e*=1.4,f=0;f<g.numSlides;f++)g.slides[f].positionSet=
!1;g._currAnimSpeed=e;g._updateBlocksContent(!0);c||(m=!0);var t=(-a-g._idOffset)*g._slideSize;m?setTimeout(function(){g._isWorking=!1;g._animateTo(t,b,!1,d);g.ev.trigger("rsOnUpdateNav")},0):(g._animateTo(t,b,!1,d),g.ev.trigger("rsOnUpdateNav"))},_updateArrowsNav:function(){this.st.arrowsNav&&(1>=this.numSlides?(this._arrowLeft.css("display","none"),this._arrowRight.css("display","none")):(this._arrowLeft.css("display","block"),this._arrowRight.css("display","block"),this._loop||this.st.loopRewind||
(0===this.currSlideId?this._arrowLeft.addClass("rsArrowDisabled"):this._arrowLeft.removeClass("rsArrowDisabled"),this.currSlideId===this.numSlides-1?this._arrowRight.addClass("rsArrowDisabled"):this._arrowRight.removeClass("rsArrowDisabled"))))},_animateTo:function(b,e,d,a,c){function g(){var a;k&&(a=k.data("rsTimeout"))&&(k!==m&&k.css({opacity:0,display:"none",zIndex:0}),clearTimeout(a),k.data("rsTimeout",""));if(a=m.data("rsTimeout"))clearTimeout(a),m.data("rsTimeout","")}var f=this,h={};isNaN(f._currAnimSpeed)&&
(f._currAnimSpeed=400);f._sPosition=f._currRenderPosition=b;f.ev.trigger("rsBeforeAnimStart");if(f._useCSS3Transitions)if(f._isMove)f._currAnimSpeed=parseInt(f._currAnimSpeed,10),d=f._vendorPref+f._TTF,h[f._vendorPref+f._TD]=f._currAnimSpeed+"ms",h[d]=a?l.rsCSS3Easing[f.st.easeInOut]:l.rsCSS3Easing[f.st.easeOut],f._slidesContainer.css(h),a||!f.hasTouch?setTimeout(function(){f._setPosition(b)},5):f._setPosition(b);else{f._currAnimSpeed=f.st.transitionSpeed;var k=f._oldHolder;var m=f._currHolder;m.data("rsTimeout")&&
m.css("opacity",0);g();k&&k.data("rsTimeout",setTimeout(function(){h[f._vendorPref+f._TD]="0ms";h.zIndex=0;h.display="none";k.data("rsTimeout","");k.css(h);setTimeout(function(){k.css("opacity",0)},16)},f._currAnimSpeed+60));h.display="block";h.zIndex=f._fadeZIndex;h.opacity=0;h[f._vendorPref+f._TD]="0ms";h[f._vendorPref+f._TTF]=l.rsCSS3Easing[f.st.easeInOut];m.css(h);m.data("rsTimeout",setTimeout(function(){m.css(f._vendorPref+f._TD,f._currAnimSpeed+"ms");m.data("rsTimeout",setTimeout(function(){m.css("opacity",
1);m.data("rsTimeout","")},20))},20))}else f._isMove?(h[f._slidesHorizontal?f._xProp:f._yProp]=b+"px",f._slidesContainer.animate(h,f._currAnimSpeed,a?f.st.easeInOut:f.st.easeOut)):(k=f._oldHolder,m=f._currHolder,m.stop(!0,!0).css({opacity:0,display:"block",zIndex:f._fadeZIndex}),f._currAnimSpeed=f.st.transitionSpeed,m.animate({opacity:1},f._currAnimSpeed,f.st.easeInOut),g(),k&&k.data("rsTimeout",setTimeout(function(){k.stop(!0,!0).css({opacity:0,display:"none",zIndex:0})},f._currAnimSpeed+60)));f._isAnimating=
!0;f.loadingTimeout&&clearTimeout(f.loadingTimeout);f.loadingTimeout=c?setTimeout(function(){f.loadingTimeout=null;c.call()},f._currAnimSpeed+60):setTimeout(function(){f.loadingTimeout=null;f._animationComplete(e)},f._currAnimSpeed+60)},_stopAnimation:function(b){this._isAnimating=!1;clearTimeout(this.loadingTimeout);if(this._isMove)if(!this._useCSS3Transitions)this._slidesContainer.stop(!0),this._sPosition=parseInt(this._slidesContainer.css(this._slidesHorizontal?this._xProp:this._yProp),10);else{if(!b){b=
this._sPosition;var e=this._currRenderPosition=this._getTransformProp();this._slidesContainer.css(this._vendorPref+this._TD,"0ms");b!==e&&this._setPosition(e)}}else 20<this._fadeZIndex?this._fadeZIndex=10:this._fadeZIndex++},_getTransformProp:function(){var b=window.getComputedStyle(this._slidesContainer.get(0),null).getPropertyValue(this._vendorPref+"transform").replace(/^matrix\(/i,"").split(/, |\)$/g),e=0===b[0].indexOf("matrix3d");return parseInt(b[this._slidesHorizontal?e?12:4:e?13:5],10)},_getCSS3Prop:function(b,
e){return this._useCSS3Transitions?this._tPref1+(e?b+this._tPref2+0:0+this._tPref2+b)+this._tPref3:b},_animationComplete:function(b){this._isMove||(this._currHolder.css("z-index",0),this._fadeZIndex=10);this._isAnimating=!1;this.staticSlideId=this.currSlideId;this._updateBlocksContent();this._slidesMoved=!1;this.ev.trigger("rsAfterSlideChange")},_doBackAndForthAnim:function(b,e){var d=this,a=(-d._realId-d._idOffset)*d._slideSize;if(0!==d.numSlides&&!d._isAnimating)if(d.st.loopRewind)d.goTo("left"===
b?d.numSlides-1:0,e);else if(d._isMove){d._currAnimSpeed=200;var c=function(){d._isAnimating=!1};d._animateTo(a+("left"===b?30:-30),"",!1,!0,function(){d._isAnimating=!1;d._animateTo(a,"",!1,!0,c)})}},_detectPassiveSupport:function(){var b=this;if(!b._passiveChecked){b._passiveChecked=!0;b._passiveParam=!1;try{var e=Object.defineProperty({},"passive",{get:function(){b._passiveParam={passive:!1}}});window.addEventListener("testPassive",null,e);window.removeEventListener("testPassive",null,e)}catch(d){}}},
_bindPassiveEvent:function(b,e,d,a){this._detectPassiveSupport();e=e.split(" ");for(var c=0;c<e.length;c++)e[c]&&2<e[c].length&&b.addEventListener(e[c],d,a?this._passiveParam:!1)},_unbindPassiveEvent:function(b,e,d,a){this._detectPassiveSupport();e=e.split(" ");for(var c=0;c<e.length;c++)e[c]&&2<e[c].length&&b.removeEventListener(e[c],d,a?this._passiveParam:!1)},_resizeImage:function(b,e){if(!b.isRendered){var d=b.content,a="rsMainSlideImage",c=l.isFunction(this.st.imageAlignCenter)?this.st.imageAlignCenter(b):
this.st.imageAlignCenter,g=l.isFunction(this.st.imageScaleMode)?this.st.imageScaleMode(b):this.st.imageScaleMode;if(b.videoURL)if(a="rsVideoContainer","fill"!==g)var f=!0;else{var h=d;h.hasClass(a)||(h=h.find("."+a));h.css({width:"100%",height:"100%"});a="rsMainSlideImage"}d.hasClass(a)||(d=d.find("."+a));if(d){var k=b.iW,m=b.iH;b.isRendered=!0;if("none"!==g||c){a="fill"!==g?this._imagePadding:0;h=this._wrapWidth-2*a;var p=this._wrapHeight-2*a,n={};"fit-if-smaller"===g&&(k>h||m>p)&&(g="fit");if("fill"===
g||"fit"===g){var r=h/k;var t=p/m;r="fill"==g?r>t?r:t:"fit"==g?r<t?r:t:1;k=Math.ceil(k*r,10);m=Math.ceil(m*r,10)}"none"!==g&&(n.width=k,n.height=m,f&&d.find(".rsImg").css({width:"100%",height:"100%"}));c&&(n.marginLeft=Math.floor((h-k)/2)+a,n.marginTop=Math.floor((p-m)/2)+a);d.css(n)}}}}};l.rsProto=v.prototype;l.fn.royalSlider=function(b){var e=arguments;return this.each(function(){var d=l(this);if("object"!==typeof b&&b){if((d=d.data("royalSlider"))&&d[b])return d[b].apply(d,Array.prototype.slice.call(e,
1))}else d.data("royalSlider")||d.data("royalSlider",new v(d,b))})};l.fn.royalSlider.defaults={slidesSpacing:8,startSlideId:0,loop:!1,loopRewind:!1,numImagesToPreload:4,fadeinLoadedSlide:!0,slidesOrientation:"horizontal",transitionType:"move",transitionSpeed:600,controlNavigation:"bullets",controlsInside:!0,arrowsNav:!0,arrowsNavAutoHide:!0,navigateByClick:!0,randomizeSlides:!1,sliderDrag:!0,sliderTouch:!0,keyboardNavEnabled:!1,fadeInAfterLoaded:!0,allowCSS3:!0,allowCSS3OnWebkit:!0,addActiveClass:!1,
autoHeight:!1,easeOut:"easeOutSine",easeInOut:"easeInOutSine",minSlideOffset:10,imageScaleMode:"fit-if-smaller",imageAlignCenter:!0,imageScalePadding:4,usePreloader:!0,autoScaleSlider:!1,autoScaleSliderWidth:800,autoScaleSliderHeight:400,autoScaleHeight:!0,arrowsNavHideOnTouch:!1,globalCaption:!1,slidesDiff:2};l.rsCSS3Easing={easeOutSine:"cubic-bezier(0.390, 0.575, 0.565, 1.000)",easeInOutSine:"cubic-bezier(0.445, 0.050, 0.550, 0.950)"};l.extend(jQuery.easing,{easeInOutSine:function(b,e,d,a,c){return-a/
2*(Math.cos(Math.PI*e/c)-1)+d},easeOutSine:function(b,e,d,a,c){return a*Math.sin(e/c*(Math.PI/2))+d},easeOutCubic:function(b,e,d,a,c){return a*((e=e/c-1)*e*e+1)+d}})})(jQuery,window);
// jquery.rs.bullets v1.0.1
(function(c){c.extend(c.rsProto,{_initBullets:function(){var a=this;"bullets"===a.st.controlNavigation&&(a.ev.one("rsAfterPropsSetup",function(){a._controlNavEnabled=!0;a.slider.addClass("rsWithBullets");for(var b='<div class="rsNav rsBullets">',e=0;e<a.numSlides;e++)b+='<div class="rsNavItem rsBullet"><span></span></div>';a._controlNav=b=c(b+"</div>");a._controlNavItems=b.appendTo(a.slider).children();a._controlNav.on("click.rs",".rsNavItem",function(b){a._thumbsDrag||a.goTo(c(this).index())})}),
a.ev.on("rsOnAppendSlide",function(b,c,d){d>=a.numSlides?a._controlNav.append('<div class="rsNavItem rsBullet"><span></span></div>'):a._controlNavItems.eq(d).before('<div class="rsNavItem rsBullet"><span></span></div>');a._controlNavItems=a._controlNav.children()}),a.ev.on("rsOnRemoveSlide",function(b,c){var d=a._controlNavItems.eq(c);d&&d.length&&(d.remove(),a._controlNavItems=a._controlNav.children())}),a.ev.on("rsOnUpdateNav",function(){var b=a.currSlideId;a._prevNavItem&&a._prevNavItem.removeClass("rsNavSelected");
b=a._controlNavItems.eq(b);b.addClass("rsNavSelected");a._prevNavItem=b}))}});c.rsModules.bullets=c.rsProto._initBullets})(jQuery);// jquery.rs.autoplay v1.0.5
(function(b){b.extend(b.rsProto,{_initAutoplay:function(){var a=this,d;a._autoPlayDefaults={enabled:!1,stopAtAction:!0,pauseOnHover:!0,delay:2E3};!a.st.autoPlay&&a.st.autoplay&&(a.st.autoPlay=a.st.autoplay);a.st.autoPlay=b.extend({},a._autoPlayDefaults,a.st.autoPlay);a.st.autoPlay.enabled&&(a.ev.on("rsBeforeParseNode",function(a,c,f){c=b(c);if(d=c.attr("data-rsDelay"))f.customDelay=parseInt(d,10)}),a.ev.one("rsAfterInit",function(){a._setupAutoPlay()}),a.ev.on("rsBeforeDestroy",function(){a.stopAutoPlay();
a.slider.off("mouseenter mouseleave");b(window).off("blur"+a.ns+" focus"+a.ns)}))},_setupAutoPlay:function(){var a=this;a.startAutoPlay();a.ev.on("rsAfterContentSet",function(b,e){a._isDragging||a._isAnimating||!a._autoPlayEnabled||e!==a.currSlide||a._play()});a.ev.on("rsDragRelease",function(){a._autoPlayEnabled&&a._autoPlayPaused&&(a._autoPlayPaused=!1,a._play())});a.ev.on("rsAfterSlideChange",function(){a._autoPlayEnabled&&a._autoPlayPaused&&(a._autoPlayPaused=!1,a.currSlide.isLoaded&&a._play())});
a.ev.on("rsDragStart",function(){a._autoPlayEnabled&&(a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._autoPlayPaused=!0,a._pause()))});a.ev.on("rsBeforeMove",function(b,e,c){a._autoPlayEnabled&&(c&&a.st.autoPlay.stopAtAction?a.stopAutoPlay():(a._autoPlayPaused=!0,a._pause()))});a._pausedByVideo=!1;a.ev.on("rsVideoStop",function(){a._autoPlayEnabled&&(a._pausedByVideo=!1,a._play())});a.ev.on("rsVideoPlay",function(){a._autoPlayEnabled&&(a._autoPlayPaused=!1,a._pause(),a._pausedByVideo=!0)});b(window).on("blur"+
a.ns,function(){a._autoPlayEnabled&&(a._autoPlayPaused=!0,a._pause())}).on("focus"+a.ns,function(){a._autoPlayEnabled&&a._autoPlayPaused&&(a._autoPlayPaused=!1,a._play())});a.st.autoPlay.pauseOnHover&&(a._pausedByHover=!1,a.slider.hover(function(){a._autoPlayEnabled&&(a._autoPlayPaused=!1,a._pause(),a._pausedByHover=!0)},function(){a._autoPlayEnabled&&(a._pausedByHover=!1,a._play())}))},toggleAutoPlay:function(){this._autoPlayEnabled?this.stopAutoPlay():this.startAutoPlay()},startAutoPlay:function(){this._autoPlayEnabled=
!0;this.currSlide.isLoaded&&this._play()},stopAutoPlay:function(){this._pausedByVideo=this._pausedByHover=this._autoPlayPaused=this._autoPlayEnabled=!1;this._pause()},_play:function(){var a=this;a._pausedByHover||a._pausedByVideo||(a._autoPlayRunning=!0,a._autoPlayTimeout&&clearTimeout(a._autoPlayTimeout),a._autoPlayTimeout=setTimeout(function(){if(!a._loop&&!a.st.loopRewind){var b=!0;a.st.loopRewind=!0}a.next(!0);b&&(a.st.loopRewind=!1)},a.currSlide.customDelay?a.currSlide.customDelay:a.st.autoPlay.delay))},
_pause:function(){this._pausedByHover||this._pausedByVideo||(this._autoPlayRunning=!1,this._autoPlayTimeout&&(clearTimeout(this._autoPlayTimeout),this._autoPlayTimeout=null))}});b.rsModules.autoplay=b.rsProto._initAutoplay})(jQuery);// jquery.rs.auto-height v1.0.3
(function(b){b.extend(b.rsProto,{_initAutoHeight:function(){var a=this;if(a.st.autoHeight){var b,c,e,f=!0,d=function(d){e=a.slides[a.currSlideId];(b=e.holder)&&(c=b.height())&&void 0!==c&&c>(a.st.minAutoHeight||30)&&(a._wrapHeight=c,a._useCSS3Transitions||!d?a._sliderOverflow.css("height",c):a._sliderOverflow.stop(!0,!0).animate({height:c},a.st.transitionSpeed),a.ev.trigger("rsAutoHeightChange",c),f&&(a._useCSS3Transitions&&setTimeout(function(){a._sliderOverflow.css(a._vendorPref+"transition","height "+
a.st.transitionSpeed+"ms ease-in-out")},16),f=!1))};a.ev.on("rsMaybeSizeReady.rsAutoHeight",function(a,b){e===b&&d()});a.ev.on("rsAfterContentSet.rsAutoHeight",function(a,b){e===b&&d()});a.slider.addClass("rsAutoHeight");a.ev.one("rsAfterInit",function(){setTimeout(function(){d(!1);setTimeout(function(){a.slider.append('<div style="clear:both; float: none;"></div>')},16)},16)});a.ev.on("rsBeforeAnimStart",function(){d(!0)});a.ev.on("rsBeforeSizeSet",function(){setTimeout(function(){d(!1)},16)})}}});
b.rsModules.autoHeight=b.rsProto._initAutoHeight})(jQuery);// jquery.rs.global-caption v1.0.1
(function(b){b.extend(b.rsProto,{_initGlobalCaption:function(){var a=this;a.st.globalCaption&&(a.ev.on("rsAfterInit",function(){a.globalCaption=b('<div class="rsGCaption"></div>').appendTo(a.st.globalCaptionInside?a._sliderOverflow:a.slider);a.globalCaption.html(a.currSlide.caption||"")}),a.ev.on("rsBeforeAnimStart",function(){a.globalCaption.html(a.currSlide.caption||"")}))}});b.rsModules.globalCaption=b.rsProto._initGlobalCaption})(jQuery);
/*!
 * jQuery Smooth Scroll - v2.2.0 - 2017-05-05
 * https://github.com/kswedberg/jquery-smooth-scroll
 * Copyright (c) 2017 Karl Swedberg
 * Licensed MIT
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['jquery'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS
    factory(require('jquery'));
  } else {
    // Browser globals
    factory(jQuery);
  }
}(function($) {

  var version = '2.2.0';
  var optionOverrides = {};
  var defaults = {
    exclude: [],
    excludeWithin: [],
    offset: 0,

    // one of 'top' or 'left'
    direction: 'top',

    // if set, bind click events through delegation
    //  supported since jQuery 1.4.2
    delegateSelector: null,

    // jQuery set of elements you wish to scroll (for $.smoothScroll).
    //  if null (default), $('html, body').firstScrollable() is used.
    scrollElement: null,

    // only use if you want to override default behavior
    scrollTarget: null,

    // automatically focus the target element after scrolling to it
    autoFocus: false,

    // fn(opts) function to be called before scrolling occurs.
    // `this` is the element(s) being scrolled
    beforeScroll: function() {},

    // fn(opts) function to be called after scrolling occurs.
    // `this` is the triggering element
    afterScroll: function() {},

    // easing name. jQuery comes with "swing" and "linear." For others, you'll need an easing plugin
    // from jQuery UI or elsewhere
    easing: 'swing',

    // speed can be a number or 'auto'
    // if 'auto', the speed will be calculated based on the formula:
    // (current scroll position - target scroll position) / autoCoeffic
    speed: 400,

    // coefficient for "auto" speed
    autoCoefficient: 2,

    // $.fn.smoothScroll only: whether to prevent the default click action
    preventDefault: true
  };

  var getScrollable = function(opts) {
    var scrollable = [];
    var scrolled = false;
    var dir = opts.dir && opts.dir === 'left' ? 'scrollLeft' : 'scrollTop';

    this.each(function() {
      var el = $(this);

      if (this === document || this === window) {
        return;
      }

      if (document.scrollingElement && (this === document.documentElement || this === document.body)) {
        scrollable.push(document.scrollingElement);

        return false;
      }

      if (el[dir]() > 0) {
        scrollable.push(this);
      } else {
        // if scroll(Top|Left) === 0, nudge the element 1px and see if it moves
        el[dir](1);
        scrolled = el[dir]() > 0;

        if (scrolled) {
          scrollable.push(this);
        }
        // then put it back, of course
        el[dir](0);
      }
    });

    if (!scrollable.length) {
      this.each(function() {
        // If no scrollable elements and <html> has scroll-behavior:smooth because
        // "When this property is specified on the root element, it applies to the viewport instead."
        // and "The scroll-behavior property of the … body element is *not* propagated to the viewport."
        // → https://drafts.csswg.org/cssom-view/#propdef-scroll-behavior
        if (this === document.documentElement && $(this).css('scrollBehavior') === 'smooth') {
          scrollable = [this];
        }

        // If still no scrollable elements, fall back to <body>,
        // if it's in the jQuery collection
        // (doing this because Safari sets scrollTop async,
        // so can't set it to 1 and immediately get the value.)
        if (!scrollable.length && this.nodeName === 'BODY') {
          scrollable = [this];
        }
      });
    }

    // Use the first scrollable element if we're calling firstScrollable()
    if (opts.el === 'first' && scrollable.length > 1) {
      scrollable = [scrollable[0]];
    }

    return scrollable;
  };

  var rRelative = /^([\-\+]=)(\d+)/;

  $.fn.extend({
    scrollable: function(dir) {
      var scrl = getScrollable.call(this, {dir: dir});

      return this.pushStack(scrl);
    },
    firstScrollable: function(dir) {
      var scrl = getScrollable.call(this, {el: 'first', dir: dir});

      return this.pushStack(scrl);
    },

    smoothScroll: function(options, extra) {
      options = options || {};

      if (options === 'options') {
        if (!extra) {
          return this.first().data('ssOpts');
        }

        return this.each(function() {
          var $this = $(this);
          var opts = $.extend($this.data('ssOpts') || {}, extra);

          $(this).data('ssOpts', opts);
        });
      }

      var opts = $.extend({}, $.fn.smoothScroll.defaults, options);

      var clickHandler = function(event) {
        var escapeSelector = function(str) {
          return str.replace(/(:|\.|\/)/g, '\\$1');
        };

        var link = this;
        var $link = $(this);
        var thisOpts = $.extend({}, opts, $link.data('ssOpts') || {});
        var exclude = opts.exclude;
        var excludeWithin = thisOpts.excludeWithin;
        var elCounter = 0;
        var ewlCounter = 0;
        var include = true;
        var clickOpts = {};
        var locationPath = $.smoothScroll.filterPath(location.pathname);
        var linkPath = $.smoothScroll.filterPath(link.pathname);
        var hostMatch = location.hostname === link.hostname || !link.hostname;
        var pathMatch = thisOpts.scrollTarget || (linkPath === locationPath);
        var thisHash = escapeSelector(link.hash);

        if (thisHash && !$(thisHash).length) {
          include = false;
        }

        if (!thisOpts.scrollTarget && (!hostMatch || !pathMatch || !thisHash)) {
          include = false;
        } else {
          while (include && elCounter < exclude.length) {
            if ($link.is(escapeSelector(exclude[elCounter++]))) {
              include = false;
            }
          }

          while (include && ewlCounter < excludeWithin.length) {
            if ($link.closest(excludeWithin[ewlCounter++]).length) {
              include = false;
            }
          }
        }

        if (include) {
          if (thisOpts.preventDefault) {
            event.preventDefault();
          }

          $.extend(clickOpts, thisOpts, {
            scrollTarget: thisOpts.scrollTarget || thisHash,
            link: link
          });

          $.smoothScroll(clickOpts);
        }
      };

      if (options.delegateSelector !== null) {
        this
        .off('click.smoothscroll', options.delegateSelector)
        .on('click.smoothscroll', options.delegateSelector, clickHandler);
      } else {
        this
        .off('click.smoothscroll')
        .on('click.smoothscroll', clickHandler);
      }

      return this;
    }
  });

  var getExplicitOffset = function(val) {
    var explicit = {relative: ''};
    var parts = typeof val === 'string' && rRelative.exec(val);

    if (typeof val === 'number') {
      explicit.px = val;
    } else if (parts) {
      explicit.relative = parts[1];
      explicit.px = parseFloat(parts[2]) || 0;
    }

    return explicit;
  };

  var onAfterScroll = function(opts) {
    var $tgt = $(opts.scrollTarget);

    if (opts.autoFocus && $tgt.length) {
      $tgt[0].focus();

      if (!$tgt.is(document.activeElement)) {
        $tgt.prop({tabIndex: -1});
        $tgt[0].focus();
      }
    }

    opts.afterScroll.call(opts.link, opts);
  };

  $.smoothScroll = function(options, px) {
    if (options === 'options' && typeof px === 'object') {
      return $.extend(optionOverrides, px);
    }
    var opts, $scroller, speed, delta;
    var explicitOffset = getExplicitOffset(options);
    var scrollTargetOffset = {};
    var scrollerOffset = 0;
    var offPos = 'offset';
    var scrollDir = 'scrollTop';
    var aniProps = {};
    var aniOpts = {};

    if (explicitOffset.px) {
      opts = $.extend({link: null}, $.fn.smoothScroll.defaults, optionOverrides);
    } else {
      opts = $.extend({link: null}, $.fn.smoothScroll.defaults, options || {}, optionOverrides);

      if (opts.scrollElement) {
        offPos = 'position';

        if (opts.scrollElement.css('position') === 'static') {
          opts.scrollElement.css('position', 'relative');
        }
      }

      if (px) {
        explicitOffset = getExplicitOffset(px);
      }
    }

    scrollDir = opts.direction === 'left' ? 'scrollLeft' : scrollDir;

    if (opts.scrollElement) {
      $scroller = opts.scrollElement;

      if (!explicitOffset.px && !(/^(?:HTML|BODY)$/).test($scroller[0].nodeName)) {
        scrollerOffset = $scroller[scrollDir]();
      }
    } else {
      $scroller = $('html, body').firstScrollable(opts.direction);
    }

    // beforeScroll callback function must fire before calculating offset
    opts.beforeScroll.call($scroller, opts);

    scrollTargetOffset = explicitOffset.px ? explicitOffset : {
      relative: '',
      px: ($(opts.scrollTarget)[offPos]() && $(opts.scrollTarget)[offPos]()[opts.direction]) || 0
    };

    aniProps[scrollDir] = scrollTargetOffset.relative + (scrollTargetOffset.px + scrollerOffset + opts.offset);

    speed = opts.speed;

    // automatically calculate the speed of the scroll based on distance / coefficient
    if (speed === 'auto') {

      // $scroller[scrollDir]() is position before scroll, aniProps[scrollDir] is position after
      // When delta is greater, speed will be greater.
      delta = Math.abs(aniProps[scrollDir] - $scroller[scrollDir]());

      // Divide the delta by the coefficient
      speed = delta / opts.autoCoefficient;
    }

    aniOpts = {
      duration: speed,
      easing: opts.easing,
      complete: function() {
        onAfterScroll(opts);
      }
    };

    if (opts.step) {
      aniOpts.step = opts.step;
    }

    if ($scroller.length) {
      $scroller.stop().animate(aniProps, aniOpts);
    } else {
      onAfterScroll(opts);
    }
  };

  $.smoothScroll.version = version;
  $.smoothScroll.filterPath = function(string) {
    string = string || '';

    return string
      .replace(/^\//, '')
      .replace(/(?:index|default).[a-zA-Z]{3,4}$/, '')
      .replace(/\/$/, '');
  };

  // default options
  $.fn.smoothScroll.defaults = defaults;

}));

/*! modernizr 3.5.0 (Custom Build) | MIT *
 * https://modernizr.com/download/?-dataset-flexbox-flexboxlegacy-touchevents-setclasses !*/
!function(e,t,n){function r(e,t){return typeof e===t}function o(){var e,t,n,o,s,i,a;for(var l in x)if(x.hasOwnProperty(l)){if(e=[],t=x[l],t.name&&(e.push(t.name.toLowerCase()),t.options&&t.options.aliases&&t.options.aliases.length))for(n=0;n<t.options.aliases.length;n++)e.push(t.options.aliases[n].toLowerCase());for(o=r(t.fn,"function")?t.fn():t.fn,s=0;s<e.length;s++)i=e[s],a=i.split("."),1===a.length?Modernizr[a[0]]=o:(!Modernizr[a[0]]||Modernizr[a[0]]instanceof Boolean||(Modernizr[a[0]]=new Boolean(Modernizr[a[0]])),Modernizr[a[0]][a[1]]=o),C.push((o?"":"no-")+a.join("-"))}}function s(e){var t=S.className,n=Modernizr._config.classPrefix||"";if(w&&(t=t.baseVal),Modernizr._config.enableJSClass){var r=new RegExp("(^|\\s)"+n+"no-js(\\s|$)");t=t.replace(r,"$1"+n+"js$2")}Modernizr._config.enableClasses&&(t+=" "+n+e.join(" "+n),w?S.className.baseVal=t:S.className=t)}function i(){return"function"!=typeof t.createElement?t.createElement(arguments[0]):w?t.createElementNS.call(t,"http://www.w3.org/2000/svg",arguments[0]):t.createElement.apply(t,arguments)}function a(e,t){return!!~(""+e).indexOf(t)}function l(e){return e.replace(/([a-z])-([a-z])/g,function(e,t,n){return t+n.toUpperCase()}).replace(/^-/,"")}function u(e,t){return function(){return e.apply(t,arguments)}}function f(e,t,n){var o;for(var s in e)if(e[s]in t)return n===!1?e[s]:(o=t[e[s]],r(o,"function")?u(o,n||t):o);return!1}function c(e){return e.replace(/([A-Z])/g,function(e,t){return"-"+t.toLowerCase()}).replace(/^ms-/,"-ms-")}function d(t,n,r){var o;if("getComputedStyle"in e){o=getComputedStyle.call(e,t,n);var s=e.console;if(null!==o)r&&(o=o.getPropertyValue(r));else if(s){var i=s.error?"error":"log";s[i].call(s,"getComputedStyle returning null, its possible modernizr test results are inaccurate")}}else o=!n&&t.currentStyle&&t.currentStyle[r];return o}function p(){var e=t.body;return e||(e=i(w?"svg":"body"),e.fake=!0),e}function m(e,n,r,o){var s,a,l,u,f="modernizr",c=i("div"),d=p();if(parseInt(r,10))for(;r--;)l=i("div"),l.id=o?o[r]:f+(r+1),c.appendChild(l);return s=i("style"),s.type="text/css",s.id="s"+f,(d.fake?d:c).appendChild(s),d.appendChild(c),s.styleSheet?s.styleSheet.cssText=e:s.appendChild(t.createTextNode(e)),c.id=f,d.fake&&(d.style.background="",d.style.overflow="hidden",u=S.style.overflow,S.style.overflow="hidden",S.appendChild(d)),a=n(c,e),d.fake?(d.parentNode.removeChild(d),S.style.overflow=u,S.offsetHeight):c.parentNode.removeChild(c),!!a}function v(t,r){var o=t.length;if("CSS"in e&&"supports"in e.CSS){for(;o--;)if(e.CSS.supports(c(t[o]),r))return!0;return!1}if("CSSSupportsRule"in e){for(var s=[];o--;)s.push("("+c(t[o])+":"+r+")");return s=s.join(" or "),m("@supports ("+s+") { #modernizr { position: absolute; } }",function(e){return"absolute"==d(e,null,"position")})}return n}function h(e,t,o,s){function u(){c&&(delete j.style,delete j.modElem)}if(s=r(s,"undefined")?!1:s,!r(o,"undefined")){var f=v(e,o);if(!r(f,"undefined"))return f}for(var c,d,p,m,h,y=["modernizr","tspan","samp"];!j.style&&y.length;)c=!0,j.modElem=i(y.shift()),j.style=j.modElem.style;for(p=e.length,d=0;p>d;d++)if(m=e[d],h=j.style[m],a(m,"-")&&(m=l(m)),j.style[m]!==n){if(s||r(o,"undefined"))return u(),"pfx"==t?m:!0;try{j.style[m]=o}catch(g){}if(j.style[m]!=h)return u(),"pfx"==t?m:!0}return u(),!1}function y(e,t,n,o,s){var i=e.charAt(0).toUpperCase()+e.slice(1),a=(e+" "+z.join(i+" ")+i).split(" ");return r(t,"string")||r(t,"undefined")?h(a,t,o,s):(a=(e+" "+P.join(i+" ")+i).split(" "),f(a,t,n))}function g(e,t,r){return y(e,n,n,t,r)}var C=[],x=[],b={_version:"3.5.0",_config:{classPrefix:"",enableClasses:!0,enableJSClass:!0,usePrefixes:!0},_q:[],on:function(e,t){var n=this;setTimeout(function(){t(n[e])},0)},addTest:function(e,t,n){x.push({name:e,fn:t,options:n})},addAsyncTest:function(e){x.push({name:null,fn:e})}},Modernizr=function(){};Modernizr.prototype=b,Modernizr=new Modernizr;var S=t.documentElement,w="svg"===S.nodeName.toLowerCase();Modernizr.addTest("dataset",function(){var e=i("div");return e.setAttribute("data-a-b","c"),!(!e.dataset||"c"!==e.dataset.aB)});var _=b._config.usePrefixes?" -webkit- -moz- -o- -ms- ".split(" "):["",""];b._prefixes=_;var T="Moz O ms Webkit",z=b._config.usePrefixes?T.split(" "):[];b._cssomPrefixes=z;var P=b._config.usePrefixes?T.toLowerCase().split(" "):[];b._domPrefixes=P;var E={elem:i("modernizr")};Modernizr._q.push(function(){delete E.elem});var j={style:E.elem.style};Modernizr._q.unshift(function(){delete j.style});var N=b.testStyles=m;Modernizr.addTest("touchevents",function(){var n;if("ontouchstart"in e||e.DocumentTouch&&t instanceof DocumentTouch)n=!0;else{var r=["@media (",_.join("touch-enabled),("),"heartz",")","{#modernizr{top:9px;position:absolute}}"].join("");N(r,function(e){n=9===e.offsetTop})}return n}),b.testAllProps=y,b.testAllProps=g,Modernizr.addTest("flexbox",g("flexBasis","1px",!0)),Modernizr.addTest("flexboxlegacy",g("boxDirection","reverse",!0)),o(),s(C),delete b.addTest,delete b.addAsyncTest;for(var k=0;k<Modernizr._q.length;k++)Modernizr._q[k]();e.Modernizr=Modernizr}(window,document);
/*
     _ _      _       _
 ___| (_) ___| | __  (_)___
/ __| | |/ __| |/ /  | / __|
\__ \ | | (__|   < _ | \__ \
|___/_|_|\___|_|\_(_)/ |___/
                   |__/

 Version: 1.8.0
  Author: Ken Wheeler
 Website: http://kenwheeler.github.io
    Docs: http://kenwheeler.github.io/slick
    Repo: http://github.com/kenwheeler/slick
  Issues: http://github.com/kenwheeler/slick/issues

 */
/* global window, document, define, jQuery, setInterval, clearInterval */
;(function(factory) {
    'use strict';
    if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else if (typeof exports !== 'undefined') {
        module.exports = factory(require('jquery'));
    } else {
        factory(jQuery);
    }

}(function($) {
    'use strict';
    var Slick = window.Slick || {};

    Slick = (function() {

        var instanceUid = 0;

        function Slick(element, settings) {

            var _ = this, dataSettings;

            _.defaults = {
                accessibility: true,
                adaptiveHeight: false,
                appendArrows: $(element),
                appendDots: $(element),
                arrows: true,
                asNavFor: null,
                prevArrow: '<button class="slick-prev" aria-label="Previous" type="button">Previous</button>',
                nextArrow: '<button class="slick-next" aria-label="Next" type="button">Next</button>',
                autoplay: false,
                autoplaySpeed: 3000,
                centerMode: false,
                centerPadding: '50px',
                cssEase: 'ease',
                customPaging: function(slider, i) {
                    return $('<button type="button" />').text(i + 1);
                },
                dots: false,
                dotsClass: 'slick-dots',
                draggable: true,
                easing: 'linear',
                edgeFriction: 0.35,
                fade: false,
                focusOnSelect: false,
                focusOnChange: false,
                infinite: true,
                initialSlide: 0,
                lazyLoad: 'ondemand',
                mobileFirst: false,
                pauseOnHover: true,
                pauseOnFocus: true,
                pauseOnDotsHover: false,
                respondTo: 'window',
                responsive: null,
                rows: 1,
                rtl: false,
                slide: '',
                slidesPerRow: 1,
                slidesToShow: 1,
                slidesToScroll: 1,
                speed: 500,
                swipe: true,
                swipeToSlide: false,
                touchMove: true,
                touchThreshold: 5,
                useCSS: true,
                useTransform: true,
                variableWidth: false,
                vertical: false,
                verticalSwiping: false,
                waitForAnimate: true,
                zIndex: 1000
            };

            _.initials = {
                animating: false,
                dragging: false,
                autoPlayTimer: null,
                currentDirection: 0,
                currentLeft: null,
                currentSlide: 0,
                direction: 1,
                $dots: null,
                listWidth: null,
                listHeight: null,
                loadIndex: 0,
                $nextArrow: null,
                $prevArrow: null,
                scrolling: false,
                slideCount: null,
                slideWidth: null,
                $slideTrack: null,
                $slides: null,
                sliding: false,
                slideOffset: 0,
                swipeLeft: null,
                swiping: false,
                $list: null,
                touchObject: {},
                transformsEnabled: false,
                unslicked: false
            };

            $.extend(_, _.initials);

            _.activeBreakpoint = null;
            _.animType = null;
            _.animProp = null;
            _.breakpoints = [];
            _.breakpointSettings = [];
            _.cssTransitions = false;
            _.focussed = false;
            _.interrupted = false;
            _.hidden = 'hidden';
            _.paused = true;
            _.positionProp = null;
            _.respondTo = null;
            _.rowCount = 1;
            _.shouldClick = true;
            _.$slider = $(element);
            _.$slidesCache = null;
            _.transformType = null;
            _.transitionType = null;
            _.visibilityChange = 'visibilitychange';
            _.windowWidth = 0;
            _.windowTimer = null;

            dataSettings = $(element).data('slick') || {};

            _.options = $.extend({}, _.defaults, settings, dataSettings);

            _.currentSlide = _.options.initialSlide;

            _.originalSettings = _.options;

            if (typeof document.mozHidden !== 'undefined') {
                _.hidden = 'mozHidden';
                _.visibilityChange = 'mozvisibilitychange';
            } else if (typeof document.webkitHidden !== 'undefined') {
                _.hidden = 'webkitHidden';
                _.visibilityChange = 'webkitvisibilitychange';
            }

            _.autoPlay = $.proxy(_.autoPlay, _);
            _.autoPlayClear = $.proxy(_.autoPlayClear, _);
            _.autoPlayIterator = $.proxy(_.autoPlayIterator, _);
            _.changeSlide = $.proxy(_.changeSlide, _);
            _.clickHandler = $.proxy(_.clickHandler, _);
            _.selectHandler = $.proxy(_.selectHandler, _);
            _.setPosition = $.proxy(_.setPosition, _);
            _.swipeHandler = $.proxy(_.swipeHandler, _);
            _.dragHandler = $.proxy(_.dragHandler, _);
            _.keyHandler = $.proxy(_.keyHandler, _);

            _.instanceUid = instanceUid++;

            // A simple way to check for HTML strings
            // Strict HTML recognition (must start with <)
            // Extracted from jQuery v1.11 source
            _.htmlExpr = /^(?:\s*(<[\w\W]+>)[^>]*)$/;


            _.registerBreakpoints();
            _.init(true);

        }

        return Slick;

    }());

    Slick.prototype.activateADA = function() {
        var _ = this;

        _.$slideTrack.find('.slick-active').attr({
            'aria-hidden': 'false'
        }).find('a, input, button, select').attr({
            'tabindex': '0'
        });

    };

    Slick.prototype.addSlide = Slick.prototype.slickAdd = function(markup, index, addBefore) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            addBefore = index;
            index = null;
        } else if (index < 0 || (index >= _.slideCount)) {
            return false;
        }

        _.unload();

        if (typeof(index) === 'number') {
            if (index === 0 && _.$slides.length === 0) {
                $(markup).appendTo(_.$slideTrack);
            } else if (addBefore) {
                $(markup).insertBefore(_.$slides.eq(index));
            } else {
                $(markup).insertAfter(_.$slides.eq(index));
            }
        } else {
            if (addBefore === true) {
                $(markup).prependTo(_.$slideTrack);
            } else {
                $(markup).appendTo(_.$slideTrack);
            }
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slides.each(function(index, element) {
            $(element).attr('data-slick-index', index);
        });

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.animateHeight = function() {
        var _ = this;
        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.animate({
                height: targetHeight
            }, _.options.speed);
        }
    };

    Slick.prototype.animateSlide = function(targetLeft, callback) {

        var animProps = {},
            _ = this;

        _.animateHeight();

        if (_.options.rtl === true && _.options.vertical === false) {
            targetLeft = -targetLeft;
        }
        if (_.transformsEnabled === false) {
            if (_.options.vertical === false) {
                _.$slideTrack.animate({
                    left: targetLeft
                }, _.options.speed, _.options.easing, callback);
            } else {
                _.$slideTrack.animate({
                    top: targetLeft
                }, _.options.speed, _.options.easing, callback);
            }

        } else {

            if (_.cssTransitions === false) {
                if (_.options.rtl === true) {
                    _.currentLeft = -(_.currentLeft);
                }
                $({
                    animStart: _.currentLeft
                }).animate({
                    animStart: targetLeft
                }, {
                    duration: _.options.speed,
                    easing: _.options.easing,
                    step: function(now) {
                        now = Math.ceil(now);
                        if (_.options.vertical === false) {
                            animProps[_.animType] = 'translate(' +
                                now + 'px, 0px)';
                            _.$slideTrack.css(animProps);
                        } else {
                            animProps[_.animType] = 'translate(0px,' +
                                now + 'px)';
                            _.$slideTrack.css(animProps);
                        }
                    },
                    complete: function() {
                        if (callback) {
                            callback.call();
                        }
                    }
                });

            } else {

                _.applyTransition();
                targetLeft = Math.ceil(targetLeft);

                if (_.options.vertical === false) {
                    animProps[_.animType] = 'translate3d(' + targetLeft + 'px, 0px, 0px)';
                } else {
                    animProps[_.animType] = 'translate3d(0px,' + targetLeft + 'px, 0px)';
                }
                _.$slideTrack.css(animProps);

                if (callback) {
                    setTimeout(function() {

                        _.disableTransition();

                        callback.call();
                    }, _.options.speed);
                }

            }

        }

    };

    Slick.prototype.getNavTarget = function() {

        var _ = this,
            asNavFor = _.options.asNavFor;

        if ( asNavFor && asNavFor !== null ) {
            asNavFor = $(asNavFor).not(_.$slider);
        }

        return asNavFor;

    };

    Slick.prototype.asNavFor = function(index) {

        var _ = this,
            asNavFor = _.getNavTarget();

        if ( asNavFor !== null && typeof asNavFor === 'object' ) {
            asNavFor.each(function() {
                var target = $(this).slick('getSlick');
                if(!target.unslicked) {
                    target.slideHandler(index, true);
                }
            });
        }

    };

    Slick.prototype.applyTransition = function(slide) {

        var _ = this,
            transition = {};

        if (_.options.fade === false) {
            transition[_.transitionType] = _.transformType + ' ' + _.options.speed + 'ms ' + _.options.cssEase;
        } else {
            transition[_.transitionType] = 'opacity ' + _.options.speed + 'ms ' + _.options.cssEase;
        }

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.autoPlay = function() {

        var _ = this;

        _.autoPlayClear();

        if ( _.slideCount > _.options.slidesToShow ) {
            _.autoPlayTimer = setInterval( _.autoPlayIterator, _.options.autoplaySpeed );
        }

    };

    Slick.prototype.autoPlayClear = function() {

        var _ = this;

        if (_.autoPlayTimer) {
            clearInterval(_.autoPlayTimer);
        }

    };

    Slick.prototype.autoPlayIterator = function() {

        var _ = this,
            slideTo = _.currentSlide + _.options.slidesToScroll;

        if ( !_.paused && !_.interrupted && !_.focussed ) {

            if ( _.options.infinite === false ) {

                if ( _.direction === 1 && ( _.currentSlide + 1 ) === ( _.slideCount - 1 )) {
                    _.direction = 0;
                }

                else if ( _.direction === 0 ) {

                    slideTo = _.currentSlide - _.options.slidesToScroll;

                    if ( _.currentSlide - 1 === 0 ) {
                        _.direction = 1;
                    }

                }

            }

            _.slideHandler( slideTo );

        }

    };

    Slick.prototype.buildArrows = function() {

        var _ = this;

        if (_.options.arrows === true ) {

            _.$prevArrow = $(_.options.prevArrow).addClass('slick-arrow');
            _.$nextArrow = $(_.options.nextArrow).addClass('slick-arrow');

            if( _.slideCount > _.options.slidesToShow ) {

                _.$prevArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');
                _.$nextArrow.removeClass('slick-hidden').removeAttr('aria-hidden tabindex');

                if (_.htmlExpr.test(_.options.prevArrow)) {
                    _.$prevArrow.prependTo(_.options.appendArrows);
                }

                if (_.htmlExpr.test(_.options.nextArrow)) {
                    _.$nextArrow.appendTo(_.options.appendArrows);
                }

                if (_.options.infinite !== true) {
                    _.$prevArrow
                        .addClass('slick-disabled')
                        .attr('aria-disabled', 'true');
                }

            } else {

                _.$prevArrow.add( _.$nextArrow )

                    .addClass('slick-hidden')
                    .attr({
                        'aria-disabled': 'true',
                        'tabindex': '-1'
                    });

            }

        }

    };

    Slick.prototype.buildDots = function() {

        var _ = this,
            i, dot;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$slider.addClass('slick-dotted');

            dot = $('<ul />').addClass(_.options.dotsClass);

            for (i = 0; i <= _.getDotCount(); i += 1) {
                dot.append($('<li />').append(_.options.customPaging.call(this, _, i)));
            }

            _.$dots = dot.appendTo(_.options.appendDots);

            _.$dots.find('li').first().addClass('slick-active');

        }

    };

    Slick.prototype.buildOut = function() {

        var _ = this;

        _.$slides =
            _.$slider
                .children( _.options.slide + ':not(.slick-cloned)')
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        _.$slides.each(function(index, element) {
            $(element)
                .attr('data-slick-index', index)
                .data('originalStyling', $(element).attr('style') || '');
        });

        _.$slider.addClass('slick-slider');

        _.$slideTrack = (_.slideCount === 0) ?
            $('<div class="slick-track"/>').appendTo(_.$slider) :
            _.$slides.wrapAll('<div class="slick-track"/>').parent();

        _.$list = _.$slideTrack.wrap(
            '<div class="slick-list"/>').parent();
        _.$slideTrack.css('opacity', 0);

        if (_.options.centerMode === true || _.options.swipeToSlide === true) {
            _.options.slidesToScroll = 1;
        }

        $('img[data-lazy]', _.$slider).not('[src]').addClass('slick-loading');

        _.setupInfinite();

        _.buildArrows();

        _.buildDots();

        _.updateDots();


        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        if (_.options.draggable === true) {
            _.$list.addClass('draggable');
        }

    };

    Slick.prototype.buildRows = function() {

        var _ = this, a, b, c, newSlides, numOfSlides, originalSlides,slidesPerSection;

        newSlides = document.createDocumentFragment();
        originalSlides = _.$slider.children();

        if(_.options.rows > 0) {

            slidesPerSection = _.options.slidesPerRow * _.options.rows;
            numOfSlides = Math.ceil(
                originalSlides.length / slidesPerSection
            );

            for(a = 0; a < numOfSlides; a++){
                var slide = document.createElement('div');
                for(b = 0; b < _.options.rows; b++) {
                    var row = document.createElement('div');
                    for(c = 0; c < _.options.slidesPerRow; c++) {
                        var target = (a * slidesPerSection + ((b * _.options.slidesPerRow) + c));
                        if (originalSlides.get(target)) {
                            row.appendChild(originalSlides.get(target));
                        }
                    }
                    slide.appendChild(row);
                }
                newSlides.appendChild(slide);
            }

            _.$slider.empty().append(newSlides);
            _.$slider.children().children().children()
                .css({
                    'width':(100 / _.options.slidesPerRow) + '%',
                    'display': 'inline-block'
                });

        }

    };

    Slick.prototype.checkResponsive = function(initial, forceUpdate) {

        var _ = this,
            breakpoint, targetBreakpoint, respondToWidth, triggerBreakpoint = false;
        var sliderWidth = _.$slider.width();
        var windowWidth = window.innerWidth || $(window).width();

        if (_.respondTo === 'window') {
            respondToWidth = windowWidth;
        } else if (_.respondTo === 'slider') {
            respondToWidth = sliderWidth;
        } else if (_.respondTo === 'min') {
            respondToWidth = Math.min(windowWidth, sliderWidth);
        }

        if ( _.options.responsive &&
            _.options.responsive.length &&
            _.options.responsive !== null) {

            targetBreakpoint = null;

            for (breakpoint in _.breakpoints) {
                if (_.breakpoints.hasOwnProperty(breakpoint)) {
                    if (_.originalSettings.mobileFirst === false) {
                        if (respondToWidth < _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    } else {
                        if (respondToWidth > _.breakpoints[breakpoint]) {
                            targetBreakpoint = _.breakpoints[breakpoint];
                        }
                    }
                }
            }

            if (targetBreakpoint !== null) {
                if (_.activeBreakpoint !== null) {
                    if (targetBreakpoint !== _.activeBreakpoint || forceUpdate) {
                        _.activeBreakpoint =
                            targetBreakpoint;
                        if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                            _.unslick(targetBreakpoint);
                        } else {
                            _.options = $.extend({}, _.originalSettings,
                                _.breakpointSettings[
                                    targetBreakpoint]);
                            if (initial === true) {
                                _.currentSlide = _.options.initialSlide;
                            }
                            _.refresh(initial);
                        }
                        triggerBreakpoint = targetBreakpoint;
                    }
                } else {
                    _.activeBreakpoint = targetBreakpoint;
                    if (_.breakpointSettings[targetBreakpoint] === 'unslick') {
                        _.unslick(targetBreakpoint);
                    } else {
                        _.options = $.extend({}, _.originalSettings,
                            _.breakpointSettings[
                                targetBreakpoint]);
                        if (initial === true) {
                            _.currentSlide = _.options.initialSlide;
                        }
                        _.refresh(initial);
                    }
                    triggerBreakpoint = targetBreakpoint;
                }
            } else {
                if (_.activeBreakpoint !== null) {
                    _.activeBreakpoint = null;
                    _.options = _.originalSettings;
                    if (initial === true) {
                        _.currentSlide = _.options.initialSlide;
                    }
                    _.refresh(initial);
                    triggerBreakpoint = targetBreakpoint;
                }
            }

            // only trigger breakpoints during an actual break. not on initialize.
            if( !initial && triggerBreakpoint !== false ) {
                _.$slider.trigger('breakpoint', [_, triggerBreakpoint]);
            }
        }

    };

    Slick.prototype.changeSlide = function(event, dontAnimate) {

        var _ = this,
            $target = $(event.currentTarget),
            indexOffset, slideOffset, unevenOffset;

        // If target is a link, prevent default action.
        if($target.is('a')) {
            event.preventDefault();
        }

        // If target is not the <li> element (ie: a child), find the <li>.
        if(!$target.is('li')) {
            $target = $target.closest('li');
        }

        unevenOffset = (_.slideCount % _.options.slidesToScroll !== 0);
        indexOffset = unevenOffset ? 0 : (_.slideCount - _.currentSlide) % _.options.slidesToScroll;

        switch (event.data.message) {

            case 'previous':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : _.options.slidesToShow - indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide - slideOffset, false, dontAnimate);
                }
                break;

            case 'next':
                slideOffset = indexOffset === 0 ? _.options.slidesToScroll : indexOffset;
                if (_.slideCount > _.options.slidesToShow) {
                    _.slideHandler(_.currentSlide + slideOffset, false, dontAnimate);
                }
                break;

            case 'index':
                var index = event.data.index === 0 ? 0 :
                    event.data.index || $target.index() * _.options.slidesToScroll;

                _.slideHandler(_.checkNavigable(index), false, dontAnimate);
                $target.children().trigger('focus');
                break;

            default:
                return;
        }

    };

    Slick.prototype.checkNavigable = function(index) {

        var _ = this,
            navigables, prevNavigable;

        navigables = _.getNavigableIndexes();
        prevNavigable = 0;
        if (index > navigables[navigables.length - 1]) {
            index = navigables[navigables.length - 1];
        } else {
            for (var n in navigables) {
                if (index < navigables[n]) {
                    index = prevNavigable;
                    break;
                }
                prevNavigable = navigables[n];
            }
        }

        return index;
    };

    Slick.prototype.cleanUpEvents = function() {

        var _ = this;

        if (_.options.dots && _.$dots !== null) {

            $('li', _.$dots)
                .off('click.slick', _.changeSlide)
                .off('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .off('mouseleave.slick', $.proxy(_.interrupt, _, false));

            if (_.options.accessibility === true) {
                _.$dots.off('keydown.slick', _.keyHandler);
            }
        }

        _.$slider.off('focus.slick blur.slick');

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow && _.$prevArrow.off('click.slick', _.changeSlide);
            _.$nextArrow && _.$nextArrow.off('click.slick', _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow && _.$prevArrow.off('keydown.slick', _.keyHandler);
                _.$nextArrow && _.$nextArrow.off('keydown.slick', _.keyHandler);
            }
        }

        _.$list.off('touchstart.slick mousedown.slick', _.swipeHandler);
        _.$list.off('touchmove.slick mousemove.slick', _.swipeHandler);
        _.$list.off('touchend.slick mouseup.slick', _.swipeHandler);
        _.$list.off('touchcancel.slick mouseleave.slick', _.swipeHandler);

        _.$list.off('click.slick', _.clickHandler);

        $(document).off(_.visibilityChange, _.visibility);

        _.cleanUpSlideEvents();

        if (_.options.accessibility === true) {
            _.$list.off('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().off('click.slick', _.selectHandler);
        }

        $(window).off('orientationchange.slick.slick-' + _.instanceUid, _.orientationChange);

        $(window).off('resize.slick.slick-' + _.instanceUid, _.resize);

        $('[draggable!=true]', _.$slideTrack).off('dragstart', _.preventDefault);

        $(window).off('load.slick.slick-' + _.instanceUid, _.setPosition);

    };

    Slick.prototype.cleanUpSlideEvents = function() {

        var _ = this;

        _.$list.off('mouseenter.slick', $.proxy(_.interrupt, _, true));
        _.$list.off('mouseleave.slick', $.proxy(_.interrupt, _, false));

    };

    Slick.prototype.cleanUpRows = function() {

        var _ = this, originalSlides;

        if(_.options.rows > 0) {
            originalSlides = _.$slides.children().children();
            originalSlides.removeAttr('style');
            _.$slider.empty().append(originalSlides);
        }

    };

    Slick.prototype.clickHandler = function(event) {

        var _ = this;

        if (_.shouldClick === false) {
            event.stopImmediatePropagation();
            event.stopPropagation();
            event.preventDefault();
        }

    };

    Slick.prototype.destroy = function(refresh) {

        var _ = this;

        _.autoPlayClear();

        _.touchObject = {};

        _.cleanUpEvents();

        $('.slick-cloned', _.$slider).detach();

        if (_.$dots) {
            _.$dots.remove();
        }

        if ( _.$prevArrow && _.$prevArrow.length ) {

            _.$prevArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.prevArrow )) {
                _.$prevArrow.remove();
            }
        }

        if ( _.$nextArrow && _.$nextArrow.length ) {

            _.$nextArrow
                .removeClass('slick-disabled slick-arrow slick-hidden')
                .removeAttr('aria-hidden aria-disabled tabindex')
                .css('display','');

            if ( _.htmlExpr.test( _.options.nextArrow )) {
                _.$nextArrow.remove();
            }
        }


        if (_.$slides) {

            _.$slides
                .removeClass('slick-slide slick-active slick-center slick-visible slick-current')
                .removeAttr('aria-hidden')
                .removeAttr('data-slick-index')
                .each(function(){
                    $(this).attr('style', $(this).data('originalStyling'));
                });

            _.$slideTrack.children(this.options.slide).detach();

            _.$slideTrack.detach();

            _.$list.detach();

            _.$slider.append(_.$slides);
        }

        _.cleanUpRows();

        _.$slider.removeClass('slick-slider');
        _.$slider.removeClass('slick-initialized');
        _.$slider.removeClass('slick-dotted');

        _.unslicked = true;

        if(!refresh) {
            _.$slider.trigger('destroy', [_]);
        }

    };

    Slick.prototype.disableTransition = function(slide) {

        var _ = this,
            transition = {};

        transition[_.transitionType] = '';

        if (_.options.fade === false) {
            _.$slideTrack.css(transition);
        } else {
            _.$slides.eq(slide).css(transition);
        }

    };

    Slick.prototype.fadeSlide = function(slideIndex, callback) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).css({
                zIndex: _.options.zIndex
            });

            _.$slides.eq(slideIndex).animate({
                opacity: 1
            }, _.options.speed, _.options.easing, callback);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 1,
                zIndex: _.options.zIndex
            });

            if (callback) {
                setTimeout(function() {

                    _.disableTransition(slideIndex);

                    callback.call();
                }, _.options.speed);
            }

        }

    };

    Slick.prototype.fadeSlideOut = function(slideIndex) {

        var _ = this;

        if (_.cssTransitions === false) {

            _.$slides.eq(slideIndex).animate({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            }, _.options.speed, _.options.easing);

        } else {

            _.applyTransition(slideIndex);

            _.$slides.eq(slideIndex).css({
                opacity: 0,
                zIndex: _.options.zIndex - 2
            });

        }

    };

    Slick.prototype.filterSlides = Slick.prototype.slickFilter = function(filter) {

        var _ = this;

        if (filter !== null) {

            _.$slidesCache = _.$slides;

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.filter(filter).appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.focusHandler = function() {

        var _ = this;

        _.$slider
            .off('focus.slick blur.slick')
            .on('focus.slick blur.slick', '*', function(event) {

            event.stopImmediatePropagation();
            var $sf = $(this);

            setTimeout(function() {

                if( _.options.pauseOnFocus ) {
                    _.focussed = $sf.is(':focus');
                    _.autoPlay();
                }

            }, 0);

        });
    };

    Slick.prototype.getCurrent = Slick.prototype.slickCurrentSlide = function() {

        var _ = this;
        return _.currentSlide;

    };

    Slick.prototype.getDotCount = function() {

        var _ = this;

        var breakPoint = 0;
        var counter = 0;
        var pagerQty = 0;

        if (_.options.infinite === true) {
            if (_.slideCount <= _.options.slidesToShow) {
                 ++pagerQty;
            } else {
                while (breakPoint < _.slideCount) {
                    ++pagerQty;
                    breakPoint = counter + _.options.slidesToScroll;
                    counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
                }
            }
        } else if (_.options.centerMode === true) {
            pagerQty = _.slideCount;
        } else if(!_.options.asNavFor) {
            pagerQty = 1 + Math.ceil((_.slideCount - _.options.slidesToShow) / _.options.slidesToScroll);
        }else {
            while (breakPoint < _.slideCount) {
                ++pagerQty;
                breakPoint = counter + _.options.slidesToScroll;
                counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
            }
        }

        return pagerQty - 1;

    };

    Slick.prototype.getLeft = function(slideIndex) {

        var _ = this,
            targetLeft,
            verticalHeight,
            verticalOffset = 0,
            targetSlide,
            coef;

        _.slideOffset = 0;
        verticalHeight = _.$slides.first().outerHeight(true);

        if (_.options.infinite === true) {
            if (_.slideCount > _.options.slidesToShow) {
                _.slideOffset = (_.slideWidth * _.options.slidesToShow) * -1;
                coef = -1

                if (_.options.vertical === true && _.options.centerMode === true) {
                    if (_.options.slidesToShow === 2) {
                        coef = -1.5;
                    } else if (_.options.slidesToShow === 1) {
                        coef = -2
                    }
                }
                verticalOffset = (verticalHeight * _.options.slidesToShow) * coef;
            }
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                if (slideIndex + _.options.slidesToScroll > _.slideCount && _.slideCount > _.options.slidesToShow) {
                    if (slideIndex > _.slideCount) {
                        _.slideOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * _.slideWidth) * -1;
                        verticalOffset = ((_.options.slidesToShow - (slideIndex - _.slideCount)) * verticalHeight) * -1;
                    } else {
                        _.slideOffset = ((_.slideCount % _.options.slidesToScroll) * _.slideWidth) * -1;
                        verticalOffset = ((_.slideCount % _.options.slidesToScroll) * verticalHeight) * -1;
                    }
                }
            }
        } else {
            if (slideIndex + _.options.slidesToShow > _.slideCount) {
                _.slideOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * _.slideWidth;
                verticalOffset = ((slideIndex + _.options.slidesToShow) - _.slideCount) * verticalHeight;
            }
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.slideOffset = 0;
            verticalOffset = 0;
        }

        if (_.options.centerMode === true && _.slideCount <= _.options.slidesToShow) {
            _.slideOffset = ((_.slideWidth * Math.floor(_.options.slidesToShow)) / 2) - ((_.slideWidth * _.slideCount) / 2);
        } else if (_.options.centerMode === true && _.options.infinite === true) {
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2) - _.slideWidth;
        } else if (_.options.centerMode === true) {
            _.slideOffset = 0;
            _.slideOffset += _.slideWidth * Math.floor(_.options.slidesToShow / 2);
        }

        if (_.options.vertical === false) {
            targetLeft = ((slideIndex * _.slideWidth) * -1) + _.slideOffset;
        } else {
            targetLeft = ((slideIndex * verticalHeight) * -1) + verticalOffset;
        }

        if (_.options.variableWidth === true) {

            if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
            } else {
                targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow);
            }

            if (_.options.rtl === true) {
                if (targetSlide[0]) {
                    targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                } else {
                    targetLeft =  0;
                }
            } else {
                targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
            }

            if (_.options.centerMode === true) {
                if (_.slideCount <= _.options.slidesToShow || _.options.infinite === false) {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex);
                } else {
                    targetSlide = _.$slideTrack.children('.slick-slide').eq(slideIndex + _.options.slidesToShow + 1);
                }

                if (_.options.rtl === true) {
                    if (targetSlide[0]) {
                        targetLeft = (_.$slideTrack.width() - targetSlide[0].offsetLeft - targetSlide.width()) * -1;
                    } else {
                        targetLeft =  0;
                    }
                } else {
                    targetLeft = targetSlide[0] ? targetSlide[0].offsetLeft * -1 : 0;
                }

                targetLeft += (_.$list.width() - targetSlide.outerWidth()) / 2;
            }
        }

        return targetLeft;

    };

    Slick.prototype.getOption = Slick.prototype.slickGetOption = function(option) {

        var _ = this;

        return _.options[option];

    };

    Slick.prototype.getNavigableIndexes = function() {

        var _ = this,
            breakPoint = 0,
            counter = 0,
            indexes = [],
            max;

        if (_.options.infinite === false) {
            max = _.slideCount;
        } else {
            breakPoint = _.options.slidesToScroll * -1;
            counter = _.options.slidesToScroll * -1;
            max = _.slideCount * 2;
        }

        while (breakPoint < max) {
            indexes.push(breakPoint);
            breakPoint = counter + _.options.slidesToScroll;
            counter += _.options.slidesToScroll <= _.options.slidesToShow ? _.options.slidesToScroll : _.options.slidesToShow;
        }

        return indexes;

    };

    Slick.prototype.getSlick = function() {

        return this;

    };

    Slick.prototype.getSlideCount = function() {

        var _ = this,
            slidesTraversed, swipedSlide, centerOffset;

        centerOffset = _.options.centerMode === true ? _.slideWidth * Math.floor(_.options.slidesToShow / 2) : 0;

        if (_.options.swipeToSlide === true) {
            _.$slideTrack.find('.slick-slide').each(function(index, slide) {
                if (slide.offsetLeft - centerOffset + ($(slide).outerWidth() / 2) > (_.swipeLeft * -1)) {
                    swipedSlide = slide;
                    return false;
                }
            });

            slidesTraversed = Math.abs($(swipedSlide).attr('data-slick-index') - _.currentSlide) || 1;

            return slidesTraversed;

        } else {
            return _.options.slidesToScroll;
        }

    };

    Slick.prototype.goTo = Slick.prototype.slickGoTo = function(slide, dontAnimate) {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'index',
                index: parseInt(slide)
            }
        }, dontAnimate);

    };

    Slick.prototype.init = function(creation) {

        var _ = this;

        if (!$(_.$slider).hasClass('slick-initialized')) {

            $(_.$slider).addClass('slick-initialized');

            _.buildRows();
            _.buildOut();
            _.setProps();
            _.startLoad();
            _.loadSlider();
            _.initializeEvents();
            _.updateArrows();
            _.updateDots();
            _.checkResponsive(true);
            _.focusHandler();

        }

        if (creation) {
            _.$slider.trigger('init', [_]);
        }

        if (_.options.accessibility === true) {
            _.initADA();
        }

        if ( _.options.autoplay ) {

            _.paused = false;
            _.autoPlay();

        }

    };

    Slick.prototype.initADA = function() {
        var _ = this,
                numDotGroups = Math.ceil(_.slideCount / _.options.slidesToShow),
                tabControlIndexes = _.getNavigableIndexes().filter(function(val) {
                    return (val >= 0) && (val < _.slideCount);
                });

        _.$slides.add(_.$slideTrack.find('.slick-cloned')).attr({
            'aria-hidden': 'true',
            'tabindex': '-1'
        }).find('a, input, button, select').attr({
            'tabindex': '-1'
        });

        if (_.$dots !== null) {
            _.$slides.not(_.$slideTrack.find('.slick-cloned')).each(function(i) {
                var slideControlIndex = tabControlIndexes.indexOf(i);

                $(this).attr({
                    'role': 'tabpanel',
                    'id': 'slick-slide' + _.instanceUid + i,
                    'tabindex': -1
                });

                if (slideControlIndex !== -1) {
                   var ariaButtonControl = 'slick-slide-control' + _.instanceUid + slideControlIndex
                   if ($('#' + ariaButtonControl).length) {
                     $(this).attr({
                         'aria-describedby': ariaButtonControl
                     });
                   }
                }
            });

            _.$dots.attr('role', 'tablist').find('li').each(function(i) {
                var mappedSlideIndex = tabControlIndexes[i];

                $(this).attr({
                    'role': 'presentation'
                });

                $(this).find('button').first().attr({
                    'role': 'tab',
                    'id': 'slick-slide-control' + _.instanceUid + i,
                    'aria-controls': 'slick-slide' + _.instanceUid + mappedSlideIndex,
                    'aria-label': (i + 1) + ' of ' + numDotGroups,
                    'aria-selected': null,
                    'tabindex': '-1'
                });

            }).eq(_.currentSlide).find('button').attr({
                'aria-selected': 'true',
                'tabindex': '0'
            }).end();
        }

        for (var i=_.currentSlide, max=i+_.options.slidesToShow; i < max; i++) {
          if (_.options.focusOnChange) {
            _.$slides.eq(i).attr({'tabindex': '0'});
          } else {
            _.$slides.eq(i).removeAttr('tabindex');
          }
        }

        _.activateADA();

    };

    Slick.prototype.initArrowEvents = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {
            _.$prevArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'previous'
               }, _.changeSlide);
            _.$nextArrow
               .off('click.slick')
               .on('click.slick', {
                    message: 'next'
               }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$prevArrow.on('keydown.slick', _.keyHandler);
                _.$nextArrow.on('keydown.slick', _.keyHandler);
            }
        }

    };

    Slick.prototype.initDotEvents = function() {

        var _ = this;

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {
            $('li', _.$dots).on('click.slick', {
                message: 'index'
            }, _.changeSlide);

            if (_.options.accessibility === true) {
                _.$dots.on('keydown.slick', _.keyHandler);
            }
        }

        if (_.options.dots === true && _.options.pauseOnDotsHover === true && _.slideCount > _.options.slidesToShow) {

            $('li', _.$dots)
                .on('mouseenter.slick', $.proxy(_.interrupt, _, true))
                .on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initSlideEvents = function() {

        var _ = this;

        if ( _.options.pauseOnHover ) {

            _.$list.on('mouseenter.slick', $.proxy(_.interrupt, _, true));
            _.$list.on('mouseleave.slick', $.proxy(_.interrupt, _, false));

        }

    };

    Slick.prototype.initializeEvents = function() {

        var _ = this;

        _.initArrowEvents();

        _.initDotEvents();
        _.initSlideEvents();

        _.$list.on('touchstart.slick mousedown.slick', {
            action: 'start'
        }, _.swipeHandler);
        _.$list.on('touchmove.slick mousemove.slick', {
            action: 'move'
        }, _.swipeHandler);
        _.$list.on('touchend.slick mouseup.slick', {
            action: 'end'
        }, _.swipeHandler);
        _.$list.on('touchcancel.slick mouseleave.slick', {
            action: 'end'
        }, _.swipeHandler);

        _.$list.on('click.slick', _.clickHandler);

        $(document).on(_.visibilityChange, $.proxy(_.visibility, _));

        if (_.options.accessibility === true) {
            _.$list.on('keydown.slick', _.keyHandler);
        }

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        $(window).on('orientationchange.slick.slick-' + _.instanceUid, $.proxy(_.orientationChange, _));

        $(window).on('resize.slick.slick-' + _.instanceUid, $.proxy(_.resize, _));

        $('[draggable!=true]', _.$slideTrack).on('dragstart', _.preventDefault);

        $(window).on('load.slick.slick-' + _.instanceUid, _.setPosition);
        $(_.setPosition);

    };

    Slick.prototype.initUI = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.show();
            _.$nextArrow.show();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.show();

        }

    };

    Slick.prototype.keyHandler = function(event) {

        var _ = this;
         //Dont slide if the cursor is inside the form fields and arrow keys are pressed
        if(!event.target.tagName.match('TEXTAREA|INPUT|SELECT')) {
            if (event.keyCode === 37 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'next' :  'previous'
                    }
                });
            } else if (event.keyCode === 39 && _.options.accessibility === true) {
                _.changeSlide({
                    data: {
                        message: _.options.rtl === true ? 'previous' : 'next'
                    }
                });
            }
        }

    };

    Slick.prototype.lazyLoad = function() {

        var _ = this,
            loadRange, cloneRange, rangeStart, rangeEnd;

        function loadImages(imagesScope) {

            $('img[data-lazy]', imagesScope).each(function() {

                var image = $(this),
                    imageSource = $(this).attr('data-lazy'),
                    imageSrcSet = $(this).attr('data-srcset'),
                    imageSizes  = $(this).attr('data-sizes') || _.$slider.attr('data-sizes'),
                    imageToLoad = document.createElement('img');

                imageToLoad.onload = function() {

                    image
                        .animate({ opacity: 0 }, 100, function() {

                            if (imageSrcSet) {
                                image
                                    .attr('srcset', imageSrcSet );

                                if (imageSizes) {
                                    image
                                        .attr('sizes', imageSizes );
                                }
                            }

                            image
                                .attr('src', imageSource)
                                .animate({ opacity: 1 }, 200, function() {
                                    image
                                        .removeAttr('data-lazy data-srcset data-sizes')
                                        .removeClass('slick-loading');
                                });
                            _.$slider.trigger('lazyLoaded', [_, image, imageSource]);
                        });

                };

                imageToLoad.onerror = function() {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                };

                imageToLoad.src = imageSource;

            });

        }

        if (_.options.centerMode === true) {
            if (_.options.infinite === true) {
                rangeStart = _.currentSlide + (_.options.slidesToShow / 2 + 1);
                rangeEnd = rangeStart + _.options.slidesToShow + 2;
            } else {
                rangeStart = Math.max(0, _.currentSlide - (_.options.slidesToShow / 2 + 1));
                rangeEnd = 2 + (_.options.slidesToShow / 2 + 1) + _.currentSlide;
            }
        } else {
            rangeStart = _.options.infinite ? _.options.slidesToShow + _.currentSlide : _.currentSlide;
            rangeEnd = Math.ceil(rangeStart + _.options.slidesToShow);
            if (_.options.fade === true) {
                if (rangeStart > 0) rangeStart--;
                if (rangeEnd <= _.slideCount) rangeEnd++;
            }
        }

        loadRange = _.$slider.find('.slick-slide').slice(rangeStart, rangeEnd);

        if (_.options.lazyLoad === 'anticipated') {
            var prevSlide = rangeStart - 1,
                nextSlide = rangeEnd,
                $slides = _.$slider.find('.slick-slide');

            for (var i = 0; i < _.options.slidesToScroll; i++) {
                if (prevSlide < 0) prevSlide = _.slideCount - 1;
                loadRange = loadRange.add($slides.eq(prevSlide));
                loadRange = loadRange.add($slides.eq(nextSlide));
                prevSlide--;
                nextSlide++;
            }
        }

        loadImages(loadRange);

        if (_.slideCount <= _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-slide');
            loadImages(cloneRange);
        } else
        if (_.currentSlide >= _.slideCount - _.options.slidesToShow) {
            cloneRange = _.$slider.find('.slick-cloned').slice(0, _.options.slidesToShow);
            loadImages(cloneRange);
        } else if (_.currentSlide === 0) {
            cloneRange = _.$slider.find('.slick-cloned').slice(_.options.slidesToShow * -1);
            loadImages(cloneRange);
        }

    };

    Slick.prototype.loadSlider = function() {

        var _ = this;

        _.setPosition();

        _.$slideTrack.css({
            opacity: 1
        });

        _.$slider.removeClass('slick-loading');

        _.initUI();

        if (_.options.lazyLoad === 'progressive') {
            _.progressiveLazyLoad();
        }

    };

    Slick.prototype.next = Slick.prototype.slickNext = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'next'
            }
        });

    };

    Slick.prototype.orientationChange = function() {

        var _ = this;

        _.checkResponsive();
        _.setPosition();

    };

    Slick.prototype.pause = Slick.prototype.slickPause = function() {

        var _ = this;

        _.autoPlayClear();
        _.paused = true;

    };

    Slick.prototype.play = Slick.prototype.slickPlay = function() {

        var _ = this;

        _.autoPlay();
        _.options.autoplay = true;
        _.paused = false;
        _.focussed = false;
        _.interrupted = false;

    };

    Slick.prototype.postSlide = function(index) {

        var _ = this;

        if( !_.unslicked ) {

            _.$slider.trigger('afterChange', [_, index]);

            _.animating = false;

            if (_.slideCount > _.options.slidesToShow) {
                _.setPosition();
            }

            _.swipeLeft = null;

            if ( _.options.autoplay ) {
                _.autoPlay();
            }

            if (_.options.accessibility === true) {
                _.initADA();

                if (_.options.focusOnChange) {
                    var $currentSlide = $(_.$slides.get(_.currentSlide));
                    $currentSlide.attr('tabindex', 0).focus();
                }
            }

        }

    };

    Slick.prototype.prev = Slick.prototype.slickPrev = function() {

        var _ = this;

        _.changeSlide({
            data: {
                message: 'previous'
            }
        });

    };

    Slick.prototype.preventDefault = function(event) {

        event.preventDefault();

    };

    Slick.prototype.progressiveLazyLoad = function( tryCount ) {

        tryCount = tryCount || 1;

        var _ = this,
            $imgsToLoad = $( 'img[data-lazy]', _.$slider ),
            image,
            imageSource,
            imageSrcSet,
            imageSizes,
            imageToLoad;

        if ( $imgsToLoad.length ) {

            image = $imgsToLoad.first();
            imageSource = image.attr('data-lazy');
            imageSrcSet = image.attr('data-srcset');
            imageSizes  = image.attr('data-sizes') || _.$slider.attr('data-sizes');
            imageToLoad = document.createElement('img');

            imageToLoad.onload = function() {

                if (imageSrcSet) {
                    image
                        .attr('srcset', imageSrcSet );

                    if (imageSizes) {
                        image
                            .attr('sizes', imageSizes );
                    }
                }

                image
                    .attr( 'src', imageSource )
                    .removeAttr('data-lazy data-srcset data-sizes')
                    .removeClass('slick-loading');

                if ( _.options.adaptiveHeight === true ) {
                    _.setPosition();
                }

                _.$slider.trigger('lazyLoaded', [ _, image, imageSource ]);
                _.progressiveLazyLoad();

            };

            imageToLoad.onerror = function() {

                if ( tryCount < 3 ) {

                    /**
                     * try to load the image 3 times,
                     * leave a slight delay so we don't get
                     * servers blocking the request.
                     */
                    setTimeout( function() {
                        _.progressiveLazyLoad( tryCount + 1 );
                    }, 500 );

                } else {

                    image
                        .removeAttr( 'data-lazy' )
                        .removeClass( 'slick-loading' )
                        .addClass( 'slick-lazyload-error' );

                    _.$slider.trigger('lazyLoadError', [ _, image, imageSource ]);

                    _.progressiveLazyLoad();

                }

            };

            imageToLoad.src = imageSource;

        } else {

            _.$slider.trigger('allImagesLoaded', [ _ ]);

        }

    };

    Slick.prototype.refresh = function( initializing ) {

        var _ = this, currentSlide, lastVisibleIndex;

        lastVisibleIndex = _.slideCount - _.options.slidesToShow;

        // in non-infinite sliders, we don't want to go past the
        // last visible index.
        if( !_.options.infinite && ( _.currentSlide > lastVisibleIndex )) {
            _.currentSlide = lastVisibleIndex;
        }

        // if less slides than to show, go to start.
        if ( _.slideCount <= _.options.slidesToShow ) {
            _.currentSlide = 0;

        }

        currentSlide = _.currentSlide;

        _.destroy(true);

        $.extend(_, _.initials, { currentSlide: currentSlide });

        _.init();

        if( !initializing ) {

            _.changeSlide({
                data: {
                    message: 'index',
                    index: currentSlide
                }
            }, false);

        }

    };

    Slick.prototype.registerBreakpoints = function() {

        var _ = this, breakpoint, currentBreakpoint, l,
            responsiveSettings = _.options.responsive || null;

        if ( $.type(responsiveSettings) === 'array' && responsiveSettings.length ) {

            _.respondTo = _.options.respondTo || 'window';

            for ( breakpoint in responsiveSettings ) {

                l = _.breakpoints.length-1;

                if (responsiveSettings.hasOwnProperty(breakpoint)) {
                    currentBreakpoint = responsiveSettings[breakpoint].breakpoint;

                    // loop through the breakpoints and cut out any existing
                    // ones with the same breakpoint number, we don't want dupes.
                    while( l >= 0 ) {
                        if( _.breakpoints[l] && _.breakpoints[l] === currentBreakpoint ) {
                            _.breakpoints.splice(l,1);
                        }
                        l--;
                    }

                    _.breakpoints.push(currentBreakpoint);
                    _.breakpointSettings[currentBreakpoint] = responsiveSettings[breakpoint].settings;

                }

            }

            _.breakpoints.sort(function(a, b) {
                return ( _.options.mobileFirst ) ? a-b : b-a;
            });

        }

    };

    Slick.prototype.reinit = function() {

        var _ = this;

        _.$slides =
            _.$slideTrack
                .children(_.options.slide)
                .addClass('slick-slide');

        _.slideCount = _.$slides.length;

        if (_.currentSlide >= _.slideCount && _.currentSlide !== 0) {
            _.currentSlide = _.currentSlide - _.options.slidesToScroll;
        }

        if (_.slideCount <= _.options.slidesToShow) {
            _.currentSlide = 0;
        }

        _.registerBreakpoints();

        _.setProps();
        _.setupInfinite();
        _.buildArrows();
        _.updateArrows();
        _.initArrowEvents();
        _.buildDots();
        _.updateDots();
        _.initDotEvents();
        _.cleanUpSlideEvents();
        _.initSlideEvents();

        _.checkResponsive(false, true);

        if (_.options.focusOnSelect === true) {
            $(_.$slideTrack).children().on('click.slick', _.selectHandler);
        }

        _.setSlideClasses(typeof _.currentSlide === 'number' ? _.currentSlide : 0);

        _.setPosition();
        _.focusHandler();

        _.paused = !_.options.autoplay;
        _.autoPlay();

        _.$slider.trigger('reInit', [_]);

    };

    Slick.prototype.resize = function() {

        var _ = this;

        if ($(window).width() !== _.windowWidth) {
            clearTimeout(_.windowDelay);
            _.windowDelay = window.setTimeout(function() {
                _.windowWidth = $(window).width();
                _.checkResponsive();
                if( !_.unslicked ) { _.setPosition(); }
            }, 50);
        }
    };

    Slick.prototype.removeSlide = Slick.prototype.slickRemove = function(index, removeBefore, removeAll) {

        var _ = this;

        if (typeof(index) === 'boolean') {
            removeBefore = index;
            index = removeBefore === true ? 0 : _.slideCount - 1;
        } else {
            index = removeBefore === true ? --index : index;
        }

        if (_.slideCount < 1 || index < 0 || index > _.slideCount - 1) {
            return false;
        }

        _.unload();

        if (removeAll === true) {
            _.$slideTrack.children().remove();
        } else {
            _.$slideTrack.children(this.options.slide).eq(index).remove();
        }

        _.$slides = _.$slideTrack.children(this.options.slide);

        _.$slideTrack.children(this.options.slide).detach();

        _.$slideTrack.append(_.$slides);

        _.$slidesCache = _.$slides;

        _.reinit();

    };

    Slick.prototype.setCSS = function(position) {

        var _ = this,
            positionProps = {},
            x, y;

        if (_.options.rtl === true) {
            position = -position;
        }
        x = _.positionProp == 'left' ? Math.ceil(position) + 'px' : '0px';
        y = _.positionProp == 'top' ? Math.ceil(position) + 'px' : '0px';

        positionProps[_.positionProp] = position;

        if (_.transformsEnabled === false) {
            _.$slideTrack.css(positionProps);
        } else {
            positionProps = {};
            if (_.cssTransitions === false) {
                positionProps[_.animType] = 'translate(' + x + ', ' + y + ')';
                _.$slideTrack.css(positionProps);
            } else {
                positionProps[_.animType] = 'translate3d(' + x + ', ' + y + ', 0px)';
                _.$slideTrack.css(positionProps);
            }
        }

    };

    Slick.prototype.setDimensions = function() {

        var _ = this;

        if (_.options.vertical === false) {
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: ('0px ' + _.options.centerPadding)
                });
            }
        } else {
            _.$list.height(_.$slides.first().outerHeight(true) * _.options.slidesToShow);
            if (_.options.centerMode === true) {
                _.$list.css({
                    padding: (_.options.centerPadding + ' 0px')
                });
            }
        }

        _.listWidth = _.$list.width();
        _.listHeight = _.$list.height();


        if (_.options.vertical === false && _.options.variableWidth === false) {
            _.slideWidth = Math.ceil(_.listWidth / _.options.slidesToShow);
            _.$slideTrack.width(Math.ceil((_.slideWidth * _.$slideTrack.children('.slick-slide').length)));

        } else if (_.options.variableWidth === true) {
            _.$slideTrack.width(5000 * _.slideCount);
        } else {
            _.slideWidth = Math.ceil(_.listWidth);
            _.$slideTrack.height(Math.ceil((_.$slides.first().outerHeight(true) * _.$slideTrack.children('.slick-slide').length)));
        }

        var offset = _.$slides.first().outerWidth(true) - _.$slides.first().width();
        if (_.options.variableWidth === false) _.$slideTrack.children('.slick-slide').width(_.slideWidth - offset);

    };

    Slick.prototype.setFade = function() {

        var _ = this,
            targetLeft;

        _.$slides.each(function(index, element) {
            targetLeft = (_.slideWidth * index) * -1;
            if (_.options.rtl === true) {
                $(element).css({
                    position: 'relative',
                    right: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            } else {
                $(element).css({
                    position: 'relative',
                    left: targetLeft,
                    top: 0,
                    zIndex: _.options.zIndex - 2,
                    opacity: 0
                });
            }
        });

        _.$slides.eq(_.currentSlide).css({
            zIndex: _.options.zIndex - 1,
            opacity: 1
        });

    };

    Slick.prototype.setHeight = function() {

        var _ = this;

        if (_.options.slidesToShow === 1 && _.options.adaptiveHeight === true && _.options.vertical === false) {
            var targetHeight = _.$slides.eq(_.currentSlide).outerHeight(true);
            _.$list.css('height', targetHeight);
        }

    };

    Slick.prototype.setOption =
    Slick.prototype.slickSetOption = function() {

        /**
         * accepts arguments in format of:
         *
         *  - for changing a single option's value:
         *     .slick("setOption", option, value, refresh )
         *
         *  - for changing a set of responsive options:
         *     .slick("setOption", 'responsive', [{}, ...], refresh )
         *
         *  - for updating multiple values at once (not responsive)
         *     .slick("setOption", { 'option': value, ... }, refresh )
         */

        var _ = this, l, item, option, value, refresh = false, type;

        if( $.type( arguments[0] ) === 'object' ) {

            option =  arguments[0];
            refresh = arguments[1];
            type = 'multiple';

        } else if ( $.type( arguments[0] ) === 'string' ) {

            option =  arguments[0];
            value = arguments[1];
            refresh = arguments[2];

            if ( arguments[0] === 'responsive' && $.type( arguments[1] ) === 'array' ) {

                type = 'responsive';

            } else if ( typeof arguments[1] !== 'undefined' ) {

                type = 'single';

            }

        }

        if ( type === 'single' ) {

            _.options[option] = value;


        } else if ( type === 'multiple' ) {

            $.each( option , function( opt, val ) {

                _.options[opt] = val;

            });


        } else if ( type === 'responsive' ) {

            for ( item in value ) {

                if( $.type( _.options.responsive ) !== 'array' ) {

                    _.options.responsive = [ value[item] ];

                } else {

                    l = _.options.responsive.length-1;

                    // loop through the responsive object and splice out duplicates.
                    while( l >= 0 ) {

                        if( _.options.responsive[l].breakpoint === value[item].breakpoint ) {

                            _.options.responsive.splice(l,1);

                        }

                        l--;

                    }

                    _.options.responsive.push( value[item] );

                }

            }

        }

        if ( refresh ) {

            _.unload();
            _.reinit();

        }

    };

    Slick.prototype.setPosition = function() {

        var _ = this;

        _.setDimensions();

        _.setHeight();

        if (_.options.fade === false) {
            _.setCSS(_.getLeft(_.currentSlide));
        } else {
            _.setFade();
        }

        _.$slider.trigger('setPosition', [_]);

    };

    Slick.prototype.setProps = function() {

        var _ = this,
            bodyStyle = document.body.style;

        _.positionProp = _.options.vertical === true ? 'top' : 'left';

        if (_.positionProp === 'top') {
            _.$slider.addClass('slick-vertical');
        } else {
            _.$slider.removeClass('slick-vertical');
        }

        if (bodyStyle.WebkitTransition !== undefined ||
            bodyStyle.MozTransition !== undefined ||
            bodyStyle.msTransition !== undefined) {
            if (_.options.useCSS === true) {
                _.cssTransitions = true;
            }
        }

        if ( _.options.fade ) {
            if ( typeof _.options.zIndex === 'number' ) {
                if( _.options.zIndex < 3 ) {
                    _.options.zIndex = 3;
                }
            } else {
                _.options.zIndex = _.defaults.zIndex;
            }
        }

        if (bodyStyle.OTransform !== undefined) {
            _.animType = 'OTransform';
            _.transformType = '-o-transform';
            _.transitionType = 'OTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.MozTransform !== undefined) {
            _.animType = 'MozTransform';
            _.transformType = '-moz-transform';
            _.transitionType = 'MozTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.MozPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.webkitTransform !== undefined) {
            _.animType = 'webkitTransform';
            _.transformType = '-webkit-transform';
            _.transitionType = 'webkitTransition';
            if (bodyStyle.perspectiveProperty === undefined && bodyStyle.webkitPerspective === undefined) _.animType = false;
        }
        if (bodyStyle.msTransform !== undefined) {
            _.animType = 'msTransform';
            _.transformType = '-ms-transform';
            _.transitionType = 'msTransition';
            if (bodyStyle.msTransform === undefined) _.animType = false;
        }
        if (bodyStyle.transform !== undefined && _.animType !== false) {
            _.animType = 'transform';
            _.transformType = 'transform';
            _.transitionType = 'transition';
        }
        _.transformsEnabled = _.options.useTransform && (_.animType !== null && _.animType !== false);
    };


    Slick.prototype.setSlideClasses = function(index) {

        var _ = this,
            centerOffset, allSlides, indexOffset, remainder;

        allSlides = _.$slider
            .find('.slick-slide')
            .removeClass('slick-active slick-center slick-current')
            .attr('aria-hidden', 'true');

        _.$slides
            .eq(index)
            .addClass('slick-current');

        if (_.options.centerMode === true) {

            var evenCoef = _.options.slidesToShow % 2 === 0 ? 1 : 0;

            centerOffset = Math.floor(_.options.slidesToShow / 2);

            if (_.options.infinite === true) {

                if (index >= centerOffset && index <= (_.slideCount - 1) - centerOffset) {
                    _.$slides
                        .slice(index - centerOffset + evenCoef, index + centerOffset + 1)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    indexOffset = _.options.slidesToShow + index;
                    allSlides
                        .slice(indexOffset - centerOffset + 1 + evenCoef, indexOffset + centerOffset + 2)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

                if (index === 0) {

                    allSlides
                        .eq(allSlides.length - 1 - _.options.slidesToShow)
                        .addClass('slick-center');

                } else if (index === _.slideCount - 1) {

                    allSlides
                        .eq(_.options.slidesToShow)
                        .addClass('slick-center');

                }

            }

            _.$slides
                .eq(index)
                .addClass('slick-center');

        } else {

            if (index >= 0 && index <= (_.slideCount - _.options.slidesToShow)) {

                _.$slides
                    .slice(index, index + _.options.slidesToShow)
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else if (allSlides.length <= _.options.slidesToShow) {

                allSlides
                    .addClass('slick-active')
                    .attr('aria-hidden', 'false');

            } else {

                remainder = _.slideCount % _.options.slidesToShow;
                indexOffset = _.options.infinite === true ? _.options.slidesToShow + index : index;

                if (_.options.slidesToShow == _.options.slidesToScroll && (_.slideCount - index) < _.options.slidesToShow) {

                    allSlides
                        .slice(indexOffset - (_.options.slidesToShow - remainder), indexOffset + remainder)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                } else {

                    allSlides
                        .slice(indexOffset, indexOffset + _.options.slidesToShow)
                        .addClass('slick-active')
                        .attr('aria-hidden', 'false');

                }

            }

        }

        if (_.options.lazyLoad === 'ondemand' || _.options.lazyLoad === 'anticipated') {
            _.lazyLoad();
        }
    };

    Slick.prototype.setupInfinite = function() {

        var _ = this,
            i, slideIndex, infiniteCount;

        if (_.options.fade === true) {
            _.options.centerMode = false;
        }

        if (_.options.infinite === true && _.options.fade === false) {

            slideIndex = null;

            if (_.slideCount > _.options.slidesToShow) {

                if (_.options.centerMode === true) {
                    infiniteCount = _.options.slidesToShow + 1;
                } else {
                    infiniteCount = _.options.slidesToShow;
                }

                for (i = _.slideCount; i > (_.slideCount -
                        infiniteCount); i -= 1) {
                    slideIndex = i - 1;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex - _.slideCount)
                        .prependTo(_.$slideTrack).addClass('slick-cloned');
                }
                for (i = 0; i < infiniteCount  + _.slideCount; i += 1) {
                    slideIndex = i;
                    $(_.$slides[slideIndex]).clone(true).attr('id', '')
                        .attr('data-slick-index', slideIndex + _.slideCount)
                        .appendTo(_.$slideTrack).addClass('slick-cloned');
                }
                _.$slideTrack.find('.slick-cloned').find('[id]').each(function() {
                    $(this).attr('id', '');
                });

            }

        }

    };

    Slick.prototype.interrupt = function( toggle ) {

        var _ = this;

        if( !toggle ) {
            _.autoPlay();
        }
        _.interrupted = toggle;

    };

    Slick.prototype.selectHandler = function(event) {

        var _ = this;

        var targetElement =
            $(event.target).is('.slick-slide') ?
                $(event.target) :
                $(event.target).parents('.slick-slide');

        var index = parseInt(targetElement.attr('data-slick-index'));

        if (!index) index = 0;

        if (_.slideCount <= _.options.slidesToShow) {

            _.slideHandler(index, false, true);
            return;

        }

        _.slideHandler(index);

    };

    Slick.prototype.slideHandler = function(index, sync, dontAnimate) {

        var targetSlide, animSlide, oldSlide, slideLeft, targetLeft = null,
            _ = this, navTarget;

        sync = sync || false;

        if (_.animating === true && _.options.waitForAnimate === true) {
            return;
        }

        if (_.options.fade === true && _.currentSlide === index) {
            return;
        }

        if (sync === false) {
            _.asNavFor(index);
        }

        targetSlide = index;
        targetLeft = _.getLeft(targetSlide);
        slideLeft = _.getLeft(_.currentSlide);

        _.currentLeft = _.swipeLeft === null ? slideLeft : _.swipeLeft;

        if (_.options.infinite === false && _.options.centerMode === false && (index < 0 || index > _.getDotCount() * _.options.slidesToScroll)) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        } else if (_.options.infinite === false && _.options.centerMode === true && (index < 0 || index > (_.slideCount - _.options.slidesToScroll))) {
            if (_.options.fade === false) {
                targetSlide = _.currentSlide;
                if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
                    _.animateSlide(slideLeft, function() {
                        _.postSlide(targetSlide);
                    });
                } else {
                    _.postSlide(targetSlide);
                }
            }
            return;
        }

        if ( _.options.autoplay ) {
            clearInterval(_.autoPlayTimer);
        }

        if (targetSlide < 0) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = _.slideCount - (_.slideCount % _.options.slidesToScroll);
            } else {
                animSlide = _.slideCount + targetSlide;
            }
        } else if (targetSlide >= _.slideCount) {
            if (_.slideCount % _.options.slidesToScroll !== 0) {
                animSlide = 0;
            } else {
                animSlide = targetSlide - _.slideCount;
            }
        } else {
            animSlide = targetSlide;
        }

        _.animating = true;

        _.$slider.trigger('beforeChange', [_, _.currentSlide, animSlide]);

        oldSlide = _.currentSlide;
        _.currentSlide = animSlide;

        _.setSlideClasses(_.currentSlide);

        if ( _.options.asNavFor ) {

            navTarget = _.getNavTarget();
            navTarget = navTarget.slick('getSlick');

            if ( navTarget.slideCount <= navTarget.options.slidesToShow ) {
                navTarget.setSlideClasses(_.currentSlide);
            }

        }

        _.updateDots();
        _.updateArrows();

        if (_.options.fade === true) {
            if (dontAnimate !== true) {

                _.fadeSlideOut(oldSlide);

                _.fadeSlide(animSlide, function() {
                    _.postSlide(animSlide);
                });

            } else {
                _.postSlide(animSlide);
            }
            _.animateHeight();
            return;
        }

        if (dontAnimate !== true && _.slideCount > _.options.slidesToShow) {
            _.animateSlide(targetLeft, function() {
                _.postSlide(animSlide);
            });
        } else {
            _.postSlide(animSlide);
        }

    };

    Slick.prototype.startLoad = function() {

        var _ = this;

        if (_.options.arrows === true && _.slideCount > _.options.slidesToShow) {

            _.$prevArrow.hide();
            _.$nextArrow.hide();

        }

        if (_.options.dots === true && _.slideCount > _.options.slidesToShow) {

            _.$dots.hide();

        }

        _.$slider.addClass('slick-loading');

    };

    Slick.prototype.swipeDirection = function() {

        var xDist, yDist, r, swipeAngle, _ = this;

        xDist = _.touchObject.startX - _.touchObject.curX;
        yDist = _.touchObject.startY - _.touchObject.curY;
        r = Math.atan2(yDist, xDist);

        swipeAngle = Math.round(r * 180 / Math.PI);
        if (swipeAngle < 0) {
            swipeAngle = 360 - Math.abs(swipeAngle);
        }

        if ((swipeAngle <= 45) && (swipeAngle >= 0)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle <= 360) && (swipeAngle >= 315)) {
            return (_.options.rtl === false ? 'left' : 'right');
        }
        if ((swipeAngle >= 135) && (swipeAngle <= 225)) {
            return (_.options.rtl === false ? 'right' : 'left');
        }
        if (_.options.verticalSwiping === true) {
            if ((swipeAngle >= 35) && (swipeAngle <= 135)) {
                return 'down';
            } else {
                return 'up';
            }
        }

        return 'vertical';

    };

    Slick.prototype.swipeEnd = function(event) {

        var _ = this,
            slideCount,
            direction;

        _.dragging = false;
        _.swiping = false;

        if (_.scrolling) {
            _.scrolling = false;
            return false;
        }

        _.interrupted = false;
        _.shouldClick = ( _.touchObject.swipeLength > 10 ) ? false : true;

        if ( _.touchObject.curX === undefined ) {
            return false;
        }

        if ( _.touchObject.edgeHit === true ) {
            _.$slider.trigger('edge', [_, _.swipeDirection() ]);
        }

        if ( _.touchObject.swipeLength >= _.touchObject.minSwipe ) {

            direction = _.swipeDirection();

            switch ( direction ) {

                case 'left':
                case 'down':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide + _.getSlideCount() ) :
                            _.currentSlide + _.getSlideCount();

                    _.currentDirection = 0;

                    break;

                case 'right':
                case 'up':

                    slideCount =
                        _.options.swipeToSlide ?
                            _.checkNavigable( _.currentSlide - _.getSlideCount() ) :
                            _.currentSlide - _.getSlideCount();

                    _.currentDirection = 1;

                    break;

                default:


            }

            if( direction != 'vertical' ) {

                _.slideHandler( slideCount );
                _.touchObject = {};
                _.$slider.trigger('swipe', [_, direction ]);

            }

        } else {

            if ( _.touchObject.startX !== _.touchObject.curX ) {

                _.slideHandler( _.currentSlide );
                _.touchObject = {};

            }

        }

    };

    Slick.prototype.swipeHandler = function(event) {

        var _ = this;

        if ((_.options.swipe === false) || ('ontouchend' in document && _.options.swipe === false)) {
            return;
        } else if (_.options.draggable === false && event.type.indexOf('mouse') !== -1) {
            return;
        }

        _.touchObject.fingerCount = event.originalEvent && event.originalEvent.touches !== undefined ?
            event.originalEvent.touches.length : 1;

        _.touchObject.minSwipe = _.listWidth / _.options
            .touchThreshold;

        if (_.options.verticalSwiping === true) {
            _.touchObject.minSwipe = _.listHeight / _.options
                .touchThreshold;
        }

        switch (event.data.action) {

            case 'start':
                _.swipeStart(event);
                break;

            case 'move':
                _.swipeMove(event);
                break;

            case 'end':
                _.swipeEnd(event);
                break;

        }

    };

    Slick.prototype.swipeMove = function(event) {

        var _ = this,
            edgeWasHit = false,
            curLeft, swipeDirection, swipeLength, positionOffset, touches, verticalSwipeLength;

        touches = event.originalEvent !== undefined ? event.originalEvent.touches : null;

        if (!_.dragging || _.scrolling || touches && touches.length !== 1) {
            return false;
        }

        curLeft = _.getLeft(_.currentSlide);

        _.touchObject.curX = touches !== undefined ? touches[0].pageX : event.clientX;
        _.touchObject.curY = touches !== undefined ? touches[0].pageY : event.clientY;

        _.touchObject.swipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curX - _.touchObject.startX, 2)));

        verticalSwipeLength = Math.round(Math.sqrt(
            Math.pow(_.touchObject.curY - _.touchObject.startY, 2)));

        if (!_.options.verticalSwiping && !_.swiping && verticalSwipeLength > 4) {
            _.scrolling = true;
            return false;
        }

        if (_.options.verticalSwiping === true) {
            _.touchObject.swipeLength = verticalSwipeLength;
        }

        swipeDirection = _.swipeDirection();

        if (event.originalEvent !== undefined && _.touchObject.swipeLength > 4) {
            _.swiping = true;
            event.preventDefault();
        }

        positionOffset = (_.options.rtl === false ? 1 : -1) * (_.touchObject.curX > _.touchObject.startX ? 1 : -1);
        if (_.options.verticalSwiping === true) {
            positionOffset = _.touchObject.curY > _.touchObject.startY ? 1 : -1;
        }


        swipeLength = _.touchObject.swipeLength;

        _.touchObject.edgeHit = false;

        if (_.options.infinite === false) {
            if ((_.currentSlide === 0 && swipeDirection === 'right') || (_.currentSlide >= _.getDotCount() && swipeDirection === 'left')) {
                swipeLength = _.touchObject.swipeLength * _.options.edgeFriction;
                _.touchObject.edgeHit = true;
            }
        }

        if (_.options.vertical === false) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        } else {
            _.swipeLeft = curLeft + (swipeLength * (_.$list.height() / _.listWidth)) * positionOffset;
        }
        if (_.options.verticalSwiping === true) {
            _.swipeLeft = curLeft + swipeLength * positionOffset;
        }

        if (_.options.fade === true || _.options.touchMove === false) {
            return false;
        }

        if (_.animating === true) {
            _.swipeLeft = null;
            return false;
        }

        _.setCSS(_.swipeLeft);

    };

    Slick.prototype.swipeStart = function(event) {

        var _ = this,
            touches;

        _.interrupted = true;

        if (_.touchObject.fingerCount !== 1 || _.slideCount <= _.options.slidesToShow) {
            _.touchObject = {};
            return false;
        }

        if (event.originalEvent !== undefined && event.originalEvent.touches !== undefined) {
            touches = event.originalEvent.touches[0];
        }

        _.touchObject.startX = _.touchObject.curX = touches !== undefined ? touches.pageX : event.clientX;
        _.touchObject.startY = _.touchObject.curY = touches !== undefined ? touches.pageY : event.clientY;

        _.dragging = true;

    };

    Slick.prototype.unfilterSlides = Slick.prototype.slickUnfilter = function() {

        var _ = this;

        if (_.$slidesCache !== null) {

            _.unload();

            _.$slideTrack.children(this.options.slide).detach();

            _.$slidesCache.appendTo(_.$slideTrack);

            _.reinit();

        }

    };

    Slick.prototype.unload = function() {

        var _ = this;

        $('.slick-cloned', _.$slider).remove();

        if (_.$dots) {
            _.$dots.remove();
        }

        if (_.$prevArrow && _.htmlExpr.test(_.options.prevArrow)) {
            _.$prevArrow.remove();
        }

        if (_.$nextArrow && _.htmlExpr.test(_.options.nextArrow)) {
            _.$nextArrow.remove();
        }

        _.$slides
            .removeClass('slick-slide slick-active slick-visible slick-current')
            .attr('aria-hidden', 'true')
            .css('width', '');

    };

    Slick.prototype.unslick = function(fromBreakpoint) {

        var _ = this;
        _.$slider.trigger('unslick', [_, fromBreakpoint]);
        _.destroy();

    };

    Slick.prototype.updateArrows = function() {

        var _ = this,
            centerOffset;

        centerOffset = Math.floor(_.options.slidesToShow / 2);

        if ( _.options.arrows === true &&
            _.slideCount > _.options.slidesToShow &&
            !_.options.infinite ) {

            _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');
            _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            if (_.currentSlide === 0) {

                _.$prevArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$nextArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - _.options.slidesToShow && _.options.centerMode === false) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            } else if (_.currentSlide >= _.slideCount - 1 && _.options.centerMode === true) {

                _.$nextArrow.addClass('slick-disabled').attr('aria-disabled', 'true');
                _.$prevArrow.removeClass('slick-disabled').attr('aria-disabled', 'false');

            }

        }

    };

    Slick.prototype.updateDots = function() {

        var _ = this;

        if (_.$dots !== null) {

            _.$dots
                .find('li')
                    .removeClass('slick-active')
                    .end();

            _.$dots
                .find('li')
                .eq(Math.floor(_.currentSlide / _.options.slidesToScroll))
                .addClass('slick-active');

        }

    };

    Slick.prototype.visibility = function() {

        var _ = this;

        if ( _.options.autoplay ) {

            if ( document[_.hidden] ) {

                _.interrupted = true;

            } else {

                _.interrupted = false;

            }

        }

    };

    $.fn.slick = function() {
        var _ = this,
            opt = arguments[0],
            args = Array.prototype.slice.call(arguments, 1),
            l = _.length,
            i,
            ret;
        for (i = 0; i < l; i++) {
            if (typeof opt == 'object' || typeof opt == 'undefined')
                _[i].slick = new Slick(_[i], opt);
            else
                ret = _[i].slick[opt].apply(_[i].slick, args);
            if (typeof ret != 'undefined') return ret;
        }
        return _;
    };

}));

(function (document, window, $) {

	'use strict';

	// Open external links in new window (exclue scv image maps, email, tel and foobox)

	$('a').not('svg a, [href*="mailto:"], [href*="tel:"], [class*="foobox"]').each(function () {
		var isInternalLink = new RegExp('/' + window.location.host + '/');
		if ( ! isInternalLink.test(this.href) ) {
			$(this).attr('target', '_blank');
		}
	});
	
    

}(document, window, jQuery));


(function (document, window, $) {

	'use strict';
    
    // Scroll up show header

	var $site_header =  $('.site-header');

	// clone header
	var $sticky = $site_header.clone()
							   .prop('id', 'masthead-fixed' )
							   .attr('aria-hidden','true')
							   .addClass('fixed')
							   .insertBefore('#masthead');
            
    $sticky.each(function () {
        var $win = $(window), 
            $self = $(this),
            isShow = false,
            delta = 300, // distance from top where its active
            lastScrollTop = 0;
    
        $win.on('scroll', function () {
          
          // don't show below sticky menu
          if( $('#section-menu .wrap').hasClass('is-stuck') ) {
              return;
          }
          
          var scrollTop = $win.scrollTop();
          var offset = scrollTop - lastScrollTop;
          lastScrollTop = scrollTop;
          
    
    
          // min-offset, min-scroll-top
          if (offset < 0 && scrollTop > delta ) {
            if (!isShow ) {
              $self.addClass('fixed-show');
              isShow = true;
            }
          } else if (offset > 0 || offset < lastScrollTop ) {
            if (isShow) {
              $self.removeClass('fixed-show');
              isShow = false;
            }
          }
        });
    });
    

}(document, window, jQuery));
(function (document, window, $) {

	'use strict';

	// Load Foundation
	$(document).foundation();
    
    
    $(window).on('load changed.zf.mediaquery', function(event, newSize, oldSize) {
        
        $( '.nav-primary' ).doubleTapToGo();
        
        if( ! Foundation.MediaQuery.atLeast('xlarge') ) {
          $( '.nav-primary' ).doubleTapToGo( 'destroy' );
        }
        
        // need to reset sticky on resize. Otherwise ti breaks
        if( ! Foundation.MediaQuery.atLeast('xxlarge') ) {
            $(document).foundation();
        }
        
        
                
    });
    
    $('.footer-widgets .vertical.menu  .sub-menu').each( function() {
        $(this).addClass('menu vertical nested');
    });
    
    // Toggle menu
    
    $('li.menu-item-has-children > a').on('click',function(e){
        
        var $toggle = $(this).parent().find('.sub-menu-toggle');
        
        if( $toggle.is(':visible') ) {
            $toggle.trigger('click');
        }
        
        e.preventDefault();

    });
    
    
    
    $(document).on('click', '.play-video', playVideo);
    
    function playVideo() {
                
        var $this = $(this);
        
        var url = $this.data('src');
                
        var $modal = $('#' + $this.data('open'));
        
        /*
        $.ajax(url)
          .done(function(resp){
            $modal.find('.flex-video').html(resp).foundation('open');
        });
        */
        
        var $iframe = $('<iframe>', {
            src: url,
            id:  'video',
            frameborder: 0,
            scrolling: 'no'
            });
        
        $iframe.appendTo('.video-placeholder', $modal );        
        
        
        
    }
    
    // Make sure videos don't play in background
    $(document).on(
      'closed.zf.reveal', '#modal-video', function () {
        $(this).find('.video-placeholder').html('');
      }
    );
    
    
    // Reset Equalizr
    $(document).on('facetwp-loaded', function() {
        new Foundation.Equalizer($('#posts-grid'));
     });
     
     
     
     $('.page-template-team article.type-team .thumbnail')
     .mouseover(function() {
        if( $(this).data( 'background-hover' ) ) {
            $(this).css( 'background-image', 'url(' + $(this).data( 'background-hover' ) + ')' );
            console.log($(this).data( 'background-hover' ));
        }
      })
      .mouseout(function() {
        if( $(this).data( 'background-hover' ) ) {
            $(this).css( 'background-image', 'url(' + $(this).data( 'background' ) + ')' );
        }
      });
    
}(document, window, jQuery));

(function (document, window, $) {

	'use strict';

	// Replace all SVG images with inline SVG (use as needed so you can set hover fills)

        $('img.svg').each(function(){
            var $img = jQuery(this);
            var imgID = $img.attr('id');
            var imgClass = $img.attr('class');
            var imgURL = $img.attr('src');

		$.get(imgURL, function(data) {
			// Get the SVG tag, ignore the rest
			var $svg = jQuery(data).find('svg');

			// Add replaced image's ID to the new SVG
			if(typeof imgID !== 'undefined') {
				$svg = $svg.attr('id', imgID);
			}
			// Add replaced image's classes to the new SVG
			if(typeof imgClass !== 'undefined') {
				$svg = $svg.attr('class', imgClass+' replaced-svg');
			}

			// Remove any invalid XML tags as per http://validator.w3.org
			$svg = $svg.removeAttr('xmlns:a');

			// Replace image with new SVG
			$img.replaceWith($svg);

		}, 'xml');

	});

    

}(document, window, jQuery));


(function($) {
	'use strict';
				
	// Hide the extra content initially, using JS so that if JS is disabled, no problemo:
	$('.read-more-content').addClass('hide')
	$('.read-more-show, .read-more-hide').removeClass('hide')
	
	// Set up the toggle effect:
	$('.read-more-show').on('click', function(e) {
	  $(this).parent().find('.read-more-content').removeClass('hide');
	  $(this).addClass('hide');
	  e.preventDefault();
	});
	
	// Changes contributed by @diego-rzg
	$('.read-more-hide').on('click', function(e) {
	  var p = $(this).parents('.entry-content').find('.read-more-content').addClass('hide');
	  $(this).parents('.entry-content').find('.read-more-show').removeClass('hide'); // Hide only the preceding "Read More"
	  e.preventDefault();
	});
	

})(jQuery);

(function (document, window, $) {

	'use strict';

	// Responsive video embeds
	var $all_oembed_videos = $("iframe[src*='youtube'], iframe[src*='vimeo']");

	$all_oembed_videos.each(function() {

		var _this = $(this);

		if (_this.parent('.embed-container').length === 0) {
		  _this.wrap('<div class="embed-container"></div>');
		}

		_this.removeAttr('height').removeAttr('width');

 	});
    

}(document, window, jQuery));


(function($) {
	
	'use strict';	
	
	// Hero Options  
	var slider_opts = {
		transitionType: 'move',
		controlNavigation:'bullets',
        controlsInside: false,
        navigateByClick: false,
		imageScaleMode: 'fill',
		imageAlignCenter:false,
		arrowsNav: true,
		arrowsNavAutoHide: false,
		sliderTouch: false,
		addActiveClass: true,
		sliderDrag:false,
		fullscreen: false,
		loop: true,
		autoHeight: true,
		slidesSpacing: 0,
		transitionSpeed: 500,
        autoScaleSlider: true, 
		autoScaleSliderWidth: 1440,     
		autoScaleSliderHeight: 536,
        globalCaption: true,
        
		autoPlay: {
				// autoplay options go gere
				enabled: false,
				pauseOnHover: false,
				delay: 5000
			}
	  };
          
      
    // Testimonials Options  
	var testimonials_opts = {
		transitionType: 'move',
		controlNavigation:'none',
		imageAlignCenter:false,
        navigateByClick: false,
		arrowsNav: true,
		arrowsNavAutoHide: false,
		sliderTouch: false,
		addActiveClass: true,
		sliderDrag:false,
		fullscreen: false,
		loop: true,
		autoHeight: true,
		slidesSpacing: 0,
		transitionSpeed: 500,
        
		autoPlay: {
				// autoplay options go gere
				enabled: false,
				pauseOnHover: false,
				delay: 5000
			}
	  };
      
        
    var $slider = $(".element-slideshow .royalSlider");
    $slider.royalSlider( slider_opts );
    
    if ( $slider.data('royalSlider') && $slider.data('royalSlider').numSlides <= 1 ) { 
        $slider.find('.rsNav').hide();
        $slider.find('.rsArrow').hide();
    }
    
    var $testimonials = $(".section-testimonials .royalSlider");
    $testimonials.royalSlider( testimonials_opts );
      
    if ( $testimonials.data('royalSlider') && $testimonials.data('royalSlider').numSlides <= 1 ) { 
        $testimonials.find('.rsNav').hide();
    }
    else {
        $testimonials.find('.rsArrow').appendTo('.section-testimonials .royalSlider');
    }
        
	
})(jQuery);
(function (document, window, $) {

	'use strict';

	$('.logos').slick({
      dots: false,
      infinite: true,
      speed: 300,
      slidesToShow: 4,
      slidesToScroll: 1,
      responsive: [
        {
          breakpoint: 1024,
          settings: {
            slidesToShow: 3,
            slidesToScroll: 1,
            infinite: true,
            dots: false
          }
        },
        {
          breakpoint: 980,
          settings: {
            slidesToShow: 2,
            slidesToScroll: 2
          }
        },
        {
          breakpoint: 600,
          settings: {
            slidesToShow: 1,
            slidesToScroll: 1
          }
        }
        // You can unslick at a given breakpoint now by adding:
        // settings: "unslick"
        // instead of a settings object
      ]
    });
    
    
    $('.slick-posts').slick({
        dots: false,
        centerMode: false,
        //centerPadding: 0,
        slidesToShow: 4,
        arrows: true,
        //nextArrow: '<div class="arrow-right"><span class="screen-reader-text">Next</span></div>',
        //prevArrow: '<div class="arrow-left"><span class="screen-reader-text">Previous</span></div>',
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                centerMode: false,
                slidesToShow: 3,
              }
            },
            {
              breakpoint: 980,
              settings: {
                centerMode: false,
                slidesToShow: 2,
              }
            },
            {
              breakpoint: 600,
              settings: {
                centerMode: false,
                slidesToShow: 1,
              }
            }
        ]
    });
    
    
    $('.slick-posts').on('beforeChange', function(event, slick, currentSlide, nextSlide){
        new Foundation.Equalizer($('#slick-posts'));
    });
   
    
}(document, window, jQuery));



(function (document, window, $) {

	'use strict';
    
    var scrollnow = function(e) {
        
        var target;
                        
        // if scrollnow()-function was triggered by an event
        if (e) {
            e.preventDefault();
            target = this.hash;
        }
        // else it was called when page with a #hash was loaded
        else {
            target = location.hash;
        }

        // same page scroll
        $.smoothScroll({
            scrollTarget: target,
            beforeScroll: function() {
                
            },
            afterScroll: function() {
                 
            },
            
        });
    };

    // if page has a #hash
    if (location.hash) {
        $('html, body').scrollTop(0).show();
        // smooth-scroll to hash
        scrollnow();
    }

    // for each <a>-element that contains a "/" and a "#"
    $('a[href*="/"][href*=#]').each(function(){
        // if the pathname of the href references the same page
        if (this.pathname.replace(/^\//,'') === location.pathname.replace(/^\//,'') && this.hostname === location.hostname) {
            // only keep the hash, i.e. do not keep the pathname
            $(this).attr("href", this.hash);
        }
    });

    // select all href-elements that start with #
    // including the ones that were stripped by their pathname just above
    $('body').on('click', 'a[href^=#]:not([href=#])', scrollnow );

}(document, window, jQuery));

