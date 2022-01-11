"use strict";
const DbMixin = require("../mixins/users.mixin");
/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
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
	actions: {
		/**
		 * Perform 'login' action.
		 * @param {String} userName - User name
 		 * @param {String} password - password
		 * @returns
		 */
		login: {
			params: {
				userName: "string",
				password: "string"
			},
			async handler(ctx) {
				this.logger.info("login request", ctx.params);
				return { user: ctx.params.user, token: "1234567890" };
			},
		},
		validateToken: {

			async handler(ctx) {
				this.logger.info("token validation request", ctx.params);
				return { token: "12334566" };
			},
		},
		logout: {

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
		async seedDB() {
			await this.adapter.insertMany([
				{ UserName: "email1@example.com", password:"password1", firstName: "firstName", lastName: "lastName", status:"active", registrationSource: "web", createdOn: new Date(), updatedOn: new Date(), lastLogin: new Date(), lastLoginIP: "", lastLoginDevice: "", lastLoginOS: ""},
				{ UserName: "email2@example.com", password:"password1", firstName: "firstName", lastName: "lastName", status:"pending", registrationSource: "moovit", createdOn: new Date(), updatedOn: new Date(), lastLogin: new Date(), lastLoginIP: "", lastLoginDevice: "", lastLoginOS: ""},
				{ UserName: "email3@example.com", password:"password1", firstName: "firstName", lastName: "lastName", status:"disabled", registrationSource: "pango", createdOn: new Date(), updatedOn: new Date(), lastLogin: new Date(), lastLoginIP: "", lastLoginDevice: "", lastLoginOS: ""},

			]);
		}
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
