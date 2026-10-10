// components/collection/FilterSidebar.jsx
// Fully dynamic — no hardcoded sizes, colors, seasons, or prices.
// All filter options come from MongoDB via productAPI.getFilters().

import React, { useState, useEffect } from 'react';
import { productAPI } from '../../utils/api';

/* ─── Logical size order (frontend sort only, no backend change) ── */
const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', 'Free Size'];

/* ─── Build FILTER_CONFIG from the /api/products/filters response ──
   Backend shape expected:
   {
     sizes:      ["S", "M", "L"],
     colors:     [{ name: "Black", hex: "#000000" }],
     fabrics:    ["Cotton", "Silk"],
     seasons:    ["Summer", "Winter"],
     categories: [{ name: "Kurtis", slug: "kurtis", icon: "👗" }],
     priceRange: { min: 299, max: 4999 }
   }
─────────────────────────────────────────────────────────────────── */
const buildFilterConfig = ({ sizes = [], colors = [], fabrics = [], seasons = [], categories = [], priceRange = {} }) => {
  const config = [];

  // CATEGORY
  if (categories.length > 0) {
    config.push({
      title: 'CATEGORY',
      key: 'category',
      options: categories.map(c => ({
        label: c.icon ? `${c.icon} ${c.name}` : c.name,
        value: c.slug,
      })),
    });
  }

  // SIZE — sorted by clothing convention, not alphabetically
  if (sizes.length > 0) {
    const sorted = [...sizes].sort((a, b) => {
      const ai = SIZE_ORDER.indexOf(a);
      const bi = SIZE_ORDER.indexOf(b);
      return (ai === -1 ? 999 : ai) - (bi === -1 ? 999 : bi);
    });
    config.push({
      title: 'SIZE',
      key: 'size',
      options: sorted.map(s => ({ label: s, value: s })),
    });
  }

  // COLOR — carries hex for swatch dot rendering
  if (colors.length > 0) {
    config.push({
      title: 'COLOR',
      key: 'color',
      options: colors.map(c => ({ label: c.name, value: c.name, hex: c.hex })),
    });
  }

  // FABRIC
  if (fabrics.length > 0) {
    config.push({
      title: 'FABRIC',
      key: 'fabric',
      options: fabrics.map(f => ({ label: f, value: f })),
    });
  }

  // SEASON
  if (seasons.length > 0) {
    config.push({
      title: 'SEASON',
      key: 'season',
      options: seasons.map(s => ({ label: s, value: s })),
    });
  }

  // PRICE — brackets derived from real DB min/max so they stay meaningful
  const { min = 0, max = 10000 } = priceRange;
  if (max > min) {
    const mid1 = Math.round((min + (max - min) * 0.25) / 100) * 100;
    const mid2 = Math.round((min + (max - min) * 0.60) / 100) * 100;
    config.push({
      title: 'PRICE',
      key: 'price',
      options: [
        {
          label: `Under ₹${mid1.toLocaleString()}`,
          value: `0-${mid1}`,
          minPrice: 0,
          maxPrice: mid1,
        },
        {
          label: `₹${mid1.toLocaleString()} – ₹${mid2.toLocaleString()}`,
          value: `${mid1}-${mid2}`,
          minPrice: mid1,
          maxPrice: mid2,
        },
        {
          label: `Above ₹${mid2.toLocaleString()}`,
          value: `${mid2}-${max}`,
          minPrice: mid2,
          maxPrice: max,
        },
      ],
    });
  }

  return config;
};

