import ReactDOM from 'react-dom/client'
import { QueryClientProvider, QueryClient} from '@tanstack/react-query'
import App from './App'
import { NotificationContextProvider } from './anecdoteContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <QueryClientProvider client={new QueryClient()}>
    <NotificationContextProvider>
      <App />
    </NotificationContextProvider>
  </QueryClientProvider>
)