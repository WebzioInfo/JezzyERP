"use client";

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { formatCurrency } from "@/utils/financials";

interface ClientRevenuePieProps {
  data: { name: string; value: number }[];
}

const COLORS = ["#1B3A6B", "#C8991A", "#16A34A", "#2563EB", "#D97706", "#94A3B8"];

export function ClientRevenuePie({ data }: ClientRevenuePieProps) {
  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center p-20 text-slate-400 italic text-sm">
        No sales data available
      </div>
    );
  }

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
            animationBegin={0}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="rgba(255,255,255,0.1)" strokeWidth={2} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              padding: "12px",
            }}
            formatter={(value: any) => [formatCurrency(Number(value)), "Total Spend"]}
          />
          <Legend
            verticalAlign="bottom"
            align="center"
            iconType="circle"
            formatter={(value) => <span className="text-xs font-bold text-slate-600 truncate max-w-[120px] inline-block pt-1">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
