// filepath: [app.js](http://_vscodecontentref_/1)
const mainContent = document.querySelector('.main-content');
const sidebarLinks = document.querySelectorAll('.sidebar li');
const searchInput = document.querySelector('.search');

const pages = {
    'Início': `
        <h2>Recomendados para você</h2>
        <div class="anime-grid">
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Anime+1" alt="Anime 1">
                <div class="anime-title">Anime 1</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Anime+2" alt="Anime 2">
                <div class="anime-title">Anime 2</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Anime+3" alt="Anime 3">
                <div class="anime-title">Anime 3</div>
            </div>
        </div>
    `,
    'Populares': `
        <h2>Animes Populares</h2>
        <div class="anime-grid">
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Naruto" alt="Naruto">
                <div class="anime-title">Naruto</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=One+Piece" alt="One Piece">
                <div class="anime-title">One Piece</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Attack+on+Titan" alt="Attack on Titan">
                <div class="anime-title">Attack on Titan</div>
            </div>
        </div>
    `,
    'Novos Episódios': `
        <h2>Novos Episódios</h2>
        <div class="anime-grid">
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Demon+Slayer" alt="Demon Slayer">
                <div class="anime-title">Demon Slayer</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Jujutsu+Kaisen" alt="Jujutsu Kaisen">
                <div class="anime-title">Jujutsu Kaisen</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Solo+Leveling" alt="Solo Leveling">
                <div class="anime-title">Solo Leveling</div>
            </div>
        </div>
    `,
    'Favoritos': `
        <h2>Seus Favoritos</h2>
        <div class="anime-grid">
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Favorito+1" alt="Favorito 1">
                <div class="anime-title">Favorito 1</div>
            </div>
            <div class="anime-card">
                <img src="https://placehold.co/240x135/222/fff?text=Favorito+2" alt="Favorito 2">
                <div class="anime-title">Favorito 2</div>
            </div>
        </div>
    `
};

// Função para buscar animes populares da AnFireAPI
async function fetchAnimes(tipo = 'populares') {
    let url = '';
    if (tipo === 'populares' || tipo === 'inicio') {
        url = 'https://api.jikan.moe/v4/top/anime?limit=18';
    } else if (tipo === 'novos') {
        url = 'https://api.jikan.moe/v4/seasons/now?limit=18';
    } else {
        url = 'https://api.jikan.moe/v4/anime?limit=18';
    }
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error('Erro HTTP:', res.status);
            return [];
        }
        const data = await res.json();
        // Jikan retorna os animes em data.data
        return data.data || [];
    } catch (e) {
        console.error('Erro ao buscar animes:', e);
        return [];
    }
}

// Função para buscar animes por nome
async function searchAnimes(query) {
    if (!query || query.length < 2) return [];
    const url = `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(query)}&limit=18`;
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.error('Erro HTTP:', res.status);
            return [];
        }
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        console.error('Erro ao buscar animes:', e);
        return [];
    }
}

