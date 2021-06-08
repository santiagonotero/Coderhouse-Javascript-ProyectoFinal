
let costoRegional = [];
let costoNacional = [];


const URL = './Server/datosServidor.json'

//Leer de la base de datos
$.get(URL, function (data, status) {
        if(status==='success'){
            let stringAuxiliar=data.map(el => parseInt(el.PrecioRegional));
            costoRegional=stringAuxiliar;
            stringAuxiliar=data.map(el => parseInt(el.PrecioNacional));
            costoNacional=stringAuxiliar;
        }
    }, "json"
);

// Variable usada para calcular los ID de los envíos
let ultimoID=0;

// Este string contiene el listado de todas las encomiendas cargadas
// por el usuario
let listaEnvios = [];

//Definimos la clase Encomienda, que contendrá la información de cada envío
class Encomienda{

    constructor (largo, ancho, alto, peso, valorDeclarado) {

        this.codigoID = 0;
        this.largo = largo;
        this.ancho = ancho;
        this.alto = alto;
        this.peso = peso;
        this.valorDeclarado = valorDeclarado;
        this.costoEnvio;
        this.pesoUsado = 0;
        this.valorSeguro=0;
        this.valorContrareembolso=0;
        this.categoriaPeso;
        this.avisoEnvio = false;
        this.conConfronte = false;
        this.esRegional = false;
        this.conContrareembolso = false;
    }
    EstablecePesoUsado (){

        //Se calcula el peso volumétrico como (largo x ancho x alto)/6000.
        //Luego se compara este peso con el declarado, y se utiliza el mayor
        // de los dos para determinar el costo del envío.
    
        let pesoVolumetrico = (this.largo * this.ancho * this.alto)/6000;

        if((this.peso) >= pesoVolumetrico){
            
            this.pesoUsado = this.peso;
        }
        else {
            this.pesoUsado = pesoVolumetrico;
        }
    }

    CostoPorDistancia(){

    //Primero tenemos que ver en qué categoría de peso cae la encomienda. 
    //A partir de ahora pesoUsado se va a convertir en un índice para 
    //acceder a los valores de pesoRegional y pesoNacional.

       if(this.pesoUsado <= 1){      // Menor a 1 Kg
        this.categoriaPeso =0;
        }
        else if(this.pesoUsado > 1 && this.pesoUsado <= 5){      // Entre 1 y 5 Kg
            this.categoriaPeso = 1;
        }
        else if(this.pesoUsado > 5 && this.pesoUsado <= 10){      // Entre 5 y 10 Kg
            this.categoriaPeso = 2;
         }
        else if(this.pesoUsado > 10 && this.pesoUsado <= 15){     // Entre 10 y 15 Kg
            this.categoriaPeso = 3;
        }
        else if(this.pesoUsado > 15 && this.pesoUsado <= 20){     // Entre 15 y 20 Kg
            this.categoriaPeso = 4;
        }
        else{
            this.categoriaPeso = 5;
        }
        if(esRegional.value == true){      // Envío Regional

            this.costoEnvio= costoRegional[this.categoriaPeso];
        }
        else{       // Costo Nacional

            this.costoEnvio = costoNacional[this.categoriaPeso];
        }
    }
}


let nuevaEncomienda;

//Definimos las variables que van a actuar con el HTML

const formulario=document.getElementById('formulario');
const largoPaquete= document.getElementById('formLargo');
const anchoPaquete= document.getElementById('formAncho');
const altoPaquete= document.getElementById('formAlto');
const pesoPaquete = document.getElementById('formPeso');
const valorDeclarado=document.getElementById('formValor');
const esRegional=document.getElementById('formRegional');
const conAcuse=document.getElementById('formAcuse');
const conConfronte=document.getElementById('formConfronte');
const conContrareembolso=document.getElementById('formContrareembolso');
const detallesCosto=document.getElementById('listaResultados');
const botonCalcularCosto=document.getElementById('botonCalcularCosto')
const numeroPaquetes=document.getElementById('cantPaquetes');
const sectorPaquetes=document.getElementById('sectorPaquetes');
const errorLargo=document.getElementById('errorLargo');
const errorAncho=document.getElementById('errorAncho');
const errorAlto=document.getElementById('errorAlto');
const erroPeso=document.getElementById('errorPeso');
const errorValor=document.getElementById('errorValor');
let infoPaquetes;
let botonAgregar;
let botonBorrar;

//Esta función sirve para mostrar el total de paquetes cargados 
//en la esquina superior derecha de la pantalla

function actualizarTotalPaquetes(){

    sectorPaquetes.innerHTML=`<p id="infoPaquetes" style="text-decoration: underline; cursor: default;" onmouseover="resaltarPaquetes(true)" onmouseout="resaltarPaquetes(false)" onclick="location.href='carrito.html'">Paquetes: ${listaEnvios.length}</p>`
    infoPaquetes=document.getElementById("infoPaquetes");
}

