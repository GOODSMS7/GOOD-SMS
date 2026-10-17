const logsTableBody =
    document.getElementById("logsTableBody");

const logType =
    document.getElementById("logType");

const logStatus =
    document.getElementById("logStatus");

const logSearch =
    document.getElementById("logSearch");

const clearFilters =
    document.getElementById("clearFilters");


let allLogs = [];


/*
 * CARREGAR LOGS
 */

async function loadLogs() {

    try {

        const response =
            await fetch(
                "/api/logs",
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


        if (!data.success) {
            return;
        }


        allLogs =
            Array.isArray(data.logs)
                ? data.logs
                : [];


        updateLogStats(
            allLogs
        );


        renderLogs(
            allLogs
        );


    } catch (error) {

        console.log(
            "Sistema de auditoria ainda não conectado."
        );

    }

}


/*
 * ESTATÍSTICAS
 */

function updateLogStats(logs) {

    const totalLogs =
        document.getElementById(
            "totalLogs"
        );

    const loginLogs =
        document.getElementById(
            "loginLogs"
        );

    const securityLogs =
        document.getElementById(
            "securityLogs"
        );


    const loginCount =
        logs.filter(
            (log) =>
                log.type === "login"
        ).length;


    const securityCount =
        logs.filter(
            (log) =>
                log.type === "security"
        ).length;


    if (totalLogs) {

        totalLogs.textContent =
            logs.length;

    }


    if (loginLogs) {

        loginLogs.textContent =
            loginCount;

    }


    if (securityLogs) {

        securityLogs.textContent =
            securityCount;

    }

}


/*
 * RENDERIZAR LOGS
 */

function renderLogs(logs) {

    if (!logsTableBody) {
        return;
    }


    if (!logs.length) {

        logsTableBody.innerHTML = `
            <tr>
                <td colspan="6">

                    <div class="empty-table">

                        <span>
                            00
                        </span>

                        <strong>
                            Nenhum evento encontrado
                        </strong>

                        <p>
                            Os registros de atividade
                            aparecerão aqui.
                        </p>

                    </div>

                </td>
            </tr>
        `;

        return;

    }


    logsTableBody.innerHTML =
        logs.map(
            (log) => {

                const status =
                    getStatusLabel(
                        log.status
                    );


                const statusClass =
                    getStatusClass(
                        log.status
                    );


                return `
                    <tr>

                        <td>
                            ${escapeHtml(
                                log.date ||
                                "—"
                            )}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    log.event ||
                                    "Evento"
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                log.admin ||
                                "Sistema"
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                log.source ||
                                "Painel"
                            )}
                        </td>

                        <td>

                            <span
                                class="${statusClass}"
                            >
                                ${status}
                            </span>

                        </td>

                        <td>

                            <button
                                type="button"
                                class="table-action"
                                data-log-id="${escapeHtml(
                                    String(
                                        log.id ||
                                        ""
                                    )
                                )}"
                            >
                                Detalhes
                            </button>

                        </td>

                    </tr>
                `;

            }
        ).join("");

}


/*
 * FILTROS
 */

function applyLogFilters() {

    const selectedType =
        logType
            ? logType.value
            : "";


    const selectedStatus =
        logStatus
            ? logStatus.value
            : "";


    const search =
        logSearch
            ? logSearch.value
                .trim()
                .toLowerCase()
            : "";


    const filtered =
        allLogs.filter(
            (log) => {

                const matchesType =
                    !selectedType ||
                    log.type === selectedType;


                const matchesStatus =
                    !selectedStatus ||
                    log.status === selectedStatus;


                const searchableText =
                    [
                        log.event,
                        log.admin,
                        log.source,
                        log.type,
                        log.status
                    ]
                        .filter(Boolean)
                        .join(" ")
                        .toLowerCase();


                const matchesSearch =
                    !search ||
                    searchableText.includes(
                        search
                    );


                return (
                    matchesType &&
                    matchesStatus &&
                    matchesSearch
                );

            }
        );


    renderLogs(
        filtered
    );

}


/*
 * EVENTOS DOS FILTROS
 */

if (logType) {

    logType.addEventListener(
        "change",
        applyLogFilters
    );

}


if (logStatus) {

    logStatus.addEventListener(
        "change",
        applyLogFilters
    );

}


if (logSearch) {

    logSearch.addEventListener(
        "input",
        applyLogFilters
    );

}


/*
 * LIMPAR FILTROS
 */

if (clearFilters) {

    clearFilters.addEventListener(
        "click",
        () => {

            if (logType) {
                logType.value = "";
            }


            if (logStatus) {
                logStatus.value = "";
            }


            if (logSearch) {
                logSearch.value = "";
            }


            renderLogs(
                allLogs
            );

        }
    );

}


/*
 * DETALHES DO LOG
 */

if (logsTableBody) {

    logsTableBody.addEventListener(
        "click",
        async (event) => {

            const button =
                event.target.closest(
                    "[data-log-id]"
                );


            if (!button) {
                return;
            }


            const logId =
                button.dataset.logId;


            if (!logId) {
                return;
            }


            try {

                const response =
                    await fetch(
                        `/api/logs/${encodeURIComponent(
                            logId
                        )}`,
                        {
                            method: "GET",

                            headers: {
                                "Accept":
                                    "application/json"
                            }
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
                        "Detalhes indisponíveis."
                    );

                }


                /*
                 * Por enquanto mostramos os dados
                 * de forma simples.
                 *
                 * Depois podemos criar um modal
                 * profissional para os detalhes.
                 */

                console.log(
                    "Detalhes do evento:",
                    data.log
                );


                alert(
                    "Detalhes do evento disponíveis no console."
                );


            } catch (error) {

                console.error(
                    "Erro ao carregar detalhes:",
                    error
                );

                alert(
                    "Não foi possível carregar os detalhes."
                );

            }

        }
    );

}


/*
 * STATUS
 */

function getStatusLabel(status) {

    switch (status) {

        case "success":
            return "SUCESSO";

        case "warning":
            return "ATENÇÃO";

        case "error":
            return "ERRO";

        default:
            return "REGISTRADO";

    }

}


function getStatusClass(status) {

    switch (status) {

        case "error":
            return "table-status blocked";

        case "warning":
            return "table-status warning";

        default:
            return "table-status";

    }

}


/*
 * PROTEÇÃO CONTRA HTML
 */

function escapeHtml(value) {

    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/*
 * INICIALIZAÇÃO
 */

loadLogs();
