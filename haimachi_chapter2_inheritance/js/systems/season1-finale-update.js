(function registerSeasonOneFinale(H) {
  "use strict";
  const Util = H.Core.Util;
  const byId = (items) => Util.toMap(items || []);
  const upsert = (array, item) => {
    const i = array.findIndex((entry) => entry.id === item.id);
    if (i >= 0) array[i] = Object.assign({}, array[i], item);
    else array.push(item);
  };
  const upsertMany = (array, items) => items.forEach((item) => upsert(array, item));
  const pushUnique = (array, item, key = "id") => {
    if (!array.some((entry) => entry && entry[key] === item[key])) array.push(item);
  };
  const pushTuple = (array, tuple) => {
    if (!array.some((entry) => Array.isArray(entry) && entry[0] === tuple[0] && entry[1] === tuple[1])) array.push(tuple);
  };

  H.VERSION = "1.2.0-season1-complete";
  H.Data.Config.chapter = "第二章・完結編　黒雨の帳簿と白紙選挙";
  H.Data.Config.bestEndingId = "ending_final_true_map";
  H.Data.Config.finalChapterLabel = "第一部完結版";

  upsertMany(H.Data.Config.districts, [
  {
    "id": "core",
    "name": "評議会中枢",
    "shortName": "中枢",
    "fear": 70,
    "security": 34,
    "trust": 24,
    "rumorPressure": 82,
    "mapIds": [
      "council_core",
      "true_map_square",
      "outer_gate_epilogue"
    ],
    "description": "閉鎖評議・黒雨帳簿・白紙票読替の最終線が集まる灰街の制度中枢。"
  }
]);
  upsertMany(H.Data.Config.initialRumors, [
  {
    "id": "r_white_vote",
    "title": "白紙票が多数になる",
    "statement": "投票前から白紙票の多数が用意され、名前を消された住民の沈黙が賛成票として読まれている。",
    "active": false,
    "intensity": 44,
    "credibility": 52,
    "sources": [
      "東区の号外",
      "閉鎖評議の廊下"
    ],
    "district": "core",
    "tags": [
      "白紙票",
      "選挙",
      "多数決",
      "名前"
    ]
  },
  {
    "id": "r_gray_city_record",
    "title": "灰街公認記録は街そのもの",
    "statement": "公認記録にない名は存在せず、地図にない道は歩けず、多数と記されたものだけが真実になる。",
    "active": false,
    "intensity": 68,
    "credibility": 66,
    "sources": [
      "評議会中枢",
      "古い採用地図"
    ],
    "district": "core",
    "tags": [
      "公認記録",
      "灰街",
      "制度",
      "地図"
    ]
  },
  {
    "id": "r_outer_city_interest",
    "title": "外街にも同じ利息が流れている",
    "statement": "灰街で止めた黒雨の利息は、何年後か、あるいは別の時間軸の外街でまた帳簿を濡らす。",
    "active": false,
    "intensity": 25,
    "credibility": 34,
    "sources": [
      "外街郵便",
      "鏡面水路の奥"
    ],
    "district": "core",
    "tags": [
      "外街",
      "第三章",
      "時間軸",
      "公債"
    ]
  }
]);
  upsertMany(H.Data.Config.factions, [
  {
    "id": "council_core",
    "name": "閉鎖評議中枢",
    "shortName": "評議中枢",
    "influence": 72,
    "pressure": 70,
    "attitude": -22,
    "stance": "institutional_survival",
    "description": "白紙票・影地図・黒雨帳簿を個別事件ではなく制度として守ろうとする最終対立勢力。"
  },
  {
    "id": "restored_names_union",
    "name": "復名者連合",
    "shortName": "復名者",
    "influence": 24,
    "pressure": 58,
    "attitude": 10,
    "stance": "names_before_records",
    "description": "名前を消された住民と証人保護網が合流した集団。名簿復元後、最終報告の支えになる。"
  }
]);

  Object.assign(H.Data.Config.mapNodes, {
    council_core: [84, 48],
    true_map_square: [57, 48],
    outer_gate_epilogue: [91, 74]
  });
  pushTuple(H.Data.Config.mapRoutes, ["tribunal_archive", "council_core"]);
  pushTuple(H.Data.Config.mapRoutes, ["council_core", "true_map_square"]);
  pushTuple(H.Data.Config.mapRoutes, ["true_map_square", "map_archive"]);
  pushTuple(H.Data.Config.mapRoutes, ["true_map_square", "outer_gate_epilogue"]);
  H.Data.Config.firstEnterStories = H.Data.Config.firstEnterStories || {};
  Object.assign(H.Data.Config.firstEnterStories, {
    council_core: "final_council_entry",
    true_map_square: "true_map_square_entry",
    outer_gate_epilogue: "outer_gate_seed"
  });

  for (const [key, items] of Object.entries({
  "cause": [
    {
      "id": "white_vote_system",
      "title": "黒雨帳簿と白紙選挙の連動制度",
      "detail": "黒雨で消した名を白紙票へ読み替え、制度的多数を作った事件として記録する。"
    },
    {
      "id": "city_record_engine",
      "title": "灰街公認記録による現実改変制度",
      "detail": "噂・地図・名簿・投票を公認記録へ採用し、現実を歪めた第一部全体の根本原因として認定する。"
    }
  ],
  "responsible": [
    {
      "id": "council_core_network",
      "title": "閉鎖評議中枢と公認記録機関",
      "detail": "個人ではなく、評議会・監査庁・公債商・鐘楼師を束ねる採用制度そのものの責任を問う。"
    },
    {
      "id": "record_regime",
      "title": "歴代採用地図と白紙規則の制度責任",
      "detail": "過去から残った公認記録手続きが、灰獣・黒雨・白紙票を生んだと記録する。"
    }
  ],
  "policy": [
    {
      "id": "rebuild_charter",
      "title": "名前復元後、採用手順を再設計",
      "detail": "復名者の保護、段階公開、市民監査、採用地図の改版を順に実施する。最良結末候補。"
    },
    {
      "id": "burn_archive",
      "title": "採用記録を焼却して即時暴露",
      "detail": "公認記録庫を焼き、全資料を広場へ出す。真実は速いが混乱と報復が大きい。"
    },
    {
      "id": "outer_gate",
      "title": "灰街を閉じ、外街監査へ引き継ぐ",
      "detail": "灰街は第一部として収束させ、外街へ流れた利息と別時間軸の種を公式に残す。"
    }
  ]
})) {
    H.Data.Config.reportOptions[key] = H.Data.Config.reportOptions[key] || [];
    upsertMany(H.Data.Config.reportOptions[key], items);
  }

  upsertMany(H.Data.Evidence, [
  {
    "id": "e_white_vote_matrix",
    "title": "白紙票配列表",
    "icon": "票",
    "category": "document",
    "source": "評議会中枢・票倉",
    "key": true,
    "summary": "投票前から白紙票の配置数と読替先が決められている表。",
    "detail": "白紙票は空欄ではなく、消された名の権利を一時保管する欄として扱われている。配列は開票時刻より前に完成しており、結果が先に用意されていたことを示す。",
    "quote": "『空白は欠席ではない。採用可能な同意である』",
    "tags": [
      "白紙票",
      "選挙",
      "多数決",
      "事前準備"
    ],
    "truthWeight": 17
  },
  {
    "id": "e_absent_voter_registry",
    "title": "不在扱いの有権者名簿",
    "icon": "名",
    "category": "document",
    "source": "評議会中枢・名簿機関室",
    "key": true,
    "summary": "救済名簿から消えた名が、投票名簿では不在扱いにされている。",
    "detail": "同じ人物が徴税簿では存在し、救済簿では空白、投票簿では不在、公債帳では担保番号として残る。消えたのは身体ではなく、反対票を投じる権利だった。",
    "quote": "不在と書けば、反対は発生しない。",
    "tags": [
      "名前",
      "名簿",
      "選挙",
      "白票"
    ],
    "truthWeight": 16
  },
  {
    "id": "e_name_vote_converter",
    "title": "返名堂の票替え歯車",
    "icon": "歯",
    "category": "physical",
    "source": "地下票倉・名簿機関室",
    "key": true,
    "summary": "名前を白紙票へ読み替える小型機関。記憶質屋の印がある。",
    "detail": "歯車には返名堂の帳場印があり、名札番号を白紙票番号へ転写する溝が刻まれている。これは名前の質入れが、選挙結果へ接続していた物証である。",
    "quote": "名を預けるとは、声を預けることでもあった。",
    "tags": [
      "記憶質屋",
      "名前",
      "白票",
      "変換"
    ],
    "truthWeight": 15
  },
  {
    "id": "e_council_core_minutes",
    "title": "中枢評議の黒議事録",
    "icon": "議",
    "category": "document",
    "source": "評議会中枢・円卓裏",
    "key": true,
    "summary": "白紙票読替と黒雨帳簿を同じ政策として扱う議事録。",
    "detail": "議事録は『非常災害下の沈黙同意』という語で、白紙票、影地図、黒雨帳簿を一つの制度へ束ねている。署名は個人名ではなく部署印で分散されている。",
    "quote": "『市民が声を出せない場合、街は秩序を代弁する』",
    "tags": [
      "評議会",
      "承認",
      "中枢",
      "白紙票"
    ],
    "truthWeight": 18
  },
  {
    "id": "e_black_ledger_heart",
    "title": "黒雨帳簿の心臓部",
    "icon": "核",
    "category": "physical",
    "source": "評議会中枢・黒雨帳簿台",
    "key": true,
    "summary": "濡れた記録を再採用する中枢装置。停止には名簿復元鍵が要る。",
    "detail": "帳簿台の中心には、第一章の採用地図、救済名簿、投票名簿の三枚を同時に挟む機関がある。黒雨はここで『採用済み記録』として読み直される。",
    "quote": "雨は降らない。採用される。",
    "tags": [
      "帳簿",
      "黒雨",
      "機関",
      "停止"
    ],
    "truthWeight": 18
  },
  {
    "id": "e_restoration_key",
    "title": "名簿復元鍵",
    "icon": "鍵",
    "category": "physical",
    "source": "評議会中枢・復名封筒",
    "key": true,
    "summary": "消された名を、紙へ戻す前に真鍮札と証言へ同期する鍵。",
    "detail": "復元鍵は帳簿を単に巻き戻すものではない。真鍮名札、証人の声、公式地図の三つが一致した名だけを戻すため、公開前の保護手続きと不可分である。",
    "quote": "名前は紙より先に、人へ戻さなければならない。",
    "tags": [
      "名前",
      "復元",
      "真鍮",
      "証人保護"
    ],
    "truthWeight": 17
  },
  {
    "id": "e_citizen_counter_roster",
    "title": "住民側対照名簿",
    "icon": "民",
    "category": "document",
    "source": "真地図広場・復名者連合",
    "key": true,
    "summary": "公式簿から消された名を、住民の証言と真鍮札で照合した名簿。",
    "detail": "住民側の名簿は、署名ではなく互いの証言で構成されている。公認記録より弱いが、消された名を復元する最後の参照点になる。",
    "quote": "『私はこの人を知っている』という声が、紙の空白を埋める。",
    "tags": [
      "市民",
      "名簿",
      "証人",
      "復元"
    ],
    "truthWeight": 15
  },
  {
    "id": "e_gray_city_record_engine",
    "title": "灰街公認記録の機関図",
    "icon": "街",
    "category": "document",
    "source": "評議会中枢・古地図庫",
    "key": true,
    "summary": "噂、地図、名簿、投票を『公認記録』へ変換する制度図。",
    "detail": "機関図には、噂を怪異へ、地図を通行権へ、名簿を存在証明へ、投票を多数決へ変換する四つの採用門が描かれている。灰街そのものが、採用された嘘を現実化する装置だった。",
    "quote": "街は真実を覚えない。採用された記録を覚える。",
    "tags": [
      "公認記録",
      "地図",
      "制度",
      "街"
    ],
    "truthWeight": 20
  },
  {
    "id": "e_outer_city_interest_letter",
    "title": "外街利息照会書",
    "icon": "外",
    "category": "document",
    "source": "評議会中枢・未発送箱",
    "key": false,
    "summary": "灰街の黒雨公債利息が、外の都市へ流れていたことを示す照会書。",
    "detail": "宛先は外街監査局。日付は数年後にも見えるが、鏡面水路の暦では過去にも見える。第三章があるなら、時間軸そのものが証拠になる可能性を残す。",
    "quote": "『同じ雨を、別の年に送れ』",
    "tags": [
      "外街",
      "第三章",
      "公債",
      "時間軸"
    ],
    "truthWeight": 11
  },
  {
    "id": "e_parallel_patrol_badge",
    "title": "別時線の巡察章",
    "icon": "章",
    "category": "physical",
    "source": "外街門・鏡面郵便受け",
    "key": false,
    "summary": "数年後、または別時間軸の巡察官が落とした章。",
    "detail": "表の刻印はあなたのものに似ているが、裏面の採用番号が違う。灰街が救われても、同じ仕組みが別の時線で繰り返されるかもしれない。",
    "quote": "飛べなかった豚が、一度だけ空の地図を見た。",
    "tags": [
      "別時間軸",
      "巡察官",
      "外街",
      "種"
    ],
    "truthWeight": 8
  },
  {
    "id": "t_shion_precount",
    "title": "シオンの証言：開票前の多数",
    "icon": "証",
    "category": "testimony",
    "source": "仮面評議員シオン",
    "key": true,
    "summary": "白紙多数は開票前から評議会中枢で準備されていた。",
    "detail": "シオンは『市民が迷う時、制度は先に答えを用意する』と言う。彼の言葉は弁明だが、開票前の多数が存在したことの証言にもなる。",
    "quote": "『多数とは、数えた後に生まれるものとは限らない』",
    "tags": [
      "証言",
      "白紙票",
      "評議会",
      "多数決"
    ],
    "truthWeight": 16
  },
  {
    "id": "t_oruka_name_returned",
    "title": "オルカの証言：戻った名前",
    "icon": "証",
    "category": "testimony",
    "source": "復名者オルカ",
    "key": true,
    "summary": "名簿復元後、消された住民が自分の名で証言できるようになった。",
    "detail": "オルカは、紙へ名前が戻る前に、周囲の住民が自分を呼んだことを覚えている。名簿復元は単なるデータ修正ではなく、証人を先に守る手続きだった。",
    "quote": "『紙が私を戻したんじゃない。みんなが先に、私を呼んだ』",
    "tags": [
      "証言",
      "名前",
      "復元",
      "証人保護"
    ],
    "truthWeight": 18
  },
  {
    "id": "t_council_clerk_confession",
    "title": "中枢書記ミスカの証言",
    "icon": "証",
    "category": "testimony",
    "source": "中枢書記ミスカ",
    "key": true,
    "summary": "名簿・帳簿・票倉は別部署ではなく、一つの採用機関で接続されていた。",
    "detail": "ミスカは、白紙票を『沈黙同意』として登録し、救済名簿の空白を投票名簿へ渡す作業を命じられていた。部署が違うという説明は、責任を裂くための地図だった。",
    "quote": "『私は紙を運んだだけです。でも、その紙が人の声を消しました』",
    "tags": [
      "証言",
      "中枢",
      "名簿",
      "白紙票"
    ],
    "truthWeight": 17
  }
]);
  H.Data.EvidenceById = byId(H.Data.Evidence);

  upsertMany(H.Data.NPCs, [
  {
    "id": "shion",
    "name": "仮面評議員シオン",
    "shortName": "シオン",
    "role": "閉鎖評議中枢の代弁者",
    "mapId": "council_core",
    "x": 920,
    "y": 330,
    "initialTrust": 24,
    "glyph": "仮",
    "palette": [
      "#cab27c",
      "#3b3442",
      "#141018"
    ],
    "description": "白紙票を『秩序のための沈黙同意』として正当化する評議員。",
    "publicFace": "丁寧だが、市民を数として扱うことにためらいがない。",
    "hiddenConcern": "白紙票の多数が開票前に作られていたことを知っている。",
    "topics": [
      "白紙票",
      "多数決",
      "評議会",
      "制度"
    ]
  },
  {
    "id": "miska",
    "name": "ミスカ・ルアン",
    "shortName": "ミスカ",
    "role": "中枢書記／名簿機関室の作業者",
    "mapId": "council_core",
    "x": 560,
    "y": 760,
    "initialTrust": 38,
    "glyph": "記",
    "palette": [
      "#c2c1b4",
      "#4b555f",
      "#171b20"
    ],
    "description": "名簿・帳簿・票倉を実際につないでいた書記。命令系統の断片を知る。",
    "publicFace": "怯えており、質問の順序を間違えると黙る。",
    "hiddenConcern": "白紙票の読替作業に関与した自責がある。",
    "topics": [
      "名簿",
      "帳簿",
      "票倉",
      "証言"
    ]
  },
  {
    "id": "oruka",
    "name": "オルカ・ベン",
    "shortName": "オルカ",
    "role": "名前を取り戻した東区住民",
    "mapId": "true_map_square",
    "x": 780,
    "y": 560,
    "initialTrust": 62,
    "initialState": "hidden",
    "glyph": "戻",
    "palette": [
      "#d3c49b",
      "#4b625e",
      "#15211f"
    ],
    "description": "名簿復元後、自分の名前を自分で証言できるようになる住民。",
    "publicFace": "復元前は番号で呼ばれていた。復元後は、市民側対照名簿の中心証人になる。",
    "hiddenConcern": "自分の名前が白紙票へ読まれた瞬間を覚えている。",
    "topics": [
      "復名",
      "白紙票",
      "証人保護",
      "真地図"
    ]
  },
  {
    "id": "tomari",
    "name": "トマリ・ネウ",
    "shortName": "トマリ",
    "role": "外街郵便の配達人",
    "mapId": "outer_gate_epilogue",
    "x": 1180,
    "y": 520,
    "initialTrust": 45,
    "initialState": "hidden",
    "glyph": "郵",
    "palette": [
      "#a9c7d1",
      "#354d5a",
      "#111b22"
    ],
    "description": "何年後か、または別時間軸から届く外街郵便を持つ人物。第三章の種。",
    "publicFace": "まだ本編の事件へ深く関わらない。外の都市にも黒雨の利息が流れていると示す。",
    "hiddenConcern": "届け先の巡察官名が、あなたに似ている。",
    "topics": [
      "外街",
      "何年後",
      "別時間軸",
      "第三章"
    ]
  }
]);
  H.Data.NPCById = byId(H.Data.NPCs);

  Object.assign(H.Data.Dialogues, {
  "shion": {
    "greetings": [
      {
        "text": "「ようこそ。ここは街の意思を数へ変える場所です。個人の声が足りない時、制度が沈黙を読まなければならない」"
      }
    ],
    "topics": [
      {
        "id": "precount",
        "label": "開票前の多数を問う",
        "summary": "白紙票多数が先に用意された理由を聞く。",
        "options": [
          {
            "id": "record",
            "label": "シオンの言葉を証言として記録する",
            "response": "シオンは仮面の下で笑わない。\n\n「多数とは、開票後に見つかるものではありません。災害時には、街が先に多数を用意する。市民はそれに追いつくだけです」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_shion_precount"
              },
              {
                "type": "npcTrust",
                "id": "shion",
                "value": -6
              },
              {
                "type": "xp",
                "value": 28
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
        "id": "outer_interest",
        "label": "外街へ流れた利息",
        "summary": "灰街の外にも同じ仕組みがあるか問う。",
        "options": [
          {
            "id": "press",
            "label": "未発送照会書の宛先を追及する",
            "response": "「灰街だけを救えば満足ですか。利息は門を越えます。何年後か、別の場所で、同じ白紙がまた降るでしょう」",
            "effects": [
              {
                "type": "evidence",
                "id": "e_outer_city_interest_letter"
              },
              {
                "type": "npcTrust",
                "id": "shion",
                "value": -4
              },
              {
                "type": "rumorActivate",
                "id": "r_outer_city_interest",
                "value": true,
                "intensity": 40
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
            "once": true,
            "requires": {
              "type": "evidence",
              "id": "e_gray_city_record_engine"
            }
          }
        ]
      }
    ]
  },
  "miska": {
    "greetings": [
      {
        "text": "「私は紙を運んだだけです。……でも、その紙が人の声を運び去ったことも知っています」"
      }
    ],
    "topics": [
      {
        "id": "confess",
        "label": "名簿機関室の作業を聞く",
        "summary": "名簿・帳簿・票倉の接続を証言させる。",
        "options": [
          {
            "id": "record",
            "label": "中枢書記の証言を取る",
            "response": "ミスカは袖口を握る。\n\n「救済簿の空白は、投票簿では不在として読まれます。不在は白紙へ移され、白紙は非常時の同意へ変わる。私はその紙を、部署間で運びました」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_council_clerk_confession"
              },
              {
                "type": "evidence",
                "id": "e_absent_voter_registry"
              },
              {
                "type": "npcTrust",
                "id": "miska",
                "value": 12
              },
              {
                "type": "xp",
                "value": 32
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
        "id": "engine",
        "label": "公認記録の機関図",
        "summary": "灰街そのものの仕組みを聞く。",
        "options": [
          {
            "id": "map",
            "label": "古地図庫の場所を聞く",
            "response": "「票倉の奥に、古い機関図があります。噂が灰獣になった理由も、黒雨が帳簿を濡らす理由も、たぶん同じ図に載っています」",
            "effects": [
              {
                "type": "evidence",
                "id": "e_gray_city_record_engine"
              },
              {
                "type": "xp",
                "value": 30
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 1,
            "once": true,
            "requires": {
              "type": "deduction",
              "id": "d2_names_to_blank_votes"
            }
          }
        ]
      }
    ]
  },
  "oruka": {
    "greetings": [
      {
        "requires": {
          "type": "flag",
          "id": "names_restored"
        },
        "text": "「オルカ・ベン。今なら言えます。昨日までは、私は番号でした」"
      },
      {
        "text": "広場の人影は、まだ自分の名前を思い出せない。"
      }
    ],
    "topics": [
      {
        "id": "returned_name",
        "label": "戻った名前の証言",
        "summary": "名簿復元が何を変えたか聞く。",
        "options": [
          {
            "id": "record",
            "label": "オルカの証言を記録する",
            "response": "「紙が私を戻したんじゃない。隣の人が先に『オルカ』と呼んだ。その後で、帳簿が遅れて私を認めたんです」",
            "effects": [
              {
                "type": "evidence",
                "id": "t_oruka_name_returned"
              },
              {
                "type": "evidence",
                "id": "e_citizen_counter_roster"
              },
              {
                "type": "npcTrust",
                "id": "oruka",
                "value": 16
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
              "id": "names_restored"
            }
          }
        ]
      }
    ]
  },
  "tomari": {
    "greetings": [
      {
        "text": "「配達先は今のあなたではないかもしれません。何年後か、別の時間軸の巡察官かもしれない。でも封筒は、あなたの地図に反応しました」"
      }
    ],
    "topics": [
      {
        "id": "outer_gate",
        "label": "外街の封筒",
        "summary": "第三章の種を受け取る。",
        "options": [
          {
            "id": "receive",
            "label": "別時線の巡察章を受け取る",
            "response": "トマリは黒い縁取りの封筒を渡す。中には、あなたのものに似た巡察章がある。採用番号だけが一つ違っていた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_parallel_patrol_badge"
              },
              {
                "type": "rumorActivate",
                "id": "r_outer_city_interest",
                "value": true,
                "intensity": 44
              },
              {
                "type": "xp",
                "value": 12
              },
              {
                "type": "questEvaluate"
              }
            ],
            "timeCost": 0,
            "once": true,
            "requires": {
              "type": "flag",
              "id": "chapter_complete"
            }
          }
        ]
      }
    ]
  }
});

  Object.assign(H.Data.Maps, {
  "council_core": {
    "id": "council_core",
    "name": "評議会中枢・白紙票倉",
    "district": "core",
    "flavor": "投票箱ではなく、名簿と帳簿と地図を同時に読む機関室。白紙の紙片が雨のように舞う。",
    "width": 1840,
    "height": 1180,
    "spawn": {
      "x": 170,
      "y": 600
    },
    "initialUnlocked": false,
    "colors": {
      "ground": "#37363c",
      "road": "#6a6466",
      "wall": "#16161c",
      "accent": "#d2b16b",
      "fog": "#889098"
    },
    "ambient": {
      "rain": 0.66,
      "fog": 0.26,
      "lamps": 0.76,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1840,
        "h": 1180,
        "type": "stone"
      },
      {
        "x": 190,
        "y": 500,
        "w": 1460,
        "h": 240,
        "type": "road"
      },
      {
        "x": 780,
        "y": 110,
        "w": 280,
        "h": 970,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1840,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 1090,
        "w": 1840,
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
        "x": 1750,
        "y": 0,
        "w": 90,
        "h": 1180,
        "kind": "wall"
      },
      {
        "x": 340,
        "y": 170,
        "w": 330,
        "h": 190,
        "kind": "shelf",
        "label": "不在名簿棚"
      },
      {
        "x": 1170,
        "y": 160,
        "w": 360,
        "h": 200,
        "kind": "sealDoor",
        "label": "黒議事録庫"
      },
      {
        "x": 710,
        "y": 430,
        "w": 420,
        "h": 240,
        "kind": "table",
        "label": "白紙票配列卓"
      },
      {
        "x": 1220,
        "y": 760,
        "w": 380,
        "h": 180,
        "kind": "machine",
        "label": "帳簿心臓部"
      }
    ],
    "decorations": [
      {
        "type": "rug",
        "x": 760,
        "y": 720,
        "w": 520,
        "h": 260
      },
      {
        "type": "paperStack",
        "x": 920,
        "y": 540,
        "count": 12
      },
      {
        "type": "banner",
        "x": 920,
        "y": 114,
        "text": "沈黙は、誰の票として数えられるのか"
      },
      {
        "type": "mapTable",
        "x": 1460,
        "y": 850,
        "w": 360,
        "h": 90
      }
    ],
    "exits": [
      {
        "id": "ex_core_tribunal",
        "x": 95,
        "y": 600,
        "radius": 90,
        "targetMap": "tribunal_archive",
        "targetX": 1510,
        "targetY": 610,
        "prompt": "臨時評議院の封印資料庫へ戻る",
        "label": "評議院"
      },
      {
        "id": "ex_core_square",
        "x": 920,
        "y": 1085,
        "radius": 92,
        "targetMap": "true_map_square",
        "targetX": 880,
        "targetY": 170,
        "prompt": "真地図広場へ降りる",
        "label": "真地図広場",
        "condition": {
          "type": "flag",
          "id": "names_restored"
        },
        "lockedText": "名前復元を行うまで、広場への線は白紙のまま。"
      }
    ],
    "hotspots": [
      {
        "id": "hs_core_ballots",
        "x": 860,
        "y": 540,
        "radius": 80,
        "title": "白紙票配列卓",
        "prompt": "白紙票の配列表を読む",
        "description": "開票前の時刻が押された配列表。空白欄に人数が書き込まれている。",
        "visual": "paper",
        "actions": [
          {
            "id": "take",
            "label": "白紙票配列表を保全する",
            "detail": "開票前の多数を記録する",
            "timeCost": 1,
            "successText": "白紙多数は開票結果ではなく、配列結果だった。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_white_vote_matrix"
              },
              {
                "type": "rumorActivate",
                "id": "r_white_vote",
                "value": true,
                "intensity": 62
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
        ]
      },
      {
        "id": "hs_core_absent_registry",
        "x": 450,
        "y": 390,
        "radius": 80,
        "title": "不在扱いの名簿棚",
        "prompt": "不在名簿を照合する",
        "description": "救済名簿で空白になった名が、投票名簿では不在扱いで束ねられている。",
        "visual": "documents",
        "actions": [
          {
            "id": "copy",
            "label": "不在扱いの有権者名簿を写す",
            "detail": "消えた名前と白紙票の接続を見る",
            "timeCost": 1,
            "successText": "反対しそうな住民ほど、名簿上は投票前に不在へ移されていた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_absent_voter_registry"
              },
              {
                "type": "xp",
                "value": 32
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_core_converter",
        "x": 620,
        "y": 760,
        "radius": 80,
        "title": "票替え歯車",
        "prompt": "返名堂の票替え歯車を調べる",
        "description": "名札番号を白紙票番号へ写す機械。返名堂の印が残っている。",
        "visual": "metal",
        "actions": [
          {
            "id": "take",
            "label": "票替え歯車を差し押さえる",
            "detail": "名前を票に変える機関を押収する",
            "timeCost": 1,
            "successText": "記憶質屋は借金だけでなく、沈黙を票へ流していた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_name_vote_converter"
              },
              {
                "type": "xp",
                "value": 34
              },
              {
                "type": "questEvaluate"
              }
            ],
            "requires": {
              "type": "evidence",
              "id": "e_absent_voter_registry"
            },
            "lockedText": "先に不在名簿を照合する必要がある。"
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_absent_voter_registry"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_core_minutes",
        "x": 1300,
        "y": 380,
        "radius": 80,
        "title": "中枢評議の黒議事録",
        "prompt": "黒議事録を読む",
        "description": "部署印で分散された責任を、一枚の黒い議事録がつないでいる。",
        "visual": "documents",
        "actions": [
          {
            "id": "read",
            "label": "黒議事録を保全する",
            "detail": "白紙票と黒雨帳簿の同一政策を確認",
            "timeCost": 1,
            "successText": "白紙票読替、影地図、黒雨帳簿は、個別犯行ではなく中枢政策として束ねられていた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_council_core_minutes"
              },
              {
                "type": "xp",
                "value": 38
              },
              {
                "type": "questEvaluate"
              }
            ],
            "requires": {
              "type": "deduction",
              "id": "d2_white_election_prepared"
            }
          }
        ],
        "condition": {
          "type": "deduction",
          "id": "d2_white_election_prepared"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_core_heart",
        "x": 1410,
        "y": 840,
        "radius": 92,
        "title": "黒雨帳簿の心臓部",
        "prompt": "黒雨帳簿台を調べる",
        "description": "名簿・地図・投票簿を同時に挟む台。黒雨はここで再採用される。",
        "visual": "ledger",
        "actions": [
          {
            "id": "inspect",
            "label": "帳簿の心臓部を記録する",
            "detail": "停止条件を調べる",
            "timeCost": 1,
            "successText": "停止には、紙を乾かすのではなく、名前を先に戻す鍵が必要だ。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_black_ledger_heart"
              },
              {
                "type": "evidence",
                "id": "e_restoration_key"
              },
              {
                "type": "xp",
                "value": 42
              },
              {
                "type": "questEvaluate"
              }
            ],
            "requires": {
              "type": "deduction",
              "id": "d2_names_to_blank_votes"
            }
          }
        ],
        "condition": {
          "type": "deduction",
          "id": "d2_names_to_blank_votes"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_core_record_engine",
        "x": 1120,
        "y": 760,
        "radius": 84,
        "title": "灰街公認記録の機関図",
        "prompt": "古い機関図を写す",
        "description": "噂、地図、名簿、投票を現実化する四つの採用門が描かれている。",
        "visual": "map",
        "actions": [
          {
            "id": "copy",
            "label": "公認記録機関図を写す",
            "detail": "街そのものの仕組みを押さえる",
            "timeCost": 1,
            "successText": "灰街は真実ではなく、採用された記録を現実にする街だった。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_gray_city_record_engine"
              },
              {
                "type": "rumorActivate",
                "id": "r_gray_city_record",
                "value": true,
                "intensity": 72
              },
              {
                "type": "xp",
                "value": 44
              },
              {
                "type": "questEvaluate"
              }
            ],
            "requires": {
              "type": "deduction",
              "id": "d2_council_authorized_shadow_map"
            }
          }
        ],
        "condition": {
          "type": "deduction",
          "id": "d2_council_authorized_shadow_map"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_core_outer_letter",
        "x": 1530,
        "y": 305,
        "radius": 72,
        "title": "未発送の外街照会書",
        "prompt": "外街への照会書を読む",
        "description": "灰街の利息が外の都市へ流れている。日付は何年後にも、別の時線にも見える。",
        "visual": "paper",
        "actions": [
          {
            "id": "read",
            "label": "外街利息照会書を保全する",
            "detail": "第三章の種を記録する",
            "timeCost": 1,
            "successText": "灰街で止めた仕組みは、街の外ではまだ利息を生んでいる。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_outer_city_interest_letter"
              },
              {
                "type": "rumorActivate",
                "id": "r_outer_city_interest",
                "value": true,
                "intensity": 38
              },
              {
                "type": "xp",
                "value": 24
              },
              {
                "type": "questEvaluate"
              }
            ],
            "requires": {
              "type": "evidence",
              "id": "e_gray_city_record_engine"
            }
          }
        ],
        "condition": {
          "type": "evidence",
          "id": "e_gray_city_record_engine"
        },
        "hiddenUntilAvailable": true
      },
      {
        "id": "hs_core_restore_names",
        "x": 1410,
        "y": 930,
        "radius": 92,
        "title": "名前復元機構",
        "prompt": "消えた名前を復元する",
        "description": "復元鍵を黒雨帳簿台へ差し込み、紙へ戻す前に真鍮札と住民証言へ同期する。",
        "visual": "seal",
        "actions": [
          {
            "id": "restore",
            "label": "名前復元を実行する",
            "detail": "名簿を戻し、証人を先に残す",
            "timeCost": 1,
            "successText": "紙の空白より先に、人々の声が戻った。真地図広場への線が乾いていく。",
            "effects": [
              {
                "type": "flag",
                "id": "names_restored",
                "value": true
              },
              {
                "type": "flag",
                "id": "black_ledger_stopped",
                "value": true
              },
              {
                "type": "mapUnlock",
                "id": "true_map_square"
              },
              {
                "type": "npcState",
                "id": "oruka",
                "path": "state",
                "value": "available"
              },
              {
                "type": "npcMove",
                "id": "oruka",
                "mapId": "true_map_square",
                "x": 780,
                "y": 560
              },
              {
                "type": "faction",
                "id": "restored_names_union",
                "path": "influence",
                "value": 18
              },
              {
                "type": "faction",
                "id": "council_core",
                "path": "pressure",
                "value": 12
              },
              {
                "type": "world",
                "path": "publicTrust",
                "value": 8
              },
              {
                "type": "district",
                "id": "core",
                "path": "fear",
                "value": -9
              },
              {
                "type": "story",
                "id": "name_restoration"
              },
              {
                "type": "questEvaluate"
              }
            ],
            "requires": {
              "type": "deduction",
              "id": "d2_ledger_can_be_stopped_by_restoration"
            }
          }
        ],
        "condition": {
          "type": "deduction",
          "id": "d2_ledger_can_be_stopped_by_restoration"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": []
  },
  "true_map_square": {
    "id": "true_map_square",
    "name": "真地図広場・復名の階段",
    "district": "core",
    "flavor": "戻った名前が、紙ではなく人の声で読み上げられる広場。灰街そのものの噂が中央に立つ。",
    "width": 1720,
    "height": 1120,
    "spawn": {
      "x": 880,
      "y": 180
    },
    "initialUnlocked": false,
    "colors": {
      "ground": "#3c403e",
      "road": "#686a62",
      "wall": "#151a18",
      "accent": "#d8bd78",
      "fog": "#86948f"
    },
    "ambient": {
      "rain": 0.36,
      "fog": 0.22,
      "lamps": 0.82,
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
        "x": 240,
        "y": 450,
        "w": 1240,
        "h": 260,
        "type": "road"
      },
      {
        "x": 740,
        "y": 120,
        "w": 260,
        "h": 900,
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
        "x": 260,
        "y": 190,
        "w": 360,
        "h": 170,
        "kind": "shelf",
        "label": "住民名簿台"
      },
      {
        "x": 1100,
        "y": 180,
        "w": 360,
        "h": 170,
        "kind": "table",
        "label": "最終報告卓"
      },
      {
        "x": 700,
        "y": 520,
        "w": 320,
        "h": 190,
        "kind": "fountain",
        "label": "復名の井戸"
      }
    ],
    "decorations": [
      {
        "type": "rug",
        "x": 610,
        "y": 705,
        "w": 500,
        "h": 250
      },
      {
        "type": "banner",
        "x": 860,
        "y": 108,
        "text": "名前は、記録より先に人へ戻る"
      },
      {
        "type": "mapTable",
        "x": 1280,
        "y": 270,
        "w": 330,
        "h": 80
      },
      {
        "type": "paperStack",
        "x": 430,
        "y": 275,
        "count": 9
      }
    ],
    "exits": [
      {
        "id": "ex_square_core",
        "x": 880,
        "y": 95,
        "radius": 90,
        "targetMap": "council_core",
        "targetX": 920,
        "targetY": 1010,
        "prompt": "評議会中枢へ戻る",
        "label": "中枢"
      },
      {
        "id": "ex_square_archive",
        "x": 1625,
        "y": 620,
        "radius": 90,
        "targetMap": "map_archive",
        "targetX": 960,
        "targetY": 470,
        "prompt": "地図院へ戻る",
        "label": "地図院"
      },
      {
        "id": "ex_square_outer",
        "x": 1450,
        "y": 1010,
        "radius": 94,
        "targetMap": "outer_gate_epilogue",
        "targetX": 260,
        "targetY": 560,
        "prompt": "外街門へ向かう",
        "label": "外街門",
        "condition": {
          "type": "flag",
          "id": "chapter_complete"
        },
        "lockedText": "終局報告後にだけ、外街へ続く余白が開く。"
      }
    ],
    "hotspots": [
      {
        "id": "hs_square_counter_roster",
        "x": 440,
        "y": 280,
        "radius": 78,
        "title": "住民側対照名簿",
        "prompt": "復名者の名簿を確認する",
        "description": "住民が互いの名前を証言し、公式簿の空白を埋めている。",
        "visual": "documents",
        "actions": [
          {
            "id": "record",
            "label": "住民側対照名簿を記録する",
            "detail": "復名の根拠を保全する",
            "timeCost": 1,
            "successText": "証人同士の確認が、公式簿より早く名前を戻していた。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_citizen_counter_roster"
              },
              {
                "type": "xp",
                "value": 34
              },
              {
                "type": "questEvaluate"
              }
            ]
          }
        ]
      },
      {
        "id": "hs_square_final_report",
        "x": 1280,
        "y": 270,
        "radius": 88,
        "title": "終局報告卓",
        "prompt": "第一部の最終報告を書く",
        "description": "第一章と第二章を通じて、灰街の嘘をどの記録へ固定するか決める。",
        "visual": "seal",
        "actions": [
          {
            "id": "open",
            "label": "終局報告へ進む",
            "detail": "最終報告とエピローグ分岐へ進む",
            "timeCost": 0,
            "successText": "地図院印と復名者の名札が並ぶ。灰街の公式記録を、最後にどう書き換えるか。",
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
          "id": "final_report_unlocked"
        },
        "hiddenUntilAvailable": true
      }
    ],
    "encounters": [
      {
        "id": "enc_gray_city_record",
        "x": 860,
        "y": 610,
        "radius": 110,
        "enemyId": "gray_city_record",
        "prompt": "灰街そのものと対峙する",
        "label": "公認記録",
        "condition": {
          "all": [
            {
              "type": "deduction",
              "id": "d2_final_truth_map"
            },
            {
              "not": {
                "type": "flag",
                "id": "gray_city_confronted"
              }
            }
          ]
        }
      }
    ]
  },
  "outer_gate_epilogue": {
    "id": "outer_gate_epilogue",
    "name": "外街門・何年後かの郵便受け",
    "district": "core",
    "flavor": "灰街の外へ続く門。終わった物語の向こうで、別の時刻の封筒が鳴っている。",
    "width": 1560,
    "height": 960,
    "spawn": {
      "x": 260,
      "y": 560
    },
    "initialUnlocked": false,
    "colors": {
      "ground": "#333b40",
      "road": "#60676a",
      "wall": "#12181c",
      "accent": "#91bdd1",
      "fog": "#9baeb5"
    },
    "ambient": {
      "rain": 0.18,
      "fog": 0.3,
      "lamps": 0.55,
      "surface": "stone"
    },
    "surfaces": [
      {
        "x": 0,
        "y": 0,
        "w": 1560,
        "h": 960,
        "type": "stone"
      },
      {
        "x": 160,
        "y": 430,
        "w": 1240,
        "h": 220,
        "type": "road"
      }
    ],
    "obstacles": [
      {
        "x": 0,
        "y": 0,
        "w": 1560,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 870,
        "w": 1560,
        "h": 90,
        "kind": "wall"
      },
      {
        "x": 0,
        "y": 0,
        "w": 90,
        "h": 960,
        "kind": "wall"
      },
      {
        "x": 1470,
        "y": 0,
        "w": 90,
        "h": 960,
        "kind": "wall"
      },
      {
        "x": 1080,
        "y": 300,
        "w": 240,
        "h": 300,
        "kind": "sealDoor",
        "label": "外街門"
      },
      {
        "x": 420,
        "y": 280,
        "w": 300,
        "h": 170,
        "kind": "table",
        "label": "郵便受け"
      }
    ],
    "decorations": [
      {
        "type": "banner",
        "x": 780,
        "y": 110,
        "text": "何年後、あるいは別の時間軸へ"
      },
      {
        "type": "paperStack",
        "x": 570,
        "y": 365,
        "count": 5
      }
    ],
    "exits": [
      {
        "id": "ex_outer_square",
        "x": 90,
        "y": 560,
        "radius": 90,
        "targetMap": "true_map_square",
        "targetX": 1450,
        "targetY": 980,
        "prompt": "真地図広場へ戻る",
        "label": "広場"
      }
    ],
    "hotspots": [
      {
        "id": "hs_outer_parallel_badge",
        "x": 560,
        "y": 360,
        "radius": 84,
        "title": "鏡面郵便受け",
        "prompt": "何年後かの封筒を開く",
        "description": "灰街の採用番号ではない巡察章と、外街利息照会書の写しが届いている。",
        "visual": "paper",
        "actions": [
          {
            "id": "open",
            "label": "別時線の巡察章を記録する",
            "detail": "第三章の種を残す",
            "timeCost": 0,
            "successText": "これは続編の約束ではなく、灰街の外にも同じ構造があり得るという余白だ。",
            "effects": [
              {
                "type": "evidence",
                "id": "e_parallel_patrol_badge"
              },
              {
                "type": "npcState",
                "id": "tomari",
                "path": "state",
                "value": "available"
              },
              {
                "type": "rumorActivate",
                "id": "r_outer_city_interest",
                "value": true,
                "intensity": 44
              },
              {
                "type": "questEvaluate"
              }
            ],
            "repeatable": false
          }
        ]
      }
    ],
    "encounters": []
  }
});
  H.Data.MapList = Object.values(H.Data.Maps);
  const tribunal = H.Data.Maps.tribunal_archive;
  if (tribunal) pushUnique(tribunal.exits, {"id": "ex_tribunal_core", "x": 1510, "y": 600, "radius": 90, "targetMap": "council_core", "targetX": 170, "targetY": 600, "prompt": "評議会中枢へ進む", "label": "中枢", "condition": {"type": "flag", "id": "council_core_unlocked"}, "lockedText": "第二章全体像を固定するまで、中枢への線は閉じている。"}, "id");
  const archive = H.Data.Maps.map_archive;
  if (archive) {
    pushUnique(archive.exits, {"id": "ex_archive_true_square", "x": 450, "y": 880, "radius": 82, "targetMap": "true_map_square", "targetX": 1620, "targetY": 620, "prompt": "真地図広場へ向かう", "label": "真地図広場", "condition": {"type": "flag", "id": "names_restored"}, "lockedText": "名前復元後に開く線。"}, "id");
    const reportHotspot = archive.hotspots?.find((h) => h.id === "hs_archive_report");
    if (reportHotspot) {
      reportHotspot.title = "終局報告卓";
      reportHotspot.prompt = "第一部の最終報告を書く";
      reportHotspot.description = "第一章から第二章後半までを統合し、灰街の公認記録を最終的に書き換える卓。";
      reportHotspot.condition = { type: "flag", id: "final_report_unlocked" };
      const open = reportHotspot.actions?.find((a) => a.id === "open");
      if (open) {
        open.label = "終局報告へ進む";
        open.detail = "最終報告とエピローグ分岐へ進む";
        open.successText = "第一章と第二章の採用記録が重なる。最後に、灰街へ何を残すか決める。";
      }
    }
  }

  upsertMany(H.Data.Deductions, [
  {
    "id": "d2_white_election_prepared",
    "title": "白紙選挙の多数は開票前から準備されていた",
    "shortTitle": "白紙多数＝事前配列",
    "chapter": "終局",
    "slots": 3,
    "question": "白紙票多数は、市民が投じた結果なのか。",
    "availability": {
      "all": [
        {
          "type": "deduction",
          "id": "d2_complete_second_case"
        },
        {
          "type": "evidence",
          "id": "e_white_vote_matrix"
        }
      ]
    },
    "groups": [
      [
        "e_white_vote_matrix",
        "t_shion_precount"
      ],
      [
        "e_council_vote_scrap",
        "t_enja_closed_vote"
      ],
      [
        "e_final_map_negative",
        "e_duplicate_notice"
      ]
    ],
    "result": "白紙多数は開票後の集計ではなく、黒雨前に配置された読替表だった。非常措置という名で、反対票になり得る沈黙を先に多数へ変えていた。",
    "shortResult": "多数は、数える前に作られていた。",
    "failureHints": [
      "同じ種類の資料だけでは足りない。物証、名簿、証言、制度承認を分けて組み合わせる。",
      "白紙票は空欄ではなく、消された名前を読む装置として考える。",
      "第一章の採用地図と第二章の帳簿を切り離さない。公式記録が何を現実化したかを見る。"
    ],
    "tags": [
      "白紙票",
      "選挙",
      "多数決",
      "事前準備"
    ],
    "truthValue": 96,
    "rewards": {
      "xp": 46,
      "truthTokens": 2
    },
    "effects": [
      {
        "type": "flag",
        "id": "white_election_explained",
        "value": true
      },
      {
        "type": "rumorActivate",
        "id": "r_white_vote",
        "value": true,
        "intensity": 70
      },
      {
        "type": "faction",
        "id": "council_core",
        "path": "pressure",
        "value": 8
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_complete_second_case"
    ]
  },
  {
    "id": "d2_names_to_blank_votes",
    "title": "消えた名前は白紙票へ読替えられていた",
    "shortTitle": "名前＝白紙票化",
    "chapter": "終局",
    "slots": 3,
    "question": "名簿から消えた名前は、投票でどう扱われたのか。",
    "availability": {
      "all": [
        {
          "type": "deduction",
          "id": "d2_white_election_prepared"
        },
        {
          "type": "evidence",
          "id": "e_absent_voter_registry"
        },
        {
          "type": "evidence",
          "id": "e_name_vote_converter"
        }
      ]
    },
    "groups": [
      [
        "e_absent_voter_registry",
        "e_erased_tax_roll",
        "t_lio_name_erasure"
      ],
      [
        "e_name_vote_converter",
        "e_name_anchor_tags"
      ],
      [
        "e_gray_bond_certificate",
        "e_wet_ledger_page",
        "e_absent_voter_registry"
      ]
    ],
    "result": "消えた名前は未登録ではなく、不在扱いとして束ねられ、返名堂の票替え歯車を通じて白紙票へ読替えられていた。奪われたのは救済権だけでなく、反対する権利だった。",
    "shortResult": "名前の消失は、沈黙の票化だった。",
    "failureHints": [
      "同じ種類の資料だけでは足りない。物証、名簿、証言、制度承認を分けて組み合わせる。",
      "白紙票は空欄ではなく、消された名前を読む装置として考える。",
      "第一章の採用地図と第二章の帳簿を切り離さない。公式記録が何を現実化したかを見る。"
    ],
    "tags": [
      "名前",
      "白紙票",
      "記憶質屋",
      "変換"
    ],
    "truthValue": 98,
    "rewards": {
      "xp": 50,
      "truthTokens": 2
    },
    "effects": [
      {
        "type": "flag",
        "id": "blank_vote_name_erasure_fixed",
        "value": true
      },
      {
        "type": "rumor",
        "id": "r_white_vote",
        "path": "credibility",
        "value": 10
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_white_election_prepared",
      "d2_names_erased_for_collateral"
    ]
  },
  {
    "id": "d2_ledger_can_be_stopped_by_restoration",
    "title": "黒雨帳簿は名前復元で停止できる",
    "shortTitle": "帳簿停止＝復名先行",
    "chapter": "終局",
    "slots": 3,
    "question": "黒雨帳簿を止めるには、何を先に戻すべきか。",
    "availability": {
      "all": [
        {
          "type": "deduction",
          "id": "d2_names_to_blank_votes"
        },
        {
          "type": "evidence",
          "id": "e_black_ledger_heart"
        },
        {
          "type": "evidence",
          "id": "e_restoration_key"
        }
      ]
    },
    "groups": [
      [
        "e_black_ledger_heart",
        "e_false_budget_loop"
      ],
      [
        "e_restoration_key",
        "e_name_anchor_tags"
      ],
      [
        "t_mira_rescued_statement",
        "t_council_clerk_confession"
      ]
    ],
    "result": "黒雨帳簿は紙の乾燥では止まらない。消された名を真鍮札と証言で先に固定し、その後で名簿へ戻すことで、白紙票と公債担保への再流入を止められる。",
    "shortResult": "紙より先に人へ名前を戻す。",
    "failureHints": [
      "同じ種類の資料だけでは足りない。物証、名簿、証言、制度承認を分けて組み合わせる。",
      "白紙票は空欄ではなく、消された名前を読む装置として考える。",
      "第一章の採用地図と第二章の帳簿を切り離さない。公式記録が何を現実化したかを見る。"
    ],
    "tags": [
      "帳簿",
      "復元",
      "名前",
      "証人保護"
    ],
    "truthValue": 99,
    "rewards": {
      "xp": 54,
      "truthTokens": 2
    },
    "effects": [
      {
        "type": "flag",
        "id": "ledger_shutdown_plan_fixed",
        "value": true
      },
      {
        "type": "notify",
        "title": "名前復元の準備完了",
        "text": "評議会中枢の黒雨帳簿台で、消えた名前を戻せる。",
        "icon": "名",
        "tone": "success"
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_names_to_blank_votes",
      "d2_bell_foundry_amplifies_revision"
    ]
  },
  {
    "id": "d2_graycity_official_record_is_engine",
    "title": "灰街は公認記録を現実化する制度装置である",
    "shortTitle": "灰街＝公認記録機関",
    "chapter": "終局",
    "slots": 4,
    "question": "灰街で噂、地図、名簿、投票が現実を変える根本原因は何か。",
    "availability": {
      "all": [
        {
          "type": "deduction",
          "id": "d2_ledger_can_be_stopped_by_restoration"
        },
        {
          "type": "evidence",
          "id": "e_gray_city_record_engine"
        },
        {
          "type": "evidence",
          "id": "e_council_core_minutes"
        }
      ]
    },
    "groups": [
      [
        "e_gray_city_record_engine",
        "e_true_map_copy"
      ],
      [
        "e_council_core_minutes",
        "e_council_vote_scrap",
        "t_shion_precount"
      ],
      [
        "e_final_map_negative",
        "e_shadow_map_key"
      ],
      [
        "e_mira_audit_core",
        "t_mira_rescued_statement"
      ]
    ],
    "result": "灰街は嘘そのものではなく、公認記録として採用された嘘を現実へ変える制度装置だった。灰獣、黒雨、白紙票は別事件ではなく、同じ採用機関の異なる出力である。",
    "shortResult": "敵は個別犯人ではなく、公認記録の採用機関。",
    "failureHints": [
      "同じ種類の資料だけでは足りない。物証、名簿、証言、制度承認を分けて組み合わせる。",
      "白紙票は空欄ではなく、消された名前を読む装置として考える。",
      "第一章の採用地図と第二章の帳簿を切り離さない。公式記録が何を現実化したかを見る。"
    ],
    "tags": [
      "公認記録",
      "地図",
      "制度",
      "街"
    ],
    "truthValue": 100,
    "rewards": {
      "xp": 68,
      "truthTokens": 3
    },
    "effects": [
      {
        "type": "flag",
        "id": "gray_city_engine_fixed",
        "value": true
      },
      {
        "type": "rumorActivate",
        "id": "r_gray_city_record",
        "value": true,
        "intensity": 78
      },
      {
        "type": "mapUnlock",
        "id": "true_map_square"
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_council_authorized_shadow_map",
      "d2_ledger_can_be_stopped_by_restoration"
    ]
  },
  {
    "id": "d2_final_truth_map",
    "title": "灰街の嘘は、噂ではなく公認記録によって維持されていた",
    "shortTitle": "最終推理：嘘の地図",
    "chapter": "終局",
    "slots": 4,
    "question": "第一章と第二章を通じて、街へ最後に何を記録すべきか。",
    "availability": {
      "all": [
        {
          "type": "deduction",
          "id": "d2_graycity_official_record_is_engine"
        },
        {
          "type": "flag",
          "id": "names_restored"
        },
        {
          "type": "evidence",
          "id": "e_citizen_counter_roster"
        },
        {
          "type": "evidence",
          "id": "t_oruka_name_returned"
        }
      ]
    },
    "groups": [
      [
        "e_gray_city_record_engine",
        "e_true_map_copy"
      ],
      [
        "e_citizen_counter_roster",
        "t_oruka_name_returned",
        "e_restoration_key"
      ],
      [
        "e_council_core_minutes",
        "e_white_vote_matrix",
        "t_shion_precount"
      ],
      [
        "e_outer_city_interest_letter",
        "e_mira_audit_core",
        "t_mira_rescued_statement"
      ]
    ],
    "result": "灰街の嘘は、噂の量ではなく、誰の声を公式記録へ採用するかで維持されていた。だから最終報告は、黒幕を名指すだけでは足りない。名前を戻し、証人を守り、記録の採用手順そのものを変える必要がある。",
    "shortResult": "嘘の地図は、採用手順ごと書き換える。",
    "failureHints": [
      "同じ種類の資料だけでは足りない。物証、名簿、証言、制度承認を分けて組み合わせる。",
      "白紙票は空欄ではなく、消された名前を読む装置として考える。",
      "第一章の採用地図と第二章の帳簿を切り離さない。公式記録が何を現実化したかを見る。"
    ],
    "tags": [
      "公認記録",
      "全体像",
      "段階公開",
      "第一章"
    ],
    "truthValue": 100,
    "rewards": {
      "xp": 84,
      "truthTokens": 4
    },
    "effects": [
      {
        "type": "flag",
        "id": "final_truth_map_fixed",
        "value": true
      },
      {
        "type": "notify",
        "title": "最終噂戦が発生",
        "text": "真地図広場で『灰街そのもの』と対峙できる。",
        "icon": "街",
        "tone": "warning"
      },
      {
        "type": "questEvaluate"
      }
    ],
    "requiredDeductions": [
      "d2_complete_second_case",
      "d2_white_election_prepared",
      "d2_names_to_blank_votes",
      "d2_graycity_official_record_is_engine"
    ]
  }
]);
  H.Data.DeductionById = byId(H.Data.Deductions);

  const complete = H.Data.DeductionById.d2_complete_second_case;
  if (complete) {
    complete.title = "黒雨事件の全体像を固定し、評議会中枢への線を開く";
    complete.shortTitle = "第二章前半全体像";
    complete.result = "黒雨事件は、救済名簿を公債担保へ移し、影地図で管轄を裂き、黒鐘で公式記録を濡らし、非常措置を利益循環へ変える制度的な記録災害だった。だが、この全体像はまだ前半に過ぎない。評議会中枢で、白紙票と灰街公認記録の機関を暴く必要がある。";
    complete.shortResult = "評議会中枢への線が開く。";
    complete.effects = [
      { type: "flag", id: "council_core_unlocked", value: true },
      { type: "mapUnlock", id: "council_core" },
      { type: "story", id: "final_council_unlocked" },
      { type: "world", path: "publicTrust", value: 5 },
      { type: "questEvaluate" },
      { type: "notify", title: "評議会中枢が開いた", text: "臨時評議院から白紙票倉へ進める。", icon: "議", tone: "success" }
    ];
  }

  upsertMany(H.Data.Enemies, [
  {
    "id": "gray_city_record",
    "name": "灰街公認記録",
    "subtitle": "噂・地図・名簿・投票を現実化してきた、街そのものの制度怪異",
    "glyph": "街",
    "color": "#6b6f72",
    "glow": "#d2bd86",
    "maxIntegrity": 240,
    "baseAttack": 12,
    "basePanic": 12,
    "intro": "真地図広場の中央で、街路灯、投票箱、帳簿台、古い地図が一つの影になる。『記録にない者は存在しない』――灰街そのものが、あなたの報告を読み上げる。",
    "phases": [
      {
        "threshold": 0.74,
        "claim": "記録にない者は存在しない。",
        "weaknessTags": [
          "名前",
          "復元",
          "真鍮",
          "証人保護"
        ],
        "resistedTags": [
          "市場",
          "天罰"
        ]
      },
      {
        "threshold": 0.48,
        "claim": "多数と記されたものが真実である。",
        "weaknessTags": [
          "白紙票",
          "選挙",
          "多数決",
          "中枢"
        ],
        "resistedTags": [
          "物質"
        ]
      },
      {
        "threshold": 0.22,
        "claim": "地図にない道は歩けない。",
        "weaknessTags": [
          "地図",
          "影地図",
          "避難",
          "外街"
        ],
        "resistedTags": [
          "名前"
        ]
      },
      {
        "threshold": 0,
        "claim": "街を救うには、採用された嘘も必要だ。",
        "weaknessTags": [
          "公認記録",
          "全体像",
          "段階公開",
          "第一章"
        ],
        "resistedTags": [
          "単独責任"
        ]
      }
    ],
    "attacks": [
      {
        "text": "古い採用印が押され、あなたの証拠名が一瞬だけ空白になる。",
        "damage": 13,
        "panic": 11
      },
      {
        "text": "白紙票の束が広場を覆い、誰の沈黙か分からなくする。",
        "damage": 12,
        "panic": 14
      },
      {
        "text": "地図の線が足元から外れ、歩いてきた道を存在しないことにする。",
        "damage": 14,
        "panic": 10
      },
      {
        "text": "『秩序』という言葉が、救えなかった名前の上に重く置かれる。",
        "damage": 15,
        "panic": 12
      }
    ],
    "observeLines": [
      "第一段階は存在否定。復名者の証言と真鍮札を使い、紙より先に人がいることを示す。",
      "第二段階は多数決。白紙票が事前配列だったことを固定する。",
      "第三段階は地図。第一章の採用地図と影地図の矛盾が効く。",
      "最後は秩序の誘惑。全面破壊ではなく、採用手順を書き換える最終推理をぶつける。"
    ],
    "victory": "灰街公認記録は、街そのものではなく、街を支配していた採用手順だったと暴かれた。広場の石畳に、戻った名前で新しい地図線が引かれる。",
    "defeat": "灰街の声に押され、公式記録は再び人より重くなる。復名者は残るが、終局報告にはさらに証拠の重みが必要だ。",
    "rewards": {
      "xp": 96,
      "trust": 12,
      "rumorReduction": 24
    },
    "effects": [
      {
        "type": "flag",
        "id": "gray_city_confronted",
        "value": true
      },
      {
        "type": "flag",
        "id": "final_report_unlocked",
        "value": true
      },
      {
        "type": "flag",
        "id": "report_unlocked",
        "value": true
      },
      {
        "type": "mapUnlock",
        "id": "outer_gate_epilogue"
      },
      {
        "type": "npcState",
        "id": "tomari",
        "path": "state",
        "value": "available"
      },
      {
        "type": "world",
        "path": "publicTrust",
        "value": 10
      },
      {
        "type": "district",
        "id": "core",
        "path": "fear",
        "value": -18
      },
      {
        "type": "rumor",
        "id": "r_gray_city_record",
        "path": "intensity",
        "value": -28
      },
      {
        "type": "story",
        "id": "gray_city_victory"
      },
      {
        "type": "questEvaluate"
      }
    ]
  }
]);
  H.Data.EnemyById = byId(H.Data.Enemies);

  Object.assign(H.Data.StorySequences, {
  "final_council_unlocked": [
    {
      "kicker": "第二章後半",
      "title": "閉鎖評議の奥へ",
      "body": [
        "黒雨事件の全体像が固定されたことで、臨時評議院の奥にあった白い扉が乾いていく。",
        "そこにあるのは犯人の部屋ではない。多数決、名簿、帳簿、地図を同時に動かす、灰街の中枢だ。"
      ]
    }
  ],
  "final_council_entry": [
    {
      "kicker": "評議会中枢",
      "title": "白紙票倉",
      "body": [
        "扉の向こうでは、投票箱ではなく帳簿台が鳴っている。名簿と票と地図が同じ歯車で送られている。",
        "ここから先は、黒雨を止めるだけでは足りない。消えた名前を戻し、白紙票の仕組みを暴き、灰街そのものの主張と対峙する。"
      ]
    },
    {
      "kicker": "終局の問い",
      "title": "多数とは誰の声か",
      "body": [
        "シオンは言う。『市民が沈黙したなら、街が代弁する』。",
        "だが、その沈黙が作られたものなら、多数は真実ではなく、窃盗された声の束だ。"
      ]
    }
  ],
  "name_restoration": [
    {
      "kicker": "名簿復元",
      "title": "紙より先に、人へ名前を戻す",
      "body": [
        "復元鍵が黒雨帳簿台に入る。だが最初に変わったのは帳簿ではない。広場で、住民が互いの名前を呼び始めた。",
        "紙が人を戻したのではない。人が人を証言し、その後に紙が遅れて追いついた。"
      ]
    },
    {
      "kicker": "真地図広場",
      "title": "灰街そのものが立ち上がる",
      "body": [
        "名前が戻ると、採用記録の古い線が悲鳴のように鳴った。",
        "嘘の地図を描いた一人の犯人はいない。次に現れるのは、街の記録制度そのものだ。"
      ]
    }
  ],
  "true_map_square_entry": [
    {
      "kicker": "真地図広場",
      "title": "戻った名前の広場",
      "body": [
        "広場の石畳には、紙から消えた名前が真鍮色に浮かんでいる。",
        "ここで最終推理を成立させれば、灰街公認記録と対峙できる。"
      ]
    }
  ],
  "gray_city_victory": [
    {
      "kicker": "最終噂戦・勝利",
      "title": "灰街は、街そのものではなかった",
      "body": [
        "灰街公認記録の影が割れた。そこにあったのは街の魂ではなく、誰の声を採用するかを決める手順だった。",
        "手順なら変えられる。終局報告で、灰街の第一部を閉じる時が来た。"
      ]
    }
  ],
  "outer_gate_seed": [
    {
      "kicker": "エピローグの余白",
      "title": "何年後、または別の時間軸",
      "body": [
        "外街門の郵便受けに、まだ起きていないはずの監査照会が届いている。",
        "灰街の物語はここで一度終わる。だが、別の年、別の巡察官、別の時間軸で、同じ仕組みがまた名前を消すかもしれない。"
      ]
    }
  ]
});

  upsertMany(H.Data.Endings, [
  {
    "id": "ending_final_true_map",
    "kicker": "第一部完結・真地図エンド",
    "title": "嘘の地図を燃やす日",
    "body": [
      "あなたは灰街の事件を、灰獣、黒雨、白紙票という三つの怪異ではなく、公認記録の採用制度が生んだ一つの連鎖として提出した。",
      "最初に戻したのは紙ではなく、人の名前だった。復名者の証言を真鍮札で固定し、黒雨帳簿を停止し、白紙票配列表と中枢評議の黒議事録を段階公開した。",
      "評議会中枢は解散され、採用地図には新しい欄が追加される。『記録にない者は存在しない』ではなく、『記録が消した者を、街は再び呼び戻せる』という欄だ。",
      "嘘の地図は燃やされた。ただし、地図そのものを捨てたのではない。誰の声を地図へ採用するか、その手順を市民の前へ出した。灰街は初めて、真実ではなく、真実へ近づく手続きを公式に持つ。"
    ],
    "epilogue": "数年後、外街から黒い縁取りの封筒が届く。差出人欄には、あなたによく似た別の巡察官の名があった。第三章があるなら、それは続きではなく、別の時間軸で同じ構造へ挑む物語になる。"
  },
  {
    "id": "ending_final_outer_gate",
    "kicker": "第一部完結・外街への門エンド",
    "title": "灰街は救われ、利息は門を越える",
    "body": [
      "あなたは灰街の公認記録制度を暴き、黒雨帳簿と白紙票の読替を止めた。復名者の名前は戻り、閉鎖評議の中枢は市民監査の下へ置かれた。",
      "ただし、最終報告の重点は灰街内部の改革ではなく、外街へ流れた利息の追跡に置かれた。灰街は助かる。しかし、同じ帳簿が別の都市でも濡れている可能性を、あなたは公式に残した。",
      "終わり方としては満足できる。ただし、門の外へ視線を向けたぶん、灰街内の制度再建は真地図エンドより少し弱くなる。"
    ],
    "epilogue": "何年後か、外街門の郵便受けで別時線の巡察章が鳴る。そこに刻まれた採用番号は、あなたのものとは一つだけ違っていた。"
  },
  {
    "id": "ending_final_fire_disclosure",
    "kicker": "第一部結末・暴露の炎エンド",
    "title": "真実は燃え、街も焦げた",
    "body": [
      "あなたは黒雨帳簿、白紙票、中枢議事録を一斉に公開した。真実は速く届き、評議会中枢はその日のうちに崩れた。",
      "しかし、名簿復元と証人保護が混乱に追いつかなかった。怒りは制度へ向かう前に人へ向かい、復名者の何人かは再び沈黙を選ぶ。",
      "嘘は焼けた。だが、燃えた地図の灰で、新しい道を引く者はまだ少ない。"
    ],
    "epilogue": "あなたは職を失わない。だが、広場であなたを見る目は二つに割れる。救った者と、急ぎすぎた者として。"
  },
  {
    "id": "ending_final_gray_order",
    "kicker": "第一部結末・灰の秩序エンド",
    "title": "街は静かに乾いた",
    "body": [
      "あなたは黒雨帳簿を止め、消えた名前の一部を戻した。街は落ち着き、商会と監査庁は再発防止を約束した。",
      "しかし、評議会中枢の採用制度そのものは記録上曖昧なまま残る。白紙票は別の名で保管され、影地図は非常時規定として棚へ戻された。",
      "市民は明日の生活を取り戻した。その代わり、昨日まで何が奪われたのかを完全には知れない。"
    ],
    "epilogue": "灰街は静かだ。静かな街ほど、次の雨音を聞き逃しやすい。"
  },
  {
    "id": "ending_final_white_council",
    "kicker": "第一部悪結末・白紙評議会エンド",
    "title": "多数は残り、人は戻らない",
    "body": [
      "あなたは個人の責任を追及した。サブラ、マレン、キュール、あるいは一部の評議員は処罰された。",
      "だが、白紙票を多数として読む制度と、公認記録が人より重くなる仕組みは残った。街は分かりやすい犯人を得て、分かりにくい構造を許した。",
      "復名者は戻ったように見える。しかし、次の選挙でまた誰かの名前が『不在』になる。"
    ],
    "epilogue": "白紙評議会は解散しない。ただ、白い仮面を少しだけ薄い灰色へ塗り替える。"
  },
  {
    "id": "ending_final_patrol_exile",
    "kicker": "第一部結末・巡察官失格エンド",
    "title": "あなたは地図の外へ出る",
    "body": [
      "あなたは公認記録制度そのものを告発し、採用地図の権威を一度拒絶した。評議会中枢は揺らいだが、地図院もまたあなたを守り切れなかった。",
      "あなたは巡察官の職を失う。だが、復名者連合はあなたを市民側の記録者として迎える。公式地図の外側で、消えた道を描き続けることになる。",
      "これは敗北ではない。ただし、灰街を制度として修復する道ではなく、制度の外から監視する道だ。"
    ],
    "epilogue": "外街門の向こうで、別時間軸のあなたが同じ章を拾う。次に飛ぶ豚は、公式の翼を持たないかもしれない。"
  },
  {
    "id": "ending_final_partial_map",
    "kicker": "第一部未完結・線が足りない地図",
    "title": "灰街はまだ、半分だけ嘘を覚えている",
    "body": [
      "あなたは黒雨と白紙票の一部を暴いた。しかし、灰街公認記録そのものを崩すには、最終推理か復名の手順、あるいは灰街との対峙が足りなかった。",
      "報告書は採用されたが、街は『一連の不正』として処理し、制度全体の更新までは踏み込まない。救える名前はある。だが、消えた名前を二度と生まない仕組みには届かなかった。",
      "この結末はやり直せる。真地図広場で、灰街そのものの主張を崩してから終局報告へ戻ればよい。"
    ],
    "epilogue": "地図の端に、まだ燃えていない嘘が残る。"
  }
]);
  H.Data.EndingById = byId(H.Data.Endings);

  const qMain = H.Data.Quests.find((q) => q.id === "q_main");
  if (qMain) {
    const stages = qMain.stages || [];
    const finalStartIndex = stages.findIndex((stage) => (stage.objectives || []).some((obj) => obj.id === "complete"));
    const replacement = [
      {
        title: "評議会中枢への道",
        description: "第二章前半の全体像を固定し、閉鎖評議の奥へ進む。",
        objectives: [
          { id:"complete", text:"推理盤で黒雨事件の全体像を成立させる", condition:{type:"deduction", id:"d2_complete_second_case"}, rewardText:"評議会中枢解放" },
          { id:"core", text:"評議会中枢・白紙票倉へ到達する", condition:{type:"flag", id:"entered_council_core"} }
        ],
        onCompleteEffects: [{ type:"notify", title:"第二章後半", text:"白紙票・名簿機関・公認記録を調査する。", icon:"票", tone:"normal" }]
      },
      {
        title: "白紙選挙と消える名前",
        description: "白紙票多数と名簿消失の接続を暴く。",
        objectives: [
          { id:"white_matrix", text:"白紙票配列表を保全する", condition:{type:"evidence", id:"e_white_vote_matrix"} },
          { id:"absent", text:"不在扱いの有権者名簿を得る", condition:{type:"evidence", id:"e_absent_voter_registry"} },
          { id:"white_deduction", text:"白紙多数が事前準備だったと証明する", condition:{type:"deduction", id:"d2_white_election_prepared"} },
          { id:"name_vote", text:"消えた名前が白紙票へ読替えられたと証明する", condition:{type:"deduction", id:"d2_names_to_blank_votes"} }
        ],
        onCompleteEffects: [{ type:"notify", title:"白紙選挙の仕組みを暴いた", text:"次は黒雨帳簿を停止し、名前を戻す。", icon:"名", tone:"success" }]
      },
      {
        title: "黒雨帳簿を停止し、名前を戻す",
        description: "黒雨帳簿の心臓部と復元鍵を押さえ、復名を実行する。",
        objectives: [
          { id:"ledger_heart", text:"黒雨帳簿の心臓部を記録する", condition:{type:"evidence", id:"e_black_ledger_heart"} },
          { id:"restoration_key", text:"名簿復元鍵を得る", condition:{type:"evidence", id:"e_restoration_key"} },
          { id:"shutdown_plan", text:"復名先行で帳簿を止められると証明する", condition:{type:"deduction", id:"d2_ledger_can_be_stopped_by_restoration"} },
          { id:"names_restored", text:"名前復元を実行する", condition:{type:"flag", id:"names_restored"} }
        ],
        onCompleteEffects: [{ type:"notify", title:"名前が戻った", text:"真地図広場で最終推理を成立させる。", icon:"戻", tone:"success" }]
      },
      {
        title: "灰街そのものと対峙する",
        description: "公認記録機関を暴き、真地図広場で灰街の主張を崩す。",
        objectives: [
          { id:"engine", text:"灰街公認記録の機関図を得る", condition:{type:"evidence", id:"e_gray_city_record_engine"} },
          { id:"oruka", text:"復名者オルカの証言を得る", condition:{type:"evidence", id:"t_oruka_name_returned"} },
          { id:"final_deduction", text:"最終推理『嘘の地図』を成立させる", condition:{type:"deduction", id:"d2_final_truth_map"} },
          { id:"gray_city", text:"噂戦『灰街公認記録』に勝利する", condition:{type:"flag", id:"gray_city_confronted"} }
        ],
        onCompleteEffects: [{ type:"notify", title:"終局報告が可能", text:"地図院または真地図広場の報告卓で第一部を完結できる。", icon:"印", tone:"success" }]
      },
      {
        title: "第一部を閉じる終局報告",
        description: "第一章と第二章を統合し、灰街へ残す最後の公式記録を選ぶ。",
        objectives: [
          { id:"final_report_unlocked", text:"終局報告卓を開く条件を満たす", condition:{type:"flag", id:"final_report_unlocked"} },
          { id:"report", text:"終局報告を提出し、エピローグへ進む", condition:{type:"flag", id:"chapter_complete"} }
        ],
        onCompleteEffects: []
      }
    ];
    if (finalStartIndex >= 0) qMain.stages.splice(finalStartIndex, stages.length - finalStartIndex, ...replacement);
    qMain.title = "第二章・完結編　黒雨の帳簿と白紙選挙";
    qMain.summary = "黒雨・公債・影地図・白紙選挙・公認記録機関を追い、灰街第一部を完結させる。";
  }
  H.Data.QuestById = byId(H.Data.Quests);

  // Runtime patches: keep deterministic game logic as the source of truth.
  if (H.Systems.EndingSystem) {
    const proto = H.Systems.EndingSystem.prototype;
    const oldReadiness = proto.readiness;
    proto.readiness = function readinessFinale() {
      const base = oldReadiness.call(this);
      const state = this.game.state;
      const finalKey = [
        "d2_complete_second_case", "d2_white_election_prepared", "d2_names_to_blank_votes",
        "d2_ledger_can_be_stopped_by_restoration", "d2_graycity_official_record_is_engine", "d2_final_truth_map"
      ];
      return Object.assign(base, {
        finalReportUnlocked: Boolean(state.world.flags.final_report_unlocked),
        namesRestored: Boolean(state.world.flags.names_restored),
        blackLedgerStopped: Boolean(state.world.flags.black_ledger_stopped),
        grayCityConfronted: Boolean(state.world.flags.gray_city_confronted),
        finalTruthMap: state.deductions.solved.includes("d2_final_truth_map"),
        solvedKey: finalKey.filter((id) => state.deductions.solved.includes(id)).length,
        requiredKey: finalKey.length,
        seasonComplete: Boolean(state.world.flags.season1_complete)
      });
    };
    const oldChooseEnding = proto.chooseEnding;
    proto.chooseEnding = function chooseFinaleEnding(report) {
      const state = this.game.state;
      if (!state.world.flags.final_report_unlocked) return oldChooseEnding.call(this, report);
      const solved = new Set(state.deductions.solved);
      const complete = solved.has("d2_final_truth_map") && state.world.flags.gray_city_confronted;
      const names = Boolean(state.world.flags.names_restored && state.world.flags.name_anchor_ready);
      const protection = Boolean(state.world.flags.witness_protection_ready);
      const bell = Boolean(state.world.flags.black_bell_silenced || state.world.flags.black_ledger_stopped);
      const safeCity = state.world.stability >= 34 && state.world.globalRumorPressure < 78;

      if (!complete) return "ending_final_partial_map";
      if (["natural_rain", "ledger_error", "forced_revision"].includes(report.cause)) return oldChooseEnding.call(this, report) || "ending_final_partial_map";
      if (["maren", "sabra", "cyr"].includes(report.responsible) && report.responsible !== "council_core_network") return "ending_final_white_council";
      if (["sealed", "bargain"].includes(report.policy)) return "ending_final_gray_order";
      if (report.policy === "burn_archive") return safeCity && names ? "ending_final_patrol_exile" : "ending_final_fire_disclosure";
      if (report.policy === "outer_gate") return names && protection && bell ? "ending_final_outer_gate" : "ending_final_partial_map";
      const finalCause = ["city_record_engine", "debt_map_loop", "white_vote_system"].includes(report.cause);
      const finalResponsible = ["council_core_network", "record_regime", "council_ring", "shared_network"].includes(report.responsible);
      const goodPolicy = ["rebuild_charter", "staged", "audit_decoy"].includes(report.policy);
      if (finalCause && finalResponsible && goodPolicy && names && protection && bell && safeCity) return "ending_final_true_map";
      if (finalCause && finalResponsible && goodPolicy) return "ending_final_outer_gate";
      return "ending_final_gray_order";
    };
    const oldSubmit = proto.submit;
    proto.submit = function submitFinale(report) {
      const result = oldSubmit.call(this, report);
      if (!result?.success) return result;
      const state = this.game.state;
      if (state.world.flags.final_report_unlocked) {
        state.world.flags.season1_complete = true;
        state.world.finalRecord = buildFinalRecord(state, result.ending, report, this.readiness());
        const good = result.ending?.id === "ending_final_true_map" || result.ending?.id === "ending_final_outer_gate";
        if (good) {
          state.world.unlockedMaps = state.world.unlockedMaps || [];
          if (!state.world.unlockedMaps.includes("outer_gate_epilogue")) state.world.unlockedMaps.push("outer_gate_epilogue");
          if (state.npcs.tomari) state.npcs.tomari.state = "available";
        }
      }
      return result;
    };
  }

  if (H.UI.ReportPanel) {
    const DOM = H.UI.DOM;
    const proto = H.UI.ReportPanel.prototype;
    proto.render = function renderFinaleReport() {
      const readiness = this.game.endings.readiness();
      const finalOpen = readiness.finalReportUnlocked;
      DOM.setHTML(DOM.id("reportReadiness"), `
        ${this.pill("ミラ救出", readiness.miraRescued)}
        ${this.pill("名前固定", readiness.nameAnchor)}
        ${this.pill("名前復元", readiness.namesRestored)}
        ${this.pill("黒鐘/黒雨帳簿停止", readiness.bellSilenced || readiness.blackLedgerStopped)}
        ${this.pill("灰街との対峙", readiness.grayCityConfronted)}
        <span class="status-pill ${readiness.finalTruthMap ? "status-positive" : "status-warning"}">最終推理 ${readiness.finalTruthMap ? "成立" : "未成立"}</span>
        <span class="status-pill ${readiness.solvedKey === readiness.requiredKey ? "status-positive" : "status-warning"}">終局推理 ${readiness.solvedKey}/${readiness.requiredKey}</span>
        <span class="status-pill ${readiness.stability >= 34 ? "status-positive" : "status-danger"}">街の安定 ${Math.round(readiness.stability)}</span>
        <span class="status-pill ${finalOpen ? "status-positive" : "status-danger"}">${finalOpen ? "終局報告" : "第二章報告"}</span>
      `);
      this.renderOptions("reportCauseChoices", "cause", H.Data.Config.reportOptions.cause);
      this.renderOptions("reportResponsibleChoices", "responsible", H.Data.Config.reportOptions.responsible);
      this.renderOptions("reportPolicyChoices", "policy", H.Data.Config.reportOptions.policy);
      const prior = this.game.state.world.report;
      if (prior) {
        for (const field of ["cause", "responsible", "policy"]) {
          const input = this.overlay.querySelector(`input[name="report-${field}"][value="${prior[field]}"]`);
          if (input) input.checked = true;
        }
        DOM.id("reportNote").value = prior.note || "";
      }
    };
  }

  if (H.UI.UIManager) {
    const DOM = H.UI.DOM;
    const proto = H.UI.UIManager.prototype;
    const oldShowEnding = proto.showEnding;
    proto.showEnding = function showFinaleEnding(payload) {
      oldShowEnding.call(this, payload);
      const ending = payload.ending;
      const state = this.game.state;
      if (!ending?.id?.startsWith("ending_final_")) return;
      const finalRecord = state.world.finalRecord;
      const extra = `
        <section class="finale-ending-note">
          <p class="eyebrow">第一部完結</p>
          <h3>第3章の種</h3>
          <p>この結末で本編は一度完結します。外街、何年後、別時間軸は、続編を作る場合の余白として残しています。</p>
          ${finalRecord ? `<div class="finale-tag-grid">${finalRecord.flags.map((flag) => `<span class="status-pill ${flag.ok ? "status-positive" : "status-warning"}">${flag.ok ? "✓" : "△"} ${Util.escapeHTML(flag.label)}</span>`).join("")}</div>` : ""}
        </section>`;
      DOM.id("endingBody").insertAdjacentHTML("beforeend", extra);
    };
  }

  if (H.UI.PanelRenderer) {
    const proto = H.UI.PanelRenderer.prototype;
    const oldSeries = proto.series;
    proto.series = function seriesFinale() {
      const base = oldSeries.call(this);
      const state = this.game.state;
      const finalRecord = state.world.finalRecord;
      if (!finalRecord && !state.world.flags.final_report_unlocked) return base;
      const endingCards = H.Data.Endings.filter((ending) => ending.id.startsWith("ending_final_")).map((ending) => `
        <article class="series-recall tone-neutral"><small>${H.Core.Util.escapeHTML(ending.kicker)}</small><p><b>${H.Core.Util.escapeHTML(ending.title)}</b><br>${H.Core.Util.escapeHTML((ending.body?.[0] || "").slice(0, 96))}...</p></article>
      `).join("");
      const record = finalRecord ? `
        <section class="series-section"><h3>第一部完結記録</h3>
          <div class="series-official-grid">
            <article><small>最終結末</small><b>${H.Core.Util.escapeHTML(finalRecord.ending.title)}</b></article>
            <article><small>最終原因</small><b>${H.Core.Util.escapeHTML(finalRecord.report.causeLabel)}</b></article>
            <article><small>責任主体</small><b>${H.Core.Util.escapeHTML(finalRecord.report.responsibleLabel)}</b></article>
            <article><small>公開方針</small><b>${H.Core.Util.escapeHTML(finalRecord.report.policyLabel)}</b></article>
            <article><small>終局推理</small><b>${finalRecord.readiness.solvedKey}/${finalRecord.readiness.requiredKey}</b></article>
            <article><small>外街の種</small><b>${finalRecord.thirdChapterSeed ? "あり" : "なし"}</b></article>
          </div>
        </section>` : `<section class="series-section"><h3>終局報告</h3><p>灰街公認記録と対峙した後、終局報告を提出すると第一部完結記録が保存されます。</p></section>`;
      return `${base}${record}<section class="series-section"><h3>エンディングギャラリー</h3><div class="series-recall-list">${endingCards}</div></section>`;
    };
  }

  if (H.Systems.MCPBridge) {
    const proto = H.Systems.MCPBridge.prototype;
    const oldSnapshot = proto.getResourceSnapshot;
    proto.getResourceSnapshot = function getFinaleSnapshot() {
      const snap = oldSnapshot.call(this);
      snap.season = { status: this.game.state.world.flags.season1_complete ? "complete" : "in_progress", finale: "chapter2_finale", finalRecord: this.game.state.world.finalRecord || null };
      snap.immutableRules.push("第一部完結後のfinalRecordは監査ログであり、AI/MCPは改竄できない");
      return snap;
    };
  }

  function label(group, id) {
    return H.Data.Config.reportOptions[group]?.find((entry) => entry.id === id)?.title || id || "未選択";
  }
  function buildFinalRecord(state, ending, report, readiness) {
    const flags = [
      { label: "エルド救出", ok: Boolean(state.meta.chapter1Transfer?.readiness?.eldRescued ?? true) },
      { label: "証人保護", ok: Boolean(state.world.flags.witness_protection_ready) },
      { label: "名前復元", ok: Boolean(state.world.flags.names_restored) },
      { label: "黒雨帳簿停止", ok: Boolean(state.world.flags.black_ledger_stopped) },
      { label: "灰街対峙", ok: Boolean(state.world.flags.gray_city_confronted) },
      { label: "最終推理", ok: state.deductions.solved.includes("d2_final_truth_map") }
    ];
    return {
      schema: "haimachi-season1-final-record-v1",
      createdAt: new Date().toISOString(),
      build: H.VERSION,
      ending: { id: ending.id, title: ending.title, kicker: ending.kicker },
      report: {
        cause: report.cause,
        responsible: report.responsible,
        policy: report.policy,
        causeLabel: label("cause", report.cause),
        responsibleLabel: label("responsible", report.responsible),
        policyLabel: label("policy", report.policy),
        note: report.note || ""
      },
      readiness: {
        solvedKey: readiness.solvedKey,
        requiredKey: readiness.requiredKey,
        stability: readiness.stability,
        publicTrust: readiness.publicTrust,
        evidenceCount: readiness.evidenceCount
      },
      flags,
      solvedDeductions: state.deductions.solved.slice(),
      knownEvidence: state.evidence.discovered.slice(),
      thirdChapterSeed: Boolean(state.evidence.discovered.includes("e_outer_city_interest_letter") || report.policy === "outer_gate"),
      possibleNext: [
        "何年後の外街監査",
        "別時間軸の巡察官",
        "灰街制度を輸出した上位機関"
      ]
    };
  }
})(window.Haimachi);
