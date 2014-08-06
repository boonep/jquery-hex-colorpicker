#jQuery Hex Color Picker
##What?
A simple discrete color picker that allows RGB hex color values to be visually selected and entered into a designated input field.

##How?
Simple!

Include jQuery as well as the javascript and stylesheet files:

```html
<script src="../src/jquery-hex-colorpicker.js"></script>
<link rel="stylesheet" href="../src/jquery-hex-colorpicker.css" />
```


Then, all you have to do is attach the hexColorPicker function to any input:

```js
$('#myinputid').hexColorPicker();
```

You can also add options to customize to your needs:

```js
	jQuery(".color-picker").hexColorPicker({
		"container":"dialog",
		"colorModel":"hsv",
		"pickerWidth":300,
		"size":7,
		"style":"hex",
	});
```

##More Information

For more information on how to setup a rules and customizations, or to see a demo [visit our website](http://www.booneputney.com/jquery-hex-colorpicker.html).

## License
Copyright (c) 2014 Boone Putney
Licensed under the MIT license.
Submit a bug report above or here: 

<https://github.com/boonep/jquery-hex-colorpicker/issues>
