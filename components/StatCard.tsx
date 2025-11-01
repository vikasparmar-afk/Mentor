interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: string;
  gradient?: string;
}

export default function StatCard({ 
  title, 
  value, 
  subtitle, 
  icon,
  gradient = 'from-saffron-500 to-orange-600'
}: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className={`text-3xl font-bold bg-gradient-to-r ${gradient} bg-clip-text text-transparent`}>
            {value}
          </p>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        {icon && (
          <div className={`text-4xl bg-gradient-to-r ${gradient} bg-clip-text text-transparent opacity-20`}>
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
