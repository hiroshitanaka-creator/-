(function registerNPCs(H) {
  "use strict";

  H.Data.NPCs = [
  {
    "id": "naira",
    "name": "ナイラ・ヴェイン",
    "shortName": "ナイラ",
    "role": "地図院上席官／第二監査の発令者",
    "mapId": "map_archive",
    "x": 780,
    "y": 310,
    "initialTrust": 68,
    "glyph": "奈",
    "palette": [
      "#c9b184",
      "#45545b",
      "#171d20"
    ],
    "description": "第一章の報告を採用した地図院上席官。今回も監督役だが、評議院から圧力を受けている。",
    "publicFace": "厳格。証拠と公開順序を強く求める。",
    "hiddenConcern": "第一章の公開で東区の地図が反転したことを恐れている。",
    "topics": [
      "地図院",
      "第二監査",
      "公開順序",
      "証人保護"
    ]
  },
  {
    "id": "eld",
    "name": "エルド・レム",
    "shortName": "エルド",
    "role": "第一章の生存証人／行商人",
    "mapId": "ledger_exchange",
    "x": 420,
    "y": 760,
    "initialTrust": 61,
    "glyph": "商",
    "palette": [
      "#c3a477",
      "#51422c",
      "#201b16"
    ],
    "description": "救出後、証言者として保護されている。自分が運んだ公債控えが新事件に繋がったと知り動揺している。",
    "publicFace": "明るく振る舞うが、名前が商品化された恐怖を隠せない。",
    "hiddenConcern": "灰塩公債の運び手だった。",
    "topics": [
      "公債",
      "配達",
      "第一章",
      "ミラ"
    ]
  },
  {
    "id": "ines",
    "name": "イネス・ロア",
    "shortName": "イネス",
    "role": "書記官／記録改ざんの観測者",
    "mapId": "map_archive",
    "x": 1060,
    "y": 500,
    "initialTrust": 64,
    "glyph": "書",
    "palette": [
      "#c1a7a5",
      "#51444a",
      "#20191e"
    ],
    "description": "第一章では内部告発者。第二章では紙面が黒雨を吸い上げる瞬間を見た重要証人。",
    "publicFace": "静かだが、筆跡と時刻には異常なほど厳密。",
    "hiddenConcern": "黒鐘の三拍が改ざん時刻と一致すると気づいている。",
    "topics": [
      "改ざん",
      "黒雨",
      "黒鐘",
      "記録"
    ]
  },
  {
    "id": "yura",
    "name": "ユラ・セイル",
    "shortName": "ユラ",
    "role": "東区配達人",
    "mapId": "east_gate",
    "x": 560,
    "y": 370,
    "initialTrust": 49,
    "glyph": "配",
    "palette": [
      "#b8b08c",
      "#46563f",
      "#161c17"
    ],
    "description": "東区の二重門を日常的に使う配達人。紙ではなく紐で道順を残す。",
    "publicFace": "巡察官を警戒するが、ミラには恩がある。",
    "hiddenConcern": "ミラから地図院・エルド・消えた住民宛ての三通を預かった。",
    "topics": [
      "配達",
      "二重門",
      "ミラ",
      "避難所"
    ]
  },
  {
    "id": "lio",
    "name": "リオ",
    "shortName": "リオ",
    "role": "名前を消された母を探す子ども",
    "mapId": "east_gate",
    "x": 970,
    "y": 710,
    "initialTrust": 53,
    "glyph": "子",
    "palette": [
      "#d1c28b",
      "#5e5033",
      "#1f1a11"
    ],
    "description": "黒雨の日、母の名前が救済名簿から消えた。公債窓口にだけ番号として残っている。",
    "publicFace": "泣きそうだが、番地と名前を正確に覚えている。",
    "hiddenConcern": "母の真鍮名札が水路にある。",
    "topics": [
      "名前",
      "救済券",
      "母",
      "公債"
    ]
  },
  {
    "id": "oren",
    "name": "オレン・ミル",
    "shortName": "オレン",
    "role": "噂売り／情報屋",
    "mapId": "ledger_exchange",
    "x": 1160,
    "y": 440,
    "initialTrust": 33,
    "glyph": "耳",
    "palette": [
      "#c28d62",
      "#4f3432",
      "#1f1515"
    ],
    "description": "第一章で噂網に関与。第二章では帳簿街で黒雨の言い回しを売っている。",
    "publicFace": "利益になる話しか売らない。",
    "hiddenConcern": "黒雨の合言葉を注文した人物を知っている。",
    "topics": [
      "噂",
      "市場",
      "合言葉",
      "オレン"
    ]
  },
  {
    "id": "sabra",
    "name": "サブラ・キース",
    "shortName": "サブラ",
    "role": "灰塩公債商",
    "mapId": "ledger_exchange",
    "x": 930,
    "y": 300,
    "initialTrust": 37,
    "glyph": "債",
    "palette": [
      "#dac28a",
      "#4b4130",
      "#17130e"
    ],
    "description": "復興公債を扱う商人。名簿を『被害期待値』と言い換える。",
    "publicFace": "礼儀正しいが、人を数字で見る。",
    "hiddenConcern": "救済名簿を担保計算へ流用した。",
    "topics": [
      "公債",
      "担保",
      "救済名簿",
      "利益"
    ]
  },
  {
    "id": "cyr",
    "name": "キュール・ノックス",
    "shortName": "キュール",
    "role": "鐘楼師／黒鐘調律者",
    "mapId": "bell_foundry",
    "x": 850,
    "y": 350,
    "initialTrust": 42,
    "glyph": "鐘",
    "palette": [
      "#9fb0a2",
      "#3e4b4c",
      "#151b1c"
    ],
    "description": "雨鐘修復師の弟子筋。黒鐘を『音響装置』として作った。",
    "publicFace": "技術者としての自負が強く、責任を表から切り離そうとする。",
    "hiddenConcern": "位相表で改ざん対象を指定できることを知っていた。",
    "topics": [
      "黒鐘",
      "位相",
      "雨音補正器",
      "責任"
    ]
  },
  {
    "id": "goro",
    "name": "ゴロ・バン",
    "shortName": "ゴロ",
    "role": "鋳造工",
    "mapId": "bell_foundry",
    "x": 460,
    "y": 630,
    "initialTrust": 48,
    "glyph": "鋳",
    "palette": [
      "#bb8d63",
      "#5a3d31",
      "#201611"
    ],
    "description": "鐘楼鋳造区の現場職人。黒鐘は災害前に急造されたと知る。",
    "publicFace": "口は悪いが、工賃と日付は正確に覚える。",
    "hiddenConcern": "監査庁予備費による前払いを受けている。",
    "topics": [
      "鋳造",
      "請求書",
      "黒鐘",
      "前払い"
    ]
  },
  {
    "id": "toka",
    "name": "トーカ",
    "shortName": "トーカ",
    "role": "鏡面水路番",
    "mapId": "mirror_underpass",
    "x": 590,
    "y": 720,
    "initialTrust": 45,
    "glyph": "路",
    "palette": [
      "#93b9b8",
      "#31505a",
      "#102024"
    ],
    "description": "公式地図から抜けた地下水路を守る番人。名前を呼ばない慣習を知る。",
    "publicFace": "ぶっきらぼう。証人を守るため情報を小出しにする。",
    "hiddenConcern": "ミラと名前を消された住民を匿っている。",
    "topics": [
      "水路",
      "避難所",
      "名前",
      "ミラ"
    ]
  },
  {
    "id": "maren",
    "name": "マレン・グレイ",
    "shortName": "マレン",
    "role": "監査局長",
    "mapId": "audit_hall",
    "x": 960,
    "y": 350,
    "initialTrust": 31,
    "glyph": "監",
    "palette": [
      "#b4b6aa",
      "#464a4b",
      "#191c1d"
    ],
    "description": "第二帳簿の封印を命じた監査局長。秩序維持を理由に資料公開を止める。",
    "publicFace": "穏やかな官僚口調で、核心だけを制度語に置き換える。",
    "hiddenConcern": "第二帳簿の章番号を知っている。",
    "topics": [
      "監査庁",
      "第二帳簿",
      "封印",
      "市場混乱"
    ]
  },
  {
    "id": "enja",
    "name": "エンジャ・トル",
    "shortName": "エンジャ",
    "role": "臨時評議員",
    "mapId": "tribunal_archive",
    "x": 760,
    "y": 420,
    "initialTrust": 38,
    "glyph": "議",
    "palette": [
      "#c4a96e",
      "#4d4536",
      "#19150f"
    ],
    "description": "閉鎖評議に参加した人物。自分は例外措置を止めようとしたと主張する。",
    "publicFace": "怯えているが、評議院全体を売る覚悟はまだない。",
    "hiddenConcern": "影地図採用の投票片を隠した。",
    "topics": [
      "評議院",
      "影地図",
      "投票",
      "例外措置"
    ]
  },
  {
    "id": "mira",
    "name": "ミラ・サーデ",
    "shortName": "ミラ",
    "role": "失踪した監査官",
    "mapId": "mirror_underpass",
    "x": 1160,
    "y": 520,
    "initialTrust": 72,
    "glyph": "査",
    "palette": [
      "#d0c5a6",
      "#374853",
      "#11181c"
    ],
    "description": "黒雨の予算を追い、鏡面水路へ消えた監査官。救出後、第二帳簿の索引を証言する。",
    "publicFace": "救出前は隠れている。救出後は真相固定の中心になる。",
    "hiddenConcern": "四つの部署を一つの事件番号で結んでいた。",
    "topics": [
      "監査",
      "第二帳簿",
      "事件番号",
      "黒雨"
    ],
    "initialState": "hidden"
  }
];
  H.Data.NPCById = H.Core.Util.toMap(H.Data.NPCs);
})(window.Haimachi);
