
'use strict';

/**
 * User.ts controller
 *
 * @description: A set of functions called "actions" for managing `User`.
 */

const lodash = require('lodash');
const utils = require('@strapi/utils');
const { getService } = require('../utils');
const { validateCreateUserBody, validateUpdateUserBody } = require('./validation/user');

const { sanitize, validate } = utils;
const { ApplicationError, ValidationError, NotFoundError } = utils.errors;

const sanitizeOutput = async (user, ctx) => {
  const schema = strapi.getModel('plugin::users-permissions.user');
  const { auth } = ctx.state;

  return sanitize.contentAPI.output(user, schema, { auth });
};


module.exports = {

  /**
   * Update a/an user record.
   * @return {Object}
   */
  async updateMe(ctx) {
    const advancedConfigs = await strapi
      .store({ type: 'plugin', name: 'users-permissions', key: 'advanced' }).get();

    const { id } = ctx.state.user;
    const { email, username, password } = ctx.request.body;

    const user = await getService('user').fetch(id);
    if (!user) {
      throw new NotFoundError(`User not found`);
    }

    await validateUpdateUserBody(ctx.request.body);

    if (user.provider === 'local' && lodash.has(ctx.request.body, 'password') && !password) {
      throw new ValidationError('password.notNull');
    }

    if (lodash.has(ctx.request.body, 'username')) {
      const userWithSameUsername = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { username } });

      if (userWithSameUsername && lodash.toString(userWithSameUsername.id) !== lodash.toString(id)) {
        throw new ApplicationError('Username already taken');
      }
    }

    if (lodash.has(ctx.request.body, 'email') && advancedConfigs.unique_email) {
      const userWithSameEmail = await strapi
        .query('plugin::users-permissions.user')
        .findOne({ where: { email: email.toLowerCase() } });

      if (userWithSameEmail && lodash.toString(userWithSameEmail.id) !== lodash.toString(id)) {
        throw new ApplicationError('Email already taken');
      }
      ctx.request.body.email = ctx.request.body.email.toLowerCase();
    }

    const updateData = {
      ...ctx.request.body,
    };

    const data = await getService('user').edit(user.id, updateData);
    const sanitizedData = await sanitizeOutput(data, ctx);

    ctx.send(sanitizedData);
  },

};
