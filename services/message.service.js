module.exports = {
    name: "message",
    actions: {
      
        /** @param {Context} ctx  */


            async sendMessage(ctx) {
                if(!ctx.params.messageInfo){
                    return {message: 'system error'};
                }
                const {messageInfo}  = ctx.params;
                let res;
                switch (messageInfo.messageType) {
                    case 'email':
                       // res = await await ctx.call("emailProvider.sendSms",  {messageInfo});
                        return res;
                    case 'sms':
                        res = await await ctx.call("smsProvider.sendSms",  {messageInfo});
                        return res;
                    default:
                        res = await await ctx.call("smsProvider.sendSms",  {messageInfo});
                        return res;
                    }
        }
    }
    , methods: {

    }
}