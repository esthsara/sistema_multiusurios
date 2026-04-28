
// src/app/App.tsx
import { RouterProvider } from 'react-router-dom'
import { router }         from '@/config/router.config'
import { AppProviders }   from '@/app/providers/AppProviders'

const App = () => (
  <AppProviders>
    <RouterProvider router={router} />
  </AppProviders>
)

export default App