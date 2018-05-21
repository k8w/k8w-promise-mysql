import * as mysql from 'mysql';
import PromiseMySQLPool from './src/PromiseMySQLPool';
import PromiseMyCluster from './src/PromiseMyCluster';
import MyClusterConfig from './src/MyClusterConfig';

export default class PromiseMySQL {
    static createPool(config: mysql.PoolConfig | string): PromiseMySQLPool {
        return new PromiseMySQLPool(mysql.createPool(config));
    }

    static createCluster(config: MyClusterConfig): PromiseMyCluster {
        let poolCluster = mysql.createPoolCluster(config.options);

        let i: number;
        for (i = 0; i < config.master.length; i++) {
            if (i == 0) {
                poolCluster.add('MASTER', config.master[i]);
            } else {
                poolCluster.add(`MASTER${i}`, config.master[i]);
            }
        }
        if (config.slave) { 
            for (i = 0; i < config.slave.length; i++) {
                poolCluster.add(`SLAVE${i+1}`, config.slave[i]);
            }
        }    
        return new PromiseMyCluster(poolCluster);
    }

    static escape = mysql.escape;
    static escapeId = mysql.escapeId;
    static format = mysql.format;
    static raw = mysql.raw;
}
