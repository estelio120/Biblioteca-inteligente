
const input = document.getElementById("pesquisa");
const sugestoesBox = document.getElementById("sugestoes");
const cards = document.querySelectorAll(".card");

let livros = Array.from(cards).map(card => ({
    titulo: card.querySelector("h3").innerText,
    autor: card.querySelector(".autor").innerText
}));

if (input) {

    input.addEventListener("input", () => {

        let valor = input.value.toLowerCase().trim();

        sugestoesBox.innerHTML = "";

        if (valor === "") {
            sugestoesBox.style.display = "none";
            cards.forEach(c => c.style.display = "");
            return;
        }

        let encontrados = livros.filter(livro =>
            livro.titulo.toLowerCase().includes(valor) ||
            livro.autor.toLowerCase().includes(valor)
        );

        if (encontrados.length === 0) {
            sugestoesBox.style.display = "none";
            return;
        }

        sugestoesBox.style.display = "block";

        encontrados.slice(0, 5).forEach(livro => {

            let div = document.createElement("div");
            div.className = "item-sugestao";

            div.innerText = `${livro.titulo} - ${livro.autor}`;

            div.onclick = function () {
                input.value = livro.titulo;
                sugestoesBox.style.display = "none";
                filtrarLivro(livro.titulo);
            };

            sugestoesBox.appendChild(div);
        });

    });
}

function filtrarLivro(texto) {

    let termo = texto.toLowerCase();

    cards.forEach(card => {

        let titulo = card.querySelector("h3").innerText.toLowerCase();
        let autor = card.querySelector(".autor").innerText.toLowerCase();

        if (titulo.includes(termo) || autor.includes(termo)) {
            card.style.display = "";
        } else {
            card.style.display = "none";
        }

    });
}



const popup = document.getElementById("popup");
const fecharPopup = document.getElementById("fecharPopup");

const popupImagem = document.getElementById("popupImagem");
const popupTitulo = document.getElementById("popupTitulo");
const popupAutor = document.getElementById("popupAutor");
const popupDescricao = document.getElementById("popupDescricao");

document.querySelectorAll(".btnDetalhes").forEach(btn => {

    btn.addEventListener("click", (e) => {

        const card = e.currentTarget.closest(".card");

        const img = card.querySelector("img");
        const titulo = card.querySelector("h3");
        const autor = card.querySelector(".autor");

        popupImagem.src = img.src;
        popupTitulo.innerText = titulo.innerText;
        popupAutor.innerText = "Autor: " + autor.innerText;

        popupDescricao.innerText =
            "Livro disponível para reserva na Biblioteca Provincial de Pemba.";

        popup.style.display = "flex";
    });

});

if (fecharPopup) {
    fecharPopup.addEventListener("click", () => {
        popup.style.display = "none";
    });
}

window.addEventListener("click", (e) => {
    if (e.target === popup) {
        popup.style.display = "none";
    }
});



document.querySelectorAll(".btnReservar").forEach(btn => {

    btn.addEventListener("click", (e) => {

        const card = e.currentTarget.closest(".card");

        let livro = {
            titulo: card.querySelector("h3").innerText,
            autor: card.querySelector(".autor").innerText,
            imagem: card.querySelector("img").src,
            estado: card.querySelector(".estado").innerText
        };

        localStorage.setItem("livroSelecionado", JSON.stringify(livro));

        window.location.href = "Requisitar livro.html";

    });

});



document.querySelectorAll(".card").forEach(card => {

    let favorito = document.createElement("span");
    favorito.className = "favorito";
    favorito.innerHTML = "🤍";

    card.appendChild(favorito);

    favorito.addEventListener("click", (e) => {
        e.stopPropagation();

        favorito.innerHTML = favorito.innerHTML === "🤍" ? "❤️" : "🤍";
    });

});



const popupPagamento = document.getElementById("popupPagamento");
const fecharPagamento = document.getElementById("fecharPagamento");

const btnComprarPDF = document.getElementById("btnComprarPDF");

const imagemPagamento = document.getElementById("imagemPagamento");
const tituloPagamento = document.getElementById("tituloPagamento");

const inputTelefone = document.getElementById("numeroPagamento");
const btnConfirmar = document.getElementById("confirmarPagamento");

let metodoSelecionado = "mpesa";



if (btnComprarPDF) {

    btnComprarPDF.addEventListener("click", () => {

        const img = document.getElementById("popupImagem");
        const titulo = document.getElementById("popupTitulo");

        tituloPagamento.innerText = titulo.innerText;
        imagemPagamento.src = img.src;

        popup.style.display = "none";
        popupPagamento.style.display = "flex";

    });

}


if (fecharPagamento) {
    fecharPagamento.addEventListener("click", () => {
        popupPagamento.style.display = "none";
    });
}

window.addEventListener("click", (e) => {
    if (e.target === popupPagamento) {
        popupPagamento.style.display = "none";
    }
});




document.querySelectorAll('input[name="pagamento"]').forEach(radio => {
    radio.addEventListener("change", (e) => {
        metodoSelecionado = e.target.value;
    });
});



function validarNumero(numero, metodo) {

    numero = numero.trim();

    if (numero.length < 9) return false;

    if (metodo === "mpesa") {
        return numero.startsWith("84") || numero.startsWith("85");
    }

    if (metodo === "emola") {
        return numero.startsWith("86") || numero.startsWith("87");
    }

    return false;
}




if (btnConfirmar) {

    btnConfirmar.addEventListener("click", () => {

        let numero = inputTelefone.value;

        inputTelefone.classList.remove("erroCampo");

        if (!validarNumero(numero, metodoSelecionado)) {
            inputTelefone.classList.add("erroCampo");
            alert("Número inválido para o método selecionado!");
            return;
        }

        popupPagamento.style.display = "none";

        mostrarSucesso();

    });

}




function mostrarSucesso() {

    const popup = document.createElement("div");

    popup.style.position = "fixed";
    popup.style.top = "0";
    popup.style.left = "0";
    popup.style.width = "100%";
    popup.style.height = "100%";
    popup.style.background = "rgba(0,0,0,0.7)";
    popup.style.display = "flex";
    popup.style.justifyContent = "center";
    popup.style.alignItems = "center";
    popup.style.zIndex = "9999";

      popup.innerHTML = `
        <div style="
            background:#fff;
            padding:30px;
            border-radius:20px;
            text-align:center;
            width:360px;
        ">

            <h2 style="color:#119b73;">✅ Compra Concluída</h2>

            <p style="margin:15px 0; color:#555;">
                Livro adicionado à sua biblioteca.
            </p>

            <p><strong>${tituloPagamento.innerText}</strong></p>

            <p>Método: ${metodoSelecionado.toUpperCase()}</p>

            <button onclick="this.parentElement.parentElement.remove()"
                style="
                    margin-top:20px;
                    padding:10px 20px;
                    border:none;
                    background:#119b73;
                    color:#fff;
                    border-radius:10px;
                ">
                Continuar
            </button>

        </div>
    `;

    document.body.appendChild(popup);
}

const popupReservar=document.getElementById("popupReservar");


if(popupReservar){

popupReservar.addEventListener("click",()=>{


const livro={

titulo:popupTitulo.innerText.trim(),

autor:popupAutor.innerText.replace("Autor:","").trim(),

imagem:popupImagem.src,

estado:"Disponível"

};


localStorage.setItem(
"livroSelecionado",
JSON.stringify(livro)
);


window.location.href="Requisitar livro.html";


});

}