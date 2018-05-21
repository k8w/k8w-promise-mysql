import PromiseMySQL from '../index';
import * as assert from 'assert'
describe('cluster', function () {
    it('cluster', async function () {
        let ccfg: any = {
            options: {},
            master: [{
                acquireTimeout: 10 * 1000,
                host: '10.42.1.42',
                // host: '127.0.0.1',
                port: 3306,
                connectionLimit: 10,
                user: 'test',
                password: 'test',
                // password: 'miyoo123',
                database: 'test'
            }],
            slave: [{
                acquireTimeout: 10 * 1000,
                host: '10.42.0.31',
                // host: '127.0.0.1',
                port: 3306,
                connectionLimit: 10,
                user: 'test',
                password: 'test',
                // password: 'miyoo123',
                database: 'test'
            }, {
                acquireTimeout: 10 * 1000,
                host: '10.42.1.43',
                // host: '127.0.0.1',
                port: 3306,
                connectionLimit: 10,
                user: 'test',
                password: 'test',
                // password: 'miyoo123',
                database: 'test'
            }]
        };
        let sql = PromiseMySQL.createCluster(ccfg);

        let user = { uid: 1111, name: "rur4" };
        await sql.delete('SELECT * FROM `user` where uid =1111');
        await sql.insert('INSERT INTO user SET ?', [user]);

        let u2 = (await sql.select('SELECT * FROM `user` where uid =1111')).results[0];

        console.log(u2)

        assert.deepEqual(user, u2);
    }
    )
})


