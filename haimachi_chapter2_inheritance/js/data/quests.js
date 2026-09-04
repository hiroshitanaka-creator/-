(function registerQuests(H) {
  "use strict";

  H.Data.Quests = [
  {
    "id": "q_main",
    "type": "main",
    "title": "第二章　黒雨の帳簿",
    "summary": "第一章の真実を利用して広がる、黒雨・公債・影地図・黒鐘の複合事件を追う。",
    "tracked": true,
    "initialStatus": "active",
    "stages": [
      {
        "title": "第二監査の発令",
        "description": "地図院でナイラから第二監査命令を受ける。",
        "objectives": [
          {
            "id": "orders",
            "text": "ナイラから第二監査命令を受ける",
            "condition": {
              "type": "flag",
              "id": "field_kit_received"
            },
            "rewardText": "第二監査開始"
          }
        ],
        "onCompleteEffects": [
          {
            "type": "notify",
            "title": "第二章開始",
            "text": "東区、帳簿街、監査庁で黒雨の痕跡を追える。",
            "icon": "巡",
            "tone": "normal"
          }
        ]
      },
      {
        "title": "黒雨はどこから来るか",
        "description": "東区で黒雨と救済帳簿の異常を確認する。",
        "objectives": [
          {
            "id": "rain_sample",
            "text": "黒雨インクを採取する",
            "condition": {
              "type": "evidence",
              "id": "e_black_rain_sample"
            }
          },
          {
            "id": "wet_ledger",
            "text": "救済帳簿の濡れた行を保全する",
            "condition": {
              "type": "evidence",
              "id": "e_wet_ledger_page"
            }
          },
          {
            "id": "rain_deduction",
            "text": "推理盤で黒雨の性質を証明する",
            "condition": {
              "type": "deduction",
              "id": "d2_black_rain_changes_records"
            },
            "rewardText": "黒雨の正体"
          }
        ],
        "onCompleteEffects": [
          {
            "type": "notify",
            "title": "黒雨の性質を把握",
            "text": "雨ではなく記録改ざん。次は誰が得をするかを見る。",
            "icon": "滴",
            "tone": "success"
          }
        ]
      },
      {
        "title": "名前が担保になる道",
        "description": "東区二重門と帳簿街の公債をつなぐ。",
        "objectives": [
          {
            "id": "double_map",
            "text": "東区二重門の地図を記録する",
            "condition": {
              "type": "evidence",
              "id": "e_double_gate_map"
            }
          },
          {
            "id": "bond",
            "text": "灰塩復興公債を確認する",
            "condition": {
              "type": "evidence",
              "id": "e_gray_bond_certificate"
            }
          },
          {
            "id": "name_deduction",
            "text": "推理盤で名前の担保化を証明する",
            "condition": {
              "type": "deduction",
              "id": "d2_names_erased_for_collateral"
            }
          },
          {
            "id": "gate_deduction",
            "text": "推理盤で二重門の管轄分割を証明する",
            "condition": {
              "type": "deduction",
              "id": "d2_double_map_splits_jurisdiction"
            }
          }
        ],
        "onCompleteEffects": [
          {
            "type": "notify",
            "title": "公債と影地図が接続",
            "text": "救済権利と債務が別々の地図を歩かされている。",
            "icon": "図",
            "tone": "success"
          }
        ]
      },
      {
        "title": "黒鐘の発注元",
        "description": "予算循環を追い、鐘楼鋳造区を調査する。",
        "objectives": [
          {
            "id": "budget",
            "text": "復興予算の流向表を保全する",
            "condition": {
              "type": "evidence",
              "id": "e_budget_flow_table"
            }
          },
          {
            "id": "ledger_loop",
            "text": "推理盤で公債利益循環を証明する",
            "condition": {
              "type": "deduction",
              "id": "d2_ledger_loop"
            }
          },
          {
            "id": "bell_phase",
            "text": "黒鐘の位相表を入手する",
            "condition": {
              "type": "evidence",
              "id": "e_phase_chart"
            }
          },
          {
            "id": "bell_deduction",
            "text": "推理盤で黒鐘の機能を証明する",
            "condition": {
              "type": "deduction",
              "id": "d2_bell_foundry_amplifies_revision"
            }
          }
        ],
        "onCompleteEffects": [
          {
            "type": "notify",
            "title": "黒鐘の機能を特定",
            "text": "鏡面水路へ向かい、ミラと消えた名前を探す。",
            "icon": "鐘",
            "tone": "success"
          }
        ]
      },
      {
        "title": "鏡面水路の監査官",
        "description": "配達紐と証言からミラの退避先を確定し、救出する。",
        "objectives": [
          {
            "id": "mira_route",
            "text": "推理盤で鏡面水路の位置を確定する",
            "condition": {
              "type": "deduction",
              "id": "d2_mirror_underpass_location"
            }
          },
          {
            "id": "mira_rescue",
            "text": "鏡面名簿に対峙してミラを救出する",
            "condition": {
              "type": "flag",
              "id": "mira_rescued"
            },
            "rewardText": "監査官救出"
          },
          {
            "id": "mira_statement",
            "text": "ミラの監査核資料を受け取る",
            "condition": {
              "type": "evidence",
              "id": "e_mira_audit_core"
            }
          },
          {
            "id": "name_anchor",
            "text": "名前固定と証人保護を整える",
            "condition": {
              "type": "flag",
              "id": "name_anchor_ready"
            },
            "optional": true
          }
        ],
        "onCompleteEffects": [
          {
            "type": "notify",
            "title": "監査官ミラを確保",
            "text": "臨時評議院で影地図承認の証拠を押さえる。",
            "icon": "査",
            "tone": "success"
          }
        ]
      },
      {
        "title": "閉鎖評議の影地図",
        "description": "評議院資料から制度的責任を固定する。",
        "objectives": [
          {
            "id": "vote",
            "text": "閉鎖評議の投票片を保全する",
            "condition": {
              "type": "evidence",
              "id": "e_council_vote_scrap"
            }
          },
          {
            "id": "negative",
            "text": "存在しない避難線の陰画を写す",
            "condition": {
              "type": "evidence",
              "id": "e_final_map_negative"
            }
          },
          {
            "id": "loop",
            "text": "利益循環表を保全する",
            "condition": {
              "type": "evidence",
              "id": "e_false_budget_loop"
            }
          },
          {
            "id": "council",
            "text": "推理盤で閉鎖評議承認を証明する",
            "condition": {
              "type": "deduction",
              "id": "d2_council_authorized_shadow_map"
            }
          }
        ],
        "onCompleteEffects": [
          {
            "type": "notify",
            "title": "評議院の承認線を確保",
            "text": "黒雨事件の全体像を推理盤で固定する。",
            "icon": "議",
            "tone": "success"
          }
        ]
      },
      {
        "title": "街へ残す第二章の真実",
        "description": "全体像を固定し、地図院へ正式報告を提出する。",
        "objectives": [
          {
            "id": "complete",
            "text": "推理盤で第二章全体像を成立させる",
            "condition": {
              "type": "deduction",
              "id": "d2_complete_second_case"
            },
            "rewardText": "正式報告解禁"
          },
          {
            "id": "report",
            "text": "正式報告書を提出する",
            "condition": {
              "type": "flag",
              "id": "chapter_complete"
            }
          }
        ],
        "onCompleteEffects": []
      }
    ]
  },
  {
    "id": "q_name_anchor",
    "type": "side",
    "title": "紙から消えた名前",
    "summary": "救済名簿から消えた住民名を、公開前に真鍮札へ固定する。",
    "tracked": false,
    "initialStatus": "active",
    "stages": [
      {
        "title": "名簿の矛盾",
        "description": "東区でリオの証言と消えた名簿を保全する。",
        "objectives": [
          {
            "id": "lio",
            "text": "リオの証言を聞く",
            "condition": {
              "type": "evidence",
              "id": "t_lio_name_erasure"
            }
          },
          {
            "id": "roll",
            "text": "名前の抜けた徴税名簿を得る",
            "condition": {
              "type": "evidence",
              "id": "e_erased_tax_roll"
            }
          }
        ],
        "onCompleteEffects": []
      },
      {
        "title": "真鍮札の保護",
        "description": "鏡面水路で名前固定の仕組みを確保する。",
        "objectives": [
          {
            "id": "tags",
            "text": "名前固定の真鍮名札を記録する",
            "condition": {
              "type": "evidence",
              "id": "e_name_anchor_tags"
            }
          },
          {
            "id": "protect",
            "text": "ナイラに保護命令を出してもらう",
            "condition": {
              "type": "flag",
              "id": "name_anchor_ready"
            }
          }
        ],
        "onCompleteEffects": []
      }
    ]
  },
  {
    "id": "q_bell",
    "type": "side",
    "title": "黒鐘を黙らせる",
    "summary": "記録を濡らす黒鐘の仕組みを暴き、鐘音を停止する。",
    "tracked": false,
    "initialStatus": "active",
    "stages": [
      {
        "title": "黒鐘の材料",
        "description": "鋳造区で黒鐘の材料と請求書を確認する。",
        "objectives": [
          {
            "id": "mold",
            "text": "黒鐘の鋳型片を得る",
            "condition": {
              "type": "evidence",
              "id": "e_bell_mold_shard"
            }
          },
          {
            "id": "residue",
            "text": "灰銅粉を採取する",
            "condition": {
              "type": "evidence",
              "id": "e_black_bell_residue"
            }
          }
        ],
        "onCompleteEffects": []
      },
      {
        "title": "反響を止める",
        "description": "黒鐘の反響と対峙する。",
        "objectives": [
          {
            "id": "phase",
            "text": "鐘音位相表を得る",
            "condition": {
              "type": "evidence",
              "id": "e_phase_chart"
            }
          },
          {
            "id": "fight",
            "text": "黒鐘の反響を鎮める",
            "condition": {
              "type": "encounterCleared",
              "id": "enc_black_bell"
            }
          }
        ],
        "onCompleteEffects": []
      }
    ]
  },
  {
    "id": "q_mira",
    "type": "side",
    "title": "監査官ミラの行方",
    "summary": "黒雨の予算を追って消えた監査官を救出する。",
    "tracked": false,
    "initialStatus": "active",
    "stages": [
      {
        "title": "失踪前の足跡",
        "description": "ミラが追っていた予算線を確認する。",
        "objectives": [
          {
            "id": "note",
            "text": "ミラの最後の書付を得る",
            "condition": {
              "type": "evidence",
              "id": "e_mira_last_note"
            }
          },
          {
            "id": "yura",
            "text": "ユラの証言を聞く",
            "condition": {
              "type": "evidence",
              "id": "t_yura_mira_warning"
            }
          }
        ],
        "onCompleteEffects": []
      },
      {
        "title": "水路へ",
        "description": "鏡面水路の位置を推理し、ミラを救う。",
        "objectives": [
          {
            "id": "route",
            "text": "鏡面水路の位置を推理する",
            "condition": {
              "type": "deduction",
              "id": "d2_mirror_underpass_location"
            }
          },
          {
            "id": "rescue",
            "text": "ミラを救出する",
            "condition": {
              "type": "flag",
              "id": "mira_rescued"
            }
          }
        ],
        "onCompleteEffects": []
      }
    ]
  },
  {
    "id": "q_order",
    "type": "side",
    "title": "黒雨の群衆沈静",
    "summary": "天罰説・証言買収説・名前借金説を放置せず、街の混乱を抑える。",
    "tracked": false,
    "initialStatus": "active",
    "stages": [
      {
        "title": "噂の第一波",
        "description": "東区と帳簿街で噂化した敵と対峙する。",
        "objectives": [
          {
            "id": "crowd",
            "text": "黒雨天罰の群衆を鎮める",
            "condition": {
              "type": "encounterCleared",
              "id": "enc_east_crowd"
            }
          },
          {
            "id": "moth",
            "text": "利息蛾を論破する",
            "condition": {
              "type": "encounterCleared",
              "id": "enc_interest_moth"
            },
            "optional": true
          }
        ],
        "onCompleteEffects": []
      },
      {
        "title": "黒鐘後の反響",
        "description": "黒鐘を鎮め、公開前の不安を下げる。",
        "objectives": [
          {
            "id": "bell",
            "text": "黒鐘の反響を鎮める",
            "condition": {
              "type": "encounterCleared",
              "id": "enc_black_bell"
            }
          },
          {
            "id": "stability",
            "text": "街の安定度を35以上に維持する",
            "condition": {
              "type": "world",
              "path": "stability",
              "op": "gte",
              "value": 35
            }
          }
        ],
        "onCompleteEffects": []
      }
    ]
  },
  {
    "id": "q_second_ledger",
    "type": "side",
    "title": "第二帳簿の背",
    "summary": "第二帳簿の本体が消されても、背表紙と索引から構造を復元する。",
    "tracked": false,
    "initialStatus": "active",
    "stages": [
      {
        "title": "背表紙を追う",
        "description": "鏡面水路で背表紙を保全する。",
        "objectives": [
          {
            "id": "spine",
            "text": "第二帳簿の背表紙を得る",
            "condition": {
              "type": "evidence",
              "id": "e_second_ledger_spine"
            }
          },
          {
            "id": "core",
            "text": "ミラの監査核資料を得る",
            "condition": {
              "type": "evidence",
              "id": "e_mira_audit_core"
            }
          }
        ],
        "onCompleteEffects": []
      },
      {
        "title": "封印資料庫へ",
        "description": "評議院資料と照合する。",
        "objectives": [
          {
            "id": "negative",
            "text": "避難線の陰画を得る",
            "condition": {
              "type": "evidence",
              "id": "e_final_map_negative"
            }
          },
          {
            "id": "loop",
            "text": "利益循環表を得る",
            "condition": {
              "type": "evidence",
              "id": "e_false_budget_loop"
            }
          }
        ],
        "onCompleteEffects": []
      }
    ]
  }
];
  H.Data.QuestById = H.Core.Util.toMap(H.Data.Quests);
})(window.Haimachi);
