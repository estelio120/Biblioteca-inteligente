document.addEventListener("DOMContentLoaded", () => {

    const livro = JSON.parse(localStorage.getItem("livroSelecionado"));

    const img = document.getElementById("livro-img");
    const titulo = document.getElementById("livro-titulo");
    const autor = document.getElementById("livro-autor");
    const status = document.getElementById("livro-status");
    const descricao = document.getElementById("livro-descricao");

    const inputTitulo = document.getElementById("titulo");
    const inputAutor = document.getElementById("autor");


    if (livro) {

        if (img) {
            img.src = livro.imagem || "";
            img.alt = livro.titulo || "Livrso";
        }

        if (titulo) titulo.innerText = livro.titulo || "";
        if (autor) autor.innerText = livro.autor || "";
        if (status) status.innerText = livro.estado || "Disponível";
        if (descricao) {
            descricao.innerText = "Livro disponível para reserva na Biblioteca Provincial de Pemba.";
        }

        if (inputTitulo) inputTitulo.value = livro.titulo || "";
        if (inputAutor) inputAutor.value = livro.autor || "";

    }


    const dadosUsuario = JSON.parse(localStorage.getItem("dadosUsuario"));

    if (dadosUsuario) {

        document.getElementById("nome").value = dadosUsuario.nome || "";
        document.getElementById("nascimento").value = dadosUsuario.nascimento || "";
        document.getElementById("bi").value = dadosUsuario.bi || "";
        document.getElementById("telefone").value = dadosUsuario.telefone || "";
        document.getElementById("endereco").value = dadosUsuario.endereco || "";
        document.getElementById("email").value = dadosUsuario.email || "";

    }


    const tipoEstudante = document.getElementById("tipoEstudante");
    const camposAcademicos = document.getElementById("camposAcademicos");


    if (tipoEstudante) {

        tipoEstudante.addEventListener("change", () => {

            let tipo = tipoEstudante.value;


            if (tipo === "primario") {

                camposAcademicos.innerHTML = `
                <label>Classe</label>
                <select name="classe">
                    <option>1ª Classe</option>
                    <option>2ª Classe</option>
                    <option>3ª Classe</option>
                    <option>4ª Classe</option>
                    <option>5ª Classe</option>
                    <option>6ª Classe</option>
                </select>

                <label>Escola</label>
                <input type="text" name="escola">

                <label>Nome do encarregado</label>
                <input type="text" name="encarregado">
                `;

            } else if (tipo === "medio") {

                camposAcademicos.innerHTML = `
                <label>Classe</label>
                <select name="classe">
                    <option>7ª Classe</option>
                    <option>8ª Classe</option>
                    <option>9ª Classe</option>
                    <option>10ª Classe</option>
                    <option>11ª Classe</option>
                    <option>12ª Classe</option>
                </select>

                <label>Escola</label>
                <input type="text" name="escola">

                <label>Turma</label>
                <input type="text" name="turma">
                `;

            } else if (tipo === "universitario") {

                camposAcademicos.innerHTML = `
                <label>Universidade</label>
                <input type="text" name="universidade">

                <label>Curso</label>
                <input type="text" name="curso">
                `;

            } else {

                camposAcademicos.innerHTML = "";

            }

        });

    }


    const form = document.getElementById("formReserva");


    if (form) {

        form.addEventListener("submit", (e) => {

            e.preventDefault();


            const dados = Object.fromEntries(new FormData(form));


            const dadosUsuario = {

                nome: dados.nome,
                nascimento: dados.nascimento,
                bi: dados.bi,
                telefone: dados.telefone,
                endereco: dados.endereco,
                email: dados.email

            };


            localStorage.setItem(
                "dadosUsuario",
                JSON.stringify(dadosUsuario)
            );


            let reservas = JSON.parse(localStorage.getItem("reservas")) || [];


            const existe = reservas.some(
                r => r.titulo === livro.titulo
            );


            if (existe) {

                alert("Este livro já está reservado!");
                return;

            }


            const novaReserva = {

                ...dados,

                titulo: livro.titulo || "",
                autor: livro.autor || "",
                imagem: livro.imagem || "",
                estado: "Reservado",
                data: new Date().toLocaleString()

            };


            reservas.push(novaReserva);


            localStorage.setItem(
                "reservas",
                JSON.stringify(reservas)
            );


            mostrarConfirmacao();

        });

    }


});


function mostrarConfirmacao() {

    const popup = document.createElement("div");

    popup.className = "popup-overlay";


    popup.innerHTML = `

    <div class="popup-card">

        <h2>✔ Requisição Confirmada!</h2>

        <p>Reserva registada com sucesso.</p>

        <button id="perfil">
            Ver perfil
        </button>

        <button id="outroLivro">
            Reservar outro livro
        </button>

    </div>

    `;


    document.body.appendChild(popup);


    document.getElementById("perfil").onclick = () => {

        window.location.href = "perfil.html";

    };


    document.getElementById("outroLivro").onclick = () => {

        window.location.href = "INICIO.html";

    };

}
