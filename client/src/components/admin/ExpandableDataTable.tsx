import React, { useState } from 'react';
import { Card, CardContent } from '../ui/Card';
import { Trash2, ChevronDown, ChevronRight, Users, Gamepad2, Calendar, User } from 'lucide-react';
import Badge from '../ui/Badge';

interface Column {
  key: string;
  label: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface ExpandableDataTableProps {
  columns: Column[];
  data: any[];
  title?: string;
  onEdit?: (row: any) => void;
  onDelete?: (row: any) => void;
  expandableContent?: (row: any) => React.ReactNode;
}

const ExpandableDataTable: React.FC<ExpandableDataTableProps> = ({ 
  columns, 
  data, 
  title,
  onEdit,
  onDelete,
  expandableContent
}) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (rowId: string) => {
    const newExpandedRows = new Set(expandedRows);
    if (newExpandedRows.has(rowId)) {
      newExpandedRows.delete(rowId);
    } else {
      newExpandedRows.add(rowId);
    }
    setExpandedRows(newExpandedRows);
  };

  const isExpanded = (rowId: string) => expandedRows.has(rowId);

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
                <th className="px-3 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider w-12">
                  
                </th>
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
                    
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
              {data.map((row) => {
                const rowId = row._id || row.id || `row-${Math.random()}`;
                const expanded = isExpanded(rowId);
                
                return (
                  <React.Fragment key={rowId}>
                    <tr className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-3 py-4">
                        {expandableContent && (
                          <button
                            onClick={() => toggleRow(rowId)}
                            className="text-slate-400 hover:text-slate-300 transition-colors p-1 rounded hover:bg-slate-700/50"
                            title={expanded ? "Réduire" : "Développer"}
                          >
                            {expanded ? (
                              <ChevronDown className="w-4 h-4" />
                            ) : (
                              <ChevronRight className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </td>
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
                                className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-red-500/10"
                                title="Supprimer"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      )}
                    </tr>
                    {expanded && expandableContent && (
                      <tr>
                        <td colSpan={columns.length + (onEdit || onDelete ? 2 : 1)} className="p-0">
                          <div className="bg-slate-800/20 border-t border-slate-700/30">
                            {expandableContent(row)}
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ExpandableDataTable;
