(function registerEvidence(H) {
  "use strict";

  H.Data.Evidence = [
  {
    "id": "e_ch2_field_writ",
    "title": "第二監査命令書",
    "icon": "令",
    "category": "document",
    "source": "地図院・ナイラ",
    "key": false,
    "summary": "第一章後の追跡監査を許可する命令書。",
    "detail": "北区事件の公式報告を受け、東区の黒雨、救済帳簿、灰塩公債、鐘楼鋳造区の予算を横断調査する権限が記されている。監査庁の封印資料庫は別途承認が必要。",
    "quote": "『雨は天候ではない。記録の表面へ落ちる命令だ』",
    "tags": [
      "権限",
      "監査",
      "第二章"
    ],
    "truthWeight": 3
  },
  {
    "id": "e_true_map_copy",
    "title": "第一章採用地図の写し",
    "icon": "図",
    "category": "document",
    "source": "地図院・認証卓",
    "key": true,
    "summary": "第一章で採用された公式地図。東区の線だけが後から滲んでいる。",
    "detail": "灰獣事件後に復元した旧水路線は残っているが、東区二重門へ伸びる補助線だけが黒い雨跡で上書きされている。誰かが報告後の地図だけを狙った。",
    "quote": "公式地図は一枚のはずだが、濡れ方は二枚分ある。",
    "tags": [
      "地図",
      "第一章",
      "東区",
      "黒雨"
    ],
    "truthWeight": 10
  },
  {
    "id": "e_black_rain_sample",
    "title": "黒雨インクの採取瓶",
    "icon": "滴",
    "category": "material",
    "source": "東区・雨樋",
    "key": true,
    "summary": "雨水に灰塩と鏡墨が混ざっている。自然雨ではない。",
    "detail": "瓶の底に銀灰色の結晶と黒い顔料が分離する。乾くと文字をにじませるだけでなく、古い筆跡の上に別の線を浮かべる。",
    "quote": "雨は空から落ちる。だがこの雨は、紙の内側から滲む。",
    "tags": [
      "黒雨",
      "灰塩",
      "鏡墨",
      "物質"
    ],
    "truthWeight": 14
  },
  {
    "id": "e_wet_ledger_page",
    "title": "濡れた救済帳簿",
    "icon": "帳",
    "category": "document",
    "source": "東区・救済券窓口",
    "key": true,
    "summary": "乾いた室内の帳簿が、特定の氏名欄だけ濡れている。",
    "detail": "黒雨は窓の外から入っていない。名簿のうち、第一章で救済対象になった世帯名だけが黒くにじみ、番地が別欄へ移されている。",
    "quote": "救済者の名前が、債務者の欄へ流れている。",
    "tags": [
      "帳簿",
      "救済",
      "名前",
      "黒雨"
    ],
    "truthWeight": 13
  },
  {
    "id": "e_duplicate_notice",
    "title": "同時刻の二枚の公示",
    "icon": "告",
    "category": "document",
    "source": "東区・掲示板",
    "key": false,
    "summary": "同じ時刻の公示が、異なる避難区域を示している。",
    "detail": "一枚は公式地図の東門を、もう一枚は存在しない補助門を避難線としている。押印はどちらも本物だが、紙質が異なる。",
    "quote": "正しい公示が二枚ある時、街は二つに裂ける。",
    "tags": [
      "公示",
      "二重門",
      "地図",
      "避難"
    ],
    "truthWeight": 9
  },
  {
    "id": "e_double_gate_map",
    "title": "東区二重門の食い違う地図",
    "icon": "門",
    "category": "document",
    "source": "東区・門番小屋",
    "key": true,
    "summary": "公式地図と影地図で、同じ門の到達先が違う。",
    "detail": "灰時計から見れば一つの東門だが、配達人の影地図では二つの出口として描かれている。片方は救済券窓口へ、片方は灰塩公債窓口へ続く。",
    "quote": "同じ門を通ったのに、違う役所へ着く。",
    "tags": [
      "地図",
      "二重門",
      "影地図",
      "管轄"
    ],
    "truthWeight": 14
  },
  {
    "id": "e_erased_tax_roll",
    "title": "名前の抜けた徴税名簿",
    "icon": "名",
    "category": "document",
    "source": "東区・救済券窓口",
    "key": true,
    "summary": "納税記録には存在する世帯名が、救済名簿から消えている。",
    "detail": "名前が消えた行には空白ではなく、非常に薄い抵当印が残っている。名簿上は消えたが、帳簿上は価値として残された形跡。",
    "quote": "人が消えるのではない。権利だけが別の帳簿へ移る。",
    "tags": [
      "名前",
      "救済",
      "徴税",
      "担保"
    ],
    "truthWeight": 13
  },
  {
    "id": "e_counterfeit_seal",
    "title": "監査庁の複製封印",
    "icon": "封",
    "category": "physical",
    "source": "帳簿街・裏封筒",
    "key": false,
    "summary": "監査庁の封印に見えるが、鋳造区の黒銅粉が混じる。",
    "detail": "押印面は精巧だが、縁の摩耗が新しすぎる。正式封印ではなく、夜間の資料移送を合法に見せるための複製。",
    "quote": "本物に似た封印ほど、資料の移動を疑え。",
    "tags": [
      "封印",
      "監査庁",
      "鋳造",
      "偽装"
    ],
    "truthWeight": 9
  },
  {
    "id": "e_mira_last_note",
    "title": "ミラ監査官の最後の書付",
    "icon": "筆",
    "category": "document",
    "source": "監査庁・下書き箱",
    "key": true,
    "summary": "失踪した監査官ミラが残した、予算追跡の途中メモ。",
    "detail": "『雨ではなく利息を追え』『名簿の欠落と公債の増額は同日』『黒鐘の請求書は災害後ではなく災害前』と短く書かれている。",
    "quote": "雨音を聞くな。利息を数えろ。",
    "tags": [
      "ミラ",
      "監査",
      "予算",
      "公債"
    ],
    "truthWeight": 15
  },
  {
    "id": "e_yura_delivery_string",
    "title": "結び目の配達紐",
    "icon": "紐",
    "category": "physical",
    "source": "東区・配達棚",
    "key": false,
    "summary": "配達人ユラが使う道順暗号。鏡面水路の避難所を示す。",
    "detail": "三つの結び目は東門、取引所、排水溝を表す。解けば『濡れない地下へ逃げろ』という短い道順になる。",
    "quote": "紙は濡れる。紐はほどけるまで嘘をつかない。",
    "tags": [
      "配達",
      "水路",
      "避難所",
      "ユラ"
    ],
    "truthWeight": 8
  },
  {
    "id": "e_gray_bond_certificate",
    "title": "灰塩復興公債",
    "icon": "券",
    "category": "document",
    "source": "帳簿街・公債窓口",
    "key": true,
    "summary": "災害が深刻になるほど利回りが上がる復興債。",
    "detail": "東区の黒雨被害額を担保にした公債。被害対象の名簿が増えるほど、翌月の利息計算に有利になる構造を持つ。",
    "quote": "救済の紙が、利息を生む紙へ変わる。",
    "tags": [
      "公債",
      "灰塩",
      "利息",
      "利益"
    ],
    "truthWeight": 14
  },
  {
    "id": "e_budget_flow_table",
    "title": "復興予算の流向表",
    "icon": "表",
    "category": "document",
    "source": "帳簿街・取引所",
    "key": true,
    "summary": "救済予算が監査庁、鋳造区、公債商へ循環している。",
    "detail": "黒雨対策費、雨鐘補正器、臨時封印、救済券再発行費が同じ三者へ戻る。災害が続くほど支出が増え、支出がまた災害対策の口実になる。",
    "quote": "円環の支出は、誰かにとって止める理由がない。",
    "tags": [
      "予算",
      "利益",
      "公債",
      "循環"
    ],
    "truthWeight": 15
  },
  {
    "id": "e_mirror_ink_receipt",
    "title": "鏡墨の領収書",
    "icon": "墨",
    "category": "document",
    "source": "帳簿街・顔料商",
    "key": false,
    "summary": "黒雨に含まれる鏡墨が、監査庁名義で購入されている。",
    "detail": "表向きは複写防止用の顔料。しかし納品先は監査庁ではなく、鐘楼鋳造区の雨音補正器工房だった。",
    "quote": "記録を守る顔料が、記録を書き換える雨になった。",
    "tags": [
      "鏡墨",
      "黒雨",
      "監査庁",
      "鋳造"
    ],
    "truthWeight": 11
  },
  {
    "id": "e_bell_mold_shard",
    "title": "黒鐘の鋳型片",
    "icon": "鐘",
    "category": "physical",
    "source": "鐘楼鋳造区・廃材山",
    "key": true,
    "summary": "黒鐘に使われた鋳型の欠片。第一章の雨鐘紋が反転している。",
    "detail": "紋様は雨鐘の修復紋と似ているが、左右が反転している。正しい基準音を鳴らすのではなく、既存記録を逆相で震わせる目的に見える。",
    "quote": "鐘は時を知らせる。黒鐘は時刻ではなく、採用済みの事実を鳴らす。",
    "tags": [
      "鐘",
      "黒鐘",
      "反転",
      "位相"
    ],
    "truthWeight": 14
  },
  {
    "id": "e_resonance_invoice",
    "title": "雨音補正器の請求書",
    "icon": "請",
    "category": "document",
    "source": "鐘楼鋳造区・会計棚",
    "key": false,
    "summary": "黒鐘の周辺装置が、黒雨発生前に発注されている。",
    "detail": "請求書の日付は被害発生日の二日前。災害対策としては早すぎる。宛先は監査庁災害記録課、支払保証は灰塩復興公債。",
    "quote": "対策は、災害より先に発注されていた。",
    "tags": [
      "請求書",
      "事前準備",
      "黒鐘",
      "予算"
    ],
    "truthWeight": 12
  },
  {
    "id": "e_black_bell_residue",
    "title": "黒鐘の灰銅粉",
    "icon": "粉",
    "category": "material",
    "source": "鐘楼鋳造区・鐘舌",
    "key": false,
    "summary": "鐘を鳴らすたび、黒雨と同じ金属粉が落ちる。",
    "detail": "粉末は雨樋で採取した黒雨インクと同じ結晶配列を持つ。音で粒子を飛ばすのではなく、記録紙の灰塩と共鳴して黒化を起こす。",
    "quote": "雨粒ではなく、紙の中の灰塩が鐘に返事をしている。",
    "tags": [
      "黒鐘",
      "灰銅粉",
      "共鳴",
      "黒雨"
    ],
    "truthWeight": 13
  },
  {
    "id": "e_phase_chart",
    "title": "鐘音位相表",
    "icon": "譜",
    "category": "document",
    "source": "鐘楼鋳造区・調律台",
    "key": true,
    "summary": "黒鐘の音と帳簿改ざん時刻が一致する表。",
    "detail": "午前二刻、午前四刻、夕七刻に黒鐘を三拍ずつ鳴らすと、指定区域の公式記録だけが濡れる。第二拍が地図、第三拍が名簿に対応する。",
    "quote": "鐘音は、誰の名前を濡らすかまで指定していた。",
    "tags": [
      "位相",
      "黒鐘",
      "地図",
      "名簿"
    ],
    "truthWeight": 16
  },
  {
    "id": "e_storm_drain_chalk",
    "title": "排水壁の白墨矢印",
    "icon": "矢",
    "category": "physical",
    "source": "鏡面水路・入口壁",
    "key": false,
    "summary": "黒雨を避ける者が描いた、濡れない通路の印。",
    "detail": "矢印は東区の配達紐と同じ順序で描かれている。最後の印は『声を出すな、名前を呼ぶな』を意味する。",
    "quote": "名前を呼ぶと、帳簿が聞く。",
    "tags": [
      "水路",
      "避難所",
      "配達",
      "名前"
    ],
    "truthWeight": 9
  },
  {
    "id": "e_safehouse_mark",
    "title": "証人避難所の合図印",
    "icon": "匿",
    "category": "physical",
    "source": "鏡面水路・避難室",
    "key": true,
    "summary": "名前を消された住民とミラを匿った印。",
    "detail": "壁には十二人分の真鍮札が吊られている。名簿から消えた名前を、一時的に物理物へ固定している。",
    "quote": "紙から消された名は、金属へ逃がせる。",
    "tags": [
      "避難所",
      "証人保護",
      "名前",
      "ミラ"
    ],
    "truthWeight": 13
  },
  {
    "id": "e_second_ledger_spine",
    "title": "第二帳簿の背表紙",
    "icon": "背",
    "category": "physical",
    "source": "鏡面水路・封印箱",
    "key": true,
    "summary": "本体から剥がされた第二帳簿の背表紙。",
    "detail": "表紙だけが地下へ運ばれ、中身は監査庁に残された。背表紙の繊維から、帳簿本体の紙束数と章立てを推定できる。",
    "quote": "本は中身だけでは逃げられない。背が行き先を覚えている。",
    "tags": [
      "第二帳簿",
      "監査",
      "水路",
      "封印"
    ],
    "truthWeight": 12
  },
  {
    "id": "e_name_anchor_tags",
    "title": "名前を固定する真鍮名札",
    "icon": "札",
    "category": "physical",
    "source": "鏡面水路・避難室",
    "key": true,
    "summary": "黒雨で紙から消えた名前を、一時的に街へ固定する名札。",
    "detail": "一枚ごとに名前、番地、証言時刻、保護者の印が打たれている。名前の物理固定がないまま公開すると、証人が帳簿上で再び消される危険がある。",
    "quote": "真実は、まず人を残してから公開する。",
    "tags": [
      "名前",
      "証人保護",
      "真鍮",
      "公開順序"
    ],
    "truthWeight": 14
  },
  {
    "id": "e_shadow_map_key",
    "title": "影地図の対応鍵",
    "icon": "鍵",
    "category": "document",
    "source": "監査庁・図面棚",
    "key": true,
    "summary": "公式地図の区画番号と影地図の区画番号を対応させる鍵。",
    "detail": "同じ住所を二つの番号へ分け、救済対象と担保対象を別々の地図に置く仕組みが記されている。影地図がなければ、二重門の管轄分割は成立しない。",
    "quote": "住所を二つに割れば、権利と債務を別々に歩かせられる。",
    "tags": [
      "影地図",
      "管轄",
      "住所",
      "公債"
    ],
    "truthWeight": 15
  },
  {
    "id": "e_council_vote_scrap",
    "title": "評議院投票片",
    "icon": "票",
    "category": "document",
    "source": "臨時評議院・床下",
    "key": true,
    "summary": "影地図運用を承認した閉鎖評議の投票片。",
    "detail": "正式議事録には残っていないが、棄権扱いの票の裏に『黒雨期間中のみ影地図を採用』という但し書きが残る。署名は三名分だけ読める。",
    "quote": "災害時だけの例外は、災害が続く限り恒久化する。",
    "tags": [
      "評議院",
      "影地図",
      "承認",
      "責任"
    ],
    "truthWeight": 16
  },
  {
    "id": "e_mira_audit_core",
    "title": "ミラ監査核資料",
    "icon": "核",
    "category": "document",
    "source": "ミラ監査官",
    "key": true,
    "summary": "ミラが命を賭けて保全した第二帳簿の索引。",
    "detail": "本文はまだ欠けているが、救済名簿、灰塩公債、黒鐘請求書、閉鎖評議投票が同じ事件番号へ結ばれている。全体像を固定する要。",
    "quote": "事件番号は一つ。部署だけが四つに分かれている。",
    "tags": [
      "ミラ",
      "第二帳簿",
      "全体像",
      "責任"
    ],
    "truthWeight": 18
  },
  {
    "id": "e_final_map_negative",
    "title": "存在しない避難線の陰画",
    "icon": "陰",
    "category": "document",
    "source": "臨時評議院・封印資料庫",
    "key": true,
    "summary": "公示にだけ存在した避難線の原版。",
    "detail": "公式地図では消され、影地図では担保窓口へ向かう線。黒雨の日、救済対象者はこの線を通った扱いになり、実際には窓口へ辿り着けない。",
    "quote": "道があることになれば、来なかった者の責任にできる。",
    "tags": [
      "地図",
      "避難線",
      "影地図",
      "救済"
    ],
    "truthWeight": 17
  },
  {
    "id": "e_false_budget_loop",
    "title": "災害実績と利息の循環表",
    "icon": "輪",
    "category": "document",
    "source": "臨時評議院・封印資料庫",
    "key": true,
    "summary": "災害が続くほど公債利息と対策予算が増える構造表。",
    "detail": "黒雨被害、救済未達、封鎖工事、黒鐘補正が互いを正当化している。実行者個人の犯罪ではなく、制度化された利益循環であることを示す。",
    "quote": "止めると損をする者が多すぎる仕組みは、犯人が一人ではない。",
    "tags": [
      "利益循環",
      "公債",
      "制度的不正",
      "黒雨"
    ],
    "truthWeight": 18
  },
  {
    "id": "e_drainage_budget_tag",
    "title": "排水路補修費の付替タグ",
    "icon": "札",
    "category": "document",
    "source": "東区・会計木箱",
    "key": false,
    "summary": "水路補修費が黒鐘の材料費へ付け替えられている。",
    "detail": "東区の排水路が修理されなかった理由を示す小さな札。黒雨を防ぐ予算が、黒雨を起こす装置へ回されている。",
    "quote": "穴を塞ぐ金で、鐘を鋳た。",
    "tags": [
      "予算",
      "排水",
      "黒鐘",
      "付替"
    ],
    "truthWeight": 10
  },
  {
    "id": "t_yura_mira_warning",
    "title": "ユラの証言：ミラの警告",
    "icon": "証",
    "category": "testimony",
    "source": "配達人ユラ",
    "key": true,
    "summary": "ミラは黒雨の前に『水ではなく利息を避けろ』と告げていた。",
    "detail": "ユラはミラから三通の配達を頼まれた。一通は地図院、一通はエルド、一通は名前を消された住民へ。三通目だけが黒雨で宛先を失った。",
    "quote": "『雨に濡れるな、じゃなかった。帳簿に濡れるな、だった』",
    "tags": [
      "証言",
      "ミラ",
      "配達",
      "公債"
    ],
    "truthWeight": 13
  },
  {
    "id": "t_eld_bond_courier",
    "title": "エルドの証言：公債の運び手",
    "icon": "証",
    "category": "testimony",
    "source": "行商人エルド",
    "key": true,
    "summary": "エルドは第一章以前から灰塩公債の異常な流れを運んでいた。",
    "detail": "エルドが運んでいたのは密売品ではなく、救済券と公債証書の控えだった。彼は自分の荷が住民の名前を担保化するとは知らなかった。",
    "quote": "『俺は荷を運んだ。人の名前まで荷になるとは思わなかった』",
    "tags": [
      "証言",
      "エルド",
      "公債",
      "第一章"
    ],
    "truthWeight": 13
  },
  {
    "id": "t_ines_revision_timing",
    "title": "イネスの証言：改ざん時刻",
    "icon": "証",
    "category": "testimony",
    "source": "書記官イネス",
    "key": true,
    "summary": "黒雨が降った時刻と、記録改ざんの発生時刻が一致する。",
    "detail": "イネスは紙の上に雨粒が落ちるより先に、インクが下から浮き上がるのを見た。時計ではなく鐘の三拍が改ざんの合図だった。",
    "quote": "『紙が濡れたんじゃありません。記録の方が雨を吸い上げたんです』",
    "tags": [
      "証言",
      "改ざん",
      "黒鐘",
      "時刻"
    ],
    "truthWeight": 14
  },
  {
    "id": "t_sabra_debt_roll",
    "title": "サブラの証言：担保名簿",
    "icon": "証",
    "category": "testimony",
    "source": "公債商サブラ",
    "key": false,
    "summary": "サブラは救済名簿が担保リストへ流用されたことを認めかける。",
    "detail": "彼は『制度上は名簿ではなく予測損失』と言い換えるが、実際の計算表には世帯名と番地が残っている。",
    "quote": "『名前ではなく、被害期待値です。市場ではそう呼びます』",
    "tags": [
      "証言",
      "サブラ",
      "担保",
      "公債"
    ],
    "truthWeight": 11
  },
  {
    "id": "t_goro_bell_commission",
    "title": "ゴロの証言：黒鐘発注",
    "icon": "証",
    "category": "testimony",
    "source": "鋳造工ゴロ",
    "key": false,
    "summary": "黒鐘は災害後ではなく、黒雨前に急造された。",
    "detail": "ゴロは工賃の前払いと、通常とは逆向きの紋様を覚えている。発注者名は伏せられたが、支払いは監査庁予備費だった。",
    "quote": "『災害対策だと言われた。だが災害より鐘の方が先に来た』",
    "tags": [
      "証言",
      "黒鐘",
      "事前準備",
      "監査庁"
    ],
    "truthWeight": 12
  },
  {
    "id": "t_cyr_rain_order",
    "title": "キュールの証言：雨を鳴らす命令",
    "icon": "証",
    "category": "testimony",
    "source": "鐘楼師キュール",
    "key": true,
    "summary": "黒鐘は雨を止めるのではなく、指定記録を濡らすために調律された。",
    "detail": "キュールは『私は音しか作っていない』と主張するが、位相表には名簿・地図・公示の三系統が明記されている。",
    "quote": "『鐘は誰の名を濡らすか選ばない。選んだのは表です』",
    "tags": [
      "証言",
      "黒鐘",
      "位相",
      "責任"
    ],
    "truthWeight": 15
  },
  {
    "id": "t_oren_market_slogan",
    "title": "オレンの証言：市場の合言葉",
    "icon": "証",
    "category": "testimony",
    "source": "噂売りオレン",
    "key": false,
    "summary": "帳簿街で黒雨を売り文句にした噂が意図的に流されている。",
    "detail": "『天罰』『第一章の報い』『救済券を受け取る者が怪しい』という三語が同じ日に売られていた。恐怖が窓口の混乱を増やしている。",
    "quote": "『怖がる理由があれば、人は正しい窓口を探さなくなる』",
    "tags": [
      "証言",
      "噂",
      "市場",
      "黒雨"
    ],
    "truthWeight": 10
  },
  {
    "id": "t_lio_name_erasure",
    "title": "リオの証言：消えた母の名前",
    "icon": "証",
    "category": "testimony",
    "source": "東区の子リオ",
    "key": true,
    "summary": "救済名簿から母の名前が消え、公債窓口にだけ残っている。",
    "detail": "リオの家は徴税名簿では存在し、救済名簿では空白、公債担保表では番号だけが残る。人としての権利だけが消された。",
    "quote": "『母さんの名前、雨で流れた。でも借金の紙だけ、母さんを覚えてる』",
    "tags": [
      "証言",
      "名前",
      "救済",
      "担保"
    ],
    "truthWeight": 15
  },
  {
    "id": "t_toka_underpass",
    "title": "トーカの証言：濡れない地下",
    "icon": "証",
    "category": "testimony",
    "source": "水路番トーカ",
    "key": false,
    "summary": "黒雨を避けるには鏡面水路へ降りる必要がある。",
    "detail": "トーカは配達人とミラを地下へ逃がした。だが名前を呼ぶと壁の帳簿が反応するため、住民は真鍮札で互いを指す。",
    "quote": "『水なら上から来る。黒雨は、記録から来る』",
    "tags": [
      "証言",
      "水路",
      "避難所",
      "黒雨"
    ],
    "truthWeight": 12
  },
  {
    "id": "t_maren_deny",
    "title": "マレンの証言：監査封印の理屈",
    "icon": "証",
    "category": "testimony",
    "source": "監査局長マレン",
    "key": false,
    "summary": "マレンは封印を『市場混乱回避』として正当化する。",
    "detail": "彼は黒雨の技術面を知らないふりをするが、第二帳簿の章番号を一度だけ口にしてしまう。資料の存在は知っている。",
    "quote": "『混乱を避けるため、見せない資料もある。それは隠蔽ではなく管理です』",
    "tags": [
      "証言",
      "マレン",
      "封印",
      "第二帳簿"
    ],
    "truthWeight": 11
  },
  {
    "id": "t_enja_closed_vote",
    "title": "エンジャの証言：閉鎖評議",
    "icon": "証",
    "category": "testimony",
    "source": "評議員エンジャ",
    "key": true,
    "summary": "影地図は閉鎖評議で承認されていた。",
    "detail": "エンジャは『非常措置』だったと認めるが、その非常状態を継続させる予算が同時に組まれていた。黒雨は例外を延長する道具だった。",
    "quote": "『一晩だけのはずだった。だが翌朝には、例外の方が地図になっていた』",
    "tags": [
      "証言",
      "評議院",
      "影地図",
      "承認"
    ],
    "truthWeight": 16
  },
  {
    "id": "t_mira_rescued_statement",
    "title": "ミラの証言：事件番号は一つ",
    "icon": "証",
    "category": "testimony",
    "source": "監査官ミラ",
    "key": true,
    "summary": "黒雨、第二帳簿、影地図、黒鐘は同一事件番号に属する。",
    "detail": "救出後のミラは、部署ごとに分けられた資料を一つの事件番号へ戻す。これにより責任主体が個人ではなく、閉鎖評議を含む共同設計へ広がる。",
    "quote": "『雨、帳簿、地図、鐘。別の部署に見えるでしょう。だから同じ事件にしたんです』",
    "tags": [
      "証言",
      "ミラ",
      "全体像",
      "責任"
    ],
    "truthWeight": 18
  }
];
  H.Data.EvidenceById = H.Core.Util.toMap(H.Data.Evidence);
})(window.Haimachi);
