
import * as mysql from 'mysql';

export default class PromiseMyCluster {
    public _cluster: mysql.PoolCluster;
    constructor(cluster: mysql.PoolCluster) {
        this._cluster = cluster;

        this.on = this._cluster.on.bind(this._cluster);
    }

    /**
     * @param option 默认为master
     *               "all"：所有节点，该参数下只能进行读操作
     *               "master"：主节点，可以进行读写操作
     *               "slave"：从节点，只能进行读操作
     */
    query(query: mysql.Query | string | mysql.QueryOptions, values?: any, option: 'all' | 'master' | 'slave' = 'master'): Promise<{
        results: any;
        fields: mysql.FieldInfo[];
    }> {
        let args: any[] = [];
        for (let i = 0; i < 2; ++i) {
            args.push(arguments[i]);
        }

        return new Promise<{
            results: any;
            fields: mysql.FieldInfo[];
        }>((rs, rj) => {
            args.push((err: mysql.MysqlError | null, results: any, fields: mysql.FieldInfo[]) => {
                if (err) {
                    rj(err)
                }
                else {
                    rs({
                        results: results,
                        fields: fields
                    })
                }
            });

            let pool: mysql.Pool;
            switch (option) {
                case 'master':
                    pool = this._cluster.of('MASTER*', 'random');
                    break;
                case 'slave':
                    pool = this._cluster.of('SLAVE*', 'random');
                    break;
                case 'all':
                default:
                    pool = this._cluster.of('*', 'random');
                    break;
            }
            pool.query.apply(pool, args as any);
        });
    }

    /**
     * @param option 默认为slave
     *               "all"：所有节点，该参数下只能进行读操作
     *               "master"：主节点，可以进行读写操作
     *               "slave"：从节点，只能进行读操作
     */
    select<T=any>(query: mysql.Query | string | mysql.QueryOptions, values?: any): Promise<{
        results: T[];
        fields: mysql.FieldInfo[];
    }> {
        return this.query(query, values, 'slave');
    };
    /**
     * @param option 默认为slave
     *               "all"：所有节点，该参数下只能进行读操作
     *               "master"：主节点，可以进行读写操作
     *               "slave"：从节点，只能进行读操作
     */
    insert(query: mysql.Query | string | mysql.QueryOptions, values?: any): Promise<{
        results: { affectedRows: number, insertId: number }
    }> {
        return this.query(query, values, 'master');
    };
    /**
     * @param option 默认为slave
     *               "all"：所有节点，该参数下只能进行读操作
     *               "master"：主节点，可以进行读写操作
     *               "slave"：从节点，只能进行读操作
     */
    update(query: mysql.Query | string | mysql.QueryOptions, values?: any): Promise<{
        results: { changedRows: number }
    }> {
        return this.query(query, values, 'master');
    };
    /**
     * @param option 默认为slave
     *               "all"：所有节点，该参数下只能进行读操作
     *               "master"：主节点，可以进行读写操作
     *               "slave"：从节点，只能进行读操作
     */
    delete(query: mysql.Query | string | mysql.QueryOptions, values?: any): Promise<{
        results: { affectedRows: number }
    }> {
        return this.query(query, values, 'master');
    }

    async end(): Promise<void> {
        return new Promise<void>((rs, rj) => {
            this._cluster.end(err => {
                if (err) {
                    rj(err);
                }
                else {
                    rs();
                }
            })
        })
    }

    on: mysql.PoolCluster['on'];
}