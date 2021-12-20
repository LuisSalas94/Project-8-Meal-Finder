//buttons & form
const search = document.querySelector("#search");
const submit = document.querySelector("#submit");
const random = document.querySelector("#random");
//div's
const resultHeading = document.querySelector("#result-heading");
const mealsEl = document.querySelector("#meals");
const single_mealEl = document.querySelector("#single-meal");

//Event Listeners
submit.addEventListener("submit", searchMeal);
mealsEl.addEventListener("click", (e) => {
	const mealInfo = e.path.find((item) => {
		if (item.classList) {
			return item.classList.contains("meal-info");
		} else {
			return false;
		}
	});

	if (mealInfo) {
		const mealID = mealInfo.getAttribute("data-mealID");
		getMealById(mealID);
	}
});
random.addEventListener("click", getRandomMeal);

//1. Search meal and search from API
function searchMeal(e) {
	e.preventDefault();

	//Clear single meal
	single_mealEl.innerHTML = "";

	//search value
	const term = search.value;
	//check if empty
	if (term.trim()) {
		//fetch API
		fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`)
			.then((res) => res.json())
			.then((data) => {
				resultHeading.innerHTML = `<h2>Search Results for: ${term}</h2>`;
				if (data.meals === null) {
					resultHeading.innerHTML = `<p>There are no results. Please try again!!!</p>`;
				} else {
					mealsEl.innerHTML = data.meals
						.map(
							(meal) =>
								`
            <div class="meal">
              <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
              <div class="meal-info" data-mealID="${meal.idMeal}">
                <h3>${meal.strMeal}</h3>
              </div>
            </div>
            `
						)
						.join("");
				}
			});
		//Clear search input text
		search.value = "";
	} else {
		alert("Please enter a value");
	}
}

//2. Fetch meal by ID
function getMealById(mealID) {
	fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealID}`)
		.then((res) => res.json())
		.then((data) => {
			const meal = data.meals[0];
			/* console.log(meal); */
			addMealToDOM(meal);
		});
}

//2.1 Add Meal to DOM
function addMealToDOM(meal) {
	//get all ingredients & measures into an array
	const ingredients = [];
	for (let i = 1; i <= 20; i++) {
		if (meal[`strIngredient${i}`]) {
			ingredients.push(
				`${meal[`strIngredient${i}`]} - ${meal[`strMeasure${i}`]}`
			);
		} else {
			break;
		}
	}

	//Add it to the DOM
	single_mealEl.innerHTML = `
  <div class="single-meal">
    <h1>${meal.strMeal}</h1>

    <img src="${meal.strMealThumb}">

    <div class="single-meal-info">
     Category: ${meal.strCategory ? `<p>${meal.strCategory}</p>` : ""}    
     Country: ${meal.strArea ? `<p>${meal.strArea}</p>` : ""}    
    </div>
    
    <div class="main">
      <p>${meal.strInstructions}</p>
      <h2>Ingredients</h2>
      <ul>
        ${ingredients.map((ing) => `<li>${ing}</li>`).join("")}
      </ul>
    </div>

  </div>
  `;
}

//3.Fetch random meal from API
function getRandomMeal() {
	//Clear meals and heading
	mealsEl.innerHTML = "";
	resultHeading.innerHTML = "";
	fetch(`https://www.themealdb.com/api/json/v1/1/random.php`)
		.then((res) => res.json())
		.then((data) => {
			const meal = data.meals[0];
			addMealToDOM(meal);
		});
}

//4. Preloader
const preloader = document.querySelector(".preloader");
window.addEventListener("load", () => {
	preloader.classList.add("hide-preloader");
});
