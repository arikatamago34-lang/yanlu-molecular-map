export type Vec3 = [number, number, number];

export type Molecule = {
  id: string;
  label: string;
  symbol: string;
  position: Vec3;
  family: "carbon" | "nitrogen" | "energy" | "enzyme" | "cell";
  radius?: number;
  summary: string;
  location: string;
  priority: 1 | 2 | 3;
  evidence: "河南农生化" | "河南农本科" | "华中农参考" | "教材主线";
  flags?: string[];
};

export type ProcessPlane = {
  id: string;
  label: string;
  short: string;
  color: string;
  origin: Vec3;
  u: Vec3;
  v: Vec3;
  nodeIds: string[];
  layout: "cycle" | "line";
  summary: string;
  exam: string;
  subject?: "生物化学" | "细胞生物学" | "交叉";
  evidence?: Molecule["evidence"];
  steps?: ProcessStep[];
};

export type ProcessStep = {
  from: string;
  to: string;
  enzyme: string;
  reaction: string;
  flags?: string[];
};

const m = (
  id: string,
  label: string,
  symbol: string,
  position: Vec3,
  family: Molecule["family"],
  summary: string,
  location: string,
  priority: Molecule["priority"] = 2,
  evidence: Molecule["evidence"] = "教材主线",
  flags: string[] = [],
  radius = 1,
): Molecule => ({ id, label, symbol, position, family, summary, location, priority, evidence, flags, radius });

