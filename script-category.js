const languagesSection = document.getElementById("languages-section");
const mathsSection = document.getElementById("maths-section");
const categoryLanguagesBtn = document.getElementById("category-languages-btn");
const categoryMathsBtn = document.getElementById("category-maths-btn");

function showCategory(category) {
  const isMaths = category === "maths";
  languagesSection.style.display = isMaths ? "none" : "grid";
  mathsSection.style.display = isMaths ? "grid" : "none";
  categoryLanguagesBtn.classList.toggle("active", !isMaths);
  categoryMathsBtn.classList.toggle("active", isMaths);
  localStorage.setItem("recre-category", category);
}

categoryLanguagesBtn.addEventListener("click", () => showCategory("languages"));
categoryMathsBtn.addEventListener("click", () => showCategory("maths"));

showCategory(localStorage.getItem("recre-category") || "languages");
