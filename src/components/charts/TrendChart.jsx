
import React, { useState } from 'react';
import { Card, Typography, Radio, Empty } from 'antd';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  BarChart,
  Bar
} from 'recharts';
import { format, subMonths, startOfMonth, parseISO } from 'date-fns';

const { Title } = Typography;

const TrendChart = ({ transactions }) => {
  const [chartType, setChartType] = useState('line');
  const [timeRange, setTimeRange] = useState(6); // months

  // Prepare chart data
  const processData = () => {
    // Create a map of months with default values
    const monthsMap = {};
    
    // Initialize with the last X months
    for (let i = timeRange - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      const monthKey = format(date, 'yyyy-MM');
      const monthLabel = format(date, 'MMM yyyy');
      
      monthsMap[monthKey] = {
        month: monthLabel,
        income: 0,
        expense: 0,
        balance: 0
      };
    }
    
    // Fill with transaction data
    transactions.forEach(transaction => {
      const date = parseISO(transaction.date);
      const monthKey = format(date, 'yyyy-MM');
      
      // Skip if month is not in our range
      if (!monthsMap[monthKey]) return;
      
      const amount = parseFloat(transaction.amount);
      
      if (transaction.type === 'income') {
        monthsMap[monthKey].income += amount;
      } else {
        monthsMap[monthKey].expense += amount;
      }
    });
    
    // Calculate balance for each month
    Object.keys(monthsMap).forEach(key => {
      monthsMap[key].balance = monthsMap[key].income - monthsMap[key].expense;
    });
    
    // Convert to array and sort by date
    return Object.values(monthsMap);
  };

  const data = processData();

  // Format for tooltip
  const formatCurrency = (value) => {
    return `$${value.toFixed(2)}`;
  };

  return (
    <Card 
      className="h-full shadow-sm"
      title={<Title level={4}>Financial Trend</Title>}
      extra={
        <div className="flex gap-2">
          <Radio.Group 
            value={chartType} 
            onChange={e => setChartType(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value="line">Line</Radio.Button>
            <Radio.Button value="bar">Bar</Radio.Button>
          </Radio.Group>
          <Radio.Group 
            value={timeRange} 
            onChange={e => setTimeRange(e.target.value)}
            buttonStyle="solid"
            size="small"
          >
            <Radio.Button value={3}>3M</Radio.Button>
            <Radio.Button value={6}>6M</Radio.Button>
            <Radio.Button value={12}>12M</Radio.Button>
          </Radio.Group>
        </div>
      }
    >
      {data.length > 0 ? (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            {chartType === 'line' ? (
              <LineChart
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Line type="monotone" dataKey="income" stroke="#52c41a" activeDot={{ r: 8 }} name="Income" />
                <Line type="monotone" dataKey="expense" stroke="#f5222d" name="Expense" />
                <Line type="monotone" dataKey="balance" stroke="#1890ff" name="Balance" />
              </LineChart>
            ) : (
              <BarChart
                data={data}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={formatCurrency} />
                <Legend />
                <Bar dataKey="income" name="Income" fill="#52c41a" />
                <Bar dataKey="expense" name="Expense" fill="#f5222d" />
                <Bar dataKey="balance" name="Balance" fill="#1890ff" />
              </BarChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <Empty description="No data to display" />
      )}
    </Card>
  );
};

export default TrendChart;
