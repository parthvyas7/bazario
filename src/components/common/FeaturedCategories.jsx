import { Link } from 'react-router-dom';

const FeaturedCategories = () => {
  // Example categories - in a real app, these might come from an API
  const categories = [
    { id: 1, name: 'Electronics', icon: '🖥️', color: 'bg-blue-100' },
    { id: 2, name: 'Fashion', icon: '👕', color: 'bg-pink-100' },
    { id: 3, name: 'Home & Kitchen', icon: '🏠', color: 'bg-green-100' },
    { id: 4, name: 'Beauty', icon: '💄', color: 'bg-purple-100' },
    { id: 5, name: 'Sports', icon: '⚽', color: 'bg-yellow-100' },
    { id: 6, name: 'Books', icon: '📚', color: 'bg-red-100' },
  ];

  return (
    <section className="my-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/products?category=${category.name}`}
            className={`${category.color} rounded-lg p-4 text-center hover:shadow-md transition-shadow`}
          >
            <div className="text-3xl mb-2">{category.icon}</div>
            <div className="font-medium">{category.name}</div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;