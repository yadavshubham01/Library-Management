import { Request,Response } from "express";
import { PriorityQueue } from "@datastructures-js/priority-queue";
import { Book } from '../models/schema'


export const addBook = async (req: Request, res: Response) => {
  const { title, author, isbn, publication_date } = req.body;
  if (!title || !author || !isbn || !publication_date) {
    res.status(400).json({ message: "All fields are required: title, author, isbn, publication_date." });
  }

  try {
    
    const newBook = await Book.create({ title, author, isbn, publication_date });
    res.status(201).json(newBook);
  } catch (error) {
    console.error("Error adding book:", error);
    res.status(500).json({ message: 'Failed to add book' });
  }
};

export const getBooks = async (req: Request, res: Response) => {
  const { search, sort, yearFilter, page = 1 } = req.query;
  const limit=10;
  const offset=(Number(page)-1)*limit;
  try {

    let query = 'SELECT * FROM "Books" WHERE 1=1';
    const replacements:any[] =[];

    if (search) {
      query += ` AND (title LIKE ? OR author LIKE ?)`;
      const searchPattern=`%${search}%`;
      replacements.push(searchPattern,searchPattern);
    }
    if (yearFilter) {
      query += ` AND publication_date > ?`;
      replacements.push(`${yearFilter}-01-01`);
    }
    if (sort) {
      query += ` ORDER BY ${sort}`;
    }
    query += ` LIMIT ? OFFSET ?`;
    replacements.push(limit,offset);
    
    const books = await Book.sequelize?.query(query,{replacements});
    res.status(200).json(books);
  } catch (error) {
    console.log("Error while fetching ",error);
    res.status(500).json({ message: 'Failed to fetch books' });
  }
};

export const getTopKBooks = async(req: Request, res: Response):Promise<any> => {
  try{
  const { k } = req.params;
  const K=parseInt(k,10);
  
  if(isNaN(K) || K<=0){
    return res.status(400).json({message:"Invalid value of K. Must be positive"});
  }

  const books=Book.findAll();
  const minheap=new PriorityQueue<{book: any ; titleLength:number }>((a,b) => {
     return a.titleLength -b.titleLength;
  });
   (await books).forEach((book:any)=> {
    const titleLength=book.title.length;
    
    minheap.enqueue({book,titleLength});

    if(minheap.size() >K){
      minheap.dequeue();
    }
  });

  const topBooks:any[]=[];
  while(minheap.size() >0){
    topBooks.push(minheap.dequeue()?.book);
  }
  res.status(200).json(topBooks.reverse());
}catch(e){
  console.error("error while fetching tok K books",e);
  res.status(500).json({message:"Failed to fetch Books",e});
}
  
};
