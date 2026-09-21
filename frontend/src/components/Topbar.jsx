// Top bar. Deliberately holds only search and the account avatar: the page
// title lives in the content area, so repeating it here as a breadcrumb would
// say the same thing twice and cost 40px on every page.
export default function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-search">
        <input type="search" placeholder="Search students or courses" aria-label="Search" />
        <span className="topbar-key">/</span>
      </div>
      <div className="avatar">HO</div>
    </header>
  );
}
