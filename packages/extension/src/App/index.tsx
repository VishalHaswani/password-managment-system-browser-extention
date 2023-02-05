import { Route, Routes } from 'react-router-dom'

function App (): JSX.Element {
  return (
    <Routes>
      <Route path='/' element={'Pages should go here'} />
      <Route path='*' element={'Page Not Found'} />
    </Routes>
  )
}

export default App
