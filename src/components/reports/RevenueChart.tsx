"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { formatCurrency } from "@/utils/financials";

interface RevenueChartProps {
  data: { month: string; revenue: number }[];
}

export function RevenueChart({ data }: RevenueChartProps) {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 12, fontWeight: 500 }}
            dy={10}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: "#94A3B8", fontSize: 10, fontWeight: 500 }}
            tickFormatter={(value) => `₹${value / 1000}k`}
          />
          <Tooltip
            cursor={{ fill: "#F1F5F9", radius: 8 }}
            contentStyle={{
              borderRadius: "12px",
              border: "none",
              boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
              padding: "12px",
            }}
            formatter={(value: any) => [formatCurrency(Number(value)), "Revenue"]}
            labelStyle={{ fontWeight: "bold", marginBottom: "4px", color: "#1E293B" }}
          />
          <Bar
            dataKey="revenue"
            radius={[6, 6, 0, 0]}
            barSize={32}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === data.length - 1 ? "#C8991A" : "#1B3A6B"} 
                fillOpacity={0.9}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
