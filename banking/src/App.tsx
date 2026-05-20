import { useEffect } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FrappeProvider } from 'frappe-react-sdk'
import { Toaster } from '@/components/ui/sonner'
import BankReconciliation from '@/pages/BankReconciliation'
import { TooltipProvider } from './components/ui/tooltip'
import BankStatementImporter from '@/pages/BankStatementImporter'
import { LucideProvider } from 'lucide-react'
import { ThemeProvider } from './components/ui/theme-provider'
import ViewBankStatementImportLog from './pages/ViewBankStatementImportLog'
import BankStatementImporterContainer from './pages/BankStatementImporterContainer'
import Dashboard from '@/pages/Dashboard'

function App() {
	useEffect(() => {
		// Skip the production redirect-to-login when running in DEV mode so
		// the standalone bilingual demo still works without a Frappe backend.
		if (import.meta.env.DEV) return

		// In production, check if user is logged in by checking the Cookie "user_id"
		// In Frappe, unauthenticated users are "Guest"
		const userId = document.cookie?.split('; ').find(row => row.startsWith('user_id='))?.split('=')[1]?.trim()
		const isLoggedIn = userId !== 'Guest'

		if (!isLoggedIn) {
			// Redirect to Frappe login page
			window.location.href = '/login?redirect-to=/banking'
		}
	}, [])

	// In standalone demo mode `frappe.boot.user.name` is set to a synthetic
	// value by main.tsx, so the existing guard in the original App.tsx
	// (which required a non-Guest user) would otherwise leave the screen
	// blank. We render unconditionally and rely on the dev/prod logic above.
	const userName = window.frappe?.boot?.user?.name
	const canRenderRoutes = import.meta.env.DEV || (userName && userName !== 'Guest')

	return (
		<LucideProvider strokeWidth={1.5}>
			<TooltipProvider>
				<FrappeProvider
					swrConfig={{ errorRetryCount: 2 }}
					socketPort={import.meta.env.VITE_SOCKET_PORT}
					siteName={window.frappe?.boot?.sitename ?? import.meta.env.VITE_SITE_NAME}
				>
					<ThemeProvider defaultTheme={window.frappe?.boot?.desk_theme ?? 'Automatic'}>
						{canRenderRoutes && (
							<BrowserRouter
								basename={
									import.meta.env.VITE_BASE_NAME
										? `/${import.meta.env.VITE_BASE_NAME}`
										: ''
								}
							>
								<Routes>
									{/* Bilingual demo dashboard — landing page */}
									<Route index element={<Dashboard />} />

									{/* Original banking pages, kept under explicit paths */}
									<Route path="/bank-reconciliation" element={<BankReconciliation />} />
									<Route path="/statement-importer" element={<BankStatementImporterContainer />}>
										<Route index element={<BankStatementImporter />} />
										<Route path=":id" element={<ViewBankStatementImportLog />} />
									</Route>

									<Route path="*" element={<Navigate to="/" />} />
								</Routes>
							</BrowserRouter>
						)}
						<Toaster richColors />
					</ThemeProvider>
				</FrappeProvider>
			</TooltipProvider>
		</LucideProvider>
	)
}

export default App
