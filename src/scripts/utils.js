/**
 * Prevent Form Submition and call cb
 * @param {*} form Form element
 * @param {*} cb  callback for form submition
 */
function addFormHandler(form, cb) {
  form.addEventListener("submit", ev => {
    ev.preventDefault();
    cb(ev.target);
  });
}

/**
 * Converts form data into object
 * @param {*} form 
 * @returns {Object}
 */
function getFormData(form) {
  var formData = new FormData(form);
  var convertedJSON = {};
  var it = formData.entries();
  var n;

  while ((n = it.next())) {
    if (!n || n.done) break;
    convertedJSON[n.value[0]] = n.value[1];
  }

  return convertedJSON;
}

/**
 * SumHandler interface.
 * @typedef {Object} SumHandler
 * @method add
 * @method getTotal
 * @method getList
 */

/**
 * Returns SumHandler object
 * @returns {SumHandler}
 */
function getSumHandler() {
  var list = [];

  return {
    add(name, sum) {
      list.push({ name, sum });
    },
    getTotal() {
      return list.reduce((sum, val) => sum + val.sum, 0);
    },
    getList() {
      return list.map(({ name, sum }) => ({ name, sum }));
    }
  };
}

/**
 * Returns html presentationf for list state
 * @param {*} sumHanlder 
 * @returns {String} html presentation
 */
function getSumHandlerListHtml(sumHanlder) {
  var list = sumHanlder.getList();
  var total = sumHanlder.getTotal();
  return [
    "<table class='sum-table'>",
    "<thead><tr><th class='name'>Name</th><th class='sum'>Sum</th></tr></thead>",
    "<tbody>",
    list
      .map(function(item) {
        return [
          "<tr class='sum-row'>",
          "<td class='name'>" + item.name + "</td>",
          "<td class='sum'>" + item.sum + "</td>",
          "</tr>"
        ].join("");
      })
      .join(""),
    "<tr class='sum-summary'><td class='result' colspan=2>Result: " +
      total +
      "</td></tr>",
    "</tbody>",
    "</table>"
  ].join("");
}

if (typeof window === "object") {
  window.addFormHandler = addEventListener;
  window.getSumHandler = getSumHandler;
  window.getSumHandlerListHtml = getSumHandlerListHtml;
  window.addFormHandler = addFormHandler;
  window.getFormData = getFormData;
}
