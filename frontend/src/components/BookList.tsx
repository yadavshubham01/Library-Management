import { useEffect, useState } from 'react';
import axios from 'axios';
import  '../assets/styles/BookList.css'
import { Button, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useNavigate } from 'react-router-dom';


interface Book {
  id: number;
  title: string;
  author: string;
  publication_date: string;
}

const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  const [sort, setSort] = useState<string>('title');
  const [yearFilter, setYearFilter] = useState<string>('');
  const [page, setPage] = useState<number>(1);
  const [k, setK] = useState<number>(5); 
  const [topBooks, setTopBooks] = useState<Book[]>([]);

  
  const handleFetchTopKBooks = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.get(`http://localhost:5000/api/books/top-k/${k}`);   
      setTopBooks(response.data);
      setLoading(false);
    } catch (error) {
      setError('Failed to fetch top books. Please try again later...');
      setLoading(false);
    }
  };


  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:5000/api/books', {
          params: {
            search,
            sort,
            yearFilter,
            page
          }
        });
        setBooks(response.data[0] || []);  
        setLoading(false);
      } catch (error) {
        setError('Failed to fetch books. Please try again later...');
        setLoading(false);
      }
    };

    fetchBooks();
  }, [search, sort, yearFilter, page]);

   const navigate=useNavigate()
  
  return (
    <div className='book-list-container'>
      <h2 className='book-list-title'>Book List</h2>
      <div className='filters'>
        <TextField
          type="text"
          variant='outlined'
          size='small'
          placeholder="Search by title or author"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <TextField
          type="number"
          variant='outlined'
          size='small'
          placeholder="Enter year (e.g., 2022)"
          value={yearFilter}
          onChange={(e) => setYearFilter(e.target.value)}
        />
         <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="demo-simple-select-helper-label">Sort</InputLabel>
          <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          size='small'
          variant='outlined'
          label="Sort"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
         >
          <MenuItem value="title">Sort by Title</MenuItem>
          <MenuItem value="publication_date">Sort by Publication Date</MenuItem>
         </Select>
        </FormControl>
        <TextField id="outlined-basic" label="Enter the value of K" 
          value={k}
          size='small'
          onChange={(e) => setK(Number(e.target.value))}
          variant="outlined" />
          <Button variant="outlined" size="medium" onClick={handleFetchTopKBooks}>Fetch Top Books</Button>
      </div>
      {loading && <p className='loading-text'>Loading books...</p>}
      {error && <p className='error-text'>{error}</p>}
      {topBooks.length > 0 && (
        <div className="top-books-list">
          <h3>Top {k} Books</h3>
          <ul>
            {topBooks.map((book) => (
              <li key={book.id} className="book-item">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">by {book.author}</p>
                <p className="book-date">{book.publication_date}</p>
              </li>
            ))}
          </ul>
        </div>
      ) }
      <div className='book-list'>
        <ul>
          {books.map((book) => (
            <li key={book.id} className='book-item'>
              <h3 className='book-title'>{book.title}</h3>
              <p className='book-author'>by {book.author}</p>
              <p className='book-date'>{book.publication_date}</p>
            </li>
          ))}
        </ul>
      </div>
      
      <div className='pagination'>
       <div className="step-pagination">
          <Button onClick={() => setPage(prev => Math.max(prev - 1, 1))}>Previous</Button>
          <span>Page {page}</span>
          <Button onClick={() => setPage(prev => prev + 1)}>Next</Button>
        </div>
      </div>  
      <Button variant="outlined" size="medium" onClick={() =>{
          navigate("/")
        }}>ADD Book</Button>
    </div>
  );
};

export default BookList;
