"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { openSourceIdentity, openSourceSlogans } from "./open-source";

function differentSlogan(current: number) {
  if (openSourceSlogans.length < 2) return 0;
  const offset = 1 + Math.floor(Math.random() * (openSourceSlogans.length - 1));
  return (current + offset) % openSourceSlogans.length;
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(text);
  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
}

export default function ShareButton() {
  const [open, setOpen] = useState(false);
  const [sloganIndex, setSloganIndex] = useState(0);
  const [status, setStatus] = useState("");

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const showShare = () => {
    setSloganIndex((current) => differentSlogan(current));
    setStatus("");
    setOpen(true);
  };

  const shareText = () => {
    const url = window.location.href;
    return `${openSourceSlogans[sloganIndex]}\n\nUN1开源分享｜研路分子图谱\n抖音：${openSourceIdentity.douyin}\nQQ：${openSourceIdentity.qqName}（${openSourceIdentity.qq}）\n${url}\n\n免费学习与继续分享，请保留“UN1”署名。`;
  };

  const copyShare = async () => {
    await copyToClipboard(shareText());
    setStatus("分享文案和网址已复制");
    setSloganIndex((current) => differentSlogan(current));
  };

  const nativeShare = async () => {
    const text = shareText();
    if (navigator.share) {
      try {
        await navigator.share({ title: "UN1开源分享｜研路分子图谱", text, url: window.location.href });
        setStatus("感谢你让开源知识继续流动");
        setSloganIndex((current) => differentSlogan(current));
        return;
      } catch (error) {
        if ((error as DOMException).name === "AbortError") return;
      }
    }
    await copyToClipboard(text);
    setStatus("当前浏览器已改为复制分享文案");
    setSloganIndex((current) => differentSlogan(current));
  };

  return <>
    <button className="share-trigger" onClick={showShare} aria-haspopup="dialog"><i>↗</i><span>开源分享</span></button>
    {open && typeof document !== "undefined" ? createPortal(<div className="share-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setOpen(false); }}>
      <section className="share-dialog" role="dialog" aria-modal="true" aria-labelledby="share-title">
        <button className="share-close" onClick={() => setOpen(false)} aria-label="关闭分享界面">×</button>
        <div className="share-signature"><span>UN1</span><p><strong>OPEN SOURCE SHARE</strong><small>免费开放 · 尊重署名 · 继续传递</small></p></div>
        <div className="share-quote"><small>本次分享标语 · {String(sloganIndex + 1).padStart(2, "0")}/15</small><blockquote>“{openSourceSlogans[sloganIndex]}”</blockquote><button onClick={() => { setSloganIndex((current) => differentSlogan(current)); setStatus(""); }}>换一句 ↻</button></div>
        <div className="share-project"><span>UN1开源分享</span><h2 id="share-title">研路分子图谱</h2><p>一张可环绕、可聚焦、可展开二维通路的生命科学3D复习网络。</p></div>
        <div className="share-identity"><div><small>抖音名</small><strong>{openSourceIdentity.douyin}</strong></div><div><small>QQ昵称 · QQ号</small><strong>{openSourceIdentity.qqName} · {openSourceIdentity.qq}</strong></div></div>
        <p className="share-license">允许免费学习、复制、改编与继续分享；请保留“UN1”署名和原项目链接。源代码采用 MIT，原创知识内容采用 CC BY 4.0。</p>
        <div className="share-actions"><button onClick={copyShare}>复制分享文案</button><button onClick={nativeShare}>立即分享 ↗</button></div>
        {status && <div className="share-status" role="status">✓ {status}</div>}
        <footer><a href="un1-molecular-map-source.zip" download>下载开源源码包 ↓</a><span>{openSourceIdentity.credit}</span></footer>
      </section>
    </div>, document.body) : null}
  </>;
}
