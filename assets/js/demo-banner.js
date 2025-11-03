document.addEventListener("DOMContentLoaded", function() {
  const banner = document.createElement("div");
  banner.innerHTML = `
    🚧 <strong>Demo Project:</strong> This website is a practice project created for learning purposes only.
  `;
  Object.assign(banner.style, {
    backgroundColor: "#fff3cd",
    color: "#856404",
    textAlign: "center",
    padding: "10px",
    fontFamily: "'Inter', sans-serif",
    fontSize: "14px",
    borderBottom: "1px solid #ffeeba",
    position: "fixed",
    top: "0",
    left: "0",
    width: "100%",
    zIndex: "9999"
  });
  document.body.insertBefore(banner, document.body.firstChild);
  document.body.style.paddingTop = "50px";
});
