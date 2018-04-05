let fs = require('fs');

(function() {
        
    // read fk6_1 metadata
    const HEADER = 'Byte-by-byte Description of file: fk6_1.dat';
    const STRUCTURE = {
        START : [0,4],
        END : [5, 8],
        FORMAT : [8, 16],
        UNITS : [16, 23],
        LABEL : [23, 35],
        EXPLANATION : [35, 80]
    }
    let data = fs.readFileSync( 'public/FK6/ReadMe', {encoding : 'ascii'} );
    let lines = data.split('\n');
    let index = findLine( HEADER );
    let metadata = parseMetadata(lines, index+4, STRUCTURE)

    // read fk6_1 data
    data = fs.readFileSync('public/FK6/fk6_1.dat', {encoding:'ascii'} );
    lines = data.split('\n');
    let stars = parseData(lines, metadata);

    console.log(stars);

    function findLine (content) {
        let index = 0;
        while (index < lines.length) {
            if (lines[index] == content)
                break;
            else index++;
        }
        return index;
    }

    function parseMetadata (lines, index, structure) {
        const SEPARATOR = '--------------------------------------------------------------------------------';
        let metadata = [];
        
        // read every line until the separator
        while (lines[index]!==SEPARATOR) {
            let line = lines[index];

            if (SEPARATOR==line)
                break;

            // parse field description
            let description = {};
            for( let field in structure ) {
                let bounds = structure[field];
                let value = line.slice( bounds[0], bounds[1] ).trim();
                description[field] = value;
            } // Object.keys(FK6_DAT).map(e=>description[e] = line.slice(structure[e][0], structure[e][1]).trim() );

            // add the field
            if (description.END!='')
                metadata.push( description );

            // if fields are missing it is an addendum to the explanation
            else
                metadata[metadata.length-1].EXPLANATION.concat(description.EXPLANATION); 
            
            index++;
        }
        return metadata;
    }

    function parseData (lines, metadata) {
        let stars = []
        for (let line of lines) {
            let star = [];
            for(let field of metadata)
                star.push( line.slice(field.START-1, field.END).trim() );
            stars.push(star);
        }
        return stars;
    }

}());
// const FK6_COLUMNS = 843;

// fs.readFile( 'public/FK6/fk6_1.dat', function( error, data) {
//     if (error) throw error;
//     const FK6_ROWS = data.length / FK6_COLUMNS;

//     if(Buffer.isBuffer(data)) {
//         console.log( FK6_COLUMNS+','+FK6_ROWS );
//     }
// } );