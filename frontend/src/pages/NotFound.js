import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
// import { ArrowLeft } from 'lucide-react';

/**
 * NotFound (404) page.
 *
 * Renders only the page content — the global Navbar and Footer from
 * App.jsx remain visible above and below this component, since they
 * are not duplicated here. This component simply fills the space
 * between them and centers the 404 message.
 */
const NotFound = () => {
  const navigate = useNavigate();

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-white px-6 py-20 sm:py-24">
      <div className="w-full max-w-xl text-center">

        {/* Large 404 heading */}
        <h1 className="font-display text-[5rem] sm:text-[7rem] md:text-[8.5rem] leading-none font-bold text-gray-900 tracking-tight">
          404
        </h1>

        {/* Title */}
        <h2 className="mt-4 text-xl sm:text-2xl font-semibold text-gray-900 tracking-tight">
          Page Not Found
        </h2>

        {/* Description */}
        <p className="mt-3 text-sm sm:text-base text-gray-500 leading-relaxed max-w-md mx-auto">
          The page you're looking for doesn't exist or may have been moved.
        </p>

        {/* Divider */}
        <div className="w-12 h-px bg-gray-200 mx-auto mt-8 mb-8" />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/collection"
            className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 bg-black text-white text-sm font-medium tracking-wide uppercase rounded-none hover:bg-gray-800 transition-colors duration-300"
          >
            Continue Shopping
          </Link>

          <button
            type="button"
            onClick={handleGoBack}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-transparent border border-gray-300 text-gray-800 text-sm font-medium tracking-wide uppercase rounded-none hover:border-black hover:bg-black hover:text-white transition-colors duration-300"
          >
            {/* <ArrowLeft className="w-4 h-4" strokeWidth={1.75} /> */}
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;