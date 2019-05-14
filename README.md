# embedresourceloader.js
An alternate Javascript / CSS external resource loader particularly for CMS / LMS / etc environments
where heavy-handed element whitelisting settings can restrict necessary functionality and/or code reuse.

## Usage
Add the loader script to a global loading configuration, per your CMS / LMS specific method
```
<script src="embedresourceloader.js"></script>
```
Then to load regular Javascript files, instead of the normally filtered out
```
<script type="text/javascript" src="somefile.js"></script>
```
you'll use an embed element with the type set accordingly like this
```
<embed type="javascript" src="somefile.js">
```

## Javascript
To load a normal Javascript file
```
<embed type="javascript" src="somefile.js">
```
To load a Javascript ES module
```
<embed type="javascript;module" src="somemodule.js">
```
To force the browser to not load a potentially stale/changed file, append ";nocache" to the type value
```
<embed type="javascript;nocache" src="somefile.js">
<embed type="javascript;module;nocache" src="somemodule.js">
```

## CSS
To load a CSS file
```
<embed type="css" src="somefile.css">
```
To force the browser to not load a potentially stale/changed file, append ";nocache" to the type value
```
<embed type="css;nocache" src="somefile.css">
```

---
License: MPL-2.0
