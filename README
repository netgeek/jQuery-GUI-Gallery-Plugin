jQuery-GUI-Gallery-Plugin
=========================
<pre>
Need a fast loading jQuery lightbox plugin that supports videos, pictures, popover content, iframes with social media sharing? Well give this plugin a try.

This plugin was inspired by lightbox and prettyphoto. Most of the plugin is written mostly in native javascript and is upto 20 times faster that the PrettyPhoto and Lightbox plugins.

Features :
========

- Uses CSS 3 transitions
- Supports All major browsers : Internet Explorer, Chrome, Firefox, Opera, Safari and mobile devices
- It intelligent and can detect a gallery from a single and renders content appropriately.
- Autoplay Feature : you can customise the speed of the gallery slideshow
- Rewind Feature : users can go to the first image in the gallery with a click of a button
- Expand Feature : a button is created if the size of the image is larger than the browser viewport and allows the user to expand the image upto the size of the viewport (minus the margins)
- Users can use the left and right keyboard key to navigate the gallery
- The "ESC" keyboard key closes the slideshow
- You can select which jQuery action you want to use to trigger the plugin : such 'mousenter', 'mouseleave', 'click' etc
- Add custom functions which will fire after certain actions the plugin performs : open, beforeChange, afterChange and close
- Users can share the image/video/iframe/content on Facebook, Twitter, Linkedin, Google + and Pinterest with a click of a button - Please note the social media buttons will not affect any current social media plugin currently running on your site as it implements sharing using the various social media API's without javascript
- It minifies DOM manipulation aswell as event handlers to give your users optimal performance and responsiveness
- All event handlers attached to the plugin DOM elements are only created when the popover gallery has been rendered to the webpage
- When the gallery closes all event handlers are removed without affecting any other event handlers currently attached to the webpage
- You can create content with HTML markup on the fly by using HTML attributes on your DOM elements - which will be rendered in a content area next to the image.
- Perfect for most uses.
- Has a beautiful interface which is none intrusive and user friendly

How to use :
===========

1. Download the jquery.gui-gallery.zip file from this repository. Uncompress it.
2. Inside you find two folders : images & css - Please note you need to keep the same folder structure as the UI buttons are created from a sprite located in the "images" folder
3. Insert the css stylesheet in the head of your webpage :

&lt;link rel="stylesheet" href="path/to/jquery.gui-gallery.min.css"&gt;

4. In order to load the plugin you need to first load jQuery on your webpage : Insert the following jQuery Library script tag anywhere in your document before including the plugin script.
&lt;script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"&gt;&lt;/script&gt;

5. You can put the plugin javascript file in any folder you like then include it in your webpage after the jQuery Library script :

&lt;script type="text/javascript" src="path/to/jquery.gui-gallery.min.js"&gt;&lt;/script&gt;

6. Initialise the plugin by either placing the following code in an external .js file or directly on your webpage :

For external use in .js file :
jQuery(function($){	
	$('.thumb').guiGallery({
		action 				: "click", // @param string - must be either "click", "mouseenter", "mouseleave", "focus", "blur"
		open 				: function() {  /* place your custom functions here */ },  // @param function - must be an anonymous function e.g. function() { #code here }, fires only once (when the popover has fully loaded)
		close 				: function() {  /* place your custom functions here */ },  // @param function - must be an anonymous function e.g. function() { #code here }, fires only once (when popover is closed)
		beforeChange 		: function() {  /* place your custom functions here */ },  // @param function - must be an anonymous function e.g. function() { #code here }, fires once everytime before the slide changes
		afterChange 		: function() {  /* place your custom functions here */ },  // @param function - must be an anonymous function e.g. function() { #code here }, fires once everytime after the slide changes
		enableAutoplay 		: true,	   // @param boolean - true / false
		autoplaySpeed 		: 2500,	   // @param integer - speed of auto play in milliseconds - 2500 is default (minimum of 2000)
		enableExpand 		: true,	   // @param boolean - true / false - enable expand buttons for images larger than viewport 
		enableSharing 		: true	   // @param boolean - true / false - enable social media sharing of image
	});
});

