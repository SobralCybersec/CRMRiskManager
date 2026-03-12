const Card = ({ children, className = '', hover = false }) => {
  const hoverClass = hover ? 'card-hover' : '';
  
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-b border-gray-200 dark:border-gray-700 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-100 ${className}`}>
    {children}
  </h3>
);

const CardDescription = ({ children, className = '' }) => (
  <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${className}`}>
    {children}
  </p>
);

Card.Header = CardHeader;
Card.Content = CardContent;
Card.Title = CardTitle;
Card.Description = CardDescription;

export default Card;