// 全站唯一的世界坐标。切换知识点只移动摄像机，不重排分子。
export const molecules: Molecule[] = [
  m("oaa", "草酰乙酸", "OAA", [0, 0, 0], "carbon", "四碳代谢枢纽：接住乙酰-CoA，也连接糖异生、氨基酸与植物碳固定。", "线粒体基质；植物细胞还涉及胞质与叶绿体", 3, "河南农生化", ["TCA再生物", "转氨受体", "糖异生入口"], 1.28),
  m("acetyl-coa", "乙酰辅酶A", "AcCoA", [-2.5, 1.15, 0.2], "carbon", "二碳单元的总枢纽，来源于丙酮酸、脂肪酸和部分氨基酸。", "线粒体基质；脂肪酸合成时以柠檬酸形式出线粒体", 3, "河南农生化", ["不可净生糖", "缩合底物"], 1.2),
  m("citrate", "柠檬酸", "CIT", [-2.35, -1.35, 0.2], "carbon", "乙酰-CoA与草酰乙酸缩合的六碳产物，也是胞质脂肪酸合成的碳源信号。", "线粒体基质/胞质", 3, "河南农生化", ["柠檬酸合酶", "脂肪酸合成桥"], 1.08),
  m("isocitrate", "异柠檬酸", "ICT", [-1.2, -2.65, 0.1], "carbon", "TCA氧化脱羧与乙醛酸旁路分流的选择点。", "线粒体基质；植物乙醛酸体", 3, "河南农生化", ["氧化脱羧", "分流点"]),
  m("akg", "α-酮戊二酸", "α-KG", [0.75, -2.75, 0.15], "nitrogen", "TCA与含氮代谢的主桥梁，通过谷氨酸汇集和转移氨基。", "线粒体基质/胞质", 3, "河南农生化", ["氧化脱羧", "转氨受体"], 1.12),
  m("succinyl-coa", "琥珀酰辅酶A", "SucCoA", [2.35, -1.55, 0.2], "carbon", "高能硫酯，下一步驱动TCA中唯一的底物水平磷酸化。", "线粒体基质", 3, "河南农生化", ["高能硫酯", "底物水平磷酸化前体"]),
  m("succinate", "琥珀酸", "SUC", [2.55, 0.15, 0.2], "carbon", "由琥珀酰-CoA生成，并在复合体Ⅱ处氧化为延胡索酸。", "线粒体基质/内膜复合体Ⅱ", 3, "河南农生化", ["FAD脱氢", "呼吸链复合体Ⅱ"]),
  m("fumarate", "延胡索酸", "FUM", [1.75, 1.55, 0.15], "carbon", "TCA、尿素循环与嘌呤核苷酸循环之间可共享的四碳中间物。", "线粒体基质/胞质", 2, "河南农生化", ["水合反应", "尿素循环桥"]),
  m("malate", "苹果酸", "MAL", [0.55, 2.05, 0.1], "carbon", "被氧化为草酰乙酸并生成NADH，也是苹果酸穿梭和C4光合的成员。", "线粒体基质/胞质/植物叶绿体", 3, "河南农生化", ["NAD⁺脱氢", "穿梭系统"]),
  m("aspartate", "天冬氨酸", "ASP", [0.8, 0.35, 2.65], "nitrogen", "由草酰乙酸转氨生成，给尿素循环和核苷酸合成提供氮。", "胞质/线粒体", 3, "河南农生化", ["转氨产物", "尿素第二个氮"]),
  m("glutamate", "谷氨酸", "GLU", [1.55, -0.55, 3.4], "nitrogen", "氨基的收集与转运中心，可与α-酮戊二酸互变。", "线粒体基质/胞质", 3, "河南农生化", ["联合脱氨", "转氨枢纽"]),
  m("carbamoyl-p", "氨甲酰磷酸", "CP", [3.25, 1.4, 2.8], "nitrogen", "尿素循环的活化氮供体，由CPSⅠ消耗2个ATP生成。", "线粒体基质", 3, "河南农生化", ["CPSⅠ", "限速步骤"]),
  m("citrulline", "瓜氨酸", "CITR", [3.9, 0.1, 1.85], "nitrogen", "在线粒体生成后进入胞质，接受天冬氨酸的第二个氮。", "线粒体→胞质", 2, "河南农生化"),
  m("argininosuccinate", "精氨酸代琥珀酸", "ARG-S", [3.2, -1.4, 1.7], "nitrogen", "裂解为精氨酸与延胡索酸，把尿素循环接回TCA。", "胞质", 2, "河南农生化", ["消耗ATP→AMP", "产生延胡索酸"]),
  m("pyruvate", "丙酮酸", "PYR", [-1.05, 2.8, -2.15], "carbon", "糖酵解末端的三碳枢纽，可进乙酰-CoA、草酰乙酸或乳酸。", "胞质；线粒体基质", 3, "河南农生化", ["PDH氧化脱羧", "丙酮酸羧化酶"]),
  m("pep", "磷酸烯醇式丙酮酸", "PEP", [0.85, 3.45, -2.8], "energy", "高能磷酸化合物；糖酵解生成ATP，也可在C4植物固定HCO₃⁻。", "胞质；C4植物叶肉细胞", 3, "河南农生化", ["底物水平磷酸化", "PEP羧化酶"]),
  m("malonyl-coa", "丙二酰辅酶A", "MalCoA", [-4.0, -0.6, -2.1], "carbon", "脂肪酸合成的二碳供体，也抑制CPTⅠ避免合成与分解同时进行。", "胞质", 3, "河南农生化", ["乙酰-CoA羧化酶", "CPTⅠ抑制"]),
  m("palmitate", "棕榈酸", "C16:0", [-5.1, -1.9, -2.45], "carbon", "脂肪酸合酶复合体的主要终产物，可再延长或去饱和。", "胞质/内质网", 2, "教材主线"),
  m("glyoxylate", "乙醛酸", "GOX", [-2.45, -3.2, -2.4], "carbon", "乙醛酸循环的特征二碳受体，与乙酰-CoA生成苹果酸。", "植物乙醛酸体", 3, "河南农生化", ["苹果酸合酶"]),
  m("nadh", "NADH", "NADH", [1.1, -0.8, -3.45], "energy", "把脱氢反应获得的高能电子送入呼吸链。", "线粒体基质/胞质穿梭", 3, "河南农生化", ["还原当量"]),
  m("atp", "ATP", "ATP", [3.4, 2.9, -2.2], "energy", "细胞主要能量通货，把分解代谢与合成、运输和运动耦联。", "全细胞", 3, "河南农生化", ["高能磷酸键"]),
  m("adp", "ADP", "ADP", [3.9, 1.8, -3.35], "energy", "ATP水解后的受磷酸体，可在线粒体内膜或底物水平磷酸化中再生成ATP。", "全细胞", 3, "河南农生化"),
  m("fad", "FAD", "FAD", [2.2, -1.6, -3.9], "energy", "黄素辅酶，接受两个氢后成为FADH₂。", "多种黄素酶辅基", 2, "河南农生化", ["维生素B₂衍生物"]),
  m("fadh2", "FADH₂", "FADH₂", [2.9, -1.0, -4.8], "energy", "从琥珀酸脱氢酶或脂酰-CoA脱氢酶获得电子，进入呼吸链。", "线粒体内膜相关", 3, "河南农生化", ["复合体Ⅱ入口"]),
  m("nadph", "NADPH", "NADPH", [-5.55, 0.9, -4.15], "energy", "还原力主要供脂质合成、抗氧化与还原性生物合成。", "胞质/叶绿体", 3, "河南农生化", ["PPP产物", "合成代谢还原力"]),
  m("glucose", "葡萄糖", "GLC", [-2.8, 4.5, -4.6], "carbon", "糖酵解、磷酸戊糖途径和糖原代谢的共同入口。", "胞质", 3, "河南农生化", ["己糖激酶/葡糖激酶"]),
  m("g6p", "葡萄糖-6-磷酸", "G6P", [-2.1, 3.65, -4.35], "carbon", "糖酵解、PPP、糖原合成和糖异生的四岔路口。", "胞质", 3, "河南农生化", ["分流枢纽"], 1.15),
  m("f6p", "果糖-6-磷酸", "F6P", [-1.65, 2.75, -4.55], "carbon", "糖酵解和糖异生可逆步骤的六碳中间物。", "胞质", 2, "河南农生化"),
  m("f16bp", "果糖-1,6-二磷酸", "F1,6BP", [-1.6, 1.65, -5.1], "carbon", "PFK-1不可逆反应产物，被醛缩酶裂解为两个三碳磷酸。", "胞质", 3, "河南农生化", ["PFK-1", "糖酵解限速"]),
  m("gap", "甘油醛-3-磷酸", "GAP", [-1.2, 0.55, -5.75], "carbon", "糖酵解收益阶段和PPP非氧化阶段的三碳交汇点。", "胞质", 3, "河南农生化", ["NAD⁺脱氢"]),
  m("bpg13", "1,3-二磷酸甘油酸", "1,3-BPG", [-.85, -.55, -6.25], "energy", "含高能酰基磷酸，下一步直接给ADP磷酸基。", "胞质", 3, "河南农生化", ["底物水平磷酸化前体"]),
  m("pg3", "3-磷酸甘油酸", "3-PG", [-.2, .25, -6.8], "carbon", "糖酵解中间物，也是卡尔文循环直接还原阶段的产物。", "胞质/叶绿体基质", 2, "教材主线"),
  m("lactate", "乳酸", "LAC", [-2.65, 2.55, -2.35], "carbon", "缺氧时接受NADH的氢再生NAD⁺，可经Cori循环回肝。", "胞质", 3, "河南农生化", ["乳酸脱氢酶", "可逆脱氢"]),
  m("r5p", "核糖-5-磷酸", "R5P", [-5.9, 2.55, -3.25], "carbon", "PPP产物，是PRPP和核苷酸戊糖骨架来源。", "胞质", 3, "河南农生化", ["核苷酸合成入口"]),
  m("ru5p", "核酮糖-5-磷酸", "Ru5P", [-5.05, 1.95, -3.45], "carbon", "PPP氧化阶段产物，可异构为R5P或差向异构为Xu5P。", "胞质", 2, "河南农生化"),
  m("glycogen", "糖原", "Glycogen", [-5.2, 4.65, -4.9], "carbon", "以α-1,4糖苷键为主、α-1,6分支的葡萄糖储存多聚体。", "胞质颗粒", 3, "河南农生化", ["糖原合酶", "糖原磷酸化酶"]),
  m("udp-glucose", "UDP-葡萄糖", "UDP-Glc", [-4.2, 3.85, -4.55], "carbon", "糖原和植物细胞壁多糖合成的活化葡萄糖供体。", "胞质", 2, "河南农生化"),
  m("acyl-coa", "脂酰辅酶A", "Acyl-CoA", [-4.45, -2.8, -3.75], "carbon", "脂肪酸活化产物，经肉碱穿梭进入线粒体β氧化。", "胞质侧/线粒体基质", 3, "河南农生化", ["消耗ATP→AMP"]),
  m("ketone", "酮体", "KB", [-2.9, -.1, -4.15], "carbon", "肝线粒体由乙酰-CoA生成的水溶性燃料，包括乙酰乙酸、β-羟丁酸和丙酮。", "肝线粒体生成；外周利用", 2, "河南农生化"),
  m("glycerol3p", "甘油-3-磷酸", "G3P", [-4.55, .6, -5.55], "carbon", "甘油三酯合成骨架，也参与甘油-3-磷酸穿梭。", "胞质/线粒体外膜侧", 2, "河南农生化"),
  m("glutamine", "谷氨酰胺", "GLN", [2.55, -1.1, 4.4], "nitrogen", "安全运输氨的主要形式，也是嘌呤、嘧啶和氨基糖的酰胺氮供体。", "胞质/线粒体", 3, "河南农生化", ["谷氨酰胺合成酶"]),
  m("ammonia", "铵离子", "NH₄⁺", [2.8, .4, 4.2], "nitrogen", "含氮分解产生的游离氮，毒性高，需固定为谷氨酰胺或进入尿素循环。", "线粒体基质/胞质", 3, "河南农生化", ["氨同化", "尿素氮源"]),
  m("alanine", "丙氨酸", "ALA", [-.1, 1.95, 3.55], "nitrogen", "与丙酮酸通过ALT互变，是肌肉向肝运输氮和碳的形式。", "胞质", 3, "河南农生化", ["葡萄糖-丙氨酸循环"]),
  m("ornithine", "鸟氨酸", "ORN", [4.3, 1.8, 2.05], "nitrogen", "尿素循环的载体分子，与氨甲酰磷酸生成瓜氨酸。", "胞质↔线粒体", 2, "河南农生化"),
  m("arginine", "精氨酸", "ARG", [4.15, -1.3, .65], "nitrogen", "精氨酸酶水解生成尿素和鸟氨酸，完成尿素循环。", "胞质", 3, "河南农生化", ["精氨酸酶"]),
  m("urea", "尿素", "Urea", [5.15, -.2, .3], "nitrogen", "哺乳动物排出两个氮的低毒水溶性终产物。", "肝生成，经肾排出", 2, "河南农生化"),
  m("prpp", "5-磷酸核糖焦磷酸", "PRPP", [-6.8, 1.65, -2.2], "energy", "活化核糖供体，是嘌呤、嘧啶和补救途径共同底物。", "胞质", 3, "河南农生化", ["PRPP合成酶"]),
  m("imp", "次黄嘌呤核苷酸", "IMP", [-7.25, .1, -.9], "nitrogen", "嘌呤从头合成的第一个完整核苷酸，分支生成AMP和GMP。", "胞质", 3, "河南农生化", ["嘌呤分支点"]),
  m("amp", "腺嘌呤核苷酸", "AMP", [-6.15, -.85, -.25], "nitrogen", "腺嘌呤核苷酸代谢成员，可参与能量状态感知。", "胞质/细胞核", 2, "河南农生化"),
  m("gmp", "鸟嘌呤核苷酸", "GMP", [-7.9, -1.1, -.2], "nitrogen", "鸟嘌呤核苷酸合成和核酸构件。", "胞质/细胞核", 2, "河南农生化"),
  m("ump", "尿嘧啶核苷酸", "UMP", [-6.1, -2.3, 1.05], "nitrogen", "嘧啶从头合成的首个主要核苷酸，进一步生成UTP与CTP。", "胞质", 3, "河南农生化"),
  m("oxygen", "氧气", "O₂", [5.05, -2.15, -4.9], "energy", "呼吸链末端电子受体，被复合体Ⅳ还原为水。", "线粒体内膜", 3, "河南农生化", ["末端电子受体"]),
  m("complex1", "呼吸链复合体Ⅰ", "CI", [2.1, -.2, -5.95], "enzyme", "NADH:泛醌氧化还原酶，接受NADH电子并泵出质子。", "线粒体内膜", 3, "河南农生化", ["泵H⁺", "NADH入口"]),
  m("complex2", "呼吸链复合体Ⅱ", "CII", [2.9, -1.8, -5.8], "enzyme", "琥珀酸脱氢酶，兼属TCA和呼吸链，不泵质子。", "线粒体内膜", 3, "河南农生化", ["FAD", "不泵H⁺"]),
  m("coq", "辅酶Q", "CoQ", [3.25, -.8, -6.55], "energy", "脂溶性移动电子载体，汇集复合体Ⅰ、Ⅱ等来源的电子。", "线粒体内膜脂双层", 3, "河南农生化"),
  m("complex3", "呼吸链复合体Ⅲ", "CIII", [4.05, -.9, -6.1], "enzyme", "细胞色素bc₁复合体，通过Q循环把电子交给细胞色素c并泵质子。", "线粒体内膜", 3, "河南农生化", ["Q循环", "泵H⁺"]),
  m("cytc", "细胞色素c", "Cyt c", [4.55, -.15, -5.5], "enzyme", "呼吸链可溶性电子载体；释放到胞质后又成为内源性凋亡信号。", "线粒体膜间隙/凋亡时胞质", 3, "河南农本科", ["呼吸-凋亡交叉"], 1.15),
  m("complex4", "呼吸链复合体Ⅳ", "CIV", [5.15, -1.2, -5.75], "enzyme", "细胞色素c氧化酶，把电子交给O₂生成水并泵质子。", "线粒体内膜", 3, "河南农生化", ["氰化物抑制", "泵H⁺"]),
  m("atp-synthase", "ATP合酶", "F₀F₁", [4.9, 1.05, -4.45], "enzyme", "让质子顺电化学梯度回流，旋转催化ADP与Pi合成ATP。", "线粒体内膜/叶绿体类囊体膜", 3, "河南农本科", ["化学渗透", "旋转催化"]),
  m("phospholipid", "磷脂", "PL", [6.05, 3.8, -1.8], "cell", "两亲性膜脂自组装成脂双层，是细胞膜基本结构材料。", "所有生物膜", 3, "河南农本科", ["流动镶嵌", "两亲性"]),
  m("cholesterol", "胆固醇", "CHOL", [5.2, 3.25, -1.1], "cell", "调节动物细胞膜流动性和通透性，也是类固醇合成前体。", "质膜/内膜", 2, "河南农本科", ["膜流动性缓冲"]),
  m("nak-pump", "Na⁺/K⁺泵", "Na/K", [7.0, 3.4, -1.15], "enzyme", "每水解1个ATP泵出3 Na⁺、泵入2 K⁺，维持膜电位和渗透平衡。", "质膜", 3, "河南农本科", ["原发主动运输", "P型ATPase"]),
  m("clathrin", "网格蛋白", "CLATH", [7.7, 2.1, -.3], "cell", "组装包被小窝和囊泡，参与受体介导的内吞。", "质膜胞质面/TGN", 3, "华中农参考", ["受体介导内吞"]),
  m("copii", "COPⅡ", "COPII", [7.05, 1.0, .65], "cell", "Sar1依赖的包被复合体，介导内质网到高尔基体的顺向运输。", "内质网出口位点", 3, "华中农参考"),
  m("copi", "COPⅠ", "COPI", [6.05, .6, 1.2], "cell", "ARF依赖的包被复合体，介导高尔基体内与回内质网运输。", "高尔基体膜", 3, "华中农参考"),
  m("rab", "Rab GTP酶", "Rab", [7.3, -.2, 1.5], "cell", "为膜泡提供地址与对接特异性，在GTP/GDP状态间切换。", "特定膜泡和靶膜", 3, "华中农参考", ["分子开关"]),
  m("snare", "SNARE蛋白", "SNARE", [8.2, .35, 1.2], "cell", "v-SNARE与t-SNARE缠绕，拉近膜并促进融合。", "运输囊泡/靶膜", 3, "华中农参考", ["膜融合"]),
  m("srp", "信号识别颗粒", "SRP", [6.2, -1.15, 2.45], "cell", "识别新生肽信号序列，使核糖体暂停并靶向粗面内质网。", "胞质/粗面内质网", 3, "华中农参考"),
  m("sec61", "Sec61转位子", "Sec61", [7.3, -1.2, 2.7], "cell", "内质网膜蛋白通道，介导分泌蛋白和膜蛋白共翻译转位。", "粗面内质网膜", 3, "华中农参考"),
  m("ribosome", "核糖体", "RIB", [5.45, -1.85, 3.2], "cell", "由rRNA和蛋白质组成，在mRNA模板上催化肽键形成。", "胞质/粗面内质网/细胞器", 3, "河南农本科", ["核糖体循环"]),
  m("mrna", "信使RNA", "mRNA", [4.55, -2.3, 3.95], "cell", "把DNA编码信息带到核糖体，作为翻译模板。", "细胞核→胞质", 3, "河南农本科"),
  m("dna", "DNA", "DNA", [5.2, -3.1, 5.25], "cell", "遗传信息的主要载体，以碱基互补原则复制和转录。", "细胞核/线粒体/叶绿体", 3, "河南农本科"),
  m("histone", "组蛋白", "HIST", [6.35, -3.2, 5.0], "cell", "碱性蛋白八聚体构成核小体核心，并通过修饰调节染色质。", "细胞核", 3, "河南农本科", ["核小体", "表观修饰"]),
  m("nucleosome", "核小体", "NUC", [6.0, -2.4, 5.9], "cell", "约147 bp DNA缠绕组蛋白八聚体形成的染色质基本结构单位。", "细胞核", 3, "河南农本科", ["染色质基本单位"]),
  m("lamin", "核纤层蛋白", "LAMIN", [7.0, -2.2, 5.25], "cell", "中间纤维蛋白网络，支撑核膜并组织染色质。", "内核膜下", 3, "华中农参考"),
  m("importin", "输入蛋白", "IMPIN", [7.75, -2.8, 4.55], "cell", "识别核定位信号并通过核孔把货物送入细胞核。", "胞质/核孔/细胞核", 3, "华中农参考"),
  m("ran-gtp", "Ran-GTP", "Ran·GTP", [8.3, -2.0, 5.2], "energy", "由核内Ran-GEF维持高浓度，为核质运输提供方向性。", "细胞核富集", 3, "华中农参考", ["核质运输方向性"]),
  m("actin", "肌动蛋白", "ACTIN", [8.2, 3.2, 2.8], "cell", "形成有极性的微丝，参与细胞形态、迁移、胞质分裂与肌肉收缩。", "细胞皮层/应力纤维", 3, "河南农本科"),
  m("tubulin", "微管蛋白", "TUB", [9.25, 2.15, 3.35], "cell", "α/β异二聚体组装成极性微管，具有动态不稳定性。", "胞质/纺锤体/纤毛", 3, "河南农本科", ["动态不稳定性"]),
  m("myosin", "肌球蛋白", "MYO", [8.95, 3.8, 1.75], "enzyme", "沿微丝运动的ATP酶，参与收缩、胞质分裂和货物运输。", "微丝系统", 3, "河南农本科"),
  m("kinesin", "驱动蛋白", "KINES", [10.05, 2.7, 2.65], "enzyme", "通常沿微管向正端运输货物，水解ATP提供动力。", "微管", 3, "河南农本科"),
  m("dynein", "动力蛋白", "DYNEIN", [9.75, 1.25, 2.25], "enzyme", "沿微管向负端运输，并驱动纤毛和鞭毛弯曲。", "微管/纤毛轴丝", 3, "河南农本科"),
  m("gpcr", "G蛋白偶联受体", "GPCR", [9.2, -.1, -1.6], "cell", "七次跨膜受体，配体结合后促异三聚体G蛋白交换GDP/GTP。", "质膜", 3, "河南农本科", ["七跨膜", "受体"]),
  m("galpha", "Gα-GTP", "Gα", [9.9, -.6, -.75], "energy", "活化的G蛋白α亚基，调节腺苷酸环化酶或PLC。", "质膜胞质面", 3, "河南农本科", ["分子开关"]),
  m("adenylyl-cyclase", "腺苷酸环化酶", "AC", [10.55, .05, -1.2], "enzyme", "把ATP环化生成第二信使cAMP。", "质膜", 3, "河南农本科"),
  m("camp", "环腺苷酸", "cAMP", [10.8, -.65, -.05], "energy", "经典第二信使，解除PKA调节亚基对催化亚基的抑制。", "胞质", 3, "河南农本科", ["第二信使"]),
  m("pka", "蛋白激酶A", "PKA", [10.15, -1.45, .45], "enzyme", "cAMP依赖性丝/苏氨酸激酶，通过磷酸化放大信号。", "胞质/细胞核", 3, "河南农本科"),
  m("plc", "磷脂酶C", "PLC", [9.25, -1.45, -2.25], "enzyme", "水解PIP₂生成IP₃和DAG。", "质膜胞质面", 3, "河南农本科"),
  m("ip3", "肌醇三磷酸", "IP₃", [8.75, -2.3, -1.55], "energy", "可溶性第二信使，打开内质网IP₃受体释放Ca²⁺。", "胞质", 3, "河南农本科", ["第二信使"]),
  m("dag", "二酰甘油", "DAG", [9.65, -2.25, -2.7], "cell", "留在膜内的第二信使，与Ca²⁺共同激活PKC。", "质膜", 3, "河南农本科", ["第二信使"]),
  m("calcium", "钙离子", "Ca²⁺", [8.2, -3.0, -.75], "energy", "低胞质背景上的脉冲式第二信使，调节收缩、分泌与基因表达。", "胞质/内质网腔/细胞外", 3, "河南农本科"),
  m("calmodulin", "钙调蛋白", "CaM", [9.1, -3.45, .15], "cell", "结合Ca²⁺后改变构象并激活多种靶酶。", "胞质", 3, "河南农本科"),
  m("rtk", "受体酪氨酸激酶", "RTK", [10.8, -2.25, 2.2], "enzyme", "配体诱导二聚与自磷酸化，招募衔接蛋白激活Ras。", "质膜", 3, "华中农参考"),
  m("ras", "Ras-GTP", "Ras", [11.35, -1.5, 3.0], "energy", "膜锚定小GTP酶，在GTP状态激活Raf。", "质膜胞质面", 3, "华中农参考", ["原癌基因", "分子开关"]),
  m("raf", "Raf", "RAF", [10.85, -.65, 3.65], "enzyme", "MAPKKK，接受Ras信号并磷酸化MEK。", "胞质/质膜", 3, "华中农参考"),
  m("mek", "MEK", "MEK", [10.15, -.1, 4.2], "enzyme", "双特异性MAPKK，磷酸化ERK。", "胞质", 3, "华中农参考"),
  m("erk", "ERK", "ERK", [9.25, -.4, 4.75], "enzyme", "MAPK末端激酶，进入细胞核调控转录与增殖。", "胞质→细胞核", 3, "华中农参考"),
  m("cyclin", "细胞周期蛋白", "CYCLIN", [8.15, .35, 5.3], "cell", "周期性合成和降解，结合并激活特定CDK。", "细胞核/胞质", 3, "河南农本科", ["周期性降解"]),
  m("cdk", "周期蛋白依赖性激酶", "CDK", [8.85, .8, 6.05], "enzyme", "细胞周期核心激酶，受周期蛋白、磷酸化和CKI共同调控。", "细胞核/胞质", 3, "河南农本科", ["检查点"]),
  m("rb", "Rb蛋白", "Rb", [7.65, -.45, 6.5], "cell", "低磷酸化时结合E2F阻止G1/S转录，磷酸化后释放E2F。", "细胞核", 3, "华中农参考", ["抑癌蛋白"]),
  m("e2f", "E2F", "E2F", [7.0, .35, 7.0], "cell", "启动DNA复制相关基因表达，推动细胞越过限制点。", "细胞核", 3, "华中农参考"),
  m("p53", "p53", "p53", [8.9, -1.1, 6.75], "cell", "DNA损伤时诱导细胞周期阻滞、修复或凋亡。", "细胞核", 3, "河南农本科", ["基因组守护者"]),
  m("bax", "Bax", "BAX", [7.2, -3.65, -4.4], "cell", "促凋亡Bcl-2家族成员，寡聚化促进线粒体外膜通透化。", "胞质→线粒体外膜", 3, "河南农本科"),
  m("bcl2", "Bcl-2", "BCL-2", [6.35, -3.05, -4.75], "cell", "抗凋亡蛋白，抑制Bax/Bak介导的线粒体外膜通透化。", "线粒体外膜", 3, "河南农本科"),
  m("apaf1", "Apaf-1", "APAF1", [6.2, -1.9, -5.4], "cell", "结合细胞色素c与dATP组装凋亡小体并招募procaspase-9。", "胞质", 3, "河南农本科"),
  m("caspase9", "Caspase-9", "CASP9", [6.8, -1.0, -6.15], "enzyme", "凋亡小体上的起始半胱氨酸蛋白酶。", "胞质", 3, "河南农本科"),
  m("caspase3", "Caspase-3", "CASP3", [7.7, -.8, -6.6], "enzyme", "执行者caspase，裂解多种结构和调控蛋白形成凋亡表型。", "胞质/细胞核", 3, "河南农本科"),
  m("ubiquitin", "泛素", "Ub", [9.9, -3.45, 5.05], "cell", "通过E1-E2-E3级联共价连接到底物，形成降解或信号标记。", "胞质/细胞核", 3, "华中农参考"),
  m("proteasome", "26S蛋白酶体", "26S", [10.8, -3.2, 5.8], "enzyme", "识别多聚泛素化蛋白，ATP依赖解折叠并降解。", "胞质/细胞核", 3, "华中农参考"),
  m("integrin", "整联蛋白", "INT", [11.0, 2.35, .3], "cell", "跨膜异二聚体，把细胞外基质与肌动蛋白骨架双向连接。", "质膜/黏着斑", 3, "河南农本科"),
  m("cadherin", "钙黏蛋白", "CAD", [11.65, 1.45, -.15], "cell", "Ca²⁺依赖的同型细胞黏附分子，通过连环蛋白接肌动蛋白。", "黏着连接", 3, "河南农本科"),
  m("connexin", "连接子蛋白", "CONN", [11.2, .55, -1.0], "cell", "六聚形成连接子，两个连接子对接成缝隙连接通道。", "质膜缝隙连接", 3, "河南农本科"),
  m("collagen", "胶原蛋白", "COL", [12.05, 2.9, 1.1], "cell", "动物细胞外基质的主要纤维蛋白，三股螺旋提供抗张强度。", "细胞外基质", 3, "河南农本科"),
  m("cellulose", "纤维素", "CELL", [12.0, .85, 1.8], "cell", "β-1,4连接的葡萄糖多聚体，构成植物细胞壁微纤丝。", "植物细胞壁", 3, "华中农参考", ["植物特异"]),
];

