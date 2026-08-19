export const cellExtraction = {
  officeFiles: 28,
  pdfFiles: 9,
  readableUnique: 32,
  slideAndTextbook: 19,
  hzauexam: 7,
  henauUndergrad: 6,
  scanOnly: 3,
};

export const cellSources = [
  { name: "细胞生物学（河南农文件夹）", tier: "河南农本科证据", note: "本校期末卷、答案、老师划重点、题库和练习；用来观察本校教学关注，不冒充首次考研真题。" },
  { name: "翟中和版 细胞生物学PPT", tier: "教材课件", note: "15章课件与测试整理，负责概念边界、结构和机制主线。" },
  { name: "一些习题和补充", tier: "华中农考研参考", note: "课后题、名词解释和简答补充；只作相近农业院校题型参考。" },
  { name: "纸质打印版", tier: "华中农考研参考", note: "真题、模拟题和复习笔记；包含华中农803历年材料。" },
  { name: "翟中和《细胞生物学》（第4版）笔记和课后习题（含考研真题）详解.pdf", tier: "补充教材", note: "扫描版教材配套资料；图像型页面不强行OCR后计频次。" },
  { name: "复习笔记+习题详解.pdf", tier: "华中农考研参考", note: "可检索复习主干和习题解析，用于补全答题骨架。" },
  { name: "书 分子细胞生物学+第3版_韩贻仁.pdf", tier: "补充教材", note: "图像型教材，作为概念核验储备，不作为河南农重点证据。" },
];

export const cellTopics = [
  { topic: "细胞核与染色质", documents: 27, courseware: 15, hzauexam: 6, henau: 6, node: "nucleosome", cue: "核小体、染色质层级、核纤层与核孔" },
  { topic: "内膜系统", documents: 28, courseware: 16, hzauexam: 6, henau: 6, node: "sec61", cue: "内质网、高尔基体、溶酶体与区室化" },
  { topic: "细胞骨架", documents: 28, courseware: 15, hzauexam: 7, henau: 6, node: "tubulin", cue: "微管/微丝/中间纤维、马达与动态性" },
  { topic: "线粒体与氧化磷酸化", documents: 23, courseware: 10, hzauexam: 7, henau: 6, node: "atp-synthase", cue: "半自主性、内膜、呼吸链与化学渗透" },
  { topic: "核糖体与蛋白质合成", documents: 24, courseware: 11, hzauexam: 7, henau: 6, node: "ribosome", cue: "核糖体循环、信号肽与共翻译转位" },
  { topic: "有丝/减数分裂", documents: 22, courseware: 10, hzauexam: 6, henau: 6, node: "tubulin", cue: "纺锤体、染色体行为与两种分裂比较" },
  { topic: "细胞周期与检查点", documents: 22, courseware: 11, hzauexam: 5, henau: 6, node: "cdk", cue: "Cyclin-CDK、MPF、Rb/E2F和p53" },
  { topic: "细胞信号转导", documents: 24, courseware: 13, hzauexam: 6, henau: 5, node: "gpcr", cue: "GPCR、第二信使、RTK-Ras-MAPK" },
  { topic: "叶绿体与光合磷酸化", documents: 19, courseware: 6, hzauexam: 7, henau: 6, node: "atp-synthase", cue: "光合电子传递、ATP合酶与半自主性" },
  { topic: "跨膜运输", documents: 18, courseware: 7, hzauexam: 5, henau: 6, node: "nak-pump", cue: "被动/主动运输与Na⁺/K⁺泵" },
  { topic: "植物细胞壁与胞间连丝", documents: 20, courseware: 8, hzauexam: 7, henau: 5, node: "cellulose", cue: "纤维素合成、壁层次和植物特异联系" },
  { topic: "细胞连接与ECM", documents: 19, courseware: 7, hzauexam: 6, henau: 6, node: "integrin", cue: "四类连接、整联蛋白与细胞外基质" },
  { topic: "蛋白分选与膜泡", documents: 17, courseware: 8, hzauexam: 5, henau: 4, node: "rab", cue: "COPI/COPII/网格蛋白、Rab和SNARE" },
  { topic: "细胞凋亡", documents: 15, courseware: 3, hzauexam: 6, henau: 6, node: "cytc", cue: "凋亡/坏死比较、Bcl-2家族与caspase" },
  { topic: "研究方法", documents: 19, courseware: 11, hzauexam: 4, henau: 4, node: "phospholipid", cue: "显微、离心、FRAP、FRET与免疫荧光" },
  { topic: "泛素-蛋白酶体", documents: 11, courseware: 4, hzauexam: 4, henau: 3, node: "ubiquitin", cue: "E1/E2/E3、26S蛋白酶体与周期调控" },
];

export const evidenceBoundaries = [
  { title: "河南农生化", text: "真题、回忆题、校内期末卷、课件和多轮复习共同决定338生化优先级。" },
  { title: "河南农本科细胞", text: "本校期末卷和教师重点反映教学倾向；因2027首次改考细胞生物学，不写成历年考研频次。" },
  { title: "华中农考研参考", text: "用于观察相近农业院校常考题型；只标“参考”，不冒充河南农命题证据。" },
  { title: "教材主线", text: "指定第五版与补充教材负责校准概念、结构和机制，扫描件不可靠OCR时不硬计数量。" },
];