// Con estas funciones modificamos la apariencia del texto "Paquetes: #" cuando se posa el mouse encima

function resaltarPaquetes(condicion){

    if(condicion===true){
        infoPaquetes.style="cursor: pointer; color: red; text-decoration: underline;";
    }

    else{
        infoPaquetes.style="cursor: default; color: default; text-decoration: underline;";
    }
}

//Esta función sirve para cargar ítems en la lista de resultados finales

function CargarItemLista(texto1, texto2, esResultado){

    if(!esResultado){
        detallesCosto.innerHTML+=`<div class=row>
        <div class="col-1"></div>
        <div class="col-4" style="text-align: initial;">${texto1}</div>
        <div class="col-3" style="text-align: end;">${texto2}</div>
        </div>`;
    }
    else{
        detallesCosto.innerHTML+=`<div class=row>
        <div class="col-1"></div>
        <div class="col-4" style="text-align: initial; "><h5>${texto1}</h5></div>
        <div class="col-3" style="text-align: end; background-color: lightgrey;"><h5>${texto2}</h5></div>
        </div>`;
    }
}

function ponerBotonCarrito(detallesCosto){

    let itemLista=document.createElement('li');
    let nodoCol1=document.createElement('col-6');
    let boton = document.createElement('button');
    let textoBoton=document.createTextNode('Ir al carrito');
    boton.class="btn btn-primary";
    boton.appendChild(textoBoton);
    nodoCol1.appendChild(boton);
    itemLista.appendChild(nodoCol1);
    detallesCosto.appendChild(itemLista);
}

function agregarAlCarrito(nuevaEncomienda){

    console.log(`ultimoID:${ultimoID}`);
    console.log(`nuevaEncomienda:${nuevaEncomienda}`);
    listaEnvios.push(nuevaEncomienda);
    localStorage.setItem('encomiendas', JSON.stringify(listaEnvios));
    console.log(listaEnvios.length);
    actualizarTotalPaquetes();
    borrarFormulario();
}

function borrarFormulario(){

    largoPaquete.value='';
    anchoPaquete.value='';
    altoPaquete.value='';
    pesoPaquete.value='';
    valorDeclarado.value='';
    conAcuse.checked=false;
    conContrareembolso.checked=false;
    esRegional.value=-1;
    conConfronte.checked=false;
    detallesCosto.innerHTML='';
}

// Vamos a buscar en LocalStorage si hay envíos ya cargados.
// En caso afirmativo actualizamos la lista listaEnvios.

if(localStorage.length > 0){

    let encomiendasCargadas =JSON.parse(localStorage.getItem('encomiendas'));
    if(encomiendasCargadas){
        listaEnvios = encomiendasCargadas;
        ultimoID=listaEnvios.reduce((acc, ele)=>{
            if(ele.codigoID>acc){
                acc=ele.codigoID;
            }
            return acc;
        },0);
        console.log(ultimoID);
    }
}

actualizarTotalPaquetes();

// Definimos una función que detecta cuando se hace clic
// en el botón enviar

botonCalcularCosto.addEventListener("click", calcularCosto);

