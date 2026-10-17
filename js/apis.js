const apiModal = document.getElementById("apiModal");
const newApiButton = document.getElementById("newApiButton");
const closeApiModal = document.getElementById("closeApiModal");
const cancelApiButton = document.getElementById("cancelApiButton");
const apiForm = document.getElementById("apiForm");
const apiMessage = document.getElementById("apiMessage");

/*
 * ABRIR MODAL
 */

function openApiModal() {

    if (!apiModal) return;

    apiModal.classList.add("open");
    apiModal.setAttribute("aria-hidden", "false");

    const nameInput =
        document.getElementById("apiName");

    if (nameInput) {
        nameInput.focus();
    }

}


/*
 * FECHAR MODAL
 */

function closeApiForm() {

    if (!apiModal) return;

    apiModal.classList.remove("open");
    apiModal.setAttribute("aria-hidden", "true");

    if (apiForm) {
        apiForm.reset();
    }

    clearApiMessage();

}


/*
 * BOTÕES
 */

if (newApiButton) {

    newApiButton.addEventListener(
        "click",
        openApiModal
    );

}

if (closeApiModal) {

    closeApiModal.addEventListener(
        "click",
        closeApiForm
    );

}

if (cancelApiButton) {

    cancelApiButton.addEventListener(
        "click",
        closeApiForm
    );

}


/*
 * FECHAR CLICANDO FORA
 */

if (apiModal) {

    apiModal.addEventListener(
        "click",
        (event) => {

            if (event.target === apiModal) {
                closeApiForm();
            }

        }
    );

}


/*
 * ESC FECHA O MODAL
 */

document.addEventListener(
    "keydown",
    (event) => {

        if (
            event.key === "Escape" &&
            apiModal &&
            apiModal.classList.contains("open")
        ) {

            closeApiForm();

        }

    }
);


/*
 * MENSAGEM
 */

function showApiMessage(message) {

    if (!apiMessage) return;

    apiMessage.textContent = message;
    apiMessage.classList.add("show");

}


function clearApiMessage() {

    if (!apiMessage) return;

    apiMessage.textContent = "";
    apiMessage.classList.remove("show");

}


/*
 * ENVIO DO FORMULÁRIO
 */

if (apiForm) {

    apiForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearApiMessage();

            const name =
                document
                    .getElementById("apiName")
                    .value
                    .trim();

            const identifier =
                document
                    .getElementById("apiIdentifier")
                    .value
                    .trim();

            const baseUrl =
                document
                    .getElementById("apiBaseUrl")
                    .value
                    .trim();

            const apiKey =
                document
                    .getElementById("apiKey")
                    .value;

            const active =
                document
                    .getElementById("apiActive")
                    .checked;


            /*
             * VALIDAÇÕES
             */

            if (
                !name ||
                !identifier ||
                !baseUrl ||
                !apiKey
            ) {

                showApiMessage(
                    "Preencha todos os campos obrigatórios."
                );

                return;

            }


            /*
             * Validação básica da URL
             */

            try {

                const url =
                    new URL(baseUrl);

                if (
                    url.protocol !== "https:"
                ) {

                    showApiMessage(
                        "A URL da API precisa utilizar HTTPS."
                    );

                    return;

                }

            } catch {

                showApiMessage(
                    "Digite uma URL de API válida."
                );

                return;

            }


            const submitButton =
                apiForm.querySelector(
                    "button[type='submit']"
                );

            const originalText =
                submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Salvando...";


            try {

                /*
                 * A chave será enviada somente ao backend.
                 *
                 * Ela NÃO será salva no localStorage,
                 * sessionStorage ou código do frontend.
                 */

                const response =
                    await fetch(
                        "/api/apis",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                "Accept":
                                    "application/json"
                            },

                            body: JSON.stringify({

                                name,
                                identifier
