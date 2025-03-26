import { FC, useState } from 'react';
import { motion } from 'framer-motion';

export const NewsletterSignup: FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simple email validation
    if (!email.includes('@') || !email.includes('.')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // Clear any previous errors
    setError('');
    
    // In a real app, you would send this to an API
    console.log('Submitting email:', email);
    
    // Show success state
    setIsSubmitted(true);
    
    // Reset form
    setEmail('');
  };

  return (
    <motion.div 
      className="w-full py-16 bg-gradient-to-r from-purple-900/20 to-pink-900/20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative">
          {/* Glowing orbs for visual effect */}
          <div className="absolute -left-4 -top-4 w-24 h-24 bg-purple-500 rounded-full filter blur-[80px] opacity-30"></div>
          <div className="absolute -right-4 -bottom-4 w-32 h-32 bg-pink-500 rounded-full filter blur-[100px] opacity-30"></div>
          
          <div className="relative glassmorphism rounded-2xl p-8 md:p-12">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">
                Stay Updated with Solantics
              </h2>
              <p className="text-gray-300 mb-8">
                Be the first to know about new features, DeFi insights, and exclusive analytics tools. 
                Join our community of Solana enthusiasts and power users.
              </p>
              
              {isSubmitted ? (
                <motion.div 
                  className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-xl"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-2 text-2xl">🎉</div>
                  <h3 className="text-xl font-semibold text-white mb-2">Thank You for Subscribing!</h3>
                  <p className="text-gray-300">
                    You&apos;ve been added to our list. Get ready for the latest Solana news and insights.
                  </p>
                  <button 
                    onClick={() => setIsSubmitted(false)} 
                    className="mt-4 text-sm text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Subscribe another email
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="max-w-md mx-auto">
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-grow">
                      <input
                        type="email"
                        placeholder="Your email address"
                        className="w-full px-4 py-3 bg-gray-900/60 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all text-white"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      {error && <p className="mt-1 text-sm text-red-400 text-left">{error}</p>}
                    </div>
                    <button
                      type="submit"
                      className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-medium text-white hover:from-purple-700 hover:to-pink-700 transition-all transform hover:scale-105 active:scale-95 flex-shrink-0"
                    >
                      Subscribe
                    </button>
                  </div>
                  <p className="mt-4 text-xs text-gray-400">
                    By subscribing, you agree to our privacy policy and terms of service.
                    We&apos;ll never spam you or sell your information.
                  </p>
                </form>
              )}
            </div>
            
            {/* Feature badges */}
            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {[
                "DeFi Analytics", 
                "Token Insights", 
                "Market Updates", 
                "Advanced Charts", 
                "Trending Memecoins"
              ].map((feature) => (
                <motion.div
                  key={feature}
                  className="bg-gray-800/50 border border-gray-700/50 rounded-full px-4 py-1.5 text-sm text-gray-300"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  whileHover={{ scale: 1.05, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
                >
                  {feature}
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default NewsletterSignup; 