const router = require('express').Router();
const Note = require('../models/Note');
const { isAuthenticated } = require('../helpers/auth');

router.get('/', isAuthenticated, async (req, res) => {
   const notes = await Note.find({user:req.user.id}).sort({ date: 'desc' });
   res.render('notes/all', { notes })
})
router.get('/add', isAuthenticated, (req, res) => {
   res.render('notes/add')
})
router.post('/add', isAuthenticated, async (req, res) => {
   const { title, description } = req.body;
   const errors = [];
   if (!title) {
      errors.push({ text: 'please write a title' })
   }
   if (!description) {
      errors.push({ text: 'please write a description' })
   }
   if (errors.length > 0) {
      res.render('notes/add', {
         errors,
         title,
         description
      })
   } else {
      const newNote = new Note({ title, description });
      newNote.user = req.user.id;
      await newNote.save();
      req.flash('successMsg', 'Nota added succesfully')
      res.redirect("/notes");
   }
})
router.get('/edit/:id', isAuthenticated, async (req, res) => {
   const note = await Note.findById(req.params.id)
   res.render('notes/edit', { note })
})
router.put('/edit/:id', isAuthenticated, async (req, res) => {
   const { title, description } = req.body;
   await Note.findByIdAndUpdate(req.params.id, { title, description })
   req.flash('successMsg', 'Note updated successfully')
   res.redirect('/notes')
})

router.delete('/delete/:id', isAuthenticated, async (req, res) => {
   await Note.findByIdAndDelete(req.params.id)
   req.flash('successMsg', 'Note delete successfully')
   res.redirect("/notes")
})

module.exports = router;
