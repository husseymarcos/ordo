import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { Id } from "../../convex/_generated/dataModel";
import { api } from "../../convex/_generated/api";

export function KanbanBoard() {
  const data = useQuery(api.kanban.list);
  const createColumn = useMutation(api.kanban.createColumn);
  const deleteColumn = useMutation(api.kanban.deleteColumn);
  const createTicket = useMutation(api.kanban.createTicket);
  const deleteTicket = useMutation(api.kanban.deleteTicket);

  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [addingToColumn, setAddingToColumn] = useState<string | null>(null);
  const [newTicketTitle, setNewTicketTitle] = useState("");
  const [newTicketDesc, setNewTicketDesc] = useState("");

  if (!data) return <div className="p-8">Loading...</div>;

  const { columns, tickets } = data;

  const handleCreateColumn = () => {
    if (newColumnTitle.trim()) {
      void createColumn({ title: newColumnTitle.trim() });
      setNewColumnTitle("");
    }
  };

  const handleAddTicket = (columnId: string) => {
    if (newTicketTitle.trim()) {
      void createTicket({
        columnId: columnId as Id<"columns">,
        title: newTicketTitle.trim(),
        description: newTicketDesc.trim(),
      });
      setNewTicketTitle("");
      setNewTicketDesc("");
      setAddingToColumn(null);
    }
  };

  const handleDeleteColumn = (columnId: string) => {
    if (confirm("Delete this column and all its tickets?")) {
      void deleteColumn({ id: columnId as Id<"columns"> });
    }
  };

  const handleDeleteTicket = (ticketId: string) => {
    void deleteTicket({ id: ticketId as Id<"tickets"> });
  };

  const getTicketsByColumn = (columnId: string) =>
    tickets
      .filter((t) => t.columnId === columnId)
      .sort((a, b) => a.order - b.order);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Kanban Board</h1>

      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns.map((column) => (
          <div
            key={column._id}
            className="bg-gray-100 rounded-lg p-4 min-w-70 max-w-70"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">{column.title}</h2>
              <button
                onClick={() => handleDeleteColumn(column._id)}
                className="text-gray-500 hover:text-red-500 text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 mb-3">
              {getTicketsByColumn(column._id).map((ticket) => (
                <div
                  key={ticket._id}
                  className="bg-white rounded p-3 shadow-sm"
                >
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium text-sm">{ticket.title}</h3>
                    <button
                      onClick={() => handleDeleteTicket(ticket._id)}
                      className="text-gray-400 hover:text-red-500 text-xs"
                    >
                      ✕
                    </button>
                  </div>
                  {ticket.description && (
                    <p className="text-gray-600 text-xs mt-1">
                      {ticket.description}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {addingToColumn === column._id ? (
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Title"
                  value={newTicketTitle}
                  onChange={(e) => setNewTicketTitle(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded"
                  autoFocus
                />
                <textarea
                  placeholder="Description"
                  value={newTicketDesc}
                  onChange={(e) => setNewTicketDesc(e.target.value)}
                  className="w-full px-2 py-1 text-sm border rounded"
                  rows={2}
                />
                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddTicket(column._id)}
                    className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add
                  </button>
                  <button
                    onClick={() => {
                      setAddingToColumn(null);
                      setNewTicketTitle("");
                      setNewTicketDesc("");
                    }}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setAddingToColumn(column._id)}
                className="w-full py-1 text-sm text-gray-500 hover:text-gray-700 border border-dashed border-gray-300 rounded hover:border-gray-400"
              >
                + Add ticket
              </button>
            )}
          </div>
        ))}

        <div className="min-w-70">
          <input
            type="text"
            placeholder="New column title"
            value={newColumnTitle}
            onChange={(e) => setNewColumnTitle(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreateColumn()}
            className="w-full px-3 py-2 border rounded mb-2"
          />
          <button
            onClick={handleCreateColumn}
            className="w-full py-2 text-sm bg-gray-200 rounded hover:bg-gray-300"
          >
            Add Column
          </button>
        </div>
      </div>
    </div>
  );
}
