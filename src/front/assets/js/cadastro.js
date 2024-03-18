function enviarDadosFormulario() {
    var formulario = document.getElementById('formCadastro');

    var nome = document.getElementById('nome').value;
    var email = document.getElementById('email').value;
    var matricula = document.getElementById('matricula').value;
    var senha = document.getElementById('senha').value;
    var confirmarSenha = document.getElementById('confirmarSenha').value;
    var curso = document.getElementById('curso').value;

    console.log(senha);
    console.log(nome);
    console.log(confirmarSenha);

    if (senha !== confirmarSenha) {
        alert('As senhas não correspondem');
        return;
    }

    var data = {
        nome: nome,
        email: email,
        matricula: matricula,
        senhaCadastro: senha,
        confirmarSenha: confirmarSenha,
        curso: curso
    };

    fetch('/cadastrarUsuario', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(data => {
                    throw new Error('Erro ao fazer cadastro: ' + data.error);
                });
            }
            return response.json();
        })
        .then(data => {
            alert('Conta cadastrada com sucesso!');
            window.location.href = '/login';
        })
        .catch(error => {
            console.error('Erro ao enviar requisição:', error);
            alert(error.message);
            formulario.reset();
        });
}

document.getElementById('formCadastro').addEventListener('submit', function (event) {
    event.preventDefault();
    enviarDadosFormulario();
});