/* ─── Loading skeleton ──────────────────────────────────────────── */
const FilterSkeleton = () => (
  <>
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="border-t border-gray-100 py-3.5 animate-pulse">
        <div className="h-3 bg-gray-100 rounded w-20 mb-3" />
        <div className="space-y-2.5">
          {Array.from({ length: 3 }).map((_, j) => (
            <div key={j} className="flex items-center gap-2.5">
              <div className="w-3.5 h-3.5 rounded bg-gray-100 flex-shrink-0" />
              <div className="h-3 bg-gray-100 rounded w-24" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </>
);

/* ══════════════════════════════════════════════════════════════════
   FilterSidebar
   Props:
     checked     : { "size__M": true, "color__Pink": true, ... }
     setChecked  : React setState setter
     onClear     : () => void  — clears all checked filters
     filterConfig    : (optional) pass pre-fetched config to avoid re-fetch
     filtersLoading  : (optional) pass loading state alongside filterConfig
   If filterConfig is NOT passed, the component fetches its own data.
══════════════════════════════════════════════════════════════════ */
const FilterSidebar = ({
  checked,
  setChecked,
  onClear,
  // optional controlled mode — CollectionPage can pass pre-fetched data
  filterConfig: externalConfig,
  filtersLoading: externalLoading,
}) => {
  const [open, setOpen]               = useState('SIZE');
  const [internalConfig, setInternalConfig]   = useState([]);
  const [internalLoading, setInternalLoading] = useState(true);

  // Use external config if provided, else self-fetch
  const filterConfig  = externalConfig  ?? internalConfig;
  const filtersLoading = externalLoading ?? internalLoading;

  /* Self-fetch only when CollectionPage does NOT pass filterConfig */
  useEffect(() => {
    if (externalConfig !== undefined) return; // controlled mode — skip self-fetch
    setInternalLoading(true);
    productAPI.getFilters()
      .then(res => {
        if (res.data.success) {
          setInternalConfig(buildFilterConfig(res.data.filters));
        }
      })
      .catch(console.error)
      .finally(() => setInternalLoading(false));
  }, [externalConfig]);

  const activeCount = Object.values(checked).filter(Boolean).length;

  const toggle = (key, optValue) => {
    // PRICE is single-select (radio-like) — clear other price options first
    if (key === 'price') {
      setChecked(prev => {
        const next = { ...prev };
        Object.keys(next).forEach(k => { if (k.startsWith('price__')) next[k] = false; });
        next[`price__${optValue}`] = !prev[`price__${optValue}`];
        return next;
      });
      return;
    }
    setChecked(prev => ({ ...prev, [`${key}__${optValue}`]: !prev[`${key}__${optValue}`] }));
  };

  return (
    <aside className="w-full sticky top-20 self-start bg-white border-r border-gray-100 pt-6 pb-16">

      {/* ── Header ──────────────────────────────────────────────── */}
      <div className="px-6 mb-1 flex items-center justify-between">
        <h2 className="text-xs font-semibold tracking-[3px] uppercase text-gray-400">
          Filters
          {activeCount > 0 && (
            <span className="ml-1 bg-rose-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </h2>
        {activeCount > 0 && (
          <button
            onClick={onClear}
            className="text-[11px] text-rose-500 hover:text-rose-700 font-medium transition-colors"
          >
            Clear All
          </button>
        )}
      </div>

      {/* ── Accordion ───────────────────────────────────────────── */}
      <div className="flex flex-col px-6">
        {filtersLoading ? (
          <FilterSkeleton />
        ) : (
          filterConfig.map(filter => (
            <div key={filter.title} className="border-t border-gray-100 py-3.5">

              {/* Section toggle */}
              <button
                onClick={() => setOpen(prev => (prev === filter.title ? '' : filter.title))}
                className="flex w-full justify-between items-center cursor-pointer text-left group"
              >
                <span className="text-xs font-semibold tracking-[2px] uppercase text-gray-600 group-hover:text-gray-900 transition-colors">
                  {filter.title}
                </span>
                <span className="text-gray-400 text-base leading-none group-hover:text-gray-700 transition-colors select-none">
                  {open === filter.title ? '−' : '+'}
                </span>
              </button>

              {/* Options */}
              {open === filter.title && (
                <div className="flex flex-col gap-2.5 mt-3.5 max-h-40 overflow-y-auto pr-1">
                  {filter.options.map(opt => {
                    const k       = `${filter.key}__${opt.value}`;
                    const isActive = !!checked[k];
                    return (
                      <label
                        key={opt.value}
                        className="flex items-center gap-2.5 cursor-pointer group/item"
                      >
                        <input
                          type="checkbox"
                          checked={isActive}
                          onChange={() => toggle(filter.key, opt.value)}
                          className="accent-rose-500 w-3.5 h-3.5 cursor-pointer rounded flex-shrink-0"
                        />
                        {/* Color swatch — only when hex is present */}
                        {opt.hex && (
                          <span
                            className="w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: opt.hex }}
                          />
                        )}
                        <span
                          className={`text-sm transition-colors capitalize ${
                            isActive
                              ? 'text-gray-900 font-medium'
                              : 'text-gray-500 group-hover/item:text-gray-800'
                          }`}
                        >
                          {opt.label}
                        </span>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </aside>
  );
};

// Export buildFilterConfig so CollectionPage can use it if fetching centrally
export { buildFilterConfig };
export default FilterSidebar;