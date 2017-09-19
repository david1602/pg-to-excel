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
    if (!qf && !q)
        throw new Error(
            'pg-to-excel requires either a query or a query file path'
        );

    if (!out) throw new Error('pg-to-excel must be called with an output path');

    if (!con)
        throw new Error(
            'pg-to-excel cannot be called without a connection string'
        );

    try {
        console.log('Connecting to database');
        // Connect to the databse
        const db = pgp(con);

        // Load either the queryfile or take the query
        const qry = q || new pgp.QueryFile(path.resolve(process.cwd(), qf));

        // Get the actual results
        const results = await db.query(qry);

        if (results.length === 0)
            console.log(
                'Your query returned 0 results. Skipping the creation of an Excel file.'
            );

        console.log(`Got ${results.length} database results`);

        const keys = Object.keys(results[0]);

        const rows = [keys].concat(
            results.map(res => {
                return keys.map(key => res[key]);
            })
        );

        const wb = xlsx.utils.book_new();

        const sheet1 = xlsx.utils.aoa_to_sheet(rows);

        wb.SheetNames.push('Sheet1');
        wb.Sheets.Sheet1 = sheet1;

        xlsx.writeFile(wb, out);

        console.log(`Wrote ${out}`);

        pgp.end();

        return out;
    } catch (e) {
        console.log(
            'An error occured. Please open an issue if you think this is an error with the pg-to-excel project.',
            e
        );
    }
};

module.exports = run;
