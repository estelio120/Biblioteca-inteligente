document.addEventListener("DOMContentLoaded", () => {

    const livro = JSON.parse(
        localStorage.getItem("livroSelecionado")
    );

    const dadosUsuario = JSON.parse(
        localStorage.getItem("dadosUsuario")
    );

    const form = document.getElementById("formReserva");

    const img = document.getElementById("livro-img");
    const titulo = document.getElementById("livro-titulo");
    const autor = document.getElementById("livro-autor");
    const categoria = document.getElementById("livro-categoria");
    const status = document.getElementById("livro-status");
    const descricao = document.getElementById("livro-descricao");

    const inputTitulo = document.getElementById("titulo");
    const inputAutor = document.getElementById("autor");

    const tipoEstudante =
        document.getElementById("tipoEstudante");

    const camposAcademicos =
        document.getElementById("camposAcademicos");


    if (!livro) {

        alert("Nenhum livro foi selecionado.");

        window.location.href = "INICIO.html";

        return;
    }


    if (img) {

        img.src = livro.imagem || "";

        img.alt =
            livro.titulo || "Capa do livro";

    }


    if (titulo) {

        titulo.textContent =
            livro.titulo || "";

    }


    if (autor) {

        autor.textContent =
            livro.autor || "";

    }


    if (categoria) {

        categoria.textContent =
            livro.categoria || "Literatura";

    }


    if (status) {

        status.textContent =
            livro.estado || "Disponível";

    }


    if (descricao) {

        descricao.textContent =
            livro.descricao ||
            "Livro disponível para reserva na Biblioteca Provincial de Pemba.";

    }


    if (inputTitulo) {

        inputTitulo.value =
            livro.titulo || "";

    }


    if (inputAutor) {

        inputAutor.value =
            livro.autor || "";

    }


    if (dadosUsuario) {

        const nome =
            document.getElementById("nome");

        const nascimento =
            document.getElementById("nascimento");

        const bi =
            document.getElementById("bi");

        const telefone =
            document.getElementById("telefone");

        const endereco =
            document.getElementById("endereco");

        const email =
            document.getElementById("email");


        if (nome)
            nome.value =
                dadosUsuario.nome || "";


        if (nascimento)
            nascimento.value =
                dadosUsuario.nascimento || "";


        if (bi)
            bi.value =
                dadosUsuario.bi || "";


        if (telefone)
            telefone.value =
                dadosUsuario.telefone || "";


        if (endereco)
            endereco.value =
                dadosUsuario.endereco || "";


        if (email)
            email.value =
                dadosUsuario.email || "";

    }


    if (tipoEstudante) {

        tipoEstudante.addEventListener(
            "change",
            () => {

                const tipo =
                    tipoEstudante.value;


                if (tipo === "primario") {

                    camposAcademicos.innerHTML = `

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

                            <option value="1ª Classe">
                                1ª Classe
                            </option>

                            <option value="2ª Classe">
                                2ª Classe
                            </option>

                            <option value="3ª Classe">
                                3ª Classe
                            </option>

                            <option value="4ª Classe">
                                4ª Classe
                            </option>

                            <option value="5ª Classe">
                                5ª Classe
                            </option>

                            <option value="6ª Classe">
                                6ª Classe
                            </option>

                        </select>


                        <label for="escola">
                            Escola
                        </label>

                        <input
                            type="text"
                            id="escola"
                            name="escola"
                            placeholder="Nome da escola"
                            required
                        >


                        <label for="encarregado">
                            Nome do encarregado
                        </label>

                        <input
                            type="text"
                            id="encarregado"
                            name="encarregado"
                            placeholder="Nome do encarregado"
                            required
                        >

                    `;

                }


                else if (tipo === "medio") {

                    camposAcademicos.innerHTML = `

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

                            <option value="7ª Classe">
                                7ª Classe
                            </option>

                            <option value="8ª Classe">
                                8ª Classe
                            </option>

                            <option value="9ª Classe">
                                9ª Classe
                            </option>

                            <option value="10ª Classe">
                                10ª Classe
                            </option>

                            <option value="11ª Classe">
                                11ª Classe
                            </option>

                            <option value="12ª Classe">
                                12ª Classe
                            </option>

                        </select>


                        <label for="escola">
                            Escola
                        </label>

                        <input
                            type="text"
                            id="escola"
                            name="escola"
                            placeholder="Nome da escola"
                            required
                        >


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

                        <label for="universidade">
                            Universidade
                        </label>

                        <input
                            type="text"
                            id="universidade"
                            name="universidade"
                            placeholder="Nome da universidade"
                            required
                        >


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

                    `;

                }


                else {

                    camposAcademicos.innerHTML = "";

                }

            }
        );

    }


    if (form) {

        form.addEventListener(
            "submit",
            (e) => {

                e.preventDefault();


                const dados =
                    Object.fromEntries(
                        new FormData(form)
                    );


                if (
                    !dados.nome ||
                    !dados.nascimento ||
                    !dados.bi ||
                    !dados.telefone ||
                    !dados.endereco ||
                    !dados.email ||
                    !dados.tipoEstudante ||
                    !dados.titulo ||
                    !dados.autor ||
                    !dados.dataLevantamento ||
                    !dados.horaLevantamento
                ) {

                    alert(
                        "Preencha todos os campos obrigatórios."
                    );

                    return;
                }


                const reservas =
                    JSON.parse(
                        localStorage.getItem("reservas")
                    ) || [];


                const existe =
                    reservas.some(
                        reserva =>
                            reserva.titulo === livro.titulo
                    );


                if (existe) {

                    alert(
                        "Este livro já está reservado!"
                    );

                    return;
                }


                const dadosUsuarioAtual = {

                    nome:
                        dados.nome,

                    nascimento:
                        dados.nascimento,

                    bi:
                        dados.bi,

                    telefone:
                        dados.telefone,

                    endereco:
                        dados.endereco,

                    email:
                        dados.email

                };


                localStorage.setItem(
                    "dadosUsuario",
                    JSON.stringify(
                        dadosUsuarioAtual
                    )
                );


                const novaReserva = {

                    id:
                        Date.now(),

                    titulo:
                        dados.titulo,

                    autor:
                        dados.autor,

                    categoria:
                        livro.categoria || "Literatura",

                    imagem:
                        livro.imagem || "",

                    descricao:
                        livro.descricao || "",

                    estado:
                        "Reservado",

                    data:
                        new Date()
                            .toLocaleString("pt-PT"),


                    dataLevantamento:
                        dados.dataLevantamento,

                    horaLevantamento:
                        dados.horaLevantamento,


                    nome:
                        dados.nome,

                    nascimento:
                        dados.nascimento,

                    bi:
                        dados.bi,

                    telefone:
                        dados.telefone,

                    endereco:
                        dados.endereco,

                    email:
                        dados.email,


                    tipoEstudante:
                        dados.tipoEstudante,

                    classe:
                        dados.classe || "",

                    escola:
                        dados.escola || "",

                    turma:
                        dados.turma || "",

                    encarregado:
                        dados.encarregado || "",

                    universidade:
                        dados.universidade || "",

                    curso:
                        dados.curso || "",


                    assinaturaLeitor:
                        dados.assinaturaLeitor || "",

                    assinaturaFuncionario:
                        dados.assinaturaFuncionario || ""

                };


                reservas.push(
                    novaReserva
                );


                localStorage.setItem(
                    "reservas",
                    JSON.stringify(
                        reservas
                    )
                );


                mostrarConfirmacao();

            }
        );

    }


    const menu =
        document.querySelector(".menu");

    const menuBtn =
        document.getElementById("menuBtn");

    const overlay =
        document.getElementById("overlay");


    if (
        menu &&
        menuBtn &&
        overlay
    ) {

        menuBtn.addEventListener(
            "click",
            () => {

                menu.classList.toggle(
                    "active"
                );

                overlay.classList.toggle(
                    "active"
                );

            }
        );


        overlay.addEventListener(
            "click",
            () => {

                menu.classList.remove(
                    "active"
                );

                overlay.classList.remove(
                    "active"
                );

            }
        );

    }

});


function mostrarConfirmacao() {

    const popup =
        document.createElement("div");


    popup.className =
        "popup-overlay";


    popup.innerHTML = `

        <div class="popup-card">

            <h2>
                ✔ Requisição Confirmada!
            </h2>

            <p>
                A reserva foi registada com sucesso.
            </p>

            <button id="perfil">
                Ver perfil
            </button>

            <button id="outroLivro">
                Reservar outro livro
            </button>

        </div>

    `;


    document.body.appendChild(
        popup
    );


    document
        .getElementById("perfil")
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "perfil.html";

            }
        );


    document
        .getElementById("outroLivro")
        .addEventListener(
            "click",
            () => {

                window.location.href =
                    "INICIO.html";

            }
        );

}
