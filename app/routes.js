

// orginal code above

// new code below

module.exports = function (app, passport, db) {
  const fetch = require('node-fetch');
  const Movie = require('./models/movie.js'); // MongoDB model for favorite movies

  // Normal routes ===============================================================
  app.get('/', function (req, res) {
      res.render('index.ejs');
  });

  // Profile Section =========================
  app.get('/profile', isLoggedIn, async (req, res) => {
    try {
        // Fetch user's favorite movies from the database
        const favorites = await Movie.find({ userId: req.user._id });
        res.render('profile', { user: req.user, favorites });
    } catch (err) {
        console.error(err);
        res.render('profile', { user: req.user, favorites: [] });
    }
});


  // Logout ==============================
  app.get('/logout', function (req, res) {
      req.logout(() => {
          console.log('User has logged out!');
      });
      res.redirect('/');
  });

  // Movie search route ==========================================================
  app.get('/search', async (req, res) => {
    const query = req.query.title;
    const apiKey = '01b2e6ef831ae0db4c4eb6c6548a7fd6'; // Your TMDB API key
    
    console.log(`Received search query: ${query}`); // Debugging log


    if (!query) {
        return res.status(400).json({ error: 'No query provided' });
    }

    try {
        const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}`);
        const data = await response.json();
        res.json(data.results);
    } catch (error) {
        console.error('Error fetching data from API:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});


/*app.post('/favorites', isLoggedIn, async (req, res) => {
    const { title, rating } = req.body;
    const newFavorite = new Movie({ title, rating, userId: req.user._id });

    try {
        await newFavorite.save();
        res.json({ message: 'Movie added to favorites' });
    } catch (err) {
        console.error('Error saving favorite:', err);
        res.status(500).json({ error: 'Failed to add favorite' });
    }
}); */





  // Add to favorites ============================================================
 
 
 /* app.post('/favorites', isLoggedIn, async (req, res) => {
      const { title, rating } = req.body;
      const newFavorite = new Movie({ title, rating, userId: req.user._id });
      try {
          await newFavorite.save();
          res.json({ message: 'Movie added to favorites' });
      } catch (err) {
          console.error(err);
          res.status(500).send('Error adding favorite');
      }
  });

  */
  // Delete from favorites =======================================================
  app.delete('/favorites/:id', isLoggedIn, async (req, res) => {
    try {
        await Movie.findByIdAndDelete(req.params.id);
        res.json({ message: 'Movie deleted' });
    } catch (err) {
        console.error('Error deleting favorite:', err);
        res.status(500).send('Error deleting favorite');
    }
});



app.put('/favorites/rate/:id', isLoggedIn, async (req, res) => {
    const { rating } = req.body;
    try {
        await Movie.findByIdAndUpdate(req.params.id, { rating });
        res.json({ message: 'Rating updated' });
    } catch (err) {
        console.error('Error updating rating:', err);
        res.status(500).send('Error updating rating');
    }
});

/*app.post('/favorites', isLoggedIn, async (req, res) => {
    const { title, posterPath, rating } = req.body;
    const newFavorite = new Movie({ title, posterPath, rating, userId: req.user._id });

    try {
        await newFavorite.save();
        res.json({ message: 'Movie added to favorites' });
    } catch (err) {
        console.error('Error saving favorite:', err);
        res.status(500).send('Error adding favorite');
    }
});
*/



app.post('/favorites', isLoggedIn, async (req, res) => {
    const { title, posterPath, rating } = req.body;

    // Validate the data before saving
    if (!posterPath) {
        return res.status(400).json({ error: 'No poster path provided' });
    }

    const newFavorite = new Movie({ title, posterPath, rating, userId: req.user._id });

    try {
        await newFavorite.save();
        res.json({ message: 'Movie added to favorites' });
    } catch (err) {
        console.error('Error saving favorite:', err);
        res.status(500).send('Error adding favorite');
    }
});





















  // Authentication Routes =======================================================
  app.get('/login', function (req, res) {
      res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile',
      failureRedirect: '/login',
      failureFlash: true
  }));

  app.get('/signup', function (req, res) {
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile',
      failureRedirect: '/signup',
      failureFlash: true
  }));

  // Unlink accounts ============================================================
  app.get('/unlink/local', isLoggedIn, function (req, res) {
      const user = req.user;
      user.local.email = undefined;
      user.local.password = undefined;
      user.save(function (err) {
          res.redirect('/profile');
      });
  });

  // Route middleware to ensure user is logged in ================================
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated()) return next();
      res.redirect('/');
  }
};

