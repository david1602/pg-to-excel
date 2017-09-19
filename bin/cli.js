#!/usr/bin/env node
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
        describe:
            'path to the output file, if not specified the current timestamp is used in the current working directory',
        default: `${Date.now()}.xlsx`
    })
    .option('constr', {
        alias: 'c',
        default: null,
        describe: 'connection string to the postgresql database'
    }).argv;

const { queryfile, query, outputfile, constr } = args;

const run = require('../index');

if (!queryfile && !query) {
    console.log('You must provide either a query or a queryfile.');
    process.exit(1);
}

if (!constr) {
    console.log('You must provide a connection string');
    process.exit(1);
}

run(queryfile, query, outputfile, constr).then(() =>
    console.log(`Took ${Date.now() - start} ms`)
);
