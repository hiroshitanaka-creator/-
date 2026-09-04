(function registerEnemies(H) {
  "use strict";

  H.Data.Enemies = [
  {
    "id": "black_rain_crowd",
    "name": "黒雨天罰の群衆",
    "subtitle": "第一章の真実を罰として反転させる群衆噂",
    "glyph": "雨",
    "color": "#56606a",
    "glow": "#a8b0ba",
    "maxIntegrity": 86,
    "baseAttack": 10,
    "basePanic": 9,
    "intro": "『灰獣を否定したから黒雨が来た』『あの巡察官が街を怒らせた』――黒い公示の前で、群衆の声が雨粒のように増えていく。",
    "phases": [
      {
        "threshold": 0.52,
        "claim": "第一章の真実が天罰を呼んだ。",
        "weaknessTags": [
          "第一章",
          "黒雨",
          "記録",
          "物質"
        ],
        "resistedTags": [
          "公債",
          "利益"
        ]
      },
      {
        "threshold": 0,
        "claim": "証言者は買われた。救出も地図院の芝居だ。",
        "weaknessTags": [
          "エルド",
          "証言",
          "ミラ",
          "公示"
        ],
        "resistedTags": [
          "鐘"
        ]
      }
    ],
    "attacks": [
      {
        "text": "『巡察官が嘘を広めた』という声が、東区の窓を閉じさせる。",
        "damage": 8,
        "panic": 10
      },
      {
        "text": "黒い雨だれが証拠名をにじませる。",
        "damage": 9,
        "panic": 8
      },
      {
        "text": "救済券を求める列が公債窓口へ押し流される。",
        "damage": 7,
        "panic": 12
      }
    ],
    "observeLines": [
      "天罰説は雨の成分を説明できない。瓶の底に物質的な矛盾がある。",
      "群衆は『誰が得をするか』を避けている。最初は黒雨の性質へ絞る。",
      "第二段階ではエルドやミラの独立証言が効く。"
    ],
    "victory": "天罰ではなく記録改ざんとして説明したことで、東区の怒りは対象を失い、雨宿りの列が一度ほどけた。",
    "defeat": "群衆の声に押され、第一章の報告そのものが疑われる。追加調査で建て直せるが、東区の恐怖は増える。",
    "rewards": {
      "xp": 28,
      "trust": 3,
      "rumorReduction": 8
    },
    "effects": [
      {
        "type": "district",
        "id": "east",
        "path": "fear",
        "value": -6
      },
      {
        "type": "rumor",
        "id": "r_black_rain",
        "path": "intensity",
        "value": -10
      },
      {
        "type": "questEvaluate"
      }
    ]
  },
  {
    "id": "interest_moth",
    "name": "利息蛾",
    "subtitle": "救済名簿の空白から湧く、利回りの怪異",
    "glyph": "利",
    "color": "#8b7445",
    "glow": "#e1c178",
    "maxIntegrity": 112,
    "baseAttack": 10,
    "basePanic": 9,
    "intro": "帳簿の空白から紙の蛾が舞う。羽には世帯番号だけが残り、名前はない。『名前ではない、期待損失だ』と囁く。",
    "phases": [
      {
        "threshold": 0.55,
        "claim": "市場は名前を見ていない。番号だけを扱う。",
        "weaknessTags": [
          "名前",
          "担保",
          "救済",
          "徴税"
        ],
        "resistedTags": [
          "鐘"
        ]
      },
      {
        "threshold": 0,
        "claim": "災害が大きいほど、救済も大きくなる。だから利益は罪ではない。",
        "weaknessTags": [
          "公債",
          "利益",
          "循環",
          "予算"
        ],
        "resistedTags": [
          "黒雨"
        ]
      }
    ],
    "attacks": [
      {
        "text": "羽が救済欄を削り、世帯番号だけが残る。",
        "damage": 9,
        "panic": 9
      },
      {
        "text": "利回り表が住民の声より大きく広がる。",
        "damage": 10,
        "panic": 8
      },
      {
        "text": "『市場混乱』という語が証人の名前を覆う。",
        "damage": 8,
        "panic": 12
      }
    ],
    "observeLines": [
      "第一段階は『名前ではない』と言い張る。徴税名簿やリオの証言が効く。",
      "第二段階は利益の正当化。流向表や公債証書で循環を示す。",
      "同じ帳簿だけでなく、人間の証言を入れると削りやすい。"
    ],
    "victory": "番号へ変えられた名前を、救済権利として読み直した。利息蛾は乾いた粉へ戻り、公債窓口の列が止まる。",
    "defeat": "名前を数字へ戻され、証人の不安が増す。帳簿街での信用が下がった。",
    "rewards": {
      "xp": 34,
      "trust": 2,
      "rumorReduction": 9
    },
    "effects": [
      {
        "type": "district",
        "id": "ledger",
        "path": "fear",
        "value": -5
      },
      {
        "type": "rumor",
        "id": "r_name_debt",
        "path": "intensity",
        "value": -9
      },
      {
        "type": "questEvaluate"
      }
    ]
  },
  {
    "id": "black_bell_echo",
    "name": "黒鐘の反響",
    "subtitle": "記録紙の灰塩を震わせる、三拍の逆相音",
    "glyph": "鐘",
    "color": "#745b59",
    "glow": "#d99a8a",
    "maxIntegrity": 136,
    "baseAttack": 10,
    "basePanic": 9,
    "intro": "黒鐘が鳴る。音は耳ではなく証拠カードの文字に響く。第一拍で地図、第二拍で名簿、第三拍で公示が濡れる。",
    "phases": [
      {
        "threshold": 0.66,
        "claim": "私は災害を止める鐘だ。",
        "weaknessTags": [
          "事前準備",
          "請求書",
          "黒鐘",
          "予算"
        ],
        "resistedTags": [
          "名前"
        ]
      },
      {
        "threshold": 0.32,
        "claim": "音は誰の名も選ばない。責任は位相表にある。",
        "weaknessTags": [
          "位相",
          "名簿",
          "地図",
          "黒雨"
        ],
        "resistedTags": [
          "公債"
        ]
      },
      {
        "threshold": 0,
        "claim": "鐘を止めれば、市民は黒雨の説明を失う。",
        "weaknessTags": [
          "証人保護",
          "公開順序",
          "全体像",
          "ミラ"
        ],
        "resistedTags": [
          "偽装"
        ]
      }
    ],
    "attacks": [
      {
        "text": "三拍の反響が、報告書の欄を入れ替える。",
        "damage": 11,
        "panic": 10
      },
      {
        "text": "黒銅粉が舞い、証拠の輪郭を鈍らせる。",
        "damage": 10,
        "panic": 12
      },
      {
        "text": "『止めたら混乱する』という行政語が心を重くする。",
        "damage": 12,
        "panic": 9
      }
    ],
    "observeLines": [
      "最初は請求書と発注時刻。鐘が災害後の対策ではないと示す。",
      "次は位相表。鐘音が対象を指定していたことを固定する。",
      "最後は止め方。名前固定や段階公開の準備があれば押し切れる。"
    ],
    "victory": "黒鐘の三拍を、地図・名簿・公示の順に分解した。鐘は災害対策の顔を失い、黒雨の追加発生が止まる。",
    "defeat": "鐘音に押され、記録が一時的に濡れ直す。鋳造区での噂圧が増した。",
    "rewards": {
      "xp": 44,
      "trust": 4,
      "rumorReduction": 12
    },
    "effects": [
      {
        "type": "flag",
        "id": "black_bell_silenced",
        "value": true
      },
      {
        "type": "district",
        "id": "bell",
        "path": "fear",
        "value": -8
      },
      {
        "type": "rumor",
        "id": "r_black_bell",
        "path": "intensity",
        "value": -16
      },
      {
        "type": "questEvaluate"
      },
      {
        "type": "story",
        "id": "bell_silenced"
      }
    ]
  },
  {
    "id": "mirror_registry",
    "name": "鏡面名簿",
    "subtitle": "紙から消えた名前を、水面に番号だけで映す記録怪異",
    "glyph": "名",
    "color": "#5b8c8a",
    "glow": "#a8d9d5",
    "maxIntegrity": 160,
    "baseAttack": 10,
    "basePanic": 9,
    "intro": "水面に名簿が開く。そこには人名がない。番地、負債、期待損失、証人番号だけが映り、ミラの声が奥で切れる。",
    "phases": [
      {
        "threshold": 0.62,
        "claim": "紙に名がない者は、証人ではない。",
        "weaknessTags": [
          "名前",
          "真鍮",
          "避難所",
          "証人保護"
        ],
        "resistedTags": [
          "公債"
        ]
      },
      {
        "threshold": 0.34,
        "claim": "監査官ミラは失踪し、資料も存在しない。",
        "weaknessTags": [
          "ミラ",
          "水路",
          "第二帳簿",
          "背表紙"
        ],
        "resistedTags": [
          "噂"
        ]
      },
      {
        "threshold": 0,
        "claim": "全体像を公開すれば、消えた者から先に壊れる。",
        "weaknessTags": [
          "公開順序",
          "全体像",
          "事件番号",
          "段階公開"
        ],
        "resistedTags": [
          "黒雨"
        ]
      }
    ],
    "attacks": [
      {
        "text": "水面が名前を番号へ置き換え、証言の重さを奪う。",
        "damage": 12,
        "panic": 9
      },
      {
        "text": "背表紙だけが濡れ、中身の存在を否定しようとする。",
        "damage": 11,
        "panic": 12
      },
      {
        "text": "『守るために封印する』という言葉が、あなたの判断を遅らせる。",
        "damage": 13,
        "panic": 10
      }
    ],
    "observeLines": [
      "第一段階では名前の物理固定が有効。真鍮札と避難所の印を示す。",
      "第二段階ではミラの道筋と第二帳簿の背表紙を示す。",
      "最後は公開順序。真相を出す前に人を残す設計を提示する。"
    ],
    "victory": "鏡面名簿は、番号ではなく名前を映し直した。水路奥の封印が解け、監査官ミラが資料を抱えて立ち上がる。",
    "defeat": "名簿に押し返され、ミラの位置がまた曖昧になる。水路で証拠を積み直す必要がある。",
    "rewards": {
      "xp": 58,
      "trust": 6,
      "rumorReduction": 14
    },
    "effects": [
      {
        "type": "flag",
        "id": "mira_rescued",
        "value": true
      },
      {
        "type": "npcState",
        "id": "mira",
        "path": "state",
        "value": "available"
      },
      {
        "type": "npcMove",
        "id": "mira",
        "mapId": "mirror_underpass",
        "x": 1160,
        "y": 520
      },
      {
        "type": "district",
        "id": "mirror",
        "path": "fear",
        "value": -12
      },
      {
        "type": "world",
        "path": "publicTrust",
        "value": 3
      },
      {
        "type": "story",
        "id": "mira_rescue"
      },
      {
        "type": "questEvaluate"
      }
    ]
  }
];
  H.Data.EnemyById = H.Core.Util.toMap(H.Data.Enemies);
})(window.Haimachi);
