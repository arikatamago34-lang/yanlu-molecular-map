export type EvidenceTopic = {
  topic: string;
  exam: number;
  courseware: number;
  review: number;
  level: "核心" | "高频" | "重点";
  cue: string;
};

// “命中”表示去重后的资料中出现该主题，不等同于某知识点真实出题次数。
export const evidenceTopics: EvidenceTopic[] = [
  { topic: "氨基酸与等电点", exam: 26, courseware: 11, review: 34, level: "核心", cue: "净电荷、离子交换、缩写与分类" },
  { topic: "蛋白质结构与功能", exam: 22, courseware: 5, review: 30, level: "核心", cue: "结构层次、变性复性、结构决定功能" },
  { topic: "DNA复制", exam: 24, courseware: 4, review: 24, level: "核心", cue: "复制叉蛋白、方向性、半不连续与修复" },
  { topic: "维生素与辅酶", exam: 21, courseware: 9, review: 30, level: "核心", cue: "辅酶形式、转移基团、代谢反应配对" },
  { topic: "氨基酸分解与尿素循环", exam: 21, courseware: 5, review: 29, level: "核心", cue: "转氨、联合脱氨、氮来源与能耗" },
  { topic: "糖酵解", exam: 21, courseware: 6, review: 25, level: "核心", cue: "不可逆步骤、底物磷酸化、能量与调控" },
  { topic: "核酸结构与理化性质", exam: 19, courseware: 5, review: 28, level: "高频", cue: "Tm、增色效应、双螺旋与杂交" },
  { topic: "RNA转录与加工", exam: 20, courseware: 3, review: 27, level: "高频", cue: "RNA聚合酶、启动子、加帽剪接加尾" },
  { topic: "蛋白质翻译", exam: 18, courseware: 4, review: 27, level: "高频", cue: "tRNA、核糖体位点、步骤与能耗" },
  { topic: "脂肪酸β氧化", exam: 20, courseware: 2, review: 24, level: "高频", cue: "四步循环、肉碱穿梭与ATP计算" },
  { topic: "三羧酸循环", exam: 22, courseware: 4, review: 24, level: "核心", cue: "历程、脱氢脱羧、调控与枢纽意义" },
  { topic: "生物氧化与呼吸链", exam: 17, courseware: 5, review: 25, level: "高频", cue: "复合体、P/O、抑制/解偶联与能量" },
  { topic: "酶动力学与抑制", exam: 21, courseware: 3, review: 32, level: "高频", cue: "Km/Vmax、图像、抑制剂结合对象" },
  { topic: "脂肪酸合成", exam: 15, courseware: 2, review: 24, level: "重点", cue: "与β氧化对照、ACC与NADPH" },
  { topic: "磷酸戊糖途径", exam: 12, courseware: 4, review: 22, level: "重点", cue: "NADPH、核糖-5-P与碳流回接" },
  { topic: "核苷酸代谢", exam: 12, courseware: 3, review: 18, level: "重点", cue: "PRPP、从头/补救、嘌呤与嘧啶对比" },
];

export const sourceCollections = [
  "农大生化真题之精华总结",
  "二轮复习",
  "三轮复习",
  "（最新四套）生物化学期末试卷",
  "生物化学考研重难点.doc",
  "生物化学考研资料.doc",
  "生物化学课件",
  "生化化学名词解释汇总.docx",
  "生物化学简答题汇总.doc",
  "生物化学章节题库.doc",
];

export const extractionStats = {
  readable: 81,
  deduplicated: 79,
  exam: 26,
  courseware: 13,
  review: 40,
  imageOnlyPdf: 7,
};

export const integrationRules = [
  { title: "真题优先", text: "河南农真题、回忆题与本校期末卷决定复习优先级；同一内容的重复文件先去重。" },
  { title: "课件补全", text: "13 章河南农生化课件负责补齐知识边界、概念定义、反应顺序与实验方法。" },
  { title: "答案校对", text: "资料中的旧 P/O 比、排版/OCR错误或互相矛盾答案不直接照搬，统一按教材与现代口径表述。" },
  { title: "频次不冒充题次", text: "页面显示的是‘多少份资料覆盖该主题’，不是虚构的历年真实出题次数。" },
];
