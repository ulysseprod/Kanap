class Article{
    constructor(jsonArticle){
        jsonArticle && Object.assign(this,jsonArticle)
    }
}

// Récupération des produits présents dans l'API et son affichage sur la page d'accueil.
fetch(API_URL)
    .then(data=>data.json())
    .then(json_list_Articles =>{
        for(let jsonArticle of json_list_Articles){
            let article= new Article(jsonArticle);
            document.querySelector(".items").innerHTML+=
                                              ` 
                                               <a href="./product.html?id=${article._id}">
                                           <article>
                                               <img src="${article.imageUrl}" alt="${article.altTxT}">
                                               <h3 class="productName">${article.name}</h3>
                                               <p class="productDescription">${article.description}</p>
                                           </article>
                                           </a>`
        }
    });
    