// Função para montar os cards de anime
function renderAnimeGrid(animes) {
    if (!animes || animes.length === 0) {
        return `<div style="text-align:center; color:#aaa; margin:40px 0;">Nenhum anime encontrado.</div>`;
    }
    return `
        <div class="anime-grid">
            ${animes.map(anime => `
                <div class="anime-card" data-anime-id="${anime.mal_id}">
                    <img src="${anime.images?.jpg?.image_url || 'https://placehold.co/240x135/222/fff?text=Sem+Capa'}" alt="${anime.title}">
                    <div class="anime-title">${anime.title}</div>
                    <div class="anime-desc">${anime.synopsis ? anime.synopsis.substring(0, 80) + '...' : ''}</div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAnimeCarousel(animes, carouselId) {
    if (!animes || animes.length === 0) {
        return `<div style="text-align:center; color:#aaa; margin:40px 0;">Nenhum anime encontrado.</div>`;
    }
    return `
        <div class="anime-carousel-wrapper">
            <button class="carousel-arrow left" onclick="document.getElementById('${carouselId}').scrollBy({left:-400,behavior:'smooth'})">&#8592;</button>
            <div class="anime-carousel" id="${carouselId}">
                ${animes.map(anime => `
                    <div class="anime-card" data-anime-id="${anime.mal_id}">
                        <img src="${anime.images?.jpg?.image_url || 'https://placehold.co/240x135/222/fff?text=Sem+Capa'}" alt="${anime.title}">
                        <div class="anime-title">${anime.title}</div>
                        <div class="anime-desc">${anime.synopsis ? anime.synopsis.substring(0, 80) + '...' : ''}</div>
                    </div>
                `).join('')}
            </div>
            <button class="carousel-arrow right" onclick="document.getElementById('${carouselId}').scrollBy({left:400,behavior:'smooth'})">&#8594;</button>
        </div>
    `;
}

async function renderHome() {
    mainContent.innerHTML = `
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Recomendados para você</div>
            <div id="carousel-recomendados">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Novos Lançamentos</div>
            <div id="carousel-novos">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Aventura</div>
            <div id="carousel-aventura">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Comédia</div>
            <div id="carousel-comedia">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Shounen</div>
            <div id="carousel-shounen">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Drama</div>
            <div id="carousel-drama">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Fantasia</div>
            <div id="carousel-fantasia">Carregando...</div>
        </div>
        <div class="anime-carousel-section">
            <div class="anime-carousel-title">Slice of Life</div>
            <div id="carousel-sliceoflife">Carregando...</div>
        </div>
    `;

    // Populares (Recomendados)
    const recomendados = await fetchAnimes('populares');
    document.getElementById('carousel-recomendados').innerHTML = renderAnimeCarousel(recomendados, 'carousel-recomendados-list');
    addAnimeCardClickEvents();

    // Novos lançamentos
    const novos = await fetchAnimes('novos');
    document.getElementById('carousel-novos').innerHTML = renderAnimeCarousel(novos, 'carousel-novos-list');
    addAnimeCardClickEvents();

    // Gêneros (IDs do MyAnimeList)
    const aventura = await fetchAnimesByGenre(2); // Adventure
    document.getElementById('carousel-aventura').innerHTML = renderAnimeCarousel(aventura, 'carousel-aventura-list');
    addAnimeCardClickEvents();

    const comedia = await fetchAnimesByGenre(4); // Comedy
    document.getElementById('carousel-comedia').innerHTML = renderAnimeCarousel(comedia, 'carousel-comedia-list');
    addAnimeCardClickEvents();

    const shounen = await fetchAnimesByGenre(27); // Shounen
    document.getElementById('carousel-shounen').innerHTML = renderAnimeCarousel(shounen, 'carousel-shounen-list');
    addAnimeCardClickEvents();

    const drama = await fetchAnimesByGenre(8); // Drama
    document.getElementById('carousel-drama').innerHTML = renderAnimeCarousel(drama, 'carousel-drama-list');
    addAnimeCardClickEvents();

    const fantasia = await fetchAnimesByGenre(10); // Fantasy
    document.getElementById('carousel-fantasia').innerHTML = renderAnimeCarousel(fantasia, 'carousel-fantasia-list');
    addAnimeCardClickEvents();

    const sliceoflife = await fetchAnimesByGenre(36); // Slice of Life
    document.getElementById('carousel-sliceoflife').innerHTML = renderAnimeCarousel(sliceoflife, 'carousel-sliceoflife-list');
    addAnimeCardClickEvents();
}

// Função para buscar por gênero
async function fetchAnimesByGenre(genreId) {
    const url = `https://api.jikan.moe/v4/anime?genres=${genreId}&limit=30&order_by=score`;
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        return [];
    }
}

