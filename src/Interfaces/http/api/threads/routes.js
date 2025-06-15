const routes = (handler) => ([
  {
    method: 'POST',
    path: '/threads',
    handler: (request, h) => handler.postThreadHandler(request, h),
    options: {
      auth: 'forumapi__jwt',
    },
  },
  {
    method: 'GET',
    path: '/threads/{threadId}',
    handler: (request) => handler.getThreadByIdHandler(request),
  },
]);

module.exports = routes;