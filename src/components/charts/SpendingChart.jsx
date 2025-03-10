
import React, { useState } from 'react';
import { Card, Typography, Radio, Empty } from 'antd';
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

const { Title } = Typography;

// Define chart colors
const COLORS = [
  '#1f77b4', '#ff7f0e', '#2ca02c', '#d62728', '#9467bd', 
  '#8c564b', '#e377c2', '#7f7f7f', '#bcbd22', '#17becf'
];

const SpendingChart = ({ transactions }) => {
  const [chartType, setChartType] = useState('category');

  // Filter to only expense transactions
  const expenseTransactions = transactions.filter(t => t.type === 'expense');

  // Process data based on chart type
  const processData = () => {
    if (chartType === 'category') {
      // Group by category
      const categoryMap = expenseTransactions.reduce((acc, transaction) => {
        const category = transaction.category;
        if (!acc[category]) {
          acc[category] = 0;
        }
        acc[category] += parseFloat(transaction.amount);
        return acc;
      }, {});

      // Convert to chart data format
      return Object.keys(categoryMap).map(category => ({
        name: category,
        value: categoryMap[category]
      })).sort((a, b) => b.value - a.value);

    } else {
      // Group by month
      const monthMap = expenseTransactions.reduce((acc, transaction) => {
        const date = new Date(transaction.date);
        const month = date.toLocaleString('default', { month: 'short' });
        if (!acc[month]) {
          acc[month] = 0;
        }
        acc[month] += parseFloat(transaction.amount);
        return acc;
      }, {});

      // Convert to chart data format
      return Object.keys(monthMap).map(month => ({
        name: month,
        value: monthMap[month]
      }));
    }
  };

  const data = processData();

  // Format for tooltip
  const formatTooltip = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card 
      className="h-full shadow-sm"
      title={<Title level={4}>Spending Breakdown</Title>}
      extra={
        <Radio.Group 
          value={chartType} 
          onChange={e => setChartType(e.target.value)}
          buttonStyle="solid"
          size="small"
        >
          <Radio.Button value="category">By Category</Radio.Button>
          <Radio.Button value="month">By Month</Radio.Button>
        </Radio.Group>
      }
    >
      {data.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                animationDuration={500}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={formatTooltip} />
              <Legend layout="horizontal" verticalAlign="bottom" align="center" />
            </PieChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty description="No expense data to display" />
      )}
    </Card>
  );
};

export default SpendingChart;
