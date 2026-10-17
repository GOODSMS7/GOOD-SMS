const adminModal = document.getElementById("adminModal");
const newAdminButton = document.getElementById("newAdminButton");
const closeAdminModal = document.getElementById("closeAdminModal");
const cancelAdminButton = document.getElementById("cancelAdminButton");
const adminForm = document.getElementById("adminForm");
const adminMessage = document.getElementById("adminMessage");
const adminPin = document.getElementById("adminPin");

/*
 * ABRIR MODAL
 */

function openAdminModal() {
    if (!adminModal) return;

    adminModal.classList.add("open");
    adminModal.setAttribute("aria-hidden", "false");

    const nameInput = document.getElementById("adminName");

    if (nameInput) {
        nameInput.focus();
    }
}

/*
 * FECHAR MODAL
 */

function closeAdminForm() {
    if (!adminModal) return;

    adminModal.classList.remove("open");
    adminModal.setAttribute("aria-hidden", "true");

    if (adminForm) {
        adminForm.reset();
    }

    clearAdminMessage();
}

if (newAdminButton) {
    newAdminButton.addEventListener(
        "click",
        openAdminModal
    );
}

if (closeAdminModal) {
    closeAdminModal.addEventListener(
        "click",
        closeAdminForm
    );
}

if (cancelAdminButton) {
    cancelAdminButton.addEventListener(
        "click",
        closeAdminForm
    );
}

/*
 * FECHAR CLICANDO FORA
 */

if (adminModal) {
    adminModal.addEventListener("click", (event) => {

        if (event.target === adminModal) {
            closeAdminForm();
        }

    });
}

/*
 * ESC FECHA O MODAL
 */

document.addEventListener("keydown", (event) => {

    if (
        event.key === "Escape" &&
        adminModal &&
        adminModal.classList.contains("open")
    ) {
        closeAdminForm();
    }

});

/*
 * PIN
 */

if (adminPin) {

    adminPin.addEventListener("input", () => {

        adminPin.value = adminPin.value
            .replace(/\D/g, "")
            .slice(0, 6);

    });

}

/*
 * MENSAGEM
 */

function showAdminMessage(message) {

    if (!adminMessage) return;

    adminMessage.textContent = message;
    adminMessage.classList.add("show");

}

function clearAdminMessage() {

    if (!adminMessage) return;

    adminMessage.textContent = "";
    adminMessage.classList.remove("show");

}

/*
 * ENVIO DO FORMULÁRIO
 */

if (adminForm) {

    adminForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            clearAdminMessage();

            const name = document
                .getElementById("adminName")
                .value
                .trim();

            const email = document
                .getElementById("adminEmail")
                .value
                .trim();

            const password = document
                .getElementById("adminPassword")
                .value;

            const pin = adminPin.value;

            const permissionInputs =
                adminForm.querySelectorAll(
                    "input[name='permissions']:checked"
                );

            const permissions =
                Array.from(permissionInputs)
                    .map((input) => input.value);

            if (!name || !email || !password || !pin) {

                showAdminMessage(
                    "Preencha todos os campos obrigatórios."
                );

                return;
            }

            if (password.length < 12) {

                showAdminMessage(
                    "A senha precisa ter pelo menos 12 caracteres."
                );

                return;
            }

            if (!/^\d{6}$/.test(pin)) {

                showAdminMessage(
                    "O PIN precisa ter exatamente 6 dígitos."
                );

                return;
            }

            if (permissions.length === 0) {

                showAdminMessage(
                    "Selecione pelo menos uma permissão."
                );

                return;
            }

            const submitButton =
                adminForm.querySelector(
                    "button[type='submit']"
                );

            const originalText =
                submitButton.textContent;

            submitButton.disabled = true;
            submitButton.textContent = "Salvando...";

            try {

                /*
                 * A criação real será feita pelo backend.
                 * A senha e o PIN nunca serão armazenados
                 * diretamente pelo frontend.
                 */

                const response = await fetch(
                    "/api/admins",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json",
                            "Accept": "application/json"
                        },

                        body: JSON.stringify({
                            name,
                            email,
                            password,
                            pin,
                            permissions
                        })
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {

                    throw new Error(
                        data.message ||
                        "Não foi possível criar o administrador."
                    );

                }

                if (!data.success) {

                    throw new Error(
                        data.message ||
                        "Não foi possível criar o administrador."
                    );

                }

                closeAdminForm();

                await loadAdmins();

            } catch (error) {

                console.error(
                    "Erro ao criar administrador:",
                    error
                );

                showAdminMessage(
                    error.message ||
                    "Erro ao conectar com o servidor."
                );

            } finally {

                submitButton.disabled = false;
                submitButton.textContent = originalText;

            }

        }
    );

}

/*
 * CARREGAR ADMINISTRADORES
 */

async function loadAdmins() {

    try {

        const response = await fetch(
            "/api/admins",
            {
                method: "GET",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {
            return;
        }

        const data =
            await response.json();

        if (!data.success) {
            return;
        }

        renderAdmins(data.admins || []);

    } catch (error) {

        console.log(
            "Lista de administradores ainda indisponível."
        );

    }

}

/*
 * RENDERIZAR TABELA
 */

function renderAdmins(admins) {

    const tableBody =
        document.getElementById(
            "adminsTableBody"
        );

    if (!tableBody) return;

    const totalAdmins =
        document.getElementById(
            "totalAdmins"
        );

    const activeAdmins =
        document.getElementById(
            "activeAdmins"
        );

    const blockedAdmins =
        document.getElementById(
            "blockedAdmins"
        );

    const total = admins.length;

    const active =
        admins.filter(
            (admin) => admin.status === "active"
        ).length;

    const blocked =
        admins.filter(
            (admin) => admin.status === "blocked"
        ).length;

    if (totalAdmins) {
        totalAdmins.textContent = total;
    }

    if (activeAdmins) {
        activeAdmins.textContent = active;
    }

    if (blockedAdmins) {
        blockedAdmins.textContent = blocked;
    }

    if (admins.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">
                    <div class="empty-table">
                        <span>00</span>
                        <strong>
                            Nenhum administrador cadastrado
                        </strong>
                        <p>
                            As contas administrativas
                            aparecerão aqui.
                        </p>
                    </div>
                </td>
            </tr>
        `;

        return;
    }

    tableBody.innerHTML =
        admins.map((admin) => {

            const status =
                admin.status === "blocked"
                    ? "BLOQUEADO"
                    : "ATIVO";

            const statusClass =
                admin.status === "blocked"
                    ? "table-status blocked"
                    : "table-status";

            return `
                <tr>

                    <td>
                        <strong>
                            ${escapeHtml(admin.name)}
                        </strong>
                    </td>

                    <td>
                        ${escapeHtml(admin.email)}
                    </td>

                    <td>
                        ${escapeHtml(
                            admin.role || "Administrador"
                        )}
                    </td>

                    <td>
                        <span class="${statusClass}">
                            ${status}
                        </span>
                    </td>

                    <td>
                        <button
                            type="button"
                            class="table-action"
                            data-admin-id="${escapeHtml(
                                String(admin.id)
                            )}"
                        >
                            Gerenciar
                        </button>
                    </td>

                </tr>
            `;

        }).join("");

}

/*
 * PROTEÇÃO CONTRA HTML INJETADO
 */

function escapeHtml(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

/*
 * INICIALIZAÇÃO
 */

loadAdmins();
