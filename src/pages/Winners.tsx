import React, { useState, Children } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, XIcon, PlayIcon, TrophyIcon } from 'lucide-react';
import { SafeImage } from '../components/SafeImage';
interface Winner {
  id: string;
  name: string;
  competitionTitle: string;
  prizeImage: string;
  ticketNumber: string;
  winDate: string;
  videoUrl?: string;
}
export function Winners() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedYear, setSelectedYear] = useState('2024');
  const [selectedWinner, setSelectedWinner] = useState<Winner | null>(null);
  const winners: Winner[] = Array.from({
    length: 12
  }, (_, i) => ({
    id: `winner-${i + 1}`,
    name: `Winner ${i + 1}`,
    competitionTitle: ['Luxury Sports Car', 'Dream Vacation', 'Gaming Console', 'Designer Watch', 'Home Theater', 'Camera Kit'][i % 6],
    prizeImage: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'][i % 6],
    ticketNumber: `#${10000 + i}`,
    winDate: new Date(2024, i % 12, i % 28 + 1).toLocaleDateString(),
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }));
  const containerVariants = {
    hidden: {
      opacity: 0
    },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      scale: 0.9
    },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.4
      }
    }
  };
  return <div className="py-8">
      <div className="container-premium">
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <div className="flex items-center mb-8">
            <TrophyIcon className="w-10 h-10 text-accent mr-4" />
            <h1 className="text-4xl font-bold">Past Winners</h1>
          </div>
          {/* Search and Filter */}
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-grow relative">
              <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
              <input type="text" placeholder="Search winners..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors" />
            </div>
            <select value={selectedYear} onChange={e => setSelectedYear(e.target.value)} className="px-6 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors">
              <option value="2024">2024</option>
              <option value="2023">2023</option>
              <option value="2022">2022</option>
            </select>
          </div>
        </motion.div>
        {/* Winners Grid */}
        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {winners.map(winner => <motion.div key={winner.id} variants={itemVariants} whileHover={{
          y: -5
        }} onClick={() => setSelectedWinner(winner)} className="card-premium cursor-pointer group">
              <div className="relative overflow-hidden">
                <SafeImage src={winner.prizeImage} alt={winner.competitionTitle} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <PlayIcon className="w-12 h-12 text-white" />
                </div>
                <div className="absolute top-3 right-3 bg-accent rounded-full px-3 py-1 text-sm font-bold">
                  {winner.ticketNumber}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-lg font-bold mb-2">
                  {winner.competitionTitle}
                </h3>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-text-secondary">{winner.name}</span>
                  <span className="text-text-secondary">{winner.winDate}</span>
                </div>
              </div>
            </motion.div>)}
        </motion.div>
        {/* Winner Details Modal */}
        <AnimatePresence>
          {selectedWinner && <>
              <motion.div initial={{
            opacity: 0
          }} animate={{
            opacity: 1
          }} exit={{
            opacity: 0
          }} onClick={() => setSelectedWinner(null)} className="fixed inset-0 bg-black bg-opacity-80 z-50" />
              <motion.div initial={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }} animate={{
            opacity: 1,
            scale: 1,
            y: 0
          }} exit={{
            opacity: 0,
            scale: 0.9,
            y: 20
          }} className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div className="card-premium max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="relative">
                    <SafeImage src={selectedWinner.prizeImage} alt={selectedWinner.competitionTitle} className="w-full h-64 object-cover" />
                    <button onClick={() => setSelectedWinner(null)} className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 flex items-center justify-center transition-colors">
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold mb-4">
                      {selectedWinner.competitionTitle}
                    </h2>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="text-sm text-text-secondary mb-1">
                          Winner
                        </div>
                        <div className="font-semibold">
                          {selectedWinner.name}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary mb-1">
                          Ticket Number
                        </div>
                        <div className="font-semibold">
                          {selectedWinner.ticketNumber}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary mb-1">
                          Win Date
                        </div>
                        <div className="font-semibold">
                          {selectedWinner.winDate}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-text-secondary mb-1">
                          Competition ID
                        </div>
                        <div className="font-semibold">{selectedWinner.id}</div>
                      </div>
                    </div>
                    <button className="w-full btn-premium flex items-center justify-center">
                      <PlayIcon className="w-5 h-5 mr-2" />
                      Watch Live Draw Replay
                    </button>
                  </div>
                </div>
              </motion.div>
            </>}
        </AnimatePresence>
      </div>
    </div>;
}
