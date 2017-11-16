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
      if (!data) {
        $('#issues-container').append(`<div class="issues-container-inner">Something went borken.</div>`);
        return;
      }
      if (data.length === 0) {
        $('#issues-container').append(`<div class="issues-container-inner">I couldn't find nothing, yo.</div>`);
        return;
      }
      data.forEach(item => {
        const $html = $(`<a class="issue issues-container-inner" data-id="${item.elemId}"></a>`);
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
