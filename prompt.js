export const stages = ['知らない人','知っているが興味がない人','興味はあるが行動しない人'];
export const barriers = [
 {name:'商品に納得していない', appeal:'望む未来につながる根拠を示す', videos:['受講者インタビュー','変化のドキュメンタリー','第三者の推薦','データ・実績紹介']},
 {name:'発信者を信用していない', appeal:'人柄・想い・専門性を伝える', videos:['仕事への想いを語るストーリー','日常や裏側','役立つ情報','Q&A']},
 {name:'会社を信用していない', appeal:'組織の信頼性・透明性・安心感を伝える', videos:['代表のストーリー','講師紹介','授業風景','教室ツアー','確認済みの掲載・受賞実績','地域活動']},
 {name:'行動のハードルが高い', appeal:'手順を具体化し、不安を解消する', videos:['チュートリアル','体験の様子','体験機会の紹介','変化のドキュメンタリー','FAQ']},
 {name:'商品の必要性に気づいていない', appeal:'自分との関係や新しい気づきを伝える', videos:['役立つ知識','思い込みを見直す解説','よくある失敗と改善例']}
];
export const required = {role:'所属・役割',purpose:'目的',audience:'どんな人',reason:'具体的な行動しない理由',video:'どんな動画',issue:'集客・受講申し込みにつながらない理由',appeal:'どんな訴求'};
export function validate(data) { return Object.keys(required).filter(key => !data[key]?.trim()); }
export const direction = `### 台本の構成・演出条件

- 冒頭で対象者が自分に関係する内容だと分かるようにしてください。
- 視聴維持を意識し、1本で伝える主題を絞ってください。
- 行動しない理由に共感し、具体的な説明や根拠で不安・疑問を解消してください。
- 動画の目的に合う行動喚起を1つに絞ってください。指定があれば優先してください。
- エフェクトは強調したい箇所のアクセントとして使ってください。
- 秒数、セリフ・ナレーション、映像、テロップ、演出を表で提案してください。
- 全体が30秒〜1分に収まる構成にしてください。
- 未提供の実績、数値、体験談、受講条件は創作せず、必要な箇所を「要確認」としてください。`;
export function generate(data) {
 const d = Object.fromEntries(Object.entries(data).map(([k,v])=>[k,typeof v==='string'?v.trim():v]));
 let result = `私は${d.role}です。\n\nTikTokショート動画を作ります。\n\n### 動画の目的とジャンル\n\n${d.audience}の${d.reason}を${d.video}で取り除いて\n\n${d.purpose}\n\n### 動画の内容\n\n${d.issue}を、${d.appeal}で解決する。\n\n### 動画の長さ\n\n30秒〜1分程度\n\n効果的な台本を提案してください。`;
 const context = [];
 if(d.stage !== undefined && stages[d.stage]) context.push(`対象者の認知・関心：${stages[d.stage]}`);
 if(d.barrier !== undefined && barriers[d.barrier]) context.push(`視聴者側の障壁の分類：${barriers[d.barrier].name}`);
 if(context.length) result += '\n\n### 対象者を理解するための補足\n\n'+context.join('\n');
 const extras = [];
 if(d.cta) extras.push(`行動喚起（CTA）：${d.cta}`);
 if(d.facts) extras.push(`使用できる事実・素材：\n${d.facts}`);
 if(d.emotion) extras.push(`視聴後に持ってほしい気持ち：${d.emotion}`);
 if(d.constraints) extras.push(`撮影・編集の条件：\n${d.constraints}`);
 if(extras.length) result += '\n\n### 補足条件\n\n'+extras.join('\n\n');
 if(d.mode === 'agent') result += '\n\n### 台本ディレクターへの依頼\n\n上記の所属・目的に沿って台本を作成してください。対象者の段階だけで障壁を決めつけず、具体的な人物像と合わせて判断してください。\n企画の要約、冒頭フック（採用案と比較案）、時間・セリフ・映像・テロップ・音を含む台本、制作・確認メモ、次回の検証を提示してください。構成・演出の細部はあなたの制作方針に委ねます。\n未提供の実績、数値、体験談、受講条件、URLは創作せず「要確認」としてください。未収録のインタビューは架空の発言ではなく、質問と必要な回答内容を示してください。';
 if(d.mode !== 'agent' && d.direction) result += '\n\n'+direction;
 return result;
}
