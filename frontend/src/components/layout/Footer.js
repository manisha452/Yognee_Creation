import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-gray-900 text-gray-300 mt-16">
    <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      <div>
        <div className="flex items-center gap-2 mb-4">
          <div className="w-8 h-8 bg-rose-600 rounded-full flex items-center justify-center text-white font-display font-bold">YC</div>
          <span className="font-display text-xl font-bold text-white">yogneecreation </span>
        </div>
        <p className="text-sm text-gray-400 mb-4">Elevating Indian girls' fashion with timeless elegance and modern style. From kurtis to accessories — find your perfect look.</p>
        <div className="flex gap-3">
          {['facebook', 'instagram', 'twitter', 'youtube'].map(s => (
            <a key={s} href={`#${s}`} className="w-8 h-8 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 hover:bg-rose-600 hover:text-white transition-colors text-xs">{s[0].toUpperCase()}</a>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-display font-semibold text-white mb-4">Categories</h4>
        <ul className="space-y-2 text-sm">
          {[['Short Kurti', 'short-kurti'], ['Long Kurti', 'long-kurti'], ['Suits', 'suits'], ['Tops', 'tops'], ['Bottomwear', 'bottomwear'], ['Accessories', 'accessories']].map(([name, slug]) => (
            <li key={slug}><Link to={`/collection/${slug}`} className="hover:text-rose-400 transition-colors">{name}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold text-white mb-4">Quick Links</h4>
        <ul className="space-y-2 text-sm">
          {[['My Account', '/profile'], ['My Orders', '/orders'], ['Wishlist', '/wishlist'], ['Cart', '/cart'], ['Track Order', '/orders']].map(([name, link]) => (
            <li key={name}><Link to={link} className="hover:text-rose-400 transition-colors">{name}</Link></li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="font-display font-semibold text-white mb-4">Contact Us</h4>
        <ul className="space-y-3 text-sm text-gray-400">
          <li className="flex gap-2"><span>📍</span><span>Jaipur, Rajasthan, India</span></li>
          <li className="flex gap-2"><span>📞</span><span>+91 98765 43210</span></li>
          <li className="flex gap-2"><span>✉️</span><span>support@zurifashion.com</span></li>
          <li className="flex gap-2"><span>⏰</span><span>Mon–Sat, 9AM–7PM</span></li>
        </ul>
        <div className="mt-4">
          <p className="text-xs text-gray-500 mb-2">We Accept</p>
          <div className="flex gap-2 flex-wrap">
            {['UPI', 'PhonePe', 'Paytm', 'Cards', 'COD'].map(p => (
              <span key={p} className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </div>

    <div className="border-t border-gray-800 py-4 text-center text-xs text-gray-500">
      <p>© {new Date().getFullYear()} Zuri Fashion. All rights reserved. | Crafted with ❤️ in Rajasthan</p>
    </div>
  </footer>
);

export default Footer;
