import "./pdfHeader.css";
export default function PdfHeader({ preview = false }) {
  return (
    <div className="header">
      <div
        className="header-logo"
        style={{
          position: `${preview ? "relative" : "absolute"}`,
        }}
      >
        <img src="/images/header-logo.png" />
      </div>
    </div>
  );
}