sidebarLinks.forEach(link => {
    link.addEventListener('click', async () => {
        sidebarLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        searchInput.value = '';
        if (link.textContent === 'Início') {
            await renderHome();
        } else if (link.textContent === 'Populares') {
            mainContent.innerHTML = '<h2>Animes Populares</h2><div class="anime-grid">Carregando...</div>';
            const animes = await fetchAnimes('populares');
            mainContent.innerHTML = '<h2>Animes Populares</h2>' + renderAnimeGrid(animes);
            addAnimeCardClickEvents(); // <-- ADICIONE AQUI
        } else if (link.textContent === 'Novos Episódios') {
            mainContent.innerHTML = '<h2>Novos Episódios</h2><div class="anime-grid">Carregando...</div>';
            const animes = await fetchAnimes('novos');
            mainContent.innerHTML = '<h2>Novos Episódios</h2>' + renderAnimeGrid(animes);
            addAnimeCardClickEvents(); // <-- ADICIONE AQUI
        } else if (link.textContent === 'Favoritos') {
            if (!loggedUser) {
                mainContent.innerHTML = `
                    <div style="text-align:center; margin-top:40px;">
                        <h2>Favoritos</h2>
                        <p>Você precisa estar logado para ver seus favoritos.</p>
                        <button class="login-btn" style="margin-top:16px;">Entrar</button>
                    </div>
                `;
                document.querySelector('.main-content .login-btn').onclick = () => {
                    modal.classList.remove('hidden');
                    renderLoginForm();
                };
            } else {
                // Busca IDs dos favoritos
                const favoritos = JSON.parse(localStorage.getItem(`favoritos_${loggedUser}`) || '[]');
                if (favoritos.length === 0) {
                    mainContent.innerHTML = `<h2>Seus Favoritos</h2><div style="text-align:center; color:#aaa; margin:40px 0;">Nenhum anime favoritado ainda.</div>`;
                    return;
                }
                mainContent.innerHTML = `<h2>Seus Favoritos</h2><div class="anime-grid">Carregando...</div>`;
                // Busca detalhes de todos os favoritos
                const animes = [];
                for (const id of favoritos) {
                    const anime = await fetchAnimeDetail(id);
                    if (anime) animes.push(anime);
                }
                mainContent.innerHTML = `<h2>Seus Favoritos</h2>` + renderAnimeGrid(animes);
                addAnimeCardClickEvents();
            }
        } else {
            mainContent.innerHTML = '<h2>Página não encontrada</h2>';
        }
    });
});

// Destaque inicial
sidebarLinks[0].classList.add('active');

// --- AUTENTICAÇÃO SIMPLES (FRONTEND) ---
const loginBtn = document.querySelector('.login-btn');
const modal = document.getElementById('auth-modal');
const closeModal = document.querySelector('.close-modal');
const authForms = document.getElementById('auth-forms');

let users = JSON.parse(localStorage.getItem('users') || '{}');
let loggedUser = localStorage.getItem('loggedUser') || null;

function renderLoginForm(error = '') {
    authForms.innerHTML = `
        <form class="auth-form" id="login-form">
            <h3>Entrar</h3>
            <input type="text" name="user" placeholder="Usuário" required>
            <input type="password" name="pass" placeholder="Senha" required>
            ${error ? `<div class="error-msg">${error}</div>` : ''}
            <button type="submit">Entrar</button>
            <button type="button" class="switch-auth">Criar conta</button>
        </form>
    `;
    document.querySelector('.switch-auth').onclick = () => renderRegisterForm();
    document.getElementById('login-form').onsubmit = e => {
        e.preventDefault();
        const user = e.target.user.value.trim();
        const pass = e.target.pass.value;
        if (users[user] && users[user] === pass) {
            loggedUser = user;
            localStorage.setItem('loggedUser', user);
            modal.classList.add('hidden');
            updateLoginUI();
        } else {
            renderLoginForm('Usuário ou senha inválidos.');
        }
    };
}

