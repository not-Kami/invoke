
import { Card, CardContent } from '../ui/Card';
import { Trash2, Archive } from 'lucide-react';

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
  onArchive?: (row: any) => void;
  onRowClick?: (row: any) => void;
  showEditButton?: boolean;
  showArchiveButton?: boolean;
}

const DataTable: React.FC<DataTableProps> = ({ 
  columns, 
  data, 
  title,
  onEdit,
  onDelete,
  onArchive,
  onRowClick,
  showEditButton = true,
  showArchiveButton = false
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
                {((showEditButton && onEdit) || onDelete || (showArchiveButton && onArchive)) && (
                  <th className="px-6 py-3 text-right text-xs font-medium text-slate-300 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-slate-900/50 divide-y divide-slate-700/50">
              {data.map((row) => (
                <tr 
                  key={row._id || row.id || `row-${Math.random()}`} 
                  className={`hover:bg-slate-800/30 transition-colors ${onRowClick ? 'cursor-pointer' : ''}`}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {column.render 
                        ? column.render(row[column.key], row)
                        : row[column.key]
                      }
                    </td>
                  ))}
                  {((showEditButton && onEdit) || onDelete || (showArchiveButton && onArchive)) && (
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        {showEditButton && onEdit && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(row);
                            }}
                            className="text-purple-400 hover:text-purple-300 transition-colors"
                          >
                            Modifier
                          </button>
                        )}
                        {showArchiveButton && onArchive && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onArchive(row);
                            }}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-blue-500/10"
                            title="Archiver"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}
                        {onDelete && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(row);
                            }}
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
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataTable; 