document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formReserva");
    const livroSelecionado = JSON.parse(
        localStorage.getItem("livroSelecionado")
    );

    const dadosGuardados = JSON.parse(
        localStorage.getItem("dadosUsuario")
    ) || {};

    const livroImg = document.getElementById("livro-img");
    const livroTitulo = document.getElementById("livro-titulo");
    const livroAutor = document.getElementById("livro-autor");
    const livroCategoria = document.getElementById("livro-categoria");
    const livroStatus = document.getElementById("livro-status");
    const livroDescricao = document.getElementById("livro-descricao");

    const inputNome = document.getElementById("nome");
    const inputNascimento = document.getElementById("nascimento");
    const inputBI = document.getElementById("bi");
    const inputTelefone = document.getElementById("telefone");
    const inputEndereco = document.getElementById("endereco");
    const inputEmail = document.getElementById("email");

    const inputTitulo = document.getElementById("titulo");
    const inputAutor = document.getElementById("autor");

    const tipoEstudante = document.getElementById("tipoEstudante");
    const camposAcademicos = document.getElementById("camposAcademicos");

    const dataLevantamento = document.getElementById("dataLevantamento");
    const horaLevantamento = document.getElementById("horaLevantamento");

    const menuBtn = document.getElementById("menuBtn");
    const menu = document.querySelector(".menu");
    const overlay = document.getElementById("overlay");


    /*
    ==========================================
    DADOS DO LIVRO
    ==========================================
    */

    if (livroSelecionado) {

        if (livroImg) {
            livroImg.src = livroSelecionado.imagem || "";
            livroImg.alt = livroSelecionado.titulo || "Capa do livro";
        }

        if (livroTitulo) {
            livroTitulo.textContent =
                livroSelecionado.titulo || "Livro selecionado";
        }

        if (livroAutor) {
            livroAutor.textContent =
                livroSelecionado.autor || "Autor não informado";
        }

        if (livroCategoria) {
            livroCategoria.textContent =
                livroSelecionado.categoria || "Literatura";
        }

        if (livroStatus) {
            livroStatus.textContent =
                livroSelecionado.estado || "Disponível";
        }

        if (livroDescricao) {
            livroDescricao.textContent =
                livroSelecionado.descricao ||
                "Livro disponível para requisição na Biblioteca Provincial de Pemba.";
        }

        if (inputTitulo) {
            inputTitulo.value =
                livroSelecionado.titulo || "";
        }

        if (inputAutor) {
            inputAutor.value =
                livroSelecionado.autor || "";
        }
    }


    /*
    ==========================================
    DADOS DO UTILIZADOR
    ==========================================
    */

    if (inputNome) {
        inputNome.value = dadosGuardados.nome || "";
    }

    if (inputNascimento) {
        inputNascimento.value = dadosGuardados.nascimento || "";
    }

    if (inputBI) {
        inputBI.value = dadosGuardados.bi || "";
    }

    if (inputTelefone) {
        inputTelefone.value = dadosGuardados.telefone || "";
    }

    if (inputEndereco) {
        inputEndereco.value = dadosGuardados.endereco || "";
    }

    if (inputEmail) {
        inputEmail.value = dadosGuardados.email || "";
    }


    /*
    ==========================================
    INSTITUIÇÕES DE PEMBA
    ==========================================
    */

    const escolasPrimarias = [
        "EPC Amizade Moçambique-China",
        "EPC Anexa do IFP",
        "EPC de Gingone 2",
        "EPC de Mahate",
        "EPC Eduardo Mondlane",
        "Escola Primária de Chuiba",
        "Escola Primária de Ngonane",
        "Escola Primária Comunitária São Carlos Lwanga",
        "Escola Primária Iris"
    ];

    const escolasSecundarias = [
        "Escola Secundária de Pemba",
        "Escola Secundária de Gingone",
        "Escola Secundária 19 de Outubro",
        "Escola Secundária SOS",
        "Escola Secundária Marcelino dos Santos",
        "Escola Secundária Comunitária Maria Mazzarello",
        "Iris Secondary School"
    ];

    const universidadesInstitutos = [
        "Universidade Lúrio - UniLúrio",
        "Universidade Rovuma - UniRovuma",
        "Universidade Católica de Moçambique - UCM",
        "Universidade Íris",
        "Instituto Superior de Ciências e Tecnologia Alberto Chipande - ISCTAC",
        "Instituto Superior de Ciências e Educação a Distância - ISC﻿ED",
        "Instituto Industrial e Comercial de Pemba",
        "Instituto Superior Dom Bosco - ISDB",
        "Instituto de Formação de Professores Alberto Joaquim Chipande"
    ];


    /*
    ==========================================
    CAMPOS ACADÉMICOS
    ==========================================
    */

    function criarSelectInstituicao(
        nome,
        id,
        titulo,
        opcoes
    ) {

        return `
            <label for="${id}">${titulo}</label>

            <select
                id="${id}"
                name="${nome}"
                required
            >

                <option value="">
                    Selecione a instituição
                </option>

                ${opcoes.map(escola => `
                    <option value="${escola}">
                        ${escola}
                    </option>
                `).join("")}

            </select>
        `;
    }


    function mostrarCamposAcademicos() {

        if (!tipoEstudante || !camposAcademicos) {
            return;
        }

        const tipo = tipoEstudante.value;

        camposAcademicos.innerHTML = "";


        if (tipo === "primario") {

            camposAcademicos.innerHTML = `

                ${criarSelectInstituicao(
                    "instituicao",
                    "instituicao",
                    "Escola primária",
                    escolasPrimarias
                )}

                <label for="classe">
                    Classe
                </label>

                <select
                    id="classe"
                    name="classe"
                    required
                >
                    <option value="">
                        Selecione a classe
                    </option>

                    <option value="1ª Classe">1ª Classe</option>
                    <option value="2ª Classe">2ª Classe</option>
                    <option value="3ª Classe">3ª Classe</option>
                    <option value="4ª Classe">4ª Classe</option>
                    <option value="5ª Classe">5ª Classe</option>
                    <option value="6ª Classe">6ª Classe</option>
                </select>

                <label for="encarregado">
                    Nome do encarregado
                </label>

                <input
                    type="text"
                    id="encarregado"
                    name="encarregado"
                    placeholder="Nome completo do encarregado"
                    required
                >

            `;

        }


        else if (tipo === "medio") {

            camposAcademicos.innerHTML = `

                ${criarSelectInstituicao(
                    "instituicao",
                    "instituicao",
                    "Escola secundária / Colégio",
                    escolasSecundarias
                )}

                <label for="classe">
                    Classe
                </label>

                <select
                    id="classe"
                    name="classe"
                    required
                >

                    <option value="">
                        Selecione a classe
                    </option>

                    <option value="7ª Classe">7ª Classe</option>
                    <option value="8ª Classe">8ª Classe</option>
                    <option value="9ª Classe">9ª Classe</option>
                    <option value="10ª Classe">10ª Classe</option>
                    <option value="11ª Classe">11ª Classe</option>
                    <option value="12ª Classe">12ª Classe</option>

                </select>

                <label for="turma">
                    Turma
                </label>

                <input
                    type="text"
                    id="turma"
                    name="turma"
                    placeholder="Ex.: A, B, C..."
                    required
                >

            `;

        }


        else if (tipo === "universitario") {

            camposAcademicos.innerHTML = `

                ${criarSelectInstituicao(
                    "instituicao",
                    "instituicao",
                    "Universidade / Instituto",
                    universidadesInstitutos
                )}

                <label for="curso">
                    Curso
                </label>

                <input
                    type="text"
                    id="curso"
                    name="curso"
                    placeholder="Nome do curso"
                    required
                >

                <label for="ano">
                    Ano de frequência
                </label>

                <select
                    id="ano"
                    name="ano"
                    required
                >

                    <option value="">
                        Selecione o ano
                    </option>

                    <option value="1º Ano">
                        1º Ano
                    </option>

                    <option value="2º Ano">
                        2º Ano
                    </option>

                    <option value="3º Ano">
                        3º Ano
                    </option>

                    <option value="4º Ano">
                        4º Ano
                    </option>

                    <option value="5º Ano">
                        5º Ano
                    </option>

                    <option value="6º Ano">
                        6º Ano
                    </option>

                </select>

            `;
        }
    }


    if (tipoEstudante) {

        tipoEstudante.addEventListener(
            "change",
            mostrarCamposAcademicos
        );

    }


    /*
    ==========================================
    MENU MOBILE
    ==========================================
    */

    if (menuBtn && menu && overlay) {

        menuBtn.addEventListener("click", () => {

            menu.classList.toggle("active");
            overlay.classList.toggle("active");

        });


        overlay.addEventListener("click", () => {

            menu.classList.remove("active");
            overlay.classList.remove("active");

        });

    }


    /*
    ==========================================
    SUBMISSÃO DA REQUISIÇÃO
    ==========================================
    */

    if (form) {

        form.addEventListener("submit", (event) => {

            event.preventDefault();


            if (!livroSelecionado) {

                alert(
                    "Não foi possível identificar o livro selecionado."
                );

                return;
            }


            const dadosFormulario =
                Object.fromEntries(
                    new FormData(form)
                );


            /*
            ==============================
            VERIFICAR CAMPOS
            ==============================
            */

            if (!dadosFormulario.nome) {

                alert(
                    "Digite o seu nome completo."
                );

                inputNome?.focus();

                return;
            }


            if (!dadosFormulario.bi) {

                alert(
                    "Digite o número do BI."
                );

                inputBI?.focus();

                return;
            }


            if (!dadosFormulario.telefone) {

                alert(
                    "Digite o seu telefone."
                );

                inputTelefone?.focus();

                return;
            }


            if (!dadosFormulario.email) {

                alert(
                    "Digite o seu email."
                );

                inputEmail?.focus();

                return;
            }


            if (!dadosFormulario.tipoEstudante) {

                alert(
                    "Selecione o tipo de estudante."
                );

                tipoEstudante?.focus();

                return;
            }


            /*
            ==============================
            DADOS DO UTILIZADOR
            ==============================
            */

            const dadosUsuario = {

                nome: dadosFormulario.nome || "",
                nascimento: dadosFormulario.nascimento || "",
                bi: dadosFormulario.bi || "",
                telefone: dadosFormulario.telefone || "",
                endereco: dadosFormulario.endereco || "",
                email: dadosFormulario.email || "",

                tipoEstudante:
                    dadosFormulario.tipoEstudante || "",

                instituicao:
                    dadosFormulario.instituicao || "",

                classe:
                    dadosFormulario.classe || "",

                turma:
                    dadosFormulario.turma || "",

                curso:
                    dadosFormulario.curso || "",

                ano:
                    dadosFormulario.ano || "",

                encarregado:
                    dadosFormulario.encarregado || ""

            };


            localStorage.setItem(
                "dadosUsuario",
                JSON.stringify(dadosUsuario)
            );


            /*
            ==============================
            RESERVAS EXISTENTES
            ==============================
            */

            let reservas =
                JSON.parse(
                    localStorage.getItem("reservas")
                ) || [];


            const existeReserva =
                reservas.some(reserva =>
                    reserva.titulo ===
                    livroSelecionado.titulo
                );


            if (existeReserva) {

                alert(
                    "Este livro já está reservado por si."
                );

                return;
            }


            /*
            ==============================
            NOVA RESERVA
            ==============================
            */

            const novaReserva = {

                id:
                    Date.now(),

                titulo:
                    livroSelecionado.titulo || "",

                autor:
                    livroSelecionado.autor || "",

                categoria:
                    livroSelecionado.categoria ||
                    "Literatura",

                imagem:
                    livroSelecionado.imagem || "",

                descricao:
                    livroSelecionado.descricao || "",

                estado:
                    "Reservado",

                status:
                    "Reservado",

                data:
                    new Date().toLocaleString(
                        "pt-PT"
                    ),

                dataReserva:
                    new Date().toISOString(),

                dataLevantamento:
                    dataLevantamento?.value || "",

                horaLevantamento:
                    horaLevantamento?.value || "",

                leitor: {

                    nome:
                        dadosFormulario.nome || "",

                    nascimento:
                        dadosFormulario.nascimento || "",

                    bi:
                        dadosFormulario.bi || "",

                    telefone:
                        dadosFormulario.telefone || "",

                    endereco:
                        dadosFormulario.endereco || "",

                    email:
                        dadosFormulario.email || ""

                },

                academico: {

                    tipo:
                        dadosFormulario.tipoEstudante ||
                        "",

                    instituicao:
                        dadosFormulario.instituicao ||
                        "",

                    classe:
                        dadosFormulario.classe ||
                        "",

                    turma:
                        dadosFormulario.turma ||
                        "",

                    curso:
                        dadosFormulario.curso ||
                        "",

                    ano:
                        dadosFormulario.ano ||
                        "",

                    encarregado:
                        dadosFormulario.encarregado ||
                        ""

                }

            };


            reservas.push(novaReserva);


            localStorage.setItem(
                "reservas",
                JSON.stringify(reservas)
            );


            /*
            ==============================
            ATUALIZAR LIVROS REQUISITADOS
            ==============================
            */

            let livrosRequisitados =
                JSON.parse(
                    localStorage.getItem(
                        "livrosRequisitados"
                    )
                ) || [];


            livrosRequisitados.push({
                titulo:
                    novaReserva.titulo,

                autor:
                    novaReserva.autor,

                categoria:
                    novaReserva.categoria,

                imagem:
                    novaReserva.imagem,

                estado:
                    novaReserva.estado,

                data:
                    novaReserva.data

            });


            localStorage.setItem(
                "livrosRequisitados",
                JSON.stringify(
                    livrosRequisitados
                )
            );


            /*
            ==============================
            CONFIRMAÇÃO
            ==============================
            */

            mostrarConfirmacao();

        });

    }


});


function mostrarConfirmacao() {

    const popupExistente =
        document.querySelector(
            ".popup-overlay"
        );

    if (popupExistente) {
        popupExistente.remove();
    }


    const popup =
        document.createElement("div");

    popup.className =
        "popup-overlay";


    popup.innerHTML = `

        <div class="popup-card">

            <h2>
                Requisição Confirmada!
            </h2>

            <p>
                O livro foi requisitado com sucesso.
                Os dados da requisição já foram
                guardados no seu perfil.
            </p>

            <button
                type="button"
                id="perfil"
            >
                Ver meu perfil
            </button>

            <button
                type="button"
                id="outroLivro"
            >
                Requisitar outro livro
            </button>

        </div>

    `;


    document.body.appendChild(popup);


    const botaoPerfil =
        document.getElementById("perfil");


    const botaoOutroLivro =
        document.getElementById(
            "outroLivro"
        );


    if (botaoPerfil) {

        botaoPerfil.addEventListener(
            "click",
            () => {

                window.location.href =
                    "perfil.html";

            }
        );

    }


    if (botaoOutroLivro) {

        botaoOutroLivro.addEventListener(
            "click",
            () => {

                window.location.href =
                    "INICIO.html";

            }
        );

    }

}
