(function registerConfig(H) {
  "use strict";

  H.Data.Config = {
  "title": "灰街の巡察官と嘘の地図",
  "chapter": "第二章　黒雨の帳簿",
  "startMap": "map_archive",
  "startPosition": {
    "x": 760,
    "y": 700
  },
  "interactionRange": 76,
  "canvasReference": {
    "width": 1280,
    "height": 720
  },
  "timeSegments": [
    "朝",
    "昼",
    "夕",
    "夜"
  ],
  "mapNodes": {
    "map_archive": [
      20,
      72
    ],
    "east_gate": [
      43,
      57
    ],
    "ledger_exchange": [
      66,
      58
    ],
    "audit_hall": [
      67,
      27
    ],
    "bell_foundry": [
      40,
      25
    ],
    "mirror_underpass": [
      47,
      84
    ],
    "tribunal_archive": [
      84,
      21
    ]
  },
  "mapRoutes": [
    [
      "map_archive",
      "east_gate"
    ],
    [
      "east_gate",
      "ledger_exchange"
    ],
    [
      "ledger_exchange",
      "audit_hall"
    ],
    [
      "east_gate",
      "bell_foundry"
    ],
    [
      "bell_foundry",
      "mirror_underpass"
    ],
    [
      "audit_hall",
      "tribunal_archive"
    ],
    [
      "map_archive",
      "ledger_exchange"
    ]
  ],
  "bestEndingId": "ending2_true_revision",
  "initialUnlockedMaps": [
    "map_archive",
    "east_gate",
    "ledger_exchange"
  ],
  "unsafeMaps": [
    "mirror_underpass"
  ],
  "firstEnterStories": {
    "mirror_underpass": "mirror_underpass_entry",
    "tribunal_archive": "tribunal_entry",
    "bell_foundry": "foundry_entry"
  },
  "difficulty": {
    "story": {
      "label": "物語重視",
      "rumorGrowth": 0.55,
      "trustPenalty": 0.65,
      "combatDamage": 0.7,
      "deadlineDay": null,
      "investigationAssist": 1
    },
    "investigator": {
      "label": "巡察官",
      "rumorGrowth": 1,
      "trustPenalty": 1,
      "combatDamage": 1,
      "deadlineDay": 10,
      "investigationAssist": 0
    },
    "severe": {
      "label": "黒雨の夜",
      "rumorGrowth": 1.42,
      "trustPenalty": 1.28,
      "combatDamage": 1.2,
      "deadlineDay": 8,
      "investigationAssist": -1
    }
  },
  "districts": [
    {
      "id": "archive",
      "name": "地図院",
      "shortName": "地図院",
      "fear": 22,
      "security": 82,
      "trust": 63,
      "rumorPressure": 24,
      "mapIds": [
        "map_archive"
      ],
      "description": "第一章の報告後、採用地図の正当性を問う監査文書が集まる中枢。"
    },
    {
      "id": "east",
      "name": "東区",
      "shortName": "東区",
      "fear": 57,
      "security": 44,
      "trust": 38,
      "rumorPressure": 68,
      "mapIds": [
        "east_gate"
      ],
      "description": "二重門市場と救済券窓口がある地区。黒雨で名前と番地が流れている。"
    },
    {
      "id": "ledger",
      "name": "帳簿街",
      "shortName": "帳簿街",
      "fear": 42,
      "security": 55,
      "trust": 43,
      "rumorPressure": 61,
      "mapIds": [
        "ledger_exchange"
      ],
      "description": "復興公債、灰塩証券、救済費の流れが紙の迷路を作る金融区。"
    },
    {
      "id": "audit",
      "name": "監査庁",
      "shortName": "監査庁",
      "fear": 46,
      "security": 65,
      "trust": 36,
      "rumorPressure": 48,
      "mapIds": [
        "audit_hall",
        "tribunal_archive"
      ],
      "description": "公式記録を検査するはずの庁舎。黒雨の日だけ、封印が増える。"
    },
    {
      "id": "bell",
      "name": "鐘楼鋳造区",
      "shortName": "鋳造区",
      "fear": 50,
      "security": 49,
      "trust": 39,
      "rumorPressure": 66,
      "mapIds": [
        "bell_foundry"
      ],
      "description": "雨鐘と行政封印を鋳る工房街。夜になると鐘ではない雨音が響く。"
    },
    {
      "id": "mirror",
      "name": "鏡面水路",
      "shortName": "水路",
      "fear": 64,
      "security": 29,
      "trust": 28,
      "rumorPressure": 75,
      "mapIds": [
        "mirror_underpass"
      ],
      "description": "公式地図と影地図の線が重なる地下回廊。記録から抜けた人々が隠れている。"
    }
  ],
  "factions": [
    {
      "id": "map_bureau",
      "name": "地図院",
      "shortName": "地図院",
      "influence": 56,
      "pressure": 34,
      "attitude": 8,
      "stance": "conditional_support",
      "description": "公式地図を守る行政組織。第一章の報告品質によって、第二章で協力的にも防衛的にもなる。"
    },
    {
      "id": "citizen_network",
      "name": "証人保護網",
      "shortName": "市民網",
      "influence": 39,
      "pressure": 52,
      "attitude": 4,
      "stance": "fragile_trust",
      "description": "エルド、イネス、東区住民を支える非公式の保護網。証人を守った過去が強い信用になる。"
    },
    {
      "id": "ledger_cartel",
      "name": "灰塩公債商会",
      "shortName": "公債商会",
      "influence": 62,
      "pressure": 31,
      "attitude": -6,
      "stance": "profit_defense",
      "description": "復興公債と救済券の流通を握る商会群。真相公開や取引履歴によって警戒度が変わる。"
    },
    {
      "id": "audit_bureau",
      "name": "監査庁",
      "shortName": "監査庁",
      "influence": 48,
      "pressure": 44,
      "attitude": -2,
      "stance": "self_preservation",
      "description": "本来は記録を検査する庁舎。第一章の公開方針で、協力・妨害・保身の比率が変わる。"
    },
    {
      "id": "bell_foundry",
      "name": "鐘楼鋳造組合",
      "shortName": "鋳造組合",
      "influence": 44,
      "pressure": 46,
      "attitude": -1,
      "stance": "technical_denial",
      "description": "雨鐘と黒鐘を鋳る技術職能。雨鐘修復の有無が、第二章での初期警戒に関係する。"
    },
    {
      "id": "rumor_brokers",
      "name": "噂売りの連絡網",
      "shortName": "噂売り",
      "influence": 35,
      "pressure": 26,
      "attitude": -8,
      "stance": "market_opportunist",
      "description": "情報を売る者たち。第一章の失敗や即時公開を材料に、黒雨の言い回しを増殖させる。"
    }
  ],
  "initialRumors": [
    {
      "id": "r_black_rain",
      "title": "黒雨は天罰",
      "statement": "東区に降る黒い雨は、第一章で灰獣を否定した巡察官への天罰だ。",
      "active": true,
      "intensity": 62,
      "credibility": 54,
      "sources": [
        "市場の公示",
        "雨宿りの群衆"
      ],
      "district": "east",
      "tags": [
        "黒雨",
        "天罰",
        "第一章"
      ]
    },
    {
      "id": "r_eld_lied",
      "title": "エルドは証言を売った",
      "statement": "救出されたエルドは、地図院に買われて第一章の証言を変えた。",
      "active": true,
      "intensity": 51,
      "credibility": 46,
      "sources": [
        "酒場の噂",
        "帳簿街の噂売り"
      ],
      "district": "ledger",
      "tags": [
        "エルド",
        "証言",
        "疑念"
      ]
    },
    {
      "id": "r_double_gate",
      "title": "東区には二つの門がある",
      "statement": "同じ東門を通った者が、別の番地へ到着する。公式地図と影地図が重なっている。",
      "active": true,
      "intensity": 58,
      "credibility": 60,
      "sources": [
        "配達人組合",
        "救済券窓口"
      ],
      "district": "east",
      "tags": [
        "地図",
        "二重門",
        "番地"
      ]
    },
    {
      "id": "r_name_debt",
      "title": "名前が借金になる",
      "statement": "黒雨で名簿から消えた名前は、復興公債の担保へ変わる。",
      "active": false,
      "intensity": 37,
      "credibility": 42,
      "sources": [
        "帳簿街の落書き"
      ],
      "district": "ledger",
      "tags": [
        "名前",
        "公債",
        "担保"
      ]
    },
    {
      "id": "r_black_bell",
      "title": "黒鐘が雨を書き換える",
      "statement": "鋳造区の黒鐘が鳴ると、乾いた帳簿まで濡れて文字が変わる。",
      "active": false,
      "intensity": 34,
      "credibility": 44,
      "sources": [
        "鋳造工の囁き"
      ],
      "district": "bell",
      "tags": [
        "鐘",
        "黒雨",
        "改ざん"
      ]
    }
  ],
  "progression": {
    "xpThresholds": [
      0,
      75,
      185,
      340,
      540,
      780
    ],
    "ranks": [
      "巡察記録官",
      "黒雨監査官",
      "灰線の調停官",
      "認証地図官",
      "街の証人",
      "反転記録官"
    ],
    "levelRewards": {
      "observation": {
        "title": "観察",
        "glyph": "眼",
        "description": "雨で変わった文字、位相のズレ、帳簿の消し跡を見抜く。",
        "bonuses": [
          "調査判定 +1",
          "噂戦で弱点発見",
          "偽装資料の見分け"
        ]
      },
      "empathy": {
        "title": "共感",
        "glyph": "声",
        "description": "名前を消された人々を証人として扱い、保護しながら証言へつなぐ。",
        "bonuses": [
          "信頼獲得量増加",
          "証人保護選択肢",
          "平静回復量増加"
        ]
      },
      "authority": {
        "title": "権限",
        "glyph": "印",
        "description": "監査命令・封印・資料差押えを使い、制度側の壁を開く。",
        "bonuses": [
          "制限区域へ入りやすい",
          "封印回数増加",
          "公開時の混乱抑制"
        ]
      }
    }
  },
  "reportOptions": {
    "cause": [
      {
        "id": "natural_rain",
        "title": "異常気象としての黒雨",
        "detail": "天候由来の災害として記録し、市民避難と物資配布を優先する。"
      },
      {
        "id": "ledger_error",
        "title": "救済帳簿の事務過誤",
        "detail": "名前消失を行政ミスとして処理し、補償で収束させる。"
      },
      {
        "id": "forced_revision",
        "title": "黒雨インクによる強制改ざん",
        "detail": "帳簿と地図を外部から書き換える技術的犯罪として記録する。"
      },
      {
        "id": "debt_map_loop",
        "title": "公債・影地図・黒鐘による記録災害",
        "detail": "救済名簿を担保化し、影地図と黒鐘で存在そのものを書き換えた複合事件として認定する。"
      }
    ],
    "responsible": [
      {
        "id": "maren",
        "title": "監査局長マレン",
        "detail": "第二帳簿の封印と監査妨害の責任を問う。"
      },
      {
        "id": "sabra",
        "title": "公債商サブラ",
        "detail": "救済券と灰塩公債の利益循環を設計した経済責任を問う。"
      },
      {
        "id": "cyr",
        "title": "鐘楼師キュール",
        "detail": "黒鐘と雨音補正器を鋳造・運用した技術責任を問う。"
      },
      {
        "id": "council_ring",
        "title": "閉鎖評議の共同責任",
        "detail": "影地図の承認、黒鐘予算、名簿担保化を一つの政策犯罪として扱う。"
      },
      {
        "id": "shared_network",
        "title": "監査庁・公債商・鐘楼師の連携責任",
        "detail": "実行網を分割し、各担当の役割を明記する。"
      }
    ],
    "policy": [
      {
        "id": "immediate",
        "title": "全資料を即時公開",
        "detail": "第二帳簿、影地図、黒鐘、証人名を同時に公開する。"
      },
      {
        "id": "staged",
        "title": "名前固定後に段階公開",
        "detail": "証人と名簿を保護し、黒鐘を停止してから資料を順序立てて公開する。"
      },
      {
        "id": "audit_decoy",
        "title": "監査囮で証拠保全",
        "detail": "一部だけ公表し、相手の消字行動を誘って第二帳簿を保全する。"
      },
      {
        "id": "sealed",
        "title": "秩序維持を理由に封印",
        "detail": "黒雨を停止させるが、責任主体と公債構造を非公開にする。"
      },
      {
        "id": "bargain",
        "title": "公債市場との取引",
        "detail": "市場混乱を避ける代わりに、一部責任者の辞任で済ませる。"
      }
    ]
  }
};
})(window.Haimachi);
