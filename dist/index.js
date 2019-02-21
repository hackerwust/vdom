function view() {
  return rh(
    "ul",
    { id: "filmList", className: "list" },
    rh(
      "li",
      { className: "main" },
      "Detective Chinatown Vol 2"
    ),
    rh(
      "li",
      null,
      "Ferdinand"
    ),
    rh(
      "li",
      null,
      "Paddington 2"
    )
  );
}

function render() {
  console.log(view());
}