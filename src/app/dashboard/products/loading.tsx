import { Plus } from 'lucide-react';

export default function Loading() {
  return (
    <div className="p-2 sm:p-4 md:p-8 max-w-6xl mx-auto w-full animate-pulse">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
            <div className="h-8 w-48 bg-gray-200 rounded-md mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
        </div>
        <div className="inline-flex items-center justify-center gap-2 bg-gray-100 text-transparent px-5 py-2.5 rounded-lg w-32 h-10"></div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50/80 border-b border-gray-100">
              <tr>
                <th className="px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></th>
                <th className="hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-20 bg-gray-200 rounded"></div></th>
                <th className="px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></th>
                <th className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></th>
                <th className="hidden sm:table-cell px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></th>
                <th className="px-2 sm:px-4 lg:px-6 py-4 text-right flex justify-end"><div className="h-4 w-16 bg-gray-200 rounded"></div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {[...Array(5)].map((_, i) => (
                <tr key={i}>
                  <td className="px-2 sm:px-4 lg:px-6 py-4">
                    <div className="flex items-center gap-2 sm:gap-4">
                      <div className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg bg-gray-200 flex-shrink-0"></div>
                      <div>
                        <div className="h-4 w-32 sm:w-48 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 w-16 bg-gray-200 rounded"></div>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-24 bg-gray-200 rounded"></div></td>
                  <td className="px-2 sm:px-4 lg:px-6 py-4"><div className="h-4 w-16 bg-gray-200 rounded"></div></td>
                  <td className="hidden lg:table-cell px-2 sm:px-4 lg:px-6 py-4"><div className="h-6 w-20 bg-gray-200 rounded-md"></div></td>
                  <td className="hidden sm:table-cell px-2 sm:px-4 lg:px-6 py-4"><div className="h-6 w-16 bg-gray-200 rounded-full"></div></td>
                  <td className="px-1 sm:px-4 lg:px-6 py-4 text-right">
                    <div className="flex justify-end gap-1 sm:gap-2">
                      <div className="w-8 h-8 sm:w-16 sm:h-8 bg-gray-200 rounded-md"></div>
                      <div className="w-8 h-8 sm:w-16 sm:h-8 bg-gray-200 rounded-md"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
