import React, { useEffect, useState } from 'react';
import newsService from '../services/newsService';
import { motion } from 'framer-motion';
import { 
  HiOutlineSearch, 
  HiOutlineNewspaper,
  HiOutlineClock,
  HiOutlineExternalLink
} from 'react-icons/hi';

const News = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalArticles, setTotalArticles] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [nextPage, setNextPage] = useState(null);
  const pageSize = 12;

  useEffect(() => {
    fetchNews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const fetchNews = async () => {
    try {
      setLoading(true);
      let result;
      if (searchQuery.trim()) {
        result = await newsService.searchNews(searchQuery, nextPage);
      } else {
        result = await newsService.getCryptoNews(nextPage);
      }
      setNews(result.articles || []);
      setTotalArticles(result.totalArticles || 0);
      setNextPage(result.nextPage);
    } catch (error) {
      console.error('Error fetching news:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    setNextPage(null);
    fetchNews();
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="page-container"
    >
      <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 uppercase tracking-widest font-bold mb-1">
            <span>Market</span>
            <span>/</span>
            <span className="text-[var(--text-primary)]">News</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">Crypto News</h1>
        </div>

        <form onSubmit={handleSearch} className="flex items-center gap-2 w-full md:w-96">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search news..."
              className="ent-input pl-10"
            />
          </div>
          <button type="submit" className="btn-ent-primary py-2 px-6">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map(i => <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-lg" />)}
        </div>
      ) : news.length === 0 ? (
        <div className="ent-card p-20 text-center border-dashed border-2 bg-transparent flex flex-col items-center justify-center">
          <HiOutlineNewspaper className="text-5xl text-gray-300 mb-6" />
          <p className="text-gray-400 font-medium">No news found for your search query.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.map((article, index) => (
            <motion.a
              variants={itemVariants}
              key={index}
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="ent-card overflow-hidden hover:border-[var(--accent-primary)] transition-all group flex flex-col bg-white dark:bg-gray-800/20"
            >
              <div className="h-40 overflow-hidden bg-gray-100 dark:bg-gray-800 relative">
                {article.image ? (
                  <img
                    src={article.image}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300">
                    <HiOutlineNewspaper />
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-wider">
                    {article.source?.name || 'News'}
                  </span>
                </div>
              </div>
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                  <HiOutlineClock className="text-xs" />
                  <span>{formatDate(article.publishedAt)}</span>
                </div>
                <h3 className="text-sm font-bold text-[var(--text-primary)] mb-3 line-clamp-2 leading-snug group-hover:text-[var(--accent-primary)] transition-colors">
                  {article.title}
                </h3>
                <p className="text-xs text-gray-500 line-clamp-3 leading-relaxed mb-4">
                  {article.description}
                </p>
                <div className="mt-auto pt-4 border-t border-[var(--border-base)] flex items-center justify-between text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-[var(--accent-primary)] transition-colors">
                  <span>Read Article</span>
                  <HiOutlineExternalLink className="text-sm" />
                </div>
              </div>
            </motion.a>
          ))}
        </div>
      )}

      {/* Pagination */}
      {!loading && news.length > 0 && (
        <div className="mt-12 flex items-center justify-center gap-4">
          <button
            onClick={() => { setPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
            disabled={page === 1}
            className="btn-ent-secondary py-2 px-4 disabled:opacity-30"
          >
            Previous
          </button>
          <span className="text-xs font-bold text-gray-500">Page {page}</span>
          <button
            onClick={() => { 
              setPage(p => p + 1); 
              window.scrollTo({ top: 0, behavior: 'smooth' }); 
            }}
            disabled={!nextPage}
            className="btn-ent-secondary py-2 px-4 disabled:opacity-30"
          >
            Next
          </button>
        </div>
      )}
    </motion.div>
  );
};

export default News;
