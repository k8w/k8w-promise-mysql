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

export interface QueryResult {
    results: any;
    fields: mysql.FieldInfo[];
}

export interface QueryFunction {
    (query: mysql.Query | string | mysql.QueryOptions): Promise<QueryResult>;

    (options: string, values: any): Promise<QueryResult>;
}

export class PromiseMySQLPool {
    private _pool: mysql.Pool;

    constructor(pool: mysql.Pool) {
        this._pool = pool;
    }

    query: QueryFunction = () => {
        let args: any[] = [];
        for (let i = 0; i < arguments.length; ++i){
            args.push(arguments[i]);
        }

        return new Promise<QueryResult>((rs, rj) => {
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

            this._pool.query.apply(this._pool, arguments)
        });
    }

    async end(): Promise<void>{
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

    on: mysql.Pool['on'] = this._pool.on.bind(this._pool);
}