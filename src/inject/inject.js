const commentContainerSelector = '.js-comment-container';


function expandAllTheThangs() {
  $(`${commentContainerSelector}.outdated-comment`)
      .addClass('open')
      .addClass('Details--on');
}

function getPendingIssues() {
  const pendingIssues = [];
  $(commentContainerSelector).each(function mapIssues() {
    const $comments = $(this).find('.review-comment');
    const waitingForMe = $comments.length > 0 && $comments.filter('.current-user').length === 0;
    const hasSingleComment = $comments.length === 1;
    if (waitingForMe || hasSingleComment) {
      const $comment = $(this).find('.review-comment:last');
      const reviewElemId = $comment.attr('id');
      pendingIssues.push({
        elemId: reviewElemId,
        comment: $comment.find('.comment-body').html(),
      });
    }
  });
  return pendingIssues;
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'expandComments': {
      console.log('Expanding all thangs!');
      expandAllTheThangs();
      return sendResponse('ok');
    }

    case 'getPendingIssues': {
      $(() => {
        const pendingIssues = getPendingIssues();
        sendResponse(pendingIssues);
      });
      return true;
    }

    case 'gotoComment': {
      const { commentId } = request;
      let $comment = $(`[id="${commentId}"]`);
      if ($comment.length > 1) {
        const commentEl = $comment.toArray().find(commentElem =>
          $(commentElem).closest(commentContainerSelector).find('.review-comment').length === 1);
        $comment = $(commentEl);
      }
      const $parent = $comment.closest(`${commentContainerSelector}.outdated-comment`);
      if ($parent.length > 0) {
        $parent.addClass('open').addClass('Details--on');
      }
      $comment.get(0).scrollIntoView();
      $comment.css('background-color', 'red');
      window.setTimeout(() => {
        $comment.css('background-color', 'inherit');
      }, 750);
      return sendResponse('ok');
    }

    default: {
      return sendResponse(new Error('UNKNOWN_ACTION'));
    }
  }
});
