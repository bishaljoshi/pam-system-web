export default function DashboardCard({ title, value, color = 'blue' }: { title: string; value: string | number; color?: 'blue' | 'green' | 'purple' | 'yellow' | 'red' | 'gray'; }) {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800',
    green: 'bg-green-100 text-green-800',
    purple: 'bg-purple-100 text-purple-800',
    yellow: 'bg-yellow-100 text-yellow-800',
    red: 'bg-red-100 text-red-800',
    gray: 'bg-gray-100 text-gray-800',
  };
  return (
    <div className={`rounded-lg shadow p-4 flex flex-col ${colorMap[color]}`}>
        <p className="text-sm uppercase tracking-wide">{title}</p>
        <p className="text-4xl font-bold mt-2">{value}</p>
    </div>
  );
}