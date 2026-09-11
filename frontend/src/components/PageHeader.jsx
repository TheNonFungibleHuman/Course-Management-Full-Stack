/**
 * Page title, supporting text and action buttons.
 *
 * Kept in one component so every page has the same heading structure and
 * spacing — this is what stops the interface drifting out of alignment
 * page by page.
 */
export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-head">
      <div>
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
