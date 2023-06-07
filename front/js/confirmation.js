//fonction nous permettant de récupérer le numéro de commande
function getOrderId(){
    const confirmationLocation=window.location.search;
    const urlParams= new URLSearchParams(confirmationLocation);
    return urlParams.get("orderId");
}

const orderId= getOrderId();

//fonction nous permettant d'afficher le numéro de commande
function displayOrderId(orderId){
    const orderIdElement= document.getElementById("orderId");
    orderIdElement.textContent=orderId;
}

//fonction nous permettant de vider le localstorage une fois la commande validée.
function clearCache(){
    const cache=window.localStorage;
    cache.clear()
}

displayOrderId(orderId);
clearCache();