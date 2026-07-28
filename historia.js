const input=document.getElementById("pesquisa");
const sugestoesBox=document.getElementById("sugestoes");
const cards=document.querySelectorAll(".card");

const popup=document.getElementById("popup");
const fecharPopup=document.getElementById("fecharPopup");

const popupImagem=document.getElementById("popupImagem");
const popupTitulo=document.getElementById("popupTitulo");
const popupAutor=document.getElementById("popupAutor");
const popupDescricao=document.getElementById("popupDescricao");

let livroAtualPopup=null;

const livros=[...cards].map(card=>({
titulo:card.querySelector("h3").innerText,
autor:card.querySelector(".autor").innerText
}));


if(input){

input.addEventListener("input",()=>{

let valor=input.value.toLowerCase().trim();

sugestoesBox.innerHTML="";


if(valor===""){

sugestoesBox.style.display="none";

cards.forEach(card=>card.style.display="");

return;

}


let encontrados=livros.filter(livro=>
livro.titulo.toLowerCase().includes(valor)||
livro.autor.toLowerCase().includes(valor)
);


if(encontrados.length===0){

sugestoesBox.style.display="none";

return;

}


sugestoesBox.style.display="block";


encontrados.slice(0,5).forEach(livro=>{

let div=document.createElement("div");

div.className="item-sugestao";

div.innerText=`${livro.titulo} - ${livro.autor}`;


div.onclick=()=>{

input.value=livro.titulo;

sugestoesBox.style.display="none";

filtrarLivro(livro.titulo);

};


sugestoesBox.appendChild(div);


});


});


}



function filtrarLivro(texto){

let termo=texto.toLowerCase();


cards.forEach(card=>{


let titulo=card.querySelector("h3").innerText.toLowerCase();

let autor=card.querySelector(".autor").innerText.toLowerCase();


if(titulo.includes(termo)||autor.includes(termo)){

card.style.display="";

}else{

card.style.display="none";

}


});


}




document.querySelectorAll(".btnDetalhes").forEach(btn=>{


btn.addEventListener("click",e=>{


const card=e.currentTarget.closest(".card");


livroAtualPopup={

titulo:card.querySelector("h3").innerText,

autor:card.querySelector(".autor").innerText,

imagem:card.querySelector("img").src,

estado:card.querySelector(".estado").innerText,

descricao:"Livro disponível para reserva na Biblioteca Provincial de Pemba."

};



popupImagem.src=livroAtualPopup.imagem;

popupTitulo.innerText=livroAtualPopup.titulo;

popupAutor.innerText="Autor: "+livroAtualPopup.autor;

popupDescricao.innerText=livroAtualPopup.descricao;


popup.style.display="flex";


});


});



if(fecharPopup){

fecharPopup.onclick=()=>{

popup.style.display="none";

};

}

window.addEventListener("click",e=>{

if(e.target===popup){

popup.style.display="none";

}

});

document.querySelectorAll(".btnReservar").forEach(btn=>{
btn.addEventListener("click",e=>{
const card=e.currentTarget.closest(".card");
const livro={
titulo:card.querySelector("h3").innerText,
autor:card.querySelector(".autor").innerText,
imagem:card.querySelector("img").src,
estado:card.querySelector(".estado").innerText,
descricao:"Livro disponível para reserva na Biblioteca Provincial de Pemba."
};
localStorage.setItem("livroSelecionado",JSON.stringify(livro));
window.location.href="Requisitar livro.html";
});
});

const popupReservar=document.getElementById("popupReservar");

if(popupReservar){
popupReservar.addEventListener("click",()=>{
if(livroAtualPopup){
localStorage.setItem("livroSelecionado",JSON.stringify(livroAtualPopup));
}
});
}

document.querySelectorAll(".card").forEach(card=>{
const favorito=document.createElement("span");
favorito.className="favorito";
favorito.innerHTML="🤍";
card.appendChild(favorito);
favorito.onclick=e=>{
e.stopPropagation();
favorito.innerHTML=favorito.innerHTML==="🤍"?"❤️":"🤍";
};
});

const popupPagamento=document.getElementById("popupPagamento"),fecharPagamento=document.getElementById("fecharPagamento"),btnComprarPDF=document.getElementById("btnComprarPDF"),imagemPagamento=document.getElementById("imagemPagamento"),tituloPagamento=document.getElementById("tituloPagamento"),inputTelefone=document.getElementById("numeroPagamento"),btnConfirmar=document.getElementById("confirmarPagamento");
let metodoSelecionado="mpesa";

if(btnComprarPDF){
btnComprarPDF.onclick=()=>{
imagemPagamento.src=popupImagem.src;
tituloPagamento.innerText=popupTitulo.innerText;
popup.style.display="none";
popupPagamento.style.display="flex";
};
}

if(fecharPagamento){
fecharPagamento.onclick=()=>popupPagamento.style.display="none";
}

window.addEventListener("click",e=>{
if(e.target===popupPagamento)popupPagamento.style.display="none";
});

document.querySelectorAll('input[name="pagamento"]').forEach(r=>{
r.onchange=e=>metodoSelecionado=e.target.value;
});

function validarNumero(numero,metodo){
numero=numero.trim();
if(numero.length<9)return false;
if(metodo==="mpesa")return numero.startsWith("84")||numero.startsWith("85");
if(metodo==="emola")return numero.startsWith("86")||numero.startsWith("87");
return false;
}
if(btnConfirmar){
btnConfirmar.onclick=()=>{
let numero=inputTelefone.value;
inputTelefone.classList.remove("erroCampo");
if(!validarNumero(numero,metodoSelecionado)){
inputTelefone.classList.add("erroCampo");
alert("Número inválido para o método selecionado!");
return;
}
popupPagamento.style.display="none";
mostrarSucesso();
};
}

function mostrarSucesso(){
const box=document.createElement("div");
box.style.cssText="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);display:flex;justify-content:center;align-items:center;z-index:9999";
box.innerHTML=`<div style="background:#fff;padding:30px;border-radius:20px;text-align:center;width:360px"><h2 style="color:#119b73">✅ Compra Concluída</h2><p style="color:#555">Livro adicionado à sua biblioteca.</p><p><strong>${tituloPagamento.innerText}</strong></p><p>Método: ${metodoSelecionado.toUpperCase()}</p><button id="fecharSucesso" style="padding:10px 20px;background:#119b73;color:#fff;border:0;border-radius:10px">Continuar</button></div>`;
document.body.appendChild(box);
document.getElementById("fecharSucesso").onclick=()=>box.remove();
}