For inline use directly on your webpage .js file :

&lt;script type="text/javascript"&gt;
jQuery(function($){	
	$('.thumb').guiGallery({
		action 				: "click", // @param string - must be either "click", "mouseenter", "mouseleave", "focus", "blur" etc
		open 				: function() {  /* place your custom functions here */ },  //(optional) @param function - must be an anonymous function e.g. function() { #code here }, fires only once (when the popover has fully loaded) 
		close 				: function() {  /* place your custom functions here */ },  //(optional) @param function - must be an anonymous function e.g. function() { #code here }, fires only once (when popover is closed)
		beforeChange 		: function() {  /* place your custom functions here */ },  //(optional) @param function - must be an anonymous function e.g. function() { #code here }, fires once everytime before the slide changes
		afterChange 		: function() {  /* place your custom functions here */ },  //(optional) @param function - must be an anonymous function e.g. function() { #code here }, fires once everytime after the slide changes
		enableAutoplay 		: true,	   // @param boolean - true / false - default is true
		autoplaySpeed 		: 2500,	   // @param integer - speed of auto play in milliseconds - 2500 is default (minimum of 2000)
		enableExpand 		: true,	   // @param boolean - true / false - enable expand buttons for images larger than viewport  - default is true
		enableSharing 		: true	   // @param boolean - true / false - enable social media sharing of image - default is true
	});
});
&lt;/script&gt;
<
This plugin is extremely performant and fast loading and utilised clever DOM manipulation

Parameters : 
============
action - string - eg: "click" - choose an action which will trigger the image/video/iframe/content to be rendered

open - function() {  /* place your custom functions here */ } - this function fires when the gallery first opens

close - function() {  /* place your custom functions here */ } - this function fires when the gallery has closed and all gallery event handlers have been removed

beforeChange - function() {  /* place your custom functions here */ } - this function fires once before each new gallery item is loaded

afterChange - beforeChange - function() {  /* place your custom functions here */ } - this function fires once after each new gallery item is loaded

enableAutoPlay - true or false - renders the autoplay button so users can view gallery as a slideshow

enableExpand - true or false - renders the expand button so users expand the image to a larger size ( this only works if original image was larger than the browser viewport)

autoplaySpeed - integer - eg: 3000 - time between slideshow changing content

enableSharing - ture or false - renders social media share buttons

HTML markup :
===========

Basic Usage :
&lt;a href="path/to/fullsize_image/or/iframe/or/video/iframe" class="whatever-you-like"&gt;&lt;img src="/path/to/thumbnail" alt=""&gt;&lt;/a&gt;

If the thumbnail image has an Alt it will be used for the title of the popover window.

You can override this by adding an attribute (data-title="title you want to display") to the &lt;a&gt; tag. For example :

&lt;a href="path/to/fullsize_image/or/iframe/or/video/iframe" data-title="title you want to display" class="whatever-you-like"&gt;&lt;img src="/path/to/thumbnail" alt=""&gt;&lt;/a&gt;

Advanced Usage:
You can add HTML markup to be displayed in the gallery next to the relevant item by add an attribue (data-content="html markup") to the &lt;a&gt; tag. For example:

&lt;a href="path/to/fullsize_image/or/iframe/or/video/iframe" data-content="&lt;h1&gt;Test&lt;/h1&gt; &lt;p&gt;This a dummy content&lt;/p&gt;" data-title="title you want to display" class="whatever-you-like"&gt;&lt;img src="/path/to/thumbnail" alt=""&gt;&lt;/a&gt;


This plugin can be edited and freely distributed. But please leave the headers on the css and js files.

Fork me if you like this plugin. Drop me a line if there are any features you would like include that the plugin currently doesn't have.

ENJOY!!
</pre>
