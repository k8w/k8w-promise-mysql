import MyClusterConfig from '../src/MyClusterConfig';
import PromiseMySQL from '../index';

describe('cluster', function () {
    it('cluster', async function () {
        let ccfg: MyClusterConfig = {
            options: {},
            master: [{
                acquireTimeout: 10 * 1000,
                host: '192.168.1.245',
                // host: '127.0.0.1',
                port: 3306,
                connectionLimit: 10,
                user: 'root',
                password: '',
                // password: 'miyoo123',
                database: 'oldquiz',
            }],
            slave: [{
                acquireTimeout: 10 * 1000,
                host: '192.168.1.245',
                // host: '127.0.0.1',
                port: 3306,
                connectionLimit: 10,
                user: 'root',
                password: '',
                // password: 'miyoo123',
                database: 'oldquiz',
            }]
        };
        let sql = PromiseMySQL.createCluster(ccfg);
        var u2 = (await sql.query('SELECT * FROM ai_user ORDER BY RAND() LIMIT 1')).results[0]

        // let pool1 = PromiseMySQL.createPool(ccfg.master[0]);
        // var user: any = (await pool1.select('SELECT * FROM ai_user ORDER BY RAND() LIMIT 1')).results[0];
        // console.log(user)
        console.log(u2)
    }
    )
})


