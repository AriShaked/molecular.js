var jwt = require('jsonwebtoken');

module.exports = {
    name: "jwt",
    actions: {
      
        /** @param {Context} ctx  */


        async createJwt(ctx) {
            if(!ctx.params.user) {
                //error
                console.log('error inside createJwt')
            }
             const {user} = ctx.params;
             const jwt = this.signJwt(user.username);
             return jwt;
        }
    }
    , methods: {

        // async getKey() {
        //     try {
        //       const privateKey = await fs.readFileSync("../server/src/config/private.pem", { encoding: "utf8" }) // todo: takeout to env file
        //       return privateKey;
        //     } catch (error) {
        //       console.log('error getting privateKey : ', error)
        //       return {message: 'error'}
        //     }
        // },
        
        signJwt(userName) {
        // get private key
            // const privateKey = await getKey()
        //8 hours from now
            // const JWT_LIFE_TIME = Math.floor(Date.now() / 1000) + (60 * 60 * 8) // todo: takeout to env file // 
            // get JWT_LIFE_TIME from config file 
        // const exp = JWT_LIFE_TIME;
        // const payload = {
        //     userName,
        //     exp
        // }
        // const jwt = await jsonWebToken.sign(payload, privateKey, {
        //     algorithm: 'RS256',
        // });
        var token = jwt.sign({ foo: 'bar' }, 'shhhhh');
        return token;
        }

    }
}