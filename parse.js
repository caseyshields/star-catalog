let fs = require('fs');

fs.readFile( 'public/FK6/ReadMe', 
    {encoding : 'ascii'},
    function(error, data) {
        if (error) throw error;

        let lines = data.split('\n');
        
        // find fk6_1 metadata
        let HEADER = 'Byte-by-byte Description of file: fk6_1.dat';
        let n = 0; //line = '';
        while (n < lines.length) {
            if (lines[n] == HEADER)
                break;
            else n++;
        }

        // read every line until the separator
        n+=4;
        const FK6_DAT = {
            START : [0,4],
            END : [6, 8],
            FORMAT : [8, 16],
            UNITS : [16, 23],
            LABEL : [23, 35],
            EXPLANATION : [35, 80]
        }
        const SEPARATOR = '--------------------------------------------------------------------------------';
        let metadata = [];
        while (lines[n]!==SEPARATOR) {
            let line = lines[n];

            if (SEPARATOR==line)
                break;

            // parse field description
            let description = {};
            for( let field in FK6_DAT ) {
                let index = FK6_DAT[field];
                let value = line.slice( index[0], index[1] ).trim();
                description[field] = value;
            }

            // add the field
            if (description.START!='')
                metadata.push( description );

            // if fields are missing it is an addendum to the explanation
            else
                metadata[metadata.length-1].EXPLANATION.concat(description.EXPLANATION); 
            
            n++;
        }
        
        console.log( metadata );
    }
);

// const FK6_COLUMNS = 843;

// fs.readFile( 'public/FK6/fk6_1.dat', function( error, data) {
//     if (error) throw error;
//     const FK6_ROWS = data.length / FK6_COLUMNS;

//     if(Buffer.isBuffer(data)) {
//         console.log( FK6_COLUMNS+','+FK6_ROWS );
//     }
// } );