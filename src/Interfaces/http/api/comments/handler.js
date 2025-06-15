const AddCommentUseCase = require('../../../../Applications/use_case/AddCommentUseCase');
const DeleteCommentUseCase = require('../../../../Applications/use_case/DeleteCommentUseCase');

class CommentsHandler {
  constructor(container) {
    this._container = container;
  }

  async postCommentHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId } = request.params;
    const { content } = request.payload;
    const addCommentUseCase = this._container.getInstance(AddCommentUseCase.name);
    const comment = await addCommentUseCase.execute(credentialId, threadId, { content });

    return h
      .response({
        status: 'success',
        data: {
          addedComment: comment,
        },
      })
      .code(201);
  }

  async deleteCommentByIdHandler(request, h) {
    const { id: credentialId } = request.auth.credentials;
    const { threadId, commentId } = request.params;
    const deleteCommentUseCase = this._container.getInstance(DeleteCommentUseCase.name);
    await deleteCommentUseCase.execute(credentialId, commentId, threadId);

    return h
      .response({
        status: 'success',
      })
      .code(200);
  }
}

module.exports = CommentsHandler;