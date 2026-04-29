import { memo } from 'react'

function formatAmount(amount, direction) {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  })

  const sign = direction === 'credit' ? '+' : '-'
  return `${sign}${formatter.format(amount)}`
}

function formatDate(dateValue) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(dateValue))
}

function TransactionsTable({ rows }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
        <caption className="sr-only">
          Recent transactions with date, category, account, and amount
        </caption>
        <thead className="bg-slate-50 dark:bg-slate-900">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Date
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Description
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Category
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Account
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400"
            >
              Amount
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-100 bg-white dark:divide-slate-800 dark:bg-slate-950">
          {rows.map((transaction) => {
            const isCredit = transaction.direction === 'credit'

            return (
              <tr key={transaction.id} className="hover:bg-slate-50 dark:hover:bg-slate-900">
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-400">
                  {formatDate(transaction.date)}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-slate-900 dark:text-slate-100">
                  {transaction.description}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-600 dark:text-slate-300">
                  {transaction.category}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-sm text-slate-500 dark:text-slate-400">
                  {transaction.account}
                </td>
                <td
                  className={`whitespace-nowrap px-4 py-3 text-right text-sm font-semibold ${
                    isCredit ? 'text-emerald-500' : 'text-slate-900 dark:text-slate-200'
                  }`}
                >
                  {formatAmount(transaction.amount, transaction.direction)}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

export default memo(TransactionsTable)
