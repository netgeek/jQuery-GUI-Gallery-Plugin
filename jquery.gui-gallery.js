/*!
 *
 * GUI Gallery Overlay - supports images/videos/iframes
 * @version 3.6
 * @author Mario McBean
 * @url http://www.devgit.eu/
 * @requirements jQuery 1.9 or higher
 * @copyright 2014 DevGit.eu
 * Released under the MIT license
 *
 */
(function($){
	// create image popup gallery
	$.fn.guiGallery = function(options) {

		var opts = $.extend(true, {}, $.fn.guiGallery.defaults, options),
			slider,
			$slide,
			identifier = $(this).attr('class'),
			ref = document.location.href + '?='+ identifier + '#' + this.length,
			initial_h,
			rewind = false,
			autoplay = {};

		if ( typeof opts.autoplaySpeed == 'number' && opts.autoplaySpeed < 2000 || typeof opts.autoplaySpeed != 'number' && /[^\d]/g.test(opts.autoplaySpeed) ) {
			opts.autoplaySpeed = 2000;
		} else if ( typeof opts.autoplaySpeed != 'number' && /\d/g.test(opts.autoplaySpeed) ) {
			if ( opts.autoplaySpeed < 2000 ) {
				opts.autoplaySpeed = 2000;
			} else {
				opts.autoplaySpeed = parseInt(opts.autoplaySpeed,10);
			}
		}

		this.on(opts.action, function(e) {
			e.preventDefault();
			var $this = $(this),
				is_gallery = ($this.parent().children().is('.'+identifier) && $this.parent().children().length > 1) ? true : false,
				initialised = false,
				title = $this.is('[data-title]') ? '<div class="panel-heading"><h3 class="panel-title">'+ ( $this.attr('data-title') ) +'</h3></div>' : ( ( $this.find('img').attr('alt') != 'undefined' && $this.find('img').attr('alt') != false && $.trim($this.find('img').attr('alt')) !== '' ) ? '<div class="panel-heading"><h3 class="panel-title">'+ ( $.trim($this.find('img').attr('alt')) ) +'</h3></div>' : '' ),
				content = $this.is('[data-content]') ? '<div class="panel-body">'+ ( $.trim($this.attr('data-content')) ) +'</div>' : '',
				media = ( $this.is('[data-type="iframe"]') || ! /\.(png|jpg|jpeg|gif|bmp|ico|svg)$/gi.test($this.attr('href')) ) ? ( content !== '' ? '<div class="gui-gallery-media"><iframe src="'+ ($this.attr('href')) +'" id="guiGallery-initial-panel-media" data-media="iframe"></iframe></div>' : '<iframe src="'+ ($this.attr('href')) +'" id="guiGallery-initial-panel-media" data-media="iframe"></iframe>' ) : ( content !== '' ? '<div class="gui-gallery-media"><img src="'+ ($this.attr('href')) +'" alt="" id="guiGallery-initial-panel-media" data-media="img" /></div>' : '<img src="'+ ($this.attr('href')) +'" alt="" id="guiGallery-initial-panel-media" data-media="img" />' ),
				m_type = /(<img)/gi.test(media) ? 'img' : ( /(<iframe)/gi.test(media) ? 'iframe' : '' ),
				overlay_content = '<div class="gui-overlay" data-rel="'+ ref +'"><div class="gui-loading" data-rel="'+ ref +'"><p>Loading...</p></div></div>'+
								  '<div class="gui-overlay-content" id="gui-overlay-content" data-rel="'+ ref +'" style="top:5000px;"><div class="gui-panel" id="gui-panel">' +
											// top buttons - close & sharing
											'<div class="gui-btn-holder-top">'+
												( opts.enableSharing ? '<div class="share gui-btn"><div class="gui-share-drop"><div class="facebook social-media-site" title="Share on Facebook"></div><div class="twitter social-media-site" title="Share on Twitter"></div><div class="googleplus social-media-site" title="Share on Google +"></div><div class="linkedin social-media-site" title="Share on Linkedin"></div><div class="pinterest social-media-site" title="Share on Pinterest"></div></div></div>' : '' ) + '<div class="close gui-btn" title="Close"></div>'+
											'</div>'+
											// bottom buttons - expand & auto-play & rewind
											( opts.enableExpand || opts.enableAutoplay ? '<div class="gui-btn-holder-bottom">'+ ( opts.enableExpand ? '<div class="expand gui-btn" title="Expand" style="display:none;"></div>' : '' ) + ( (opts.enableAutoplay && is_gallery) ? '<div class="rewind gui-btn" title="Go to first slide" style="display:none;"></div><div class="auto-play gui-btn" title="Auto Play"></div>' : '' ) + '</div>' : '' ) +
											// next & prev nav buttons
											( is_gallery ? '<div class="left"><span class="gui-prev"></span></div><div class="right"><span class="gui-next"></span></div>' : '' ) +
											// panel body
											'<div class="panel" id="gui-overlay-body">'+ title + media + content + '</div>'+
									'</div></div>';
									
			// append popover to body
			$('body').append(overlay_content);
			$this.addClass('current');

			// render popover on load
			$('#guiGallery-initial-panel-media').on('load.guigallery', function(){

				var viewport_height = (window.innerHeight ? window.innerHeight : $(window).innerHeight()) - ( title.length > 0 ? 152 : 113),
					media_h = this.offsetHeight,
					viewport_width = (window.innerWidth ? window.innerWidth : $(window).innerWidth()) - 120,
					media_w = this.offsetWidth;

				initial_h = media_h;

				// resize popover media if larger than viewport || is an iframe
				// correct img size
				if ( m_type === 'img' && media_h > viewport_height && content === '' ) {
					if ( ! viewport_height > viewport_width ) {

						this.style.height = viewport_height + 'px';
						this.style.width = 'auto';

					} else if ( viewport_height > viewport_width ) {
						this.style.height = 'auto';
						this.style.width = viewport_width + 'px';

					} else {
						this.style.height = viewport_height + 'px';
					}
				} else if ( m_type === 'iframe' ) {
					// size correction for iframes
					if ( content === '' ) {
						this.style.width = viewport_width + 'px';
						this.style.height = viewport_height + 'px';
					} else if ( content.length > 0 ) {
						this.style.height = viewport_height + 'px';
						this.style.width = ( viewport_width - this.parentNode.nextSibling.offsetWidth ) + 'px';
					}
				}

				if ( opts.enableExpand ) {
					if ( m_type === 'img' && initial_h > viewport_height ) {
						$('.gui-overlay-content[data-rel="'+ ref +'"] .expand.gui-btn').removeAttr('style');
					}
					// expand image proportionately to full size of viewport
					$('.gui-overlay-content[data-rel="'+ ref +'"] .expand.gui-btn').on('click.guigallery', function() {
						var vpw = window.innerWidth ? window.innerWidth : $(window).innerWidth(),
							vph = window.innerHeight ? window.innerHeight : $(window).innerHeight();

						if ( initial_h > vph ) {
							initial_h = vph - 100;
						}

						document.getElementById('gui-panel').removeAttribute('style');

						$(this).hide();

						if ( vpw > vph ) {
							$('.gui-overlay-content[data-rel="'+ ref +'"] .gui-panel .panel').find('img').css({
								width: (vpw - 100),
								height: "auto"
							});

						} else {
							$('.gui-overlay-content[data-rel="'+ ref +'"] .gui-panel .panel').find('img').css({
								height: initial_h,
								width: "auto"
							});
						}
					});

				}

				// position popover
				if ( m_type === 'img' && media_h < viewport_height ) {
					if ( content.length > 0 ) {
						this.parentNode.parentNode.parentNode.style.top = '50%';
						this.parentNode.parentNode.parentNode.style.marginTop = -((media_h + (title.length > 0 ? 59 : 20) ) / 2) + 'px';
					} else {
						this.parentNode.parentNode.style.top = '50%';
						this.parentNode.parentNode.style.marginTop = -((media_h + (title.length > 0 ? 59 : 20)) / 2) + 'px';
					}
				}

				// slide down popover to viewport centre 
				$('.gui-overlay-content[data-rel="'+ ref +'"]').animate({
					top : "3000px",
					top : "1000px",
					top : "0"
				}, 750, function(){
					$('.gui-loading[data-rel="'+ ref +'"]').remove();
					if ( typeof opts.open == 'function' && ! initialised ) { 
						opts.open.call(this);
						initialised = true;
					}
				});

			});

			// handle close
			$('.gui-overlay-content[data-rel="'+ ref +'"] .gui-panel .close.gui-btn').on('click.guigallery', function() {	
				$(document).off('.guigallery');
				$('.gui-overlay-content[data-rel="'+ ref +'"]').animate({
						top : "-1800px"
				}, 750, function(){
					$('.gui-overlay[data-rel="'+ ref +'"]').fadeOut(750).promise().done(function(){ 
						$(this).remove();
						$('.gui-overlay-content[data-rel="'+ ref +'"]').remove();
						$('.'+identifier + '.current').removeClass('current');
						
						if ( $('.'+identifier).parent().find('.'+identifier).length > 1 ) {
							$('.'+identifier).removeAttr('data-gallery-first data-gallery-last');
						}
						if ( typeof opts.close == 'function' ) { opts.close.call(this); }
						if ( opts.enableAutoplay && typeof $slide != 'undefined' ) {
							autoplay.stop();
						}
					});
				});
			});

			// close on esc key press || go next and prev on left and right directions key press
			$(document).on('keyup.guigallery', function(e) {
				var code = e.keyCode ? e.keyCode : e.which;
				if ( code == 27 ) {	
					$('.gui-overlay-content[data-rel="'+ ref +'"] .gui-panel .close.gui-btn').trigger('click');
				}
				if ( is_gallery ) {
					if ( code == 37 ) {
						prevGalleryItem();
					}
					if ( code == 39 ) {
						nextGalleryItem();
					}
				}	
			});

			// handle slider events only if it is an gallery of two or more images
			if ( is_gallery ) {

				$('.'+identifier + '.current').parent().find('.'+identifier+':first').attr('data-gallery-first','true');
				$('.'+identifier + '.current').parent().find('.'+identifier+':last').attr('data-gallery-last','true');

				$('.gui-overlay-content[data-rel="'+ ref +'"]').find('.left, .right, .auto-play.gui-btn, .rewind.gui-btn').on('click.guigallery', function(){
					// change content
					if ( $(this).is('.left') ) {
						prevGalleryItem();
					}
					if ( $(this).is('.right') ) {
						nextGalleryItem();
					}
					// autoplay function 
					if ( $(this).is('.auto-play.gui-btn') ) {
						var is_playing = $('.gui-overlay-content[data-rel="'+ ref +'"] .auto-play.gui-btn').is('.playing') ? true : false;
						
						$slide = $('.gui-overlay-content[data-rel="'+ ref +'"] .auto-play.gui-btn');

						if ( is_playing ) {
							autoplay.stop();
						} else {
							autoplay.play();
						}
					}
					// handle rewind
					if ( $(this).is('.rewind.gui-btn') ) {
						rewind = true;
						nextGalleryItem();

						if ( opts.enableAutoplay && typeof $slide != 'undefined' && $slide.is('.playing') ) {
							autoplay.stop();
						}

						$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').fadeOut('fast').promise().done(function(){
							$(this).addClass('is_hidden');
						});
					}
				});

				if ( ! $('.'+identifier+'.current').is('[data-gallery-first]') ) {
					$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').removeAttr('style');
				}
			}

			// handle sharing
			if ( opts.enableSharing ) {

				$('.gui-overlay-content[data-rel="'+ ref +'"] .gui-panel .share .gui-share-drop .social-media-site').on('click.guigallery', function() {
					var share_url = $('.gui-overlay-content[data-rel="'+ ref +'"] [data-media]')[0].src,
						 which = $(this).is('.facebook') ? 'facebook' : ( $(this).is('.twitter') ? 'twitter' : ( $(this).is('.linkedin') ? 'linkedin' : ( $(this).is('.pinterest') ? 'pinterest' : ( $(this).is('.googleplus') ? 'googleplus' : '' ) ) ) ),
						 url = encodeURIComponent(share_url),
						 shareText = $('.gui-overlay-content[data-rel="'+ ref +'"] .panel').find('h3').is('.panel-title') ? encodeURIComponent($('.gui-overlay-content[data-rel="'+ ref +'"] .panel .panel-title').text()) : encodeURIComponent(document.title),
						 share_content = $('.gui-overlay-content[data-rel="'+ ref +'"] .panel').find('div').is('.panel-body') ? $('.gui-overlay-content[data-rel="'+ ref +'"] .panel .panel-body').text() : shareText,
						 share_source = encodeURIComponent(location.href);

					if ( share_content.length > 100 ) {
						share_content = share_content.substring(0,97) + '...';
					}

					switch(which) {
						case "facebook" : 
							window.open('https://www.facebook.com/sharer/sharer.php?u='+url,'_blank','menubar=no,fullscreen=no,height=313,width=675,top=0,left=0',false);
						break;
						case "twitter" : 
							window.open('https://twitter.com/intent/tweet?text='+share_content+'&url='+url,'_blank','menubar=no,fullscreen=no,height=450,width=550,top=0,left=0,resizable=yes',false);
						break;
						case "linkedin" : 
							window.open('http://www.linkedin.com/shareArticle?mini=true&url='+url+'&title='+shareText+'&summary='+share_content+'&source='+share_source,'_blank','menubar=no,fullscreen=no,height=408,width=600,top=0,left=0,resizable=yes',false);
						break;
						case "pinterest" : 
							window.open('http://pinterest.com/pin/create/button/?url'+share_source+'&media='+url+'&description='+share_content,'_blank','menubar=no,fullscreen=no,height=570,width=520,top=0,left=0,resizable=yes',false);
						break;
						case "googleplus" : 
							window.open('https://plus.google.com/share?url='+url,'_blank','toolbar=no,menubar=no,fullscreen=no,height=344,width=568,top=0,left=0,resizable=yes',false);
						break;
					}
				});
			}
		});

		// next view
		function nextGalleryItem() {

			var loader_target = document.getElementById('gui-overlay-body'),
				loader_gif = document.createElement('div'),next_type, 
				next_title,
				next_media,
				next_content,
				next_markup,
				new_title,
				new_media,
				the_new_media,
				new_content,
				new_markup,
				call_afterChange = false;

			loader_gif.className = 'gui-loading-gallery';
			loader_gif.innerHTML = '<p>Loading...</p>';
			loader_target.appendChild(loader_gif);

			if ( ! $('.'+identifier + '.current').next().is('.'+identifier) || rewind == true ) {

				var first = $('[data-gallery-first="true"]');
				next_type = ( first.is('[data-type="iframe"]') || ! /\.(png|jpg|jpeg|gif|bmp|ico|svg)$/gi.test(first.attr('href'))) ? 'iframe' : 'img';
				next_title = first.is('[data-title]') ? first.attr('data-title') : ( $.trim( first.find('img').attr('alt') ) !== '' && first.find('img').attr('alt') != 'undefined' ? $.trim( first.find('img').attr('alt') ) : '' );
				next_media = first.attr('href');
				next_content = first.is('[data-content]') ? $.trim( first.attr('data-content') ) : '';
				$('.'+identifier + '.current').removeClass('current');
				first.addClass('current');
				$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').hide();
				rewind = false;

			} else {

				next_type = ( $('.'+identifier + '.current').next().is('[data-type="iframe"]') || ! /\.(png|jpg|jpeg|gif|bmp|ico|svg)$/gi.test($('.'+identifier + '.current').next().attr('href'))) ? 'iframe' : 'img';
				next_title = $('.'+identifier + '.current').next().is('[data-title]') ? $('.'+identifier + '.current').next().attr('data-title') : ( $.trim( $('.'+identifier + '.current').next().find('img').attr('alt') ) !== '' && $('.'+identifier + '.current').next().find('img').attr('alt') != 'undefined' ? $.trim( $('.'+identifier + '.current').next().find('img').attr('alt') ) : '' );
				next_media = $('.'+identifier + '.current').next().attr('href');
				next_content = $('.'+identifier + '.current').next().is('[data-content]') ? $.trim( $('.'+identifier + '.current').next().attr('data-content') ) : '';
				$('.'+identifier + '.current').removeClass('current').next().addClass('current');

				$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').show();

			}

			new_title = next_title ? '<div class="panel-heading"><h3 class="panel-title">'+ next_title +'</h3></div>' : '';
			new_media = next_type === 'iframe' ? '<iframe src="'+ next_media +'" data-media="new" id="guiGallery-new-panel-media"></iframe>' : '<img src="'+ next_media +'" alt="'+ next_title +'" data-media="new" id="guiGallery-new-panel-media" />';
			new_content = next_content ? '<div class="panel-body">'+ next_content + '</div>' : '';
			the_new_media = new_content.length > 0 ? '<div class="gui-gallery-media">'+ new_media +'</div>' : new_media;
			new_markup = document.createElement('div');

			new_markup.className = 'panel';
			new_markup.id = 'gui-new-content';
			new_markup.innerHTML = new_title + the_new_media + new_content;
			document.body.appendChild(new_markup);

			if ( opts.enableAutoplay && typeof $slide != 'undefined' && $slide.is('.playing') ) {
				autoplay.pause();
			}

			$('#guiGallery-new-panel-media').on('load.guigallery', function(){
				
				var viewport_height = (window.innerHeight ? window.innerHeight : $(window).innerHeight()) - ( next_title.length > 0 ? 152 : 113),
					viewport_width = (window.innerWidth ? window.innerWidth : $(window).innerWidth()) - 120,
					media_h = this.offsetHeight,
					media_w = this.offsetWidth,
					panel_height,
					temp,
					old;

				initial_h = media_h;

				// resize media 
				if ( next_type === 'img' && media_h > viewport_height && next_content === '' && ! call_afterChange ) {
					if ( ! viewport_height > viewport_width ) {
						this.style.height = viewport_height + 'px';
						this.style.width = 'auto';

					} else if ( viewport_height > viewport_width ) {
						this.style.height = 'auto';
						this.style.width = viewport_width + 'px';

					} else {
						this.style.height = viewport_height + 'px';
					}
				} else if ( next_type === 'iframe' ) {
					// size correction for iframes
					if ( next_content === '' ) {
						this.style.width = viewport_width + 'px';
						this.style.height = viewport_height + 'px';
					} else if ( next_content.length > 0 ) {
						this.style.height = viewport_height + 'px';
						this.style.width = ( viewport_width - this.parentNode.nextSibling.offsetWidth ) + 'px';
					}
				}

				if ( next_type === 'img' && next_content === '' && initial_h > viewport_height && ! call_afterChange ) {
					$('.gui-overlay-content[data-rel="'+ ref +'"] .expand.gui-btn').removeAttr('style');
				} else {
					$('.gui-overlay-content[data-rel="'+ ref +'"] .expand.gui-btn').hide();
				}

				temp = document.getElementById('gui-new-content');
				old = document.getElementById('gui-overlay-body');

				if ( ! call_afterChange ) {
					
					// append new markup
					old.parentNode.replaceChild(temp, old);
					temp = document.getElementById('gui-new-content');

					// reset ids
					temp.removeAttribute('id');
					temp.id = 'gui-overlay-body';
					temp = document.getElementById('guiGallery-new-panel-media');
					temp.removeAttribute('id');
				}

				media_h = this.offsetHeight;

				// position popover
				if ( next_type === 'img' && media_h < viewport_height && ! call_afterChange) {
					if ( next_content.length > 0 ) {
						this.parentNode.parentNode.parentNode.style.top = '50%';
						this.parentNode.parentNode.parentNode.style.marginTop = -((media_h + (next_title.length > 0 ? 59 : 20) ) / 2) + 'px';
					} else {
						this.parentNode.parentNode.style.top = '50%';
						this.parentNode.parentNode.style.marginTop = -((media_h + (next_title.length > 0 ? 59 : 20)) / 2) + 'px';
					} 
				} else {
					if ( next_content.length > 0 ) {
						this.parentNode.parentNode.parentNode.removeAttribute('style');
					} else {
						this.parentNode.parentNode.removeAttribute('style');
					}
				}

				if ( opts.enableAutoplay && typeof $slide != 'undefined' && $slide.is('.paused') && ! call_afterChange ) {
					autoplay.resume();
				}

				if ( ! $('.'+identifier + '.current').next().is('.'+identifier) && ! call_afterChange ) {
					if ( opts.enableAutoplay && typeof $slide != 'undefined' && $slide.is('.playing') ) {
						autoplay.stop();
					}
				}

				if ( typeof opts.afterChange == 'function' && ! call_afterChange ) { 
					opts.afterChange.call(this);
					call_afterChange = true;
				}
			});
		}

		// previous view
		function prevGalleryItem() {

			var loader_target = document.getElementById('gui-overlay-body'),
				loader_gif = document.createElement('div'),prev_type,
				prev_title,
				prev_media,
				prev_content,
				prev_markup,
				new_title,
				new_media,
				the_new_media,
				new_content,
				new_markup,
				call_afterChange = false;

			loader_gif.className = 'gui-loading-gallery';
			loader_gif.innerHTML = '<p>Loading...</p>';
			loader_target.appendChild(loader_gif);

			if ( ! $('.'+identifier + '.current').prev().is('.'+identifier) ) {

				var last = $('[data-gallery-last="true"]');

				prev_type = ( last.is('[data-type="iframe"]') || ! /\.(png|jpg|jpeg|gif|bmp|ico|svg)$/gi.test(last.attr('href'))) ? 'iframe' : 'img';
				prev_title = last.is('[data-title]') ? last.attr('data-title') : ( $.trim( last.find('img').attr('alt') ) !== '' && last.find('img').attr('alt') != 'undefined' ? $.trim( last.find('img').attr('alt') ) : '' );
				prev_media = last.attr('href');
				prev_content = last.is('[data-content]') ? $.trim( last.attr('data-content') ) : '';
				$('.'+identifier + '.current').removeClass('current');
				last.addClass('current');
				$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').show();

			} else {

				prev_type = ( $('.'+identifier + '.current').prev().is('[data-type="iframe"]') || ! /\.(png|jpg|jpeg|gif|bmp|ico|svg)$/gi.test($('.'+identifier + '.current').prev().attr('href'))) ? 'iframe' : 'img';
				prev_title = $('.'+identifier + '.current').prev().is('[data-title]') ? $('.'+identifier + '.current').prev().attr('data-title') : ( $.trim( $('.'+identifier + '.current').prev().find('img').attr('alt') ) !== '' && $('.'+identifier + '.current').prev().find('img').attr('alt') != 'undefined' ? $.trim( $('.'+identifier + '.current').prev().find('img').attr('alt') ) : '' );
				prev_media = $('.'+identifier + '.current').prev().attr('href');
				prev_content = $('.'+identifier + '.current').prev().is('[data-content]') ? $.trim( $('.'+identifier + '.current').prev().attr('data-content') ) : '';
				$('.'+identifier + '.current').removeClass('current').prev().addClass('current');
				$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').show();

			}

			new_title = prev_title ? '<div class="panel-heading"><h3 class="panel-title">'+ prev_title +'</h3></div>' : '';
			new_media = prev_type === 'iframe' ? '<iframe src="'+ prev_media +'" data-media="new" id="guiGallery-new-panel-media"></iframe>' : '<img src="'+ prev_media +'" alt="'+ prev_title +'" data-media="new" id="guiGallery-new-panel-media" />';
			new_content = prev_content ? '<div class="panel-body">'+ prev_content + '</div>' : '';
			the_new_media = new_content.length > 0 ? '<div class="gui-gallery-media">'+ new_media +'</div>' : new_media;
			new_markup = document.createElement('div');

			new_markup.className = 'panel';
			new_markup.id = 'gui-new-content';
			new_markup.innerHTML = new_title + the_new_media + new_content;
			document.body.appendChild(new_markup);

			$('#guiGallery-new-panel-media').on('load.guigallery', function(){
				
				var viewport_height = (window.innerHeight ? window.innerHeight : $(window).innerHeight()) - ( prev_title.length > 0 ? 152 : 113),
					viewport_width = (window.innerWidth ? window.innerWidth : $(window).innerWidth()) - 120,
					media_h = this.offsetHeight,
					media_w = this.offsetWidth,
					temp,
					old;

				initial_h = media_h;

				// resize media 
				if ( prev_type === 'img' && media_h > viewport_height && prev_content === '' && ! call_afterChange ) {
					if ( ! viewport_height > viewport_width ) {
						this.style.height = viewport_height + 'px';
						this.style.width = 'auto';

					} else if ( viewport_height > viewport_width ) {

						this.style.height = 'auto';
						this.style.width = viewport_width + 'px';

					} else {
						this.style.height = viewport_height + 'px';
					}
				} else if ( prev_type === 'iframe' ) {
					// size correction for iframes
					if ( prev_content === '' ) {
						this.style.width = viewport_width + 'px';
						this.style.height = viewport_height + 'px';
					} else if ( prev_content.length > 0 ) {
						this.style.height = viewport_height + 'px';
						this.style.width = ( viewport_width - this.parentNode.nextSibling.offsetWidth ) + 'px';
					}
				}

				if ( prev_type === 'img' && prev_content === '' && initial_h > viewport_height && ! call_afterChange ) {
					$('.gui-overlay-content[data-rel="'+ ref +'"] .expand.gui-btn').removeAttr('style');
				} else {
					$('.gui-overlay-content[data-rel="'+ ref +'"] .expand.gui-btn').hide();
				}

				// locate new content and old content
				temp = document.getElementById('gui-new-content');
				old = document.getElementById('gui-overlay-body');

				if ( ! call_afterChange ) {

					//append to popoever frame
					old.parentNode.replaceChild(temp, old);

					//reset ids
					temp = document.getElementById('gui-new-content');
					temp.removeAttribute('id');
					temp.id = 'gui-overlay-body';
					temp = document.getElementById('guiGallery-new-panel-media');
					temp.removeAttribute('id');
				}

				media_h = this.offsetHeight;

				// position popover
				if ( prev_type === 'img' && media_h < viewport_height && ! call_afterChange ) {
					if ( prev_content.length > 0 ) {
						this.parentNode.parentNode.parentNode.style.top = '50%';
						this.parentNode.parentNode.parentNode.style.marginTop = -((media_h + (prev_title.length > 0 ? 59 : 20) ) / 2) + 'px';
					} else {
						this.parentNode.parentNode.style.top = '50%';
						this.parentNode.parentNode.style.marginTop = -((media_h + (prev_title.length > 0 ? 59 : 20)) / 2) + 'px';
					}

				} else {
					if ( prev_content.length > 0 ) {
						this.parentNode.parentNode.parentNode.removeAttribute('style');
					} else {
						this.parentNode.parentNode.removeAttribute('style');
					}
				}

				if ( typeof opts.afterChange == 'function' && ! call_afterChange ) { opts.afterChange.call(this); call_afterChange = true; }
			});
			
			if ( $('.'+identifier + '.current').is('[data-gallery-first]') ) {
				$('.gui-overlay-content[data-rel="'+ ref +'"] .rewind.gui-btn').hide();
			}
		}

		// autoplay
		autoplay.play = function() {
			slider = setInterval(function(){
				nextGalleryItem();
			}, opts.autoplaySpeed);
			$slide.addClass('active playing');
		};
		// stop autoplay
		autoplay.stop = function() {
			clearInterval(slider);
			$slide.removeClass('active playing');
		};
		// pause autoplay
		autoplay.pause = function() {
			clearInterval(slider);
			$slide.addClass('paused').removeClass('active playing');
		};
		// resume autoplay
		autoplay.resume = function() {
			slider = setInterval(function(){
				nextGalleryItem();
			}, opts.autoplaySpeed);
			$slide.removeClass('paused').addClass('active playing');
		};

		return this;
	};

	// default options
	$.fn.guiGallery.defaults = {
		action 				: "click", // @param string - must be either "click", "mouseenter", "mouseleave", "focus", "blur" etc - default is "click"
		open 				: $.noop,  // @param function - must be an anonymous function e.g. function() { #code here }, fires only once (when the popover has fully loaded)
		close 				: $.noop,  // @param function - must be an anonymous function e.g. function() { #code here }, fires only once (when popover is closed)
		beforeChange 		: $.noop,  // @param function - must be an anonymous function e.g. function() { #code here }, fires once everytime before the slide changes
		afterChange 		: $.noop,  // @param function - must be an anonymous function e.g. function() { #code here }, fires once everytime after the slide changes
		enableAutoplay 		: true,	   // @param boolean - true / false
		autoplaySpeed 		: 2500,	   // @param integer - speed of auto play in milliseconds - 2500 is default - minimum of 2000
		enableExpand 		: true,	   // @param boolean - true / false - enable expand buttons for images larger than viewport 
		enableSharing 		: true	   // @param boolean - true / false - enable social media sharing of image
	};

})(jQuery);