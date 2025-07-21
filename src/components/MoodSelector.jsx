import React from 'react'
import TinderCard from 'react-tinder-card'
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

  const handleSwipe = (direction, moodId) => {
    if (direction === 'right') {
      onMoodSelect(moodId)
    }
    // Swiping left does nothing except move to next card
  }

  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-4">How are you feeling today?</h2>
        <p className="text-gray-300 text-lg">Swipe a card to select your current mood</p>
      </div>
      <div className="relative w-80 h-96 flex items-center justify-center">
        {moods.map((mood, idx) => {
          const IconComponent = mood.icon
          return (
            <TinderCard
              key={mood.id}
              onSwipe={(dir) => handleSwipe(dir, mood.id)}
              preventSwipe={['up', 'down']}
              className="absolute w-full h-full"
            >
              <div className={`flex flex-col items-center justify-center w-full h-full rounded-3xl shadow-xl bg-gradient-to-br ${mood.color} p-8 border-4 border-white/20`}
                style={{ zIndex: moods.length - idx }}
              >
                <div className="mb-6">
                  <IconComponent className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow">{mood.name}</h3>
                <p className="text-white text-lg text-center opacity-90 drop-shadow-sm">{mood.description}</p>
                <div className="mt-8 text-white/70 text-sm">Swipe left or right</div>
              </div>
            </TinderCard>
          )
        })}
      </div>
    </div>
  )
}

export default MoodSelector 