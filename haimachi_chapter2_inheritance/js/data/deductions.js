(function registerDeductions(H) {
  "use strict";

  H.Data.Deductions = [
  {
    "id": "d2_black_rain_changes_records",
    "title": "黒雨は天候ではなく記録改ざん現象である",
    "shortTitle": "黒雨＝記録改ざん",
    "chapter": "第二章",
    "slots": 3,
    "question": "黒雨は自然災害か、記録に作用する人工現象か。",
    "availability": {
      "all": [
        {
          "type": "flag",
          "id": "field_kit_received"
        },
        {
          "type": "evidence",
          "id": "e_black_rain_sample"
        }
      ]
    },
    "groups": [
      [
        "e_black_rain_sample"
      ],
      [
        "e_wet_ledger_page",
        "t_ines_revision_timing"
      ],
      [
        "e_duplicate_notice",
        "e_true_map_copy"
      ]
    ],
    "result": "黒雨は空から降る雨ではなく、灰塩と鏡墨が記録紙の内側から滲む現象だった。対象は人ではなく、地図・名簿・公示の採用済み文字である。",
    "shortResult": "黒雨は記録を濡らす。",
    "failureHints": [
      "物質試料だけでは足りない。実際に濡れた記録と時刻の異常を組み合わせる。",
      "黒雨の対象は住民ではなく記録。名簿か公示の変化を入れる。"
    ],
    "tags": [
      "黒雨",
      "記録",
      "灰塩",
      "鏡墨"
    ],
    "truthValue": 82,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "black_rain_explained",
        "value": true
      },
      {
        "type": "rumor",
        "id": "r_black_rain",
        "path": "credibility",
        "value": -12
      },
      {
        "type": "district",
        "id": "east",
        "path": "fear",
        "value": -5
      },
      {
        "type": "questEvaluate"
      }
    ]
  },
  {
    "id": "d2_mira_followed_budget",
    "title": "ミラは雨ではなく予算を追って失踪した",
    "shortTitle": "ミラは予算を追った",
    "chapter": "第二章",
    "slots": 3,
    "question": "失踪した監査官ミラは、何を追って水路へ消えたのか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "e_mira_last_note"
        },
        {
          "type": "evidence",
          "id": "e_budget_flow_table"
        }
      ]
    },
    "groups": [
      [
        "e_mira_last_note",
        "t_yura_mira_warning"
      ],
      [
        "e_budget_flow_table",
        "e_gray_bond_certificate"
      ],
      [
        "t_eld_bond_courier",
        "e_resonance_invoice"
      ]
    ],
    "result": "ミラは黒雨の水源ではなく、災害予算と公債の流れを追っていた。失踪は事故ではなく、資料保全のための潜伏だった可能性が高い。",
    "shortResult": "ミラの追跡対象は利息。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "ミラ",
      "予算",
      "公債",
      "失踪"
    ],
    "truthValue": 78,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "mira_budget_route_fixed",
        "value": true
      },
      {
        "type": "questEvaluate"
      }
    ]
  },
  {
    "id": "d2_names_erased_for_collateral",
    "title": "消された名前は公債担保へ移されている",
    "shortTitle": "名前＝担保化",
    "chapter": "第二章",
    "slots": 3,
    "question": "救済名簿から消えた名前は、どこへ移ったのか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "e_erased_tax_roll"
        },
        {
          "type": "evidence",
          "id": "e_gray_bond_certificate"
        }
      ]
    },
    "groups": [
      [
        "e_erased_tax_roll",
        "t_lio_name_erasure"
      ],
      [
        "e_gray_bond_certificate",
        "t_sabra_debt_roll"
      ],
      [
        "e_wet_ledger_page",
        "e_shadow_map_key"
      ]
    ],
    "result": "住民の名前は単に消えたのではない。救済権利から切り離され、番地と被害額だけが公債の担保計算へ移されていた。",
    "shortResult": "名簿消失は担保移転。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "名前",
      "公債",
      "担保",
      "救済"
    ],
    "truthValue": 86,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "name_erasure_explained",
        "value": true
      },
      {
        "type": "rumorActivate",
        "id": "r_name_debt",
        "value": true,
        "intensity": 68
      },
      {
        "type": "questEvaluate"
      }
    ]
  },
  {
    "id": "d2_double_map_splits_jurisdiction",
    "title": "二重門は管轄を分割するための地図装置である",
    "shortTitle": "二重門＝管轄分割",
    "chapter": "第二章",
    "slots": 3,
    "question": "東区二重門は、なぜ同じ門から違う窓口へ着くのか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "e_double_gate_map"
        },
        {
          "type": "evidence",
          "id": "e_duplicate_notice"
        }
      ]
    },
    "groups": [
      [
        "e_double_gate_map"
      ],
      [
        "e_duplicate_notice",
        "e_final_map_negative"
      ],
      [
        "e_shadow_map_key",
        "e_true_map_copy"
      ]
    ],
    "result": "二重門は空間の怪異ではなく、公式地図と影地図で住所管轄を分ける装置だった。救済権利と公債担保を別の窓口へ誘導する。",
    "shortResult": "門は地図で割られていた。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "地図",
      "影地図",
      "二重門",
      "管轄"
    ],
    "truthValue": 84,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "double_gate_explained",
        "value": true
      },
      {
        "type": "rumor",
        "id": "r_double_gate",
        "path": "credibility",
        "value": -10
      },
      {
        "type": "questEvaluate"
      }
    ]
  },
  {
    "id": "d2_ledger_loop",
    "title": "黒雨対策費は黒雨を継続させる利益循環である",
    "shortTitle": "公債利益循環",
    "chapter": "第二章",
    "slots": 3,
    "question": "復興予算は黒雨を止めるために使われているのか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "e_budget_flow_table"
        },
        {
          "type": "deduction",
          "id": "d2_names_erased_for_collateral"
        }
      ]
    },
    "groups": [
      [
        "e_budget_flow_table"
      ],
      [
        "e_gray_bond_certificate",
        "t_sabra_debt_roll"
      ],
      [
        "e_resonance_invoice",
        "e_drainage_budget_tag",
        "t_eld_bond_courier"
      ]
    ],
    "result": "黒雨被害が増えるほど公債価値と対策予算が増え、その対策予算が黒鐘や封印へ戻っていた。これは事故対応ではなく、災害の継続で利益を得る輪である。",
    "shortResult": "災害は利益循環だった。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "予算",
      "利益",
      "公債",
      "循環"
    ],
    "truthValue": 90,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "ledger_loop_fixed",
        "value": true
      },
      {
        "type": "mapUnlock",
        "id": "bell_foundry"
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_names_erased_for_collateral"
    ]
  },
  {
    "id": "d2_bell_foundry_amplifies_revision",
    "title": "黒鐘は黒雨改ざんを増幅する位相装置である",
    "shortTitle": "黒鐘＝位相装置",
    "chapter": "第二章",
    "slots": 3,
    "question": "黒鐘は災害対策装置か、改ざん装置か。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "e_bell_mold_shard"
        },
        {
          "type": "evidence",
          "id": "e_black_bell_residue"
        }
      ]
    },
    "groups": [
      [
        "e_bell_mold_shard",
        "t_goro_bell_commission"
      ],
      [
        "e_black_bell_residue",
        "e_black_rain_sample"
      ],
      [
        "e_phase_chart",
        "t_cyr_rain_order",
        "e_resonance_invoice"
      ]
    ],
    "result": "黒鐘は雨を止める装置ではない。紙中の灰塩を逆相で震わせ、地図・名簿・公示を指定順に濡らす位相装置だった。",
    "shortResult": "黒鐘は記録を鳴らす。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "黒鐘",
      "位相",
      "黒雨",
      "共鳴"
    ],
    "truthValue": 92,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "black_bell_explained",
        "value": true
      },
      {
        "type": "rumor",
        "id": "r_black_bell",
        "path": "credibility",
        "value": -14
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_black_rain_changes_records"
    ]
  },
  {
    "id": "d2_mirror_underpass_location",
    "title": "ミラと消えた名前は鏡面水路に退避している",
    "shortTitle": "鏡面水路へ",
    "chapter": "第二章",
    "slots": 3,
    "question": "ミラと名前を消された住民は、どこへ逃げたのか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "t_yura_mira_warning"
        },
        {
          "type": "evidence",
          "id": "e_yura_delivery_string"
        }
      ]
    },
    "groups": [
      [
        "t_toka_underpass",
        "e_storm_drain_chalk"
      ],
      [
        "e_yura_delivery_string",
        "e_safehouse_mark"
      ],
      [
        "e_mira_last_note",
        "t_yura_mira_warning"
      ]
    ],
    "result": "ミラは黒雨を避けるため、紙ではなく紐と真鍮札で道と名前を残す鏡面水路へ退避した。水路には証人避難所がある。",
    "shortResult": "ミラは水路にいる。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "ミラ",
      "水路",
      "避難所",
      "名前"
    ],
    "truthValue": 84,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "mirror_route_fixed",
        "value": true
      },
      {
        "type": "mapUnlock",
        "id": "mirror_underpass"
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_mira_followed_budget"
    ]
  },
  {
    "id": "d2_maren_is_buffer",
    "title": "マレンは主犯ではなく責任を受け止める緩衝材である",
    "shortTitle": "マレン＝緩衝材",
    "chapter": "第二章",
    "slots": 3,
    "question": "監査局長マレンだけを主犯と見なしてよいか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "t_maren_deny"
        },
        {
          "type": "evidence",
          "id": "e_counterfeit_seal"
        }
      ]
    },
    "groups": [
      [
        "t_maren_deny"
      ],
      [
        "e_counterfeit_seal",
        "e_mirror_ink_receipt"
      ],
      [
        "e_shadow_map_key",
        "e_council_vote_scrap",
        "t_enja_closed_vote"
      ]
    ],
    "result": "マレンは第二帳簿封印の責任を負うが、影地図承認、黒鐘発注、公債担保化の全てを一人で設計したわけではない。彼は共同責任を一人へ寄せる緩衝材でもある。",
    "shortResult": "単独主犯では足りない。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "監査庁",
      "封印",
      "責任",
      "影地図"
    ],
    "truthValue": 80,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "maren_buffer_fixed",
        "value": true
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_double_map_splits_jurisdiction"
    ]
  },
  {
    "id": "d2_council_authorized_shadow_map",
    "title": "閉鎖評議は影地図運用を承認していた",
    "shortTitle": "評議院承認",
    "chapter": "第二章",
    "slots": 3,
    "question": "影地図と黒雨予算は誰の承認で動いたのか。",
    "availability": {
      "all": [
        {
          "type": "evidence",
          "id": "e_council_vote_scrap"
        },
        {
          "type": "evidence",
          "id": "t_enja_closed_vote"
        }
      ]
    },
    "groups": [
      [
        "e_council_vote_scrap",
        "t_enja_closed_vote"
      ],
      [
        "e_shadow_map_key",
        "e_final_map_negative"
      ],
      [
        "e_false_budget_loop",
        "e_mira_audit_core"
      ]
    ],
    "result": "影地図は一部署の偽装ではなく、閉鎖評議の非常措置として承認されていた。非常状態を延長する予算とセットだったため、黒雨は例外を恒久化する装置でもあった。",
    "shortResult": "影地図は承認済みだった。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "評議院",
      "影地図",
      "承認",
      "制度的不正"
    ],
    "truthValue": 94,
    "rewards": {
      "xp": 35,
      "truthTokens": 1
    },
    "effects": [
      {
        "type": "flag",
        "id": "council_responsibility_fixed",
        "value": true
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_maren_is_buffer"
    ]
  },
  {
    "id": "d2_complete_second_case",
    "title": "黒雨事件の全体像を固定する",
    "shortTitle": "第二章全体像",
    "chapter": "第二章",
    "slots": 4,
    "question": "第二章の事件は、どの構造として記録すべきか。",
    "availability": {
      "all": [
        {
          "type": "deduction",
          "id": "d2_council_authorized_shadow_map"
        },
        {
          "type": "evidence",
          "id": "e_false_budget_loop"
        },
        {
          "type": "evidence",
          "id": "t_mira_rescued_statement"
        }
      ]
    },
    "groups": [
      [
        "e_mira_audit_core",
        "t_mira_rescued_statement"
      ],
      [
        "e_false_budget_loop",
        "e_budget_flow_table"
      ],
      [
        "e_final_map_negative",
        "e_shadow_map_key"
      ],
      [
        "e_phase_chart",
        "t_cyr_rain_order",
        "e_black_bell_residue"
      ]
    ],
    "result": "黒雨事件は、救済名簿を公債担保へ移し、影地図で管轄を裂き、黒鐘で公式記録を濡らし、非常措置を利益循環へ変える制度的な記録災害だった。",
    "shortResult": "雨・帳簿・地図・鐘は一つの事件。",
    "failureHints": [
      "役割の違う証拠を選ぶ。物質、時刻、利益、証言を混ぜて考える。",
      "同じ種類の資料だけでは足りない。出所と機能と受益者を分ける。",
      "前提推理が必要な場合は、先に下位の推理を成立させる。"
    ],
    "tags": [
      "全体像",
      "黒雨",
      "制度的不正",
      "第二帳簿"
    ],
    "truthValue": 100,
    "rewards": {
      "xp": 70,
      "truthTokens": 3
    },
    "effects": [
      {
        "type": "flag",
        "id": "report_unlocked",
        "value": true
      },
      {
        "type": "world",
        "path": "publicTrust",
        "value": 5
      },
      {
        "type": "questEvaluate"
      },
      {
        "type": "notify",
        "title": "正式報告が可能",
        "text": "地図院の報告卓で第二章の結論を提出できる。",
        "icon": "印",
        "tone": "success"
      }
    ],
    "requiredDeductions": [
      "d2_black_rain_changes_records",
      "d2_ledger_loop",
      "d2_bell_foundry_amplifies_revision",
      "d2_mirror_underpass_location",
      "d2_council_authorized_shadow_map"
    ]
  }
];
  H.Data.DeductionById = H.Core.Util.toMap(H.Data.Deductions);
})(window.Haimachi);
