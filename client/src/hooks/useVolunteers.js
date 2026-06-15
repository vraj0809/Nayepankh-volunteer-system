import { useState, useEffect, useCallback } from 'react';
import adminService from '../services/adminService';

export const useVolunteers = (initialParams = {}) => {
  const [volunteers, setVolunteers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    status: 'all',
    city: '',
    skills: '',
    yearOfStudy: '',
    sortBy: 'registeredAt',
    sortOrder: 'desc',
    limit: 10,
    ...initialParams,
  });

  const fetchVolunteers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { ...filters, page };
      const res = await adminService.getAllVolunteers(params);
      if (res.success) {
        setVolunteers(res.data.volunteers);
        setTotal(res.data.total);
        setTotalPages(res.data.totalPages);
      }
    } catch (error) {
      console.error('Error fetching volunteers:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, page]);

  useEffect(() => {
    fetchVolunteers();
  }, [fetchVolunteers]);

  const updateFilters = (newFilters) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      status: 'all',
      city: '',
      skills: '',
      yearOfStudy: '',
      sortBy: 'registeredAt',
      sortOrder: 'desc',
      limit: 10,
    });
    setPage(1);
  };

  return {
    volunteers,
    total,
    page,
    totalPages,
    loading,
    filters,
    setPage,
    updateFilters,
    clearFilters,
    refetch: fetchVolunteers,
  };
};

export default useVolunteers;
