import React from 'react'
import { Heart, Smile, Frown, Zap, Coffee, Star } from 'lucide-react'

const MoodSelector = ({ onMoodSelect }) => {
  const moods = [
    { id: 'happy', name: 'Happy', icon: Smile, color: 'from-yellow-400 to-orange-400', description: 'Feeling joyful and upbeat' },
    { id: 'sad', name: 'Sad', icon: Frown, color: 'from-blue-400 to-indigo-400', description: 'Feeling down or melancholic' },
    { id: 'excited', name: 'Excited', icon: Zap, color: 'from-red-400 to-pink-400', description: 'Feeling energetic and pumped' },
    { id: 'relaxed', name: 'Relaxed', icon: Coffee, color: 'from-green-400 to-teal-400', description: 'Feeling calm and peaceful' },
    { id: 'romantic', name: 'Romantic', icon: Heart, color: 'from-pink-400 to-rose-400', description: 'Feeling love and romance' },
    { id: 'nostalgic', name: 'Nostalgic', icon: Star, color: 'from-purple-400 to-violet-400', description: 'Feeling sentimental' }
  ]

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">How are you feeling today?</h2>
        <p className="text-gray-300 text-lg">Select your current mood to get personalized movie recommendations</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {moods.map((mood) => {
          const IconComponent = mood.icon
          return (
            <button
              key={mood.id}
              onClick={() => onMoodSelect(mood.id)}
              className="group relative overflow-hidden rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${mood.color} opacity-0 group-hover:opacity-20 transition-opacity duration-300`} />
              <div className="relative p-8 text-center">
                <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br ${mood.color} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <IconComponent className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">{mood.name}</h3>
                <p className="text-gray-300 text-sm">{mood.description}</p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default MoodSelector 