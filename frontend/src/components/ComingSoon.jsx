import PageHeader from "../components/PageHeader.jsx";
import StateBlock from "../components/StateBlock.jsx";

// Temporary placeholder for a page that has not been built yet, so every route resolves to a real component while the application is being assembled.
export default function ComingSoon({ title, subtitle, endpoint, willDo }) {
  return (
    <>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="card card-narrow">
        <div className="alert alert-info">
          This page is still being built. It will call{" "}
          <span className="mono">{endpoint}</span>.
        </div>
        <StateBlock
          isEmpty
          emptyTitle="Not implemented yet"
          emptyMessage={willDo}
        />
      </div>
    </>
  );
}
