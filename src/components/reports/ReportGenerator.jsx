
import React, { useState } from 'react';
import { Card, Typography, Button, DatePicker, Radio, Space, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import Papa from 'papaparse';
import { useTheme } from '../../contexts/ThemeContext';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

const ReportGenerator = ({ transactions }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState('all');
  const [loading, setLoading] = useState(false);
  const { isDarkMode } = useTheme();

  // Filter transactions based on date range and report type
  const getFilteredTransactions = () => {
    let filtered = [...transactions];
    
    // Filter by date range
    if (dateRange[0] && dateRange[1]) {
      const startDate = dateRange[0].startOf('day').toDate();
      const endDate = dateRange[1].endOf('day').toDate();
      
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= startDate && transactionDate <= endDate;
      });
    }
    
    // Filter by transaction type
    if (reportType !== 'all') {
      filtered = filtered.filter(t => t.type === reportType);
    }
    
    return filtered;
  };

  // Generate CSV report
  const generateCSV = (filteredTransactions) => {
    try {
      const data = filteredTransactions.map(t => ({
        Date: format(new Date(t.date), 'yyyy-MM-dd'),
        Description: t.description,
        Category: t.category,
        Type: t.type,
        Amount: parseFloat(t.amount).toFixed(2)
      }));
      
      const csv = Papa.unparse(data);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      
      // Create download link and trigger download
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `financial-report-${format(new Date(), 'yyyy-MM-dd')}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      return true;
    } catch (error) {
      console.error('Error generating CSV:', error);
      return false;
    }
  };

  // Generate report
  const generateReport = () => {
    setLoading(true);
    
    try {
      const filteredTransactions = getFilteredTransactions();
      
      if (filteredTransactions.length === 0) {
        message.warning('No transactions found for the selected criteria.');
        setLoading(false);
        return;
      }
      
      let success = generateCSV(filteredTransactions);
      
      if (success) {
        message.success('Report successfully generated in CSV format.');
      } else {
        message.error('Failed to generate report. Please try again.');
      }
    } catch (error) {
      console.error('Error generating report:', error);
      message.error('Failed to generate report. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const cardStyle = isDarkMode 
    ? { 
        background: 'linear-gradient(109.6deg, rgba(41, 44, 52, 1) 11.2%, rgba(51, 56, 68, 1) 91.1%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: 'none',
        transition: 'all 0.3s ease'
      } 
    : { 
        backgroundImage: 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: 'none',
        transition: 'all 0.3s ease'
      };

  return (
    <Card 
      className="shadow-sm animate-fade-in" 
      style={cardStyle}
      hoverable
    >
      <Title level={4} className={`animate-slide-up mb-2 ${isDarkMode ? 'text-white' : ''}`}>Generate Financial Report</Title>
      <Text type={isDarkMode ? "secondary" : "secondary"} className={`block mb-6 animate-slide-up ${isDarkMode ? 'text-gray-400' : ''}`} style={{ animationDelay: '0.1s' }}>
        Create customized reports of your financial data for selected date ranges and export them in CSV format.
      </Text>
      
      <div className="space-y-4">
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Text strong className={`block mb-2 ${isDarkMode ? 'text-white' : ''}`}>Date Range</Text>
          <RangePicker 
            style={{ width: '100%' }}
            onChange={setDateRange}
            className="hover-scale"
          />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Text strong className={`block mb-2 ${isDarkMode ? 'text-white' : ''}`}>Report Type</Text>
          <Radio.Group 
            value={reportType} 
            onChange={e => setReportType(e.target.value)}
            className="w-full"
          >
            <Radio.Button 
              value="all" 
              style={{ width: '33.3%', textAlign: 'center', transition: 'all 0.3s ease' }}
              className="hover-scale"
            >
              All
            </Radio.Button>
            <Radio.Button 
              value="income" 
              style={{ width: '33.3%', textAlign: 'center', transition: 'all 0.3s ease' }}
              className="hover-scale"
            >
              Income
            </Radio.Button>
            <Radio.Button 
              value="expense" 
              style={{ width: '33.3%', textAlign: 'center', transition: 'all 0.3s ease' }}
              className="hover-scale"
            >
              Expenses
            </Radio.Button>
          </Radio.Group>
        </div>
        
        <Button 
          type="primary" 
          icon={<DownloadOutlined />} 
          onClick={generateReport}
          loading={loading}
          block
          className="mt-6 animate-slide-up hover-scale"
          style={{ 
            height: '45px', 
            fontSize: '16px', 
            animationDelay: '0.5s',
            background: isDarkMode ? 'linear-gradient(90deg, #177ddc, #40a9ff)' : 'linear-gradient(90deg, #1890ff, #69c0ff)',
            border: 'none',
            boxShadow: isDarkMode ? '0 8px 16px -4px rgba(23, 125, 220, 0.3)' : '0 8px 16px -4px rgba(24, 144, 255, 0.3)'
          }}
        >
          Generate CSV Report
        </Button>
      </div>
    </Card>
  );
};

export default ReportGenerator;
