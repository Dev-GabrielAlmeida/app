const { select, input, checkbox } = require('@inquirer/prompts');

const metas = [];

const cadastrarMeta = async () => {
    const meta = await input({ message: "| Digite a meta: " });

    if (meta.length == 0) {
        console.log("A meta NÃO pode ser vazia.");
        return;
    }

    metas.push(
        { value: meta, checked: false }
    );

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
        console.log("Nenhuma meta selecionada.");
        return;
    }

    respostas.forEach((resposta) => {
        const meta = metas.find((m) => {
            return m.value == resposta;
        });

        meta.checked = true;
    });

    console.log("Meta(s) concluída(s)")
};

const metasRealizadas = async () => {
    const realizadas = metas.filter((meta) => {
        return meta.checked
    });

    if (realizadas.length == 0) {
        console.log("Não existe metas realizadas =(")
        return
    }

    await select({
        message: ["Metas Realizadas."],
        choices: [...realizadas]
    });
};

const start = async () => {

    while (true) {

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
                    name: "Sair",
                    value: "Sair"
                }
            ]
        });

        switch (opcao) {
            case "Cadastrar":
                await cadastrarMeta();
                console.log("Meta cadastrada com sucesso.")
                break;

            case "Listar":
                await listarMetas();
                console.log("Vamos listar.");
                break;

            case "Realizadas":
                metasRealizadas()
                break;

            case "Sair":
                console.log("Até a próxima =)")
                return;
        };
    };
};

start();