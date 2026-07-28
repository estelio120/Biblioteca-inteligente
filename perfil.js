document.addEventListener("DOMContentLoaded", () => {

    const listaReservas = document.getElementById("listaReservas");

    let reservas = JSON.parse(localStorage.getItem("reservas")) || [];

    mostrarReservas();

    function mostrarReservas() {

        listaReservas.innerHTML = "";

        if (reservas.length === 0) {

            listaReservas.innerHTML = `
                <div class="sem-reservas">
                    <h3>📕 Nenhum livro reservado</h3>
                    <p>As suas reservas aparecerão aqui.</p>
                </div>
            `;

            return;
        }

        reservas.forEach((livro, index) => {

            const card = document.createElement("div");

            card.className = "card-reserva";

            card.innerHTML = `
            
                <div class="reserva-img">
                    <img src="${livro.imagem}" alt="${livro.titulo}">
                </div>

                <div class="reserva-info">

                    <h3>${livro.titulo}</h3>

                    <p>
                        <strong>Autor:</strong>
                        ${livro.autor}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${livro.data}
                    </p>

                    <span class="status">
                        ${livro.status}
                    </span>

                </div>

                <div class="reserva-acoes">

                    <button class="btn-remover"
                            data-index="${index}">
                        🗑 Eliminar
                    </button>

                </div>
            `;

            listaReservas.appendChild(card);
        });

        ativarRemocao();
    }

    function ativarRemocao() {

        const botoes =
            document.querySelectorAll(".btn-remover");

        botoes.forEach(btn => {

            btn.addEventListener("click", () => {

                const index =
                    btn.getAttribute("data-index");

                const confirmar =
                    confirm("Deseja eliminar esta reserva?");

                if (!confirmar) return;

                reservas.splice(index, 1);

                localStorage.setItem(
                    "reservas",
                    JSON.stringify(reservas)
                );

                mostrarReservas();
            });
        });
    }

});

const barra=document.querySelector(".barra");
const percentagem=document.querySelector(".percentagem");
const mensagem=document.querySelector(".mensagem-nivel");

if(barra){

let limite=100;

let progresso=(pontos%limite);

barra.style.width=progresso+"%";

if(percentagem){

percentagem.innerHTML=progresso+"%";

}

if(mensagem){

if(progresso<30){

mensagem.innerHTML="📖 Comece sua jornada de leitura";

}

else if(progresso<70){

mensagem.innerHTML="🔥 Você está evoluindo";

}

else{

mensagem.innerHTML="🏆 Quase no próximo nível";

}

}

}