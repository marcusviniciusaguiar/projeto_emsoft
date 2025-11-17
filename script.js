function toggleExpandCard() {
    // Mexe no tamanho do card
    const card = document.getElementById('login-container');
    card.classList.toggle('expandido');

    // Mexe na visibilidade do botão buscar
    const buscarBtn = document.getElementById('buscar-btn');
    buscarBtn.classList.toggle('hidden');

    // Puxa a result-section e o loader para encapsular em variável e usar depois
    const sectionShow = document.getElementById('result-section');
    const loader = document.getElementById('loader');

    loader.classList.toggle('show');

    // Timer para ação do loader
    setTimeout(() => {

    loader.classList.toggle('show');
    sectionShow.classList.toggle('show');

}, 800);
}

// Função para pegar horário do salvamento dos dados
function getDataHoraISO() {
    const d = new Date();

    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');

    const hora = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    const seg = String(d.getSeconds()).padStart(2, '0');

    return `${ano}-${mes}-${dia}T${hora}:${min}:${seg}`;
}


function buscarCEP() {

    // Pega o cep digitado através do campo id e encapsula em uma variável
    const cep = document.getElementById('cep').value;
    document.getElementById('confirmaCep').value = cep;

    // Verificação
    if(!/^\d{8}$/.test(cep)) {
        alert("Insira um CEP válido.");
        return;
    }

    // Requisição API
    fetch(`https://viacep.com.br/ws/${cep}/json/`)

        // Transformando a resposta obtida em json
        .then(r => r.json())

        // Puxando valores recebidos da API
        .then(data => {

            if(data.erro) {
                alert("CEP não encontrado! Tente novamente.");
                return;
            }

            document.getElementById('address').value = data.logradouro;
            document.getElementById('hood').value = data.bairro;
            document.getElementById('city').value = data.localidade;
            document.getElementById('state').value = data.uf;

            // Ativar transição para o segundo card (aumenta o card e aparecem os campos ocultos junto com o novo botão)
            toggleExpandCard();

        })
        
        // Garantindo resposta para erros não calculados
        .catch(() => alert("Erro ao consultar o CEP. Tente novamente."));

}


function enviarDados() {

    // Montando objeto com os dados já preenchidos pela API
    const dados = {
        cep: document.getElementById('cep').value,
        endereco: document.getElementById('address').value,
        bairro: document.getElementById('hood').value,
        cidade: document.getElementById('city').value,
        estado: document.getElementById('state').value,
        pais: document.getElementById('country').value,
        dataHora: getDataHoraISO()
    };
    // Confirmando se não houve alterações no campo CEP
    let confirmaCep = document.getElementById('confirmaCep').value;

    if(confirmaCep != dados["cep"]) {

        alert("CEP não coincide com o endereço. \n Faça uma nova busca.");

        // Ativar transição para o card inicial (diminui o card e oculta os campos, deixando apenas o de cep e o botão buscar)
        toggleExpandCard();

        // Resetando feedback
        document.getElementById("feedback").textContent = "";
        return;
    }

    // Enviando dados para o backend
    fetch("backend/api.php", {

        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    
    })
    .then(r => r.json()) // Convertendo resposta para JSON
    .then(retorno => {
        // Feedback para o usuário
        document.getElementById("feedback").textContent = retorno.mensagem;

    })
    .catch(() => {
        document.getElementById("feedback").textContent = "Erro ao se comunicar com o servidor.";
    });

}