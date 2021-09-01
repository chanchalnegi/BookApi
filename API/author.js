const Router = require('express').Router();
const AuthorModel = require('../schema/author');

// Route    - /author
// Des      - to get all authors
// Access   - Public
// Method   - GET
// Params   - none
// Body     - none
Router.get('/author', async (req, res) => {
  const getAllAuthors = await AuthorModel.find();
  return res.json(getAllAuthors);
});

// Route     /author/new
// Description add new author
// Access PUBLIC
// Parameters NONE
// METHOD POST
Router.post('/author/new', (req, res) => {
  const { newAuthor } = req.body;

  AuthorModel.create(newAuthor);

  return res.json({ message: 'Author added to the database' });
});

// Route       /author/updateName
// Description Update name of the author
// Access      Public
// Parameters  id
// Method      Put
// Params in the req.body are always in string format

Router.put('/author/update/:id', async (req, res) => {
  const updatedAuthor = await AuthorModel.findOneAndUpdate(
    { id: req.params.id },
    { name: req.body.authorName },
    { new: true }
  );
  return res.json({ author: updatedAuthor, message: 'Author name updated' });
});

/*
  Route           /author/delete
  Description     delete author
  Access          PUBLIC
  Parameters      id
  Method          DELETE
  */
Router.delete('/author/delete/:id', async (req, res) => {
  const deletedAuthor = await AuthorModel.findOneAndDelete({
    id: req.params.id,
  });
  return res.json({ author: deletedAuthor, message: 'Author deleted' });
});

module.exports = Router;
