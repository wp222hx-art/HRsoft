import path from 'path';
import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react'
import proxyOptions from './proxyOptions';
import tailwindcss from "@tailwindcss/vite"

/**
 * Strips the Frappe Jinja-rendered `<script>` block from index.html when
 * running in standalone dev mode. Without this, Vite serves the raw template
 * to the browser and the parser blows up on `{{ boot }}`.
 *
 * In production builds (`vite build`) this transform is a no-op because the
 * built HTML is later post-processed by Frappe's server-side renderer.
 */
function stripFrappeJinjaInDev(): Plugin {
	return {
		name: 'strip-frappe-jinja-in-dev',
		apply: 'serve',
		transformIndexHtml(html) {
			// Replace any Jinja expression {{ ... }} inside the inline boot script
			// with a no-op so the page still parses. Also rewrite the lang/dir
			// attributes which the browser would otherwise see as literal "{{ lang }}".
			return html
				.replace(/<script>[\s\S]*?frappe\.boot[\s\S]*?<\/script>/, '')
				.replace(/lang="\{\{\s*lang\s*\}\}"/g, 'lang="en"')
				.replace(/dir="\{\{\s*layout_direction\s*\}\}"/g, 'dir="ltr"')
				.replace(/href="\{\{[^}]+\}\}"/g, 'href="/favicon.ico"')
				.replace(/<title>[^<]*<\/title>/, '<title>ERPNext Banking & Compliance Suite</title>');
		},
	};
}

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [stripFrappeJinjaInDev(), react(), tailwindcss()],
	server: {
		port: 8080,
		host: '0.0.0.0',
		// Allow access from any sandbox / preview host (e.g. *.sandbox.novita.ai)
		allowedHosts: true,
		proxy: proxyOptions
	},
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src')
		}
	},
	build: {
		outDir: '../erpnext/public/banking',
		emptyOutDir: true,
		target: 'es2015',
	},
});
