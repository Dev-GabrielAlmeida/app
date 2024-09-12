const { select, input, checkbox } = require('@inquirer/prompts');
const { json } = require('stream/consumers');
const fs = require("fs").promises

let mensagem = "Bem vindo ao app de metas =)";

const carregarMetas = async () => {
    try {
        const dados = await fs.readFile("metas.json", "utf-8");
        metas = JSON.parse(dados)
    } catch (erro) {
        metas = []
    }
};

const salvarMetas = async () => {
    await fs.writeFile("metas.json", JSON.stringify(metas, null, 2));
}

const cadastrarMeta = async () => {
    const meta = await input({ message: "| Digite a meta: " });

    if (meta.length == 0) {
        mensagem = "A meta NÃO pode ser vazia.";
        return;
    }

    metas.push(
        { value: meta, checked: false }
    );

    mensagem = "Meta cadastrada com sucesso.";
};

const listarMetas = async () => {
    const respostas = await checkbox({
        message: "Use as setas para mudar de meta, o espaço para marcar ou desmarcar e o enter para finalizar essa etapa.",
        choices: [...metas],
        instructions: false
    });

    metas.forEach((m) => {
        m.checked = false;
    });

    if (respostas.length == 0) {
        mensagem = "Nenhuma meta selecionada.";
        return;
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta;
        });

        meta.checked = true;
    });

    message = "Meta(s) concluída(s)";
};

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    });

    if (realizadas.length == 0) {
        mensagem = "Não existe metas realizadas =(";
        return
    }

    await select({
        message: ["Metas Realizadas:"],
        choices: [...realizadas]
    });
};

const metasAbertas = async () => {
    const abertas = metas.filter((meta) => {
        return meta.checked != true
    });

    if (abertas.length == 0) {
        mensagem = "Não existe metas abertas =)";
        return
    }

    await select({
        message: "Metas abertas:" + abertas.length,
        choices: [...abertas]
    });
};

const deletarMetas = async () => {
    const metasDesmarcadas = metas.map((meta) => {
        return { value: metas.value, checked: false }
    });

    const metasADeletar = await checkbox({
        message: "Selecione uma meta a ser deletada.",
        choices: [...metasDesmarcadas],
        instructions: false
    });

    if (metasADeletar.length == 0) {
        mensagem = "Nenhuma meta a ser deletada.";
        return
    }

    metasADeletar.forEach((item) => {
        metas = metas.filter((meta) => {
            return meta.value != item
        });
    });

    mensagem = "Meta(s) deletada(s) com sucesso.";
};

const mostrarMensagem = () => {
    console.clear();

    if (mensagem != "") {
        console.log(mensagem);
        console.log("");
        mensagem = "";
    }
};

const start = async () => {

    await carregarMetas();

    while (true) {
        mostrarMensagem();
        await salvarMetas();

        const opcao = await select({
            message: "Menu >",
            choices: [
                {
                    name: "Cadastrar meta",
                    value: "Cadastrar"
                },
                {
                    name: "Listar metas",
                    value: "Listar"
                },
                {
                    name: "Metas realizadas",
                    value: "Realizadas"
                },
                {
                    name: "Metas abertas",
                    value: "Abertas"
                },
                {
                    name: "Deletar metas",
                    value: "Deletar"
                },
                {
                    name: "Sair",
                    value: "Sair"
                }
            ]
        });

        switch (opcao) {
            case "Cadastrar":
                await cadastrarMeta();
                mensagem = "Meta cadastrada com sucesso.";
                break;

            case "Listar":
                await listarMetas();
                break;

            case "Realizadas":
                metasRealizadas()
                break;

            case "Abertas":
                await metasAbertas();
                break;

            case "Deletar":
                await deletarMetas();
                break;

            case "Sair":
                console.log("Até a próxima =)");
                return;
        };
    };
};

start();