function renderRegisterForm(error = '') {
    authForms.innerHTML = `
        <form class="auth-form" id="register-form">
            <h3>Criar Conta</h3>
            <input type="text" name="user" placeholder="Usuário" required>
            <input type="password" name="pass" placeholder="Senha" required>
            ${error ? `<div class="error-msg">${error}</div>` : ''}
            <button type="submit">Cadastrar</button>
            <button type="button" class="switch-auth">Já tenho conta</button>
        </form>
    `;
    document.querySelector('.switch-auth').onclick = () => renderLoginForm();
    document.getElementById('register-form').onsubmit = e => {
        e.preventDefault();
        const user = e.target.user.value.trim();
        const pass = e.target.pass.value;
        if (users[user]) {
            renderRegisterForm('Usuário já existe.');
        } else if (user.length < 3 || pass.length < 3) {
            renderRegisterForm('Usuário e senha devem ter pelo menos 3 caracteres.');
        } else {
            users[user] = pass;
            localStorage.setItem('users', JSON.stringify(users));
            renderLoginForm('Conta criada! Faça login.');
        }
    };
}

function updateLoginUI() {
    if (loggedUser) {
        loginBtn.textContent = `Olá, ${loggedUser}`;
        loginBtn.onclick = () => {
            if (confirm('Deseja sair?')) {
                loggedUser = null;
                localStorage.removeItem('loggedUser');
                updateLoginUI();
            }
        };
    } else {
        loginBtn.textContent = 'Entrar';
        loginBtn.onclick = () => {
            modal.classList.remove('hidden');
            renderLoginForm();
        };
    }
}

// Modal
closeModal.onclick = () => modal.classList.add('hidden');
window.onclick = e => { if (e.target === modal) modal.classList.add('hidden'); };

// Inicialização
updateLoginUI();

// Carregar populares ao iniciar
window.addEventListener('DOMContentLoaded', async () => {
    sidebarLinks.forEach(l => l.classList.remove('active'));
    sidebarLinks[0].classList.add('active'); // Início
    mainContent.innerHTML = '<h2>Recomendados para você</h2><div class="anime-grid">Carregando...</div>';
    const animes = await fetchAnimes('populares'); // ou 'todos'
    mainContent.innerHTML = '<h2>Recomendados para você</h2>' + renderAnimeGrid(animes);
});

searchInput.addEventListener('keydown', async (e) => {
    if (e.key === 'Enter') {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            sidebarLinks[0].classList.add('active'); // Início
            mainContent.innerHTML = '<h2>Recomendados para você</h2><div class="anime-grid">Carregando...</div>';
            const animes = await fetchAnimes('populares');
            mainContent.innerHTML = '<h2>Recomendados para você</h2>' + renderAnimeGrid(animes);
            addAnimeCardClickEvents(); // <-- ADICIONE AQUI
            return;
        }
        if (query.length < 2) {
            mainContent.innerHTML = `<div style="text-align:center; color:#aaa; margin:40px 0;">Digite pelo menos 2 letras para pesquisar.</div>`;
            return;
        }
        mainContent.innerHTML = `<h2>Resultados para "${query}"</h2><div class="anime-grid">Carregando...</div>`;
        const animes = await searchAnimes(query);
        mainContent.innerHTML = `<h2>Resultados para "${query}"</h2>` + renderAnimeGrid(animes);
        addAnimeCardClickEvents(); // <-- ADICIONE AQUI
        sidebarLinks.forEach(l => l.classList.remove('active'));
    }
});

searchInput.value = '';

// Permite rolar o carrossel com o scroll do mouse
document.addEventListener('DOMContentLoaded', () => {
    document.body.addEventListener('wheel', function(e) {
        const el = e.target.closest('.anime-carousel');
        if (el && el.matches('.anime-carousel')) {
            e.preventDefault();
            el.scrollLeft += e.deltaY;
        }
    }, { passive: false });
});

function addAnimeCardClickEvents() {
    document.querySelectorAll('.anime-card[data-anime-id]').forEach(card => {
        card.onclick = () => {
            const animeId = card.getAttribute('data-anime-id');
            renderAnimeDetail(animeId);
        };
    });
}

