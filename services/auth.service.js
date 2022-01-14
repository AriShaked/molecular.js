"use strict";
const DbMixin = require("../mixins/db.mixin");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 *  * @typedef {import('http').ServerResponse} ServerResponse HTTP Server Response
 */
module.exports = {
	name: "auth",
	mixins: [DbMixin("users")],
	/**
	 * Service settings
	 */
	settings: {},
	/**
	 * Service metadata
	 */
	metadata: {},

	/**
	 * Service dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: { //http://localhost:3000/auth/login?userName=ari&password=asfsdfsd

/**
		 * Perform 'signup' action.
		 * @param {String} userName 
 		 * @param {String} firstName
 		 * @param {String} lastName 
 		 * @param {String} phone 
 		 * @param {String} userId 
		 * @returns
		 */
 signup: {
	method: "POST",
	rest: "POST /signup",
	params: {
		// validate all fields
		userName: { type: "string", min: 3, max: 255 },
		firstName: { type: "string", min: 2, max: 255 },
		lastName: { type: "string", min: 2, max: 255 },
		userId: { type: "string", min: 9, max: 9 },
		phone: { type: "string", min: 10, max: 10 },
	},
	async handler(ctx) {
		// build new user object
		const newUser = {
			userName: ctx.params.userName,
			firstName: ctx.params.firstName,
			lastName: ctx.params.lastName,
			userId: ctx.params.userId,
			phone: ctx.params.phone,
			status:"", 
			paymentHistory: [],
			profile: '',
			createDate: new Date(), 
			updateDate: new Date()
		}
		// add user to db
		const user = await ctx.call("users.createUser",  {newUser} );
		// create token

		//add token to req
		return user;
	},
},

		/**
		 * Perform 'login' action.
		 * @param {String} userName - User name
 		 * @param {String} password - password
		 * @returns
		 */
		login: {
			method: "POST",
			rest: "POST /login",
			params: {
				userName: "string",
				password: "string"
			},
			async handler(ctx) {
				const userName = ctx.params.userName;
				// check if user exists
				const user = await ctx.call("users.getByUserName",  {userName} );
				// check if pw is valid
				if (this.isUserPasswordValid(user)){
					// add token to response
					await this.addTokenToResponse(ctx , user);
					return {message: 'login succeusfully: your new token is attached'};
				} else {
					return {message: 'userName or password are invalid'}
				}
			},
		},
		otpLogin: {
			method: "POST",
			rest: "POST /login/otp",
			params: {
				userName: "string",
			},
			async handler(ctx) {
				const userName = ctx.params.userName;
				try {
					// check if user exists
					const user = await ctx.call("users.getByUserName", {userName} );
					// if user exsits send otp
					const res = await ctx.call("otp.sendOtp", {user});
					// this.logger.info("token validation request", ctx.params);
					return res;
				} catch (error) {
					return {message: error}
				}
				
			},
		},
		verifyOtp: {
			method: "POST",
			rest: "POST /otp/verify",
			params: {
				userName: "string",
				otpCode: { type: "string", min: 6, max: 6 },
			},
			async handler(ctx) {
				const userName = ctx.params.userName;
				const tryOtp = ctx.params.otpCode;
				try {
					// check if user exists
					const user = await ctx.call("users.getByUserName", {userName} );
					// add tryOtp to user obj
					user.tryOtp = tryOtp;
					// if user exsits send otp
					const isOtpValid = await ctx.call("otp.verifyOtp", {user});
					if (isOtpValid) {
						// add token to response
						await this.addTokenToResponse(ctx , user);
						// this.logger.info("token validation request", ctx.params);
						return {message: 'login succeusfully: your new token is attached'};
					}else {
						return {message: 'incorrect otp'};
					}
				} catch (error) {
					return {message: error}
				}
				
			},
		},
		logout: {
			method: "POST",
			rest: "POST /logout",
			async handler(ctx) {
				this.logger.info("logout request", ctx.params);
				return true;
			},
		},
	},
	/**
	 * Events
	 */
	events: {
		async "user.login"(ctx) {
			this.logger.info("Something happened", ctx.params);
		},
	},

	/**
	 * Methods
	 */
	methods: {
		async isUserPasswordValid(user) {
			const {password} = user[0];
			if (user && this.validatePassword(password)) {
				return true;
			} else {
				 return false;
			}
	
		},

		async validatePassword(password) {
			const hash = await bcrypt.hash(password , this.salt);
			return hash === this.password;
		},

		async addTokenToResponse(ctx, user) {
			// create token
			const token = await ctx.call("jwt.createJwt", {user});
			// add to response
            ctx.meta.$responseHeaders = {
                "Authorization": `Bearer ${token}`
            };
		},
	},

		

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
