export class RecipesCards {
    constructor(recipes) {
        this._recipes = recipes;
    }

    createRecipesCard() {
        const $wrapper = document.createElement('div');
        $wrapper.classList.add('recipes-card-wrapper');

        this._recipes.forEach(recipe => {
            const recipeCard = this.createSingleRecipeCard(recipe);
            $wrapper.appendChild(recipeCard);
        });

        return $wrapper;
    }

    createSingleRecipeCard(recipe) {
        const recipeCard = document.createElement('div');
        recipeCard.classList.add('card');
    
        
        const contentWrapper = document.createElement('div');
        contentWrapper.classList.add('card-content'); 
        
        contentWrapper.innerHTML = `
            <h2>${recipe.name}</h2>
            <h3>RECETTE</h3>
            <p>${recipe.description}</p>
            <h3>INGREDIENTS</h3>
            ${this.createIngredientsList(recipe.ingredients)}
        `;
    
        // Ajout de l'image et de la div de contenu dans la carte
        recipeCard.innerHTML = `
            <img src="${recipe.image}" alt="${recipe.name}">
        `;
    
        // Append the contentWrapper div to the main recipe card
        recipeCard.appendChild(contentWrapper);
    
        return recipeCard;
    }
    createIngredientsList(ingredients) {
        return `
            <div class="ingredients-list">
                <ul>
                    ${ingredients.map(ingredient => {
                        const quantity = ingredient.quantity ? 
                            `<span class="ingredient-quantity">${ingredient.quantity} ${ingredient.unit || ''}</span>` : '';
                        return `<li><span class="ingredient-name">${ingredient.ingredient}</span>${quantity}</li>`;
                    }).join('')}
                </ul>
            </div>
        `;
    }
}