async function fetchAnimeDetail(animeId) {
    const url = `https://api.jikan.moe/v4/anime/${animeId}/full`;
    try {
        const res = await fetch(url);
        if (!res.ok) return null;
        const data = await res.json();
        return data.data;
    } catch (e) {
        return null;
    }
}

async function fetchAnimeEpisodes(animeId) {
    const url = `https://api.jikan.moe/v4/anime/${animeId}/episodes?limit=100`;
    try {
        const res = await fetch(url);
        if (!res.ok) return [];
        const data = await res.json();
        return data.data || [];
    } catch (e) {
        return [];
    }
}

async function renderAnimeDetail(animeId) {
    mainContent.innerHTML = '<div style="text-align:center;margin:40px 0;">Carregando detalhes...</div>';
    const anime = await fetchAnimeDetail(animeId);
    if (!anime) {
        mainContent.innerHTML = '<div style="text-align:center;margin:40px 0;">Anime não encontrado.</div>';
        return;
    }
    const episodes = await fetchAnimeEpisodes(animeId);
    const sinopseTraduzida = await traduzirTexto(anime.synopsis, 'pt');

    // Favoritos do usuário logado
    let favoritos = [];
    if (loggedUser) {
        favoritos = JSON.parse(localStorage.getItem(`favoritos_${loggedUser}`) || '[]');
    }
    const isFavorito = favoritos.includes(animeId.toString());

    let episodiosHtml = '';
    if (episodes.length > 0) {
        for (const ep of episodes) {
            const tituloEp = await traduzirTexto(ep.title, 'pt');
            episodiosHtml += `
                <div class="anime-episode">
                    <button class="ep-link-btn" data-ep="${ep.mal_id}" style="background:none;border:none;color:var(--primary);cursor:pointer;">
                        <b>Episódio ${ep.mal_id}:</b> ${tituloEp || 'Sem título'}
                    </button>
                    ${ep.aired ? `<span style="color:#aaa;font-size:0.95em;"> (${ep.aired})</span>` : ''}
                </div>
            `;
        }
    } else {
        episodiosHtml = '<div style="color:#aaa;">Episódios não disponíveis.</div>';
    }

    const hasPtBr = anime.title_synonyms?.some(t => t.toLowerCase().includes('portuguese')) || anime.title_english?.toLowerCase().includes('portuguese');

    mainContent.innerHTML = `
        <div class="anime-detail">
            <button class="back-btn" onclick="renderHome()">&#8592; Voltar</button>
            <button class="fav-btn${isFavorito ? ' favorited' : ''}" id="fav-btn" style="float:right;">
                <span style="font-size:1.2em;">${isFavorito ? '★' : '☆'}</span>
                ${isFavorito ? 'Remover dos Favoritos' : 'Favoritar'}
            </button>
            <div class="anime-detail-header">
                <img class="anime-detail-cover" src="${anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url}" alt="${anime.title}">
                <div class="anime-detail-info">
                    <h2>${anime.title}</h2>
                    <div class="anime-detail-meta">
                        <span><b>Temporada:</b> ${anime.season ? anime.season.charAt(0).toUpperCase() + anime.season.slice(1) : 'N/A'} ${anime.year || ''}</span><br>
                        <span><b>Episódios:</b> ${anime.episodes || 'N/A'}</span><br>
                        <span><b>Status:</b> ${anime.status === 'Currently Airing' ? 'Em exibição' : anime.status === 'Finished Airing' ? 'Finalizado' : anime.status}</span><br>
                        <span><b>Nota:</b> ${anime.score || 'N/A'}</span><br>
                        <span><b>Idiomas:</b> Legendado em PT-BR${hasPtBr ? ', Dublado em PT-BR' : ''}</span>
                    </div>
                    <div class="anime-detail-synopsis"><b>Sinopse:</b><br>${sinopseTraduzida || 'Sem sinopse.'}</div>
                </div>
            </div>
            <h3 style="margin-top:32px;">Lista de Episódios</h3>
            <div class="anime-episodes-list">
                ${episodiosHtml}
            </div>
        </div>
    `;

    // Evento do botão de favoritos
    const favBtn = document.getElementById('fav-btn');
    if (favBtn) {
        favBtn.onclick = () => {
            if (!loggedUser) {
                alert('Você precisa estar logado para favoritar animes.');
                return;
            }
            let favoritos = JSON.parse(localStorage.getItem(`favoritos_${loggedUser}`) || '[]');
            const idx = favoritos.indexOf(animeId.toString());
            if (idx === -1) {
                favoritos.push(animeId.toString());
            } else {
                favoritos.splice(idx, 1);
            }
            localStorage.setItem(`favoritos_${loggedUser}`, JSON.stringify(favoritos));
            renderAnimeDetail(animeId); // Atualiza o botão
        };
    }

    document.querySelectorAll('.ep-link-btn').forEach(btn => {
        btn.onclick = () => renderEpisodePlayer(anime.mal_id, btn.getAttribute('data-ep'));
    });
}

