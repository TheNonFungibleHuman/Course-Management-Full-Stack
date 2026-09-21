// Top bar. Holds only the account avatar.
//
// A search field used to sit here and did nothing, which is worse than not having
// one: it invited a click and then delivered nothing. Every list page has its own
// working search, so the dead one was removed rather than left as decoration.
export default function Topbar() {
  return (
    <header className="topbar">
      <div className="avatar" title="Signed in">HO</div>
    </header>
  );
}
