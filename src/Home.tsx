import Universe from "./Universe";
import FocusLink from "./FocusLink";
import ShareButton from "./ShareButton";
import { evidenceTopics, extractionStats, sourceCollections } from "./biochem-data";
import { cellExtraction, cellSources, cellTopics, evidenceBoundaries } from "./cell-data";
import { openSourceIdentity, openSourceSlogans } from "./open-source";
import { molecules, processes } from "./universe-data";

export default function Home() {
  return <main className="site-shell" id="top">
    <header className="topbar">
      <a className="brand" href="#top" aria-label="研路分子图谱首页"><span className="brand-orbit"><i /><i /><b /></span><span><strong>研路分子图谱</strong><small>河南农大 2027 · 非校方复习工具</small></span></a>
      <nav><a className="active" href="#universe">3D 分子宇宙</a><a href="#evidence">重点证据</a><a href="#open-source">UN1开源</a><a href="#sources">资料账本</a></nav>
      <div className="creator-credit"><span>UN1 × CODEX</span><small>UN1 发起并开源 · Codex 辅助构建</small></div>
      <ShareButton />
    </header>
    <section className="universe-intro">
      <div><span>HENAU 338 BIOCHEMISTRY · CELL BIOLOGY 2027</span><h1>不是五张关系图，<br /><em>是一整个生命分子宇宙。</em></h1></div>
      <p><b className="open-source-ribbon">UN1 OPEN SOURCE · 免费开放分享</b>固定坐标 · 连续镜头 · 分子为球 · 循环为面<br />拖动像查看 PDB 结构一样环绕；点击分子聚焦，再把任一过程平面展开成经典二维图。</p>
    </section>
    <div className="universe-stats" aria-label="本轮知识网络统计"><div><strong>{molecules.length}</strong><span>固定坐标分子</span></div><div><strong>{processes.length}</strong><span>可展开过程平面</span></div><div><strong>{extractionStats.deduplicated}</strong><span>去重生化资料</span></div><div><strong>{cellExtraction.readableUnique}</strong><span>可检索细胞资料</span></div></div>
    <Universe />
    <section className="evidence-section" id="evidence">
      <header className="section-head"><span>EVIDENCE, NOT GUESSWORK</span><h2>重点有出处，<em>出处不混级。</em></h2><p>生化沿用河南农338资料证据链；细胞生物学是2027首次改考，所以把“河南农本科教学倾向”和“华中农考研参考”分开显示。覆盖数表示多少份可检索资料提到该主题，不等于真实出题次数。</p></header>
      <div className="boundary-grid">{evidenceBoundaries.map((item, index) => <article key={item.title}><span>0{index + 1}</span><h3>{item.title}</h3><p>{item.text}</p></article>)}</div>
      <div className="radar-columns">
        <div className="radar-block biochem-radar"><header><div><span>338 BIOCHEMISTRY</span><h3>河南农生化证据雷达</h3></div><b>{extractionStats.exam} 份真题/题卷</b></header><div className="topic-list">{evidenceTopics.slice(0,12).map((item,index) => { const total=item.exam+item.courseware+item.review; return <article key={item.topic}><i>{String(index+1).padStart(2,"0")}</i><div><strong>{item.topic}</strong><small>{item.cue}</small><span><b style={{width:`${Math.min(100,total/75*100)}%`}} /></span></div><em>{item.level}</em><b>{total}</b></article>})}</div></div>
        <div className="radar-block cell-radar"><header><div><span>CELL BIOLOGY · FIRST YEAR</span><h3>细胞生物学参考雷达</h3></div><b>{cellExtraction.readableUnique} 份可检索资料</b></header><div className="topic-list">{cellTopics.slice(0,12).map((item,index) => <article key={item.topic}><i>{String(index+1).padStart(2,"0")}</i><div><strong>{item.topic}</strong><small>{item.cue}</small><span><b style={{width:`${item.documents/28*100}%`}} /></span></div><em>{item.henau ? `农本${item.henau}` : "参考"}</em><b>{item.documents}</b></article>)}</div></div>
      </div>
    </section>
    <section className="bridge-section">
      <header className="section-head"><span>CROSS-SUBJECT BRIDGES</span><h2>两门课真正连在一起的地方。</h2><p>这里不再按课程切割：同一个细胞色素c既是呼吸链电子载体，也是凋亡信号；同一个ATP既驱动代谢，也驱动膜泵、马达和蛋白质降解。</p></header>
      <div className="bridge-grid"><article><span>01</span><h3>NADH → 呼吸链 → ATP</h3><p>TCA与β氧化产生还原当量，线粒体内膜把电子能转成质子梯度，ATP合酶再耦联细胞运动、运输和合成。</p><FocusLink molecule="nadh">从 NADH 查看3D连接 ↑</FocusLink></article><article><span>02</span><h3>细胞色素c：呼吸 × 凋亡</h3><p>膜间隙内传电子；外膜通透化后进入胞质，结合Apaf-1与dATP组装凋亡小体。</p><FocusLink molecule="cytc">从 Cyt c 查看3D连接 ↑</FocusLink></article><article><span>03</span><h3>乙酰-CoA：糖 × 脂 × 膜</h3><p>既入TCA，也经柠檬酸穿梭供脂肪酸与膜脂合成；它把能量代谢和膜系统真正接在一起。</p><FocusLink molecule="acetyl-coa">从 AcCoA 查看3D连接 ↑</FocusLink></article><article><span>04</span><h3>ATP：能量 × 信号 × 骨架</h3><p>既是磷酸供体，也是cAMP前体、膜泵与分子马达燃料、蛋白酶体解折叠所需能量。</p><FocusLink molecule="atp">从 ATP 查看3D连接 ↑</FocusLink></article></div>
    </section>
    <section className="open-source-section" id="open-source">
      <div className="open-source-mark"><span>UN1</span><i>OPEN<br />SOURCE</i></div>
      <div className="open-source-copy"><span>UN1 OPEN SOURCE MANIFESTO</span><h2>一个人的复习图，<br /><em>所有人的知识路。</em></h2><p>这个项目由 UN1 发起并免费开源，联合 OpenAI Codex 辅助构建。你可以学习、复制、改编和继续分享；唯一希望，是尊重原创、保留 UN1 署名，让后来者知道这条路从哪里开始。</p><div className="open-source-actions"><a href="un1-molecular-map-source.zip" download>免费下载源码 ↓</a><a href="LICENSE.md" target="_blank">查看开放许可 ↗</a></div></div>
      <div className="quote-stack">{openSourceSlogans.slice(0,3).map((slogan,index)=><blockquote key={slogan}><span>0{index+1}</span><p>“{slogan}”</p></blockquote>)}<footer><b>抖音 · {openSourceIdentity.douyin}</b><b>QQ · {openSourceIdentity.qqName} / {openSourceIdentity.qq}</b></footer></div>
    </section>
    <section className="sources-section" id="sources">
      <header className="section-head"><span>UN1 OPEN SOURCE · SOURCE LEDGER</span><h2>本轮接入的资料名称。</h2><p>UN1开源分享只发布重新组织的知识网络与原创表述，不公开转载资料原文。图像型大PDF保留为人工核验来源，未可靠提取时不会为了“显得有数据”而硬算频次。</p></header>
      <div className="source-ledgers">
        <article className="source-ledger"><header><div><span>河南农 338</span><h3>生物化学 · 10组</h3></div><b>{extractionStats.readable} 可读 / {extractionStats.deduplicated} 去重</b></header><ol>{sourceCollections.map((name,index)=><li key={name}><i>{String(index+1).padStart(2,"0")}</i><span>{name}</span><b>已接入</b></li>)}</ol></article>
        <article className="source-ledger"><header><div><span>2027 新科目</span><h3>细胞生物学 · 7组</h3></div><b>{cellExtraction.officeFiles} Office / {cellExtraction.pdfFiles} PDF</b></header><ol>{cellSources.map((source,index)=><li key={source.name}><i>{String(index+1).padStart(2,"0")}</i><span><strong>{source.name}</strong><small>{source.note}</small></span><b className={source.tier.includes("河南农")?"henau":source.tier.includes("华中农")?"hzau":"textbook"}>{source.tier}</b></li>)}</ol></article>
      </div>
      <div className="book-row"><article><span>河南农指定 · 生物化学</span><h3>《生物化学》（第二版）</h3><p>刘卫群、郭红祥主编，中国农业出版社，2020。</p></article><article><span>河南农指定 · 细胞生物学</span><h3>《细胞生物学》（第五版）</h3><p>丁明孝、王喜忠、张传茂、陈建国主编，高等教育出版社，2020。</p></article><article><span>补充但不替代指定教材</span><h3>翟中和第四版 / 韩贻仁第三版</h3><p>用于图示、机制和相近院校题型校核，不改变河南农指定书目口径。</p></article></div>
    </section>
    <footer className="site-footer"><div><strong>UN1开源分享</strong><span>{openSourceIdentity.credit}</span></div><p>公开只读的个人备考辅助工具 · 非河南农业大学官方网站<br />代码 MIT · 原创内容 CC BY 4.0 · 使用与改编请保留 UN1 署名</p><div><b>抖音名：{openSourceIdentity.douyin}</b><b>QQ昵称：{openSourceIdentity.qqName} · QQ号：{openSourceIdentity.qq}</b></div></footer>
  </main>;
}
