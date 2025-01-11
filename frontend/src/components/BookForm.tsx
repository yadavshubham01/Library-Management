import { useState } from 'react';
import axios from 'axios';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const BookForm = () => {
  const [book, setBook] = useState({
    title: '',
    author: '',
    isbn: '',
    publication_date: '',
  });
  const navigate=useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBook({ ...book, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/books/add', book);
      navigate("/books")
    } catch (error) {
      alert('Error adding book');
    }
  };

  return (
    <div className='container'>
       <h1>
         Libary Management System 
        </h1>
       <div className='step-container'> 
       <form onSubmit={handleSubmit} className='form'>
        <TextField id="outlined-basic" name='title' label="Title" variant="outlined" onChange={handleChange}/>
        <TextField id="outlined-basic" name='author' label="Author" variant="outlined" onChange={handleChange}/>
        <TextField id="outlined-basic" name='isbn' label="ISBN" variant="outlined" onChange={handleChange}/>
        <TextField id="outlined-basic" name="publication_date" variant="outlined" type='Date'  onChange={handleChange}/>
        <Button onClick={handleSubmit} variant="outlined">Add Book</Button>
       </form>
      </div>
   </div> 
  );
};

export default BookForm;