async function renderEpisodePlayer(animeId, episodeNumber) {
    mainContent.innerHTML = '<div style="text-align:center;margin:40px 0;">Carregando episódio...</div>';
    const anime = await fetchAnimeDetail(animeId);
    const episodes = await fetchAnimeEpisodes(animeId);

    const currentEp = episodes.find(ep => ep.mal_id == episodeNumber || ep.episode == episodeNumber);
    if (!currentEp) {
        mainContent.innerHTML = '<div style="text-align:center;margin:40px 0;">Episódio não encontrado.</div>';
        return;
    }

    // Descobre anterior e próximo
    const idx = episodes.findIndex(ep => ep.mal_id == episodeNumber || ep.episode == episodeNumber);
    const prevEp = episodes[idx - 1];
    const nextEp = episodes[idx + 1];

    // Exemplo de vídeo (troque pelo link real do episódio)
    const videoUrl = 'https://www.youtube.com/embed/dQw4w9WgXcQ';

    mainContent.innerHTML = `
        <div class="episode-player-container">
            <div class="episode-player-header">
                <h2>${anime.title} - Episódio ${currentEp.mal_id}${currentEp.title ? `: ${currentEp.title}` : ''}</h2>
            </div>
            <div class="episode-player-video">
                <iframe width="100%" height="420" src="${videoUrl}" frameborder="0" allowfullscreen></iframe>
            </div>
            <div class="episode-player-controls" style="display:flex;justify-content:space-between;gap:12px;margin-bottom:18px;">
                <button ${prevEp ? '' : 'disabled'} class="ep-nav-btn" id="ep-prev-btn">⏮ Episódio anterior</button>
                <button ${nextEp ? '' : 'disabled'} class="ep-nav-btn" id="ep-next-btn">Próximo episódio ⏭</button>
            </div>
            <div class="anime-episodes-list">
                ${episodes.map(ep => `
                    <div class="anime-episode${ep.mal_id == currentEp.mal_id ? ' active' : ''}" data-ep="${ep.mal_id}" style="cursor:pointer;">
                        <b>Episódio ${ep.mal_id}:</b> ${ep.title || 'Sem título'}
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    document.querySelectorAll('.anime-episodes-list .anime-episode').forEach(div => {
        div.onclick = () => renderEpisodePlayer(animeId, div.getAttribute('data-ep'));
    });

    // Eventos dos botões de navegação
    if (prevEp) {
        document.getElementById('ep-prev-btn').onclick = () => renderEpisodePlayer(animeId, prevEp.mal_id);
    }
    if (nextEp) {
        document.getElementById('ep-next-btn').onclick = () => renderEpisodePlayer(animeId, nextEp.mal_id);
    }
}

async function traduzirTexto(texto, targetLang = 'pt') {
    if (!texto) return '';
    try {
        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(texto)}`);
        const data = await res.json();
        return data[0].map(t => t[0]).join('');
    } catch (e) {
        return texto; // Se falhar, retorna o original
    }
}

//# sourceMappingURL=app.js.map