const s = (from: string, to: string, enzyme: string, reaction: string, flags: string[] = []): ProcessStep => ({ from, to, enzyme, reaction, flags });

export const processes: ProcessPlane[] = [
  { id: "tca", label: "三羧酸循环", short: "TCA", color: "#59e3a7", origin: [0, -.35, 0], u: [1, 0, 0], v: [0, 1, .08], nodeIds: ["oaa", "acetyl-coa", "citrate", "isocitrate", "akg", "succinyl-coa", "succinate", "fumarate", "malate", "nadh", "fadh2"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "乙酰-CoA的二碳进入后被氧化为CO₂，草酰乙酸再生；每轮生成3 NADH、1 FADH₂、1 GTP。", exam: "默写循环、三次脱氢、两次脱羧、一次底物水平磷酸化，并解释限速调控。", steps: [s("oaa","citrate","柠檬酸合酶","缩合/水解",["不可逆"]),s("acetyl-coa","citrate","柠檬酸合酶","二碳进入",["不可逆"]),s("citrate","isocitrate","顺乌头酸酶","异构化"),s("isocitrate","akg","异柠檬酸脱氢酶","氧化脱羧",["NADH","限速调控"]),s("akg","succinyl-coa","α-酮戊二酸脱氢酶复合体","氧化脱羧",["NADH","不可逆"]),s("succinyl-coa","succinate","琥珀酰-CoA合成酶","底物水平磷酸化",["GTP"]),s("succinate","fumarate","琥珀酸脱氢酶","FAD脱氢",["复合体Ⅱ"]),s("fumarate","malate","延胡索酸酶","水合"),s("malate","oaa","苹果酸脱氢酶","NAD⁺脱氢",["NADH"]) ] },
  { id: "glycolysis", label: "糖酵解", short: "EMP", color: "#64a7ff", origin: [-1.25, 2.0, -5.0], u: [.9, .15, .4], v: [-.2, .9, .36], nodeIds: ["glucose","g6p","f6p","f16bp","gap","bpg13","pg3","pep","pyruvate","nadh","atp","adp"], layout: "line", subject: "生物化学", evidence: "河南农生化", summary: "胞质中把1个葡萄糖转为2个丙酮酸，净得2 ATP和2 NADH。", exam: "三步不可逆、能量投资/收益、两次底物水平磷酸化及缺氧时NAD⁺再生。", steps: [s("glucose","g6p","己糖激酶","磷酸化",["耗ATP","不可逆"]),s("g6p","f6p","磷酸葡糖异构酶","异构化"),s("f6p","f16bp","PFK-1","磷酸化",["限速","耗ATP","不可逆"]),s("f16bp","gap","醛缩酶/丙糖磷酸异构酶","裂解"),s("gap","bpg13","GAP脱氢酶","氧化+磷酸化",["NADH"]),s("bpg13","pg3","磷酸甘油酸激酶","底物水平磷酸化",["ATP"]),s("pg3","pep","变位酶+烯醇化酶","重排/脱水"),s("pep","pyruvate","丙酮酸激酶","底物水平磷酸化",["ATP","不可逆"]) ] },
  { id: "gluconeogenesis", label: "糖异生", short: "GNG", color: "#72d6ff", origin: [-.6, 2.65, -3.4], u: [.75, .1, .65], v: [-.1, .98, 0], nodeIds: ["pyruvate","oaa","pep","pg3","gap","f16bp","f6p","g6p","glucose","atp"], layout: "line", subject: "生物化学", evidence: "河南农生化", summary: "用非糖前体合成葡萄糖，绕过糖酵解三个不可逆步骤。", exam: "写四个旁路酶，比较肝/肾区室与能量代价，解释乙酰-CoA为何不能净生糖。", steps: [s("pyruvate","oaa","丙酮酸羧化酶","羧化",["耗ATP","生物素"]),s("oaa","pep","PEP羧激酶","脱羧磷酸化",["耗GTP"]),s("f16bp","f6p","果糖-1,6-二磷酸酶","水解",["关键调控"]),s("g6p","glucose","葡萄糖-6-磷酸酶","水解",["内质网"]) ] },
  { id: "ppp", label: "磷酸戊糖途径", short: "PPP", color: "#d290ff", origin: [-4.65, 2.2, -3.6], u: [.8, 0, .6], v: [.1, .98, -.1], nodeIds: ["g6p","ru5p","r5p","nadph","f6p","gap"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "氧化阶段生成NADPH与CO₂，非氧化阶段把戊糖和糖酵解中间物互换。", exam: "G6PD限速、NADPH用途、核糖需求与非氧化阶段碳骨架重排。", steps: [s("g6p","ru5p","G6PD等","氧化脱羧",["2 NADPH","限速"]),s("ru5p","r5p","磷酸戊糖异构酶","异构化"),s("r5p","f6p","转酮酶/转醛酶","碳单位转移",["TPP"]),s("r5p","gap","转酮酶/转醛酶","碳单位转移") ] },
  { id: "glycogen", label: "糖原合成与分解", short: "糖原", color: "#5fb7ff", origin: [-4.45, 4.15, -4.5], u: [1,0,0], v: [0,.72,.69], nodeIds: ["glucose","g6p","udp-glucose","glycogen"], layout: "line", subject: "生物化学", evidence: "河南农生化", summary: "糖原合酶与糖原磷酸化酶分别控制储存和动员，并受激素与磷酸化反向调控。", exam: "比较合成/分解的活化形式、关键酶、分支处理和肝肌差异。", steps: [s("g6p","udp-glucose","磷酸葡糖变位酶+焦磷酸化酶","活化葡萄糖",["UTP"]),s("udp-glucose","glycogen","糖原合酶+分支酶","延长/分支"),s("glycogen","g6p","糖原磷酸化酶+脱支酶","磷酸解",["PLP"]) ] },
  { id: "lactate-fermentation", label: "乳酸发酵与Cori循环", short: "乳酸", color: "#79a7ff", origin: [-2.1, 2.55, -2.8], u: [.7,.1,.7], v: [-.1,.98,0], nodeIds: ["pyruvate","lactate","nadh","glucose"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "乳酸脱氢酶再生NAD⁺维持无氧糖酵解，乳酸可送肝糖异生。", exam: "解释无氧供能意义、NAD⁺再生及Cori循环的器官分工和能量代价。", steps: [s("pyruvate","lactate","乳酸脱氢酶","可逆脱氢",["NADH→NAD⁺"]),s("lactate","glucose","肝糖异生酶系","Cori循环",["耗能"]) ] },
  { id: "transamination", label: "转氨作用", short: "转氨", color: "#a787ff", origin: [.65,.1,1.55], u: [1,.15,0], v: [0,.55,.84], nodeIds: ["oaa","aspartate","glutamate","akg","pyruvate","alanine"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "氨基在氨基酸和α-酮酸之间转移，不直接释放游离氨。", exam: "写AST/ALT反应，说明PLP作用，并串联联合脱氨与尿素形成。", steps: [s("oaa","aspartate","AST","转氨",["PLP"]),s("glutamate","akg","AST/ALT供氨基","转氨"),s("pyruvate","alanine","ALT","转氨",["葡萄糖-丙氨酸循环"]) ] },
  { id: "nitrogen-collection", label: "氨的收集与联合脱氨", short: "联合脱氨", color: "#bd78ff", origin: [2.0,-.2,3.65], u: [.75,-.1,.65], v: [.15,.98,-.03], nodeIds: ["akg","glutamate","glutamine","ammonia","nadh"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "转氨把氨基集中到谷氨酸，再由谷氨酸脱氢酶释放NH₄⁺；谷氨酰胺负责安全运输。", exam: "区分转氨、氧化脱氨、联合脱氨与谷氨酰胺代谢。", steps: [s("akg","glutamate","氨基转移酶","接受氨基",["PLP"]),s("glutamate","ammonia","谷氨酸脱氢酶","氧化脱氨",["NAD(P)⁺"]),s("glutamate","glutamine","谷氨酰胺合成酶","ATP依赖酰胺化",["固氨"]),s("glutamine","ammonia","谷氨酰胺酶","水解释氨") ] },
  { id: "urea", label: "尿素循环", short: "尿素", color: "#67c6ff", origin: [3.2,0,2.0], u: [.7,-.2,.68], v: [.1,.98,.18], nodeIds: ["ammonia","carbamoyl-p","ornithine","citrulline","aspartate","argininosuccinate","arginine","urea","fumarate"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "在线粒体和胞质间跨区室运行，用3个ATP的4个高能磷酸键排出两个氮。", exam: "说明两个氮与碳的来源、跨区室步骤、限速酶CPSⅠ及与TCA的连接。", steps: [s("ammonia","carbamoyl-p","CPSⅠ","活化氨",["限速","耗2 ATP","NAG激活"]),s("ornithine","citrulline","鸟氨酸氨甲酰转移酶","转氨甲酰基"),s("citrulline","argininosuccinate","精氨酸代琥珀酸合成酶","接入天冬氨酸氮",["ATP→AMP"]),s("aspartate","argininosuccinate","精氨酸代琥珀酸合成酶","提供第二个氮"),s("argininosuccinate","arginine","精氨酸代琥珀酸裂解酶","裂解",["伴生延胡索酸"]),s("arginine","urea","精氨酸酶","水解",["再生鸟氨酸"]) ] },
  { id: "purine", label: "嘌呤核苷酸代谢", short: "嘌呤", color: "#bd86e8", origin: [-6.7,-.2,-.8], u: [.75,.05,.66], v: [.05,.99,-.08], nodeIds: ["r5p","prpp","glutamine","imp","amp","gmp","atp"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "嘌呤环在PRPP核糖上逐步装配成IMP，再分支为AMP和GMP。", exam: "原子来源、PRPP、谷氨酰胺酰胺氮、IMP分支互供能量和反馈调控。", steps: [s("r5p","prpp","PRPP合成酶","核糖活化",["耗ATP"]),s("prpp","imp","酰胺磷酸核糖转移酶等","从头合成",["谷氨酰胺","限速"]),s("imp","amp","腺苷酸代琥珀酸途径","分支",["耗GTP"]),s("imp","gmp","IMP脱氢酶/GMP合成酶","分支",["耗ATP"]) ] },
  { id: "pyrimidine", label: "嘧啶核苷酸代谢", short: "嘧啶", color: "#ce6dc7", origin: [-5.6,-1.9,.8], u: [.84,-.05,.54], v: [.05,.99,0], nodeIds: ["glutamine","carbamoyl-p","aspartate","ump","prpp"], layout: "line", subject: "生物化学", evidence: "河南农生化", summary: "嘧啶环先合成，再接到PRPP核糖上形成OMP并脱羧为UMP。", exam: "与嘌呤比较：环先成/边装配、氨甲酰磷酸来源、细胞区室与反馈调控。", steps: [s("glutamine","carbamoyl-p","CPSⅡ","胞质合成",["嘧啶限速"]),s("carbamoyl-p","aspartate","天冬氨酸氨甲酰转移酶","缩合"),s("aspartate","ump","多步成环+接PRPP+脱羧","从头合成") ] },
  { id: "fatty-synthesis", label: "脂肪酸合成", short: "FA合成", color: "#ff8e7a", origin: [-3.55,-.85,-1.3], u: [.75,0,-.66], v: [.15,.98,.05], nodeIds: ["citrate","acetyl-coa","malonyl-coa","nadph","palmitate"], layout: "line", subject: "生物化学", evidence: "河南农生化", summary: "线粒体乙酰-CoA借柠檬酸穿梭进入胞质，经ACC与FAS合成棕榈酸。", exam: "比较脂肪酸合成与β氧化的区室、载体、辅酶、方向和调控。", steps: [s("citrate","acetyl-coa","ATP-柠檬酸裂解酶","胞质再生乙酰-CoA",["耗ATP"]),s("acetyl-coa","malonyl-coa","乙酰-CoA羧化酶","羧化",["限速","生物素","耗ATP"]),s("malonyl-coa","palmitate","脂肪酸合酶复合体","缩合-还原-脱水-还原",["NADPH"]) ] },
  { id: "beta-oxidation", label: "脂肪酸β氧化", short: "β氧化", color: "#ff7f8e", origin: [-3.9,-2.3,-3.35], u: [.9,.05,.43], v: [.12,.97,-.2], nodeIds: ["palmitate","acyl-coa","fadh2","nadh","acetyl-coa","atp"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "脂酰-CoA经脱氢、水合、再脱氢和硫解反复切下乙酰-CoA。", exam: "活化、肉碱穿梭、四步循环、软脂酸能量计算及与合成的对比调控。", steps: [s("palmitate","acyl-coa","脂酰-CoA合成酶","活化",["ATP→AMP"]),s("acyl-coa","fadh2","脂酰-CoA脱氢酶","FAD脱氢"),s("acyl-coa","nadh","β-羟脂酰-CoA脱氢酶","NAD⁺脱氢"),s("acyl-coa","acetyl-coa","硫解酶","硫解",["缩短2C"]) ] },
  { id: "ketone-metabolism", label: "酮体生成与利用", short: "酮体", color: "#ee847a", origin: [-2.75,.3,-3.6], u: [.8,0,.6], v: [.05,.99,-.06], nodeIds: ["acetyl-coa","ketone","succinyl-coa"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "肝线粒体生成酮体供外周组织，肝自身缺乏硫解酶不能利用。", exam: "生成条件、三种酮体、肝外利用及糖尿病酮症机制。", steps: [s("acetyl-coa","ketone","HMG-CoA合成酶/裂解酶","酮体生成",["肝线粒体"]),s("ketone","acetyl-coa","琥珀酰-CoA转硫酶+硫解酶","肝外利用",["肝缺转硫酶"]) ] },
  { id: "c4", label: "C4循环", short: "C4", color: "#ffcf67", origin: [.15,2.45,-1.3], u: [.85,.1,.5], v: [-.15,.75,.62], nodeIds: ["pep","oaa","malate","pyruvate","atp"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "PEP羧化酶先固定HCO₃⁻生成四碳酸，再在维管束鞘释放CO₂。", exam: "比较C3/C4植物的空间分工、关键酶、能量代价与光呼吸差异。", steps: [s("pep","oaa","PEP羧化酶","羧化",["HCO₃⁻","不受O₂竞争"]),s("oaa","malate","苹果酸脱氢酶","还原"),s("malate","pyruvate","苹果酸酶","脱羧",["浓缩CO₂"]),s("pyruvate","pep","丙酮酸磷酸双激酶","再生PEP",["耗2个高能键"]) ] },
  { id: "glyoxylate-cycle", label: "乙醛酸循环", short: "乙醛酸", color: "#50d4d0", origin: [-1.7,-2.6,-1.4], u: [.8,.05,-.6], v: [.35,.8,.48], nodeIds: ["oaa","citrate","isocitrate","glyoxylate","acetyl-coa","malate","succinate"], layout: "cycle", subject: "生物化学", evidence: "河南农生化", summary: "以异柠檬酸裂解酶和苹果酸合酶绕过TCA的两次氧化脱羧，使脂肪可净转为糖。", exam: "与TCA比较共享中间物、特征酶、碳保留结果和油料种子萌发生理意义。", steps: [s("isocitrate","glyoxylate","异柠檬酸裂解酶","裂解",["特征酶","伴生琥珀酸"]),s("glyoxylate","malate","苹果酸合酶","与乙酰-CoA缩合",["特征酶"]),s("malate","oaa","苹果酸脱氢酶","脱氢") ] },
  { id: "oxidative-phosphorylation", label: "呼吸链与氧化磷酸化", short: "OXPHOS", color: "#ffc65a", origin: [3.7,-.5,-5.35], u: [.9,.08,.43], v: [.08,.98,-.16], nodeIds: ["nadh","complex1","fadh2","complex2","coq","complex3","cytc","complex4","oxygen","atp-synthase","adp","atp"], layout: "line", subject: "交叉", evidence: "河南农生化", summary: "电子沿内膜复合体传递并建立质子梯度，ATP合酶利用质子动力势合成ATP。", exam: "电子顺序、三处泵质子、复合体Ⅱ特点、化学渗透、抑制剂与解偶联剂。", steps: [s("nadh","complex1","复合体Ⅰ","NADH氧化",["泵H⁺"]),s("fadh2","complex2","复合体Ⅱ","FADH₂氧化",["不泵H⁺"]),s("complex1","coq","Fe-S中心","电子传递"),s("complex2","coq","Fe-S中心","电子传递"),s("coq","complex3","复合体Ⅲ","Q循环",["泵H⁺"]),s("complex3","cytc","细胞色素c₁","单电子传递"),s("cytc","complex4","复合体Ⅳ","电子传递",["泵H⁺"]),s("complex4","oxygen","复合体Ⅳ","O₂还原为H₂O"),s("adp","atp","ATP合酶","氧化磷酸化",["H⁺回流"]) ] },
  { id: "membrane-transport", label: "膜结构与跨膜运输", short: "膜运输", color: "#57e0a2", origin: [6.2,3.25,-1.5], u: [.8,0,.6], v: [.08,.99,-.1], nodeIds: ["phospholipid","cholesterol","nak-pump","atp","adp"], layout: "line", subject: "细胞生物学", evidence: "河南农本科", summary: "脂双层提供选择性屏障，通道、载体和泵完成被动或主动运输。", exam: "流动镶嵌、膜流动性因素、简单扩散/易化扩散/主动运输与Na⁺/K⁺泵。", steps: [s("phospholipid","cholesterol","膜脂相互作用","调节流动性"),s("atp","nak-pump","Na⁺/K⁺-ATPase","ATP水解驱动构象变化",["3 Na⁺出/2 K⁺入","原发主动运输"]),s("nak-pump","adp","Na⁺/K⁺-ATPase","释放ADP+Pi") ] },
  { id: "vesicle-traffic", label: "膜泡运输与蛋白分选", short: "膜泡", color: "#51d9c2", origin: [7.0,.35,1.4], u: [.75,-.1,.65], v: [.15,.98,-.03], nodeIds: ["clathrin","copii","copi","rab","snare","srp","sec61","ribosome"], layout: "cycle", subject: "细胞生物学", evidence: "华中农参考", summary: "包被选择货物并弯曲膜，Rab提供地址，SNARE执行特异膜融合。", exam: "COPⅡ顺向、COPⅠ逆向、网格蛋白内吞，以及Rab/SNARE分工。", steps: [s("ribosome","srp","SRP","识别信号肽/暂停翻译"),s("srp","sec61","SRP受体","对接转位子"),s("copii","rab","Sar1/COPⅡ","ER出芽"),s("copi","rab","ARF/COPⅠ","回收运输"),s("clathrin","rab","AP2/网格蛋白","受体介导内吞"),s("rab","snare","系链蛋白+SNARE","对接与融合") ] },
  { id: "cytoskeleton", label: "细胞骨架与分子马达", short: "骨架", color: "#46d6a0", origin: [9.2,2.5,2.6], u: [.82,.1,.56], v: [-.15,.98,.06], nodeIds: ["actin","tubulin","myosin","kinesin","dynein","atp"], layout: "cycle", subject: "细胞生物学", evidence: "河南农本科", summary: "微丝与微管既支撑细胞，也为ATP驱动的马达提供定向轨道。", exam: "三类骨架的亚基、极性、动态性、功能和马达运动方向。", steps: [s("actin","myosin","肌球蛋白ATPase","沿微丝运动",["耗ATP"]),s("tubulin","kinesin","驱动蛋白ATPase","多向微管正端",["耗ATP"]),s("tubulin","dynein","动力蛋白ATPase","向微管负端/轴丝滑动",["耗ATP"]) ] },
  { id: "gpcr-camp", label: "GPCR–cAMP–PKA通路", short: "cAMP", color: "#6fc7ff", origin: [10.0,-.6,-.5], u: [.8,0,.6], v: [.05,.99,-.05], nodeIds: ["gpcr","galpha","adenylyl-cyclase","atp","camp","pka"], layout: "line", subject: "细胞生物学", evidence: "河南农本科", summary: "七跨膜受体经Gs激活腺苷酸环化酶，cAMP激活PKA并放大信号。", exam: "按配体—受体—G蛋白—效应酶—第二信使—激酶写完整，并说明关停。", steps: [s("gpcr","galpha","GPCR作为GEF","GDP换GTP"),s("galpha","adenylyl-cyclase","Gαs","激活效应酶"),s("atp","camp","腺苷酸环化酶","环化",["第二信使"]),s("camp","pka","PKA调节亚基","解除抑制",["磷酸化级联"]) ] },
  { id: "plc-calcium", label: "PLC–IP₃/DAG–Ca²⁺通路", short: "Ca²⁺", color: "#45c7d9", origin: [9.1,-2.0,-1.35], u: [.72,.05,.69], v: [.08,.99,-.14], nodeIds: ["gpcr","galpha","plc","phospholipid","ip3","dag","calcium","calmodulin"], layout: "cycle", subject: "细胞生物学", evidence: "河南农本科", summary: "Gq或RTK激活PLC，PIP₂裂解成可溶IP₃和膜内DAG，Ca²⁺信号被CaM读取。", exam: "IP₃与DAG去向、Ca²⁺储库、PKC/CaM靶点和信号终止。", steps: [s("galpha","plc","Gαq","激活PLCβ"),s("phospholipid","ip3","PLC","PIP₂水解",["可溶第二信使"]),s("phospholipid","dag","PLC","PIP₂水解",["膜内第二信使"]),s("ip3","calcium","IP₃受体","内质网释放Ca²⁺"),s("calcium","calmodulin","钙调蛋白","构象激活") ] },
  { id: "rtk-mapk", label: "RTK–Ras–MAPK通路", short: "MAPK", color: "#ff9a6e", origin: [10.1,-.65,3.55], u: [.82,.05,.57], v: [.08,.99,-.12], nodeIds: ["rtk","ras","raf","mek","erk","cyclin"], layout: "line", subject: "细胞生物学", evidence: "华中农参考", summary: "RTK自磷酸化后经衔接蛋白激活Ras，再以三级激酶级联调节增殖基因。", exam: "受体二聚自磷酸化、Grb2/SOS、Ras分子开关与MAPK三级级联。", steps: [s("rtk","ras","Grb2–SOS","促Ras换GTP"),s("ras","raf","Ras-GTP","招募激活MAPKKK"),s("raf","mek","Raf","磷酸化MAPKK"),s("mek","erk","MEK","双位点磷酸化MAPK"),s("erk","cyclin","转录因子","诱导周期蛋白") ] },
  { id: "chromatin", label: "染色质包装与核结构", short: "染色质", color: "#a78bfa", origin: [6.1,-2.8,5.35], u: [.85,.05,.52], v: [.02,.99,-.06], nodeIds: ["dna","histone","nucleosome","lamin"], layout: "cycle", subject: "细胞生物学", evidence: "河南农本科", summary: "DNA缠绕组蛋白八聚体形成核小体，并进一步折叠、锚定于核纤层相关区域。", exam: "核小体结构、组蛋白修饰、常/异染色质及核纤层功能。", steps: [s("dna","histone","组蛋白八聚体","约147 bp DNA缠绕"),s("histone","nucleosome","H2A/H2B/H3/H4","核小体组装"),s("nucleosome","lamin","核纤层相关结构域","核内组织") ] },
  { id: "nuclear-transport", label: "核质运输", short: "核孔", color: "#8d9cff", origin: [7.75,-2.35,4.8], u: [.73,-.03,.68], v: [.1,.99,-.08], nodeIds: ["importin","ran-gtp","atp","dna","lamin"], layout: "cycle", subject: "细胞生物学", evidence: "华中农参考", summary: "输入蛋白识别NLS，Ran-GTP核内高、Ran-GDP胞质高建立运输方向。", exam: "核孔复合体、NLS、输入蛋白及Ran梯度的建立和解离步骤。", steps: [s("importin","dna","输入蛋白–货物复合体","通过核孔输入"),s("ran-gtp","importin","Ran-GTP","核内解离货物"),s("atp","ran-gtp","Ran-GEF/GAP循环","方向性维持") ] },
  { id: "gene-expression", label: "转录、翻译与内质网靶向", short: "表达", color: "#73b6ff", origin: [5.6,-2.0,3.7], u: [.8,.08,.59], v: [.05,.99,-.1], nodeIds: ["dna","mrna","ribosome","srp","sec61"], layout: "line", subject: "交叉", evidence: "河南农本科", summary: "DNA转录为mRNA，核糖体翻译；带信号肽的新生链由SRP导向Sec61。", exam: "真核转录加工、核糖体A/P/E位点、信号肽假说与共翻译转位。", steps: [s("dna","mrna","RNA聚合酶Ⅱ","转录+加工"),s("mrna","ribosome","核糖体","翻译"),s("ribosome","srp","SRP","识别信号肽"),s("srp","sec61","SRP受体","共翻译转位") ] },
  { id: "cell-cycle", label: "细胞周期与检查点", short: "周期", color: "#ffca68", origin: [8.0,.05,6.25], u: [.78,.05,.62], v: [.05,.99,-.08], nodeIds: ["cyclin","cdk","rb","e2f","p53","ubiquitin","proteasome"], layout: "cycle", subject: "细胞生物学", evidence: "河南农本科", summary: "Cyclin–CDK波动推动周期，Rb/E2F控制限制点，p53应答DNA损伤。", exam: "各期事件、MPF、G1/S与G2/M检查点、周期蛋白降解及癌基因联系。", steps: [s("cyclin","cdk","Cyclin结合CDK","激酶激活"),s("cdk","rb","Cyclin D/E–CDK","Rb磷酸化"),s("rb","e2f","Rb/E2F","释放E2F"),s("p53","cdk","p21","损伤时抑制CDK"),s("cyclin","ubiquitin","SCF/APC/C","泛素化"),s("ubiquitin","proteasome","26S蛋白酶体","周期蛋白降解") ] },
  { id: "apoptosis", label: "线粒体内源性凋亡", short: "凋亡", color: "#ff707f", origin: [6.7,-2.3,-5.25], u: [.8,.05,.6], v: [.05,.99,-.05], nodeIds: ["p53","bax","bcl2","cytc","apaf1","atp","caspase9","caspase3"], layout: "line", subject: "交叉", evidence: "河南农本科", summary: "Bax/Bak促外膜通透化，细胞色素c在胞质组装凋亡小体并激活caspase级联。", exam: "比较凋亡与坏死，写Bcl-2家族、MOMP、凋亡小体及caspase级联。", steps: [s("p53","bax","转录调控","促凋亡"),s("bcl2","bax","Bcl-2家族制衡","抑制MOMP"),s("bax","cytc","Bax/Bak寡聚","线粒体外膜通透化"),s("cytc","apaf1","Apaf-1+dATP","凋亡小体"),s("apaf1","caspase9","凋亡小体","起始caspase激活"),s("caspase9","caspase3","蛋白水解级联","执行凋亡") ] },
  { id: "ubiquitin-proteasome", label: "泛素–蛋白酶体系统", short: "UPS", color: "#e486ff", origin: [10.0,-3.0,5.4], u: [.72,0,.69], v: [.05,.99,-.05], nodeIds: ["atp","ubiquitin","proteasome","cyclin","p53"], layout: "cycle", subject: "细胞生物学", evidence: "华中农参考", summary: "E1激活、E2转运、E3识别底物，多聚泛素链把蛋白送入26S蛋白酶体。", exam: "E1/E2/E3分工、ATP用途、泛素链与细胞周期/蛋白质质量控制。", steps: [s("atp","ubiquitin","E1泛素激活酶","ATP依赖活化"),s("ubiquitin","cyclin","E2+E3","底物特异泛素化"),s("ubiquitin","p53","E2+E3","稳定性调控"),s("ubiquitin","proteasome","26S蛋白酶体","识别解折叠降解",["耗ATP"]) ] },
  { id: "cell-adhesion", label: "细胞连接与细胞外基质", short: "连接", color: "#55d9ae", origin: [11.3,1.8,.7], u: [.8,0,.6], v: [.05,.99,-.05], nodeIds: ["integrin","actin","collagen","cadherin","calcium","connexin","cellulose","udp-glucose"], layout: "cycle", subject: "细胞生物学", evidence: "河南农本科", summary: "整联蛋白连ECM与骨架，钙黏蛋白构成黏着连接，连接子形成细胞间小分子通道；植物另有细胞壁。", exam: "四类动物细胞连接、ECM–整联蛋白双向信号及植物细胞壁/胞间连丝比较。", steps: [s("collagen","integrin","整联蛋白","ECM–骨架耦联"),s("integrin","actin","黏着斑蛋白","连接微丝"),s("calcium","cadherin","Ca²⁺","稳定胞外结构域"),s("cadherin","actin","连环蛋白","黏着连接"),s("connexin","connexin","连接子六聚体","缝隙连接"),s("udp-glucose","cellulose","纤维素合酶","β-1,4多聚化") ] },
];

export const moleculeById = Object.fromEntries(molecules.map((item) => [item.id, item])) as Record<string, Molecule>;
export const processById = Object.fromEntries(processes.map((item) => [item.id, item])) as Record<string, ProcessPlane>;

export const familyColor: Record<Molecule["family"], string> = {
  carbon: "#64a7ff",
  nitrogen: "#a787ff",
  energy: "#ffcb62",
  enzyme: "#ff8b76",
  cell: "#59e3a7",
};