function calcularCosto(event){

    let faltanDatos=false;

    event.preventDefault();

    if(largoPaquete.value<=0 || largoPaquete.value==''){
        errorLargo.innerHTML=`<p style="color: red;"><- Es necesario completar bien este campo</p>`;
        faltanDatos=true;
    }
    else{
        errorLargo.innerHTML='';
    }
    if(anchoPaquete.value<=0 || anchoPaquete.value==''){
        errorAncho.innerHTML=`<p style="color: red;"><- Es necesario completar bien este campo</p>`;
        faltanDatos=true;
    }
    else{
        errorAncho.innerHTML='';
    }
    if(altoPaquete.value<=0 || altoPaquete.value==''){
        errorAlto.innerHTML=`<p style="color: red;"><- Es necesario completar bien este campo</p>`;
        faltanDatos=true;
    }
    else{
        errorAlto.innerHTML='';
    }
    if(pesoPaquete.value<=0 || pesoPaquete.value==''){
        errorPeso.innerHTML=`<p style="color: red;"><- Es necesario completar bien este campo</p>`;
        faltanDatos=true;
    }
    else{
        errorPeso.innerHTML='';
    }
    if(valorDeclarado.value<=0 || valorDeclarado.value==''){
        errorValor.innerHTML=`<p style="color: red;"><- Es necesario completar bien este campo</p>`;
        faltanDatos=true;
    }
    else{
        errorValor.innerHTML='';
    }
    if(esRegional.value==-1){
        errorRegional.innerHTML=`<p style="color: red;"><- Selecciona tipo de envío</p>`;
        faltanDatos=true;
    }
    else{
        errorRegional.innerHTML='';
    }
    if(!faltanDatos){

        errorLargo.innerHTML=errorAncho.innerHTML=errorAlto.innerHTML=errorPeso.innerHTML=errorValor.innerHTML='';
        nuevaEncomienda = new Encomienda(largoPaquete.value, anchoPaquete.value, altoPaquete.value, pesoPaquete.value, valorDeclarado.value);
        detallesCosto.innerHTML='';

        //A nuestra nueva encomienda le asignamos un nuevo valor de ID

        ultimoID++;
        nuevaEncomienda.codigoID=ultimoID;

        //Comparamos el peso declarado con el peso volumétrico, y nos 
        // quedamos con el mayor

        nuevaEncomienda.EstablecePesoUsado();

        //Ahora preguntamos si es envío regional o nacional, porque de eso depende el costo
        //primero sumamos el costo según el peso y la distancia

        nuevaEncomienda.CostoPorDistancia();
        CargarItemLista('Costo por distancia=', 'ARS '+ nuevaEncomienda.costoEnvio.toFixed(2), false);
        console.log(nuevaEncomienda.costoEnvio)
        //Se adiciona el seguro en base al valor declarado. 

        if(nuevaEncomienda.valorDeclarado <= 1000){

            nuevaEncomienda.valorSeguro = 30;       // Si el valor es hasta 1000 pesos, el seguro es de 30.
            nuevaEncomienda.valorSeguro.toFixed(2);
        }
        
        // Si el valor excede los 1000 pesos, el seguro es un 3% del valor declarado
        
        else{
            nuevaEncomienda.valorSeguro= parseFloat((nuevaEncomienda.valorDeclarado * 0.03).toFixed(2));
        }

        nuevaEncomienda.costoEnvio +=nuevaEncomienda.valorSeguro;
        CargarItemLista('Seguro=', 'ARS '+ nuevaEncomienda.valorSeguro, false);


        // Se ofrece servicio de aviso de recibo por 230 pesos

        if(conAcuse.checked===true){

            nuevaEncomienda.avisoEnvio=true;
            nuevaEncomienda.costoEnvio += 230;
            nuevaEncomienda.costoEnvio.toFixed(2);
            CargarItemLista('Acuse de recibo=', 'ARS 230.00', false);
        }

        // Se ofrece servicio de confronte y sellado por envío por 670 pesos

        if(conConfronte.checked===true){

            nuevaEncomienda.conConfronte=true;
            nuevaEncomienda.costoEnvio += 670;
            nuevaEncomienda.costoEnvio.toFixed(2);
            CargarItemLista('Servicio de Confronte=', 'ARS 670.00', false);
        }

        // Se ofrece servicio contrareembolso. 
        // Si el valor declarado es hasta 1500 pesos, el servicio cuesta 75 pesos.
        // Si el valor declarado excede los 1500 pesos, el servicio es un 5% del valor declarado

        if(conContrareembolso.checked===true){
            nuevaEncomienda.conContrareembolso=true;

            if(valorDeclarado.value <= 1500){
                nuevaEncomienda.valorContrareembolso = 75;
                nuevaEncomienda.valorContrareembolso.toFixed(2);
            }
            else{
                nuevaEncomienda.valorContrareembolso = parseFloat(nuevaEncomienda.valorDeclarado * 0.05);
            }
            nuevaEncomienda.costoEnvio += nuevaEncomienda.valorContrareembolso;
            CargarItemLista('Contrareembolso=', 'ARS '+ nuevaEncomienda.valorContrareembolso.toFixed(2), false);
        }
        else{
            nuevaEncomienda.conContrareembolso=false;
        }
        detallesCosto.innerHTML+=`<div class=row>
        <div class="col-1"></div>
        <div class="col-4" style="text-align: initial; padding: 0px;"><hr size="4px" color="black" style="opacity: 1"></div>
        <div class="col-3" style="text-align: end; padding: 0px;"><hr size="4px" color="black" style="opacity: 1"></div>
        </div>`;
        //CargarItemLista('-------------------------------------', '----------------', detallesCosto);
        CargarItemLista('TOTAL ENVÍO=', 'ARS ' + nuevaEncomienda.costoEnvio.toFixed(2), true);

        botonAgregar= document.getElementById('botonAgregar');
        botonBorrar= document.getElementById('botonBorrar');

        detallesCosto.innerHTML += `<div class="row justify-content-center">
        <div class="col-4" style="margin-bottom: 20px; margin-top: 20px; padding: 0px; align-items: right;">
            <button class="btn btn-primary" id="botonAgregar" onclick="agregarAlCarrito(nuevaEncomienda)">Agregar al carrito</button>
        </div>
        <div class="col-3" style="margin-bottom: 20px; margin-top: 20px; padding: 0px;">
            <button class="btn btn-primary" id="botonBorrar" onclick="borrarFormulario()">Borrar todo</button>
        </div></div>`;
    }
}


