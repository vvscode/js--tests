var $$ = document.querySelector.bind(document);

var form = $$("form");
var infoBlock = $$(".info");
/** @member {SumHandler} */
var sumHandler = getSumHandler();

function submitHandler(form) {
  var data = getFormData(form);
  sumHandler.add(data.name || "Unknown", Number(data.sum) || 0);
  console.log(getSumHandlerListHtml(sumHandler));
  infoBlock.innerHTML = getSumHandlerListHtml(sumHandler);
  form.reset();
  var firstInput = form.querySelector("input");
  if (firstInput) {
    firstInput.focus();
  }
}

addFormHandler(form, submitHandler);
