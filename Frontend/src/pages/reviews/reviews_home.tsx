// src/pages/ReviewsSummary.tsx

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/custom/navbar';
import { useTheme } from '../../context/ThemeContext';
import starsDataRaw from '../../data/stars.json';
import reviewsDataRaw from '../../data/bank_reviews.json';
import hero_image from '../../assets/hero.jpeg';
import { motion } from 'framer-motion';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';

// Define the new shape of each entry in stars.json
interface StarEntry {
  location: string;
  star: number;
  image: string;
}

interface Review {
  review: string;
  stars: number;
  reviewer: string;
  source: string;
  location: string;
}

interface ChartDataPoint {
  branch: string;
  rating: number;
}

const ReviewsSummary: React.FC = () => {
  // starsData is now an array of StarEntry objects
  const [starsData, setStarsData] = useState<StarEntry[]>([]);
  const [reviewsData, setReviewsData] = useState<Review[]>([]);
  const { isDarkMode } = useTheme();

  useEffect(() => {
    // Cast the imported JSON to StarEntry[]
    setStarsData(starsDataRaw as StarEntry[]);
    setReviewsData(reviewsDataRaw as Review[]);
  }, []);

  // Summary metrics
  const totalReviews = reviewsData.length;
  const averageRating =
    totalReviews > 0
      ? reviewsData.reduce((sum, r) => sum + r.stars, 0) / totalReviews
      : 0;

  // Unique branch names (stripping any "فرع " prefix)
  const branchNamesSet = new Set<string>();
  reviewsData.forEach((r) => {
    const withoutPrefix = r.location.replace(/^فرع\s+/, '');
    const branchName = withoutPrefix.split(' -')[0].trim();
    if (branchName) branchNamesSet.add(branchName);
  });
  const numberOfBranchesReviewed = branchNamesSet.size;

  // Rating distribution (1–5)
  const distribution: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  reviewsData.forEach((r) => {
    const s = r.stars;
    if (distribution[s] !== undefined) {
      distribution[s]++;
    }
  });

  // Chart data from starsData array
  const chartData: ChartDataPoint[] = starsData.map((entry) => ({
    branch: entry.location,
    rating: entry.star,
  }));

  return (
    <div
      className={`flex flex-col min-h-screen ${
        isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
      }`}
    >
      {/* Navbar */}
      <Navbar />

     <motion.section
      className="relative w-full h-screen"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { duration: 1 } },
      }}
    >
      {/* Hero image */}
      <motion.img
        src={hero_image}
        alt="Bank of Palestine Headquarters"
        className="object-cover w-full h-full"
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1, transition: { duration: 1.2, ease: 'easeOut' } }}
      />

      {/* Overlay with text */}
      <motion.div
        className="absolute inset-0 flex flex-col items-center justify-center backdrop-brightness-50"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1, transition: { delay: 0.8, duration: 0.8, ease: 'easeOut' } }}
      >
        <motion.h1
          className={`text-4xl sm:text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-100'}`}
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1, duration: 0.6, ease: 'easeOut' } }}
        >
          Bank of Palestine Reviews
        </motion.h1>
        <motion.p
          className={`text-lg sm:text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-200'}`}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1, transition: { delay: 1.2, duration: 0.6, ease: 'easeOut' } }}
        >
          Discover Our Branch Ratings
        </motion.p>
      </motion.div>
    </motion.section>


      {/* Full‐height, full‐width Summary Section */}
      <section
        className={`
          w-full h-screen flex flex-col items-center justify-center 
          ${isDarkMode ? 'bg-gray-800 text-gray-100' : 'bg-white text-gray-800'}
        `}
      >
        <h2 className="text-3xl font-semibold mb-8">Reviews Overview</h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 w-3/4">
          {/* Average Rating */}
          <div className="flex flex-col items-center">
            <span className="text-xl font-medium">Average Rating</span>
            <span className="mt-2 text-4xl font-bold">
              {averageRating.toFixed(1)} / 5 <span className="text-yellow-400">★</span>
            </span>
          </div>

          {/* Total Reviews */}
          <div className="flex flex-col items-center">
            <span className="text-xl font-medium">Total Reviews</span>
            <span className="mt-2 text-4xl font-bold">{totalReviews}</span>
          </div>

          {/* Number of Branches Reviewed */}
          <div className="flex flex-col items-center">
            <span className="text-xl font-medium">Branches Reviewed</span>
            <span className="mt-2 text-4xl font-bold">
              {numberOfBranchesReviewed}
            </span>
          </div>

          {/* Placeholder */}
          <div className="hidden sm:block"></div>
        </div>

        {/* Rating Distribution */}
        <div className="mt-12 w-3/4">
            <span className="text-xl font-medium">Rating Distribution</span>
            <ul className="mt-4 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => (
                    <li key={star} className="flex items-center">
                        <Link 
                            to={`/reviews/rating/${star}`} 
                            className="group flex items-center w-full p-2 rounded-md transition-all duration-200 hover:bg-opacity-10 hover:bg-gray-500 cursor-pointer"
                        >
                            <span className="w-16 flex items-center">
                                {star}
                                <span className="text-yellow-400 ml-1">★</span>
                            </span>
                            <div
                                className={`
                                    flex-1 h-5 rounded-full overflow-hidden 
                                    ${isDarkMode ? 'bg-gray-700' : 'bg-gray-200'}
                                `}
                            >
                                <div
                                    className={`
                                        h-full rounded-full 
                                        ${isDarkMode ? 'bg-yellow-500' : 'bg-yellow-400'}
                                    `}
                                    style={{
                                        width: `${
                                            totalReviews > 0
                                                ? (distribution[star] / totalReviews) * 100
                                                : 0
                                        }%`,
                                    }}
                                />
                            </div>
                            <span className="ml-3 w-8 text-right">{distribution[star]}</span>
                            <span className="ml-2 text-gray-400 transform transition-transform group-hover:translate-x-1">→</span>
                        </Link>
                    </li>
                ))}
            </ul>
        </div>
      </section>

      {/* Bar Chart Section: Avg rating per branch (Full viewport) */}
      <section className={`w-full h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-white'}`}>
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center py-6 px-8">
            <h2
              className={`text-2xl font-semibold ${
                isDarkMode ? 'text-gray-100' : 'text-gray-800'
              }`}
            >
              Average Rating by Branch
            </h2>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis
                  dataKey="branch"
                  tickLine={false}
                  tick={{ fill: isDarkMode ? '#E2E8F0' : '#4A5568', fontSize: 12 }}
                  axisLine={{ stroke: isDarkMode ? '#4A5568' : '#CBD5E0' }}
                  interval={0}
                  angle={-35}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  domain={[0, 5]}
                  tickLine={false}
                  tick={{ fill: isDarkMode ? '#E2E8F0' : '#4A5568' }}
                  axisLine={{ stroke: isDarkMode ? '#4A5568' : '#CBD5E0' }}
                  fontSize={12}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: isDarkMode ? '#2D3748' : '#FFFFFF',
                    borderColor: isDarkMode ? '#4A5568' : '#E2E8F0',
                    color: isDarkMode ? '#E2E8F0' : '#1A202C',
                  }}
                  itemStyle={{ color: isDarkMode ? '#E2E8F0' : '#1A202C' }}
                />
                <Bar
                  dataKey="rating"
                  fill={isDarkMode ? '#F6E05E' : '#4299E1'}
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Link to Branch Ratings page (Full viewport) */}
    <section className={`w-full h-screen flex items-center justify-center ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
      <Link
        to="/branch-ratings"
        className={`
            px-8 py-4 text-xl font-semibold rounded-lg transition
            flex items-center
            ${isDarkMode
              ? 'bg-yellow-500 text-gray-900 hover:bg-yellow-400'
              : 'bg-blue-700 text-white hover:bg-blue-600'
            }
            group
        `}
      >
        <span>رؤية تقييمات الفروع</span>
        <span className="inline-block ml-2 transform transition-transform duration-300 group-hover:translate-x-2">→</span>
      </Link>
    </section>
    </div>
  );
};

export default ReviewsSummary;
