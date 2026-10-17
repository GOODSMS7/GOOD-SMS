export default {
    async fetch(request, env) {

        const url = new URL(request.url);

        if (url.pathname === "/api/health") {

            return Response.json({
                success: true,
                service: "GOOD SMS",
                status: "online"
            });

        }

        return new Response(
            "GOOD SMS API ONLINE",
            {
                status: 200,
                headers: {
                    "Content-Type": "text/plain; charset=UTF-8"
                }
            }
        );

    }
};
