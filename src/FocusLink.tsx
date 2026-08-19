"use client";

export default function FocusLink({ molecule, children }: { molecule: string; children: React.ReactNode }) {
  return <button className="focus-link" onClick={() => {
    document.getElementById("universe")?.scrollIntoView({ behavior: "smooth", block: "center" });
    window.setTimeout(() => window.dispatchEvent(new CustomEvent("focus-molecule", { detail: molecule })), 260);
  }}>{children}</button>;
}
