import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { startMockServer } from './mocks/browser'
import './index.css'

/**
 * The mock API is started before the first render so no request can escape
 * unhandled — an unmocked fetch would surface as a console error.
 */
startMockServer().then(() => {
	createRoot(document.getElementById('root')!).render(
		<StrictMode>
			<App />
		</StrictMode>,
	)
})
