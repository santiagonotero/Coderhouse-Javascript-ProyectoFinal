// Variable usada para calcular los ID de los envíos
let ultimoID=0;

// Este string contiene el listado de todas las encomiendas cargadas
// por el usuario
let listaEnvios=[];

const sectorPaquetes=document.getElementById('sectorPaquetes');
//const areaBotondePago=document.getElementById('areaBotonDePago');
const botonMP=document.getElementById('botonMP');

//Esta función sirve para mostrar el total de paquetes cargados 
//en la esquina superior derecha de la pantalla

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

function calculaTotalAPagar(){
    let precioTotal=listaEnvios.reduce( (acc, item)=>{
        acc += item.costoEnvio;
        return acc;
        }, 0);

        return precioTotal.toFixed(2);
}

function actualizarTotalAPagar(){
    const precioTotal=calculaTotalAPagar();

}


const areaListado = $('#areaListado');
const areaBotonDePago = $('#areaBotonDePago');

// Cargar en la página los artículos del carrito
if(localStorage.length > 0){

    let encomiendasCargadas =JSON.parse(localStorage.getItem('encomiendas'));
    if(encomiendasCargadas){
      listaEnvios = encomiendasCargadas;
    }
}

else{

    areaListado.append(`
    <div id="sinPaquetes" ></div>
    <div class="align-self-center" id="sinPaquetes" >No hay paquetes cargados</div>`);

}

actualizarTotalPaquetes();

// Ahora a exhibir los artículos cargados en la página

if(listaEnvios.length>0){

    let tipoEnvio='';
    let contrareembolsoSiNo='';
    let confronteSiNo='';
    let acuseSiNo='';

    for(let conta=0; conta <listaEnvios.length; conta++){

        if(listaEnvios[conta].esRegional===true){
            tipoEnvio='Regional';
        }
        else{
            tipoEnvio='Nacional';
        }

        if(listaEnvios[conta].avisoEnvio===true){
            acuseSiNo='Sí';
        }
        else{
            acuseSiNo='No';
        }

        if(listaEnvios[conta].conConfronte===true){
            confronteSiNo='Sí';
        }
        else{
            confronteSiNo='No';
        }

        if(listaEnvios[conta].conContrareembolso===true){
            contrareembolsoSiNo='Sí';
        }
        else{
            contrareembolsoSiNo='No';
        }

    areaListado.append(`<div id="filaDatos${conta+1}" class="row vertical-align-middle" style="vertical-align: middle;">
                                <div class="col-1"></div>
                                <div class="col-9 mb-3">
                                    <textarea readonly class="itemLista${conta+1}" id="areaTexto${conta+1}" style="min-width: 100%; box-sizing:initial; opacity: 0.9;" rows="3">
    CodigoID=${listaEnvios[conta].codigoID}      Largo=${listaEnvios[conta].largo}cm      Ancho=${listaEnvios[conta].ancho}cm      Alto=${listaEnvios[conta].ancho}cm
    Peso=${listaEnvios[conta].peso}Kg      Valor declarado= ARS${listaEnvios[conta].valorDeclarado}      Contrareembolso=${contrareembolsoSiNo}
    Acuse de recibo=${acuseSiNo}      Confronte=${confronteSiNo}      
                                    </textarea>
                                </div>
                                <div class="col-1 align-self-center">
                                    <button type="button" class="btn-sm itemLista${conta+1}" id="botonBorrar${conta+1}">Borrar</button>
                                </div>
                                <div class="row">
                                <div class="col-1"></div>
                                    <div class="col-4">
                                        <div><p>Valor del envío: ${listaEnvios[conta].costoEnvio.toFixed(2)}</p></div>
                                    </div>
                                </div>   
                            </div>`
        );

        $(`#botonBorrar${conta+1}`).on("click", function(){
            
            const itemID= listaEnvios.findIndex( elemento =>elemento.codigoID===(conta+1));

            //Hacemos un efecto de desvanecimiento del ítem
            $(`.itemLista${conta+1}`).fadeOut(400, ()=>{
                $(`#filaDatos${conta+1}`).slideUp(1000,"swing", ()=>{
                    if(listaEnvios.length==0){
                        $(`#areaBotonDePago`).slideUp(800, ()=>{
                            $(`#totalAPagar`).remove();
                            $(`#botonMP`).remove();
                            $(`#filaBotonMP`).remove();
                            $(`#areaBotonDePago`).append(`<div id="sinPaquetes" ></div>
                            <div class="align-self-center" id="sinPaquetes" >No hay paquetes cargados</div>`);
                            $(`#areaBotonDePago`).slideDown(800);
                        });
                    }
                    $(`#filaDatos${conta+1}`).remove(); // Borra la fila con la info del envío
                });
            });

            listaEnvios.splice(itemID,1);
            localStorage.setItem('encomiendas', JSON.stringify(listaEnvios));
            $(`#totalAPagar`).empty();
            $(`#totalAPagar`).append(`<div class="col-1"></div>
            <div class="col-8" style="padding: 20px;"><h4>Total a pagar: ARS${calculaTotalAPagar()} </h4></div>`
            );
            actualizarTotalPaquetes();   
        });
    }

    let precioTotal=calculaTotalAPagar();

    areaBotonDePago.append(`
        <div class="row" id="totalAPagar">
            <div class="col-1"></div>
            <div class="col-8" style="padding: 20px;"><h4>Total a pagar: ARS${precioTotal} </h4></div>
        </div>
        <div class="row" id="filaBotonMP" style="padding: 20px;">
            <div class="col-4"></div>
            <div class="col-4">
                <a href="pago.html">
                    <button class="btn btn-primary" id="botonMP">Pagar con Mercado Pago</button>
                </a>
            </div>
        </div>
    `)
}

else{
    areaListado.innerHTML='';
    areaListado.append(`
    <div id="sinPaquetes" ></div>
    <div class="align-self-center" id="sinPaquetes" >No hay paquetes cargados</div>`
    );
}