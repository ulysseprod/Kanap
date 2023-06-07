
//Fonctions nous permettant de trier les produits du localstorage
function sortCart(){
    let cartObject = [];
    Object.keys(localStorage).forEach(function(key){
    cartObject.push(JSON.parse(localStorage.getItem(key)));
});
    let sortedCart = cartObject.sort(compare);
    return sortedCart;
}

function compare( a, b ) {
    if ( a.key < b.key ){
        return -1;
    }
    if ( a.key > b.key ){
        return 1;
    }
    return 0;
}

let sortedProducts=sortCart();
let cart=[];

for (let index in sortedProducts) {
    let product = sortedProducts[index];
    cart.push(product)

    fetch("http://localhost:3000/api/products"+"/"+product.id)
        .then(data=>data.json())
        .then(json_list_Articles =>{
            //Recuperation de la classe parente
            const Sofa_Articles=document.getElementById('cart__items');

            //creation de la div contenant les datasets.
            const sofaDatas=document.createElement('article');
            sofaDatas.classList.add("cart__item");
            sofaDatas.dataset.id=product.id;
            sofaDatas.dataset.color=product.color;
            Sofa_Articles.appendChild(sofaDatas);

            //creation de la div "cart__item__img" 
            const sofaImgDiv=document.createElement('div');
            sofaImgDiv.classList.add("cart__item__img");

            let sofaImg=document.createElement('img');
            sofaImg.setAttribute("src",json_list_Articles.imageUrl);
            sofaImg.setAttribute("alt",json_list_Articles.altTxt);
            sofaImgDiv.appendChild(sofaImg);

            sofaDatas.appendChild(sofaImgDiv);

            //creation de la div "cart__item__content"
            const sofaDescriptionDiv=document.createElement('div');
            sofaDescriptionDiv.classList.add("cart__item__content");

            const sofaDescription=document.createElement('div');
            sofaDescription.classList.add("cart__item__content__description");
            sofaDescriptionDiv.appendChild(sofaDescription);

            let sofaName=document.createElement('h2');

            sofaName.innerText=json_list_Articles.name;
            let sofaColor=document.createElement('p');
            sofaColor.innerText=product.color;
            let sofaPrice=document.createElement('p');
            sofaPrice.setAttribute('id', 'itemPricing_' + product.id + "_" + product.color)
            sofaPrice.dataset.price=json_list_Articles.price;
            sofaPrice.innerText=json_list_Articles.price+'€';

            sofaDescription.appendChild(sofaName);
            sofaDescription.appendChild(sofaColor);
            sofaDescription.appendChild(sofaPrice);
            sofaDatas.appendChild(sofaDescriptionDiv);

            //creation de la div "cart__item__content__settings"
            const sofaSettingsDiv=document.createElement('div');
            sofaSettingsDiv.classList.add("cart__item__content__settings");

            const sofaQuantity=document.createElement('div');
            sofaQuantity.classList.add('cart__item__content__settings__quantity');
            sofaSettingsDiv.appendChild(sofaQuantity);


            const quantityParagraph = document.createElement('p')
            quantityParagraph.innerText = `Qté: ${JSON.parse(product.quantity)}`
            sofaQuantity.appendChild(quantityParagraph)

            const quantityInput = document.createElement('input')
            quantityInput.type = 'number'
            quantityInput.classList.add('itemQuantity')
            quantityInput.name = 'itemQuantity'
            quantityInput.min = '1'
            quantityInput.max = '100'
            quantityInput.setAttribute('value',product.quantity);
            sofaQuantity.appendChild(quantityInput)

            /*EventListener nous permettant d'observer le changement de quantité d'un produit
            et d'actualiser le prix total en fonction des changements.*/
            
            quantityInput.addEventListener('change', function () {
                if(quantityInput.value<=0){
                    alert("Veuillez entrer une quantité positive");
                    quantityInput.value=1;
                }
                product.quantity = quantityInput.value
                quantityParagraph.innerText = `Qté: ${JSON.parse(product.quantity)}`
                SaveQuantityToCache(product);
                displayTotalPrice();
                displayTotalQuantity();
            })

            //Creation de la div "cart__item__content__settings__delete"
            const deleteSofa=document.createElement('div');
            deleteSofa.classList.add('cart__item__content__settings__delete');
            let deletebtn=document.createElement('p');
            deletebtn.classList.add('deleteItem');
            deletebtn.innerText='Supprimer';


            deleteSofa.appendChild(deletebtn);
            sofaSettingsDiv.appendChild(deleteSofa);
            sofaDatas.appendChild(sofaSettingsDiv);

            /*EventListener nous permettant d'observer la suppression  d'un produit
            et d'actualiser le prix total en fonction des changements.*/
            
            deletebtn.addEventListener("click", (e) =>{
                sofaDatas.remove();
                DeleteSofaFromCache(product);
                window.location.reload();
            })
        })

    displayTotalPrice();
    displayTotalQuantity();
};


