/**
 * (c) 2011 Casadirocco.nl
 * 
 * Version: v1.0
 * Author: Nico Di Rocco
 * 
 * This plugin is based on the jQuery Backstretch plugin by Scott Robin
 * http://srobbin.com/blog/jquery-plugins/jquery-backstretch/
 * See code from github here: https://github.com/srobbin/jquery-backstretch
 * 
 * 
 * 
 **/

$.backgrounder = function( images, options )
{	
	//Default settings
	var settings = {
		transitionTime: 1600,						// Amount of time to fade in/out the images
		displayTime: 		5000,
		centeredX: 			true,					// Should we center the image on the X axis?
    centeredY: 			true,					// Should we center the image on the Y axis?
		zIndex: 				-666
	};	


	//Combine options with default settings if it's needed
	if( options && typeof options == "object" ) 
		settings = $.extend(settings, options);


	//Create container and add to the body
	var container = $("<div />").attr("id", "backgrounder").css({left: 0, top: 0, overflow: "hidden",zIndex:settings.zIndex});
	
	$('body').prepend(container).css({overflow:"hidden"});

	//Load all the images and add to container
	var imgElement;
	for( var i = images.length; i--; )
	{
	  imgElement = $("<img />").css({display:"none",position:"absolute",zIndex:settings.zIndex}).attr("src",images[i]);
		container.append(imgElement);
	}
	
	
	//Disable context menu on all images
	$('img', container).bind("contextmenu",function() { return false; });
	$('img', container).bind("mousedown",function() { return false; });
	
	
	//Grab the first image in the container and fade in
	$("img:first-child", container).toggleClass("current").fadeIn(settings.transitionTime);
	
	
	resizer();
	$(window).resize(resizer);
	$(window).load(resizer);
	
	//Slideshow enabled
	setInterval(function()
	{
		var currImg = $(".current", container);
		
		if( !currImg.next().length )
			var startAtBeginning = true;
		
		if( startAtBeginning )
		{
			container.find('img:first-child').addClass("current").css({display:'block'});
			currImg.removeClass("current").fadeOut(settings.transitionTime);
		}
		else
		{
			currImg.next().addClass("current").fadeIn(settings.transitionTime,function(){
				currImg.removeClass("current").css({display:"none"});
			});
		}
	}, settings.displayTime);


	
	function resizer()
	{		
		var imgRatio, bgCSS, bgWidth, bgHeight;
		var windowWidth = $(window).width();
		var windowHeight = $(window).height();

		$("img", container).each(function()
		{
			imgRatio = $(this).width() / $(this).height();
			
			bgCSS = {left: 0, top: 0}
			bgWidth = windowWidth;
			bgHeight = bgWidth / imgRatio;

			if( bgHeight >= windowHeight )
			{
				bgOffset = (bgHeight - windowHeight) /2;
				if(settings.centeredY) $.extend(bgCSS, {top: "-" + bgOffset + "px"});
			}
			else
			{
				bgHeight = windowHeight;
				bgWidth = bgHeight * imgRatio;
				bgOffset = (bgWidth - windowWidth) / 2;
				if(settings.centeredX) $.extend(bgCSS, {left: "-" + bgOffset + "px"});
			}

			$(this).width( bgWidth ).height( bgHeight ).css(bgCSS);
		});
	}
}