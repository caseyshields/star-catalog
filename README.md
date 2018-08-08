# Starmap

A D3 component for displaying star catalogs and selecting individual stars.
Dragging rotates the chart and the mouse wheel zooms the view.
Individual stars can be selected by clicking on them.

![Starmap](stars.png)

``` Javascript
    let svg = d3.select('svg');
    let width = svg.attr("width");
    let height = svg.attr("height");
    let stars = [
        // Vega
        {Name:"alpha Lyr", ra:"18.6156492", dec:"38.7836898",
            pmRA:"201.7", pmDE:"286.67", plx:"128.93", Vmag:"0.03"},
        // Canopus
        {Name:"alpha Car", ra:"6.39919703", dec:"-52.6956611",
            pmRA:"19.37", pmDE:"23.27", plx:"10.43", Vmag:"-0.62"}
    ];
    let starmap = createStarmap(svg, width, height)
        .click( function( star ) { console.log( star ); } )
        .move( function( point ) { console.log( starmap.screenToCelestial( point ) ); } )
        .magnitude( [-1, 6] )
        .catalog( stars );
    starmap();
```

# Demo

An example showing the [FK6 Star Catalog is available](https://caseyshields.github.io/starmap/index.html).
FK6 is a selection of astrometrically excellent stars tied to the [ICRS](https://en.wikipedia.org/wiki/International_Celestial_Reference_System). It was compiled from the Hipparcos catalog and long term ground based measurements, and is known to be accurate to a milliarcsecond.
This JSON dataset was obtained from a Vizier archive file using a node [script](https://github.com/caseyshields/starlog).

# API

``` Javascript
let starmap = createStarmap( svg, width, height )
```

Returns a starmap object whose default method creates or updates a SVG rendering of a starmap

Argument|Type|Meaning
-|-|-
svg|D3 Selector|a selection holding the SVG tag the starmap should be rendered into
width|Integer|Width of the starmap
height|Integer|Height of the stapmap

``` Javascript
starmap.click( function(star) )
```

Sets a callback for handling clicks on the starmap, returns the starmap for chaining methods.

Argument|Type|Meaning
-|-|-
star|Object|a catalog object if one was clicked, otherwise null

``` Javascript
starmap.move( function(point) )
```

Sets a callback for handling mouse movement over a starmap

Argument|Type|Meaning
-|-|-
point|Array[2]|Holds the screen coordinates of the mouse movement

``` Javascript
starmap.magnitude( domain )
```

Sets the input range of stars' visual magnitude.

Argument|Type|Meaning
-|-|-
domain|Array[2]|an interval holding the minimum and maximum star magnitude, in that order.

```Javascript
starmap.catalog( entries )
```

Catalogs are loaded as arrays of json objects.
Any epoch can be used as long as all the entries are consistent.

Argument|Type|Meaning
-|-|-
entries|Array of objects|An array of catalog objects which must have `ra`, `dec`, `Vmag` members
entries[n].ra | Floating point | Celestial right ascension in hours, 0.0 - 24.0
entries[n].dec | Floating point | Declination in degrees, -90.0 to +90.0
entries[n].vm | Floating Point | Visual magnitude

``` Javascript
add( entry )
```

``` Javascript
screenToCelestial( point )
```

``` Javascript
celestialToScreen( point )
```

---

## Future Improvements
 - add more interactivity callbacks
 - add ability to render more star properties; parallax, proper motion, spectral type, etc.
 - try using a catalog with more star data like Gaia
 - Add Yale bright star catalog demo for a more natural looking sky
 - add multiple star selections with lesser circle brushes which are constructed from a right click drag