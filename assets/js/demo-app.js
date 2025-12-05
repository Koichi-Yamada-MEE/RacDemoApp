/******************************************
 * テンプレートファイル読み込み
 ******************************************/
Promise.all([
  fetch("../../partials/header.html").then((r) => r.text()),
  fetch("../../partials/date.html").then((r) => r.text()),
  fetch("../../partials/footer.html").then((r) => r.text()),
  fetch("../../partials/modal.html").then((r) => r.text()),
  fetch("../../partials/drower-menu.html").then((r) => r.text()),
])
  .then(([headerHtml, dateHtml, footerHtml, modalHtml, drawerHtml]) => {
    document.querySelector(".content-header").innerHTML = headerHtml;
    document.querySelector(".content-date").innerHTML = dateHtml;
    document.querySelector(".content-footer").innerHTML = footerHtml;
    document.querySelector(".content-modal").innerHTML = modalHtml;
    document.querySelector(".content-drawer").innerHTML = drawerHtml;
  })
  .catch((err) => {
    console.error("Failed to load partials:", err);
  });

/******************************************
 * JSON取得（ブラケット版）
 ******************************************/
const getJsonValue = (propertyPath) => {
  const storedJson = sessionStorage.getItem("appData");
  let data;

  try {
    data = storedJson ? JSON.parse(storedJson) : null;
  } catch (e) {
    data = null;
  }

  if (!data) return undefined;

  // ブラケット → ドット記法
  const normalizedPath = propertyPath.replace(/\[(\d+)\]/g, ".$1");

  const props = normalizedPath.split(".");
  let current = data;

  for (let prop of props) {
    if (current[prop] === undefined) return undefined;
    current = current[prop];
  }

  return current;
};

/******************************************
 * JSON更新（ブラケット版）
 ******************************************/
const setJsonValue = (propertyPath, value) => {
  const storedJson = sessionStorage.getItem("appData");
  let data;

  try {
    data = storedJson ? JSON.parse(storedJson) : {};
  } catch (e) {
    data = {};
  }

  // ブラケット記法をドット記法に変換
  // "buttons[0].label" → "buttons.0.label"
  const normalizedPath = propertyPath.replace(/\[(\d+)\]/g, ".$1");

  const props = normalizedPath.split(".");
  let current = data;

  for (let i = 0; i < props.length - 1; i++) {
    const prop = props[i];

    // 数字 → 配列アクセス
    const index = Number(prop);
    const isIndex = !isNaN(index);

    if (isIndex) {
      if (!Array.isArray(current)) {
        current = [];
      }
      if (current[index] === undefined) {
        current[index] = {};
      }
      current = current[index];
    } else {
      if (!current[prop] || typeof current[prop] !== "object") {
        current[prop] = {};
      }
      current = current[prop];
    }
  }

  // 最終プロパティ
  const lastProp = props[props.length - 1];
  const lastIndex = Number(lastProp);

  if (!isNaN(lastIndex)) {
    if (!Array.isArray(current)) current = [];
    current[lastIndex] = value;
  } else {
    current[lastProp] = value;
  }

  sessionStorage.setItem("appData", JSON.stringify(data));
};

/******************************************
 * BS5 モーダルフォーカス解除
 ******************************************/
window.addEventListener("hide.bs.modal", () => {
  document.activeElement.blur();
});
