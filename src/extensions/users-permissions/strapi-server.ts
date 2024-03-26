module.exports = (plugin: any) => {
  plugin.controllers.user.updateMe = async (ctx) => {
    if (!ctx.state.user || !ctx.state.user.id) {
      ctx.response.status = 401;
      return;
    }

    const id = ctx.state.user.id;
    // Use the edit function from user-permissions plugin
    const updatedUser = await strapi.plugins['users-permissions'].services.user.edit(id, ctx.request.body);
    ctx.response.status = 200;
    return updatedUser;
  };

  plugin.routes['content-api'].routes.push({
    method: "PUT",
    path: "/user/me",
    handler: "user.updateMe",
    config: {
      prefix: "",
      policies: []
    }
  });

  return plugin;
};
