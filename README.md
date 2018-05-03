k8w-promise-mysql
===

Simple native Promise wrapper for mysqljs/mysql

The same with https://github.com/mysqljs/mysql
But is Promise version

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
    let { results, fields } = await pool.query('SELECT * FROM test WHERE a=? AND b=?', ['aaa', 'bbb']);
    let { results, fields } = await pool.select('SELECT * FROM test WHERE a=? AND b=?', ['aaa', 'bbb']);
}

main();
```