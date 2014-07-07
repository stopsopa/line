# jQuery.line plugin

***

> jQuery plugin to draw lines using pure DIV and pure CSS3

***


## Demo:

[Demo](http://stopsopa.bitbucket.org/demos/jquery.line/demo.html)



### Using:

```js
var linediv = $.line(x1, y1, x2, y2, opt, callback);
```

or


```js
var linediv = $('parent element').line(x1, y1, x2, y2, opt, callback);
```


### Default options are:


```js
{
    create: $('<div></div>'), // default it's div, you can change to $('<span></span>')
    cls: '_line', 
    id : false,
    css: {  // you can change styles by $(..).css() directly on returned linediv like above...
        borderTop: '1px solid black',
        height: '0',
        zIndex: '999',
        zoom: 1
    }
}
```

### Callback:

In context of callback you have two parameters, one is div representing line, and second used options

```js
$.line(x1, y1, x2, y2, opt, function (div, opt) {
    ...
})
```



# License

The MIT License (MIT)

Copyright (c) 2014 Szymon Działowski

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.



