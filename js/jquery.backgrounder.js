$.backgrounder = function( images, options )
{	
	//Default settings
	var settings = {
		transitionTime: 1600,						// Amount of time to fade in/out the images
		displayTime: 5000,
		centeredX: true,					// Should we center the image on the X axis?
    centeredY: true					// Should we center the image on the Y axis?
	};	


	//Combine options with default settings if it's needed
	if( options && typeof options == "object" ) 
		var settings = $.extend(settings, options);


	//Create container and add to the body
	var container = $("<div />").attr("id", "backgrounder").css({left: 0, top: 0, overflow: "hidden", zIndex: -9999});
	
	$('body').prepend(container).css({overflow:"hidden"});

	var rootElement = $(window); //("onorientationchange" in window) ? $(document) : $(window);
	
	//Load all the images and add to container
	for( var i = images.length; i--; )
	{
	  var imgElement = $("<img />").css({display:"none",position:"absolute", zIndex: -9990}).attr("src",images[i]);
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
		var nextImg = currImg.next().length ? currImg.next() : container.find('img:first-child');

		//currImg.toggleClass("current").fadeOut(settings.transitionTime);
		//nextImg.toggleClass("current").delay(settings.transitionTime/4).fadeIn(settings.transitionTime);
		nextImg.toggleClass("current").fadeIn(settings.transitionTime,function()
		{
			currImg.toggleClass("current").css({display:"none"});
		});
	}, settings.displayTime);
	
	
	
	function resizer()
	{
		
		$("img", container).each(function()
		{
			var imgRatio = $(this).width() / $(this).height();
			
			var bgCSS = {left: 0, top: 0}
			var bgWidth = rootElement.width();
			var bgHeight = bgWidth / imgRatio;

			if( bgHeight >= rootElement.height() )
			{
				bgOffset = (bgHeight - rootElement.height()) /2;
				if(settings.centeredY) $.extend(bgCSS, {top: "-" + bgOffset + "px"});
			}
			else
			{
				bgHeight = rootElement.height();
				bgWidth = bgHeight * imgRatio;
				bgOffset = (bgWidth - rootElement.width()) / 2;
				if(settings.centeredX) $.extend(bgCSS, {left: "-" + bgOffset + "px"});
			}

			$(this).width( bgWidth ).height( bgHeight ).css(bgCSS);
		});
	}
}