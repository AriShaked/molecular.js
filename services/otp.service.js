module.exports = {
    name: "otp",
    actions: {
      
        /** @param {Context} ctx  */
        async sendOtp(ctx) {
            if (!ctx.params.user){
                return {message: 'system error'}
            }
            // genarate otp number
            const otpNumber = this.generateOtpNumber();
            // exract user details & choose message method
            const {user} = ctx.params;
            const messageInfo = {
                messageText: `${otpNumber} שלום, קוד האימות הוא`
            }
            // check message type
            if (user && user.phone) {
                messageInfo.messageType = 'sms'
                messageInfo.messageTo = user.phone;
            } else {
                messageType = 'email',
                messageInfo.messageTo = user.userName;
                messageInfo.messageSubject = 'קוד אימות לכניסה מהירה למערכת טופ קארד'
            }
            // send message
            const res =  await ctx.call("message.sendMessage",  {messageInfo} );
            // if message sent succesfully save otp to redis
            if(res) {
                // set otp to redis - expires after 180 seconds
                this.broker.cacher.set(`otp_${user.userName}`, otpNumber, 180); // todo: takeout to env file : ttl (180)
                console.log('otpNumber:', otpNumber)
            }
            return res;
        } ,

        /** @param {Context} ctx  */
        async verifyOtp(ctx) {
            if (!ctx.params.user){
                return {message: 'system error'}
            }
            const {user} = ctx.params;
            // get real otp from redis
            const realOtp = await this.broker.cacher.get(`otp_${user.userName}`);
            // if no otp return false
            if (!realOtp || realOtp == null) {
                return false;
            }
            // compare otp's - if eqale return true
            if (realOtp.toString() == user.tryOtp.toString()){
                return true;
            }
            return false;
        }



        
    }
    , methods: {
        generateOtpNumber() {
			return this.randMinMaxInt(100000, 999999);
		},
        randMinMaxInt(min, max) {
            return Math.floor(Math.random() * (max - min)) + min;
        }
    }
}