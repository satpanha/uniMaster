type TableActionsProps = {
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  deleteLoading?: boolean;
};

export function TableActions({ onView, onEdit, onDelete, deleteLoading = false }: TableActionsProps) {
  return (
    <div className="flex items-center gap-2">
      {onView && (
        <button type="button" onClick={onView} className="text-blue-600 hover:underline text-sm">
          View
        </button>
      )}
      {onEdit && (
        <button type="button" onClick={onEdit} className="text-blue-600 hover:underline text-sm">
          Edit
        </button>
      )}
      {onDelete && (
        <button
          type="button"
          onClick={onDelete}
          disabled={deleteLoading}
          className="text-red-600 hover:underline text-sm disabled:opacity-50"
        >
          {deleteLoading ? "Removing..." : "Delete"}
        </button>
      )}
    </div>
  );
}
