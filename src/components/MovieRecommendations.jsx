import React from 'react'
import { ArrowLeft, Star, Calendar, Tag } from 'lucide-react'

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500'

const MovieRecommendations = ({ mood, movies, onBack, onMovieClick }) => {
  const moodNames = {
    happy: 'Happy',
    sad: 'Sad',
    excited: 'Excited',
    relaxed: 'Relaxed',
    romantic: 'Romantic',
    nostalgic: 'Nostalgic'
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 hover:bg-white/20 transition-colors duration-200"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Moods</span>
        </button>
        <h2 className="text-2xl font-bold text-white">
          Movies for when you're feeling <span className="text-purple-300">{moodNames[mood]}</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {movies.map((movie) => (
          <div
            key={movie.id}
            className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 overflow-hidden cursor-pointer"
            onClick={() => onMovieClick(movie)}
            title={`View details for ${movie.title}`}
          >
            <div className="p-6 flex flex-col items-center">
              {movie.poster_path ? (
                <img
                  src={`${TMDB_IMAGE_BASE}${movie.poster_path}`}
                  alt={movie.title}
                  className="rounded-lg mb-4 w-full h-64 object-cover shadow-lg"
                />
              ) : (
                <div className="h-64 w-full flex items-center justify-center bg-gray-700 text-white mb-4 rounded-lg">No Image</div>
              )}
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors text-center">
                {movie.title}
              </h3>
              <div className="space-y-2 text-sm text-gray-300 mb-2">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{movie.year}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{movie.genre}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span>{movie.rating}/10</span>
                </div>
              </div>
              {/* Streaming Providers */}
              <div className="mt-2 w-full">
                <div className="text-xs text-gray-400 mb-1">Available on:</div>
                {movie.providers && movie.providers.length > 0 ? (
                  <div className="flex flex-wrap gap-2 items-center justify-center">
                    {movie.providers.map((provider) => (
                      <div key={provider.provider_id} className="flex flex-col items-center">
                        {provider.logo_path ? (
                          <img
                            src={`${TMDB_IMAGE_BASE}${provider.logo_path}`}
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
        ))}
      </div>

      {movies.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-300 text-lg">No movies found for this mood. Try selecting a different mood!</p>
        </div>
      )}
    </div>
  )
}

export default MovieRecommendations