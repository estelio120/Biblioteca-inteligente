document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    /* =========================================================
       1. HELPERS
       ========================================================= */

    const $ = (selector, parent = document) =>
        parent.querySelector(selector);

    const $$ = (selector, parent = document) =>
        [...parent.querySelectorAll(selector)];

    const STORAGE = {
        favoritos: "biblioteca_favoritos",
        reservas: "biblioteca_reservas",
        pontos: "biblioteca_pontos",
        leitura: "biblioteca_leitura",
        notificacoes: "biblioteca_notificacoes",
        utilizador: "biblioteca_utilizador",
        preferencias: "biblioteca_preferencias"
    };

    const BREAKPOINT = 900;

    const lerStorage = (chave, valorPadrao) => {
        try {
            const valor = localStorage.getItem(chave);

            if (valor === null) {
                return valorPadrao;
            }

            return JSON.parse(valor);
        } catch (erro) {
            console.warn(`Erro ao ler ${chave}:`, erro);
            return valorPadrao;
        }
    };

    const salvarStorage = (chave, valor) => {
        try {
            localStorage.setItem(chave, JSON.stringify(valor));
        } catch (erro) {
            console.warn(`Erro ao salvar ${chave}:`, erro);
        }
    };

    const normalizar = (texto) =>
        String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const escaparHTML = (texto) =>
        String(texto || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    /* =========================================================
       2. ESTADO
       ========================================================= */

    let favoritos = lerStorage(STORAGE.favoritos, []);
    let reservas = lerStorage(STORAGE.reservas, []);
    let pontos = Number(lerStorage(STORAGE.pontos, 0)) || 0;

    let leitura = lerStorage(STORAGE.leitura, {});

    let notificacoes = lerStorage(STORAGE.notificacoes, []);

    let utilizador = lerStorage(STORAGE.utilizador, {
        nome: "Utilizador",
        email: "utilizador@email.com",
        avatar: ""
    });

    let preferencias = lerStorage(STORAGE.preferencias, {
        notificacoes: true,
        animacoes: true,
        modoEscuro: false
    });

    if (!Array.isArray(favoritos)) {
        favoritos = [];
    }

    if (!Array.isArray(reservas)) {
        reservas = [];
    }

    if (!Array.isArray(notificacoes)) {
        notificacoes = [];
    }

    if (!leitura || typeof leitura !== "object" || Array.isArray(leitura)) {
        leitura = {};
    }

    /* =========================================================
       3. ELEMENTOS
       ========================================================= */

    const abrirMenu = $("#abrirMenu");
    const menuLateral = $("#menuLateral");
    const overlay = $("#overlay");

    const btnNotificacao = $("#btnNotificacao");
    const notificacoesPainel = $("#notificacoesPainel");
    const fecharNotificacoes = $("#fecharNotificacoes");

    const pesquisaLivro = $("#pesquisaLivro");
    const btnPesquisar = $("#btnPesquisar");
    const resultadoPesquisa = $("#resultadoPesquisa");
    const listaLivros = $("#listaLivros");

    const totalReservas = $("#totalReservas");
    const totalFavoritos = $("#totalFavoritos");
    const totalPontos = $("#totalPontos");

    const listaFavoritos = $("#listaFavoritos");
    const favoritosContador = $(".favoritos-contador");

    const verTodosLivros = $("#verTodosLivros");
    const verDetalhesDestaque = $("#verDetalhesDestaque");

    const btnSair = $("#btnSair");

    /* =========================================================
       4. LIVROS
       ========================================================= */

    const obterLivros = () => $$(".livro-card");

    const criarIdLivro = (livro) => {
        if (!livro) return "";

        if (livro.dataset.id) {
            return String(livro.dataset.id);
        }

        const titulo = livro.dataset.titulo || "";
        const autor = livro.dataset.autor || "";

        return normalizar(`${titulo}-${autor}`)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const obterDadosLivro = (livro) => {
        if (!livro) return null;

        return {
            id: criarIdLivro(livro),
            titulo: livro.dataset.titulo || "Livro",
            autor: livro.dataset.autor || "Autor desconhecido",
            categoria: livro.dataset.categoria || "",
            capa: $("img", livro)?.src || "",
            descricao: livro.dataset.descricao || "",
            paginas: Number(livro.dataset.paginas || 0),
            ano: livro.dataset.ano || "",
            isbn: livro.dataset.isbn || "",
            avaliacao: Number(livro.dataset.avaliacao || 0),
            disponivel:
                livro.dataset.disponivel !== "false"
        };
    };

    /* =========================================================
       5. MENU LATERAL
       ========================================================= */

    const abrirMenuMobile = () => {
        if (!menuLateral) return;

        menuLateral.classList.add("aberto");

        if (overlay) {
            overlay.classList.add("ativo");
        }

        document.body.classList.add("menu-aberto");

        if (abrirMenu) {
            abrirMenu.setAttribute("aria-expanded", "true");
        }
    };

    const fecharMenu = () => {
        if (menuLateral) {
            menuLateral.classList.remove("aberto");
        }

        if (overlay) {
            overlay.classList.remove("ativo");
        }

        document.body.classList.remove("menu-aberto");

        if (abrirMenu) {
            abrirMenu.setAttribute("aria-expanded", "false");
        }
    };

    const alternarMenu = () => {
        if (window.innerWidth > BREAKPOINT) {
            return;
        }

        if (menuLateral?.classList.contains("aberto")) {
            fecharMenu();
        } else {
            abrirMenuMobile();
        }
    };

    if (abrirMenu) {
        abrirMenu.setAttribute("aria-expanded", "false");

        abrirMenu.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            alternarMenu();
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            fecharMenu();
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
            fecharMenu();
            fecharPainelNotificacoes();
        }
    });

    const configurarMenu = () => {
        const itens = $$(".menu-item");

        itens.forEach((item) => {
            const link = $("a", item);

            if (!link) return;

            link.addEventListener("click", () => {
                itens.forEach((outro) => {
                    outro.classList.remove("ativo");
                });

                item.classList.add("ativo");

                if (window.innerWidth <= BREAKPOINT) {
                    fecharMenu();
                }
            });
        });
    };

    window.addEventListener("resize", () => {
        if (window.innerWidth > BREAKPOINT) {
            fecharMenu();
        }
    });

    /* =========================================================
       6. NOTIFICAÇÕES
       ========================================================= */

    const obterNotificacoesNaoLidas = () =>
        notificacoes.filter((item) => !item.lida).length;

    const atualizarContadorNotificacoes = () => {
        const contador =
            $(".notificacoes-contador") ||
            $("#contadorNotificacoes") ||
            $(".notification-count");

        const quantidade = obterNotificacoesNaoLidas();

        if (contador) {
            contador.textContent = quantidade;
            contador.hidden = quantidade === 0;
        }

        if (btnNotificacao) {
            btnNotificacao.setAttribute(
                "aria-label",
                quantidade
                    ? `${quantidade} notificações não lidas`
                    : "Notificações"
            );
        }
    };

    const renderizarNotificacoes = () => {
        if (!notificacoesPainel) return;

        const lista =
            $("#listaNotificacoes", notificacoesPainel) ||
            $(".lista-notificacoes", notificacoesPainel);

        if (!lista) return;

        lista.innerHTML = "";

        if (!notificacoes.length) {
            lista.innerHTML = `
                <div class="sem-notificacoes">
                    <div>🔔</div>
                    <p>Não existem notificações.</p>
                </div>
            `;

            return;
        }

        notificacoes
            .slice()
            .reverse()
            .forEach((notificacao) => {
                const elemento = document.createElement("div");

                elemento.className =
                    `notificacao-item ${notificacao.lida ? "lida" : "nao-lida"}`;

                elemento.dataset.id = notificacao.id;

                elemento.innerHTML = `
                    <div class="notificacao-conteudo">
                        <strong>
                            ${escaparHTML(notificacao.titulo)}
                        </strong>

                        <p>
                            ${escaparHTML(notificacao.mensagem)}
                        </p>

                        <small>
                            ${escaparHTML(notificacao.data || "")}
                        </small>
                    </div>

                    ${
                        !notificacao.lida
                            ? `
                                <button
                                    type="button"
                                    class="marcar-notificacao"
                                    data-id="${escaparHTML(notificacao.id)}"
                                >
                                    Marcar como lida
                                </button>
                            `
                            : ""
                    }
                `;

                lista.appendChild(elemento);
            });

        $$(".marcar-notificacao", lista).forEach((botao) => {
            botao.addEventListener("click", () => {
                marcarNotificacaoComoLida(botao.dataset.id);
            });
        });
    };

    const adicionarNotificacao = (
        titulo,
        mensagem
    ) => {
        if (!preferencias.notificacoes) {
            return;
        }

        notificacoes.push({
            id:
                Date.now().toString() +
                Math.random().toString(36).slice(2),

            titulo,
            mensagem,

            data:
                new Date().toLocaleString("pt-PT"),

            lida: false
        });

        salvarStorage(
            STORAGE.notificacoes,
            notificacoes
        );

        renderizarNotificacoes();
        atualizarContadorNotificacoes();
    };

    const marcarNotificacaoComoLida = (id) => {
        const notificacao = notificacoes.find(
            (item) => String(item.id) === String(id)
        );

        if (!notificacao) return;

        notificacao.lida = true;

        salvarStorage(
            STORAGE.notificacoes,
            notificacoes
        );

        renderizarNotificacoes();
        atualizarContadorNotificacoes();

        mostrarToast(
            "Notificação marcada como lida.",
            "info"
        );
    };

    const marcarTodasComoLidas = () => {
        notificacoes.forEach((item) => {
            item.lida = true;
        });

        salvarStorage(
            STORAGE.notificacoes,
            notificacoes
        );

        renderizarNotificacoes();
        atualizarContadorNotificacoes();
    };

    const fecharPainelNotificacoes = () => {
        if (!notificacoesPainel) return;

        notificacoesPainel.classList.remove("ativo");

        if (btnNotificacao) {
            btnNotificacao.classList.remove("ativo");
            btnNotificacao.setAttribute(
                "aria-expanded",
                "false"
            );
        }
    };

    const abrirPainelNotificacoes = () => {
        if (!notificacoesPainel) return;

        notificacoesPainel.classList.add("ativo");

        if (btnNotificacao) {
            btnNotificacao.classList.add("ativo");
            btnNotificacao.setAttribute(
                "aria-expanded",
                "true"
            );
        }

        renderizarNotificacoes();
    };

    if (btnNotificacao) {
        btnNotificacao.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();

            if (
                notificacoesPainel?.classList.contains("ativo")
            ) {
                fecharPainelNotificacoes();
            } else {
                abrirPainelNotificacoes();
            }
        });
    }

    if (fecharNotificacoes) {
        fecharNotificacoes.addEventListener(
            "click",
            fecharPainelNotificacoes
        );
    }

    document.addEventListener("click", (event) => {
        if (
            notificacoesPainel &&
            !notificacoesPainel.contains(event.target) &&
            !btnNotificacao?.contains(event.target)
        ) {
            fecharPainelNotificacoes();
        }
    });

    /* =========================================================
       7. TOAST
       ========================================================= */

    const mostrarToast = (
        mensagem,
        tipo = "sucesso"
    ) => {
        const antigo =
            $(".biblioteca-toast");

        if (antigo) {
            antigo.remove();
        }

        const toast =
            document.createElement("div");

        toast.className =
            `biblioteca-toast ${tipo}`;

        const icone =
            tipo === "erro"
                ? "⚠️"
                : tipo === "info"
                    ? "ℹ️"
                    : tipo === "aviso"
                        ? "⚠️"
                        : "✓";

        toast.innerHTML = `
            <span class="toast-icone">
                ${icone}
            </span>

            <span class="toast-texto">
                ${escaparHTML(mensagem)}
            </span>

            <button
                type="button"
                class="toast-fechar"
                aria-label="Fechar"
            >
                ×
            </button>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("mostrar");
        });

        let removendo = false;

        const fechar = () => {
            if (removendo) return;

            removendo = true;

            toast.classList.remove("mostrar");

            setTimeout(() => {
                toast.remove();
            }, 350);
        };

        $(".toast-fechar", toast)
            ?.addEventListener("click", fechar);

        setTimeout(fechar, 3500);
    };

    /* =========================================================
       8. FAVORITOS
       ========================================================= */

    const atualizarEstadoFavorito = (
        livro,
        botao
    ) => {
        if (!livro || !botao) return;

        const id = criarIdLivro(livro);

        const favorito =
            favoritos.includes(id);

        botao.classList.toggle(
            "favoritado",
            favorito
        );

        botao.textContent =
            favorito ? "♥" : "♡";

        botao.setAttribute(
            "aria-label",
            favorito
                ? "Remover dos favoritos"
                : "Adicionar aos favoritos"
        );

        botao.setAttribute(
            "aria-pressed",
            favorito ? "true" : "false"
        );
    };

    const atualizarContadorFavoritos = () => {
        if (!favoritosContador) return;

        const quantidade =
            favoritos.length;

        favoritosContador.textContent =
            `${quantidade} ${
                quantidade === 1
                    ? "livro"
                    : "livros"
            }`;
    };

    const animarNumero = (
        elemento,
        valor
    ) => {
        if (!elemento) return;

        const atual =
            Number(
                elemento.textContent
                    .replace(/\D/g, "")
            ) || 0;

        const destino =
            Number(valor) || 0;

        if (atual === destino) {
            elemento.textContent =
                destino;

            return;
        }

        const duracao = 500;
        const inicio = performance.now();

        const animar = (tempo) => {
            const progresso =
                Math.min(
                    (tempo - inicio) /
                        duracao,
                    1
                );

            const suavizado =
                1 -
                Math.pow(
                    1 - progresso,
                    3
                );

            const numero =
                Math.round(
                    atual +
                    (destino - atual) *
                        suavizado
                );

            elemento.textContent =
                numero;

            if (progresso < 1) {
                requestAnimationFrame(
                    animar
                );
            }
        };

        requestAnimationFrame(animar);
    };

    const atualizarContadores = () => {
        animarNumero(
            totalReservas,
            reservas.length
        );

        animarNumero(
            totalFavoritos,
            favoritos.length
        );

        animarNumero(
            totalPontos,
            pontos
        );

        atualizarContadorFavoritos();
    };

    const criarEfeitoCoracao = (
        elemento
    ) => {
        if (!elemento) return;

        const rect =
            elemento.getBoundingClientRect();

        const coracao =
            document.createElement("span");

        coracao.className =
            "coracao-flutuante";

        coracao.textContent = "♥";

        coracao.style.left =
            `${rect.left + rect.width / 2}px`;

        coracao.style.top =
            `${rect.top}px`;

        document.body.appendChild(
            coracao
        );

        setTimeout(() => {
            coracao.remove();
        }, 1000);
    };

    const alternarFavorito = (
        livro,
        botao
    ) => {
        const id =
            criarIdLivro(livro);

        if (!id) return;

        const indice =
            favoritos.indexOf(id);

        if (indice === -1) {
            favoritos.push(id);

            atualizarEstadoFavorito(
                livro,
                botao
            );

            criarEfeitoCoracao(botao);

            mostrarToast(
                `"${livro.dataset.titulo}" foi adicionado aos favoritos.`
            );

            adicionarNotificacao(
                "Novo favorito",
                `"${livro.dataset.titulo}" foi adicionado aos seus favoritos.`
            );
        } else {
            favoritos.splice(indice, 1);

            atualizarEstadoFavorito(
                livro,
                botao
            );

            mostrarToast(
                `"${livro.dataset.titulo}" foi removido dos favoritos.`,
                "info"
            );
        }

        salvarStorage(
            STORAGE.favoritos,
            favoritos
        );

        atualizarContadores();
        renderizarFavoritos();
    };

    const configurarFavoritos = () => {
        obterLivros().forEach((livro) => {
            const botao =
                $(".favorito-btn", livro);

            if (!botao) return;

            atualizarEstadoFavorito(
                livro,
                botao
            );

            if (
                botao.dataset.configurado ===
                "true"
            ) {
                return;
            }

            botao.dataset.configurado =
                "true";

            botao.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();
                    event.stopPropagation();

                    alternarFavorito(
                        livro,
                        botao
                    );
                }
            );
        });
    };

    const renderizarFavoritos = () => {
        if (!listaFavoritos) return;

        listaFavoritos.innerHTML = "";

        const livros =
            obterLivros();

        const livrosFavoritos =
            livros.filter((livro) =>
                favoritos.includes(
                    criarIdLivro(livro)
                )
            );

        if (!livrosFavoritos.length) {
            listaFavoritos.innerHTML = `
                <div class="sem-favoritos">
                    <div>❤️</div>

                    <h3>
                        Ainda não existem favoritos.
                    </h3>

                    <p>
                        Adicione livros aos favoritos
                        para encontrá-los rapidamente depois.
                    </p>
                </div>
            `;

            atualizarContadorFavoritos();

            return;
        }

        const fragmento =
            document.createDocumentFragment();

        livrosFavoritos.forEach((livro) => {
            const clone =
                livro.cloneNode(true);

            clone.classList.add(
                "favorito-renderizado"
            );

            const botao =
                $(".favorito-btn", clone);

            if (botao) {
                botao.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();
                        event.stopPropagation();

                        const original =
                            obterLivros().find(
                                (item) =>
                                    criarIdLivro(item) ===
                                    criarIdLivro(livro)
                            );

                        if (original) {
                            $(
                                ".favorito-btn",
                                original
                            )?.click();
                        }
                    }
                );
            }

            fragmento.appendChild(
                clone
            );
        });

        listaFavoritos.appendChild(
            fragmento
        );

        atualizarContadorFavoritos();
    };

    /* =========================================================
       9. RESERVAS
       ========================================================= */

    const encontrarReserva = (id) =>
        reservas.find(
            (reserva) =>
                String(
                    typeof reserva === "string"
                        ? reserva
                        : reserva.id
                ) === String(id)
        );

    const reservarLivro = (
        livro
    ) => {
        if (!livro) return;

        const dados =
            obterDadosLivro(livro);

        if (!dados) return;

        const reservaExistente =
            encontrarReserva(dados.id);

        if (reservaExistente) {
            mostrarToast(
                `"${dados.titulo}" já está reservado.`,
                "info"
            );

            return;
        }

        const reserva = {
            id: dados.id,
            titulo: dados.titulo,
            autor: dados.autor,
            data:
                new Date().toLocaleDateString(
                    "pt-PT"
                ),
            estado: dados.disponivel
                ? "Confirmada"
                : "Pendente"
        };

        reservas.push(reserva);

        pontos += 10;

        salvarStorage(
            STORAGE.reservas,
            reservas
        );

        salvarStorage(
            STORAGE.pontos,
            pontos
        );

        atualizarContadores();

        mostrarToast(
            `"${dados.titulo}" foi reservado com sucesso. +10 pontos.`
        );

        adicionarNotificacao(
            "Reserva realizada",
            `A reserva de "${dados.titulo}" foi realizada com sucesso.`
        );
    };

    const cancelarReserva = (
        id
    ) => {
        const reserva =
            encontrarReserva(id);

        if (!reserva) return;

        if (
            typeof reserva === "string"
        ) {
            reservas =
                reservas.filter(
                    (item) =>
                        item !== id
                );
        } else {
            if (
                ["Concluída", "Cancelada"]
                    .includes(
                        reserva.estado
                    )
            ) {
                mostrarToast(
                    "Esta reserva não pode ser cancelada.",
                    "erro"
                );

                return;
            }

            reserva.estado =
                "Cancelada";
        }

        salvarStorage(
            STORAGE.reservas,
            reservas
        );

        atualizarContadores();

        mostrarToast(
            "Reserva cancelada.",
            "info"
        );

        adicionarNotificacao(
            "Reserva cancelada",
            "A reserva foi cancelada."
        );

        renderizarReservas();
    };

    const renderizarReservas = () => {
        const lista =
            $("#listaReservas") ||
            $(".lista-reservas");

        if (!lista) return;

        lista.innerHTML = "";

        if (!reservas.length) {
            lista.innerHTML = `
                <div class="sem-favoritos">
                    <div>📚</div>
                    <h3>Não existem reservas.</h3>
                    <p>
                        Reserve um livro para
                        encontrá-lo nesta área.
                    </p>
                </div>
            `;

            return;
        }

        reservas.forEach((item) => {
            const reserva =
                typeof item === "string"
                    ? {
                        id: item,
                        titulo: item,
                        autor: "",
                        data: "",
                        estado: "Pendente"
                    }
                    : item;

            const elemento =
                document.createElement(
                    "article"
                );

            elemento.className =
                "reserva-card";

            elemento.innerHTML = `
                <div>
                    <h3>
                        ${escaparHTML(
                            reserva.titulo
                        )}
                    </h3>

                    <p>
                        ${escaparHTML(
                            reserva.autor
                        )}
                    </p>

                    <small>
                        Data:
                        ${escaparHTML(
                            reserva.data
                        )}
                    </small>

                    <strong>
                        ${escaparHTML(
                            reserva.estado
                        )}
                    </strong>
                </div>

                ${
                    ![
                        "Cancelada",
                        "Concluída"
                    ].includes(
                        reserva.estado
                    )
                        ? `
                            <button
                                type="button"
                                class="btn-cancelar-reserva"
                                data-id="${escaparHTML(
                                    reserva.id
                                )}"
                            >
                                Cancelar reserva
                            </button>
                        `
                        : ""
                }
            `;

            lista.appendChild(
                elemento
            );
        });

        $$(".btn-cancelar-reserva")
            .forEach((botao) => {
                botao.addEventListener(
                    "click",
                    () => {
                        const confirmar =
                            window.confirm(
                                "Deseja cancelar esta reserva?"
                            );

                        if (!confirmar) {
                            return;
                        }

                        cancelarReserva(
                            botao.dataset.id
                        );
                    }
                );
            });
    };

    const configurarReservas = () => {
        obterLivros().forEach((livro) => {
            const links =
                $$(
                    'a[href*="reserva" i], a[href*="Reserva" i], .btn-reservar',
                    livro
                );

            links.forEach((link) => {
                if (
                    link.dataset.configurado ===
                    "true"
                ) {
                    return;
                }

                link.dataset.configurado =
                    "true";

                link.addEventListener(
                    "click",
                    (event) => {
                        event.preventDefault();

                        reservarLivro(
                            livro
                        );

                        const destino =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            destino &&
                            destino !== "#"
                        ) {
                            setTimeout(() => {
                                window.location.href =
                                    destino;
                            }, 500);
                        }
                    }
                );
            });
        });
    };

    /* =========================================================
       10. PESQUISA
       ========================================================= */

    const pesquisarLivros = () => {
        if (!pesquisaLivro) return;

        const termo =
            normalizar(
                pesquisaLivro.value
            );

        const livros =
            obterLivros();

        let encontrados = 0;

        livros.forEach((livro) => {
            const dados =
                obterDadosLivro(
                    livro
                );

            const texto =
                normalizar(
                    [
                        dados?.titulo,
                        dados?.autor,
                        dados?.categoria,
                        dados?.descricao,
                        livro.textContent
                    ].join(" ")
                );

            const corresponde =
                !termo ||
                texto.includes(termo);

            livro.style.display =
                corresponde
                    ? ""
                    : "none";

            if (corresponde) {
                encontrados++;
            }
        });

        if (!resultadoPesquisa) {
            return;
        }

        if (!termo) {
            resultadoPesquisa.innerHTML =
                "";

            resultadoPesquisa.classList.remove(
                "ativo"
            );

            return;
        }

        resultadoPesquisa.classList.add(
            "ativo"
        );

        if (encontrados > 0) {
            resultadoPesquisa.innerHTML = `
                <span>🔎</span>
                <strong>
                    ${encontrados}
                </strong>
                ${
                    encontrados === 1
                        ? "livro encontrado"
                        : "livros encontrados"
                }
            `;
        } else {
            resultadoPesquisa.innerHTML = `
                <span>📚</span>

                <strong>
                    Nenhum livro encontrado.
                </strong>

                <button
                    type="button"
                    id="limparPesquisa"
                >
                    Limpar pesquisa
                </button>
            `;

            $("#limparPesquisa")
                ?.addEventListener(
                    "click",
                    () => {
                        pesquisaLivro.value =
                            "";

                        pesquisarLivros();

                        pesquisaLivro.focus();
                    }
                );
        }

        mostrarToast(
            `${encontrados} ${
                encontrados === 1
                    ? "livro encontrado"
                    : "livros encontrados"
            }.`,
            "info"
        );
    };

    if (btnPesquisar) {
        btnPesquisar.addEventListener(
            "click",
            pesquisarLivros
        );
    }

    if (pesquisaLivro) {
        pesquisaLivro.addEventListener(
            "input",
            pesquisarLivros
        );

        pesquisaLivro.addEventListener(
            "keydown",
            (event) => {
                if (event.key === "Enter") {
                    event.preventDefault();

                    pesquisarLivros();
                }
            }
        );
    }

    if (verTodosLivros) {
        verTodosLivros.addEventListener(
            "click",
            () => {
                const livros =
                    obterLivros();

                livros.forEach((livro) => {
                    livro.style.display =
                        "";
                });

                if (pesquisaLivro) {
                    pesquisaLivro.value =
                        "";
                }

                if (resultadoPesquisa) {
                    resultadoPesquisa.innerHTML =
                        "";

                    resultadoPesquisa.classList.remove(
                        "ativo"
                    );
                }

                if (listaLivros) {
                    listaLivros.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });
                }
            }
        );
    }

    /* =========================================================
       11. LEITURA
       ========================================================= */

    const obterIdLeituraAtual = () => {
        const livro =
            $(".continue-card") ||
            $(".leitura-container");

        return (
            livro?.dataset.id ||
            document.body.dataset.livroId ||
            "livro-principal"
        );
    };

    const obterProgresso = (
        id
    ) => {
        const valor =
            leitura[id];

        if (
            typeof valor === "number"
        ) {
            return Math.max(
                0,
                Math.min(
                    100,
                    valor
                )
            );
        }

        if (
            valor &&
            typeof valor === "object"
        ) {
            return Math.max(
                0,
                Math.min(
                    100,
                    Number(
                        valor.porcentagem ||
                        0
                    )
                )
            );
        }

        return 0;
    };

    const salvarProgresso = (
        id,
        porcentagem,
        pagina = null
    ) => {
        leitura[id] = {
            porcentagem:
                Math.max(
                    0,
                    Math.min(
                        100,
                        Number(
                            porcentagem
                        ) || 0
                    )
                ),
            pagina:
                pagina !== null
                    ? Number(pagina)
                    : 0,
            atualizadoEm:
                Date.now()
        };

        salvarStorage(
            STORAGE.leitura,
            leitura
        );
    };

    const atualizarBarrasLeitura = () => {
        const id =
            obterIdLeituraAtual();

        const progresso =
            obterProgresso(id);

        $$(".progresso-preenchido")
            .forEach((barra) => {
                barra.style.width =
                    `${progresso}%`;
            });

        $$(".progresso-topo strong")
            .forEach((elemento) => {
                elemento.textContent =
                    `${progresso}%`;
            });

        $$(".progresso-percentagem")
            .forEach((elemento) => {
                elemento.textContent =
                    `${progresso}%`;
            });
    };

    const continuarLeitura = () => {
        const id =
            obterIdLeituraAtual();

        let progresso =
            obterProgresso(id);

        progresso =
            progresso >= 100
                ? 0
                : Math.min(
                    progresso + 5,
                    100
                );

        salvarProgresso(
            id,
            progresso
        );

        atualizarBarrasLeitura();

        if (progresso >= 100) {
            pontos += 25;

            salvarStorage(
                STORAGE.pontos,
                pontos
            );

            atualizarContadores();

            mostrarToast(
                "Parabéns! Você concluiu a leitura e ganhou +25 pontos."
            );

            adicionarNotificacao(
                "Leitura concluída",
                "Parabéns! Você concluiu uma leitura e ganhou 25 pontos."
            );
        } else {
            mostrarToast(
                `Progresso atualizado para ${progresso}%.`,
                "info"
            );
        }
    };

    $$(".btn-continuar")
        .forEach((botao) => {
            botao.addEventListener(
                "click",
                (event) => {
                    event.preventDefault();

                    continuarLeitura();
                }
            );
        });

    const configurarLeituraPagina = () => {
        const anterior =
            $("#paginaAnterior") ||
            $(".pagina-anterior");

        const proxima =
            $("#paginaProxima") ||
            $(".pagina-proxima");

        const paginaAtual =
            $("#paginaAtual") ||
            $(".pagina-atual");

        const totalPaginas =
            $("#totalPaginas") ||
            $(".total-paginas");

        if (
            !paginaAtual ||
            !totalPaginas
        ) {
            return;
        }

        let pagina =
            Number(
                paginaAtual.textContent
            ) || 1;

        const total =
            Number(
                totalPaginas.textContent
            ) || 1;

        const atualizar = () => {
            pagina =
                Math.max(
                    1,
                    Math.min(
                        total,
                        pagina
                    )
                );

            paginaAtual.textContent =
                pagina;

            const progresso =
                Math.round(
                    (pagina / total) *
                        100
                );

            salvarProgresso(
                obterIdLeituraAtual(),
                progresso,
                pagina
            );

            atualizarBarrasLeitura();
        };

        anterior?.addEventListener(
            "click",
            () => {
                pagina--;

                atualizar();
            }
        );

        proxima?.addEventListener(
            "click",
            () => {
                pagina++;

                atualizar();
            }
        );
    };

    /* =========================================================
       12. DETALHES DO LIVRO
       ========================================================= */

    const configurarDetalhes = () => {
        const botoes =
            $$(
                ".btn-detalhes, #verDetalhesDestaque"
            );

        botoes.forEach((botao) => {
            botao.addEventListener(
                "click",
                (event) => {
                    const link =
                        botao.closest("a");

                    if (
                        link &&
                        link.getAttribute(
                            "href"
                        ) &&
                        link.getAttribute(
                            "href"
                        ) !== "#"
                    ) {
                        return;
                    }

                    event.preventDefault();

                    const secao =
                        botao.closest(
                            ".livro-destaque-section"
                        );

                    if (!secao) return;

                    const descricao =
                        $(".destaque-descricao", secao);

                    if (!descricao) return;

                    const aberto =
                        secao.classList.toggle(
                            "detalhes-abertos"
                        );

                    botao.textContent =
                        aberto
                            ? "Ocultar detalhes ↑"
                            : "Ver detalhes →";
                }
            );
        });
    };

    /* =========================================================
       13. PERFIL
       ========================================================= */

    const atualizarPerfil = () => {
        $$("[data-utilizador-nome]")
            .forEach((elemento) => {
                elemento.textContent =
                    utilizador.nome;
            });

        $$("[data-utilizador-email]")
            .forEach((elemento) => {
                elemento.textContent =
                    utilizador.email;
            });

        $$("[data-utilizador-pontos]")
            .forEach((elemento) => {
                elemento.textContent =
                    pontos;
            });

        const campos = {
            "#nomeUtilizador":
                utilizador.nome,

            "#emailUtilizador":
                utilizador.email
        };

        Object.entries(campos)
            .forEach(
                ([seletor, valor]) => {
                    const campo =
                        $(seletor);

                    if (campo) {
                        campo.value =
                            valor;
                    }
                }
            );
    };

    const configurarPerfil = () => {
        const formulario =
            $("#formPerfil");

        if (!formulario) return;

        formulario.addEventListener(
            "submit",
            (event) => {
                event.preventDefault();

                const nome =
                    $("#nomeUtilizador")
                        ?.value
                        .trim();

                const email =
                    $("#emailUtilizador")
                        ?.value
                        .trim();

                if (nome) {
                    utilizador.nome =
                        nome;
                }

                if (email) {
                    utilizador.email =
                        email;
                }

                salvarStorage(
                    STORAGE.utilizador,
                    utilizador
                );

                atualizarPerfil();

                mostrarToast(
                    "Perfil atualizado com sucesso."
                );
            }
        );
    };

    /* =========================================================
       14. DEFINIÇÕES
       ========================================================= */

    const aplicarPreferencias = () => {
        document.body.classList.toggle(
            "modo-escuro",
            Boolean(
                preferencias.modoEscuro
            )
        );

        document.body.classList.toggle(
            "sem-animacoes",
            !preferencias.animacoes
        );

        const checkboxNotificacoes =
            $("#notificacoesAtivas");

        if (checkboxNotificacoes) {
            checkboxNotificacoes.checked =
                Boolean(
                    preferencias.notificacoes
                );
        }

        const checkboxAnimacoes =
            $("#animacoesAtivas");

        if (checkboxAnimacoes) {
            checkboxAnimacoes.checked =
                Boolean(
                    preferencias.animacoes
                );
        }

        const checkboxEscuro =
            $("#modoEscuro");

        if (checkboxEscuro) {
            checkboxEscuro.checked =
                Boolean(
                    preferencias.modoEscuro
                );
        }
    };

    const configurarDefinicoes = () => {
        const elementos = {
            "#notificacoesAtivas":
                "notificacoes",

            "#animacoesAtivas":
                "animacoes",

            "#modoEscuro":
                "modoEscuro"
        };

        Object.entries(elementos)
            .forEach(
                ([seletor, chave]) => {
                    const elemento =
                        $(seletor);

                    if (!elemento) {
                        return;
                    }

                    elemento.addEventListener(
                        "change",
                        () => {
                            preferencias[
                                chave
                            ] =
                                elemento.checked;

                            salvarStorage(
                                STORAGE.preferencias,
                                preferencias
                            );

                            aplicarPreferencias();

                            mostrarToast(
                                "Preferência atualizada.",
                                "info"
                            );
                        }
                    );
                }
            );
    };

    /* =========================================================
       15. BOTÃO SAIR
       ========================================================= */

    if (btnSair) {
        btnSair.addEventListener(
            "click",
            (event) => {
                const confirmar =
                    window.confirm(
                        "Tem certeza que deseja sair da sua conta?"
                    );

                if (!confirmar) {
                    event.preventDefault();

                    return;
                }

                fecharMenu();

                mostrarToast(
                    "Sessão encerrada.",
                    "info"
                );
            }
        );
    }

    /* =========================================================
       16. LINKS INTERNOS
       ========================================================= */

    const configurarLinksInternos = () => {
        $$('a[href^="#"]')
            .forEach((link) => {
                link.addEventListener(
                    "click",
                    (event) => {
                        const href =
                            link.getAttribute(
                                "href"
                            );

                        if (
                            !href ||
                            href === "#"
                        ) {
                            event.preventDefault();

                            return;
                        }

                        let alvo;

                        try {
                            alvo =
                                document.querySelector(
                                    href
                                );
                        } catch {
                            return;
                        }

                        if (!alvo) return;

                        event.preventDefault();

                        fecharMenu();

                        alvo.scrollIntoView({
                            behavior:
                                preferencias.animacoes
                                    ? "smooth"
                                    : "auto",

                            block: "start"
                        });
                    }
                );
            });
    };

    /* =========================================================
       17. CATEGORIAS
       ========================================================= */

    const configurarCategorias = () => {
        const botoes =
            $$(
                "[data-categoria], .categoria-caixa"
            );

        botoes.forEach((botao) => {
            botao.addEventListener(
                "click",
                () => {
                    const categoria =
                        botao.dataset.categoria;

                    if (!categoria) {
                        return;
                    }

                    const campo =
                        $("#pesquisaLivro");

                    if (campo) {
                        campo.value =
                            categoria;

                        pesquisarLivros();
                    }

                    if (listaLivros) {
                        listaLivros.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });
                    }
                }
            );
        });
    };

    /* =========================================================
       18. ANIMAÇÕES DE ENTRADA
       ========================================================= */

    const configurarAnimacoesEntrada = () => {
        if (!preferencias.animacoes) {
            return;
        }

        document.body.classList.add(
            "pagina-carregada"
        );

        const elementos = [
            $(".header"),
            $(".menu"),
            $(".menu-lateral"),
            $(".boas-vindas"),
            $(".pesquisa-area"),
            $(".livro-destaque-section"),
            $(".atividade-section"),
            $(".livros-section"),
            $(".continue-section"),
            $(".categorias-section"),
            $(".descoberta-section"),
            $(".favoritos-section"),
            $(".futer"),
            $("footer")
        ].filter(Boolean);

        elementos.forEach(
            (elemento, index) => {
                elemento.classList.add(
                    "animacao-entrada"
                );

                elemento.style.setProperty(
                    "--delay-entrada",
                    `${index * 60}ms`
                );
            }
        );
    };

    /* =========================================================
       19. SCROLL REVEAL
       ========================================================= */

    const configurarScrollReveal = () => {
        if (
            !preferencias.animacoes
        ) {
            return;
        }

        const elementos = [
            ...$$(".atividade-card"),
            ...$$(".livro-card"),
            ...$$(".categoria-caixa"),
            ...$$(".continue-card"),
            ...$$(".notificacao-item"),
            ...$$(".footer-coluna"),
            ...$$(".footer-brand")
        ];

        if (
            !("IntersectionObserver" in window)
        ) {
            elementos.forEach(
                (elemento) => {
                    elemento.classList.add(
                        "visivel"
                    );
                }
            );

            return;
        }

        const observer =
            new IntersectionObserver(
                (entradas) => {
                    entradas.forEach(
                        (entrada) => {
                            if (
                                !entrada.isIntersecting
                            ) {
                                return;
                            }

                            entrada.target.classList.add(
                                "visivel"
                            );

                            observer.unobserve(
                                entrada.target
                            );
                        }
                    );
                },
                {
                    threshold: 0.12,

                    rootMargin:
                        "0px 0px -50px 0px"
                }
            );

        elementos.forEach(
            (elemento, index) => {
                elemento.classList.add(
                    "reveal"
                );

                elemento.style.setProperty(
                    "--reveal-delay",
                    `${(index % 6) * 70}ms`
                );

                observer.observe(
                    elemento
                );
            }
        );
    };

    /* =========================================================
       20. HOVER DOS CARDS
       ========================================================= */

    const configurarHoverCards = () => {
        if (
            !preferencias.animacoes
        ) {
            return;
        }

        const cards = [
            ...$$(".livro-card"),
            ...$$(".categoria-caixa"),
            ...$$(".atividade-card")
        ];

        cards.forEach((card) => {
            card.addEventListener(
                "pointermove",
                (event) => {
                    if (
                        window.innerWidth <
                        900
                    ) {
                        return;
                    }

                    const rect =
                        card.getBoundingClientRect();

                    const x =
                        ((event.clientX -
                            rect.left) /
                            rect.width) *
                        100;

                    const y =
                        ((event.clientY -
                            rect.top) /
                            rect.height) *
                        100;

                    card.style.setProperty(
                        "--mouse-x",
                        `${x}%`
                    );

                    card.style.setProperty(
                        "--mouse-y",
                        `${y}%`
                    );
                }
            );

            card.addEventListener(
                "pointerleave",
                () => {
                    card.style.removeProperty(
                        "--mouse-x"
                    );

                    card.style.removeProperty(
                        "--mouse-y"
                    );
                }
            );
        });
    };

    /* =========================================================
       21. IMAGENS
       ========================================================= */

    const configurarImagemFallback = () => {
        $$("img").forEach(
            (img) => {
                img.addEventListener(
                    "error",
                    () => {
                        img.classList.add(
                            "imagem-erro"
                        );

                        const container =
                            img.closest(
                                ".livro-capa, .destaque-capa, .continue-capa"
                            );

                        if (
                            container
                        ) {
                            container.classList.add(
                                "sem-imagem"
                            );
                        }
                    }
                );
            }
        );
    };

    /* =========================================================
       22. ATALHOS
       ========================================================= */

    const configurarAtalhos = () => {
        document.addEventListener(
            "keydown",
            (event) => {
                const elemento =
                    document.activeElement;

                const tag =
                    elemento?.tagName;

                if (
                    event.key === "/" &&
                    ![
                        "INPUT",
                        "TEXTAREA",
                        "SELECT"
                    ].includes(tag)
                ) {
                    event.preventDefault();

                    pesquisaLivro?.focus();
                }
            }
        );
    };

    /* =========================================================
       23. LOGO
       ========================================================= */

    const configurarAnimacaoLogo = () => {
        if (
            !preferencias.animacoes
        ) {
            return;
        }

        const logos = [
            $(".logo-icone"),
            $(".header-logo span"),
            $(".footer-logo")
        ].filter(Boolean);

        logos.forEach((logo) => {
            logo.addEventListener(
                "mouseenter",
                () => {
                    logo.classList.add(
                        "logo-animado"
                    );
                }
            );

            logo.addEventListener(
                "animationend",
                () => {
                    logo.classList.remove(
                        "logo-animado"
                    );
                }
            );
        });
    };

    /* =========================================================
       24. DESTAQUE
       ========================================================= */

    const configurarLivroDestaque = () => {
        const destaque =
            $(".livro-destaque-section");

        if (!destaque) return;

        const botaoReserva =
            $(
                'a[href*="reserva" i], .btn-reservar',
                destaque
            );

        if (botaoReserva) {
            botaoReserva.addEventListener(
                "click",
                (event) => {
                    const titulo =
                        destaque.dataset.titulo ||
                        $(".destaque-titulo", destaque)
                            ?.textContent
                            ?.trim() ||
                        "Livro em destaque";

                    const autor =
                        destaque.dataset.autor ||
                        $(".destaque-autor", destaque)
                            ?.textContent
                            ?.trim() ||
                        "";

                    const livroFake =
                        document.createElement(
                            "article"
                        );

                    livroFake.dataset.id =
                        destaque.dataset.id ||
                        normalizar(
                            titulo
                        )
                            .replace(
                                /[^a-z0-9]+/g,
                                "-"
                            );

                    livroFake.dataset.titulo =
                        titulo;

                    livroFake.dataset.autor =
                        autor;

                    livroFake.dataset.disponivel =
                        "true";

                    reservarLivro(
                        livroFake
                    );
                }
            );
        }
    };

    /* =========================================================
       25. ATUALIZAR DADOS DA PÁGINA
       ========================================================= */

    const atualizarDadosPagina = () => {
        atualizarContadores();

        atualizarContadorNotificacoes();

        atualizarPerfil();

        atualizarBarrasLeitura();

        aplicarPreferencias();
    };

    /* =========================================================
       26. INICIALIZAÇÃO
       ========================================================= */

    const iniciar = () => {
        configurarMenu();

        configurarFavoritos();

        configurarReservas();

        configurarCategorias();

        configurarDetalhes();

        configurarLivroDestaque();

        configurarPerfil();

        configurarDefinicoes();

        configurarLeituraPagina();

        configurarLinksInternos();

        configurarAnimacoesEntrada();

        configurarScrollReveal();

        configurarHoverCards();

        configurarImagemFallback();

        configurarAtalhos();

        configurarAnimacaoLogo();

        renderizarFavoritos();

        renderizarReservas();

        renderizarNotificacoes();

        atualizarDadosPagina();

        /*
         * Garante que o menu começa fechado
         * no mobile.
         */

        fecharMenu();

        /*
         * Mantém o painel de notificações fechado
         * ao carregar a página.
         */

        fecharPainelNotificacoes();

        /*
         * Define o estado inicial do botão hamburger.
         */

        if (abrirMenu) {
            abrirMenu.setAttribute(
                "aria-expanded",
                "false"
            );
        }

        console.log(
            "Biblioteca inicializada com sucesso."
        );
    };

    iniciar();
});
