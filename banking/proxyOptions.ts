/**
 * Vite dev-server proxy options.
 *
 * In a real Frappe deployment, the webserver port is read from
 * `../../../sites/common_site_config.json`. When running this React
 * app in standalone demo mode (no Frappe backend present), that file
 * does not exist — so we fall back to a sensible default and skip the
 * proxy registration. This keeps `npm run dev` working both ways.
 */
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

let webserver_port: number | undefined;
try {
	// Only resolves when the app sits inside a real Frappe bench
	const common_site_config = require('../../../sites/common_site_config.json');
	webserver_port = common_site_config?.webserver_port;
} catch {
	webserver_port = undefined; // standalone demo mode
}

const proxyOptions = webserver_port
	? {
		'^/(app|api|assets|files|private)': {
			target: `http://127.0.0.1:${webserver_port}`,
			ws: true,
			router: function (req: { headers: { host: string } }) {
				const site_name = req.headers.host.split(':')[0];
				return `http://${site_name}:${webserver_port}`;
			},
		},
	}
	: {};

export default proxyOptions;
