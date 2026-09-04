(function registerQuests(H) {
  "use strict";

  H.Data.Quests = [
    {
      id: "q_main",
      type: "main",
      title: "雨鐘の失踪者",
      summary: "行商人エルドの失踪と、北区に現れた灰獣の噂を調査する。",
      tracked: true,
      initialStatus: "active",
      stages: [
        {
          title: "地図院の命令",
          description: "上席官ナイラから巡察命令と調査道具を受け取る。",
          objectives: [
            { id: "receive_orders", text: "ナイラから任務を受ける", condition: { type: "flag", id: "field_kit_received" }, rewardText: "巡察権限" },
          ],
          onCompleteEffects: [
            { type: "notify", title: "調査開始", text: "北区と河岸区で失踪の痕跡を追えるようになった。", icon: "巡" },
          ],
        },
        {
          title: "獣跡の下の人間",
          description: "北区で失踪現場・灰獣の足跡・住民証言を調べる。",
          objectives: [
            { id: "find_seal", text: "失踪現場の巡察章を回収する", condition: { type: "evidence", id: "e_bloody_seal" }, rewardText: "詰所への入場" },
            { id: "test_tracks", text: "灰獣の足跡を検証する", condition: { type: "evidence", id: "e_false_tracks" } },
            { id: "hear_last_words", text: "エルドが恐れていた相手を確認する", condition: { type: "evidence", id: "t_mirei_last_words" }, optional: true },
            { id: "solve_staged", text: "推理盤で『偽装された獣跡』を証明する", condition: { type: "deduction", id: "d_tracks_staged" } },
          ],
          onCompleteEffects: [
            { type: "mapUnlock", id: "watch_house" },
            { type: "notify", title: "灰獣説に亀裂", text: "巡察詰所で第七班の記録を確認する必要がある。", icon: "証" },
          ],
        },
        {
          title: "消された当番表",
          description: "巡察詰所の記録・備品・関係者を調べ、エルド拘束の経路を証明する。",
          objectives: [
            { id: "missing_log", text: "欠落した当番記録を復元する", condition: { type: "evidence", id: "e_missing_log" } },
            { id: "witness_or_requisition", text: "拘束の実行者または備品を特定する", condition: { any: [{ type: "evidence", id: "t_lo_hidden_seal" }, { type: "evidence", id: "e_requisition_note" }, { type: "evidence", id: "t_baldo_watch_cloak" }] } },
            { id: "detention_deduction", text: "推理盤で『巡察による拘束』を証明する", condition: { type: "deduction", id: "d_watch_detained_eld" } },
          ],
          onCompleteEffects: [
            { type: "notify", title: "失踪は拘束だった", text: "次は、エルドが事件後どこへ移動したかを追う。", icon: "録" },
          ],
        },
        {
          title: "地図にない生存経路",
          description: "河岸の泥、薬、笛、荷車をつなぎ、エルドの現在位置を特定する。",
          objectives: [
            { id: "post_event_life", text: "事件後にエルドが生存していた証拠を得る", condition: { any: [{ type: "evidence", id: "t_sena_treated_eld" }, { type: "evidence", id: "t_elka_whistle" }] } },
            { id: "route_evidence", text: "旧水路へ続く物理経路を確認する", condition: { any: [{ type: "evidence", id: "e_river_mud" }, { type: "evidence", id: "t_kasim_midnight_cart" }, { type: "evidence", id: "e_child_map" }] } },
            { id: "location_deduction", text: "推理盤で『旧水路の生存経路』を確定する", condition: { type: "deduction", id: "d_eld_in_waterworks" } },
            { id: "obtain_warrant", text: "ナイラへ経路を説明し、旧水路の通行線を戻す", condition: { type: "mapUnlocked", id: "old_waterworks" } },
          ],
          onCompleteEffects: [
            { type: "notify", title: "旧水路が地図へ戻った", text: "河岸第三排水格子から地下へ降り、エルドを救助する。", icon: "図" },
          ],
        },
        {
          title: "噂に身体を貸すもの",
          description: "旧水路の灰塩核を止め、エルドを地上へ連れ戻す。",
          objectives: [
            { id: "enter_waterworks", text: "旧水路・第三採掘区へ入る", condition: { type: "flag", id: "entered_waterworks" } },
            { id: "defeat_archive_beast", text: "灰塩核から生じた記録喰いを論破する", condition: { type: "encounterCleared", id: "enc_waterworks_final" } },
            { id: "rescue_eld", text: "エルドの生存を確保する", condition: { type: "flag", id: "eld_rescued" } },
          ],
          onCompleteEffects: [
            { type: "notify", title: "失踪者を発見", text: "事件は終わっていない。生存証言と採掘資料を集め、責任系統を完成させる。", icon: "商" },
          ],
        },
        {
          title: "街へ残す全体像",
          description: "生存証人・命令系統・灰塩災害・利益循環を推理盤で固定する。",
          objectives: [
            { id: "eld_statement", text: "エルドの正式証言を記録する", condition: { type: "evidence", id: "e_eld_statement" } },
            { id: "command_chain", text: "ダリオの指示系統を証明する", condition: { type: "deduction", id: "d_dario_ordered_coverup" } },
            { id: "mechanism", text: "灰塩と噂の実体化を説明する", condition: { type: "deduction", id: "d_gray_salt_mechanism" } },
            { id: "whole_case", text: "事件の利益循環を完成させる", condition: { type: "deduction", id: "d_complete_case" } },
          ],
          onCompleteEffects: [
            { type: "flag", id: "report_unlocked", value: true },
            { type: "notify", title: "正式報告が可能", text: "地図院の報告卓で、原因・責任・公開方針を決める。", icon: "印" },
          ],
        },
        {
          title: "嘘の地図へ引く最後の線",
          description: "地図院の報告卓で、事件をどのように街へ記録するか決める。",
          objectives: [
            { id: "submit_report", text: "正式報告書を提出する", condition: { type: "flag", id: "chapter_complete" } },
          ],
          onCompleteEffects: [],
        },
      ],
    },
    {
      id: "q_silent_bell",
      type: "side",
      title: "濁った雨鐘",
      summary: "噂を増幅する北区の雨鐘を調べ、失われた舌金を戻す。",
      initialStatus: "locked",
      stages: [
        {
          title: "正しい三拍",
          description: "河岸で舌金を回収し、鐘の共鳴を戻す。",
          objectives: [
            { id: "find_clapper", text: "河岸の桟橋下から雨鐘の舌金を回収する", condition: { type: "flag", id: "bell_clapper_found" } },
            { id: "repair_bell", text: "北区の雨鐘を修理する", condition: { type: "flag", id: "rain_bell_repaired" } },
          ],
          onCompleteEffects: [],
        },
      ],
      rewardsText: "北区の恐怖低下／共鳴片（最終戦で有利）",
    },
    {
      id: "q_child_map",
      type: "side",
      title: "地面の下を描く子",
      summary: "エルカが失くした反響地図の半分を地図院で探す。",
      initialStatus: "locked",
      stages: [
        {
          title: "大人の地図にない線",
          description: "廃棄測量紙から反響点の紙片を見つけ、エルカへ返す。",
          objectives: [
            { id: "fragment", text: "地図院で測量紙片を回収する", condition: { type: "flag", id: "child_map_fragment_found" } },
            { id: "return", text: "エルカへ紙片を返し、音地図を完成させる", condition: { type: "evidence", id: "e_child_map" } },
          ],
          onCompleteEffects: [],
        },
      ],
      rewardsText: "証拠『エルカの裏道地図』／経験値",
    },
    {
      id: "q_quiet_medicine",
      type: "side",
      title: "名前を問わない薬",
      summary: "巡察封鎖を越え、河岸避難所へセナの薬包を届ける。",
      initialStatus: "locked",
      stages: [
        {
          title: "患者名を残さない受領簿",
          description: "薬包を開けずにヴェラへ渡す。",
          objectives: [
            { id: "deliver", text: "避難所のヴェラへ薬を届ける", condition: { type: "flag", id: "medicine_delivered" } },
          ],
          onCompleteEffects: [],
        },
      ],
      rewardsText: "河岸の恐怖低下／セナの信頼／生存証言への道",
    },
    {
      id: "q_poster_war",
      type: "side",
      title: "貼り紙の戦争",
      summary: "事件前から流された灰獣貼り紙の印刷経路を追う。",
      initialStatus: "locked",
      stages: [
        {
          title: "恐怖の版元",
          description: "オレンの版箱と注文経路を調べる。",
          objectives: [
            { id: "plate", text: "灰獣貼り紙の印刷版を確保する", condition: { type: "evidence", id: "e_print_plate" } },
            { id: "statement", text: "事件前の発注経路を供述させる", condition: { type: "evidence", id: "t_oren_seeded_rumor" }, optional: true },
          ],
          onCompleteEffects: [
            { type: "questComplete", id: "q_poster_war" },
          ],
        },
      ],
      rewardsText: "灰獣噂の信用低下／ダリオの計画証拠",
    },
    {
      id: "q_clerks_courage",
      type: "side",
      title: "書記官の不完全な罪",
      summary: "記録を改ざんしたイネスの意図を証明し、証人保護を整える。",
      initialStatus: "locked",
      stages: [
        {
          title: "消した者を、消さない",
          description: "内部告発の意図を証明し、公開前の保護手続きを用意する。",
          objectives: [
            { id: "prove_intent", text: "推理盤で改ざんの意図を証明する", condition: { type: "deduction", id: "d_records_as_signal" } },
            { id: "protect", text: "ナイラと証人保護を準備する", condition: { type: "flag", id: "witness_protection_ready" } },
          ],
          onCompleteEffects: [
            { type: "questComplete", id: "q_clerks_courage" },
          ],
        },
      ],
      rewardsText: "公開時の混乱低下／イネスの生存",
    },
  ];

  H.Data.QuestById = H.Core.Util.toMap(H.Data.Quests);
})(window.Haimachi);
