/** Factory function which returns a D3 component for charting star catalog data. */

function createStarmap( svg, width, height, readout ) {

    // the catalog to be rendered
    let catalog = [];

    // callbacks for selection selection and interactivity
    let clicked = null;
    let moved = null;

    // mouse state variables
    let scale = 1.0;
    let dragStart = null; // used for calculating drag vector for setting the rotation

    // define a scale for visual magnitude
    let magnitudeScale = d3.scaleLinear()
        .range( [1,5] );

    // we need to map celestial coordinates to lon/lat 
    let rightAscensionScale = d3.scaleLinear()
        .domain([0, 24])
        .range([0,360]);

    var lambda = d3.scaleLinear()
        .domain([-width, width])
        .range([-180, 180]);

    var phi = d3.scaleLinear()
        .domain([-height, height])
        .range([90, -90]);

    // a stereographic projection is how stars would map to a plane if you were looking from inside the sphere.
    // in this case we are using a celestial sphere instead of a terrestrial one
    let stereographic = d3.geoStereographic()
        .translate( [width/2, height/2] )
        .scale( width )
        .clipAngle(90);

    // add a path for a spherical coordinate grid
    let path = d3.geoPath()
        .projection( stereographic );
    svg.append('path')
        .attr('class', 'graticule' )
        .datum( d3.geoGraticule().step([15, 10]) );

    // TODO add greatcircles for mouse crosshairs...
    // svg.append('path')
    //     .attr('class', 'latitude')
    
    // add a group to put the stars in and make a selection for subsequent elelments
    let stars = svg.append('g')
        .attr('class', 'stars')
        .selectAll('circle');

    // add mouse interactivity to screen and stars
    svg.call( d3.drag()
    .on('start', started)
    .on('drag', dragged)
    .on('end', ended) );
    svg.call( d3.zoom()
        .on("zoom", wheel )
        //.extent( [1, w] )
    );
    // .on('wheel.zoom', null); // this consumes the event and prevents it from being sent to the page?
    svg.on('mousemove', move);

    /** Creates/updates an SVG starchart */
    let starmap = function() {

        // draw celestial sphere's lines of ascension and declination
        svg.select('.graticule')
            .attr('d', path);

        if (!catalog) return;

        // join all star data to stars in our dom
        stars = stars.data( catalog );

        // remove filtered stars from the dom
        stars.exit().remove();

        // add selection listener and resize new stars
        stars = stars.enter()
            .append('circle')
                .on('click', click )
            .merge( stars )
                .attr('r', function(d) {return Math.round( magnitudeScale(d.Vmag) );} );

        // position all stars
        stars.each( function(d) {
             // need to flip longitude because we are in the celestial sphere
            let lon = rightAscensionScale(d.ra)
            let S = stereographic( [-lon, d.dec] );
            // console.log( S );
            d3.select(this)
                .attr('cx', S[0])
                .attr('cy', S[1]);
        } );
    }

    // clicking a star causes it's data to be displayed
    function click( star, index, selection ) {
        // update the class of selected elements
        if ( star ) {
            d3.selectAll('.selected').classed('selected', false); // TODO might want to cache this instead of looking it up every time...
            d3.select(this).classed('selected', true);
            //info.html( JSON.stringify( star, null, '<br>') );
        } // else info.html('');

        // invoke the user suppplied callback
        if( clicked )
                clicked( star, index, selection );
    }

    // update the cursor information with where the mouse is pointing in the projection
    function move() {
        // get the location of the cursor in the SVG element
        // let Ps = d3.mouse(this); // screen coodinates
        // let Pw = stereographic.invert( Ps ) // map coordinates
        // let Pc = [ rightAscensionScale.invert(Pw[0]), Pw[1] ]; // celestial coodinates
        // ascension.html( Pc[0] );
        // declination.html( Pc[1] );
        moved( Ps );
    }

    // these drag callbacks update a rotation applied to the projection
    function started() { dragStart = d3.mouse(this); }
    function dragged() {
        // get coordinates of mouse event in svg container
        let dragEnd = d3.mouse(this);

        // abort if this is the first point of the drag
        if(!dragStart) { dragStart = dragEnd; return; }

        // get the distance dragged on the screen, scaled by the zoom
        let Dx = lambda( dragEnd[0]-dragStart[0] ) / scale;
        let Dy = phi( dragEnd[1]-dragStart[1] ) / scale;

        // add it to the current transformation
        let last = stereographic.rotate();
        last = [last[0] + Dx, last[1] + Dy];

        // update the projection
        stereographic.rotate( last );
        render();

        // update the drag point
        dragStart = dragEnd;
    }
    function ended() { dragStart = null; }

    // the mouse wheel adjusts the field of view
    function wheel() {
        scale = d3.event.transform.k;
        stereographic.scale( scale * width );
        stereographic.clipAngle( scale * 90.0 );
        render();
    }

    // TODO add magnitude cutoff?

    /** Settler/Getter for the catalog data displayed in the star map. */
    starmap.catalog = function( newCatalog ) {
        if( !newCatalog )
            return catalog;
        catalog = newCatalog;

        // update the visual magnitude scale
        let range = d3.extent(catalog, (d)=>d.Vmag );
        magnitudeScale.domain( [range[1], range[0]] );
        // magnitude
        //     .attr('min', range[0] )
        //     .attr('max', range[1] )
        //     .attr('step', (range[1]-range[0]) / 100.0 );
        // console.log( range );
        // maybe we should just have this configured, could give the user false impressions between datasets of different ranges

        return starmap;
    }

    /** Add a star entry to the the catalog of the starmap. */
    starmap.add = function( star ) {
        catalog.push( star );
    }

    /** Set the call back function for mouse movements over the star map. */
    starmap.moved = function( callback ) {
        moved = callback;
    }

    /** set the selection callback. It should accept three arguments; star, index, and selection */
    starmap.selected = function( callback ) {
        clicked = callback;
    }

    /** Convert screen coordinates to celestial coordinates. */
    starmap.screenToCelestial = function( screen ) {
        let map = stereographic.invert( screen )
        let cel = [ rightAscensionScale.invert(map[0]), map[1] ];
        return cel;
    }

    /** Convert celestial coordinates to screen coordinates. */
    starmap.celestialToScreen = function( cel ) {
        let map = [ -rightAscensionScale( cel[0] ), cel[1] ];
        let screen = stereographic( map );
        return screen;
    }

    return starmap;
}