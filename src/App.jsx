import React, { useState } from 'react'
import MoodSelector from './components/MoodSelector'
import MovieRecommendations from './components/MovieRecommendations'
import Header from './components/Header'

function App() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [recommendations, setRecommendations] = useState([])

  const handleMoodSelect = (mood) => {
    setSelectedMood(mood)
    // Generate recommendations based on mood
    const moodMovies = getMoviesByMood(mood)
    setRecommendations(moodMovies)
  }

  const getMoviesByMood = (mood) => {
    const movieDatabase = {
      happy: [
        { id: 1, title: "La La Land", year: 2016, genre: "Musical/Romance", rating: 8.0, poster: "��" },
        { id: 2, title: "The Secret Life of Walter Mitty", year: 2013, genre: "Adventure/Comedy", rating: 7.3, poster: "��" },
        { id: 3, title: "Paddington", year: 2014, genre: "Family/Comedy", rating: 7.2, poster: "��" },
        { id: 4, title: "The Grand Budapest Hotel", year: 2014, genre: "Comedy/Drama", rating: 8.1, poster: "��" },
        { id: 5, title: "Mamma Mia!", year: 2008, genre: "Musical/Comedy", rating: 6.4, poster: "🎵" }
      ],
      sad: [
        { id: 6, title: "The Notebook", year: 2004, genre: "Romance/Drama", rating: 7.8, poster: "��" },
        { id: 7, title: "A Beautiful Mind", year: 2001, genre: "Biography/Drama", rating: 8.2, poster: "��" },
        { id: 8, title: "The Fault in Our Stars", year: 2014, genre: "Romance/Drama", rating: 7.7, poster: "��" },
        { id: 9, title: "Up", year: 2009, genre: "Animation/Adventure", rating: 8.2, poster: "��" },
        { id: 10, title: "The Green Mile", year: 1999, genre: "Crime/Drama", rating: 8.6, poster: "🟢" }
      ],
      excited: [
        { id: 11, title: "Mad Max: Fury Road", year: 2015, genre: "Action/Adventure", rating: 8.1, poster: "��️" },
        { id: 12, title: "Mission: Impossible - Fallout", year: 2018, genre: "Action/Thriller", rating: 7.7, poster: "��" },
        { id: 13, title: "John Wick", year: 2014, genre: "Action/Thriller", rating: 7.4, poster: "��" },
        { id: 14, title: "The Avengers", year: 2012, genre: "Action/Sci-Fi", rating: 8.0, poster: "��" },
        { id: 15, title: "Speed", year: 1994, genre: "Action/Thriller", rating: 7.2, poster: "🚌" }
      ],
      relaxed: [
        { id: 16, title: "The Secret Garden", year: 1993, genre: "Drama/Family", rating: 7.3, poster: "��" },
        { id: 17, title: "Big Fish", year: 2003, genre: "Adventure/Drama", rating: 8.0, poster: "��" },
        { id: 18, title: "The Hundred-Foot Journey", year: 2014, genre: "Comedy/Drama", rating: 7.3, poster: "��" },
        { id: 19, title: "Chef", year: 2014, genre: "Comedy/Drama", rating: 7.3, poster: "👨‍��" },
        { id: 20, title: "The Intern", year: 2015, genre: "Comedy/Drama", rating: 7.1, poster: "💼" }
      ],
      romantic: [
        { id: 21, title: "Pride and Prejudice", year: 2005, genre: "Romance/Drama", rating: 7.8, poster: "��" },
        { id: 22, title: "Before Sunrise", year: 1995, genre: "Romance/Drama", rating: 8.1, poster: "��" },
        { id: 23, title: "The Princess Bride", year: 1987, genre: "Adventure/Romance", rating: 8.0, poster: "⚔️" },
        { id: 24, title: "Eternal Sunshine of the Spotless Mind", year: 2004, genre: "Romance/Sci-Fi", rating: 8.3, poster: "��" },
        { id: 25, title: "About Time", year: 2013, genre: "Comedy/Romance", rating: 7.8, poster: "⏰" }
      ],
      nostalgic: [
        { id: 26, title: "The Goonies", year: 1985, genre: "Adventure/Comedy", rating: 7.8, poster: "��️" },
        { id: 27, title: "Back to the Future", year: 1985, genre: "Adventure/Comedy", rating: 8.5, poster: "⏱️" },
        { id: 28, title: "The Sandlot", year: 1993, genre: "Comedy/Drama", rating: 7.8, poster: "⚾" },
        { id: 29, title: "Stand by Me", year: 1986, genre: "Adventure/Drama", rating: 8.1, poster: "��" },
        { id: 30, title: "The Breakfast Club", year: 1985, genre: "Comedy/Drama", rating: 7.8, poster: "📚" }
      ]
    }
    
    return movieDatabase[mood] || []
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        
        {!selectedMood ? (
          <MoodSelector onMoodSelect={handleMoodSelect} />
        ) : (
          <MovieRecommendations 
            mood={selectedMood} 
            movies={recommendations}
            onBack={() => setSelectedMood(null)}
          />
        )}
      </div>
    </div>
  )
}

export default App 