//fonction nous permettant d'afficher le prix total des produits.
function displayTotalPrice(){
    let elementPrice = 0;
    const initialPricing = 0;
    let totalPricing = [];
    let finalPricing = 0;
    document.getElementById('totalPrice').innerText = '0';

    for (let product of cart) {
        let elementQuantity = product.quantity;

        fetch('http://localhost:3000/api/products/' + product.id)
            .then(
                (response) => {
                    return response.json();
                }
            )
            .then((data) => {
                elementPrice = data.price * elementQuantity
                totalPricing.push(elementPrice)
                finalPricing = totalPricing.reduce((previousValue, currentValue) => previousValue + currentValue, initialPricing)
                document.getElementById('totalPrice').innerHTML = finalPricing
            })
    }
}

//fonction nous permettant d'afficher la quantité total des produits.
function displayTotalQuantity()
{
    let totalQuantity = [];
    let finalQuantity = 0;
    let finalQuantityEl = document.getElementById('totalQuantity');
    finalQuantityEl.innerText = '0';

    for (let product of cart) {
        let productQuantity = product.quantity
        totalQuantity.push(productQuantity)
        finalQuantity = totalQuantity.reduce((preValue, curValue) => parseInt(preValue) + parseInt(curValue))
        document.getElementById('totalQuantity').innerHTML = finalQuantity
    }
}

/*fonction nous permettant de modifier la quantité d'un produit a l'interieur du
localstorage*/

function SaveQuantityToCache(product){
    const dataToSave=JSON.stringify(product);
    const key=`${(product.name).replace(' ', '')}__${product.color}__${product.id}`;
    localStorage.setItem(key,dataToSave);
}

/*fonction nous permettant de supprimer un produit a l'intérieur du localstorage*/
function DeleteSofaFromCache(product){
    const key=`${(product.name).replace(' ', '')}__${product.color}__${product.id}`;
    localStorage.removeItem(key);
}


//La partie formulaire

/*eventlistener qui nous redirige vers la page confirmation une fois que les données de
l'utilisateur ont été validées.
*/
const orderButton=document.querySelector("#order");
orderButton.addEventListener("click", (e) => submitForm(e))

/*Fonction qui vérifie si l'ensemble des données entrées par l'utilisateur sont correctes
et qui demande une réponse au serveur en prenant en compte les données contenues dans le corp
de la requète http.*/

function submitForm(e){
    e.preventDefault();
    if (isFormInvalid()) return;
    if (isEmailInvalid()) return;
    if (isNameAndSurnameInvalid()) return;
    const body=makeRequest();
    fetch("http://localhost:3000/api/products/order",{
        method:"POST",
        body: JSON.stringify(body),
        headers:{
            "Content-type": "application/json"
        }
    })
        .then((response)=>response.json())
        .then((data)=>{
            const orderId=data.orderId;
            window.location.href="confirmation.html?orderId="+orderId;
            return console.log(data);
        })
        .catch((err)=>console.log(err));
}

//fonction qui vérifie si l'utilisateur a rempli l'ensemble des champs du formulaire.
function isFormInvalid(){
    const form=document.querySelector(".cart__order__form");
    const inputs=form.querySelectorAll("input");
    inputs.forEach((input)=>{
        if (input.value===""){
            alert("Merci de remplir ce champ");
            return true
        }
        return false
    })
}

/*fonction qui vérfie si le champs <email> du formulaire a été entré 
correctement par l'utilisateur.*/

function isEmailInvalid(){
    const email=document.querySelector("#email").value;
    const regex=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(regex.test(email)===false){
        alert("veuillez entrer un email valide")
        return true;
    }
    return false;
}

/*fonction qui vérfie si l'utilisateur a entré un nom et un prénom valide dans les champs
<nom> et <prénom> du formulaire.
*/
function isNameAndSurnameInvalid(){
    const firstName=document.querySelector("#firstName").value;
    const lastName=document.querySelector("#lastName").value;
    let regName = /^[A-Za-z]+$/;
    if(regName.test(firstName)===false || regName.test(lastName)==false){
        alert("veuillez entrer votre prénom et/ou votre nom de nouveau")
        return true;
    }
    return false;
}

/*fonction qui contient l'objet contact et le tableau des produits, ceux-ci constituant
le corp de la requète http. 
*/
function makeRequest(){
    const form=document.querySelector(".cart__order__form");
    const firstName= form.elements.firstName.value;
    const lastName= form.elements.lastName.value;
    const address= form.elements.address.value;
    const city= form.elements.city.value;
    const email= form.elements.email.value;

    const body={
        contact:{
            firstName: firstName,
            lastName: lastName,
            address: address,
            city: city,
            email: email
        },
        products:getIdsFromStorage()
    }
    return body;
}

//Fonction qui récupère les ids du localstorage pour les mettre dans un tableau
function getIdsFromStorage(){
    const ids=[];
    for(let i=0; i<localStorage.length; i++){
        const key=localStorage.key(i);
        const id=key.split('__')[2];
        ids.push(id);
    }
    return ids;
}

 