import React from 'react'
import { ArrowLeft, Star, Calendar, Tag } from 'lucide-react'

const MovieRecommendations = ({ mood, movies, onBack }) => {
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
            className="group bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 overflow-hidden"
          >
            <div className="p-6">
              <div className="text-4xl mb-4 text-center">{movie.poster}</div>
              <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-purple-300 transition-colors">
                {movie.title}
              </h3>
              
              <div className="space-y-2 text-sm text-gray-300">
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