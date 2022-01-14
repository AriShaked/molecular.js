const xml2js = require('xml2js')

module.exports = {
    name: "unicellSms",
    actions: {
      /** @param {Context} ctx  */
        async send(ctx) {
            if(!ctx.params.messageInfo) {
                return {message: 'system error'}
            }
            const {messageTo , messageText} = ctx.params.messageInfo;
            // const messageInfo = {
            //     // get unicell username 
            //     unicellUserName: '', // todo: takeout to env file
            //     // get unicell pw
            //     unicellUPassword: '', // todo: takeout to env file
            //     messageTo,
            //     messageText
            // }
            return {message: 'sms has sent'}
            // build xml
            const xml = this.buildXml(messageInfo);
            this.sendMessage(xml);
           
        }
        
    }
    , methods: {

        async buildXml(messageInfo) {
            const builder = new xml2js.Builder({ rootName: 'sms', headless: false });
            const unicellXml = {
                    account: {
                        id: messageInfo.unicellUserName,
                        password: messageInfo.unicellUPassword
                    },
                    attributes: {
                        reference: 123,
                        replyPath: 0
                    },
                    schedule: {
                        relative: 0
                    },
                    targets: {
                        cellphone: `${messageInfo.messageTo}`
                    },
                    data: `${messageInfo.messageText}`
                };
            const _xml = await builder.buildObject(unicellXml);
            return _xml;
        },

        async sendMessage(xml) {
            const res =  await this._http.post(`${AppConfiguration.get('unicell').url}?XML=${xml}`);
            //parse respone
            await xml2js.parseString(res.data, (err, result) => {
                console.dir(result);
                console.log(result)
              });
        }
    }
}

// +++++++++++++++++++ unicell xml request example +++++++++++++++++++++++++

// <?xml version="1.0" encoding="UTF-8"?>
// <sms>
// <account>
// <id>user_name</id>
// <password>password</password>
// </account>
// <attributes>
// <reference>123</reference>
// <replyPath>0521111111</replyPath>
// </attributes>
// <schedule>
// <relative>0</relative>
// </schedule>
// <targets>
// <cellphone reference="3542">972541234567</cellphone>
// <cellphone reference="3543">972521234567</cellphone>
// <cellphone reference="3544">972501234567</cellphone>
// </targets>
// <data>שלום שלום </data>
// </sms>





// +++++++++++++++++++ unicell xml response example +++++++++++++++++++++++++

// <?xml version="1.0" encoding="UTF-8"?>
// <response>
// <code>0</code>   // 0 - success
// <message>Success</message>
// <references>
// <reference destination="972541234567">562815493</reference>
// <reference destination="972569876543">456391842</reference>
// </references>
// </response>



// +++++++++++++++++ unicell errors codes ++++++++++++++++

// 010
// GET request not supported
// permanent
// 020
// Error parsing XML document
// permanent
// 030
// Missing mandatory node sms
// permanent
// 120
// Sending dates conflict
// permanent
// 200
// Missing mandatory node /sms/account/id
// permanent
// 201
// Missing mandatory node /sms/account/password
// permanent
// 203
// Invalid password / user name
// permanent
// 204
// Not Enough Credit
// permanent
// 300
// Missing validity type
// permanent
// 301
// Unsupported validity type
// permanent
// 310
// Missing mandatory node reference
// permanent
// 320
// Invalid reference value, value is not a valid long
// permanent
// 330
// Invalid cellphone reference value
// permanent
// 340
// Invalid target cellphone number
// permanent
// 350
// Missing mandatory node data
// permanent
// 360
// Invalid Replay path value
// permanent
// 400
// Temporary internal system error
// temporary