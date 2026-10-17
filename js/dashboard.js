const mobileMenu = document.getElementById("mobileMenu");
const sidebar = document.getElementById("sidebar");
const logoutButton = document.getElementById("logoutButton");

/*
 * MENU MOBILE
 */

if (mobileMenu && sidebar) {
    mobileMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open");
    });
}

/*
 * FECHAR MENU AO CLICAR EM UM LINK
 */

if (sidebar) {
    const sidebarLinks = sidebar.querySelectorAll(".sidebar-link");

    sidebarLinks.forEach((link) => {
        link.addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    });
}

/*
 * LOGOUT
 *
 * A sessão real será encerrada pelo backend.
 * Não armazenamos senha ou PIN no navegador.
 */

if (logoutButton) {
    logoutButton.addEventListener("click", async () => {

        logoutButton.disabled = true;
        logoutButton.textContent = "Saindo...";

        try {

            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                }
            });

        } catch (error) {

            console.error(
                "Erro ao encerrar sessão:",
                error
            );

        } finally {

            window.location.href = "login.html";

        }
    });
}

/*
 * CARREGAR RESUMO DO DASHBOARD
 *
 * O backend poderá fornecer esses dados
 * quando a API estiver pronta.
 */

async function loadDashboardData() {

    try {

        const response = await fetch(
            "/api/dashboard/summary",
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

        const data = await response.json();

        /*
         * Atualiza quantidade de APIs
         */

        const apiCount = document.getElementById(
            "apiCount"
        );

        if (
            apiCount &&
            typeof data.apiCount === "number"
        ) {
            apiCount.textContent = data.apiCount;
        }

        /*
         * Atualiza quantidade de administradores
         */

        const adminCount = document.getElementById(
            "adminCount"
        );

        if (
            adminCount &&
            typeof data.adminCount === "number"
        ) {
            adminCount.textContent = data.adminCount;
        }

    } catch (error) {

        /*
         * Enquanto o backend não estiver pronto,
         * a dashboard continua funcionando visualmente.
         */

        console.log(
            "Resumo do dashboard ainda indisponível."
        );

    }
}

/*
 * INICIALIZAÇÃO
 */

loadDashboardData();
