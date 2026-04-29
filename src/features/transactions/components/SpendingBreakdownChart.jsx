import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const CHART_COLORS = ['#2563eb', '#14b8a6', '#f59e0b', '#8b5cf6', '#ef4444']

function SpendingBreakdownChart({ data }) {
  return (
    <div
      role="img"
      aria-label="Pie chart showing spending distribution by category"
      className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
    >
      <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
        Spending Breakdown
      </h3>
      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
        Expense distribution across categories
      </p>

      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={84}
              paddingAngle={3}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`slice-${entry.name}`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) =>
                new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
                  maximumFractionDigits: 0,
                }).format(value)
              }
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default SpendingBreakdownChart
