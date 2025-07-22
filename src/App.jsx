import React, { useState } from 'react'
import MoodSelector from './components/MoodSelector'
import MovieRecommendations from './components/MovieRecommendations'
import Header from './components/Header'

const MOOD_TO_GENRE = {
  happy: 35, // Comedy
  sad: 18, // Drama
  excited: 28, // Action
  relaxed: 10751, // Family
  romantic: 10749, // Romance
  nostalgic: 12 // Adventure (or use 16 for Animation)
}

const TMDB_API_KEY = import.meta.env.VITE_TMDB_API_KEY
const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'
const TMDB_IMAGE_ORIGINAL = 'https://image.tmdb.org/t/p/original'

function App() {
  const [selectedMood, setSelectedMood] = useState(null)
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [selectedMovie, setSelectedMovie] = useState(null)
  const [movieDetail, setMovieDetail] = useState(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const handleMoodSelect = async (mood) => {
    setSelectedMood(mood)
    setLoading(true)
    setError(null)
    setRecommendations([])
    setSelectedMovie(null)
    setMovieDetail(null)
    try {
      const genreId = MOOD_TO_GENRE[mood]
      const res = await fetch(
        `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${genreId}&sort_by=popularity.desc&vote_count.gte=100&language=en-US`
      )
      const data = await res.json()
      if (data.results) {
        const movies = data.results.slice(0, 12)
        // Fetch providers for each movie
        const moviesWithProviders = await Promise.all(
          movies.map(async (movie) => {
            try {
              const providerRes = await fetch(
                `${TMDB_BASE_URL}/movie/${movie.id}/watch/providers?api_key=${TMDB_API_KEY}`
              )
              const providerData = await providerRes.json()
              const providers = providerData.results?.IN?.flatrate || []
              return {
                id: movie.id,
                title: movie.title,
                year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
                genre: '', // Optionally fetch genre names if needed
                rating: movie.vote_average,
                poster_path: movie.poster_path,
                providers: providers.map((p) => ({
                  provider_id: p.provider_id,
                  provider_name: p.provider_name,
                  logo_path: p.logo_path
                }))
              }
            } catch (err) {
              return {
                id: movie.id,
                title: movie.title,
                year: movie.release_date ? movie.release_date.slice(0, 4) : 'N/A',
                genre: '',
                rating: movie.vote_average,
                poster_path: movie.poster_path,
                providers: []
              }
            }
          })
        )
        setRecommendations(moviesWithProviders)
      } else {
        setRecommendations([])
      }
    } catch (err) {
      setError('Failed to fetch movies. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleMovieClick = async (movie) => {
    setSelectedMovie(movie)
    setDetailLoading(true)
    setMovieDetail(null)
    try {
      const res = await fetch(`${TMDB_BASE_URL}/movie/${movie.id}?api_key=${TMDB_API_KEY}&language=en-US`)
      const data = await res.json()
      setMovieDetail({ ...movie, ...data })
    } catch (err) {
      setMovieDetail({ ...movie, error: 'Failed to load details.' })
    } finally {
      setDetailLoading(false)
    }
  }

  const handleBackToList = () => {
    setSelectedMovie(null)
    setMovieDetail(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      <div className="container mx-auto px-4 py-8">
        <Header />
        {!selectedMood ? (
          <MoodSelector onMoodSelect={handleMoodSelect} />
        ) : loading ? (
          <div className="text-center text-white py-20 text-xl">Loading movies...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-20 text-xl">{error}</div>
        ) : selectedMovie ? (
          detailLoading ? (
            <div className="text-center text-white py-20 text-xl">Loading details...</div>
          ) : (
            <MovieDetailPage movie={movieDetail} onBack={handleBackToList} />
          )
        ) : (
          <MovieRecommendations 
            mood={selectedMood} 
            movies={recommendations}
            onBack={() => setSelectedMood(null)}
            onMovieClick={handleMovieClick}
          />
        )}
      </div>
    </div>
  )
}

// MovieDetailPage component (inline for now)
function MovieDetailPage({ movie, onBack }) {
  const bgUrl = movie?.backdrop_path || movie?.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`
    : null
  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto"
      style={{
        background: bgUrl
          ? `linear-gradient(rgba(20,20,40,0.85),rgba(20,20,40,0.95)), url(${bgUrl}) center/cover no-repeat`
          : '#18182f',
        minHeight: '100vh',
        minWidth: '100vw',
      }}
    >
      <button
        onClick={onBack}
        className="absolute top-8 left-8 px-4 py-2 rounded-lg bg-white/20 text-white font-semibold hover:bg-white/40 transition"
      >
        ← Back
      </button>
      <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-xl p-8 mt-20 mb-10 flex flex-col items-center border border-white/20 backdrop-blur">
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-xl mb-6 w-64 shadow-lg"
          />
        )}
        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow">{movie.title}</h2>
        <div className="flex flex-wrap gap-4 mb-4 text-gray-200 text-sm justify-center">
          <span>{movie.release_date?.slice(0, 4)}</span>
          {movie.runtime && <span>{movie.runtime} min</span>}
          {movie.genres && movie.genres.length > 0 && (
            <span>{movie.genres.map((g) => g.name).join(', ')}</span>
          )}
          <span>⭐ {movie.vote_average}/10</span>
        </div>
        {movie.overview && (
          <p className="text-white/90 text-lg mb-6 text-center max-w-xl">{movie.overview}</p>
        )}
        {/* Streaming Providers */}
        <div className="mt-4 w-full">
          <div className="text-xs text-gray-400 mb-1">Available on:</div>
          {movie.providers && movie.providers.length > 0 ? (
            <div className="flex flex-wrap gap-2 items-center justify-center">
              {movie.providers.map((provider) => (
                <div key={provider.provider_id} className="flex flex-col items-center">
                  {provider.logo_path ? (
                    <img
                      src={`https://image.tmdb.org/t/p/w500${provider.logo_path}`}
                      alt={provider.provider_name}
                      className="w-8 h-8 rounded mb-1 bg-white"
                    />
                  ) : null}
                  <span className="text-[10px] text-white text-center max-w-[60px] truncate">{provider.provider_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center">Not available for streaming in India</div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App 