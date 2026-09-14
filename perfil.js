document.addEventListener("DOMContentLoaded", () => {

    const listaReservas =
        document.getElementById("listaReservas");

    let reservas =
        JSON.parse(localStorage.getItem("reservas")) || [];

    let dadosUsuario =
        JSON.parse(localStorage.getItem("dadosUsuario")) || {};

    let pontos =
        Number(localStorage.getItem("pontos")) || 0;


    atualizarUsuario();

    mostrarReservas();

    atualizarProgresso();

    ativarDesafios();

    ativarNotificacao();

    ativarSair();


    function atualizarUsuario() {

        const nome =
            dadosUsuario.nome || "Leitor";

        const primeiroNome =
            nome.split(" ")[0];

        const iniciais =
            obterIniciais(nome);


        const nomePerfil =
            document.querySelector(".perfil-menu h3");

        const nomeHeader =
            document.querySelector(".usuario-header strong");

        const avatar =
            document.querySelector(".avatar");

        const miniAvatar =
            document.querySelector(".mini-avatar");


        if (nomePerfil) {
            nomePerfil.textContent = nome;
        }


        if (nomeHeader) {
            nomeHeader.textContent = primeiroNome;
        }


        if (avatar) {
            avatar.textContent = iniciais;
        }


        if (miniAvatar) {
            miniAvatar.textContent = iniciais;
        }


        atualizarPontos();
    }


    function obterIniciais(nome) {

        const partes =
            nome.trim().split(/\s+/);

        if (partes.length === 1) {

            return partes[0]
                .substring(0, 2)
                .toUpperCase();

        }


        return (
            partes[0][0] +
            partes[partes.length - 1][0]
        ).toUpperCase();

    }


    function atualizarPontos() {

        const pontosMenu =
            document.querySelector(".pontos-menu");

        const pontosHeader =
            document.querySelector(".usuario-header span");


        if (pontosMenu) {

            pontosMenu.textContent =
                `⭐ ${pontos} Pontos`;

        }


        if (pontosHeader) {

            pontosHeader.textContent =
                `${pontos} pts`;

        }

    }


    function mostrarReservas() {

        if (!listaReservas) return;


        listaReservas.innerHTML = "";


        if (reservas.length === 0) {

            listaReservas.innerHTML = `

                <div class="sem-reservas">

                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="45"
                        height="45"
                        fill="#2563eb"
                        viewBox="0 0 16 16">

                        <path d="M1 2.828c.885-.37 2.154-.769 3.388-.893
                        1.33-.134 2.458.063 3.112.752v9.746
                        c-.935-.53-2.12-.603-3.213-.493
                        -1.18.12-2.37.461-3.287.811z"/>

                        <path d="M8.5 2.687c.654-.689 1.782-.886
                        3.112-.752 1.234.124 2.503.523
                        3.388.893v9.923c-.918-.35-2.107-.692
                        -3.287-.81-1.094-.111-2.278-.039
                        -3.213.492z"/>

                    </svg>

                    <h3>Nenhum livro reservado</h3>

                    <p>
                        As suas reservas aparecerão aqui.
                    </p>

                </div>

            `;

            return;
        }


        reservas.forEach((livro, index) => {

            const card =
                document.createElement("div");

            card.className =
                "card-reserva";


            const imagem =
                livro.imagem ||
                "img/livro-padrao.jpg";


            const titulo =
                livro.titulo ||
                "Livro sem título";


            const autor =
                livro.autor ||
                "Autor desconhecido";


            const data =
                livro.data ||
                "Data não disponível";


            const estado =
                livro.estado ||
                livro.status ||
                "Reservado";


            card.innerHTML = `

                <div class="reserva-img">

                    <img
                        src="${imagem}"
                        alt="${titulo}"
                        onerror="this.src='img/livro-padrao.jpg'">

                </div>


                <div class="reserva-info">

                    <h3>${titulo}</h3>

                    <p>
                        <strong>Autor:</strong>
                        ${autor}
                    </p>

                    <p>
                        <strong>Data:</strong>
                        ${data}
                    </p>

                    <span class="status">
                        ${estado}
                    </span>

                </div>


                <div class="reserva-acoes">

                    <button
                        class="btn-remover"
                        data-index="${index}">

                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            viewBox="0 0 16 16">

                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6
                            a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m5 0
                            A.5.5 0 0 1 11 6v6a.5.5 0 0 1-1 0V6
                            a.5.5 0 0 1 .5-.5"/>

                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9
                            a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5
                            a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6
                            a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5
                            a1 1 0 0 1 1 1zM4.118 4 4 4.059V13
                            a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059
                            L11.882 4zM2.5 3a.5.5 0 0 0 .5.5h10
                            a.5.5 0 0 0 .5-.5V2h-11z"/>

                        </svg>

                        Eliminar

                    </button>

                </div>

            `;


            listaReservas.appendChild(card);

        });


        ativarRemocao();

    }


    function ativarRemocao() {

        const botoes =
            document.querySelectorAll(
                ".btn-remover"
            );


        botoes.forEach(botao => {

            botao.addEventListener(
                "click",
                () => {

                    const index =
                        Number(
                            botao.dataset.index
                        );


                    const livro =
                        reservas[index];


                    if (!livro) return;


                    const confirmar =
                        confirm(
                            `Deseja eliminar a reserva de "${livro.titulo}"?`
                        );


                    if (!confirmar) return;


                    reservas.splice(
                        index,
                        1
                    );


                    localStorage.setItem(
                        "reservas",
                        JSON.stringify(reservas)
                    );


                    mostrarReservas();

                }
            );

        });

    }


    function atualizarProgresso() {

        const barra =
            document.querySelector(".barra");

        const percentagem =
            document.querySelector(".percentagem");

        const mensagem =
            document.querySelector(".mensagem-nivel");


        const limite =
            100;


        const progresso =
            pontos % limite;


        if (barra) {

            setTimeout(() => {

                barra.style.width =
                    progresso + "%";

            }, 300);

        }


        if (percentagem) {

            percentagem.textContent =
                progresso + "%";

        }


        if (mensagem) {

            if (progresso < 30) {

                mensagem.textContent =
                    "Comece sua jornada de leitura";

            }

            else if (progresso < 70) {

                mensagem.textContent =
                    "Você está evoluindo";

            }

            else {

                mensagem.textContent =
                    "Quase no próximo nível";

            }

        }

    }


    function ativarDesafios() {

        const desafios =
            document.querySelectorAll(
                ".desafio-item"
            );


        desafios.forEach(desafio => {

            desafio.addEventListener(
                "click",
                () => {

                    const id =
                        desafio.dataset.explicacao;


                    const explicacao =
                        document.getElementById(id);


                    if (!explicacao) return;


                    const estavaAberto =
                        !explicacao.hidden;


                    document
                        .querySelectorAll(".explicacao")
                        .forEach(item => {

                            item.hidden = true;

                        });


                    if (!estavaAberto) {

                        explicacao.hidden =
                            false;

                    }

                }
            );

        });

    }


    function ativarNotificacao() {

        const botao =
            document.querySelector(
                ".notificacao"
            );


        if (!botao) return;


        botao.addEventListener(
            "click",
            () => {

                if (reservas.length === 0) {

                    alert(
                        "Não possui nenhum livro reservado."
                    );

                    return;

                }


                alert(
                    `Você possui ${reservas.length} livro(s) reservado(s).`
                );

            }
        );

    }


    function ativarSair() {

        const links =
            document.querySelectorAll(
                ".menu-lista a"
            );


        links.forEach(link => {

            if (
                link.textContent
                    .trim()
                    .toLowerCase() === "sair"
            ) {

                link.addEventListener(
                    "click",
                    event => {

                        event.preventDefault();


                        const confirmar =
                            confirm(
                                "Deseja realmente sair?"
                            );


                        if (!confirmar) return;


                        localStorage.removeItem(
                            "dadosUsuario"
                        );

                        localStorage.removeItem(
                            "livroSelecionado"
                        );

                        localStorage.removeItem(
                            "pontos"
                        );


                        window.location.href =
                            "INICIO.html";

                    }
                );

            }

        });

    }

});
