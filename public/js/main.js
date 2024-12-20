

document.addEventListener('DOMContentLoaded', () => {
  const searchBtn = document.getElementById('searchBtn');
  if (searchBtn) {
      searchBtn.addEventListener('click', async () => {
          const query = document.getElementById('searchInput').value;

          if (!query) {
              alert('Please enter a movie title');
              return;
          }

          console.log(`Searching for: ${query}`); // Debugging log

          try {
              const response = await fetch(`/search?title=${encodeURIComponent(query)}`);
              console.log('Response status:', response.status); // Debugging log

              if (!response.ok) {
                  throw new Error('Failed to fetch movies');
              }
              
              const movies = await response.json();
              console.log('Movies fetched:', movies); // Debugging log
              displayMovies(movies);
          } catch (error) {
              console.error('Error fetching movies:', error);
              alert('Error fetching movie data. Please try again.');
          }
      });
  }
});



  function displayMovies(movies) {
    const results = document.getElementById('results');
    results.innerHTML = '';

    if (movies.length === 0) {
        results.innerHTML = '<p>No movies found</p>';
        return;
    }

    const moviesContainer = document.createElement('div');
    moviesContainer.classList.add('movies-container');

    movies.forEach(movie => {
        const posterUrl = movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/300x450?text=No+Image';
        
        const movieCard = document.createElement('div');
        movieCard.classList.add('movie-card');
        movieCard.innerHTML = `
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster">
            <h4>${movie.title}</h4>
            <p>Release Date: ${movie.release_date || 'N/A'}</p>
            <button onclick="addFavorite('${movie.title}', '${movie.poster_path}')">Add to Favorites</button>
        `;
        
        moviesContainer.appendChild(movieCard);
    });

    results.appendChild(moviesContainer);
}







async function addFavorite(title, posterPath) {
    if (!posterPath) {
        alert('No poster available for this movie');
        return;
    }
    console.log('Adding favorite:', title, posterPath);

    try {
        const response = await fetch('/favorites', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ title, posterPath, rating: 0 })
        });

        if (response.ok) {
            alert('Movie added to favorites');
            window.location.reload();
        } else {
            alert('Failed to add movie to favorites');
        }
    } catch (error) {
        console.error('Error adding favorite:', error);
        alert('Error adding movie to favorites');
    }
}





async function deleteFavorite(movieId) {
  try {
      const response = await fetch(`/favorites/${movieId}`, {
          method: 'DELETE',
          headers: {
              'Content-Type': 'application/json'
          }
      });

      if (response.ok) {
          alert('Movie deleted from favorites');
          window.location.reload(); // Refresh to show updated list
      } else {
          alert('Failed to delete movie');
      }
  } catch (error) {
      console.error('Error deleting favorite:', error);
      alert('Error deleting movie from favorites');
  }
}


async function rateMovie(movieId, rating) {
  try {
      const response = await fetch(`/favorites/rate/${movieId}`, {
          method: 'PUT',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({ rating })
      });

      if (response.ok) {
          alert('Rating updated!');
          window.location.reload();
      } else {
          alert('Failed to update rating');
      }
  } catch (error) {
      console.error('Error updating rating:', error);
  }
}
