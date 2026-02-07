// ================================
// SELEÇÃO DOS ELEMENTOS
// ================================

const form = document.getElementById("postForm");
const textPost = document.getElementById("textPost");
const imagemPost = document.getElementById("imagemPost");
const videoPost = document.getElementById("videoPost");
const postsContainer = document.getElementById("posts");

document.addEventListener("DOMContentLoaded", carregarPosts);

// ================================
// CRIAR POST
// ================================

form.addEventListener("submit", function (event) {
    event.preventDefault();

    const post = {
        id: Date.now(),
        nome: "Sara Gomes",
        texto: textPost.value,
        data: new Date().toLocaleDateString("pt-BR"),
        imagem: imagemPost.files[0]
            ? URL.createObjectURL(imagemPost.files[0])
            : null,
        video: videoPost.files[0]
            ? URL.createObjectURL(videoPost.files[0])
            : null,
        likes: 0,
        comentarios: []
    };

    salvarPost(post);
    exibirPost(post);
    form.reset();
});

// ================================
// LOCALSTORAGE
// ================================

function salvarPost(post) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.unshift(post);
    localStorage.setItem("posts", JSON.stringify(posts));
}

function carregarPosts() {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(post => exibirPost(post));
}

function atualizarPosts(posts) {
    localStorage.setItem("posts", JSON.stringify(posts));
}

// ================================
// EXIBIR POST
// ================================

function exibirPost(post) {

    const postEl = document.createElement("div");
    postEl.classList.add("post");

    // CABEÇALHO
    const header = document.createElement("div");
    header.classList.add("post-header");

    header.innerHTML = `
        <h3>${post.nome}</h3>
        <span>${post.data}</span>
    `;

    // TEXTO
    const texto = document.createElement("p");
    texto.textContent = post.texto;

    // AÇÕES
    const actions = document.createElement("div");
    actions.classList.add("post-actions");

    // LIKE
    const likeBtn = document.createElement("button");
    likeBtn.classList.add("like-btn");
    likeBtn.innerHTML = `❤️ <span>${post.likes}</span>`;

    likeBtn.addEventListener("click", () => {
        post.likes++;
        likeBtn.querySelector("span").textContent = post.likes;
        atualizarLike(post.id, post.likes);
    });

    // EDITAR
    const editBtn = document.createElement("button");
    editBtn.textContent = "✏️ Editar";

    editBtn.addEventListener("click", () => {
        const novoTexto = prompt("Editar postagem:", post.texto);
        if (novoTexto !== null && novoTexto.trim() !== "") {
            texto.textContent = novoTexto;
            atualizarTexto(post.id, novoTexto);
        }
    });

    // APAGAR
    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "🗑️ Apagar";

    deleteBtn.addEventListener("click", () => {
        if (confirm("Deseja apagar este post?")) {
            apagarPost(post.id);
            postEl.remove();
        }
    });

    actions.append(likeBtn, editBtn, deleteBtn);

    // COMENTÁRIOS
    const comentariosEl = document.createElement("div");
    comentariosEl.classList.add("comentarios");

    const listaComentarios = document.createElement("div");

    post.comentarios.forEach(c => {
        const p = document.createElement("p");
        p.textContent = c;
        listaComentarios.appendChild(p);
    });

    const inputComentario = document.createElement("input");
    inputComentario.placeholder = "Adicionar comentário...";

    const btnComentario = document.createElement("button");
    btnComentario.textContent = "Comentar";

    btnComentario.addEventListener("click", () => {
        if (inputComentario.value.trim()) {
            post.comentarios.push(inputComentario.value);
            salvarComentario(post.id, inputComentario.value);

            const p = document.createElement("p");
            p.textContent = inputComentario.value;
            listaComentarios.appendChild(p);

            inputComentario.value = "";
        }
    });

    comentariosEl.append(listaComentarios, inputComentario, btnComentario);

    // MÍDIA
    if (post.imagem) {
        const img = document.createElement("img");
        img.src = post.imagem;
        postEl.appendChild(img);
    }

    if (post.video) {
        const video = document.createElement("video");
        video.src = post.video;
        video.controls = true;
        postEl.appendChild(video);
    }

    postEl.append(header, texto, actions, comentariosEl);
    postsContainer.appendChild(postEl);
}

// ================================
// FUNÇÕES AUXILIARES
// ================================

function atualizarLike(id, likes) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(p => {
        if (p.id === id) p.likes = likes;
    });
    atualizarPosts(posts);
}

function atualizarTexto(id, texto) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(p => {
        if (p.id === id) p.texto = texto;
    });
    atualizarPosts(posts);
}

function apagarPost(id) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    const filtrados = posts.filter(p => p.id !== id);
    atualizarPosts(filtrados);
}

function salvarComentario(id, comentario) {
    const posts = JSON.parse(localStorage.getItem("posts")) || [];
    posts.forEach(p => {
        if (p.id === id) p.comentarios.push(comentario);
    });
    atualizarPosts(posts);
}