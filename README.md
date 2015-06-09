# [Bootstrap MaxLength](http://github.com/clementGoachet/bootstrap-length-detector/)


This plugin integrates by default with Twitter bootstrap using badges to display the maximum length of the field and a custom style and message where the user is inserting text. It's based on [Maxlength](https://github.com/mimo84/bootstrap-maxlength/).
This plugin uses the class "length-detector" to work.

The indicator badge shows up on focusing on the element, and disappears when the focus is lost.

## Configurable options

 * **alwaysShow**: if true the threshold will be ignored and the remaining length indication will be always showing up while typing or on focus on the input. Default: false.
 * **threshold**: this is a number indicating how many chars are left to start displaying the indications. Default: 10.
 * **defaultClass**: it's the class of the element with the indicator when the interval is not defined. By default is the bootstrap "warning" but can be changed to anything you'd like.
 * **limitReachedClass**: it's the class the element gets when the limit is reached. Default is "label label-important label-danger" (to support Bootstrap 2 and 3).
 * **separator**: represents the separator between the number of typed chars and total number of available chars. Default is "/".
 * **preText**: is a string of text that can be outputted in front of the indicator. preText is empty by default.
 * **postText**: is a string outputted after the indicator. postText is empty by default.
 * **showMaxLength**: if false, will display just the number of typed characters, e.g. will not display the max length. Default: true.
 * **showCharsTyped**: if false, will display just the remaining length, e.g. will display remaining lenght instead of number of typed characters. Default: true.
 * **placement**: is a string, define where to output the counter. Possible values are: **bottom** ( *default option* ), **left**, **top**, **right**, **bottom-right**, **top-right**, **top-left**, **bottom-left** and **centered-right**.
 *  **appendToParent**: appends the maxlength indicator badge to the parent of the input rather than to the body.
 * **message**: an alternative way to provide the message text, i.e. 'You have typed %charsTyped% chars, %charsRemaining% of %charsTotal% remaining'. %charsTyped%, %charsRemaining% and %charsTotal% will be replaced by the actual values. This overrides the options separator, preText, postText and showMaxLength. Alternatively you may supply a function that the current text and max length and returns the string to be displayed. For example, function(currentText, maxLength) { return '' + Math.ceil(currentText.length / 160) + ' SMS Message(s)'; }
 * **utf8**: if true the input will count using utf8 bytesize/encoding.  For example: the '£' character is counted as two characters.
 * **twoCharLinebreak**: count linebreak as 2 characters to match IE/Chrome textarea validation.
 * **customMaxAttribute**: allows a custom maxlength attribute to allow exceeding maxlength.  'overmax' class gets added when exceeded to allow user to implement form validation.
 * **placement**: is a string, object, or function, to define where to output the counter.
   * Possible string values are: **bottom** ( *default option* ), **left**, **top**, **right**, **bottom-right**, **top-right**, **top-left**, **bottom-left** and **centered-right**.
   * Custom placements can be passed as an object, with keys **top**, **right**, **bottom**, **left**, and **position**. These are passed to $.fn.css.
   * A custom function may also be passed. This method is invoked with the {$element} Current Input, the {$element} MaxLength Indicator, and the Current Input's Position {bottom height left right top width}.
 * **interval**: (Object) Define some interval of caract typed with their own style and message. To set an interval you have to set a limitChars and a bsClass.
 	* limitChars: Number of characters limit to the interval.
 	* bsClass: (String, Hexa, Object) Define the style of the length detector indicator
 	* message: Message to display for the interval

## Events

* **maxlength.reposition** on an input element triggers re-placing of its indicator. Useful if textareas are resized by an external trigger.
* **maxlength.shown** is triggered when the indicator is displayed.
* **maxlength.hidden** is triggered when the indicator is removed from view.

## Examples

Basic implementation:
```javascript
$('.length-detector').lengthDetector();
```

Change the threshold value:
```javascript
$('input.length-detector').lengthDetector({
    threshold: 20
});
```

An example with some of the configurable options:
```javascript
$('input.length-detector').lengthDetector({
    alwaysShow: true,
    threshold: 10,
    defaultClass: "info",
    limitReachedClass: "warning",
    placement: 'top',
    preText: 'used ',
    separator: ' of ',
    postText: ' chars.'
});
```

The same example using the message option:

```javascript
$('input.length-detector').lengthDetector({
    alwaysShow: true,
    threshold: 10,
    warningClass: "info",
    limitReachedClass: "warning",
    placement: 'top',
    message: 'used %charsTyped% of %charsTotal% chars.'
});
```

An example allowing user to enter over max characters. Sample HTML element:
```html
<textarea class="form-control" id="xyz" name="xyz" maxlength="10"></textarea>
```

```javascript
// Setup maxlength
$('.form-control').lengthDetector({
	alwaysShow: true,
	validate: false,
	allowOverMax: true
});

// validate form before submit
$('form').on('submit', function (e) {
	$('.form-control').each(
		function () {
			if ($(this).hasClass('overmax')) {
				alert('prevent submit here');
				e.preventDefault();
				return false;
			}
		}
	);
});
```

An example of triggering a `maxlength.reposition` event whenever an external autosize plugin resizes a textarea:
```javascript
$('textarea').on('autosize.resized', function() {
    $(this).trigger('maxlength.reposition');
});
```

Differents way to set intervals.
with JavaScript
```javascript
$('input.length-detector').lengthDetector({
	interval: {
		0: {
			limitChars: 10,
			bsClass: 'warning'
		},
		1: {
			limitChars: 20,
			bsClass: 'success',
			message: 'Right length !'
		}
});
```

with Data attributes
```javascript
$('input.length-detector').lengthDetector();
```
```html
<input class="length-detector" maxlength="20" data-separator=" | " data-placement="bottom-right-inside"/>
```

with Config files
```javascript
$('input.length-detector').lengthDetector();
```
```html
<input class="length-detector" maxlength="110" data-length-detector-class="title"/>
```

If the default Boostrap label doesn't suit you, you can define your style for an interval.
```javascript
$('input.length-detector').lengthDetector({
	interval: {
		0: {
			limitChars: 10,
			bsClass: {
				background-color: '#6495ED',
				color => 'midnightblue'
			}
		},
});
```
