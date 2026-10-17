const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");
const pinInput = document.getElementById("pin");

function showLoginMessage(message) {
    loginMessage.textContent = message;
    loginMessage.classList.add("show");
}

function clearLoginMessage() {
    loginMessage.textContent = "";
    loginMessage.classList.remove("show");
}

pinInput.addEventListener("input", () => {
    pinInput.value = pinInput.value
        .replace(/\D/g, "")
        .slice(0, 6);
});

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    clearLoginMessage();

    const email = document
        .getElementById("email")
        .value
        .trim();

    const password = document
        .getElementById("password")
        .value;

    const pin = pinInput.value;

    if (!email || !password || !pin) {
        showLoginMessage(
            "Preencha todos os campos para continuar."
        );
        return;
    }

    if (pin.length !== 6) {
        showLoginMessage(
            "O PIN precisa ter exatamente 6 dígitos."
        );
        return;
    }

    const button = loginForm.querySelector(
        "button[type='submit']"
    );

    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = "Verificando...";

    try {

        /*
         * O backend será conectado posteriormente.
         *
         * IMPORTANTE:
         * Não coloque senhas, PINs ou API Keys
         * diretamente neste arquivo.
         */

        const response = await fetch("/api/auth/login", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email,
                password,
                pin
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(
                data.message || "Não foi possível realizar o login."
            );
        }

        if (!data.success) {
            throw new Error(
                data.message || "Credenciais inválidas."
            );
        }

        /*
         * O backend deverá retornar uma sessão segura.
         * Não vamos armazenar senha ou PIN no navegador.
         */

        window.location.href = "dashboard.html";

    } catch (error) {

        console.error("Erro de autenticação:", error);

        showLoginMessage(
            error.message ||
            "Erro ao conectar com o servidor."
        );

    } finally {

        button.disabled = false;
        button.textContent = originalText;

    }
});
