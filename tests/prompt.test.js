import test from 'node:test';
import assert from 'node:assert/strict';
import {generate,validate,required,barriers,direction} from '../prompt.js';
const data={role:'担当者',purpose:'講座の詳細を確認してもらう。',audience:'受講を迷う人',reason:'不安',video:'授業紹介',issue:'雰囲気が伝わらないこと',appeal:'安心感',cta:'',facts:'',direction:false};
test('基本テンプレートを正確に生成し任意の空見出しを出さない',()=>{
 assert.equal(generate(data),'私は担当者です。\n\nTikTokショート動画を作ります。\n\n### 動画の目的とジャンル\n\n受講を迷う人の不安を授業紹介で取り除いて\n\n講座の詳細を確認してもらう。\n\n### 動画の内容\n\n雰囲気が伝わらないことを、安心感で解決する。\n\n### 動画の長さ\n\n30秒〜1分程度\n\n効果的な台本を提案してください。');
});
test('必須項目の空文字・全角空白を検証',()=>{assert.deepEqual(validate(data),[]);for(const key of Object.keys(required))assert.deepEqual(validate({...data,[key]:' \n　'}),[key]);});
test('補足条件と演出条件の切り替え',()=>{let output=generate({...data,cta:' 確認する ',facts:'許可済みの素材',direction:true});assert.ok(output.includes('行動喚起（CTA）：確認する'));assert.ok(output.includes('許可済みの素材'));assert.ok(output.endsWith(direction));assert.ok(!generate(data).includes('補足条件'));assert.ok(!generate(data).includes('構成・演出条件'));});
test('5分類すべてに動画と訴求の候補がある',()=>{assert.equal(barriers.length,5);for(const b of barriers){assert.ok(b.videos.length>=3);assert.ok(b.appeal);}});
test('全段階と障壁分類を人間が読める名称で引き継ぐ',()=>{
 for(const stage of ['0','1','2']) for(const barrier of ['0','1','2','3','4']) {
 const output=generate({...data,stage,barrier});
 assert.ok(output.includes('対象者の認知・関心：'));
 assert.ok(output.includes(`視聴者側の障壁の分類：${barriers[barrier].name}`));
 assert.ok(!output.includes('undefined'));
 }
});
test('エージェント向け依頼は一般向け演出条件と重複しない',()=>{
 const output=generate({...data,mode:'agent',direction:true,emotion:'安心する',constraints:'顔出しなし'});
 assert.ok(output.includes('台本ディレクターへの依頼'));
 assert.ok(output.includes('視聴後に持ってほしい気持ち：安心する'));
 assert.ok(output.includes('撮影・編集の条件：\n顔出しなし'));
 assert.ok(output.includes('未収録のインタビュー'));
 assert.ok(!output.includes('### 台本の構成・演出条件'));
 assert.ok(generate({...data,mode:'general',direction:true}).endsWith(direction));
 assert.ok(!generate({...data,mode:'general'}).includes('台本ディレクターへの依頼'));
});
