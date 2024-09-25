import { recipes } from '../../data/recipes.js'; 




// Fonction pour obtenir les données des recettes
export async function getData() {
    try {
        // Retourner les données des recettes
        return { recipes: recipes };
    } catch (error) {
        console.error("Erreur :", error);
        // En cas d'erreur, retourne un tableau vide pour éviter les erreurs en aval
        return { recipes: [] };
    }
}
