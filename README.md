


# What is it?

***

> simple library to draw lines using raw DIV and pure CSS3

***

Here is also an attepmt to release it using new JSR
https://jsr.io/@stopsopa/line


## Demo:

[Demo](https://stopsopa.github.io/line/)


# readme below requires updating
### Using:

```js
var linediv =                   $.line(x1, y1, x2, y2, opt, callback);
var linediv = $('parent element').line(x1, y1, x2, y2, opt, callback);
```

or

radians and distance
```js
var linediv =                   $.line(x1, y1, {rad: Math.PI/4, dis: 200}, opt, callback);
var linediv = $('parent element').line(x1, y1, {rad: Math.PI/4, dis: 200}, opt, callback);
```
or


angle and distance
```js
var linediv =                   $.line(x1, y1, {ang: 45, dis: 200}, opt, callback);
var linediv = $('parent element').line(x1, y1, {ang: 45, dis: 200}, opt, callback);
```


### Default options are:


```js
{
    create: $('<div></div>'), // default it's div, you can change to $('<span></span>')
    cls: '_line', 
    id : false,
    css: {  
        // you can change styles of div in js here through $(..).css()
        // but be careful that you can override here property used
        // to calculations ('width') 
        // which is defined right below        
        height: '0',
        zIndex: '999',
        zoom: 1
    },
    width: 1,
    style: 'solid',
    color: 'black'
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



