//URL de Mercado Pago
const urlMP='https://api.mercadopago.com';

const sectorPaquetes=document.getElementById('sectorPaquetes');
const totalAPagar= document.getElementById('totalAPagar');
const botonPago= document.getElementById('botonPago');

function actualizarTotalPaquetes(){

    sectorPaquetes.innerHTML=`<p id="infoPaquetes" style="text-decoration: underline; cursor: default;" onmouseover="resaltarPaquetes(true)" onmouseout="resaltarPaquetes(false)" onclick="location.href='carrito.html'">Paquetes: ${listaEnvios.length}</p>`   
    let infoPaquetes=document.getElementById("infoPaquetes");

}
function resaltarPaquetes(condicion){

    if(condicion===true){
        infoPaquetes.style="cursor: pointer; color: red; text-decoration: underline;";
    }
    else{
        infoPaquetes.style="cursor: default; color: default; text-decoration: underline;";
    }
}

function comunicarseConMP(){

    const datosParaEnviar= listaEnvios.map((elemento)=>({
        title: `Encomienda #${elemento.codigoID}`,
        description: 'Encomienda despachada por Pakenvío',
        picture_url: "",
        category_id: "",
        quantity: 1,
        currency_id: "ARS",
        unit_price: elemento.costoEnvio
    }));

console.log(datosParaEnviar);
    fetch('https://api.mercadopago.com/checkout/preferences', {
                method: "POST",
                headers:{
                    Authorization: 'Bearer TEST-6685919565679128-060721-31bb1bf7b720db9a3fcab6d1131a7758-58985210'
                },
                body: JSON.stringify({
                    items: datosParaEnviar
                })
    })
    .then((resp)=>resp.json())
    .then((data)=>{
        console.log(data);
        window.open(data.init_point, "_blank");
    })
}

let listaEnvios=JSON.parse(localStorage.getItem('encomiendas'));
let importe= listaEnvios.reduce((acc, item)=>{
    acc += item.costoEnvio;
    return acc;
    }, 0);

importe=importe.toFixed(2);
console.log(importe);

actualizarTotalPaquetes();

totalAPagar.innerHTML=`<text><h4>Total a pagar: ${importe} ARS</h4></text>`;

botonPago.addEventListener("click",comunicarseConMP);
