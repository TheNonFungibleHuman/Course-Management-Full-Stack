import StateBlock from "./StateBlock.jsx";

// The record table used by every list page, so columns, spacing and the
// loading, error and empty states cannot drift apart between pages.
//
// columns:  [{ key, header, render?, align?, width? }]
// rows:     array of records
// rowKey:   function returning a stable key for a record
// actions:  optional render function receiving a record, for the row buttons
export default function DataTable({
  columns,
  rows,
  rowKey,
  actions,
  loading,
  error,
  onRetry,
  emptyTitle,
  emptyMessage,
}) {
  const isEmpty = !loading && !error && rows.length === 0;

  if (loading || error || isEmpty) {
    return (
      <StateBlock
        loading={loading}
        error={error}
        isEmpty={isEmpty}
        emptyTitle={emptyTitle}
        emptyMessage={emptyMessage}
        onRetry={onRetry}
      />
    );
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={column.align === "right" ? "num" : undefined}
                style={column.width ? { width: column.width } : undefined}
              >
                {column.header}
              </th>
            ))}
            {actions && <th style={{ width: "1%" }}>&nbsp;</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={rowKey(row)}>
              {columns.map((column) => (
                <td key={column.key} className={column.align === "right" ? "num" : undefined}>
                  {column.render ? column.render(row) : row[column.key]}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="row-actions">{actions(row)}</div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
