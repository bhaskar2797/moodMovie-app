import React from 'react'
import TinderCard from 'react-tinder-card'
import { Heart, Smile, Frown, Zap, Coffee, Star, Meh, Sun, CloudRain, Flame, Brain, Laugh, AlertTriangle, BookOpen, Music, Moon, Wind, ThumbsUp } from 'lucide-react'

const moods = [
  { id: 'happy', name: 'Happy', icon: Smile, color: 'from-yellow-400 to-orange-400', description: 'Feeling joyful and upbeat', genres: [35], keywords: ['happy', 'joy', 'feel good'] },
  { id: 'sad', name: 'Sad', icon: Frown, color: 'from-blue-400 to-indigo-400', description: 'Feeling down or melancholic', genres: [18], keywords: ['sad', 'tearjerker', 'emotional'] },
  { id: 'excited', name: 'Excited', icon: Zap, color: 'from-red-400 to-pink-400', description: 'Feeling energetic and pumped', genres: [28, 12], keywords: ['action', 'adventure', 'exciting'] },
  { id: 'relaxed', name: 'Relaxed', icon: Coffee, color: 'from-green-400 to-teal-400', description: 'Feeling calm and peaceful', genres: [10751, 10402], keywords: ['relax', 'calm', 'chill'] },
  { id: 'romantic', name: 'Romantic', icon: Heart, color: 'from-pink-400 to-rose-400', description: 'Feeling love and romance', genres: [10749], keywords: ['romance', 'love', 'date'] },
  { id: 'nostalgic', name: 'Nostalgic', icon: Star, color: 'from-purple-400 to-violet-400', description: 'Feeling sentimental', genres: [16, 10751], keywords: ['nostalgia', 'classic', 'retro'] },
  { id: 'bored', name: 'Bored', icon: Meh, color: 'from-gray-400 to-gray-600', description: 'Need something new', genres: [878, 9648], keywords: ['mystery', 'sci-fi', 'surprise'] },
  { id: 'motivated', name: 'Motivated', icon: Flame, color: 'from-orange-500 to-red-600', description: 'Ready to conquer', genres: [99, 18], keywords: ['inspiring', 'biography', 'sports'] },
  { id: 'anxious', name: 'Anxious', icon: AlertTriangle, color: 'from-yellow-200 to-red-300', description: 'Feeling tense or worried', genres: [53, 9648], keywords: ['thriller', 'suspense', 'mystery'] },
  { id: 'curious', name: 'Curious', icon: BookOpen, color: 'from-blue-200 to-green-300', description: 'Want to learn or explore', genres: [99, 36], keywords: ['documentary', 'history', 'explore'] },
  { id: 'funny', name: 'Funny', icon: Laugh, color: 'from-yellow-300 to-pink-300', description: 'Want to laugh', genres: [35], keywords: ['comedy', 'funny', 'humor'] },
  { id: 'inspired', name: 'Inspired', icon: Sun, color: 'from-yellow-200 to-orange-300', description: 'Feeling uplifted', genres: [18, 99], keywords: ['inspiring', 'biography', 'uplifting'] },
  { id: 'melancholic', name: 'Melancholic', icon: Moon, color: 'from-blue-900 to-indigo-900', description: 'Bittersweet or pensive', genres: [18, 10749], keywords: ['melancholy', 'bittersweet', 'drama'] },
  { id: 'dreamy', name: 'Dreamy', icon: Wind, color: 'from-purple-200 to-blue-300', description: 'Lost in thought', genres: [14, 16], keywords: ['fantasy', 'dream', 'imagination'] },
  { id: 'confident', name: 'Confident', icon: ThumbsUp, color: 'from-green-400 to-blue-400', description: 'Feeling bold', genres: [28, 80], keywords: ['crime', 'action', 'bold'] },
]

const MoodSelector = ({ onMoodSelect }) => {
  const handleSwipe = (direction, moodId) => {
    if (direction === 'right') {
      onMoodSelect(moodId)
    }
  }
  return (
    <div className="max-w-md mx-auto flex flex-col items-center">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white dark:text-gray-100 mb-4">How are you feeling today?</h2>
        <p className="text-gray-300 dark:text-gray-400 text-lg">Swipe a card to select your current mood</p>
      </div>
      <div className="relative w-80 h-96 flex items-center justify-center max-w-full">
        {moods.map((mood, idx) => {
          const IconComponent = mood.icon
          return (
            <TinderCard
              key={mood.id}
              onSwipe={(dir) => handleSwipe(dir, mood.id)}
              preventSwipe={['up', 'down']}
              className="absolute w-full h-full focus:outline-none focus:ring-2 focus:ring-purple-400"
            >
              <div className={`flex flex-col items-center justify-center w-full h-full rounded-3xl shadow-xl bg-gradient-to-br ${mood.color} p-8 border-4 border-white/20 dark:border-white/30 transition-all duration-300 hover:scale-105 focus-within:scale-105 cursor-pointer`}
                style={{ zIndex: moods.length - idx }}
                tabIndex={0}
                role="button"
                aria-label={`Select mood: ${mood.name}`}
              >
                <div className="mb-6">
                  <IconComponent className="w-16 h-16 text-white drop-shadow-lg" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow dark:text-gray-100">{mood.name}</h3>
                <p className="text-white text-lg text-center opacity-90 drop-shadow-sm dark:text-gray-200">{mood.description}</p>
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
export { moods } 