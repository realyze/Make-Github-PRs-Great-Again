$(() => {
  const sendMsg = (payload, clb) => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
      chrome.tabs.sendMessage(tabs[0].id, payload, response => {
        if (clb) {
          clb(response);
        }
      });
    });
  };

  $("#expand-thangs-btn").on("click", () => {
    sendMsg({ action: "expandComments" });
  });

  setTimeout(() => {
    sendMsg({ action: "getPendingIssues" }, data => {
      $('#issues-container').html('');
      data.forEach(item => {
        const $html = $(`<a class="issue" data-id="${item.elemId}"></a>`);
        $html.append($.parseHTML(item.comment));
        $('#issues-container').append($html);
      });
    });
  }, 500);

  $("#issues-container").on("click", "a.issue", ev => {
    const commentId = $(ev.currentTarget).attr("data-id");
    sendMsg({ action: "gotoComment", commentId });
  });
});
