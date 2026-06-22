/**
 * Recharts-backed sequence visualizer. Pulled into its own module so it can be
 * lazy-loaded with React.lazy — Recharts is the single largest dependency in
 * the bundle, and the chart is only shown on the "Visual" tab.
 */
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

interface SequenceChartProps {
  data: { val: number }[]
}

export default function SequenceChart({ data }: SequenceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
        <XAxis dataKey="val" hide />
        <YAxis hide domain={['auto', 'auto']} />
        <Tooltip
          cursor={{ fill: 'rgba(16, 185, 129, 0.05)' }}
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              return (
                <div className="glass px-4 py-2 rounded-xl text-xs font-bold border-range-primary/20">
                  Value: {payload[0].value}
                </div>
              )
            }
            return null
          }}
        />
        <Bar dataKey="val" radius={[4, 4, 0, 0]}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={index % 2 === 0 ? '#10b981' : '#3b82f6'}
              fillOpacity={0.8}
            />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  )
}
