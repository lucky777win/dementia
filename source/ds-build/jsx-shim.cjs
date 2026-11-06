var R = window.React;
exports.Fragment = R.Fragment;
exports.jsx = exports.jsxs = function (t, p, k) { return R.createElement(t, k === undefined ? p : Object.assign({}, p, { key: k })); };
