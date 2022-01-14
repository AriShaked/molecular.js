module.exports = {
    name: "smsProvider",
    actions: {
        /** @param {Context} ctx  */
        async sendSms(ctx) {
            if(!ctx.params.messageInfo) {
                return {message: 'system error'}
            }
            const {messageInfo} = ctx.params;
            const res = await ctx.call("unicellSms.send",  {messageInfo});
            return res;
        }
    }
    , methods: {

    }
}