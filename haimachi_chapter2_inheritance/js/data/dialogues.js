(function registerDialogues(H) {
  "use strict";

  H.Data.Dialogues = {
  "naira": {
    "greetings": [
      {
        "requires": {
          "type": "flag",
          "id": "field_kit_received"
        },
        "text": "「黒雨は天候ではない。報告書に落ちる雨だ。あなたが第一章で採用した線を、誰かが利用している」"
      },
      {
        "text": "「巡察官。第一章の報告は正しかった。だが、正しかったからこそ、次の嘘がその上に書かれた」"
      }
    ],
    "topics": [
      {
        "id": "second_orders",
        "label": "第二監査命令を受ける",
        "summary": "第二章の正式調査を開始する。",
        "options": [
          {
            "id": "accept",
            "label": "命令書と第一章採用地図を受け取る",
            "response": "ナイラは黒い縁取りの命令書を差し出す。\n\n「東区の黒雨、帳簿街の公債、鐘楼鋳造区の発注、監査庁の封印。別々に見えるものを、一つの事件として扱いなさい」",
            "effects": [
              {
                "type": "evidence",
                "id": "e_ch2_field_writ"
              },
              {
                "type": "evidence",
                "id": "e_true_map_copy"
              },
              {
                "type": "flag",
                "id": "field_kit_received",
                "value": true
              },
              {
                "type": "mapUnlock",
                "id": "audit_hall"
              },
              {
                "type": "xp",
                "value": 18
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 0,
            "once": true
          }
        ]
      },
      {
        "id": "protection",
        "label": "名前固定と証人保護",
        "summary": "消された名前を公開前に固定する。",
        "options": [
          {
            "id": "anchor",
            "label": "真鍮名札を公式保護へ移す",
            "response": "「公開は武器になる。先に人を残す」\n\nナイラは真鍮札へ地図院印を押した。名前は紙へ戻る前に、街の制度へ仮固定される。",
            "effects": [
              {
                "type": "flag",
                "id": "witness_protection_ready",
                "value": true
              },
              {
                "type": "flag",
                "id": "name_anchor_ready",
                "value": true
              },
              {
                "type": "world",
                "path": "publicTrust",
                "value": 4
              },
              {
                "type": "xp",
                "value": 24
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true,
            "requires": {
              "all": [
                {
                  "type": "deduction",
                  "id": "d2_names_erased_for_collateral"
                },
                {
                  "type": "evidence",
                  "id": "e_name_anchor_tags"
                }
              ]
            },
            "hideWhen": {
              "type": "flag",
              "id": "name_anchor_ready"
            }
          }
        ]
      }
    ]
  },
  "ines": {
    "greetings": [
      {
        "text": "「紙は濡れました。でも窓は閉じていました。つまり、雨は紙の内側から来たんです」"
      }
    ],
    "topics": [
      {
        "id": "revision_time",
        "label": "改ざん時刻",
        "summary": "黒雨と黒鐘の時刻を聞く。",
        "options": [
          {
            "id": "record",
            "label": "三拍の時刻を記録する",
            "response": "イネスは筆先を三度、机に置く。\n\n「二拍目で地図、三拍目で名簿。時計ではなく鐘が、紙の順番を決めていました」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_ines_revision_timing"
              },
              {
                "type": "rumorActivate",
                "id": "r_black_bell",
                "value": true,
                "intensity": 48
              },
              {
                "type": "xp",
                "value": 20
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "eld": {
    "greetings": [
      {
        "text": "「また荷の話か。いいさ。今度は、荷の中身まで見る」"
      }
    ],
    "topics": [
      {
        "id": "bond_courier",
        "label": "公債控えの運搬",
        "summary": "第一章以前からの荷を確認する。",
        "options": [
          {
            "id": "confess",
            "label": "公債控えを運んだ経緯を聞く",
            "response": "「俺は救済券の控えだと思って運んだ。だが同じ紙が、帳簿街では公債の裏書きになっていた。人の名前が、荷札みたいに扱われていた」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_eld_bond_courier"
              },
              {
                "type": "npcTrust",
                "id": "eld",
                "value": 7
              },
              {
                "type": "xp",
                "value": 18
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "yura": {
    "greetings": [
      {
        "text": "「紙の地図は濡れる。だから配達人は紐で道を覚える」"
      }
    ],
    "topics": [
      {
        "id": "mira_warning",
        "label": "ミラの警告",
        "summary": "ミラが黒雨前に残した言葉を聞く。",
        "options": [
          {
            "id": "hear",
            "label": "三通の配達を聞く",
            "response": "「ミラさんは『水じゃない、利息を避けろ』と言った。地図院、エルド、そして宛名の消えた人たちへ配れって」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_yura_mira_warning"
              },
              {
                "type": "npcTrust",
                "id": "yura",
                "value": 9
              },
              {
                "type": "xp",
                "value": 17
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      },
      {
        "id": "string_code",
        "label": "配達紐の暗号",
        "summary": "紙ではない道順を受け取る。",
        "options": [
          {
            "id": "take_string",
            "label": "配達紐を受け取る",
            "response": "ユラは三つの結び目をほどく。\n\n「東門、取引所、排水。最後の結びは声を出すな、名前を呼ぶな、って意味」",
            "effects": [
              {
                "type": "evidence",
                "id": "e_yura_delivery_string"
              },
              {
                "type": "xp",
                "value": 14
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true,
            "requires": {
              "type": "evidence",
              "id": "t_yura_mira_warning"
            }
          }
        ]
      }
    ]
  },
  "lio": {
    "greetings": [
      {
        "text": "「お母さんは消えてない。借金の紙だけ、お母さんを覚えてる」"
      }
    ],
    "topics": [
      {
        "id": "mother_name",
        "label": "消えた母の名前",
        "summary": "救済名簿と公債窓口の矛盾を聞く。",
        "options": [
          {
            "id": "listen",
            "label": "番号になった名前を記録する",
            "response": "リオは濡れた紙片を両手で押さえる。\n\n「救済の紙からは消えた。でも公債の紙には、母さんの家の番号だけ残ってる」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_lio_name_erasure"
              },
              {
                "type": "rumorActivate",
                "id": "r_name_debt",
                "value": true,
                "intensity": 55
              },
              {
                "type": "npcTrust",
                "id": "lio",
                "value": 12
              },
              {
                "type": "xp",
                "value": 20
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "oren": {
    "greetings": [
      {
        "text": "「黒雨は売れる。天罰、報い、裏切り。三つ揃えば群衆は勝手に続きを買う」"
      }
    ],
    "topics": [
      {
        "id": "slogan",
        "label": "帳簿街の合言葉",
        "summary": "黒雨の言い回しの出所を探る。",
        "options": [
          {
            "id": "buy",
            "label": "噂の仕入れ札を買う",
            "response": "オレンは小さな札を一枚だけ渡す。\n\n「注文は『天罰』『証言売り』『救済泥棒』。誰が得をするか？ 窓口を混乱させたい奴だろうな」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_oren_market_slogan"
              },
              {
                "type": "npcTrust",
                "id": "oren",
                "value": -4
              },
              {
                "type": "currency",
                "id": "patrolMarks",
                "value": -1
              },
              {
                "type": "xp",
                "value": 14
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "sabra": {
    "greetings": [
      {
        "text": "「名簿ではありません。市場では、被害期待値と呼びます」"
      }
    ],
    "topics": [
      {
        "id": "debt_roll",
        "label": "担保名簿",
        "summary": "救済名簿の金融利用を問い詰める。",
        "options": [
          {
            "id": "press",
            "label": "言い換えを止めさせる",
            "response": "サブラは笑顔を保つが、指先が計算板の世帯番号を隠す。\n\n「制度上、名前は見ていません。ですが、番地がなければ利回りは出ません」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_sabra_debt_roll"
              },
              {
                "type": "npcTrust",
                "id": "sabra",
                "value": -8
              },
              {
                "type": "world",
                "path": "publicTrust",
                "value": -1
              },
              {
                "type": "xp",
                "value": 21
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true,
            "requires": {
              "any": [
                {
                  "type": "evidence",
                  "id": "e_gray_bond_certificate"
                },
                {
                  "type": "deduction",
                  "id": "d2_names_erased_for_collateral"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "goro": {
    "greetings": [
      {
        "text": "「鐘を鋳る前に雨が来た？ 逆だ。鐘の注文が先に来た」"
      }
    ],
    "topics": [
      {
        "id": "commission",
        "label": "黒鐘の前払い",
        "summary": "発注時刻と支払元を聞く。",
        "options": [
          {
            "id": "record",
            "label": "前払いの話を記録する",
            "response": "「工賃は災害前に払われた。支払いは監査庁予備費、保証は公債。災害対策なら、なぜ雨より早い？」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_goro_bell_commission"
              },
              {
                "type": "npcTrust",
                "id": "goro",
                "value": 8
              },
              {
                "type": "xp",
                "value": 18
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "cyr": {
    "greetings": [
      {
        "text": "「私は音を作った。誰の名前を濡らすかは、位相表を書いた者に聞け」"
      }
    ],
    "topics": [
      {
        "id": "rain_order",
        "label": "雨を鳴らす命令",
        "summary": "黒鐘の機能を確認する。",
        "options": [
          {
            "id": "challenge",
            "label": "黒鐘の目的を問い詰める",
            "response": "キュールは鐘舌へ手袋越しに触れる。\n\n「黒鐘は雨を止めない。紙の中の灰塩を震わせる。表があれば、地図、名簿、公示を順に濡らせる」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_cyr_rain_order"
              },
              {
                "type": "npcTrust",
                "id": "cyr",
                "value": -5
              },
              {
                "type": "xp",
                "value": 23
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true,
            "requires": {
              "any": [
                {
                  "type": "evidence",
                  "id": "e_phase_chart"
                },
                {
                  "type": "evidence",
                  "id": "e_black_bell_residue"
                },
                {
                  "type": "deduction",
                  "id": "d2_bell_foundry_amplifies_revision"
                }
              ]
            }
          }
        ]
      }
    ]
  },
  "toka": {
    "greetings": [
      {
        "text": "「ここでは名前を大声で呼ぶな。壁の帳簿が聞いている」"
      }
    ],
    "topics": [
      {
        "id": "underpass",
        "label": "濡れない地下",
        "summary": "鏡面水路の意味を聞く。",
        "options": [
          {
            "id": "ask",
            "label": "水路の合図を記録する",
            "response": "「黒雨は上から来ない。記録から来る。ミラはそれを知って、名前を紙から真鍮へ逃がした」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_toka_underpass"
              },
              {
                "type": "npcTrust",
                "id": "toka",
                "value": 9
              },
              {
                "type": "xp",
                "value": 19
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "maren": {
    "greetings": [
      {
        "text": "「公開とは、真実を投げる行為ではありません。市場と民衆が受け止められる形に加工する行政行為です」"
      }
    ],
    "topics": [
      {
        "id": "deny",
        "label": "監査封印の理屈",
        "summary": "第二帳簿をなぜ封印したか問う。",
        "options": [
          {
            "id": "press",
            "label": "章番号の失言を記録する",
            "response": "マレンは『第二帳簿など存在しない』と言いかけ、すぐに言い直す。\n\n「少なくとも第六章までは、公開に耐える状態ではない」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_maren_deny"
              },
              {
                "type": "npcTrust",
                "id": "maren",
                "value": -7
              },
              {
                "type": "xp",
                "value": 20
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "enja": {
    "greetings": [
      {
        "text": "「非常措置だった。そう記録すれば、まだ私は逃げられると思っていた」"
      }
    ],
    "topics": [
      {
        "id": "closed_vote",
        "label": "閉鎖評議",
        "summary": "影地図の採用経緯を聞く。",
        "options": [
          {
            "id": "testify",
            "label": "投票片の意味を聞く",
            "response": "「一晩だけ、救済の混乱を避けるため。そう説明された。でも同時に、次の黒雨予算まで組まれていた」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_enja_closed_vote"
              },
              {
                "type": "npcTrust",
                "id": "enja",
                "value": 10
              },
              {
                "type": "xp",
                "value": 24
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true
          }
        ]
      }
    ]
  },
  "mira": {
    "greetings": [
      {
        "requires": {
          "type": "flag",
          "id": "mira_rescued"
        },
        "text": "「遅かった、とは言いません。私の資料は、まだ雨に負けていません」"
      },
      {
        "text": "声は水路の奥で反響する。まだ姿は見えない。"
      }
    ],
    "topics": [
      {
        "id": "core",
        "label": "事件番号は一つ",
        "summary": "救出したミラから全体像を聞く。",
        "options": [
          {
            "id": "record",
            "label": "監査核資料を受け取る",
            "response": "ミラは濡れていない封筒を開く。\n\n「部署が四つなら、責任も四つに裂ける。だから私は事件番号を一つに戻しました。雨、帳簿、地図、鐘――すべて同じ番号です」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_mira_rescued_statement"
              },
              {
                "type": "evidence",
                "id": "e_mira_audit_core"
              },
              {
                "type": "mapUnlock",
                "id": "tribunal_archive"
              },
              {
                "type": "xp",
                "value": 34
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true,
            "requires": {
              "type": "flag",
              "id": "mira_rescued"
            }
          }
        ]
      }
    ]
  }
};
})(window.Haimachi);
