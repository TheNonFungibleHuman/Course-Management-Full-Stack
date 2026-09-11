// Renders the loading, error and empty states of a page. Returns null when
// there is nothing to report, so a page can render it unconditionally:
// <StateBlock loading={loading} error={error} isEmpty={rows.length === 0} />
export default function StateBlock({
  loading,
  error,
  isEmpty,
  emptyTitle = "Nothing here yet",
  emptyMessage,
  onRetry,
}) {
  if (loading) {
    return (
      <div className="state-block">
        <div className="spinner" />
        <div className="state-title">Loading…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="state-block">
        <div className="alert alert-error" role="alert">
          {error}
        </div>
        {onRetry && (
          <button type="button" className="btn btn-ghost btn-sm" onClick={onRetry}>
            Try again
          </button>
        )}
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="state-block">
        <div className="state-title">{emptyTitle}</div>
        {emptyMessage && <div>{emptyMessage}</div>}
      </div>
    );
  }

  return null;
}
