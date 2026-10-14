import { buildApp } from "./app.ts";

const app = buildApp()

try {
    await app.listen({ port: 8080, host: '0.0.0.0' });
} catch (e) {
    app.log.error(e)
    process.exit(1)
}