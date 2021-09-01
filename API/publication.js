const Router = require('express').Router();

const BookModel = require('../schema/book');
const AuthorModel = require('../schema/author');
const PublicationModel = require('../schema/publication');
/*
Route           /publication
Description     get all publications
Access          PUBLIC
Parameters      NONE
Method          GET
*/

Router.get('/publication', async (req, res) => {
  return res.json({ publication: await PublicationModel.find() });
});

/*
  Route           /publications/id
  Description     get publication by id
  access          PUBLIC
  Parameters      /:id
  Method          GET  
  */

Router.get('/publication/:id', async (req, res) => {
  const getSpecificPublication = await PublicationModel.findOne({
    id: req.params.id,
  });

  if (!getSpecificPublication) {
    return res.json({ error: `No publication with the id ${id} found` });
  }

  return res.json({ publication: getSpecificPublication });
});

/*
  Route           /publications/books
  Description     get publication by bookid
  access          PUBLIC
  Parameters      /:book
  Method          GET  
  */
Router.get('/publication/books/:book', async (req, res) => {
  const getSpecificPublications = await PublicationModel.find({
    book: req.params.book,
  });
  if (!getSpecificPublications) {
    return res.json({ error: `No publiication with a book ${book} found` });
  }
  return res.json({ publication: getSpecificPublications });
});

/*
  Route           /publications/new
  Description     add new publication 
  access          PUBLIC
  Parameters      NONE
  Method          POST
  */
Router.post('/publication/new', async (req, res) => {
  const newPublication = req.body.newPublication;
  const addNewPublication = await PublicationModel.create(newPublication);
  return res.json({ publication: addNewPublication });
});

/*
  Route           /publications/update/
  Description     update publication name
  access          PUBLIC
  Parameters      /:id
  Method          PUT 
  */

Router.put('/publication/update/:id', async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    { id: req.params.id },
    { name: req.body.publicationName },
    { new: true }
  );
  return res.json({
    publication: updatedPublication,
    meassage: 'name updated',
  });
});

/*
  Route           /publications/update/book
  Description     update publication book
  access          PUBLIC
  Parameters      /:id
  Method          PUT 
  */
Router.put('/publication/update/book/:id', async (req, res) => {
  //update publicatons data

  const updatedPublication = await PublicationModel.findOneAndUpdate(
    { id: req.params.id },
    {
      $addToSet: {
        book: req.body.bookID,
      },
    },
    { new: true }
  );

  //update book data

  const updatedBook = await BookModel.findOneAndUpdate(
    { id: req.body.bookID },
    {
      $addToSet: {
        publication: req.params.id,
      },
    },
    { new: true }
  );

  return res.json({ book: updatedBook, publication: updatedPublication });
});

/*
  Route           /publications/delete
  Description     delete publication databse
  access          PUBLIC
  Parameters      /:id
  Method          PUT 
  */
Router.delete('/publication/delete/:id', async (req, res) => {
  const deletedPublication = await PublicationModel.findOneAndDelete({
    id: req.params.id,
  });
  return res.json({ publication: deletedPublication });
});
/*
  Route           /publications/book/delete
  Description     delete publication databse
  access          PUBLIC
  Parameters      /:id
  Method          PUT 
  */
Router.delete('/publication/book/delete/:id', async (req, res) => {
  const updatedPublication = await PublicationModel.findOneAndUpdate(
    { id: req.body.publicationID },
    {
      $pull: {
        book: req.params.id,
      },
    },
    { new: true }
  );

  const updatedBook = await BookModel.findOneAndUpdate(
    { id: req.params.id },
    {
      $pull: {
        publication: req.body.publicationID,
      },
    },
    { new: true }
  );

  return res.json({ book: updatedBook, publication: updatedPublication });
});

module.exports = Router;
