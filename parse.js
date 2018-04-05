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

        // read column names
        n+=2;
        let names = lines[n].split(/[\s-]+/);
        console.log(names);

        // read every line until the separator
        n+=2;
        const EXPLANATION_COLUMN = 35;
        const SEPARATOR = '--------------------------------------------------------------------------------';
        while (n<82&&lines[n]!==SEPARATOR) {
            let line = lines[n];

            if (SEPARATOR==line)
                break;

            let columns = lines[n].split( /[-\s]+/, 5);
            columns.push( line.slice(EXPLANATION_COLUMN) );
            console.log( columns );
            n++;
            // // split the line into the same number of column
            // let values = [];
            // let start = 0;
            // while (true) {
            //     while (start<line.length)
            //         if (line[start]==' ')
            //             start++;
            //         else break;

            //     if (values.length==names.length) {
            //         values.push( line.slice(start) );
            //         break;
            //     } else {
            //         let end = start+1;
            //         while (end<line.length) {
            //             if(line[end]==' ' || line[end]=='-') {
            //                 values.push(line.slice(start, end));
            //                 break;
            //             }
            //         }
            //     }
            // }
            
        }// TODO can't just split need to consider number of columns and their position...
        
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