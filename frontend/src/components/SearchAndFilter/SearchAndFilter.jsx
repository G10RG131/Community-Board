// frontend/src/components/SearchAndFilter/SearchAndFilter.jsx
import React, { useState } from 'react';
import './SearchAndFilter.css';

export default function SearchAndFilter({ onSearch, onFilter }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    location: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const applyFilters = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: '',
      dateTo: '',
      location: ''
    });
    onFilter({});
  };

  return (
    <div className="search-filter-container mb-4">
      <form onSubmit={handleSearch} className="search-form mb-3">
        <div className="input-group">
          <input
            type="text"
            className="form-control"
            placeholder="Search events..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-primary" type="submit">
            <i className="fas fa-search"></i>
          </button>
          <button 
            className="btn btn-outline-secondary" 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
      </form>

      {showFilters && (
        <form onSubmit={applyFilters} className="filter-form card card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <label htmlFor="dateFrom" className="form-label">From Date</label>
              <input
                type="date"
                className="form-control"
                id="dateFrom"
                name="dateFrom"
                value={filters.dateFrom}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="dateTo" className="form-label">To Date</label>
              <input
                type="date"
                className="form-control"
                id="dateTo"
                name="dateTo"
                value={filters.dateTo}
                onChange={handleFilterChange}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="location" className="form-label">Location</label>
              <input
                type="text"
                className="form-control"
                id="location"
                name="location"
                placeholder="Filter by location"
                value={filters.location}
                onChange={handleFilterChange}
              />
            </div>
          </div>
          <div className="mt-3 d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-outline-danger"
              onClick={resetFilters}
            >
              Reset
            </button>
            <button type="submit" className="btn btn-primary">
              Apply Filters
            </button>
          </div>
        </form>
      )}
    </div>
  );
}