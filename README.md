# pg-to-excel

Generates an excel file from a postgresql connection and a query file.

## Parameters:

```
queryfile, f            path to a query file, must be used if query is not specified        string
query, q                query as string, must be used if queryfile is not specified         string
outputfile, o           path to the output file, will be defaulted to ${timestamp}.xlsx     string
constr, c               connection string, <postgres://user:password@host:port/database>    string
```

Queryfiles and output files can both be defined relative or absolute.

## Examples

The queries contain mixed examples, for example `-c <value>` vs `--c <value>` vs `-c=<value>` vs `--c=<value>` to demonstrate that all of them are possible. You can substitute one with the other.

### With a query file
```
pg-to-excel -f query.sql -c 'postgres://user:password@localhost:5432/database'
```

### With a query
```
pg-to-excel --q 'SELECT * FROM user' --c 'postgres://user:password@localhost:5432/database'
```

### With a specified output filename
```
pg-to-excel -q='SELECT * FROM user' -c='postgres://user:password@localhost:5432/database' -o=test.xlsx
```

### Relative and absolute paths
```
pg-to-excel --q=/opt/project/queryfile.sql --c='postgres://user:password@localhost:5432/database' --o=output.xlsx
```


## API

The API is also exposed with a function and can be called with `(queryFile, query, outputfile, connection)`.
The function is async and returns the output parameter, because I had no idea what to return. The file stream?

```javascript
const run = require('pg-to-excel');

const query = 'SELECT * FROM user;';
const output = 'testfile.xlsx';
const constr = 'postgres://user:password@localhost:5432/database';

run(null, query, output, constr);
```
