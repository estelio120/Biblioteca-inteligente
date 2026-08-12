document.addEventListener("DOMContentLoaded", () => {
    "use strict";

    const $ = (selector, parent = document) => parent.querySelector(selector);
    const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)];

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
    const btnContinuar = $(".btn-continuar");

    const livros = $$(".livro-card");
    const menuItens = $$(".menu-item");
    const secoes = $$("main section");
    const linksInternos = $$('a[href^="#"]');

    const STORAGE_FAVORITOS = "biblioteca_favoritos";
    const STORAGE_RESERVAS = "biblioteca_reservas";
    const STORAGE_PONTOS = "biblioteca_pontos";
    const STORAGE_LEITURA = "biblioteca_leitura";

    let favoritos = JSON.parse(localStorage.getItem(STORAGE_FAVORITOS) || "[]");
    let reservas = JSON.parse(localStorage.getItem(STORAGE_RESERVAS) || "[]");
    let pontos = Number(localStorage.getItem(STORAGE_PONTOS) || 0);
    let leitura = Number(localStorage.getItem(STORAGE_LEITURA) || 35);

    const normalizar = texto =>
        String(texto || "")
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .trim();

    const salvarDados = () => {
        localStorage.setItem(STORAGE_FAVORITOS, JSON.stringify(favoritos));
        localStorage.setItem(STORAGE_RESERVAS, JSON.stringify(reservas));
        localStorage.setItem(STORAGE_PONTOS, String(pontos));
        localStorage.setItem(STORAGE_LEITURA, String(leitura));
    };

    const animarNumero = (elemento, valor) => {
        if (!elemento) return;

        const inicio = Number(elemento.textContent.replace(/\D/g, "")) || 0;
        const destino = Number(valor) || 0;
        const duracao = 700;
        const inicioTempo = performance.now();

        const atualizar = tempoAtual => {
            const progresso = Math.min((tempoAtual - inicioTempo) / duracao, 1);
            const suavizado = 1 - Math.pow(1 - progresso, 3);
            const numero = Math.round(inicio + (destino - inicio) * suavizado);

            elemento.textContent = numero;

            if (progresso < 1) {
                requestAnimationFrame(atualizar);
            }
        };

        requestAnimationFrame(atualizar);
    };

    const atualizarContadores = () => {
        animarNumero(totalReservas, reservas.length);
        animarNumero(totalFavoritos, favoritos.length);
        animarNumero(totalPontos, pontos);

        if (favoritosContador) {
            favoritosContador.textContent =
                `${favoritos.length} ${favoritos.length === 1 ? "livro" : "livros"}`;
        }
    };

    const criarIdLivro = livro => {
        const titulo = livro.dataset.titulo || "";
        const autor = livro.dataset.autor || "";

        return normalizar(`${titulo}-${autor}`)
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const mostrarToast = (mensagem, tipo = "sucesso") => {
        const antigo = $(".biblioteca-toast");

        if (antigo) {
            antigo.remove();
        }

        const toast = document.createElement("div");
        toast.className = `biblioteca-toast ${tipo}`;

        const icone = tipo === "erro"
            ? "⚠️"
            : tipo === "info"
                ? "ℹ️"
                : "✓";

        toast.innerHTML = `
            <span class="toast-icone">${icone}</span>
            <span class="toast-texto">${mensagem}</span>
            <button class="toast-fechar" aria-label="Fechar">×</button>
        `;

        document.body.appendChild(toast);

        requestAnimationFrame(() => {
            toast.classList.add("mostrar");
        });

        const fechar = () => {
            toast.classList.remove("mostrar");

            setTimeout(() => {
                toast.remove();
            }, 350);
        };

        $(".toast-fechar", toast).addEventListener("click", fechar);

        setTimeout(fechar, 3500);
    };

    const fecharMenu = () => {
        if (menuLateral) {
            menuLateral.classList.remove("aberto");
        }

        if (overlay) {
            overlay.classList.remove("ativo");
        }

        document.body.classList.remove("menu-aberto");
    };

    const abrirMenuMobile = () => {
        if (!menuLateral) return;

        menuLateral.classList.add("aberto");

        if (overlay) {
            overlay.classList.add("ativo");
        }

        document.body.classList.add("menu-aberto");
    };

    if (abrirMenu) {
        abrirMenu.addEventListener("click", () => {
            if (menuLateral?.classList.contains("aberto")) {
                fecharMenu();
            } else {
                abrirMenuMobile();
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", fecharMenu);
    }

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            fecharMenu();
            fecharPainelNotificacoes();
        }
    });

    menuItens.forEach(item => {
        const link = $("a", item);

        if (!link) return;

        link.addEventListener("click", () => {
            menuItens.forEach(outro => outro.classList.remove("ativo"));
            item.classList.add("ativo");

            if (window.innerWidth <= 900) {
                fecharMenu();
            }
        });
    });

    const fecharPainelNotificacoes = () => {
        if (!notificacoesPainel) return;

        notificacoesPainel.classList.remove("ativo");

        if (btnNotificacao) {
            btnNotificacao.classList.remove("ativo");
        }
    };

    if (btnNotificacao) {
        btnNotificacao.addEventListener("click", event => {
            event.stopPropagation();

            if (!notificacoesPainel) return;

            notificacoesPainel.classList.toggle("ativo");
            btnNotificacao.classList.toggle("ativo");
        });
    }

    if (fecharNotificacoes) {
        fecharNotificacoes.addEventListener("click", fecharPainelNotificacoes);
    }

    document.addEventListener("click", event => {
        if (
            notificacoesPainel &&
            !notificacoesPainel.contains(event.target) &&
            !btnNotificacao?.contains(event.target)
        ) {
            fecharPainelNotificacoes();
        }
    });

    const configurarFavoritos = () => {
        livros.forEach(livro => {
            const botao = $(".favorito-btn", livro);

            if (!botao) return;

            const id = criarIdLivro(livro);
            const estaFavorito = favoritos.includes(id);

            botao.classList.toggle("favoritado", estaFavorito);
            botao.textContent = estaFavorito ? "♥" : "♡";
            botao.setAttribute(
                "aria-label",
                estaFavorito
                    ? "Remover dos favoritos"
                    : "Adicionar aos favoritos"
            );

            botao.addEventListener("click", event => {
                event.preventDefault();
                event.stopPropagation();

                const indice = favoritos.indexOf(id);

                if (indice === -1) {
                    favoritos.push(id);
                    botao.classList.add("favoritado");
                    botao.textContent = "♥";
                    botao.setAttribute("aria-label", "Remover dos favoritos");

                    criarEfeitoCoracao(botao);
                    mostrarToast(
                        `"${livro.dataset.titulo}" foi adicionado aos favoritos.`
                    );
                } else {
                    favoritos.splice(indice, 1);
                    botao.classList.remove("favoritado");
                    botao.textContent = "♡";
                    botao.setAttribute("aria-label", "Adicionar aos favoritos");

                    mostrarToast(
                        `"${livro.dataset.titulo}" foi removido dos favoritos.`,
                        "info"
                    );
                }

                salvarDados();
                atualizarContadores();
                renderizarFavoritos();
            });
        });
    };

    const criarEfeitoCoracao = elemento => {
        const rect = elemento.getBoundingClientRect();

        const coracao = document.createElement("span");
        coracao.className = "coracao-flutuante";
        coracao.textContent = "♥";

        coracao.style.left = `${rect.left + rect.width / 2}px`;
        coracao.style.top = `${rect.top}px`;

        document.body.appendChild(coracao);

        setTimeout(() => {
            coracao.remove();
        }, 1000);
    };

    const renderizarFavoritos = () => {
        if (!listaFavoritos) return;

        listaFavoritos.innerHTML = "";

        const livrosFavoritos = livros.filter(livro =>
            favoritos.includes(criarIdLivro(livro))
        );

        if (!livrosFavoritos.length) {
            listaFavoritos.innerHTML = `
                <div class="sem-favoritos">
                    <div>❤️</div>
                    <h3>Ainda não tem favoritos</h3>
                    <p>
                        Clique no ❤️ dos livros que você mais gosta
                        para guardá-los aqui.
                    </p>
                </div>
            `;

            if (favoritosContador) {
                favoritosContador.textContent = "0 livros";
            }

            return;
        }

        const fragmento = document.createDocumentFragment();

        livrosFavoritos.forEach(livro => {
            const clone = livro.cloneNode(true);
            clone.classList.add("favorito-renderizado");

            const botao = $(".favorito-btn", clone);

            if (botao) {
                botao.addEventListener("click", () => {
                    const original = livros.find(
                        item => criarIdLivro(item) === criarIdLivro(livro)
                    );

                    if (original) {
                        const originalBotao = $(".favorito-btn", original);
                        originalBotao?.click();
                    }
                });
            }

            fragmento.appendChild(clone);
        });

        listaFavoritos.appendChild(fragmento);

        if (favoritosContador) {
            favoritosContador.textContent =
                `${livrosFavoritos.length} ${livrosFavoritos.length === 1 ? "livro" : "livros"}`;
        }
    };

    const reservarLivro = livro => {
        if (!livro) return;

        const id = criarIdLivro(livro);
        const titulo = livro.dataset.titulo;

        if (reservas.includes(id)) {
            mostrarToast(
                `"${titulo}" já está na sua lista de reservas.`,
                "info"
            );
            return;
        }

        reservas.push(id);
        pontos += 10;

        salvarDados();
        atualizarContadores();

        mostrarToast(
            `"${titulo}" foi reservado! Você ganhou +10 pontos.`
        );
    };

    const configurarReservas = () => {
        livros.forEach(livro => {
            const links = $$('a[href="Reserva.html"]', livro);

            links.forEach(link => {
                link.addEventListener("click", event => {
                    event.preventDefault();

                    reservarLivro(livro);

                    setTimeout(() => {
                        window.location.href = link.href;
                    }, 650);
                });
            });
        });

        const destaque = $(".livro-destaque-section");

        if (destaque) {
            const linkReserva = $('a[href="Reserva.html"]', destaque);

            linkReserva?.addEventListener("click", event => {
                event.preventDefault();

                const livroFake = {
                    dataset: {
                        titulo: "As 48 Leis do Poder",
                        autor: "Robert Greene"
                    }
                };

                reservarLivro(livroFake);

                setTimeout(() => {
                    window.location.href = linkReserva.href;
                }, 650);
            });
        }
    };

    const pesquisarLivros = () => {
        if (!listaLivros || !pesquisaLivro) return;

        const termo = normalizar(pesquisaLivro.value);

        let encontrados = 0;

        livros.forEach(livro => {
            const titulo = normalizar(livro.dataset.titulo);
            const autor = normalizar(livro.dataset.autor);
            const texto = normalizar(livro.textContent);

            const corresponde =
                !termo ||
                titulo.includes(termo) ||
                autor.includes(termo) ||
                texto.includes(termo);

            livro.style.display = corresponde ? "" : "none";

            if (corresponde) {
                encontrados++;
            }
        });

        if (!termo) {
            resultadoPesquisa.innerHTML = "";
            resultadoPesquisa.classList.remove("ativo");
            return;
        }

        resultadoPesquisa.classList.add("ativo");

        if (encontrados) {
            resultadoPesquisa.innerHTML = `
                <span>🔎</span>
                <strong>${encontrados}</strong>
                ${encontrados === 1 ? "livro encontrado" : "livros encontrados"}
            `;
        } else {
            resultadoPesquisa.innerHTML = `
                <span>📚</span>
                <strong>Nenhum livro encontrado.</strong>
                <button type="button" id="limparPesquisa">
                    Limpar pesquisa
                </button>
            `;

            $("#limparPesquisa")?.addEventListener("click", () => {
                pesquisaLivro.value = "";
                pesquisarLivros();
                pesquisaLivro.focus();
            });
        }
    };

    if (btnPesquisar) {
        btnPesquisar.addEventListener("click", pesquisarLivros);
    }

    if (pesquisaLivro) {
        pesquisaLivro.addEventListener("input", () => {
            pesquisarLivros();
        });

        pesquisaLivro.addEventListener("keydown", event => {
            if (event.key === "Enter") {
                event.preventDefault();
                pesquisarLivros();
            }
        });
    }

    if (verTodosLivros) {
        verTodosLivros.addEventListener("click", () => {
            if (!listaLivros) return;

            const escondidos = livros.filter(
                livro => livro.style.display === "none"
            );

            if (escondidos.length) {
                livros.forEach(livro => {
                    livro.style.display = "";
                });

                if (pesquisaLivro) {
                    pesquisaLivro.value = "";
                }

                if (resultadoPesquisa) {
                    resultadoPesquisa.innerHTML = "";
                    resultadoPesquisa.classList.remove("ativo");
                }

                verTodosLivros.textContent = "Ver todos →";

                mostrarToast("Todos os livros foram apresentados.", "info");
            } else {
                listaLivros.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            }
        });
    }

    if (verDetalhesDestaque) {
        verDetalhesDestaque.addEventListener("click", () => {
            const destaque = $(".livro-destaque-section");

            if (!destaque) return;

            const descricaoExistente = $(".destaque-descricao", destaque);

            if (!descricaoExistente) return;

            destaque.classList.toggle("detalhes-abertos");

            if (destaque.classList.contains("detalhes-abertos")) {
                verDetalhesDestaque.textContent = "Ocultar detalhes ↑";
                mostrarToast("Mais detalhes sobre o livro foram apresentados.", "info");
            } else {
                verDetalhesDestaque.textContent = "Ver detalhes →";
            }
        });
    }

    if (btnContinuar) {
        btnContinuar.addEventListener("click", () => {
            const progresso = $(".progresso-preenchido");
            const porcentagem = $(".progresso-topo strong");

            if (leitura < 100) {
                leitura = Math.min(leitura + 5, 100);
            } else {
                leitura = 0;
            }

            salvarDados();

            if (progresso) {
                progresso.style.width = `${leitura}%`;
            }

            if (porcentagem) {
                porcentagem.textContent = `${leitura}%`;
            }

            if (leitura >= 100) {
                pontos += 25;
                salvarDados();
                atualizarContadores();

                mostrarToast(
                    "Parabéns! Você concluiu a leitura e ganhou +25 pontos."
                );
            } else {
                mostrarToast(
                    `Progresso atualizado para ${leitura}%.`,
                    "info"
                );
            }

            btnContinuar.classList.add("clicado");

            setTimeout(() => {
                btnContinuar.classList.remove("clicado");
            }, 500);
        });
    }

    const configurarProgresso = () => {
        const barra = $(".progresso-preenchido");
        const porcentagem = $(".progresso-topo strong");

        if (!barra || !porcentagem) return;

        barra.style.width = "0%";

        setTimeout(() => {
            barra.style.width = `${leitura}%`;
            porcentagem.textContent = `${leitura}%`;
        }, 700);
    };

    const configurarAnimacoesEntrada = () => {
        document.body.classList.add("pagina-carregada");

        const elementos = [
            $(".header"),
            $(".menu"),
            $(".boas-vindas"),
            $(".pesquisa-area"),
            $(".livro-destaque-section"),
            $(".atividade-section"),
            $(".livros-section"),
            $(".continue-section"),
            $(".categorias-section"),
            $(".descoberta-section"),
            $(".favoritos-section"),
            $(".futer")
        ].filter(Boolean);

        elementos.forEach((elemento, index) => {
            elemento.classList.add("animacao-entrada");

            elemento.style.setProperty(
                "--delay-entrada",
                `${index * 70}ms`
            );
        });
    };

    const configurarScrollReveal = () => {
        const elementos = [
            ...$$(".atividade-card"),
            ...$$(".livro-card"),
            ...$$(".categoria-caixa"),
            ...$$(".continue-card"),
            ...$$(".notificacao-item"),
            ...$$(".footer-coluna"),
            ...$$(".footer-brand")
        ];

        if (!("IntersectionObserver" in window)) {
            elementos.forEach(elemento =>
                elemento.classList.add("visivel")
            );
            return;
        }

        const observer = new IntersectionObserver(
            entradas => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        entrada.target.classList.add("visivel");
                        observer.unobserve(entrada.target);
                    }
                });
            },
            {
                threshold: 0.12,
                rootMargin: "0px 0px -50px 0px"
            }
        );

        elementos.forEach((elemento, index) => {
            elemento.classList.add("reveal");

            elemento.style.setProperty(
                "--reveal-delay",
                `${(index % 6) * 80}ms`
            );

            observer.observe(elemento);
        });
    };

    const configurarHoverCards = () => {
        const cards = [
            ...$$(".livro-card"),
            ...$$(".categoria-caixa"),
            ...$$(".atividade-card")
        ];

        cards.forEach(card => {
            card.addEventListener("pointermove", event => {
                if (window.innerWidth < 900) return;

                const rect = card.getBoundingClientRect();

                const x =
                    ((event.clientX - rect.left) / rect.width) * 100;

                const y =
                    ((event.clientY - rect.top) / rect.height) * 100;

                card.style.setProperty("--mouse-x", `${x}%`);
                card.style.setProperty("--mouse-y", `${y}%`);
            });

            card.addEventListener("pointerleave", () => {
                card.style.removeProperty("--mouse-x");
                card.style.removeProperty("--mouse-y");
            });
        });
    };

    const configurarLinksInternos = () => {
        linksInternos.forEach(link => {
            link.addEventListener("click", event => {
                const href = link.getAttribute("href");

                if (!href || href === "#") {
                    event.preventDefault();
                    return;
                }

                const alvo = document.querySelector(href);

                if (!alvo) return;

                event.preventDefault();

                fecharMenu();

                alvo.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });
            });
        });
    };

    const configurarSecaoAtiva = () => {
        const secoesObservadas = secoes.filter(
            secao => secao.id
        );

        if (!secoesObservadas.length) return;

        if (!("IntersectionObserver" in window)) return;

        const observer = new IntersectionObserver(
            entradas => {
                entradas.forEach(entrada => {
                    if (!entrada.isIntersecting) return;

                    const id = entrada.target.id;

                    menuItens.forEach(item => {
                        const link = $("a", item);

                        if (!link) return;

                        const href = link.getAttribute("href");

                        item.classList.toggle(
                            "ativo",
                            href === `#${id}`
                        );
                    });
                });
            },
            {
                threshold: 0.35,
                rootMargin: "-80px 0px -40% 0px"
            }
        );

        secoesObservadas.forEach(secao =>
            observer.observe(secao)
        );
    };

    const configurarParallax = () => {
        const destaque = $(".livro-destaque-section");
        const capa = $(".destaque-capa");

        if (!destaque || !capa) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        let ticking = false;

        const atualizar = () => {
            if (window.innerWidth <= 900) {
                capa.style.transform = "";
                ticking = false;
                return;
            }

            const rect = destaque.getBoundingClientRect();
            const centroTela = window.innerHeight / 2;
            const centroSecao = rect.top + rect.height / 2;

            const distancia = (centroSecao - centroTela) * 0.015;

            capa.style.transform =
                `translateY(${distancia}px)`;

            ticking = false;
        };

        window.addEventListener("scroll", () => {
            if (!ticking) {
                requestAnimationFrame(atualizar);
                ticking = true;
            }
        });

        atualizar();
    };

    const configurarImagemFallback = () => {
        const imagens = $$("img");

        imagens.forEach(img => {
            img.addEventListener("error", () => {
                img.classList.add("imagem-erro");

                const container = img.closest(
                    ".livro-capa, .destaque-capa, .continue-capa"
                );

                if (!container) return;

                container.classList.add("sem-imagem");
            });
        });
    };

    const configurarBotaoSair = () => {
        if (!btnSair) return;

        btnSair.addEventListener("click", event => {
            const confirmar = window.confirm(
                "Tem certeza que deseja sair da sua conta?"
            );

            if (!confirmar) {
                event.preventDefault();
            }
        });
    };

    const configurarTeclasAtalho = () => {
        document.addEventListener("keydown", event => {
            const tag = document.activeElement?.tagName;

            if (
                event.key === "/" &&
                !["INPUT", "TEXTAREA", "SELECT"].includes(tag)
            ) {
                event.preventDefault();
                pesquisaLivro?.focus();
            }
        });
    };

    const configurarAnimacaoLogo = () => {
        const logos = [
            $(".logo-icone"),
            $(".header-logo span"),
            $(".footer-logo")
        ].filter(Boolean);

        logos.forEach(logo => {
            logo.addEventListener("mouseenter", () => {
                logo.classList.add("logo-animado");
            });

            logo.addEventListener("animationend", () => {
                logo.classList.remove("logo-animado");
            });
        });
    };

    const iniciar = () => {
        configurarFavoritos();
        configurarReservas();

        atualizarContadores();
        renderizarFavoritos();

        configurarProgresso();

        configurarAnimacoesEntrada();
        configurarScrollReveal();
        configurarHoverCards();
        configurarLinksInternos();
        configurarSecaoAtiva();
        configurarParallax();
        configurarImagemFallback();
        configurarBotaoSair();
        configurarTeclasAtalho();
        configurarAnimacaoLogo();

        window.addEventListener("resize", () => {
            if (window.innerWidth > 900) {
                fecharMenu();
            }
        });

        document.documentElement.style.scrollBehavior = "smooth";
    };

    iniciar();
});
