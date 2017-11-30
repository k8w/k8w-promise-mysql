import * as mysql from 'mysql';

export default class PromiseMySQL {
    static createPool(config: mysql.PoolConfig | string): PromiseMySQLPool {
        return new PromiseMySQLPool(mysql.createPool(config));
    }

    static escape = mysql.escape;
    static escapeId = mysql.escapeId;
    static format = mysql.format;
    static raw = mysql.raw;
}

export class PromiseMySQLPool {
    private _pool: mysql.Pool;

    constructor(pool: mysql.Pool) {
        this._pool = pool;
        this.on = pool.on.bind(this._pool);
    }

    query(): Promise<{
        results: any;
        fields: mysql.FieldInfo[];
    }> {
        let args: any[] = [];
        for (let i = 0; i < arguments.length; ++i) {
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

            this._pool.query.apply(this._pool, args)
        });
    }

    select: <T=any>(query: mysql.Query | string | mysql.QueryOptions, values?: any) => Promise<{
        results: T[];
        fields: mysql.FieldInfo[];
    }> = this.query;
    insert: (query: mysql.Query | string | mysql.QueryOptions, values?: any) => Promise<{
        results: { affectedRows: number, insertId: number }
    }> = this.query;
    update: (query: mysql.Query | string | mysql.QueryOptions, values?: any) => Promise<{
        results: { changedRows: number }
    }> = this.query;
    delete: (query: mysql.Query | string | mysql.QueryOptions, values?: any) => Promise<{
        results: { affectedRows: number }
    }> = this.query;

    async end(): Promise<void> {
        return new Promise<void>((rs, rj) => {
            this._pool.end(err => {
                if (err) {
                    rj(err);
                }
                else {
                    rs();
                }
            })
        })
    }

    on: mysql.Pool['on'];
}