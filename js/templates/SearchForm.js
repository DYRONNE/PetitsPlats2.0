export function onSearch(recipes, displayRecipes) {
    const searchInput = document.querySelector('.form-control');
    let debounceTimeout;
    let filteredRecipes = recipes; // Stocker les recettes filtrées
    const messageContainer = document.querySelector('.message-container'); // Créez ou sélectionnez un conteneur pour le message

    searchInput.addEventListener('keyup', e => {
        const query = e.target.value.trim();
        console.log('Query:', query);

        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
            if (query.length >= 3) {
                filteredRecipes = []; // Réinitialiser les recettes filtrées

                for (let i = 0; i < recipes.length; i++) {
                    const recipe = recipes[i];
                    const nameMatch = recipe.name.toLowerCase().includes(query.toLowerCase());
                    const ingredientsMatch = recipe.ingredients.some(ingredientObj => 
                        ingredientObj.ingredient.toLowerCase().includes(query.toLowerCase())
                    );
                    const applianceMatch = recipe.appliance.toLowerCase().includes(query.toLowerCase());
                    const ustensilsMatch = recipe.ustensils.some(utensil => 
                        utensil.toLowerCase().includes(query.toLowerCase())
                    );

                    // Si l'une des conditions correspond, ajouter la recette aux recettes filtrées
                    if (nameMatch || ingredientsMatch || applianceMatch || ustensilsMatch) {
                        filteredRecipes.push(recipe);
                    }
                }

                console.log('Filtered Recipes:', filteredRecipes);
                if (filteredRecipes.length === 0) {
                    messageContainer.textContent = `Il n'existe aucune recette avec "${query}". Essayez plutôt "tarte aux pommes".`;
                } else {
                    messageContainer.textContent = ''; // Effacer le message si des recettes sont trouvées
                }

                displayRecipes(filteredRecipes);

                // Appel à filterByType avec les recettes filtrées
                filterByType(filteredRecipes, displayRecipes, 'ingrédients'); 
                filterByType(filteredRecipes, displayRecipes, 'appareils');
                filterByType(filteredRecipes, displayRecipes, 'ustensiles');

            } else if (query.length === 0) {
                filteredRecipes = recipes; // Réinitialiser la liste des recettes filtrées
                messageContainer.textContent = ''; // Effacer le message
                displayRecipes(recipes);
                // Réinitialiser la liste des ingrédients si la recherche est vide
                filterByType(recipes, displayRecipes, 'ingrédients');
                filterByType(recipes, displayRecipes, 'appareils');
                filterByType(recipes, displayRecipes, 'ustensiles');
            }
        }, 300);
    });
}



