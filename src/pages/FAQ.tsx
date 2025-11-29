import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDownIcon, SearchIcon } from 'lucide-react';
interface FAQItem {
  question: string;
  answer: string;
  category: string;
}
export function FAQ() {
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState<number[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = [{
    id: 'general',
    name: 'General'
  }, {
    id: 'payment',
    name: 'Payment'
  }, {
    id: 'ticketing',
    name: 'Ticketing'
  }, {
    id: 'legal',
    name: 'Legal'
  }, {
    id: 'prizes',
    name: 'Prizes'
  }];
  const faqs: FAQItem[] = [{
    question: 'How do I enter a competition?',
    answer: "Simply browse our competitions, select the one you'd like to enter, choose the number of tickets you want to purchase, and complete the checkout process. You'll receive a confirmation email with your ticket numbers.",
    category: 'general'
  }, {
    question: 'When are winners announced?',
    answer: 'Winners are announced via live draw on the competition end date. All participants are notified via email, and the winner is contacted directly within 24 hours.',
    category: 'general'
  }, {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit and debit cards, PayPal, and Apple Pay. All transactions are secured with SSL encryption.',
    category: 'payment'
  }, {
    question: 'Can I get a refund?',
    answer: 'Due to the nature of competitions, tickets are non-refundable once purchased. However, if a competition is cancelled, all participants will receive a full refund.',
    category: 'payment'
  }, {
    question: 'How many tickets can I buy?',
    answer: 'The maximum number of tickets varies by competition. You can see the limit on each competition page. There is no minimum purchase requirement.',
    category: 'ticketing'
  }, {
    question: 'What are the age requirements?',
    answer: 'You must be 18 years or older to participate in our competitions. Age verification may be required before prize delivery.',
    category: 'legal'
  }, {
    question: 'How do I receive my prize if I win?',
    answer: "If you win, we'll contact you within 24 hours to arrange delivery. Physical prizes are shipped to your registered address, and cash prizes are transferred directly to your bank account.",
    category: 'prizes'
  }, {
    question: 'Are the competitions fair?',
    answer: 'Yes! All our draws are conducted using a certified random number generator and are broadcast live. The process is completely transparent and auditable.',
    category: 'legal'
  }];
  const filteredFaqs = faqs.filter(faq => faq.category === activeCategory && (faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())));
  const toggleItem = (index: number) => {
    setOpenItems(prev => prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]);
  };
  return <div className="py-8">
      <div className="container-premium max-w-4xl">
        <motion.div initial={{
        opacity: 0,
        y: -20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5
      }}>
          <h1 className="text-4xl font-bold mb-4 text-center">
            Frequently Asked Questions
          </h1>
          <p className="text-text-secondary text-center mb-8">
            Find answers to common questions about our competitions
          </p>
          {/* Search Bar */}
          <div className="relative mb-8">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-text-secondary w-5 h-5" />
            <input type="text" placeholder="Search FAQs..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-gradient-end rounded-xl border border-gray-700 focus:border-accent focus:outline-none transition-colors" />
          </div>
          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {categories.map(category => <motion.button key={category.id} onClick={() => setActiveCategory(category.id)} className={`px-6 py-3 rounded-xl font-medium transition-all ${activeCategory === category.id ? 'bg-accent text-white' : 'bg-gradient-end hover:bg-gray-700'}`} whileHover={{
            scale: 1.05
          }} whileTap={{
            scale: 0.95
          }}>
                {category.name}
              </motion.button>)}
          </div>
        </motion.div>
        {/* FAQ Items */}
        <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} transition={{
        delay: 0.2
      }} className="space-y-4">
          {filteredFaqs.map((faq, index) => <motion.div key={index} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          delay: index * 0.1
        }} className="card-premium overflow-hidden">
              <button onClick={() => toggleItem(index)} className="w-full p-6 flex items-center justify-between text-left hover:bg-gray-800/50 transition-colors">
                <span className="font-semibold pr-4">{faq.question}</span>
                <motion.div animate={{
              rotate: openItems.includes(index) ? 180 : 0
            }} transition={{
              duration: 0.3
            }}>
                  <ChevronDownIcon className="w-5 h-5 text-accent flex-shrink-0" />
                </motion.div>
              </button>
              <AnimatePresence>
                {openItems.includes(index) && <motion.div initial={{
              height: 0,
              opacity: 0
            }} animate={{
              height: 'auto',
              opacity: 1
            }} exit={{
              height: 0,
              opacity: 0
            }} transition={{
              duration: 0.3
            }} className="overflow-hidden">
                    <div className="px-6 pb-6 text-text-secondary">
                      {faq.answer}
                    </div>
                  </motion.div>}
              </AnimatePresence>
            </motion.div>)}
        </motion.div>
        {filteredFaqs.length === 0 && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} className="text-center py-12">
            <p className="text-text-secondary">
              No FAQs found matching your search.
            </p>
          </motion.div>}
        {/* Contact Section */}
        <motion.div initial={{
        opacity: 0,
        y: 20
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        delay: 0.5
      }} className="mt-12 card-premium p-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Still have questions?</h2>
          <p className="text-text-secondary mb-6">
            Can't find what you're looking for? Our support team is here to
            help.
          </p>
          <button className="btn-premium">Contact Support</button>
        </motion.div>
      </div>
    </div>;
}