const settingsForm =
    document.getElementById("settingsForm");

const settingsMessage =
    document.getElementById("settingsMessage");


/*
 * MENSAGENS
 */

function showSettingsMessage(message) {

    if (!settingsMessage) {
        return;
    }

    settingsMessage.textContent =
        message;

    settingsMessage.classList.add("show");

}


function clearSettingsMessage() {

    if (!settingsMessage) {
        return;
    }

    settingsMessage.textContent = "";

    settingsMessage.classList.remove("show");

}


/*
 * SALVAR CONFIGURAÇÕES GERAIS
 */

if (settingsForm) {

    settingsForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearSettingsMessage();


            const siteName =
                document
                    .getElementById("siteName")
                    .value
                    .trim();


            const siteStatus =
                document
                    .getElementById("siteStatus")
                    .value;


            const supportEmail =
                document
                    .getElementById("supportEmail")
                    .value
                    .trim();


            const timezone =
                document
                    .getElementById("timezone")
                    .value;


            if (!siteName) {

                showSettingsMessage(
                    "Informe o nome da plataforma."
                );

                return;

            }


            if (
                supportEmail &&
                !isValidEmail(supportEmail)
            ) {

                showSettingsMessage(
                    "Digite um e-mail administrativo válido."
                );

                return;

            }


            const submitButton =
                settingsForm.querySelector(
                    "button[type='submit']"
                );


            const originalText =
                submitButton.textContent;


            submitButton.disabled = true;

            submitButton.textContent =
                "Salvando...";


            try {

                const response =
                    await fetch(
                        "/api/settings",
                        {
                            method: "PATCH",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                siteName,

                                siteStatus,

                                supportEmail,

                                timezone

                            })
                        }
                    );


                const data =
                    await response.json();


                if (
                    !response.ok ||
                    !data.success
                ) {

                    throw new Error(
                        data.message ||
                        "Não foi possível salvar as configurações."
                    );

                }


                showSettingsMessage(
                    "Configurações salvas com sucesso."
                );


            } catch (error) {

                console.error(
                    "Erro ao salvar configurações:",
                    error
                );


                showSettingsMessage(
                    error.message ||
                    "Erro ao conectar com o servidor."
                );


            } finally {

                submitButton.disabled =
                    false;

                submitButton.textContent =
                    originalText;

            }

        }
    );

}


/*
 * MÓDULOS
 */

const moduleIds = [
    "moduleApis",
    "moduleAdmins",
    "moduleLogs",
    "moduleMonitoring"
];


moduleIds.forEach(
    (id) => {

        const checkbox =
            document.getElementById(id);


        if (!checkbox) {
            return;
        }


        checkbox.addEventListener(
            "change",
            async () => {

                const enabled =
                    checkbox.checked;


                try {

                    const response =
                        await fetch(
                            "/api/settings/modules",
                            {
                                method: "PATCH",

                                headers: {
                                    "Content-Type":
                                        "application/json",

                                    "Accept":
                                        "application/json"
                                },

                                body: JSON.stringify({

                                    module: id,
                                    enabled

                                })
                            }
                        );


                    const data =
                        await response.json();


                    if (
                        !response.ok ||
                        !data.success
                    ) {

                        checkbox.checked =
                            !enabled;


                        throw new Error(
                            data.message ||
                            "Não foi possível alterar o módulo."
                        );

                    }


                    console.log(
                        "Módulo atualizado:",
                        id
                    );


                } catch (error) {

                    console.error(
                        "Erro ao alterar módulo:",
                        error
                    );

                }

            }
        );

    }
);


/*
 * CARREGAR CONFIGURAÇÕES
 */

async function loadSettings() {

    try {

        const response =
            await fetch(
                "/api/settings",
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


        const settings =
            data.settings;


        /*
         * CONFIGURAÇÕES GERAIS
         */

        const siteName =
            document.getElementById(
                "siteName"
            );


        const siteStatus =
            document.getElementById(
                "siteStatus"
            );


        const supportEmail =
            document.getElementById(
                "supportEmail"
            );


        const timezone =
            document.getElementById(
                "timezone"
            );


        if (
            siteName &&
            settings.siteName
        ) {

            siteName.value =
                settings.siteName;

        }


        if (
            siteStatus &&
            settings.siteStatus
        ) {

            siteStatus.value =
                settings.siteStatus;

        }


        if (
            supportEmail &&
            settings.supportEmail
        ) {

            supportEmail.value =
                settings.supportEmail;

        }


        if (
            timezone &&
            settings.timezone
        ) {

            timezone.value =
                settings.timezone;

        }


        /*
         * MÓDULOS
         */

        if (settings.modules) {

            moduleIds.forEach(
                (id) => {

                    const checkbox =
                        document.getElementById(
                            id
                        );


                    if (
                        checkbox &&
                        typeof settings
                            .modules[id] ===
                            "boolean"
                    ) {

                        checkbox.checked =
                            settings.modules[id];

                    }

                }
            );

        }


    } catch (error) {

        console.log(
            "Configurações ainda não disponíveis."
        );

    }

}


/*
 * VALIDAÇÃO DE E-MAIL
 */

function isValidEmail(email) {

    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        .test(email);

}


/*
 * INICIALIZAÇÃO
 */

loadSettings();
