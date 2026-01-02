import { memo } from 'react';

interface EmptyTableRowProps {
  colSpan: number;
  message: string;
}

export const EmptyTableRow = memo<EmptyTableRowProps>(({ colSpan, message }) => {
  return (
    <tr>
      <td colSpan={colSpan} className="text-center py-8 text-muted-foreground">
        {message}
      </td>
    </tr>
  );
});

EmptyTableRow.displayName = 'EmptyTableRow';
