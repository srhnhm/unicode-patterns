
	var canvas = $('div#canvas');
	var url = '';
	var params = {
		fs: 40,
		c: ['0000000', '4d4d4d', '8e8e8e', 'cccccc', 'ffffff'],
		d: 0,
		u: ['9700', '9701']
	};


	$('.char').each(function() {
		$(this).attr('id', 'u_'+$(this).text().charCodeAt(0));
	});
	
	function createColorPalette(domElement) {
		var colors = $(domElement).text();
		colorsArray = colors.split(" ");
		$(domElement).text('').attr('title', colors);
		var percent = 100/colorsArray.length;
		for (var i = 0; i < colorsArray.length; i ++) {
			$(domElement).append('<div style="background-color: #'+colorsArray[i]+'; width:'+percent+'%"></div>')
		}
	}
	

	function getParameters() {
	  	var urlString = window.location.search.substring(1);
  		if (urlString.length > 1) {
	  		urlArray = urlString.split("&");
	  		for (var i=0;i<urlArray.length;i++) {
	  			var val = urlArray[i].split("=");
	  			var valStr = val[1].replace(/%2C/g, ',');
	  			var valueArray = valStr.split(',');
	  			params[val[0]] = valueArray;
	  		}

  		}
	}

	function populate(params) {
		canvas.html('');
		var fs = parseInt(params.fs);
		var d = (parseInt(params.d)*fs*.3)+fs;
		var w = parseInt($(canvas).css('width'));
		var h = parseInt($(canvas).css('height'));
		var rows = h/fs;
		var columns = w/fs;
		var blanks = '';
		var chars = [];

		for (var j=0; j<params.u.length; j++){
			chars.push(String.fromCharCode(params.u[j]))
			$('#u_'+params.u[j]).addClass('selected');
		}

		function randomColor() {
			return "#"+params.c[Math.floor(Math.random()*params.c.length)];
		}

		function randomCharacter() {
			return chars[Math.floor(Math.random()*chars.length)];
		}

		for (var i=0; i<((rows/2)+10); i++) {
			for (var j=0; j<columns; j++) {
				blanks += '<span class="unicode" style="background-color: '+randomColor()+'; color: '+randomColor()+'; font-size: '+d+'; line-height: 1em">'+randomCharacter()+'</span>';
				blanks += '<span class="unicode" style="background-color: '+randomColor()+'; color: '+randomColor()+'; font-size: '+fs+'; line-height: 1em">'+randomCharacter()+'</span>';
			}
		}
		
		canvas.append(blanks);

		$('#size').attr('value', params.fs+'px');
		$('#distortion').attr('value', params.d);
	}

	$('.colorpalette').each(function(i, domElement) {
		createColorPalette(domElement);
	});
	getParameters();
	populate(params);



$(document).ready(function() {
	
	$(window).resize(function() {
		populate(params);		
	});

	$('#reset').on({
		click: function(){
			params.fs = parseInt($('#size').val());
			params.d = parseInt($('#distortion').val());
			populate(params);
		}
	});

	$('#getUrl').on({
		click: function() {
			var url =('http://'+ window.location.host + window.location.pathname+"?fs="+params.fs+"&d="+params.d+"&c="+String(params.c).replace(/,/g, '%2C')+"&u="+String(params.u).replace(/,/g, '%2C'));
			var popup = $('#popup');
			popup.find('#urlSpot').attr('value', url);
			popup.find('#tweetSpot').attr('href', 'http://twitter.com/intent/tweet?text=My+%23unicode+%23pattern: '+url.replace(/&/g, '%26'));
			popup.removeClass('hidden');
		}
	})

	$('div.close').on({
		click: function() {
			$(this).parent().toggleClass('hidden');
		}
	})

	$('.colorpalette').on({
		click: function(){
			$('.colorpalette').removeClass('selected');
			$(this).addClass('selected');
			cString = $(this).attr('title');
			c = cString.split(" ");
			params.c = c;
		}
	});
	
	$('div.char').on({
		click: function(){
			var id = $(this).attr('id').substring(2);
			if( $(this).hasClass('selected') ) {
				$(this).removeClass('selected');
				params.u.splice(params.u.indexOf(id), 1);
			} else {
				$(this).addClass('selected');
				params.u.push(String(id))
			}
		}
	});



});
