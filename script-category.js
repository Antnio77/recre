const categories = ["languages", "maths", "histgeo"];

const categorySections = {};
const categoryButtons = {};
categories.forEach((cat) => {
  categorySections[cat] = document.getElementById(`${cat}-section`);
  categoryButtons[cat] = document.getElementById(`category-${cat}-btn`);
});

function showCategory(category) {
  categories.forEach((cat) => {
    categorySections[cat].style.display = cat === category ? "grid" : "none";
    categoryButtons[cat].classList.toggle("active", cat === category);
  });
  localStorage.setItem("recre-category", category);
}

categories.forEach((cat) => {
  categoryButtons[cat].addEventListener("click", () => showCategory(cat));
});

showCategory(localStorage.getItem("recre-category") || "languages");
