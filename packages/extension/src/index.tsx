import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { Client as Styletron } from 'styletron-engine-atomic'
import { BaseProvider, LightTheme } from 'baseui'
import { Provider as StyletronProvider } from 'styletron-react'

import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'

const engine = new Styletron()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)
root.render(
  <StrictMode>
    <StyletronProvider value={engine}>
      <BaseProvider theme={LightTheme}>
        <App />
      </BaseProvider>
    </StyletronProvider>
  </StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
