import React from 'react'
import { Film } from 'lucide-react'

const Header = () => {
  return (
    <header className="text-center mb-12">
      <div className="flex items-center justify-center gap-3 mb-4">
        <Film className="w-8 h-8 text-purple-300" />
        <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent">
          MoodMovie
        </h1>
      </div>
      <p className="text-gray-300 text-lg max-w-2xl mx-auto">
        Discover the perfect movie for your current mood. Let us match you with films that will resonate with how you're feeling right now.
      </p>
    </header>
  )
}

export default Header 