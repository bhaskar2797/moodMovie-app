import React, { useState, useEffect } from 'react'
import MoodSelector from './components/MoodSelector'
import MovieRecommendations from './components/MovieRecommendations'
import Header from './components/Header'
import { moods as moodOptions } from './components/MoodSelector'

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
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return true
  })
  const [customMood, setCustomMood] = useState('')
  const [moodHistory, setMoodHistory] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('moodHistory') || '[]')
    }
    return []
  })
  const [moodRatings, setMoodRatings] = useState(() => {
    if (typeof window !== 'undefined') {
      return JSON.parse(localStorage.getItem('moodRatings') || '{}')
    }
    return {}
  })

  useEffect(() => {
    localStorage.setItem('moodHistory', JSON.stringify(moodHistory))
  }, [moodHistory])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [darkMode])

  useEffect(() => {
    localStorage.setItem('moodRatings', JSON.stringify(moodRatings))
  }, [moodRatings])

  // Find mood object by id or custom input
  const getMoodObj = (moodIdOrText) => {
    let moodObj = moodOptions.find((m) => m.id === moodIdOrText)
    if (!moodObj && moodIdOrText) {
      // Try to match custom mood to keywords
      const lower = moodIdOrText.toLowerCase()
      moodObj = moodOptions.find((m) => m.keywords.some((k) => lower.includes(k)))
      if (!moodObj) {
        // Fallback: use a default mood
        moodObj = moodOptions[0]
      }
    }
    return moodObj
  }

  const handleMoodSelect = async (moodIdOrText) => {
    setSelectedMood(moodIdOrText)
    setLoading(true)
    setError(null)
    setRecommendations([])
    setSelectedMovie(null)
    setMovieDetail(null)
    // Save to mood history
    setMoodHistory((prev) => [
      { mood: moodIdOrText, date: new Date().toISOString() },
      ...prev.slice(0, 49)
    ])
    try {
      const moodObj = getMoodObj(moodIdOrText)
      // Prefer genre search, fallback to keyword search
      let url = ''
      if (moodObj.genres && moodObj.genres.length > 0) {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&with_genres=${moodObj.genres.join(',')}&sort_by=popularity.desc&vote_count.gte=100&language=en-US`
      } else if (moodObj.keywords && moodObj.keywords.length > 0) {
        url = `${TMDB_BASE_URL}/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(moodObj.keywords[0])}&language=en-US`
      } else {
        url = `${TMDB_BASE_URL}/discover/movie?api_key=${TMDB_API_KEY}&sort_by=popularity.desc&vote_count.gte=100&language=en-US`
      }
      const res = await fetch(url)
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
                genre: '',
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

  // Add rating for a movie-mood pair
  const handleRateMoodMatch = (movieId, mood, rating) => {
    setMoodRatings(prev => ({
      ...prev,
      [movieId]: { mood, rating, date: new Date().toISOString() }
    }))
  }

  // Get the selected mood object for dynamic theme
  const selectedMoodObj = selectedMood ? (moodOptions.find(m => m.id === selectedMood) || moodOptions.find(m => m.keywords.some(k => (typeof selectedMood === 'string' && selectedMood.toLowerCase().includes(k))))) : null
  const moodGradient = selectedMoodObj ? selectedMoodObj.color : 'from-purple-900 via-blue-900 to-indigo-900'

  return (
    <div className={`min-h-screen bg-gradient-to-br ${moodGradient} dark:from-gray-900 dark:via-gray-950 dark:to-black transition-colors duration-300`}>
      <div className="container mx-auto px-4 py-8">
        <Header />
        <div className="absolute top-6 right-8 z-50">
          <button
            onClick={() => setDarkMode((d) => !d)}
            className="px-4 py-2 rounded-lg bg-white/20 dark:bg-black/30 text-white font-semibold shadow hover:bg-white/40 dark:hover:bg-black/50 transition focus:outline-none focus:ring-2 focus:ring-purple-400"
            aria-label="Toggle dark mode"
          >
            {darkMode ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
        {!selectedMood ? (
          <>
            <MoodSelector onMoodSelect={handleMoodSelect} />
            <div className="mt-6 flex flex-col items-center">
              <label htmlFor="custom-mood" className="text-white dark:text-gray-200 mb-2">Or enter your own mood:</label>
              <input
                id="custom-mood"
                type="text"
                value={customMood}
                onChange={e => setCustomMood(e.target.value)}
                className="px-4 py-2 rounded-lg border border-white/20 bg-white/10 text-white dark:bg-black/30 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
                placeholder="e.g. adventurous, cozy, etc."
                onKeyDown={e => { if (e.key === 'Enter' && customMood.trim()) { handleMoodSelect(customMood.trim()); setCustomMood('') } }}
              />
              <button
                onClick={() => { if (customMood.trim()) { handleMoodSelect(customMood.trim()); setCustomMood('') } }}
                className="px-4 py-2 rounded-lg bg-purple-600 text-white font-semibold shadow hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-400 mb-2"
              >
                Get Recommendations
              </button>
              <button
                onClick={() => handleMoodSelect(moodOptions[Math.floor(Math.random() * moodOptions.length)].id)}
                className="px-4 py-2 rounded-lg bg-pink-500 text-white font-semibold shadow hover:bg-pink-600 transition focus:outline-none focus:ring-2 focus:ring-pink-400 mt-2"
              >
                🎲 Surprise Me!
              </button>
            </div>
          </>
        ) : loading ? (
          <div className="text-center text-white py-20 text-xl">Loading movies...</div>
        ) : error ? (
          <div className="text-center text-red-400 py-20 text-xl">{error}</div>
        ) : selectedMovie ? (
          detailLoading ? (
            <div className="text-center text-white py-20 text-xl">Loading details...</div>
          ) : (
            <MovieDetailPage movie={movieDetail} onBack={handleBackToList} onRateMoodMatch={handleRateMoodMatch} selectedMood={selectedMood} moodRatings={moodRatings} moodColor={selectedMoodObj?.color} />
          )
        ) : (
          <>
            <MovieRecommendations 
              mood={selectedMood} 
              movies={recommendations}
              onBack={() => setSelectedMood(null)}
              onMovieClick={handleMovieClick}
            />
            {/* Mood Playlists */}
            <div className="mt-12 max-w-4xl mx-auto">
              <h3 className="text-xl font-bold text-white mb-4">Mood Playlists</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {moodOptions.slice(0, 8).map((mood) => {
                  const Icon = mood.icon
                  return (
                    <button
                      key={mood.id}
                      onClick={() => handleMoodSelect(mood.id)}
                      className={`flex flex-col items-center justify-center rounded-xl p-4 bg-gradient-to-br ${mood.color} shadow-lg border-2 border-white/20 hover:scale-105 transition focus:outline-none focus:ring-2 focus:ring-purple-400`}
                      style={{ minHeight: 120 }}
                      aria-label={`See playlist for ${mood.name}`}
                    >
                      <Icon className="w-8 h-8 text-white mb-2 drop-shadow" />
                      <span className="text-white font-semibold text-lg drop-shadow mb-1">{mood.name}</span>
                      <span className="text-white/80 text-xs text-center">{mood.description}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </>
        )}
        {/* Mood history display */}
        {moodHistory.length > 0 && (
          <>
            <div className="mt-10 max-w-lg mx-auto bg-white/10 dark:bg-black/20 rounded-xl p-4 shadow text-white">
              <h3 className="text-lg font-bold mb-2">Your Mood History</h3>
              <ul className="text-sm space-y-1">
                {moodHistory.slice(0, 10).map((entry, i) => (
                  <li key={i} className="flex justify-between opacity-80">
                    <span>{typeof entry.mood === 'string' ? entry.mood : (moodOptions.find(m => m.id === entry.mood)?.name || entry.mood)}</span>
                    <span className="text-gray-400">{new Date(entry.date).toLocaleDateString()}</span>
                    {/* Show rating if available */}
                    {entry.movieId && moodRatings[entry.movieId] && (
                      <span className="ml-2 text-yellow-400">{moodRatings[entry.movieId].rating}/5</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
            {/* Mood Calendar */}
            <div className="mt-8 max-w-2xl mx-auto bg-white/10 dark:bg-black/20 rounded-xl p-4 shadow text-white">
              <h3 className="text-lg font-bold mb-2">Mood Calendar</h3>
              <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 gap-2">
                {moodHistory.slice(0, 21).map((entry, i) => {
                  const moodObj = typeof entry.mood === 'string' ? moodOptions.find(m => m.id === entry.mood) : null
                  const Icon = moodObj?.icon
                  return (
                    <div key={i} className={`flex flex-col items-center justify-center rounded-lg p-2 bg-gradient-to-br ${moodObj?.color || 'from-gray-500 to-gray-700'} shadow border border-white/10`}>
                      {Icon && <Icon className="w-5 h-5 text-white mb-1" />}
                      <span className="text-xs text-white/90 font-semibold mb-0.5 truncate max-w-[60px]">{moodObj?.name || entry.mood}</span>
                      <span className="text-[10px] text-white/70">{new Date(entry.date).getDate()}/{new Date(entry.date).getMonth()+1}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// MovieDetailPage: use moodColor for dynamic background
function MovieDetailPage({ movie, onBack, onRateMoodMatch, selectedMood, moodRatings, moodColor }) {
  const bgUrl = movie?.backdrop_path || movie?.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path}`
    : null
  const moodGradient = moodColor || 'from-purple-900 via-blue-900 to-indigo-900'
  const [userRating, setUserRating] = React.useState(moodRatings[movie.id]?.rating || 0)
  const [rated, setRated] = React.useState(!!moodRatings[movie.id])
  const handleRate = (rating) => {
    setUserRating(rating)
    setRated(true)
    onRateMoodMatch(movie.id, selectedMood, rating)
  }
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center overflow-auto bg-gradient-to-br ${moodGradient}`}
      style={{
        background: bgUrl
          ? `linear-gradient(rgba(20,20,40,0.85),rgba(20,20,40,0.95)), url(${bgUrl}) center/cover no-repeat`
          : undefined,
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
      <div className="max-w-2xl w-full bg-white/10 rounded-2xl shadow-xl p-8 mt-20 mb-10 flex flex-col items-center border border-white/20 backdrop-blur-sm"
        style={{background: 'rgba(30,30,60,0.35)', boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)', border: '1px solid rgba(255,255,255,0.18)'}}>
        {movie.poster_path && (
          <img
            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
            alt={movie.title}
            className="rounded-xl mb-6 w-64 shadow-lg opacity-80"
          />
        )}
        <h2 className="text-3xl font-bold text-white mb-2 text-center drop-shadow" style={{textShadow: '0 2px 8px rgba(0,0,0,0.7)'}}>{movie.title}</h2>
        <div className="flex flex-wrap gap-4 mb-4 text-gray-200 text-sm justify-center">
          <span>{movie.release_date?.slice(0, 4)}</span>
          {movie.runtime && <span>{movie.runtime} min</span>}
          {movie.genres && movie.genres.length > 0 && (
            <span>{movie.genres.map((g) => g.name).join(', ')}</span>
          )}
          <span>⭐ {movie.vote_average}/10</span>
        </div>
        {movie.overview && (
          <p className="text-white/90 text-lg mb-6 text-center max-w-xl" style={{textShadow: '0 1px 6px rgba(0,0,0,0.5)'}}>{movie.overview}</p>
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
                      style={{opacity: 0.85}}
                    />
                  ) : null}
                  <span className="text-[10px] text-white text-center max-w-[60px] truncate" style={{textShadow: '0 1px 4px rgba(0,0,0,0.5)'}}>{provider.provider_name}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-xs text-gray-500 text-center">Not available for streaming in India</div>
          )}
        </div>
        {/* Mood match rating UI */}
        <div className="mt-6 w-full flex flex-col items-center">
          <div className="text-white/80 mb-2">How well did this movie match your mood?</div>
          <div className="flex gap-1 mb-2">
            {[1,2,3,4,5].map((star) => (
              <button
                key={star}
                onClick={() => handleRate(star)}
                disabled={rated}
                className={`text-2xl ${userRating >= star ? 'text-yellow-400' : 'text-gray-400'} focus:outline-none`}
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                ★
              </button>
            ))}
          </div>
          {rated && <div className="text-green-400 text-sm">Thank you for your feedback!</div>}
        </div>
      </div>
    </div>
  )
}

export default App 