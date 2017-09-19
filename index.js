const start = Date.now();

const args = require('yargs')
    .option('queryfile', {
        alias: 'f',
        default: null,
        describe: 'path to a query file, must be used if query is not specified'
    })
    .option('query', {
        alias: 'q',
        default: null,
        describe: 'query as string, must be used if queryfile is not specified'
    })
    .option('outputfile', {
        alias: 'o',
        default: `${Date.now()}.xlsx`,
        describe: 'path to the output file, if not specified the current timestamp is used in the current working directory'
    })
    .option('constr', {
        alias: 'c',
        default: null,
        describe: 'connection string to the postgresql database'
    })
    .argv;

const {queryfile, query, outputfile, constr} = args;

const pgp = require('pg-promise')();
const xlsx = require('xlsx');
const path = require('path');


/**
 * Exports an Excel file for a gievn query
 *
 * @param  {String} qf  Path to the query file
 * @param  {String} q   Query as string
 * @param  {String} out Output file path
 * @param  {String} con description
 * @return {Promise}
 */
const run = async function(qf, q, out, con) {
    if (!qf && !q) {
        console.log('You must provide either a query or a queryfile.');
        process.exit(1);
    }

    if (!con) {
        console.log('You must provide a connection string');
        process.exit();
    }

    try {
        console.log('Connecting to database');
        // Connect to the databse
        const db = pgp(constr);

        // Load either the queryfile or take the query
        const qry = q || new pgp.QueryFile(path.resolve(process.cwd(), qf));

        // Get the actual results
        const results = await db.query(qry);

        if (results.length === 0)
            console.log('Your query returned 0 results. Skipping the creation of an Excel file.');

        console.log(`Got ${results.length} database results`);

        const keys = Object.keys(results[0]);

        const rows = [keys].concat(results.map(res => {
            return keys.map(key => res[key]);
        }));

        const wb = xlsx.utils.book_new();

        const sheet1 = xlsx.utils.aoa_to_sheet(rows);

        wb.SheetNames.push('Sheet1');
        wb.Sheets.Sheet1 = sheet1;

        xlsx.writeFile(wb, outputfile);

        console.log(`Wrote ${outputfile}`);

        pgp.end();

        console.log(`Took ${Date.now() - start} ms`);

        return out;
    } catch (e) {
        console.log('An error occured. Please open an issue if you think this is an error with the pg-to-excel project.', e);
        process.exit(1);
    }
};

run(queryfile, query, outputfile, constr);

module.exports = run;
