document.addEventListener("DOMContentLoaded",()=>{

const abrir=document.getElementById("abrirDefinicoes");
const modal=document.getElementById("modalDefinicoes");
const fechar=document.getElementById("fecharDefinicoes");

if(abrir&&modal&&fechar){
abrir.onclick=()=>modal.classList.add("show");
fechar.onclick=()=>modal.classList.remove("show");
window.onclick=e=>{
if(e.target===modal)modal.classList.remove("show");
};
}

const sair=document.getElementById("btnSair");

if(sair){
sair.onclick=e=>{
if(!confirm("Deseja realmente sair da plataforma?")){
e.preventDefault();
}
};
}

document.querySelectorAll(".livros>div").forEach(livro=>{
livro.onclick=()=>{
livro.animate([
{transform:"scale(1)"},
{transform:"scale(.95)"},
{transform:"scale(1)"}
],{
duration:250
});
};
});

document.querySelectorAll(".categoria-caixa").forEach(categoria=>{
categoria.onclick=()=>{
categoria.animate([
{transform:"scale(1)"},
{transform:"scale(.94)"},
{transform:"scale(1)"}
],{
duration:180
});
};
});

const reservar=document.querySelector(".btn-reservar");

if(reservar){
reservar.onmouseenter=()=>{
reservar.style.transform="scale(1.08)";
};
reservar.onmouseleave=()=>{
reservar.style.transform="scale(1)";
};
}
const menu=document.querySelector(".menu");
const overlay=document.getElementById("overlay");
const abrirMenu=document.getElementById("abrirMenu");

function abrir(){
menu.classList.add("ativo");
overlay.classList.add("ativo");
document.body.style.overflow="hidden";
}

function fechar(){
menu.classList.remove("ativo");
overlay.classList.remove("ativo");
document.body.style.overflow="auto";
}

abrirMenu.addEventListener("click",abrir);

overlay.addEventListener("click",fechar);

document.addEventListener("keydown",function(e){
if(e.key==="Escape"){
fechar();
}
});

setTimeout(()=>{
alert("📚 Bem-vindo à Biblioteca Digital Inteligente de Pemba!");
},600);

});
