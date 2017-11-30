k8w-promise-mysql
===

Simple native Promise wrapper for mysqljs/mysql

### Usage

```ts
import PromiseMySQL from 'k8w-promise-mysql';

async function main(){
    let pool = await PromiseMySQL.createPool({
        connectionLimit: 10,
        host: 'example.org',
        user: 'bob',
        password: 'secret',
        database: 'my_db'
    });

    let { results, fields } = await pool.query('SELECT 1 + 1 AS solution');
    console.log(fields[0] + ' is ' + results[0].solution);
}

main();
```