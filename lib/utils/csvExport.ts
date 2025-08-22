// CSV Export utilities
export interface CSVExportOptions {
  filename: string;
  headers: string[];
  data: any[];
  dateFields?: string[]; // Fields that should be formatted as dates
}

export const exportToCSV = ({ filename, headers, data, dateFields = [] }: CSVExportOptions) => {
  // Create CSV content
  const csvContent = [
    // Headers
    headers.join(','),
    // Data rows
    ...data.map(row => 
      headers.map(header => {
        let value = row[header] || '';
        
        // Format dates if specified
        if (dateFields.includes(header) && value) {
          try {
            value = new Date(value).toLocaleDateString();
          } catch (e) {
            // Keep original value if date parsing fails
          }
        }
        
        // Escape commas and quotes in CSV
        if (typeof value === 'string') {
          value = value.replace(/"/g, '""');
          if (value.includes(',') || value.includes('"') || value.includes('\n')) {
            value = `"${value}"`;
          }
        }
        
        return value;
      }).join(',')
    )
  ].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `${filename}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
};

// Format data for CSV export with proper field mapping
export const formatDataForCSV = (data: any[], fieldMap: Record<string, string>) => {
  return data.map(item => {
    const formatted: any = {};
    Object.entries(fieldMap).forEach(([csvHeader, dataField]) => {
      // Handle nested fields (e.g., 'user.name')
      const value = dataField.split('.').reduce((obj, key) => obj?.[key], item);
      formatted[csvHeader] = value;
    });
    return formatted;
  });
};
