const securityToggles = [
    "requirePin",
    "secureSession",
    "loginProtection"
];

function showSecurityMessage(message) {
    console.log("[GOOD SMS SECURITY]", message);
}


/*
 * ALTERAÇÃO DE CONFIGURAÇÃO
 *
 * Por enquanto o frontend apenas prepara
 * a comunicação com o backend.
 *
 * A validação real será feita no servidor.
 */

securityToggles.forEach((id) => {

    const element = document.getElementById(id);

    if (!element) {
        return;
    }

    element.addEventListener("change", async () => {

        const enabled = element.checked;

        try {

            const response = await fetch(
                "/api/security/settings",
                {
                    method: "PATCH",

                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },

                    body: JSON.stringify({
                        setting: id,
                        enabled
                    })
                }
            );


            if (!response.ok) {

                element.checked = !enabled;

                showSecurityMessage(
                    "Não foi possível alterar a configuração."
                );

                return;
            }


            const data = await response.json();


            if (!data.success) {

                element.checked = !enabled;

                showSecurityMessage(
                    data.message ||
                    "Alteração recusada pelo servidor."
                );

                return;
            }


            showSecurityMessage(
                "Configuração atualizada."
            );


        } catch (error) {

            console.error(
                "Erro ao atualizar segurança:",
                error
            );


            /*
             * Se o backend ainda não estiver conectado,
             * desfazemos a alteração visual.
             */

            element.checked = !enabled;


            showSecurityMessage(
                "Servidor de segurança indisponível."
            );

        }

    });

});


/*
 * ENCERRAR OUTRAS SESSÕES
 */

const logoutOtherSessions =
    document.getElementById(
        "logoutOtherSessions"
    );


if (logoutOtherSessions) {

    logoutOtherSessions.addEventListener(
        "click",
        async () => {

            const confirmed =
                window.confirm(
                    "Deseja realmente encerrar todas as outras sessões administrativas?"
                );


            if (!confirmed) {
                return;
            }


            const originalText =
                logoutOtherSessions.textContent;


            logoutOtherSessions.disabled = true;

            logoutOtherSessions.textContent =
                "Encerrando...";


            try {

                const response =
                    await fetch(
                        "/api/security/sessions",
                        {
                            method: "DELETE",

                            headers: {
                                "Accept":
                                    "application/json"
                            }
                        }
                    );


                const data =
                    await response.json();


                if (!response.ok || !data.success) {

                    throw new Error(
                        data.message ||
                        "Não foi possível encerrar as sessões."
                    );

                }


                logoutOtherSessions.textContent =
                    "Sessões encerradas";


                showSecurityMessage(
                    "As outras sessões foram encerradas."
                );


                setTimeout(() => {

                    logoutOtherSessions.textContent =
                        originalText;

                }, 2500);


            } catch (error) {

                console.error(
                    "Erro ao encerrar sessões:",
                    error
                );


                showSecurityMessage(
                    error.message ||
                    "Erro ao conectar com o servidor."
                );


                logoutOtherSessions.textContent =
                    originalText;


            } finally {

                logoutOtherSessions.disabled =
                    false;

            }

        }
    );

}


/*
 * CARREGAR CONFIGURAÇÕES
 *
 * O backend será responsável por informar
 * o estado real das proteções.
 */

async function loadSecuritySettings() {

    try {

        const response =
            await fetch(
                "/api/security/settings",
                {
                    method: "GET",

                    headers: {
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {
            return;
        }


        const data =
            await response.json();


        if (
            !data.success ||
            !data.settings
        ) {
            return;
        }


        securityToggles.forEach((id) => {

            const element =
                document.getElementById(id);


            if (!element) {
                return;
            }


            if (
                typeof data.settings[id] ===
                "boolean"
            ) {

                element.checked =
                    data.settings[id];

            }

        });


    } catch (error) {

        console.log(
            "Configurações de segurança ainda não disponíveis."
        );

    }

}


/*
 * INICIALIZAÇÃO
 */

loadSecuritySettings();
