"use strict";

const DbMixin = require("../mixins/db.mixin");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "users",
	// version: 1
	// routes: [
	// 	{
	// 		autoAliases: true
	// 	}
	// ],
	/**
	 * Mixins
	 */
	mixins: [DbMixin("users")],

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Action Hooks
	 */
	hooks: {
		before: {
			/**
			 * Register a before hook for the `create` action.
			 * It sets a default value for the quantity field.
			 *
			 * @param {Context} ctx
			 */
		
		}
	},

	/**
	 * Actions
	 */
	 actions: {

			/**
		 **@returns
		 * @param {String} userName
		 */
			 getByUserName: {
				rest: "/users",
				params: {
					userName: "string"
				},
				/** @param {Context} ctx  */
				async handler(ctx) {
					const userName = ctx.params.userName;
					//check if user exists 
					const user = await this.adapter.find({query: {userName: 'nb@example.com'}}) ;
					// if user not exists return;
					if (user.length == 0) {
						return {messsage: 'user not found'};
					};
					if (user.length > 1) {
						return {messsage: 'system error'};
					};
					return user[0];
				}
			},

			
			createUser: {
				rest: "/create",
				/** @param {Context} ctx  */
				async handler(ctx) {
					if (!ctx.params.newUser){
						return {message: 'system error'}
					}
					try {
						//create user
						const user = await this.adapter.insert(ctx.params.newUser) ;
						return user;

					} catch (error) {
						return {messsage: 'system error'};
					}
				}
			},
	},
	

	/**
	 * Methods
	 */
	methods: {

		/**
		 * Loading sample data to the collection.
		 * It is called in the DB.mixin after the database
		 * connection establishing & the collection is empty.
		 */
		async seedDB() {
			await this.adapter.insertMany([
				{ 
					firstName: "נפתלי", 
					lastName: "בנט", 
					phone: '0501231234' , 
					userId: '100100100' ,
					userName: "nb@example.com", 
					status:"active", 
					paymentHistory: [],
					profile: 'profile',
					createDate: new Date(), 
					updateDate: new Date()
				},
				{ 
					firstName: "יאיר", 
					lastName: "לפיד", 
					phone: '0501111111' , 
					userId: '200200200' ,
					userName: "yl@example.com", 
					status:"active", 
					paymentHistory: [],
					profile: 'profile',
					createDate: new Date(), 
					updateDate: new Date()
				},{ 
					firstName: "מירי", 
					lastName: "רגב", 
					phone: '0502222222' , 
					userId: '300300300' ,
					userName: "mm@example.com", 
					status:"active", 
					paymentHistory: [],
					profile: 'profile',
					createDate: new Date(), 
					updateDate: new Date()
				},	
				// { userName: "cc@example.com", password:"password1", firstName: "מירי", lastName: "רגב", phone: '0501231234' , userId: 300300300 ,status:"disabled", registrationSource: "pango", createdOn: new Date(), updatedOn: new Date(), lastLogin: new Date(), lastLoginIP: "", lastLoginDevice: "", lastLoginOS: ""},

			]);
		}
	},

	/**
	 * Fired after database connection establishing.
	 */
	async afterConnected() {
		// await this.adapter.collection.createIndex({ name: 1 });
	}
};
