
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProductGrid from './components/ProductGrid';
import Header from './components/Header';
import ReviewPage from './components/ReviewPage'; // <- Create this file
import { productsAPI } from './utils/api';

function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dataVersion, setDataVersion] = useState(0);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      let response = await productsAPI.getAll();

      if (response.data.length === 0) {
        await productsAPI.seed();
        response = await productsAPI.getAll();
      }

      setProducts(response.data);
    } catch (error) {
      console.error('Error loading products:', error);
      try {
        await productsAPI.seed();
        const response = await productsAPI.getAll();
        setProducts(response.data);
      } catch (seedError) {
        console.error('Error seeding products:', seedError);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDataUpdate = () => {
    setDataVersion(prev => prev + 1);
  };

  if (loading) {
    return (
      <AuthProvider>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading products...</p>
          </div>
        </div>
      </AuthProvider>
    );
  }

  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
          <Header />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route
                path="/"
                element={
                  <ProductGrid
                    products={products}
                    onDataUpdate={handleDataUpdate}
                    key={dataVersion}
                  />
                }
              />
              <Route path="/review/:id" element={<ReviewPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
