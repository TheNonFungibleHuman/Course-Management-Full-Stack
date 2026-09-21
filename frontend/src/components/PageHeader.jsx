// Page title and primary actions. The subtitle is optional and should say what the page is for, not repeat a count that will go stale.
export default function PageHeader({ title, subtitle, children }) {
  return (
    <header className="page-head">
      <div>
        <h1 className="page-title">{title}</h1>
        {subtitle && <div className="page-sub">{subtitle}</div>}
      </div>
      {children && <div className="page-actions">{children}</div>}
    </header>
  );
}
