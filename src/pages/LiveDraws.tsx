import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { PlayIcon, CalendarIcon, ClockIcon, UsersIcon } from 'lucide-react';
import { CountdownTimer } from '../components/CountdownTimer';
import { useNavigate } from 'react-router-dom';
import { SafeImage } from '../components/SafeImage';
interface Draw {
  id: string;
  competitionTitle: string;
  prizeImage: string;
  drawDate: Date;
  status: 'upcoming' | 'live' | 'completed';
  participants: number;
  videoUrl?: string;
}
export function LiveDraws() {
  const [selectedTab, setSelectedTab] = useState<'ongoing' | 'past'>('ongoing');
  const navigate = useNavigate();
  const ongoingDraws: Draw[] = Array.from({
    length: 3
  }, (_, i) => ({
    id: `ongoing-${i + 1}`,
    competitionTitle: ['Luxury Sports Car', 'Dream Vacation', 'Gaming Console'][i],
    prizeImage: ['https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1506929562872-bb421503ef21?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80'][i],
    drawDate: new Date(Date.now() + (i + 1) * 60 * 60 * 1000),
    status: 'live' as const,
    participants: [5000, 3000, 10000][i]
  }));
  const pastDraws: Draw[] = Array.from({
    length: 6
  }, (_, i) => ({
    id: `past-${i + 1}`,
    competitionTitle: ['Luxury Watch', 'Home Theater', 'Camera Kit', 'Designer Bag', 'Smart TV', 'Laptop'][i],
    prizeImage: ['https://images.unsplash.com/photo-1587836374828-4dbafa94cf0e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1593784991095-a205069470b6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1591561954555-607968c989ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60', 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60'][i],
    drawDate: new Date(Date.now() - (i + 1) * 24 * 60 * 60 * 1000),
    status: 'completed' as const,
    participants: [2000, 4000, 1500, 3500, 6000, 8000][i],
    videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'
  }));
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
            <PlayIcon className="w-10 h-10 text-accent mr-4" />
            <h1 className="text-4xl font-bold">Live Draws</h1>
          </div>
          <div className="flex gap-4 mb-8">
            {[{
            id: 'ongoing',
            label: 'Ongoing Draws'
          }, {
            id: 'past',
            label: 'Past Draws'
          }].map(tab => <motion.button key={tab.id} onClick={() => setSelectedTab(tab.id as 'ongoing' | 'past')} className={`px-6 py-3 rounded-xl font-medium transition-all relative ${selectedTab === tab.id ? 'bg-accent text-white' : 'bg-gradient-end hover:bg-gray-700'}`} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                {tab.label}
              </motion.button>)}
          </div>
        </motion.div>
        {selectedTab === 'ongoing' && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }} className="space-y-6">
            {ongoingDraws.map((draw, index) => <motion.div key={draw.id} initial={{
          opacity: 0,
          x: -20
        }} animate={{
          opacity: 1,
          x: 0
        }} transition={{
          delay: index * 0.1
        }} onClick={() => navigate(`/live-draw/${draw.id}`)} className="card-premium overflow-hidden cursor-pointer hover:border-accent transition-all" whileHover={{
          y: -5
        }}>
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-1/3 relative">
                    <SafeImage src={draw.prizeImage} alt={draw.competitionTitle} className="w-full h-64 md:h-full object-cover" />
                    <div className="absolute top-4 left-4 bg-red-500 rounded-full px-4 py-2 text-sm font-bold flex items-center animate-pulse">
                      <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                      LIVE NOW
                    </div>
                  </div>
                  <div className="md:w-2/3 p-6">
                    <h3 className="text-2xl font-bold mb-4">
                      {draw.competitionTitle}
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      <div>
                        <div className="flex items-center text-text-secondary mb-1">
                          <CalendarIcon className="w-4 h-4 mr-2" />
                          Draw Date
                        </div>
                        <div className="font-semibold">
                          {draw.drawDate.toLocaleDateString()}
                        </div>
                      </div>
                      <div>
                        <div className="flex items-center text-text-secondary mb-1">
                          <UsersIcon className="w-4 h-4 mr-2" />
                          Participants
                        </div>
                        <div className="font-semibold">
                          {draw.participants.toLocaleString()}
                        </div>
                      </div>
                    </div>
                    <div className="mb-6">
                      <div className="text-sm text-text-secondary mb-3">
                        Time Until Draw
                      </div>
                      <CountdownTimer endDate={draw.drawDate} />
                    </div>
                    <button className="w-full btn-premium flex items-center justify-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      Set Reminder
                    </button>
                  </div>
                </div>
              </motion.div>)}
          </motion.div>}
        {/* Past Draws */}
        {selectedTab === 'past' && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        duration: 0.3
      }} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastDraws.map((draw, index) => <motion.div key={draw.id} initial={{
          opacity: 0,
          scale: 0.9
        }} animate={{
          opacity: 1,
          scale: 1
        }} transition={{
          delay: index * 0.1
        }} whileHover={{
          y: -5
        }} className="card-premium group cursor-pointer">
                <div className="relative overflow-hidden">
                  <SafeImage src={draw.prizeImage} alt={draw.competitionTitle} className="w-full h-48 object-cover transition-transform duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-center">
                      <PlayIcon className="w-12 h-12 text-white mx-auto mb-2" />
                      <div className="text-sm font-medium">Watch Replay</div>
                    </div>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-bold mb-3">
                    {draw.competitionTitle}
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Draw Date</span>
                      <span className="font-medium">
                        {draw.drawDate.toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Participants</span>
                      <span className="font-medium">
                        {draw.participants.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>)}
          </motion.div>}
      </div>
    </div>;
}
