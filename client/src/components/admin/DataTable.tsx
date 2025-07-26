import React from 'react';
import { Card, CardContent } from '../ui/Card';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  title,
  onEdit,
  onDelete 
}) => {
  return (
    <Card>
      <CardContent className="p-0">
        {title && (
          <div className="px-6 py-4 border-b border-slate-700/50">
            <h2 className="text-lg font-cinzel font-semibold text-white">{title}</h2>
          </div>
        )}
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-800/50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider"
                  >
                    {column.label}
                  </th>
                ))}
                {(onEdit || onDelete) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
              {data.map((row, index) => (
                <tr key={index} className="hover:bg-slate-800/30 transition-colors">
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                  {(onEdit || onDelete) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {onEdit && (
                          <button
                            onClick={() => onEdit(row)}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Modifier
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={() => onDelete(row)}
                            className="text-red-400 hover:text-red-300 transition-colors"
                          >
                            Supprimer
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable; 