import { BrowserRouter, Route, Routes} from 'react-router-dom'
import './App.css'
import BookForm from './components/BookForm'
import BookList from './components/BookList'

function App() {
  return(
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<BookForm />} />
      <Route path="/books" element={<BookList/>}></Route>
    </Routes>
    </BrowserRouter>
  )
}

export default App
