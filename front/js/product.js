
//La variable str qui contient l'URL de la page sur laquelle on se trouve
let str=window.location.href;

//La variable id qui utilise searchparams pour trouver la valeur de l'id dans l'URL.
var url = new URL(str);
var id = url.searchParams.get("id");

//Variable globale définie pour lui attribuer le nom de chaque article.
var name="";

/* fetch nous permettant de recuperer les données d'un produit depuis l'api pour l'afficher
dans la page produit
*/
fetch(API_URL+"/"+id)
.then(data=>data.json())
.then(json_list_Articles =>{
    document.querySelector(".item__img").innerHTML=` 
    <img src="${json_list_Articles.imageUrl}" alt="${json_list_Articles.altTxt}"></img>
    `
    name=document.querySelector("#title").innerHTML=json_list_Articles.name;
    document.querySelector("#price").innerHTML=json_list_Articles.price;
    document.querySelector("#description").innerHTML=json_list_Articles.description;
    for(let i of json_list_Articles.colors){
        document.querySelector("#colors").innerHTML+=`<option value="${i}">${i}</option>
        `}
    }
);

/*fonction qui sert a  enregistrer l'ensemble des produits selectionnés dans
le localstorage*/

function updateLocalstorage(id,color,quantity,name){
    var key = name + color;
    var element = {
        key: key.replace(" ", ""),
        name:name,
        id: id,
        color: color,
        quantity: quantity
    };

    let total=localStorage.setItem(name.replace(' ', '')+"__"+color+"__"+id,JSON.stringify(element));

    for (let i = 0; i < localStorage.length; i++){
        const key = localStorage.key(i)
        let product=JSON.parse(localStorage.getItem(key));
        if(product.id==id && product.color==color){
            let old_quantity=product.quantity;
            let new_quantity= parseInt(old_quantity)+parseInt(quantity);
            element.quantity=new_quantity;
        }
    }
}


//Eventlistener qui sert a ajouter un produit dans le panier

const button= document.getElementById("addToCart")
console.log(button);
if(button!=null){
    button.addEventListener("click", (e) =>{
        const color= document.querySelector("#colors").value;
        const quantity=document.querySelector("#quantity").value;
        if(color==null ||color===''|| quantity==null || quantity===''){
            alert("veuillez selectioner une couleur et une quantité")
            return;
        }
        if(quantity<=0){
            alert("veuillez entrer une quantité positive");
            return;
        }
        updateLocalstorage(id,color,quantity,name);
        window.location.href="cart.html";
    })
}



