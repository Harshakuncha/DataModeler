import React, { useState } from 'react';
import { Database, Table, Plus, Trash2, Save } from 'lucide-react';

interface TableModel {
  id: string;
  name: string;
  fields: Field[];
}

interface Field {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

function App() {
  const [tables, setTables] = useState<TableModel[]>([]);
  const [selectedTable, setSelectedTable] = useState<string | null>(null);

  const addTable = () => {
    const newTable: TableModel = {
      id: crypto.randomUUID(),
      name: `Table ${tables.length + 1}`,
      fields: []
    };
    setTables([...tables, newTable]);
    setSelectedTable(newTable.id);
  };

  const addField = (tableId: string) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          fields: [...table.fields, {
            id: crypto.randomUUID(),
            name: `field_${table.fields.length + 1}`,
            type: 'string',
            required: false
          }]
        };
      }
      return table;
    }));
  };

  const deleteTable = (tableId: string) => {
    setTables(tables.filter(t => t.id !== tableId));
    if (selectedTable === tableId) {
      setSelectedTable(null);
    }
  };

  const updateField = (tableId: string, fieldId: string, updates: Partial<Field>) => {
    setTables(tables.map(table => {
      if (table.id === tableId) {
        return {
          ...table,
          fields: table.fields.map(field => 
            field.id === fieldId ? { ...field, ...updates } : field
          )
        };
      }
      return table;
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <Database className="h-6 w-6 text-indigo-600" />
            <h1 className="text-2xl font-bold text-gray-900">Data Modeler</h1>
          </div>
          <button
            onClick={() => console.log('Saving model...')}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Model
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Sidebar */}
          <div className="col-span-3 bg-white rounded-lg shadow">
            <div className="p-4 border-b">
              <button
                onClick={addTable}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Table
              </button>
            </div>
            <div className="p-4">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Tables</h2>
              <div className="space-y-2">
                {tables.map(table => (
                  <div
                    key={table.id}
                    className={`flex items-center justify-between p-3 rounded-md cursor-pointer ${
                      selectedTable === table.id ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50'
                    }`}
                    onClick={() => setSelectedTable(table.id)}
                  >
                    <div className="flex items-center">
                      <Table className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{table.name}</span>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteTable(table.id);
                      }}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="col-span-9 bg-white rounded-lg shadow">
            {selectedTable ? (
              <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <input
                    type="text"
                    value={tables.find(t => t.id === selectedTable)?.name || ''}
                    onChange={(e) => {
                      setTables(tables.map(t =>
                        t.id === selectedTable ? { ...t, name: e.target.value } : t
                      ));
                    }}
                    className="text-xl font-bold bg-transparent border-b-2 border-transparent focus:border-indigo-500 focus:outline-none"
                  />
                  <button
                    onClick={() => addField(selectedTable)}
                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Field
                  </button>
                </div>

                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Field Name</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Type</th>
                        <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">Required</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {tables.find(t => t.id === selectedTable)?.fields.map(field => (
                        <tr key={field.id}>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <input
                              type="text"
                              value={field.name}
                              onChange={(e) => updateField(selectedTable, field.id, { name: e.target.value })}
                              className="border-0 bg-transparent focus:ring-0 p-0 w-full"
                            />
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <select
                              value={field.type}
                              onChange={(e) => updateField(selectedTable, field.id, { type: e.target.value })}
                              className="border-0 bg-transparent focus:ring-0 p-0"
                            >
                              <option value="string">String</option>
                              <option value="number">Number</option>
                              <option value="boolean">Boolean</option>
                              <option value="date">Date</option>
                            </select>
                          </td>
                          <td className="whitespace-nowrap px-3 py-4 text-sm">
                            <input
                              type="checkbox"
                              checked={field.required}
                              onChange={(e) => updateField(selectedTable, field.id, { required: e.target.checked })}
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center p-6">
                <div className="text-center">
                  <Table className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Table Selected</h3>
                  <p className="text-gray-500">Select a table from the sidebar or create a new one to start modeling your data.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;