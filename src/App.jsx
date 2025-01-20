import React from 'react'
import { BrowserRouter , Routes , Route } from 'react-router-dom'
import Landing from './Landing';
import Game from './game';

export default function App() {
  return (
<BrowserRouter>

<Routes>
  <Route path ="/Freshword" element={<Landing/>} />
  <Route path="/Freshword/game" element={<Game/>}  />
 </Routes>
</BrowserRouter>
  )
}
