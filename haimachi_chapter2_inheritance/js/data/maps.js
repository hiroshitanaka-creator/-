(function registerMaps(H) {
  "use strict";

  H.Data.Maps = {
  "map_archive": {
    "id": "map_archive",
    "name": "地図院・第二監査室",
    "district": "archive",
    "flavor": "第一章の採用地図に黒い雨跡が増えている。ここで第二章の記録が始まる。",
    "width": 1600,
    "height": 1020,
    "spawn": {
      "x": 760,
      "y": 700
    },
    "initialUnlocked": true,
    "colors": {
      "ground": "#30383b",
      "road": "#59605c",
      "wall": "#171d20",
      "accent": "#caa256",
      "fog": "#76858a"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1600,
        "h": 1020,
        "type": "stone"
      },
      {
        "x": 640.0,
        "y": 0,
        "w": 320,
        "h": 1020,
        "type": "road"
      },
      {
        "x": 0,
        "y": 370.0,
        "w": 1600,
        "h": 280,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1600,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 930,
        "w": 1600,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1020,
        "kind": "wall"
      },
      {
        "x": 1510,
        "y": 0,
        "w": 90,
        "h": 1020,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "shelf",
        "label": "封印庫"
      },
      {
        "x": 1090,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "shelf",
        "label": "記録棚"
      },
      {
        "x": 560.0,
        "y": 390.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "rug",
        "x": 610,
        "y": 600,
        "w": 360,
        "h": 260
      },
      {
        "type": "mapTable",
        "x": 800,
        "y": 470,
        "w": 430,
        "h": 100
      },
      {
        "type": "paperStack",
        "x": 430,
        "y": 470,
        "count": 8
      },
      {
        "type": "banner",
        "x": 800,
        "y": 116,
        "text": "第二監査：黒雨は記録へ落ちる"
      }
    ],
    "exits": [
      {
        "id": "ex_archive_east",
        "x": 790,
        "y": 930,
        "radius": 86,
        "targetMap": "east_gate",
        "targetX": 220,
        "targetY": 690,
        "prompt": "東区・二重門市場へ向かう",
        "label": "東区"
      },
      {
        "id": "ex_archive_ledger",
        "x": 1320,
        "y": 520,
        "radius": 86,
        "targetMap": "ledger_exchange",
        "targetX": 220,
        "targetY": 640,
        "prompt": "帳簿街・公債取引所へ向かう",
        "label": "帳簿街"
      },
      {
        "id": "ex_archive_audit",
        "x": 1260,
        "y": 880,
        "radius": 86,
        "targetMap": "audit_hall",
        "targetX": 240,
        "targetY": 650,
        "prompt": "監査庁へ向かう",
        "label": "監査庁",
        "condition": {
          "type": "mapUnlocked",
          "id": "audit_hall"
        }
      }
    ],
    "hotspots": [
      {
        "id": "hs_archive_report",
        "x": 980,
        "y": 470,
        "radius": 82,
        "title": "正式報告卓",
        "prompt": "第二章の報告書を書く",
        "description": "第二章の全体像を街の公式記録へ固定する卓。",
        "visual": "seal",
        "actions": [
          {
            "id": "open",
            "label": "正式報告へ進む",
            "detail": "正式報告へ進む",
            "timeCost": 0,
            "successText": "地図院印が温まる。黒雨をどう記録するか、街へ残す言葉を選ぶ。",
            "effects": [
              {
                "type": "openReport"
              }
            ],
            "repeatable": true
          }
        ],
        "condition": {
          "type": "flag",
          "id": "report_unlocked"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_archive_revision_shelf",
        "x": 370,
        "y": 320,
        "radius": 78,
        "title": "採用地図の滲み",
        "prompt": "第一章の採用地図を再検査する",
        "description": "第一章で正しい線を引いたはずの地図に、後から黒い補助線が浮いている。",
        "visual": "map",
        "actions": [
          {
            "id": "trace",
            "label": "黒い補助線を写す",
            "detail": "黒い補助線を写す",
            "timeCost": 1,
            "successText": "採用後の地図だけが濡れている。第一章の真実を否定せず、上書き利用するための線だ。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_true_map_copy"
              },
              {
                "type": "xp",
                "value": 12
              },
              {
                "type": "questEvaluate"
              }
            ],
            "stat": "observation",
            "threshold": 1
          }
        ],
        "condition": {
          "type": "flag",
          "id": "field_kit_received"
        }
      }
    ],
    "encounters": []
  },
  "east_gate": {
    "id": "east_gate",
    "name": "東区・二重門市場",
    "district": "east",
    "flavor": "雨宿りの群衆が同じ門から違う窓口へ流されている。",
    "width": 1980,
    "height": 1340,
    "spawn": {
      "x": 220,
      "y": 690
    },
    "initialUnlocked": true,
    "colors": {
      "ground": "#3b3f3d",
      "road": "#65645c",
      "wall": "#252a2b",
      "accent": "#a07b43",
      "fog": "#7f8581"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1980,
        "h": 1340,
        "type": "stone"
      },
      {
        "x": 830.0,
        "y": 0,
        "w": 320,
        "h": 1340,
        "type": "road"
      },
      {
        "x": 0,
        "y": 530.0,
        "w": 1980,
        "h": 280,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1980,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 1250,
        "w": 1980,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1340,
        "kind": "wall"
      },
      {
        "x": 1890,
        "y": 0,
        "w": 90,
        "h": 1340,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "stall",
        "label": "封印庫"
      },
      {
        "x": 1470,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "stall",
        "label": "記録棚"
      },
      {
        "x": 750.0,
        "y": 550.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "crowd",
        "x": 1510,
        "y": 660,
        "count": 9
      },
      {
        "type": "posterWall",
        "x": 1300,
        "y": 330,
        "count": 6
      },
      {
        "type": "lamp",
        "x": 520,
        "y": 520,
        "radius": 110
      },
      {
        "type": "banner",
        "x": 990,
        "y": 110,
        "text": "黒雨避難券・臨時配布"
      }
    ],
    "exits": [
      {
        "id": "ex_east_archive",
        "x": 100,
        "y": 690,
        "radius": 86,
        "targetMap": "map_archive",
        "targetX": 820,
        "targetY": 880,
        "prompt": "地図院へ戻る",
        "label": "地図院"
      },
      {
        "id": "ex_east_ledger",
        "x": 1880,
        "y": 690,
        "radius": 86,
        "targetMap": "ledger_exchange",
        "targetX": 230,
        "targetY": 650,
        "prompt": "帳簿街へ進む",
        "label": "帳簿街"
      },
      {
        "id": "ex_east_bell",
        "x": 990,
        "y": 90,
        "radius": 86,
        "targetMap": "bell_foundry",
        "targetX": 760,
        "targetY": 1060,
        "prompt": "鐘楼鋳造区へ向かう",
        "label": "鋳造区",
        "condition": {
          "type": "mapUnlocked",
          "id": "bell_foundry"
        }
      }
    ],
    "hotspots": [
      {
        "id": "hs_east_black_rain",
        "x": 420,
        "y": 440,
        "radius": 78,
        "title": "黒い雨樋",
        "prompt": "黒雨を採取する",
        "description": "雨樋の水は空からではなく、貼られた公示の裏から滲んでいる。",
        "visual": "water",
        "actions": [
          {
            "id": "sample",
            "label": "黒雨を瓶に採る",
            "detail": "黒雨を瓶に採る",
            "timeCost": 1,
            "successText": "瓶の底に灰塩と鏡墨が分離した。自然雨ではない。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_black_rain_sample"
              },
              {
                "type": "xp",
                "value": 18
              },
              {
                "type": "questEvaluate"
              }
            ],
            "stat": "observation",
            "threshold": 1
          }
        ]
      },
      {
        "id": "hs_east_ledger_booth",
        "x": 890,
        "y": 430,
        "radius": 78,
        "title": "救済券窓口",
        "prompt": "救済帳簿を調べる",
        "description": "乾いた室内の帳簿に、特定の世帯名だけ黒く濡れた行がある。",
        "visual": "documents",
        "actions": [
          {
            "id": "read",
            "label": "濡れた救済帳簿を保全する",
            "detail": "濡れた救済帳簿を保全する",
            "timeCost": 1,
            "successText": "救済者の名前が、債務欄へ流れている。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_wet_ledger_page"
              },
              {
                "type": "evidence",
                "id": "e_erased_tax_roll"
              },
              {
                "type": "rumorActivate",
                "id": "r_name_debt",
                "value": true,
                "intensity": 50
              },
              {
                "type": "xp",
                "value": 24
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_east_notice",
        "x": 1340,
        "y": 380,
        "radius": 78,
        "title": "二枚の公示板",
        "prompt": "同時刻の公示を比較する",
        "description": "同時刻・同じ押印の公示が、異なる避難線を指している。",
        "visual": "paper",
        "actions": [
          {
            "id": "compare",
            "label": "押印と紙質を比較する",
            "detail": "押印と紙質を比較する",
            "timeCost": 1,
            "successText": "二枚とも押印は本物。だが片方だけ影地図の番地を使っている。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_duplicate_notice"
              },
              {
                "type": "xp",
                "value": 15
              },
              {
                "type": "questEvaluate"
              }
            ],
            "stat": "observation",
            "threshold": 1
          }
        ]
      },
      {
        "id": "hs_east_gate_map",
        "x": 1020,
        "y": 790,
        "radius": 78,
        "title": "門番小屋の壁地図",
        "prompt": "二重門の地図を写す",
        "description": "門番の壁には公式地図と配達人の影地図が重ね貼りされている。",
        "visual": "map",
        "actions": [
          {
            "id": "copy",
            "label": "東区二重門の差を記録する",
            "detail": "東区二重門の差を記録する",
            "timeCost": 1,
            "successText": "同じ門が、救済窓口と公債窓口へ別々に到着するよう描かれている。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_double_gate_map"
              },
              {
                "type": "xp",
                "value": 22
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_east_budget_tag",
        "x": 1540,
        "y": 940,
        "radius": 78,
        "title": "会計木箱",
        "prompt": "付替タグを探す",
        "description": "排水補修の箱に、黒鐘材料費へ付け替えたタグが残る。",
        "visual": "documents",
        "actions": [
          {
            "id": "take",
            "label": "排水路補修費の付替タグを記録する",
            "detail": "排水路補修費の付替タグを記録する",
            "timeCost": 1,
            "successText": "黒雨を防ぐはずの排水予算が、黒鐘の鋳造費へ回されていた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_drainage_budget_tag"
              },
              {
                "type": "xp",
                "value": 12
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_budget_flow_table"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": [
      {
        "id": "enc_east_crowd",
        "x": 1510,
        "y": 660,
        "radius": 110,
        "enemyId": "black_rain_crowd",
        "prompt": "黒雨を天罰と叫ぶ群衆に対峙する",
        "condition": {
          "not": {
            "type": "encounterCleared",
            "id": "enc_east_crowd"
          }
        }
      }
    ]
  },
  "ledger_exchange": {
    "id": "ledger_exchange",
    "name": "帳簿街・灰塩公債取引所",
    "district": "ledger",
    "flavor": "数字は乾いている。乾いているからこそ、人の名前より長く残る。",
    "width": 1900,
    "height": 1260,
    "spawn": {
      "x": 230,
      "y": 650
    },
    "initialUnlocked": true,
    "colors": {
      "ground": "#3f3c37",
      "road": "#655c50",
      "wall": "#25211d",
      "accent": "#d0aa5f",
      "fog": "#877e70"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1900,
        "h": 1260,
        "type": "stone"
      },
      {
        "x": 790.0,
        "y": 0,
        "w": 320,
        "h": 1260,
        "type": "road"
      },
      {
        "x": 0,
        "y": 490.0,
        "w": 1900,
        "h": 280,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1900,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 1170,
        "w": 1900,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1260,
        "kind": "wall"
      },
      {
        "x": 1810,
        "y": 0,
        "w": 90,
        "h": 1260,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "desk",
        "label": "封印庫"
      },
      {
        "x": 1390,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "desk",
        "label": "記録棚"
      },
      {
        "x": 710.0,
        "y": 510.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "paperStack",
        "x": 690,
        "y": 390,
        "count": 9
      },
      {
        "type": "paperStack",
        "x": 1120,
        "y": 660,
        "count": 10
      },
      {
        "type": "banner",
        "x": 950,
        "y": 100,
        "text": "救済は数字へ、数字は利息へ"
      },
      {
        "type": "crowd",
        "x": 1380,
        "y": 1010,
        "count": 6
      }
    ],
    "exits": [
      {
        "id": "ex_ledger_east",
        "x": 90,
        "y": 650,
        "radius": 86,
        "targetMap": "east_gate",
        "targetX": 1800,
        "targetY": 690,
        "prompt": "東区へ戻る",
        "label": "東区"
      },
      {
        "id": "ex_ledger_archive",
        "x": 280,
        "y": 1120,
        "radius": 86,
        "targetMap": "map_archive",
        "targetX": 1240,
        "targetY": 840,
        "prompt": "地図院へ戻る",
        "label": "地図院"
      },
      {
        "id": "ex_ledger_audit",
        "x": 1810,
        "y": 360,
        "radius": 86,
        "targetMap": "audit_hall",
        "targetX": 240,
        "targetY": 650,
        "prompt": "監査庁へ向かう",
        "label": "監査庁",
        "condition": {
          "type": "mapUnlocked",
          "id": "audit_hall"
        }
      }
    ],
    "hotspots": [
      {
        "id": "hs_ledger_bonds",
        "x": 520,
        "y": 420,
        "radius": 78,
        "title": "灰塩復興公債窓口",
        "prompt": "公債証書を確認する",
        "description": "災害が続くほど利回りが上がる奇妙な復興債。",
        "visual": "documents",
        "actions": [
          {
            "id": "copy",
            "label": "灰塩復興公債を写す",
            "detail": "灰塩復興公債を写す",
            "timeCost": 1,
            "successText": "被害対象名簿が増えるほど利回りが上がる。救済と投資が同じ紙に乗っている。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_gray_bond_certificate"
              },
              {
                "type": "xp",
                "value": 20
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_ledger_budget",
        "x": 950,
        "y": 620,
        "radius": 78,
        "title": "流向表の計算卓",
        "prompt": "復興予算の流れを見る",
        "description": "救済費、封印費、黒鐘補正費が同じ三者へ循環している。",
        "visual": "documents",
        "actions": [
          {
            "id": "trace",
            "label": "予算の循環を線で追う",
            "detail": "予算の循環を線で追う",
            "timeCost": 1,
            "successText": "黒雨対策費が、黒雨を継続させる装置と市場へ戻っている。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_budget_flow_table"
              },
              {
                "type": "mapUnlock",
                "id": "bell_foundry"
              },
              {
                "type": "xp",
                "value": 26
              },
              {
                "type": "questEvaluate"
              }
            ],
            "stat": "observation",
            "threshold": 1
          }
        ]
      },
      {
        "id": "hs_ledger_ink_receipt",
        "x": 1250,
        "y": 360,
        "radius": 78,
        "title": "顔料商の領収書束",
        "prompt": "鏡墨の領収書を探す",
        "description": "複写防止用の顔料が監査庁名義で購入され、鋳造区へ納品されている。",
        "visual": "paper",
        "actions": [
          {
            "id": "take",
            "label": "鏡墨の領収書を回収する",
            "detail": "鏡墨の領収書を回収する",
            "timeCost": 1,
            "successText": "記録を守る顔料が、黒雨の材料へ転用された。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_mirror_ink_receipt"
              },
              {
                "type": "xp",
                "value": 18
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_black_rain_sample"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_ledger_seal",
        "x": 1520,
        "y": 760,
        "radius": 78,
        "title": "裏封筒の封印",
        "prompt": "複製封印を調べる",
        "description": "監査庁の封印に見えるが、鐘楼の黒銅粉が縁に残る。",
        "visual": "seal",
        "actions": [
          {
            "id": "inspect",
            "label": "複製封印を記録する",
            "detail": "複製封印を記録する",
            "timeCost": 1,
            "successText": "資料移送を合法に見せるための封印だ。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_counterfeit_seal"
              },
              {
                "type": "xp",
                "value": 16
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_mirror_ink_receipt"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": [
      {
        "id": "enc_interest_moth",
        "x": 1380,
        "y": 1010,
        "radius": 110,
        "enemyId": "interest_moth",
        "prompt": "利息を食う蛾に対峙する",
        "condition": {
          "all": [
            {
              "type": "deduction",
              "id": "d2_names_erased_for_collateral"
            },
            {
              "not": {
                "type": "encounterCleared",
                "id": "enc_interest_moth"
              }
            }
          ]
        }
      }
    ]
  },
  "audit_hall": {
    "id": "audit_hall",
    "name": "監査庁・黒雨庁舎",
    "district": "audit",
    "flavor": "公開を管理する庁舎ほど、読めない資料が増えている。",
    "width": 1720,
    "height": 1120,
    "spawn": {
      "x": 240,
      "y": 650
    },
    "initialUnlocked": true,
    "colors": {
      "ground": "#363a3d",
      "road": "#5c6265",
      "wall": "#202426",
      "accent": "#93a2a5",
      "fog": "#7b8587"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1720,
        "h": 1120,
        "type": "stone"
      },
      {
        "x": 700.0,
        "y": 0,
        "w": 320,
        "h": 1120,
        "type": "road"
      },
      {
        "x": 0,
        "y": 420.0,
        "w": 1720,
        "h": 280,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1720,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 1030,
        "w": 1720,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1120,
        "kind": "wall"
      },
      {
        "x": 1630,
        "y": 0,
        "w": 90,
        "h": 1120,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "desk",
        "label": "封印庫"
      },
      {
        "x": 1210,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "desk",
        "label": "記録棚"
      },
      {
        "x": 620.0,
        "y": 440.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "paperStack",
        "x": 510,
        "y": 330,
        "count": 8
      },
      {
        "type": "lamp",
        "x": 930,
        "y": 500,
        "radius": 140
      },
      {
        "type": "banner",
        "x": 860,
        "y": 105,
        "text": "公開は管理である"
      }
    ],
    "exits": [
      {
        "id": "ex_audit_ledger",
        "x": 90,
        "y": 650,
        "radius": 86,
        "targetMap": "ledger_exchange",
        "targetX": 1760,
        "targetY": 360,
        "prompt": "帳簿街へ戻る",
        "label": "帳簿街"
      },
      {
        "id": "ex_audit_archive",
        "x": 290,
        "y": 1010,
        "radius": 86,
        "targetMap": "map_archive",
        "targetX": 1250,
        "targetY": 850,
        "prompt": "地図院へ戻る",
        "label": "地図院"
      },
      {
        "id": "ex_audit_tribunal",
        "x": 1620,
        "y": 230,
        "radius": 86,
        "targetMap": "tribunal_archive",
        "targetX": 200,
        "targetY": 600,
        "prompt": "臨時評議院へ入る",
        "label": "評議院",
        "condition": {
          "type": "mapUnlocked",
          "id": "tribunal_archive"
        }
      }
    ],
    "hotspots": [
      {
        "id": "hs_audit_mira_note",
        "x": 440,
        "y": 360,
        "radius": 78,
        "title": "ミラの下書き箱",
        "prompt": "失踪監査官の書付を探す",
        "description": "監査官ミラが最後に触れた下書き箱。黒雨の日だけ鍵が温かい。",
        "visual": "documents",
        "actions": [
          {
            "id": "open",
            "label": "ミラの最後の書付を保全する",
            "detail": "ミラの最後の書付を保全する",
            "timeCost": 1,
            "successText": "『雨ではなく利息を追え』。短いメモが、調査の軸を変える。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_mira_last_note"
              },
              {
                "type": "xp",
                "value": 24
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_audit_shadow_key",
        "x": 910,
        "y": 520,
        "radius": 78,
        "title": "図面棚の対応表",
        "prompt": "影地図の対応鍵を探す",
        "description": "公式区画番号と影地図番号を結ぶ表が、封印されず棚に残っている。",
        "visual": "map",
        "actions": [
          {
            "id": "copy",
            "label": "影地図の対応鍵を写す",
            "detail": "影地図の対応鍵を写す",
            "timeCost": 1,
            "successText": "住所を二つに割れば、権利と債務を別々に歩かせられる。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_shadow_map_key"
              },
              {
                "type": "xp",
                "value": 26
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_double_gate_map"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_audit_second_index",
        "x": 1260,
        "y": 750,
        "radius": 78,
        "title": "封印済み索引棚",
        "prompt": "第二帳簿の索引番号を照合する",
        "description": "第二帳簿の本体はないが、背表紙番号と合う空欄がある。",
        "visual": "documents",
        "actions": [
          {
            "id": "mark",
            "label": "欠番を記録する",
            "detail": "欠番を記録する",
            "timeCost": 1,
            "successText": "第二帳簿は存在する。中身と背表紙を分けて運んだ形跡がある。",
            "effects": [
              {
                "type": "xp",
                "value": 12
              },
              {
                "type": "flag",
                "id": "second_ledger_shelf_marked",
                "value": true
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "t_maren_deny"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": []
  },
  "bell_foundry": {
    "id": "bell_foundry",
    "name": "鐘楼鋳造区・黒鐘炉",
    "district": "bell",
    "flavor": "黒鐘は雨を止めない。採用済みの事実を逆相で震わせる。",
    "width": 1760,
    "height": 1180,
    "spawn": {
      "x": 760,
      "y": 1060
    },
    "initialUnlocked": false,
    "colors": {
      "ground": "#3e3733",
      "road": "#5e534b",
      "wall": "#221b18",
      "accent": "#bd7c53",
      "fog": "#806f69"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1760,
        "h": 1180,
        "type": "stone"
      },
      {
        "x": 720.0,
        "y": 0,
        "w": 320,
        "h": 1180,
        "type": "road"
      },
      {
        "x": 0,
        "y": 450.0,
        "w": 1760,
        "h": 280,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1760,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 1090,
        "w": 1760,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1180,
        "kind": "wall"
      },
      {
        "x": 1670,
        "y": 0,
        "w": 90,
        "h": 1180,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "bell",
        "label": "封印庫"
      },
      {
        "x": 1250,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "bell",
        "label": "記録棚"
      },
      {
        "x": 640.0,
        "y": 470.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "bell",
        "x": 1430,
        "y": 310,
        "radius": 112
      },
      {
        "type": "lamp",
        "x": 520,
        "y": 530,
        "radius": 120
      },
      {
        "type": "crystal",
        "x": 1230,
        "y": 840,
        "radius": 70
      },
      {
        "type": "banner",
        "x": 880,
        "y": 110,
        "text": "鐘は雨を止めるために鳴るとは限らない"
      }
    ],
    "exits": [
      {
        "id": "ex_bell_east",
        "x": 880,
        "y": 1090,
        "radius": 86,
        "targetMap": "east_gate",
        "targetX": 990,
        "targetY": 160,
        "prompt": "東区へ戻る",
        "label": "東区"
      },
      {
        "id": "ex_bell_mirror",
        "x": 1660,
        "y": 590,
        "radius": 86,
        "targetMap": "mirror_underpass",
        "targetX": 230,
        "targetY": 760,
        "prompt": "鏡面水路へ降りる",
        "label": "水路",
        "condition": {
          "type": "mapUnlocked",
          "id": "mirror_underpass"
        }
      }
    ],
    "hotspots": [
      {
        "id": "hs_bell_mold",
        "x": 480,
        "y": 420,
        "radius": 78,
        "title": "廃材山の鋳型片",
        "prompt": "黒鐘の鋳型を探す",
        "description": "第一章の雨鐘紋に似ているが、左右が反転している。",
        "visual": "bell",
        "actions": [
          {
            "id": "take",
            "label": "黒鐘の鋳型片を回収する",
            "detail": "黒鐘の鋳型片を回収する",
            "timeCost": 1,
            "successText": "正しい基準音ではなく、既存記録を逆相で震わせる紋様だ。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_bell_mold_shard"
              },
              {
                "type": "xp",
                "value": 22
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_bell_invoice",
        "x": 880,
        "y": 680,
        "radius": 78,
        "title": "会計棚の請求書",
        "prompt": "雨音補正器の請求書を探す",
        "description": "対策装置は黒雨発生より二日前に発注されている。",
        "visual": "documents",
        "actions": [
          {
            "id": "copy",
            "label": "請求書を写す",
            "detail": "請求書を写す",
            "timeCost": 1,
            "successText": "災害対策より災害装置の方が先に来ていた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_resonance_invoice"
              },
              {
                "type": "xp",
                "value": 18
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_budget_flow_table"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_bell_residue",
        "x": 1180,
        "y": 470,
        "radius": 78,
        "title": "黒鐘の鐘舌",
        "prompt": "灰銅粉を採取する",
        "description": "鐘舌を拭うと、黒雨と同じ金属粉が付く。",
        "visual": "material",
        "actions": [
          {
            "id": "sample",
            "label": "灰銅粉を採る",
            "detail": "灰銅粉を採る",
            "timeCost": 1,
            "successText": "鐘音が紙中の灰塩を震わせ、黒雨を発生させていた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_black_bell_residue"
              },
              {
                "type": "xp",
                "value": 20
              },
              {
                "type": "questEvaluate"
              }
            ],
            "stat": "observation",
            "threshold": 1
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_black_rain_sample"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_bell_phase",
        "x": 1370,
        "y": 760,
        "radius": 78,
        "title": "調律台の位相表",
        "prompt": "鐘音位相表を読む",
        "description": "三拍の鐘が地図、名簿、公示の順に記録を濡らす。",
        "visual": "documents",
        "actions": [
          {
            "id": "read",
            "label": "鐘音位相表を保全する",
            "detail": "鐘音位相表を保全する",
            "timeCost": 1,
            "successText": "黒鐘は誰の名前を濡らすかまで指定していた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_phase_chart"
              },
              {
                "type": "xp",
                "value": 30
              },
              {
                "type": "questEvaluate"
              }
            ],
            "stat": "observation",
            "threshold": 2
          }
        ],
        "condition": {
          "any": [
            {
              "type": "evidence",
              "id": "e_black_bell_residue"
            },
            {
              "type": "evidence",
              "id": "t_goro_bell_commission"
            }
          ]
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": [
      {
        "id": "enc_black_bell",
        "x": 1430,
        "y": 310,
        "radius": 116,
        "enemyId": "black_bell_echo",
        "prompt": "黒鐘の反響に対峙する",
        "condition": {
          "all": [
            {
              "type": "deduction",
              "id": "d2_bell_foundry_amplifies_revision"
            },
            {
              "not": {
                "type": "encounterCleared",
                "id": "enc_black_bell"
              }
            }
          ]
        }
      }
    ]
  },
  "mirror_underpass": {
    "id": "mirror_underpass",
    "name": "鏡面水路・複写回廊",
    "district": "mirror",
    "flavor": "水面に映る地図だけが、消えた名前の行き先を覚えている。",
    "width": 2200,
    "height": 1460,
    "spawn": {
      "x": 230,
      "y": 760
    },
    "initialUnlocked": false,
    "colors": {
      "ground": "#242d2f",
      "road": "#3e5153",
      "wall": "#11191b",
      "accent": "#9cc3bd",
      "fog": "#6e9792"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 2200,
        "h": 1460,
        "type": "waterChannel"
      },
      {
        "x": 180,
        "y": 250,
        "w": 1840,
        "h": 190,
        "type": "stone"
      },
      {
        "x": 180,
        "y": 590,
        "w": 1840,
        "h": 210,
        "type": "stone"
      },
      {
        "x": 180,
        "y": 1030,
        "w": 1840,
        "h": 210,
        "type": "stone"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 2200,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 1370,
        "w": 2200,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1460,
        "kind": "wall"
      },
      {
        "x": 2110,
        "y": 0,
        "w": 90,
        "h": 1460,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "pipe",
        "label": "封印庫"
      },
      {
        "x": 1690,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "pipe",
        "label": "記録棚"
      },
      {
        "x": 860.0,
        "y": 610.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "water",
        "x": 0,
        "y": 0,
        "w": 2200,
        "h": 1460
      },
      {
        "type": "lamp",
        "x": 570,
        "y": 430,
        "radius": 95
      },
      {
        "type": "lamp",
        "x": 980,
        "y": 640,
        "radius": 95
      },
      {
        "type": "crystal",
        "x": 1750,
        "y": 620,
        "radius": 100
      },
      {
        "type": "banner",
        "x": 1100,
        "y": 130,
        "text": "名前を呼ぶな。札を示せ。"
      }
    ],
    "exits": [
      {
        "id": "ex_mirror_bell",
        "x": 110,
        "y": 760,
        "radius": 86,
        "targetMap": "bell_foundry",
        "targetX": 1580,
        "targetY": 610,
        "prompt": "鐘楼鋳造区へ戻る",
        "label": "鋳造区"
      },
      {
        "id": "ex_mirror_archive",
        "x": 380,
        "y": 1360,
        "radius": 86,
        "targetMap": "map_archive",
        "targetX": 780,
        "targetY": 860,
        "prompt": "地図院へ抜ける",
        "label": "地図院",
        "condition": {
          "type": "flag",
          "id": "mira_rescued"
        }
      }
    ],
    "hotspots": [
      {
        "id": "hs_mirror_chalk",
        "x": 520,
        "y": 420,
        "radius": 78,
        "title": "排水壁の白墨矢印",
        "prompt": "白墨の合図を読む",
        "description": "矢印は配達紐と同じ順序で描かれている。",
        "visual": "map",
        "actions": [
          {
            "id": "read",
            "label": "白墨矢印を記録する",
            "detail": "白墨矢印を記録する",
            "timeCost": 1,
            "successText": "最後の印は『声を出すな、名前を呼ぶな』を意味する。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_storm_drain_chalk"
              },
              {
                "type": "xp",
                "value": 16
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_mirror_safehouse",
        "x": 960,
        "y": 610,
        "radius": 78,
        "title": "証人避難室",
        "prompt": "避難所の印を調べる",
        "description": "紙から消えた名前を真鍮札へ移し、壁に掛けている。",
        "visual": "seal",
        "actions": [
          {
            "id": "protect",
            "label": "避難所の合図印と名札を記録する",
            "detail": "避難所の合図印と名札を記録する",
            "timeCost": 1,
            "successText": "真実は、まず人を残してから公開しなければならない。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_safehouse_mark"
              },
              {
                "type": "evidence",
                "id": "e_name_anchor_tags"
              },
              {
                "type": "xp",
                "value": 30
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "deduction",
          "id": "d2_mirror_underpass_location"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_mirror_spine",
        "x": 1320,
        "y": 870,
        "radius": 78,
        "title": "封印箱の背表紙",
        "prompt": "第二帳簿の背表紙を回収する",
        "description": "中身と表紙を分けて運んだ跡がある。",
        "visual": "documents",
        "actions": [
          {
            "id": "take",
            "label": "第二帳簿の背表紙を保全する",
            "detail": "第二帳簿の背表紙を保全する",
            "timeCost": 1,
            "successText": "本は中身だけでは逃げられない。背が行き先を覚えている。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_second_ledger_spine"
              },
              {
                "type": "xp",
                "value": 24
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "deduction",
          "id": "d2_mirror_underpass_location"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": [
      {
        "id": "enc_mirror_registry",
        "x": 1720,
        "y": 620,
        "radius": 120,
        "enemyId": "mirror_registry",
        "prompt": "鏡面名簿に対峙し、ミラを救出する",
        "condition": {
          "all": [
            {
              "type": "deduction",
              "id": "d2_mirror_underpass_location"
            },
            {
              "not": {
                "type": "encounterCleared",
                "id": "enc_mirror_registry"
              }
            }
          ]
        }
      }
    ]
  },
  "tribunal_archive": {
    "id": "tribunal_archive",
    "name": "臨時評議院・封印資料庫",
    "district": "audit",
    "flavor": "非常措置の記録は、非常時が終わるまで公開されない。",
    "width": 1680,
    "height": 1080,
    "spawn": {
      "x": 200,
      "y": 600
    },
    "initialUnlocked": false,
    "colors": {
      "ground": "#38363c",
      "road": "#595563",
      "wall": "#201f26",
      "accent": "#bba36d",
      "fog": "#7d7787"
    },
    "ambient": {
      "rain": 0.5,
      "fog": 0.15,
      "lamps": 0.65,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1680,
        "h": 1080,
        "type": "stone"
      },
      {
        "x": 680.0,
        "y": 0,
        "w": 320,
        "h": 1080,
        "type": "road"
      },
      {
        "x": 0,
        "y": 400.0,
        "w": 1680,
        "h": 280,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1680,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 990,
        "w": 1680,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 1080,
        "kind": "wall"
      },
      {
        "x": 1590,
        "y": 0,
        "w": 90,
        "h": 1080,
        "kind": "wall"
      },
      {
        "x": 150,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "sealDoor",
        "label": "封印庫"
      },
      {
        "x": 1170,
        "y": 140,
        "w": 360,
        "h": 180,
        "kind": "sealDoor",
        "label": "記録棚"
      },
      {
        "x": 600.0,
        "y": 420.0,
        "w": 480,
        "h": 170,
        "kind": "table",
        "label": "調査卓"
      }
    ],
    "decorations": [
      {
        "type": "rug",
        "x": 560,
        "y": 620,
        "w": 520,
        "h": 250
      },
      {
        "type": "paperStack",
        "x": 880,
        "y": 480,
        "count": 7
      },
      {
        "type": "banner",
        "x": 840,
        "y": 105,
        "text": "非常措置は、誰が終わらせるのか"
      }
    ],
    "exits": [
      {
        "id": "ex_tribunal_audit",
        "x": 80,
        "y": 600,
        "radius": 86,
        "targetMap": "audit_hall",
        "targetX": 1550,
        "targetY": 240,
        "prompt": "監査庁へ戻る",
        "label": "監査庁"
      }
    ],
    "hotspots": [
      {
        "id": "hs_tribunal_vote",
        "x": 430,
        "y": 360,
        "radius": 78,
        "title": "床下の投票片",
        "prompt": "閉鎖評議の票を拾う",
        "description": "公式議事録から抜けた投票片が、床板の下に挟まっている。",
        "visual": "paper",
        "actions": [
          {
            "id": "take",
            "label": "評議院投票片を保全する",
            "detail": "評議院投票片を保全する",
            "timeCost": 1,
            "successText": "影地図を黒雨期間中だけ採用する但し書きが残る。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_council_vote_scrap"
              },
              {
                "type": "xp",
                "value": 26
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_tribunal_negative",
        "x": 880,
        "y": 480,
        "radius": 78,
        "title": "避難線の陰画",
        "prompt": "存在しない避難線を確認する",
        "description": "公示にだけ存在し、実際には担保窓口へ向かう線の原版。",
        "visual": "map",
        "actions": [
          {
            "id": "copy",
            "label": "避難線の陰画を写す",
            "detail": "避難線の陰画を写す",
            "timeCost": 1,
            "successText": "道があることになれば、来なかった者の責任にできる。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_final_map_negative"
              },
              {
                "type": "xp",
                "value": 30
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_council_vote_scrap"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_tribunal_loop",
        "x": 1260,
        "y": 700,
        "radius": 78,
        "title": "循環表の封筒",
        "prompt": "災害実績と利息の循環表を読む",
        "description": "黒雨被害、救済未達、封鎖工事、黒鐘補正が互いを正当化している。",
        "visual": "documents",
        "actions": [
          {
            "id": "read",
            "label": "利益循環表を保全する",
            "detail": "利益循環表を保全する",
            "timeCost": 1,
            "successText": "止めると損をする者が多すぎる仕組みは、犯人が一人ではない。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_false_budget_loop"
              },
              {
                "type": "xp",
                "value": 36
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_final_map_negative"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": []
  }
};
  H.Data.MapList = Object.values(H.Data.Maps);
})(window.Haimachi);
