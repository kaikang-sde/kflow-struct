import './assets/base.css'
import { xd } from '@kflow-struct/share'
import { Button } from '@mui/material'



function App() {

  return (
    <>
      <Button variant="contained">Click</Button>
      <div className="text-red-500 underline">{xd}</div>
    </>
  )
}

export default App
