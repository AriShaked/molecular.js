

const { ServiceBroker } = require("moleculer");

// Create broker
const redisBroker = new ServiceBroker({
    cacher: {
        type: "Redis",
        options: {
            // Prefix for keys
            prefix: "AR",            
            // set Time-to-live to 30sec.
            ttl: null, 
            // Turns Redis client monitoring on.
            monitor: false,
            // Redis settings
            redis: {
                host: "127.0.0.1",
                port: 6379,
                password: "1234",
                db: 0
            }
        }
    }
});

redisBroker.createService({
    name: "redisBroker",
    actions: {

        // setByKey : {
        //     params: {
        //         key:'string',
        //         value:'string',
        //         expireInSec:'number'
        //     },
        //     async handler(ctx) {
        //         const {key, value, expireInSec} = ctx.params
        //         return await broker.cacher.set(key, value, 'EX', expireInSec);
        //     },
        // },
        // getByKeyAsync : {
        //     params: {
        //         key:'string',
        //     },
        //     async handler(ctx) {
        //         const {key} = ctx.params
        //         return await broker.cacher.get(key);
        //     },
        // } 
    }
});
redisBroker.start();



