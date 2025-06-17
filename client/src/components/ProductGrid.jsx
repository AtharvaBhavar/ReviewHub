import React from 'react';
import ProductCard from './ProductCard';

const ProductGrid = ({ products, onDataUpdate }) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Discover our curated collection of premium products. Share your experience and help others make informed decisions.
        </p>
      </div>
      
      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">

        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            // onDataUpdate={onDataUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;