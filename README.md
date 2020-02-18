# DSelect (Dimas Lanjaka Custom Select)
An inuitive custom select element written in pure javascript.

### Usage:
```html
<!--Initialize-->
<link rel="stylesheet" href="dist/select.min.css">
<script type="text/javascript" src="dist/select.min.js"></script>
```

```javascript
// Instantiate with a DOM object...
var el     = document.querySelector('#movies');
var select = new dS(el, { /* settings */ });

// ... or a selector
var select2 = new dS('#music', { /* settings */ });

// ... or looping by jQuery
var wrapper = $('[id="myselect"]');
wrapper.each(function (i, el) {
  var sl = createSelect('form-control', $(this).data('id'), $(this).data('name'));
  $(this).html(sl);
  var mySelect = new dS('#' + $(this).data('id'), {
    save: true,
    filtered: 'auto',
    filter_threshold: 8,
    filter_placeholder: 'Filter options...',
    css: "/assets/components/Select/dist/select.min.css",
    start: true
  });
});
```

### Set Default Value
```javascript
/**Coming Soon**/
```

### Reset Select
```javascript
/**Coming Soon**/
```

### Options:

* `filtered` *(mixed)* – Should the 'filter options' input be displayed? **Default**: `'auto'`
* `filter_threshold` *(int)* – When a select contains `x` options or more, display the filter input. **Default**: `8`
* `filter_placeholder` *(string)* – Placeholder text for the filter input. **Default**: `'Filter options...'`
