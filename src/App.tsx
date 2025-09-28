import { RouterProvider } from 'react-router'
import { router } from './router/routes'
import GlobalStyle from './styles'

function App() {
	return (
		<>
			<GlobalStyle/>
			<RouterProvider router={router} />
		</>
	)
}

export default App
