import { getData } from '../api/api.js';
import { RecipesCards } from '../templates/recipesCards.js';
import { onSearch } from '../templates/SearchForm.js'; 
import { initFilterSystem } from '../templates/SearchForm.js'; 


class App {
    constructor() {
        this.$RecipesWrapper = document.querySelector('.recipes-wrapper');
        this.recipes = [];
    }

    async main() {
        // Appel de la fonction pour récupérer les données des recettes
        const { recipes } = await getData();
        this.recipes = recipes; // Stocker les recettes dans l'instance

        // Boucle sur chaque recette pour créer et afficher la carte
        this.recipes.forEach(recipe => {
            const template = new RecipesCards([recipe]); // Passe un tableau avec une recette
            this.$RecipesWrapper.appendChild(template.createRecipesCard());
        });

        // Appel de la fonction de recherche
        onSearch(this.recipes, this.displayRecipes.bind(this)); // Liaison à la fonction displayRecipes

        // Initialisation du système de filtre
        initFilterSystem(this.recipes, this.displayRecipes.bind(this)); // Appel de la fonction de filtrage
    }

    displayRecipes(recipes) {
        this.$RecipesWrapper.innerHTML = ''; // Vider l'affichage actuel

        // Boucle sur chaque recette filtrée pour créer et afficher la carte
        recipes.forEach(recipe => {
            const template = new RecipesCards([recipe]);
            this.$RecipesWrapper.appendChild(template.createRecipesCard());
        });
    }
}

const app = new App();
app.main();

