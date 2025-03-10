
import React, { useState } from 'react';
import { Card, Typography, Button, DatePicker, Select, Space, Radio, message } from 'antd';
import { DownloadOutlined, FileExcelOutlined, FilePdfOutlined } from '@ant-design/icons';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Papa from 'papaparse';

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const ReportGenerator = ({ transactions }) => {
  const [dateRange, setDateRange] = useState([null, null]);
  const [reportType, setReportType] = useState('all');
  const [fileFormat, setFileFormat] = useState('pdf');
  const [loading, setLoading] = useState(false);

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

  // Generate PDF report
  const generatePDF = (filteredTransactions) => {
    try {
      const doc = new jsPDF();
      
      // Add title
      doc.setFontSize(20);
      doc.text('Financial Report', 105, 15, { align: 'center' });
      doc.setFontSize(12);
      
      // Add date range
      if (dateRange[0] && dateRange[1]) {
        const startDateStr = format(dateRange[0].toDate(), 'MMM dd, yyyy');
        const endDateStr = format(dateRange[1].toDate(), 'MMM dd, yyyy');
        doc.text(`Period: ${startDateStr} to ${endDateStr}`, 105, 25, { align: 'center' });
      }
      
      // Add report type
      const reportTypeText = reportType === 'all' 
        ? 'All Transactions' 
        : reportType === 'income' 
          ? 'Income Transactions' 
          : 'Expense Transactions';
      doc.text(`Report Type: ${reportTypeText}`, 105, 32, { align: 'center' });
      
      // Add generation date
      doc.text(`Generated on: ${format(new Date(), 'MMM dd, yyyy')}`, 105, 39, { align: 'center' });
      
      // Add summary section
      const totalIncome = filteredTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
      const totalExpense = filteredTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + parseFloat(t.amount), 0);
        
      const netBalance = totalIncome - totalExpense;
      
      doc.setFontSize(14);
      doc.text('Summary', 14, 50);
      doc.setFontSize(12);
      doc.text(`Total Income: $${totalIncome.toFixed(2)}`, 14, 60);
      doc.text(`Total Expenses: $${totalExpense.toFixed(2)}`, 14, 67);
      doc.text(`Net Balance: $${netBalance.toFixed(2)}`, 14, 74);
      
      // Add transactions table
      if (filteredTransactions.length > 0) {
        doc.setFontSize(14);
        doc.text('Transaction Details', 14, 85);
        
        const tableColumn = ["Date", "Description", "Category", "Type", "Amount"];
        const tableRows = filteredTransactions.map(t => [
          format(new Date(t.date), 'MMM dd, yyyy'),
          t.description,
          t.category,
          t.type.charAt(0).toUpperCase() + t.type.slice(1),
          `$${parseFloat(t.amount).toFixed(2)}`
        ]);
        
        doc.autoTable({
          startY: 90,
          head: [tableColumn],
          body: tableRows,
          theme: 'striped',
          headStyles: { fillColor: [24, 144, 255] }
        });
      } else {
        doc.text('No transactions found for the selected criteria.', 14, 90);
      }
      
      // Add category breakdown
      if (filteredTransactions.length > 0) {
        const lastY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 10 : 100;
        doc.setFontSize(14);
        doc.text('Category Breakdown', 14, lastY);
        
        // Group by category
        const categoryMap = filteredTransactions.reduce((acc, t) => {
          if (!acc[t.category]) {
            acc[t.category] = 0;
          }
          acc[t.category] += parseFloat(t.amount);
          return acc;
        }, {});
        
        const categoryData = Object.keys(categoryMap).map(category => [
          category,
          `$${categoryMap[category].toFixed(2)}`
        ]);
        
        doc.autoTable({
          startY: lastY + 5,
          head: [["Category", "Amount"]],
          body: categoryData,
          theme: 'striped',
          headStyles: { fillColor: [24, 144, 255] }
        });
      }
      
      // Save the PDF - this is the key part to fix the download
      doc.save(`financial-report-${format(new Date(), 'yyyy-MM-dd')}.pdf`);
      return true;
    } catch (error) {
      console.error('Error generating PDF:', error);
      return false;
    }
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

  // Generate report based on selected format
  const generateReport = () => {
    setLoading(true);
    
    try {
      const filteredTransactions = getFilteredTransactions();
      
      if (filteredTransactions.length === 0) {
        message.warning('No transactions found for the selected criteria.');
        setLoading(false);
        return;
      }
      
      let success = false;
      
      if (fileFormat === 'pdf') {
        success = generatePDF(filteredTransactions);
      } else {
        success = generateCSV(filteredTransactions);
      }
      
      if (success) {
        message.success(`Report successfully generated in ${fileFormat.toUpperCase()} format.`);
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

  return (
    <Card 
      className="shadow-sm animate-fade-in" 
      style={{ 
        backgroundImage: 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)',
        borderRadius: '12px',
        overflow: 'hidden',
        border: 'none',
        transition: 'all 0.3s ease'
      }}
      hoverable
    >
      <Title level={4} className="animate-slide-up mb-2">Generate Financial Report</Title>
      <Text type="secondary" className="block mb-6 animate-slide-up" style={{ animationDelay: '0.1s' }}>
        Create customized reports of your financial data for selected date ranges and export them in your preferred format.
      </Text>
      
      <div className="space-y-4">
        <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <Text strong className="block mb-2">Date Range</Text>
          <RangePicker 
            style={{ width: '100%' }}
            onChange={setDateRange}
            className="hover-scale"
          />
        </div>
        
        <div className="animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <Text strong className="block mb-2">Report Type</Text>
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
        
        <div className="animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Text strong className="block mb-2">File Format</Text>
          <Radio.Group 
            value={fileFormat} 
            onChange={e => setFileFormat(e.target.value)}
            className="w-full"
          >
            <Radio.Button 
              value="pdf" 
              style={{ 
                width: '50%', 
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backgroundColor: fileFormat === 'pdf' ? '#1890ff20' : ''
              }}
              className="hover-scale"
            >
              <FilePdfOutlined /> PDF
            </Radio.Button>
            <Radio.Button 
              value="csv" 
              style={{ 
                width: '50%', 
                textAlign: 'center',
                transition: 'all 0.3s ease',
                backgroundColor: fileFormat === 'csv' ? '#1890ff20' : ''
              }}
              className="hover-scale"
            >
              <FileExcelOutlined /> CSV
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
            background: 'linear-gradient(90deg, #1890ff, #69c0ff)',
            border: 'none',
            boxShadow: '0 8px 16px -4px rgba(24, 144, 255, 0.3)'
          }}
        >
          Generate Report
        </Button>
      </div>
    </Card>
  );
};

export default ReportGenerator;
