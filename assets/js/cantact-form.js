document.addEventListener("DOMContentLoaded", function () {
  function sendForm(formId, errorId, action_name) {
    const form = document.getElementById(formId);

    const messageBlock = document.getElementById(errorId);

    if (form) {
      const formData = new FormData(form);
      formData.append("action", action_name);
      for (const [k, v] of formData.entries()) console.log(k, v);
      fetch(my_ajax_object.ajax_url, {
        method: "POST",
        body: formData,
      })
        .then((response) => response.json())
        .then((response) => {
          if (response.success) {
            messageBlock.innerHTML = response.data.message;
            form.reset();
            // setTimeout(closePopup, 3000);
          } else {
            messageBlock.innerHTML = response.data.message;
          }
        })
        .catch((error) => {
          messageBlock.innerHTML = "Error sending. Try again later.";
          console.log(error);
        });
    }
  }
});