async function filterByType(filteredRecipes, displayRecipes, type) {
    let wrapper = document.querySelector(`.${type}`); // Sélectionner le wrapper correct
    wrapper.innerHTML = ''; // Vider le wrapper

    const contentWrapper = document.createElement('ul');
    contentWrapper.classList.add(`${type}-content`);
    let allItems = new Set();

    // Remplir le Set avec les ingrédients, appareils ou ustensiles des recettes filtrées
    filteredRecipes.forEach(recipe => {
        if (type === 'ingrédients') {
            recipe.ingredients.forEach(item => {
                allItems.add(item.ingredient.trim().toLowerCase()); // Éliminer les espaces
            });
        } else if (type === 'appareils') {
            allItems.add(recipe.appliance.trim().toLowerCase()); // Éliminer les espaces
        } else if (type === 'ustensiles') {
            recipe.ustensils.forEach(item => {
                allItems.add(item.trim().toLowerCase()); // Éliminer les espaces
            });
        }
    });

    // Fonction pour afficher les items dans le DOM
    function displayItems(itemsList) {
        contentWrapper.innerHTML = '';

        itemsList.forEach(item => {
            let li = document.createElement('li');
            // prend la premiere lettre la mets en maj et colle le reste
            li.textContent = item.charAt(0).toUpperCase() + item.slice(1);  
            li.classList.add(`${type}-item`);

            // Écouteur d'événement pour chaque élément
            li.addEventListener('click', () => {
                console.log(`${type} sélectionné : ${item}`);
                let filteredByItem;

                // Filtrer les recettes contenant l'élément sélectionné
                if (type === 'ingrédients') {
                    filteredByItem = filteredRecipes.filter(recipe =>
                        recipe.ingredients.some(i => 
                            i.ingredient && i.ingredient.toLowerCase().trim() === item
                        )
                    );
                } else if (type === 'appareils') {
                    filteredByItem = filteredRecipes.filter(recipe =>
                        recipe.appliance.toLowerCase().trim() === item
                    );
                } else if (type === 'ustensiles') {
                    filteredByItem = filteredRecipes.filter(recipe =>
                        recipe.ustensils.some(i => i.toLowerCase().trim() === item)
                    );
                }

                // Ajouter la classe .clicked
                li.classList.add('clicked');

                // Afficher l'item cliqué dans le wrapper approprié
                const tagedelements = document.querySelector(`.tag-${type}`);
                if (tagedelements) {
                    // Vérifier si l'item n'est pas déjà dans le wrapper
                    const existingTags = Array.from(tagedelements.children).map(tag => tag.textContent.toLowerCase());
                    if (!existingTags.includes(item.toLowerCase().trim())) {
                        let tagLi = li.cloneNode(true);

                        // Écouteur pour retirer l'élément du tag lorsqu'il est cliqué
                        tagLi.addEventListener('click', () => {
                            tagedelements.removeChild(tagLi);

                            // Réintégrer l'élément dans la liste des items disponibles
                            allItems.add(item.toLowerCase().trim()); // Réajouter à allItems

                            // Mettre à jour la liste des items restants
                            displayItems(Array.from(allItems));

                            // Réafficher les recettes sans cet item
                            const remainingTags = Array.from(tagedelements.children).map(tag => tag.textContent.toLowerCase());
                            let filteredByRemainingTags = filteredRecipes;

                            // Filtrer en fonction des tags restants
                            remainingTags.forEach(tag => {
                                filteredByRemainingTags = filteredByRemainingTags.filter(recipe => {
                                    if (type === 'ingrédients') {
                                        return recipe.ingredients.some(i => i.ingredient.toLowerCase().trim() === tag);
                                    } else if (type === 'appareils') {
                                        return recipe.appliance.toLowerCase().trim() === tag;
                                    } else if (type === 'ustensiles') {
                                        return recipe.ustensils.some(i => i.toLowerCase().trim() === tag);
                                    }
                                });
                            });

                            // Afficher les recettes filtrées par les tags restants
                            displayRecipes(filteredByRemainingTags);
                        });

                        tagedelements.appendChild(tagLi);
                    }

                    // Retirer l'item sélectionné de la liste
                    allItems.delete(item.toLowerCase().trim()); // Retirer de allItems

                    // Mettre à jour la liste des items restants
                    displayItems(Array.from(allItems));
                }

                console.log(`Recettes filtrées par ${type}:`, filteredByItem);

                // Afficher les recettes filtrées par l'élément sélectionné
                displayRecipes(filteredByItem);
            });

            // Ajouter l'élément de la liste au conteneur
            contentWrapper.appendChild(li);
        });

        // Ajouter le conteneur dans le wrapper (si pas déjà fait)
        if (!wrapper.contains(contentWrapper)) {
            wrapper.appendChild(contentWrapper);
        }
    }

    // Afficher tous les items au départ
    displayItems(Array.from(allItems));

    // Ajouter un écouteur pour la barre de recherche des items
    const searchInput = document.querySelector(`.form-control-${type}`);

    searchInput.addEventListener('keyup', e => {
        const query = e.target.value.trim().toLowerCase();

        if (query.length >= 1) {
            const filteredItems = Array.from(allItems).filter(item => 
                item.includes(query)
            );

            // Afficher les items filtrés
            displayItems(filteredItems);
        } else {
            // Si la requête est vide, réafficher tous les items
            displayItems(Array.from(allItems));
        }
    });

    // Empêcher le repli du dropdown lors du clic sur un élément de la liste
    document.querySelectorAll('.dropdown').forEach(dropdown => {
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation();  // Empêche la fermeture automatique du dropdown
        });
    });
}

// Fonction d'initialisation pour le système de filtrage
export async function initFilterSystem(filteredRecipes, displayRecipes) {
    // Appel pour les ingrédients
    filterByType(filteredRecipes, displayRecipes, 'ingrédients');
    
    // Appel pour les appareils
    filterByType(filteredRecipes, displayRecipes, 'appareils');
    
    // Appel pour les ustensiles
    filterByType(filteredRecipes, displayRecipes, 'ustensiles');
}
