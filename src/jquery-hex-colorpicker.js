(function ( $ ) {

	var defaults = {
		"colorModel":"hsv",
		"size":5, //length of picker
		"pickerWidth":200, //width of picker
		"container":"none", //"none", "dialog"
		"innerMargin":20,
		"style":"hex", //"hex", "box"
		"colorizeTarget":true,
   };
   
	$.fn.hexColorPicker = function(options) {
		settings = $.extend({}, defaults, options );
		settings.blockWidth = Math.floor(settings.pickerWidth/(settings.size*2-1));
		settings.maxBlocks=settings.size*2-1;
		settings.elem = $(this);
		$(this).click(function(){
			$('.hex-color-picker-wrapper').remove();
			$(this).after(formatPicker());
			stylePicker();
			settings.targetElem=$(this);
			if(settings.container=="dialog"){
				$( ".hex-color-picker-wrapper" ).dialog({ 
					position: { my: "left top", at: "left bottom", of: this },
					resizable: false,
					title: "Select a Color",
					height:"auto",
					width:"auto",
				});
			}
		});
	};
   
   
	function fontColor(hexColor){
		[r,g,b]= hexColor.replace("#","").match(/.{1,2}/g);
		[r,g,b] = [parseInt(r,16)/255,parseInt(g,16)/255,parseInt(b,16)/255];
		lightness = 1/2*(maxComponent+minComponent);
		luma = 0.30*r + 0.59*g + 0.11*b;
		return (luma > 0.6) ? '#000000':'#ffffff';	
	}

	function getBlockColor(elem){
		if($(elem).children(".middle").length>0){
			return $(elem).children(".middle").first().css("background-color");
		}else{
			return $(elem).css("background-color");
		}
	}   
   
	function stylePicker(){
		$('.hex-color-picker-wrapper').css({
			"width":(settings.pickerWidth+settings.innerMargin+settings.blockWidth).toString()+"px",
		});
		$('.hex-color-picker-wrapper .color-block').css({
			"width":settings.blockWidth.toString()+"px",
			"height":settings.blockWidth.toString()+"px",	
		});
		$('.hex-color-picker-wrapper .color-picker-container').css({
			"width":settings.pickerWidth.toString()+"px",
		});
		$('.hex-color-picker-wrapper .picker-sidebar').css({
			"width":settings.blockWidth.toString()+"px",
		});
		
		$('.hex-color-picker-wrapper .picker-row').css({
			"height":settings.blockWidth.toString()+"px",
		});
		
		$('.hex-color-picker-wrapper .picker-form-wrapper').css({
			"padding-top":settings.innerMargin.toString()+"px",
		});
		
		//display correct sidebar
		$('.color-picker-container .color-block').click(function(){
			$(".picker-sidebar").html(createSidebar(getBlockColor(this)));
			$('.picker-sidebar .color-block').css({
				"width":settings.blockWidth.toString()+"px",
				"height":settings.blockWidth.toString()+"px",	
			});
		});
		
		//set selected color
		$('.hex-color-picker-wrapper .color-block').click(function(){
			var selectedColor = rgbToHex(getBlockColor(this));
			$(".picker-form .selected-color").val(selectedColor);
			$(".picker-form .selected-color").css({
				"background-color":selectedColor,
				"color":fontColor(selectedColor),
			});
		});
		//set value on submit
		$('.hex-color-picker-wrapper .picker-form').submit(function(e){
			if($(".picker-form .selected-color").val().length>0){
				var selectedColor = rgbToHex($(".picker-form .selected-color").val());
				e.preventDefault();
				settings.targetElem.val(selectedColor);
				if(settings.colorizeTarget){
					settings.targetElem.css({
						"background-color":selectedColor,
						"color":fontColor(selectedColor),
					});
				}
			}
			$('.hex-color-picker-wrapper').remove();
		});
		
		//stylize hex blocks
		if(settings.style=="hex"){
			$('.color-picker-container .color-block').addClass("hex");
			$('.color-picker-container .color-block').html('<div class="top"></div><div class="middle"></div><div class="bottom"></div>');
			var output="";
			var middleHeight = Math.ceil(settings.blockWidth/Math.pow(8,1/4));
			var topHeight = Math.ceil(middleHeight/2);
			var halfWidth = Math.floor(settings.blockWidth/2);
			$('.color-picker-container .color-block').each(function(){
				blockColor=$(this).css("background-color");
				$(".picker-row").css({
				   "height":"auto",
				});
				$(this).css({
				   "margin-bottom": (-topHeight-1).toString()+"px",
				   "height":"auto",
				});
				$(this).children(".top").css({
					"width": 0,
				   "border-bottom": topHeight.toString()+'px solid '+blockColor,
				   "border-left": halfWidth.toString()+'px solid transparent',
				   "border-right":halfWidth.toString()+'px solid transparent',
				});
				$(this).children(".middle").css({
					"width": settings.blockWidth,
				   "height": middleHeight.toString()+'px',
				   "background": blockColor,
				});
				$(this).children(".bottom").css({
					"width": 0,
				   "border-top": topHeight.toString()+'px solid '+blockColor,
				   "border-left": halfWidth.toString()+'px solid transparent',
				   "border-right":halfWidth.toString()+'px solid transparent',
				});
			});
			$('.color-picker-container .color-block').css("background-color","transparent");
		}
	}   
   
	function hexStringTwoDigits(hexString){
		return ("00"+hexString).slice(-2);
	}   
   
	function numericRGBtoString(r,g,b){
		return "#"+hexStringTwoDigits(r.toString(16))+hexStringTwoDigits(g.toString(16))+hexStringTwoDigits(b.toString(16));	
	}   
   
	function rgbToHex(rgb) {
	    if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;
	
	    rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
	    function hex(x) {
	        return ("0" + parseInt(x).toString(16)).slice(-2);
	    }
	    return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
	}   
   
	function colorizeBlock(normRadius, angle, valueLightness){
		var angle, hue, lightness, saturation,r,g,b;
		hue=angle%360;//swap 360 with 0;
		saturation=normRadius;
		huePrime=hue/60;
		if(settings.colorModel === "hsv"){
			chroma=valueLightness*saturation;
			X=chroma*(1-Math.abs(huePrime%2-1));
			matchValue=valueLightness-chroma;
		}else{
			chroma=(1-Math.abs(2*valueLightness-1))*saturation;
			X=chroma*(1-Math.abs(huePrime%2-1));
			matchValue=(valueLightness-1/2*chroma);
		}
		[r,g,b] = [0,0,0]; //default if undefined
		switch(Math.floor(huePrime)){
			case 0:
				[r,g,b]=[chroma,X,0];
				break;
			case 1:
				[r,g,b]=[X,chroma,0];
				break;
			case 2:
				[r,g,b]=[0,chroma,X];
				break;
			case 3:
				[r,g,b]=[0,X,chroma];
				break;
			case 4:
				[r,g,b]=[X,0,chroma];
				break;
			case 5:
				[r,g,b]=[chroma,0,X];
				break;	
		}
		[r,g,b]=[Math.round((r+matchValue)*255),Math.round((g+matchValue)*255),Math.round((b+matchValue)*255)];
		return numericRGBtoString(r,g,b);
	
	}   
   
	function createSidebar(rgbColor){
		var huePrime,r,g,b;
		[rgbColor,r,g,b] = rgbColor.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
		[r,g,b]=[r/255,g/255,b/255]
		maxComponent = Math.max.apply(Math,[r,g,b]);
		minComponent = Math.min.apply(Math,[r,g,b]);
		chroma=maxComponent-minComponent;
		if(chroma==0){
			huePrime=0;
		}else if(maxComponent==r){
			huePrime=((g-b)/chroma+6)%6;		
		}else if(maxComponent==g){
			huePrime=((b-r)/chroma)+2;		
		}else if(maxComponent==b){
			huePrime=((r-g)/chroma)+4;		
		}
		hue=huePrime*60;
		saturation=chroma;
		valueLightness=1;
		for(var row=0;row<settings.maxBlocks;row++){
			$('.picker-sidebar .color-block:eq('+row+')').css({
				'background-color':colorizeBlock(saturation,hue,valueLightness),
			});		
			valueLightness-=1/(settings.maxBlocks-1);
		}
	}   
   
	function formatPicker(){
		var radius,angle,x,y,valueLightness;
		var output="<div class='hex-color-picker-wrapper'>";
		var centerBlock=Math.floor(settings.maxBlocks/2);
		var maxRadius=Math.sqrt(5/4)*centerBlock;
		output+="<div class='color-picker-container'>";
		for(var row=0;row<settings.maxBlocks;row++){
			var blocksCount = settings.size+row;
			if(row>=settings.size){
				blocksCount = settings.size*2-(row-settings.size+2)	
			}	
			output+="<div class='picker-row'>"
			for(var block=0;block<blocksCount;block++){
				y=centerBlock-row;
				x=-centerBlock+(block+(settings.maxBlocks-blocksCount)/2);
				radius=Math.sqrt(Math.pow(x,2)+Math.pow(y,2));
				normRadius=radius/maxRadius;
				angle=Math.atan(y/x)*180/Math.PI+90;
				if(x>=0){
					angle+=180;//compensate for right 2 quadrants			
				}
				if(settings.colorModel=="hsv"){
					valueLightness=1;
				}else{
					valueLightness=0.5;
				}
				output+="<div class='color-block' style='background-color:"+colorizeBlock(normRadius,angle,valueLightness)+"'></div>";			
			}
			output+="</div>";
		}
		output+="</div>";
		output+='<div class="picker-sidebar">';
		for(var row=0;row<settings.maxBlocks;row++){
			output+="<div class='color-block'></div>";
		}
		output+='</div>';
		output+='<div class="picker-form-wrapper"><form class="picker-form">'+
						'<input type="text" name="selected-color" class="selected-color" readonly="readonly"/>'+
						'<input type="submit" value="OK" name="submit" class="submit"/>'+
					'</form></div>';
		output+="</div>";//end of hex-color-picker-wrapper
		return output;
	}   
   
   var settings = {};
 
}( jQuery ));