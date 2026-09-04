(function registerDialogues(H) {
  "use strict";

  const E = {
    flag: (id, value = true) => ({ type: "flag", id, value }),
    evidence: (id) => ({ type: "evidence", id }),
    trust: (id, value) => ({ type: "npcTrust", id, value }),
    xp: (value) => ({ type: "xp", value }),
    time: (value = 1) => ({ type: "advanceTime", value }),
    questStart: (id) => ({ type: "questStart", id }),
    questComplete: (id) => ({ type: "questComplete", id }),
    item: (id, value) => ({ type: "item", id, value }),
    rumor: (id, path, value) => ({ type: "rumor", id, path, value }),
    world: (path, value) => ({ type: "world", path, value }),
    district: (id, path, value) => ({ type: "district", id, path, value }),
    evaluate: () => ({ type: "questEvaluate" }),
  };

  H.Data.Dialogues = {
    naira: {
      greetings: [
        {
          requires: { type: "flag", id: "chapter_complete" },
          text: "報告は街へ固定された。けれど、地図は結末ではない。人がその線の上をどう歩くかを、最後まで見届けなさい。",
        },
        {
          requires: { type: "flag", id: "eld_rescued" },
          text: "エルドの生存は確認した。次は、あなたが集めた事実をどんな順序で街へ渡すか。推理盤を完成させ、報告卓へ来なさい。",
        },
        {
          requires: { type: "flag", id: "field_kit_received" },
          text: "地図院へ戻ったということは、線だけでは足りなくなったのね。証拠を並べなさい。何が分からないのかを言葉にすれば、次に歩く道が見える。",
        },
        {
          text: "遅刻ではないわ。灰時計が正確すぎるだけ。あなたが新任の巡察記録官ね。まず、北区の失踪事件を『灰獣の仕業』と記録してよいか確かめてもらう。",
        },
      ],
      topics: [
        {
          id: "first_orders",
          label: "任務と巡察道具を受け取る",
          summary: "第一章の調査を開始する。",
          hideWhen: { type: "flag", id: "field_kit_received" },
          options: [
            {
              id: "accept_carefully",
              label: "「確認できた事実だけを持ち帰ります」",
              hint: "観察重視。ナイラの信頼が少し上がる。",
              response: "『その言葉は正しい。でも、事実だけを並べても人は救えない。誰が、何を恐れて沈黙したかも記録しなさい』\n\nナイラは巡察命令書、真鍮灯、証拠袋を机へ置いた。",
              timeCost: 0,
              effects: [
                E.evidence("e_field_orders"),
                E.flag("field_kit_received"),
                E.flag("intro_complete"),
                E.trust("naira", 3),
                E.xp(8),
                E.evaluate(),
              ],
            },
            {
              id: "accept_boldly",
              label: "「灰獣の嘘を暴けばよいのですね」",
              hint: "権限重視。目的を急ぐ姿勢を示す。",
              response: "『最初から灰獣を嘘と決めないこと。あなたの仕事は結論を守ることではなく、結論を変えられる証拠を集めることよ』\n\n命令書の端に、北区・河岸区・巡察詰所の閲覧条件が追記される。",
              timeCost: 0,
              effects: [
                E.evidence("e_field_orders"),
                E.flag("field_kit_received"),
                E.flag("intro_complete"),
                E.trust("naira", 1),
                E.xp(8),
                E.evaluate(),
              ],
            },
          ],
        },
        {
          id: "meaning_of_map",
          label: "なぜ噂が地図を変えるのか",
          summary: "灰街の基本原理を聞く。",
          options: [
            {
              id: "ask_mechanism",
              label: "灰街の現象として尋ねる",
              response: "『人々が同じ道を避ければ、その道は使われなくなる。使われない線は公式地図から消える。ここまでは普通の街と同じ』\n\nナイラは北区の薄い線を指した。\n\n『違うのは灰塩よ。認識の反復を物質へ変える。噂は社会を動かし、灰塩は壁や爪や霧の形を与える。ただし、私たちはその存在をまだ公式には認めていない』",
              timeCost: 0,
              effects: [E.flag("naira_explained_graycity"), E.trust("naira", 1)],
              once: true,
            },
            {
              id: "ask_ethics",
              label: "地図に記さないことの責任を尋ねる",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "ナイラはしばらく返事をしなかった。\n\n『記さなければ混乱を防げる。記さなければ被害者も存在しなかったことにできる。地図院は何度も、その二つを取り違えた。だからあなたには、線の正しさと人の安全を別々に考えてほしい』",
              timeCost: 0,
              effects: [E.flag("naira_ethics_confided"), E.trust("naira", 4), E.xp(4)],
              once: true,
            },
          ],
        },
        {
          id: "review_progress",
          label: "現在の推理をナイラへ説明する",
          summary: "調査の進み方に応じた助言を得る。",
          requires: { type: "evidenceCount", op: "gte", value: 2 },
          options: [
            {
              id: "review_tracks",
              label: "灰獣の足跡と巡察章を示す",
              requires: {
                all: [
                  { type: "evidence", id: "e_false_tracks" },
                  { type: "evidence", id: "e_bloody_seal" },
                ],
              },
              response: "『足跡が偽装なら、問題は誰が作ったかだけではない。なぜ、住民が偽装を本物として受け入れたか。貼り紙、鐘、目撃談――反復の装置を探しなさい』",
              timeCost: 0,
              effects: [E.flag("naira_hint_rumor_network"), E.trust("naira", 2)],
              once: true,
            },
            {
              id: "review_records",
              label: "欠落した記録と灰青インクを示す",
              requires: {
                all: [
                  { type: "evidence", id: "e_missing_log" },
                  { type: "evidence", id: "e_ink_residue" },
                ],
              },
              response: "『地図院のインクで消したのに、痕跡が目立つ。技術の不足ではない。誰かが“消されたこと”を見つけてほしかった可能性がある』\n\nナイラは書記官イネスの人事票を静かに閉じた。",
              timeCost: 0,
              effects: [E.flag("naira_hint_ines"), E.trust("naira", 2)],
              once: true,
            },
            {
              id: "review_eld_route",
              label: "エルドが旧水路にいる可能性を説明する",
              requires: { type: "deduction", id: "d_eld_in_waterworks" },
              response: "『推理盤の経路は成立している。第三排水格子の封鎖解除を、地図院権限で認める』\n\nナイラは公式地図へ細い青線を引いた。消えていた旧水路が、再び通行可能な道として浮かぶ。",
              timeCost: 0,
              effects: [
                { type: "mapUnlock", id: "old_waterworks" },
                E.flag("waterworks_warrant"),
                E.trust("naira", 4),
                E.xp(12),
                E.evaluate(),
              ],
              once: true,
            },
          ],
        },
        {
          id: "witness_protection",
          label: "証人保護の扱いを相談する",
          summary: "イネスやエルドを公開前に守れるか確認する。",
          requires: {
            any: [
              { type: "flag", id: "ines_confessed" },
              { type: "flag", id: "eld_rescued" },
            ],
          },
          options: [
            {
              id: "request_protection",
              label: "公式の証人保護を申請する",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『申請を受理する。ただし、巡察隊内部へ通知すればダリオにも伝わる。地図院の地下保管室を臨時避難所として使う』\n\n正式な手続きの形を取りながら、通知先だけを地図院内に限定した。",
              timeCost: 0,
              effects: [E.flag("witness_protection_ready"), E.trust("naira", 3), E.xp(8)],
              once: true,
            },
            {
              id: "ask_quiet_shelter",
              label: "制度外の一時避難を提案する",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "『制度を使わない保護は、記録上は存在しない。それでも必要な夜はある』\n\nナイラは河岸避難所の合鍵を渡し、ヴェラの名前だけを告げた。",
              timeCost: 0,
              effects: [E.flag("witness_protection_ready"), E.item("shelter_key", 1), E.trust("naira", 4), E.xp(8)],
              once: true,
            },
          ],
        },
      ],
    },

    mirei: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "地図に何と書かれたかは聞いたよ。あんたが書かなかったことも、北区じゃちゃんと覚えてる。" },
        { requires: { type: "flag", id: "eld_rescued" }, text: "生きてたんだってね。怒鳴りつけてやりたいし、温かいものも食わせたい。先にどっちをするか迷ってるよ。" },
        { requires: { type: "evidence", id: "t_mirei_last_words" }, text: "もう話した以上、引っ込める気はないよ。ただし、客の名前を道具みたいに使うなら、あんたもダリオと同じだ。" },
        { text: "巡察官が一人で来るとは珍しいね。灰獣なら酒は飲まないし、エルドならつけを払わない。どっちを探しに来た？" },
      ],
      topics: [
        {
          id: "eld_last_night",
          label: "エルドが最後に来た夜",
          summary: "失踪直前の様子を聞く。",
          options: [
            {
              id: "gentle",
              label: "客を守りたい気持ちを尊重して尋ねる",
              hint: "共感。信頼を得やすい。",
              response: "ミレイは空の杯を磨き続けた。\n\n『あいつは灰獣を怖がってなかった。“灯りの下でも追ってくる、人の目をした奴”を怖がってた。外套の肩に白い線が一本。第七班の古い印だよ』",
              timeCost: 1,
              effects: [E.evidence("t_mirei_last_words"), E.trust("mirei", 8), E.xp(14), E.evaluate()],
              once: true,
            },
            {
              id: "official",
              label: "巡察命令書を示して証言を求める",
              hint: "権限。証言は得られるが警戒される。",
              requires: { type: "evidence", id: "e_field_orders" },
              response: "『紙に書いてあるから話すんじゃない。話さないと、また灰獣のせいにされるから話す』\n\nエルドは失踪前夜、巡察外套の人物に追われていると訴えていた。",
              timeCost: 1,
              effects: [E.evidence("t_mirei_last_words"), E.trust("mirei", 2), E.xp(12), E.evaluate()],
              once: true,
            },
            {
              id: "accuse_hiding",
              label: "情報を隠せば次の被害が出ると強く迫る",
              hint: "短期的には情報を得るが、信頼を失う。",
              response: "『脅す声だけは立派だね』\n\nミレイはエルドの言葉を話したが、酒場の常連たちは一斉に口を閉ざした。",
              timeCost: 1,
              effects: [E.evidence("t_mirei_last_words"), E.trust("mirei", -9), E.world("publicTrust", -2), E.xp(9), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "letter_hint",
          label: "エルドが残した物を尋ねる",
          summary: "未送信手紙の預け先につながる。",
          requires: {
            all: [
              { type: "evidence", id: "t_mirei_last_words" },
              { type: "trust", id: "mirei", op: "gte", value: 50 },
            ],
          },
          options: [
            {
              id: "promise_return",
              label: "内容を利用する前に、証人保護を優先すると約束する",
              response: "『河岸の行商預かり箱、番号は二十二。エルドは“地図院へ届かなければ、正しい人に読ませろ”と言ってた』\n\nミレイは鍵ではなく、箱を開ける言葉を教えた。『雨は下から降らない』。",
              timeCost: 0,
              effects: [E.flag("mirei_letter_hint"), E.trust("mirei", 5), E.xp(6), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "rain_bell",
          label: "濁った雨鐘について",
          summary: "北区の噂増幅と鐘の故障を聞く。",
          options: [
            {
              id: "ask_bell_change",
              label: "鐘の音が変わった時期を尋ねる",
              response: "『失踪の三日前。三拍目だけ腹に残る音になった。そこからだよ、客が同じ灰獣の話を何度も繰り返すようになったのは』\n\n鐘の舌金は修理へ出したはずだが、河岸から戻っていないという。",
              timeCost: 0,
              effects: [E.questStart("q_silent_bell"), E.flag("mirei_bell_hint"), E.trust("mirei", 2), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "oren",
          label: "貼り紙を刷った噂売り",
          summary: "オレンの商売と行動を確認する。",
          requires: { type: "evidence", id: "e_torn_poster" },
          options: [
            {
              id: "show_poster",
              label: "事件前に貼られた紙を見せる",
              response: "『耳紋はオレンの版だ。あいつは噂を作らないと言うけど、注文通りの言葉を一番よく燃える順で並べる』\n\nオレンの印刷小屋には、持ち運び用の版箱があるらしい。",
              timeCost: 0,
              effects: [E.flag("mirei_identified_oren_mark"), E.trust("mirei", 2), E.xp(5)],
              once: true,
            },
          ],
        },
      ],
    },

    lo: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "処分は受けます。でも、今度は“見なかったこと”にはしません。記録に残った自分の名前から逃げないと決めました。" },
        { requires: { type: "evidence", id: "t_lo_hidden_seal" }, text: "話したことを後悔していない、と言えば嘘です。でも、隠した夜よりは眠れています。" },
        { requires: { type: "evidence", id: "e_bloody_seal" }, text: "その章を……どこで見つけました？　いえ、知らないです。番号も見ていません。" },
        { text: "見習いのロウです。第七班のことなら巡察長へ。僕は事件当夜、詰所から出ていません。記録にも、そう……あるはずです。" },
      ],
      topics: [
        {
          id: "night_assignment",
          label: "事件当夜の配置",
          summary: "第七班の行動とロウのアリバイを聞く。",
          options: [
            {
              id: "ask_sequence",
              label: "責任追及より、時系列だけを確認する",
              response: "『夜鐘の前は詰所。鐘の後、ダリオ巡察長が“北区へ追加封鎖札を運べ”と。僕は広場まで行きました。でも、その後は……』\n\n言葉が止まり、視線があなたの証拠袋へ落ちる。",
              timeCost: 1,
              effects: [E.flag("lo_partial_timeline"), E.trust("lo", 4), E.xp(5)],
              once: true,
            },
            {
              id: "press_duty",
              label: "虚偽報告は巡察規律違反だと告げる",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『違反なのは分かっています。だから、これ以上は巡察長同席で……』\n\nロウは口を閉ざす。強制力は効いたが、今ここで真実へは届かない。",
              timeCost: 1,
              effects: [E.flag("lo_fears_discipline"), E.trust("lo", -4), E.xp(3)],
              once: true,
            },
          ],
        },
        {
          id: "bloody_seal",
          label: "血の巡察章を示す",
          summary: "隠した証拠について問いただす。",
          requires: { type: "evidence", id: "e_bloody_seal" },
          options: [
            {
              id: "offer_protection",
              label: "班全体でなく、個人の行為として記録すると約束する",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "ロウの肩が落ちた。\n\n『僕が翌朝、拾いました。7-03は副官の章ですが、あの夜はダリオ巡察長が借りた。報告したら班が潰れると思って……現場へ戻しました。隠したんじゃない。見つからなかったことにしたかった』",
              timeCost: 1,
              effects: [E.evidence("t_lo_hidden_seal"), E.trust("lo", 9), E.flag("lo_cooperating"), E.xp(17), E.evaluate()],
              once: true,
            },
            {
              id: "corner_with_log",
              label: "欠落記録と章番号を並べ、矛盾を示す",
              requires: { type: "evidence", id: "e_missing_log" },
              response: "逃げ道を失ったロウは、巡察章を拾って現場へ戻したこと、事件夜にダリオが章を借りていたことを認めた。\n\n『僕の処分は受けます。でも、イネスさんは僕を庇おうとしただけです』",
              timeCost: 1,
              effects: [E.evidence("t_lo_hidden_seal"), E.trust("lo", 1), E.flag("lo_cooperating"), E.xp(15), E.evaluate()],
              once: true,
            },
            {
              id: "threaten_arrest",
              label: "証拠隠滅として即時拘束を示唆する",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "ロウは青ざめ、すべてを話した。だが、その声は供述ではなく降伏だった。周囲の巡察官はあなたを敵として見る。",
              timeCost: 1,
              effects: [E.evidence("t_lo_hidden_seal"), E.trust("lo", -11), E.world("publicTrust", -2), E.flag("watch_hostile"), E.xp(11), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "ines_role",
          label: "イネスが記録へ何をしたか",
          summary: "内部告発者への手掛かり。",
          requires: { type: "evidence", id: "t_lo_hidden_seal" },
          options: [
            {
              id: "ask_ines_help",
              label: "ロウを庇った経緯を尋ねる",
              response: "『イネスさんは“原本まで消えたわけじゃない”って言いました。僕が章のことを話せないなら、外から来る調査官が空白に気づくようにする、と』\n\n記録の消去は、隠蔽ではなく発見を誘うためだった可能性が高まる。",
              timeCost: 0,
              effects: [E.flag("lo_points_to_ines"), E.trust("lo", 3), E.xp(6)],
              once: true,
            },
          ],
        },
      ],
    },

    ines: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "私の違法行為まで記録したのですね。それでよいと思います。守られることと、免責されることは同じではありません。" },
        { requires: { type: "flag", id: "ines_confessed" }, text: "原本の場所は伝えました。回収できたなら、次はそれを誰より先に守るかを考えてください。" },
        { requires: { type: "evidence", id: "e_ink_residue" }, text: "灰青インクを採取したのですね。なら、私に聞きたいことは一つしかないはずです。" },
        { text: "事件関連記録の閲覧は許可されています。ただし、原本の持ち出し、封印解除、書記への威圧的聴取は許可外です。質問は具体的に。" },
      ],
      topics: [
        {
          id: "missing_page",
          label: "欠落した第七班当番表",
          summary: "紙が消えた方法と管理責任を確認する。",
          requires: { type: "evidence", id: "e_missing_log" },
          options: [
            {
              id: "ask_process",
              label: "誰が触れられたか、手続きから絞る",
              response: "『当番表へ触れられたのは、巡察長、副官、当直書記、そして出向書記の私。扉の封は破られていません。つまり、権限者が開けた』\n\nイネスは自分を容疑者から外さない。",
              timeCost: 1,
              effects: [E.flag("ines_lists_access"), E.trust("ines", 3), E.xp(6)],
              once: true,
            },
            {
              id: "accuse_directly",
              label: "管理責任者として改ざんを追及する",
              response: "『管理責任は認めます。改ざんの意図については、証拠を示してください』\n\n正面からの追及に動揺はない。彼女はあなたがインク跡へ気づくか試している。",
              timeCost: 1,
              effects: [E.trust("ines", -2), E.flag("ines_waits_for_proof"), E.xp(3)],
              once: true,
            },
          ],
        },
        {
          id: "ink_confession",
          label: "灰青インクと不完全な消去",
          summary: "イネスの意図を確かめる。",
          requires: {
            all: [
              { type: "evidence", id: "e_missing_log" },
              { type: "evidence", id: "e_ink_residue" },
            ],
          },
          options: [
            {
              id: "interpret_signal",
              label: "「痕跡を残し、外部調査を呼んだのですね」",
              requires: {
                any: [
                  { type: "flag", id: "naira_hint_ines" },
                  { type: "flag", id: "lo_points_to_ines" },
                  { type: "stat", id: "observation", op: "gte", value: 3 },
                ],
              },
              response: "イネスは初めて視線を上げた。\n\n『原本を告発窓口へ出せば、ダリオが先に回収する。だからページを別の図筒へ移し、“消された記録”だけを残した。違法です。でも、完全に従えばエルドは最初から存在しなかったことになる』",
              timeCost: 1,
              effects: [E.evidence("t_ines_tampering"), E.flag("ines_confessed"), E.flag("ines_supports_search"), E.trust("ines", 10), E.xp(20), E.evaluate()],
              once: true,
            },
            {
              id: "demand_confession",
              label: "改ざん罪の軽減と引き換えに原本を求める",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『取引には応じません。ですが、原本が地図院の返却図筒にあることは否定しません』\n\n供述は得たが、彼女はあなたを保護者ではなく取引相手と見なした。",
              timeCost: 1,
              effects: [E.evidence("t_ines_tampering"), E.flag("ines_confessed"), E.flag("ines_supports_search"), E.trust("ines", 1), E.xp(16), E.evaluate()],
              once: true,
            },
            {
              id: "condemn_tampering",
              label: "意図に関係なく記録改ざんは許されないと告げる",
              response: "『その通りです。では、正しい手続きで消された人をどう戻すのか、あなたの報告で示してください』\n\n原本の場所は明かされない。イネスは黙秘へ戻る。",
              timeCost: 1,
              effects: [E.flag("ines_condemned"), E.trust("ines", -12), E.world("publicTrust", 1), E.xp(5)],
              once: true,
            },
          ],
        },
        {
          id: "sealed_store",
          label: "封印庫の備品記録",
          summary: "ダリオの持出票へのアクセスを得る。",
          requires: {
            any: [
              { type: "flag", id: "ines_confessed" },
              { type: "evidence", id: "t_lo_hidden_seal" },
            ],
          },
          options: [
            {
              id: "request_help",
              label: "証拠保全への協力を正式に依頼する",
              response: "『開封には私とあなた、二人の印を使います。ダリオ単独の再封印を無効化できる』\n\nイネスは封印庫の立会人になることを承諾した。",
              timeCost: 0,
              effects: [E.flag("ines_supports_search"), E.trust("ines", 4), E.xp(5)],
              once: true,
            },
          ],
        },
        {
          id: "protection",
          label: "告発後の保護を約束する",
          summary: "最終報告の証人保護条件を整える。",
          requires: { type: "flag", id: "ines_confessed" },
          options: [
            {
              id: "protect_before_publish",
              label: "公開前に地図院へ移すと約束する",
              response: "『約束ではなく、手続きにしてください。約束は善人が倒れたとき消える。手続きは嫌いな人間にも効く』\n\nその要求は正しい。ナイラへ証人保護を申請する必要がある。",
              timeCost: 0,
              effects: [E.flag("ines_requests_protection"), E.trust("ines", 3), E.xp(4)],
              once: true,
            },
          ],
        },
      ],
    },

    dario: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "勝者が地図を書く、とは言わん。地図を書いた者が、誰を勝者として残すか決める。お前はその責任から逃げるな。" },
        { requires: { type: "flag", id: "dario_confronted" }, text: "まだ私を犯人と呼ばないのか。証拠が足りないからか、それとも、街を壊す覚悟が足りないからか。" },
        { requires: { type: "evidence", id: "e_requisition_note" }, text: "封印庫を開けたようだな。手続き上の瑕疵は問わん。だが、備品を使ったことと犯罪を犯したことは同じではない。" },
        { text: "新任の地図官か。北区の状況は単純だ。行商人が危険区域へ入り、灰獣に遭遇した。住民を刺激する前に、地図院はその結論を受け入れるべきだ。" },
      ],
      topics: [
        {
          id: "beast_case",
          label: "灰獣犯行説の根拠",
          summary: "ダリオの公式説明を確認する。",
          options: [
            {
              id: "ask_evidence",
              label: "目撃談以外の物証を求める",
              response: "『爪痕、足跡、失踪。怪異事件としては十分だ。灰街では、住民が危険を信じた時点で危険は実在する』\n\n物理的な犯行証拠ではなく、秩序維持を根拠に結論を急いでいる。",
              timeCost: 1,
              effects: [E.flag("dario_uses_order_logic"), E.trust("dario", 1), E.xp(5)],
              once: true,
            },
            {
              id: "challenge_tracks",
              label: "偽足跡を示して説明を求める",
              requires: { type: "deduction", id: "d_tracks_staged" },
              response: "ダリオは足跡の写しを一瞥した。\n\n『市民が混乱の中で模倣した可能性がある。偽装が一つあっても、灰獣そのものを否定はできん』\n\n否定ではなく、論点をずらしている。",
              timeCost: 1,
              effects: [E.flag("dario_saw_tracks_case"), E.trust("dario", -4), E.world("publicTrust", 1), E.xp(8)],
              once: true,
            },
          ],
        },
        {
          id: "eld_detention",
          label: "エルドへの違法拘束",
          summary: "巡察章・記録・証言で追及する。",
          requires: { type: "deduction", id: "d_watch_detained_eld" },
          options: [
            {
              id: "formal_accusation",
              label: "証拠を列挙し、拘束理由の提出を命じる",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『緊急保護だ。エルドは灰塩に汚染され、自他に危険があった』\n\nあなたが逮捕根拠を求めると、ダリオは答えず、北区の暴動予測を語り始めた。拘束そのものは否定していない。",
              timeCost: 1,
              effects: [E.flag("dario_admits_detention"), E.flag("dario_alerted"), E.trust("dario", -8), E.xp(12), E.evaluate()],
              once: true,
            },
            {
              id: "ask_why_hide",
              label: "拘束より、なぜ記録を消したかを問う",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "一瞬だけ、ダリオの疲労が怒りより前に出た。\n\n『真実を一度に公開すれば、北区は灰塩採掘場を襲う。結晶が割れれば街全体が噂の形になる。私は時間を買った』\n\n彼は秩序維持を本気で信じている。しかし、その時間で証拠も消している。",
              timeCost: 1,
              effects: [E.flag("dario_order_motive"), E.flag("dario_alerted"), E.trust("dario", -3), E.xp(12), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "requisition",
          label: "拘束具・銀線・木型の持出票",
          summary: "事件前の準備を示す。",
          requires: { type: "evidence", id: "e_requisition_note" },
          options: [
            {
              id: "show_time_gap",
              label: "灰獣目撃より前の申請時刻を指摘する",
              response: "『予防配備だ』\n\n即答だが、木型を予防配備する理由は説明しない。巡察長室の暖炉で、紙が一枚燃やされる音がした。",
              timeCost: 1,
              effects: [E.flag("dario_confronted"), E.flag("dario_burning_records"), E.trust("dario", -7), E.rumor("r_gray_beast", "intensity", 5), E.xp(10)],
              once: true,
            },
          ],
        },
        {
          id: "order_vs_truth",
          label: "秩序と真実の優先順位",
          summary: "最終報告の思想的対立。",
          requires: { type: "flag", id: "dario_order_motive" },
          options: [
            {
              id: "reject_false_order",
              label: "嘘で作る秩序は、次の災害を必要とすると反論する",
              response: "『理想論だ。だが、お前が灰塩核を止め、証人を守り、北区を暴動させずに公開できるなら――私より正しいと認めよう』\n\n挑発ではない。彼は本当に、それが不可能だと思っている。",
              timeCost: 0,
              effects: [E.flag("dario_challenge_accepted"), E.xp(7)],
              once: true,
            },
          ],
        },
      ],
    },

    baldo: {
      greetings: [
        { requires: { type: "evidence", id: "t_baldo_watch_cloak" }, text: "もう話した。オレンの金も返した。次はあんたが、俺を“協力者”と書くか“共犯”と書くか決める番だ。" },
        { requires: { type: "evidence", id: "e_bloody_seal" }, text: "その袋、見せるな。俺は何も拾ってないし、誰が外套を着てたかも知らない。" },
        { text: "荷があるなら運ぶ。質問なら他を当たれ。俺は夜鐘の前に仕事を終えて寝た。" },
      ],
      topics: [
        {
          id: "warehouse_night",
          label: "北倉裏で見たもの",
          summary: "エルド拘束の目撃証言を得る。",
          options: [
            {
              id: "respect_risk",
              label: "証言すれば仕事を失う危険を認める",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "バルドは濡れた帽子を握り潰した。\n\n『第七班の旧外套だ。肩に白線が一本。エルドの腕を背中に回して、北倉から荷車へ。助けたんじゃない。荷物の扱いだった』",
              timeCost: 1,
              effects: [E.evidence("t_baldo_watch_cloak"), E.trust("baldo", 9), E.flag("baldo_cooperating"), E.xp(16), E.evaluate()],
              once: true,
            },
            {
              id: "show_physical_chain",
              label: "巡察章と引きずり跡を示す",
              requires: { type: "evidence", id: "e_bloody_seal" },
              response: "『そこまで分かってるなら、俺が黙っても変わらないか』\n\n第七班の外套を着た人物がエルドを拘束し、河岸方面の荷車へ載せたと証言した。",
              timeCost: 1,
              effects: [E.evidence("t_baldo_watch_cloak"), E.trust("baldo", 3), E.flag("baldo_cooperating"), E.xp(15), E.evaluate()],
              once: true,
            },
            {
              id: "threaten_license",
              label: "荷運び許可の停止を示唆する",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "バルドは証言した。しかし周囲の荷運びたちは、巡察官が仕事を人質に取ったことを忘れない。",
              timeCost: 1,
              effects: [E.evidence("t_baldo_watch_cloak"), E.trust("baldo", -10), E.district("north", "trust", -5), E.xp(11), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "hush_money",
          label: "口止め金の出所",
          summary: "噂売りオレンとの関係を確認する。",
          requires: { type: "evidence", id: "t_baldo_watch_cloak" },
          options: [
            {
              id: "ask_payment",
              label: "証言後の安全を約束し、支払者を尋ねる",
              response: "『オレンだ。見てないと言えば二日分。誰が頼んだかは知らんが、奴の財布に巡察備品券が混じってた』",
              timeCost: 0,
              effects: [E.flag("baldo_names_oren"), E.trust("baldo", 3), E.xp(6)],
              once: true,
            },
          ],
        },
      ],
    },

    elka: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "新しい地図、旧水路がちゃんと線になってる。でもね、線が戻っても、そこを怖がる人はすぐには歩かないよ。" },
        { requires: { type: "evidence", id: "e_child_map" }, text: "私の地図、地図院のより役に立ったでしょ。だって、通っていい道じゃなくて、聞こえる道を描いたから。" },
        { requires: { type: "item", id: "child_map_fragment", op: "gte", value: 1 }, text: "それ！　なくした半分！　でも返す前に、ちゃんと線を合わせて。大人ってすぐ上下を間違えるから。" },
        { text: "巡察官の地図、きれいすぎる。雨の音も、猫が抜ける穴も、怒ってる人の声も描いてない。そんなのでエルドを探せるの？" },
      ],
      topics: [
        {
          id: "whistle",
          label: "地面の下から聞こえた笛",
          summary: "エルド生存の音を聞く。",
          options: [
            {
              id: "take_seriously",
              label: "子どもの証言としてでなく、観測記録として聞く",
              response: "『短く二回、長く一回。エルドが店を開くときの音。失踪した次の次の日、河岸の格子の下から聞こえた』\n\nエルカは音の強さと反響方向まで説明した。",
              timeCost: 1,
              effects: [E.evidence("t_elka_whistle"), E.trust("elka", 7), E.questStart("q_child_map"), E.xp(13), E.evaluate()],
              once: true,
            },
            {
              id: "dismiss_then_correct",
              label: "水滴ではない根拠を尋ねる",
              response: "『水滴は“店が開くよ”って三回も同じ間で鳴らない』\n\n反論は正しい。エルカは河岸の第三格子を指したが、地図の半分をなくして経路を説明できないという。",
              timeCost: 1,
              effects: [E.evidence("t_elka_whistle"), E.trust("elka", 2), E.questStart("q_child_map"), E.xp(10), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "lost_map",
          label: "なくした地図の半分",
          summary: "地図院で測量紙片を探す。",
          requires: { type: "quest", id: "q_child_map", field: "status", value: "active" },
          options: [
            {
              id: "ask_where",
              label: "最後に見た場所を順番に尋ねる",
              response: "『地図院の見学で、古い紙と一緒に持ってかれた。音の点がいっぱいあるやつ。大人の地図じゃないから、捨てる箱に入れられた』",
              timeCost: 0,
              effects: [E.flag("child_map_search_hint"), E.trust("elka", 2), E.xp(4)],
              once: true,
            },
            {
              id: "return_fragment",
              label: "見つけた測量紙片を返す",
              requires: { type: "item", id: "child_map_fragment", op: "gte", value: 1 },
              response: "二枚の線を重ねると、北区雨鐘・地図院裏・河岸第三格子が一つの反響線でつながった。\n\n『ほら。エルドの笛はこの下。公式地図が消した道だよ』",
              timeCost: 1,
              effects: [E.item("child_map_fragment", -1), E.evidence("e_child_map"), E.questComplete("q_child_map"), E.trust("elka", 8), E.xp(26), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "rain_bell",
          label: "雨鐘の音の地図",
          summary: "鐘と旧水路の共鳴を知る。",
          requires: {
            all: [
              { type: "evidence", id: "e_child_map" },
              { type: "evidence", id: "e_bell_residue" },
            ],
          },
          options: [
            {
              id: "overlay_sound",
              label: "灰塩粉の位置を音地図へ重ねる",
              response: "鐘の濁った三拍目は、旧水路の第三採掘室で最も強く反響する。雨鐘は噂を街へ散らすだけでなく、地下の灰塩核へ命令を送っている。",
              timeCost: 1,
              effects: [E.evidence("e_resonance_pattern"), E.trust("elka", 3), E.xp(14), E.evaluate()],
              once: true,
            },
          ],
        },
      ],
    },

    oren: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "俺の名前も報告に載ったか。悪名でも名前が残れば商売になる――なんて、今は言わない方がよさそうだな。" },
        { requires: { type: "evidence", id: "t_oren_seeded_rumor" }, text: "話すことは話した。俺を逮捕するか、噂網として使うかはあんた次第。どっちにしても、街は明日も誰かの話を買う。" },
        { requires: { type: "evidence", id: "e_torn_poster" }, text: "いい紙だろ？　雨に濡れても恐怖だけは滲まない。……その顔は、印刷日まで読んだ顔だな。" },
        { text: "新任さん、何を聞きたい？　本当のことは高い。みんなが本当だと思ってることなら、今だけ半額だ。" },
      ],
      topics: [
        {
          id: "poster_origin",
          label: "灰獣貼り紙の印刷日",
          summary: "事件前に噂が準備された理由を追う。",
          requires: { type: "evidence", id: "e_torn_poster" },
          options: [
            {
              id: "show_mark",
              label: "耳紋と糊の乾き方を示す",
              response: "『俺の版だ。だが注文を刷るのは犯罪じゃない』\n\nオレンは否定しない。注文票はないと言うが、足元の版箱から同じ赤いインクが滴っている。",
              timeCost: 1,
              effects: [E.flag("oren_admits_printing"), E.trust("oren", -2), E.xp(7)],
              once: true,
            },
            {
              id: "ask_market_logic",
              label: "なぜ失踪前の噂が売れたか尋ねる",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "『北区は何かが来ると分かってた。巡察が夜道を測り、鐘をいじり、北倉を空にした。人は空白を見ると一番怖い形で埋める。俺は形に名前を付けただけだ』",
              timeCost: 1,
              effects: [E.flag("oren_explains_market"), E.trust("oren", 4), E.xp(8)],
              once: true,
            },
          ],
        },
        {
          id: "search_print_box",
          label: "持ち運び版箱を開示させる",
          summary: "印刷版と巡察備品券を確保する。",
          requires: {
            all: [
              { type: "flag", id: "oren_admits_printing" },
              { type: "evidence", id: "e_torn_poster" },
            ],
          },
          options: [
            {
              id: "seize_authority",
              label: "扇動資料として版箱を押収する",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "公式印で版箱を押収。木版の裏に事件前の注文時刻と巡察備品券が残っていた。\n\n『固いねえ。固い人は壊れるまで曲がらない』",
              timeCost: 1,
              effects: [E.evidence("e_print_plate"), E.trust("oren", -8), E.flag("oren_box_seized"), E.xp(17), E.evaluate()],
              once: true,
            },
            {
              id: "trade_network",
              label: "噂網の保護と引き換えに版を提出させる",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "『客の名前を全部渡せと言わないなら、今回の注文だけ出す』\n\n版と巡察備品券を受け取る。噂網全体を犯罪化しない判断に、オレンはわずかに敬意を示した。",
              timeCost: 1,
              effects: [E.evidence("e_print_plate"), E.trust("oren", 7), E.flag("oren_informant_path"), E.xp(17), E.evaluate()],
              once: true,
            },
            {
              id: "deduce_payment",
              label: "バルドの口止め金と備品券を突きつける",
              requires: { type: "flag", id: "baldo_names_oren" },
              response: "『分かった、版は渡す。だが注文主の名前は、俺の口だけじゃ証拠にならない』\n\n木版と支払い券を確保した。",
              timeCost: 1,
              effects: [E.evidence("e_print_plate"), E.trust("oren", 1), E.xp(16), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "name_client",
          label: "注文主の正体",
          summary: "ダリオ側からの事前発注を供述させる。",
          requires: { type: "evidence", id: "e_print_plate" },
          options: [
            {
              id: "offer_immunity_limited",
              label: "今回の供述協力だけを量刑考慮すると明示する",
              response: "『免責じゃなく量刑考慮。言葉を正確に使う巡察官は嫌いじゃない』\n\nダリオの代理人が巡察備品券で発注し、『人が消えた後に自然に見えるよう前夜から流せ』と指示したと供述した。",
              timeCost: 1,
              effects: [E.evidence("t_oren_seeded_rumor"), E.flag("oren_cooperating"), E.trust("oren", 6), E.xp(18), E.evaluate()],
              once: true,
            },
            {
              id: "threaten_full_charge",
              label: "噂災害の全責任で起訴すると迫る",
              requires: { type: "stat", id: "authority", op: "gte", value: 3 },
              response: "オレンは供述したが、『自分だけを生贄にする気だ』と街へ触れ回る準備も始めた。",
              timeCost: 1,
              effects: [E.evidence("t_oren_seeded_rumor"), E.flag("oren_hostile_witness"), E.trust("oren", -12), E.rumor("r_map_eats_roads", "intensity", 6), E.xp(14), E.evaluate()],
              once: true,
            },
          ],
        },
      ],
    },

    sena: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "エルドの傷は塞がる。でも、街が彼へ付けた『失踪者』という傷は、地図一枚で消えない。会いに行ってやって。" },
        { requires: { type: "evidence", id: "t_sena_treated_eld" }, text: "もう隠す理由はない。ただ、旧水路へ入るなら灰毒中和剤を持って。真実を見つけても倒れたら意味がない。" },
        { requires: { type: "flag", id: "medicine_delivered" }, text: "ヴェラから受領印が届いた。薬を届けてくれた人には、患者について話す責任があると思う。" },
        { text: "怪我なら座って。質問なら、先に巡察章をしまって。ここでは身元より傷の深さを優先する。" },
      ],
      topics: [
        {
          id: "ledger_permission",
          label: "エルドの薬購入記録",
          summary: "止血薬の台帳閲覧を求める。",
          options: [
            {
              id: "request_anonymized",
              label: "他の患者情報を隠した状態で閲覧を求める",
              response: "『必要な欄だけ写します。患者名簿を事件の網にしないで』\n\nエルドの購入行だけを開示する許可を得た。薬舗入口脇の受取台帳を調べられる。",
              timeCost: 0,
              effects: [E.flag("sena_ledger_permission"), E.trust("sena", 6), E.xp(5)],
              once: true,
              marker: "permission_ledger",
            },
            {
              id: "demand_full_ledger",
              label: "命令書で台帳全体の開示を求める",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『法的には従います。でも、この街の負傷者は次から薬舗へ来なくなる』\n\n台帳は見られるが、セナの協力は遠のいた。",
              timeCost: 0,
              effects: [E.flag("sena_ledger_permission"), E.trust("sena", -9), E.district("river", "trust", -3), E.xp(3)],
              once: true,
              marker: "permission_ledger",
            },
          ],
        },
        {
          id: "shelter_medicine",
          label: "避難所の薬不足",
          summary: "薬包をヴェラへ届けるサイド任務。",
          options: [
            {
              id: "offer_delivery",
              label: "巡察封鎖を越えて薬を届ける",
              response: "『河岸避難所のヴェラへ。包みを開けずに渡して。中身は鎮静薬と灰毒中和剤』\n\n薬包を受け取った。",
              timeCost: 0,
              effects: [E.questStart("q_quiet_medicine"), E.item("shelter_medicine", 1), E.flag("carrying_shelter_medicine"), E.trust("sena", 3), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "treated_eld",
          label: "事件後に治療した負傷者",
          summary: "エルド生存の決定的証言。",
          requires: {
            any: [
              { type: "flag", id: "medicine_delivered" },
              { type: "trust", id: "sena", op: "gte", value: 60 },
              { type: "deduction", id: "d_eld_feared_humans" },
            ],
          },
          options: [
            {
              id: "protect_patient",
              label: "生存情報を非公開で扱うと約束する",
              response: "『事件の翌朝、エルドはここへ来た。肩に拘束帯、脇腹に鈍器傷。“水路へ戻らないと、あれが街へ出る”と言って薬を持って地下へ戻った』\n\nセナは旧水路用の薬包と合図紙を証拠として提出した。",
              timeCost: 1,
              effects: [E.evidence("t_sena_treated_eld"), E.evidence("e_medicine_order"), E.flag("sena_confirms_eld_alive"), E.trust("sena", 9), E.xp(24), E.evaluate()],
              once: true,
            },
            {
              id: "invoke_duty",
              label: "現在も危険なら救助情報が必要だと説明する",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『救助目的に限るなら話す』\n\nエルドは事件後も生きており、灰塩核を抑えるため旧水路へ戻った。薬包の受取地点は第三排水鐘の下。",
              timeCost: 1,
              effects: [E.evidence("t_sena_treated_eld"), E.evidence("e_medicine_order"), E.flag("sena_confirms_eld_alive"), E.trust("sena", 3), E.xp(22), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "gray_poison",
          label: "灰毒と噂の関係",
          summary: "旧水路での危険と対策を知る。",
          requires: {
            any: [
              { type: "evidence", id: "e_bandage_receipt" },
              { type: "evidence", id: "e_gray_salt_sample" },
            ],
          },
          options: [
            {
              id: "ask_symptoms",
              label: "灰塩曝露の症状を聞く",
              response: "『最初は、自分が聞いた言葉と考えた言葉の区別がなくなる。次に、同じ言葉だけを繰り返す。最後は、その言葉の形が皮膚や周囲へ出る』\n\n噂戦で平静を失うことは、単なる精神的敗北ではない。",
              timeCost: 0,
              effects: [E.flag("knows_gray_poison"), E.item("gray_antidote", 2), E.trust("sena", 2), E.xp(5)],
              once: true,
            },
          ],
        },
      ],
    },

    kasim: {
      greetings: [
        { requires: { type: "evidence", id: "t_kasim_midnight_cart" }, text: "船は嘘をつかん。重い荷なら沈むし、人が乗れば息をする。嘘をつくのは帳簿と制服だ。" },
        { requires: { type: "flag", id: "chapter_complete" }, text: "第三格子の封鎖が解けた。今度から水路を使うなら、採掘箱じゃなく避難路として使ってくれ。" },
        { text: "巡察の封鎖札なら見飽きた。川へ貼っても流れるだけだ。質問があるなら、こっちの船を止めない条件で聞く。" },
      ],
      topics: [
        {
          id: "midnight_cart",
          label: "事件夜の河岸通り",
          summary: "第七班荷車の移動を聞く。",
          options: [
            {
              id: "separate_smuggling",
              label: "密航の件と失踪証言を分けて扱う",
              requires: { type: "stat", id: "empathy", op: "gte", value: 2 },
              response: "『そこを分けるなら話す。第七班の荷車が北倉から来た。荷台から咳がして、第三格子で止まった。箱だけなら咳はしない』",
              timeCost: 1,
              effects: [E.evidence("t_kasim_midnight_cart"), E.trust("kasim", 10), E.flag("kasim_cooperating"), E.xp(15), E.evaluate()],
              once: true,
            },
            {
              id: "show_mud_route",
              label: "河岸藻を含む泥と引きずり跡を示す",
              requires: { type: "evidence", id: "e_river_mud" },
              response: "『証拠が川まで来てるなら、黙る意味もない』\n\n荷車は第三排水格子で止まり、負傷した人間と灰色の箱を地下へ下ろした。",
              timeCost: 1,
              effects: [E.evidence("t_kasim_midnight_cart"), E.trust("kasim", 4), E.xp(14), E.evaluate()],
              once: true,
            },
            {
              id: "threaten_boat",
              label: "密航を摘発すると迫る",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "証言は得たが、河岸の船はあなたが来るたび岸を離れるようになった。",
              timeCost: 1,
              effects: [E.evidence("t_kasim_midnight_cart"), E.trust("kasim", -12), E.district("river", "trust", -6), E.xp(10), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "third_grate",
          label: "第三排水格子の構造",
          summary: "旧水路への入口を確認する。",
          requires: { type: "evidence", id: "t_kasim_midnight_cart" },
          options: [
            {
              id: "ask_access",
              label: "荷を下ろす経路を図にしてもらう",
              response: "『格子の下に旧保守路がある。だが巡察封蝋だけじゃなく、今は灰塩の影が入口を塞いでる。位置を確定して地図へ線を戻さないと、入っても同じ場所へ戻される』",
              timeCost: 0,
              effects: [E.flag("kasim_explains_grate"), E.trust("kasim", 3), E.xp(6)],
              once: true,
            },
          ],
        },
      ],
    },

    vela: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "真実が出た朝、避難所には怒る人と安心する人が同時に来ました。どちらも街の反応です。片方だけを記録しないでください。" },
        { requires: { type: "flag", id: "medicine_delivered" }, text: "薬は届きました。眠れる人が増えれば、噂を繰り返す声も減ります。これは小さな鎮圧です。" },
        { requires: { type: "item", id: "shelter_medicine", op: "gte", value: 1 }, text: "セナからの包みですね。封鎖が続いて、今夜の分が足りないところでした。" },
        { text: "ここでは、灰獣を見たと言う人も、見ていないと言う人も同じ寝台を使います。恐怖を訂正する前に、眠れる場所を作る必要があります。" },
      ],
      topics: [
        {
          id: "deliver_medicine",
          label: "セナの薬包を渡す",
          summary: "避難所の不安を下げ、セナの信頼を得る。",
          requires: { type: "item", id: "shelter_medicine", op: "gte", value: 1 },
          options: [
            {
              id: "hand_package",
              label: "封を開けず、受領記録だけ残す",
              response: "ヴェラは薬包の封を確認し、避難者の名ではなく人数だけを受領簿へ記した。\n\n『患者の名前を守ったまま、必要な量は記録できます』",
              timeCost: 1,
              effects: [E.item("shelter_medicine", -1), E.flag("medicine_delivered"), E.questComplete("q_quiet_medicine"), E.trust("vela", 6), E.trust("sena", 7), E.district("river", "fear", -8), E.world("stability", 3), E.xp(24), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "fear_management",
          label: "噂を否定しても恐怖が消えない理由",
          summary: "公開政策の重要な助言を得る。",
          options: [
            {
              id: "ask_publication",
              label: "真実を一度に公開すべきか尋ねる",
              response: "『真実は薬に似ています。必要でも、量と順序を誤れば人を倒す。証人を守り、逃げ道を作り、誰が質問へ答えるか決めてから公開してください』",
              timeCost: 0,
              effects: [E.flag("vela_advises_staged_release"), E.trust("vela", 3), E.xp(5)],
              once: true,
            },
            {
              id: "ask_suppression",
              label: "混乱を避けるため隠す選択を尋ねる",
              response: "『一晩だけ伏せて人を逃がすことと、永遠に伏せて責任を消すことは違います。期限のない沈黙は、たいてい強い人だけを守ります』",
              timeCost: 0,
              effects: [E.flag("vela_warns_suppression"), E.trust("vela", 2), E.xp(5)],
              once: true,
            },
          ],
        },
      ],
    },

    eld: {
      greetings: [
        { requires: { type: "flag", id: "chapter_complete" }, text: "俺の名前が失踪者から証人へ戻った。それだけで十分だと言いたいが、灰塩を掘った人間はまだいる。次の地図でも、線を追ってくれ。" },
        { requires: { type: "evidence", id: "e_eld_statement" }, text: "何度話しても、あの地下の音が自分の声に混じる。必要なことだけ聞いてくれ。" },
        { text: "……巡察章か。待て、攻撃するな。俺はエルドだ。灰塩核が『灰獣』の言葉を食い続けている。先に核を止めないと、俺を連れ出す道そのものが閉じる。" },
      ],
      topics: [
        {
          id: "after_rescue_statement",
          label: "灰塩採掘と拘束の全経緯",
          summary: "事件の生存証人から最終証言を得る。",
          requires: { type: "flag", id: "eld_rescued" },
          options: [
            {
              id: "record_full_account",
              label: "休息を挟みながら、時系列で記録する",
              response: "エルドは、灰塩運搬を請け負ったこと、災害との相関に気づいたこと、帳簿を持ち出してダリオに拘束されたことを話した。\n\n脱出後に地下へ戻ったのは、噂で膨らんだ灰塩核が北区の地盤を変え始めたためだった。",
              timeCost: 1,
              effects: [E.evidence("e_eld_statement"), E.trust("eld", 9), E.flag("eld_full_statement"), E.xp(28), E.evaluate()],
              once: true,
            },
            {
              id: "demand_signature",
              label: "正式供述書への即時署名を求める",
              requires: { type: "stat", id: "authority", op: "gte", value: 2 },
              response: "『生きて地上へ出たばかりで、最初に渡されるのがまた巡察の紙か』\n\nエルドは署名したが、信頼は生まれなかった。供述内容は同じでも、最終公開時の協力姿勢が弱くなる。",
              timeCost: 1,
              effects: [E.evidence("e_eld_statement"), E.trust("eld", -4), E.flag("eld_full_statement"), E.xp(22), E.evaluate()],
              once: true,
            },
          ],
        },
        {
          id: "ledger_copy",
          label: "採掘帳簿の隠し場所",
          summary: "災害と利益の循環を示す資料。",
          requires: { type: "flag", id: "eld_rescued" },
          options: [
            {
              id: "ask_location",
              label: "持ち出した帳簿が残っているか尋ねる",
              response: "『灰塩核の南、沈殿槽の壁に防水袋を挟んだ。原本は取られたが、三か月分を写してある』",
              timeCost: 0,
              effects: [E.flag("eld_bag_revealed"), E.trust("eld", 3), E.xp(5)],
              once: true,
            },
          ],
        },
        {
          id: "what_to_publish",
          label: "何を街へ公開してほしいか",
          summary: "最終報告への証人の意思。",
          requires: { type: "evidence", id: "e_eld_statement" },
          options: [
            {
              id: "ask_preference",
              label: "証人としての希望を聞く",
              response: "『俺の名前は出していい。自分で運んだ責任も書け。ただ、イネスやロウを“ダリオと同じ巡察側”で一括りにするな。誰が何を選んだか分けてくれ』",
              timeCost: 0,
              effects: [E.flag("eld_requests_precise_accountability"), E.trust("eld", 4), E.xp(5)],
              once: true,
            },
          ],
        },
      ],
    },
  };
})(window.Haimachi);
