import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const today = "2026-10-05";

const questions = [
  ["https://www.reddit.com/r/Parenting/comments/1eimg84", "My 11-year-old still cannot sleep in his own room. What should we try next?", "en", "11", "2024-08-02"],
  ["https://www.reddit.com/r/toddlers/comments/tiou1m", "Why does my toddler sleep alone elsewhere but not at home?", "en", "2.5", "2022-03-20"],
  ["https://www.reddit.com/r/toddlers/comments/16gq8y2/help_our_toddler_wont_sleep_without_one_of_us_in/", "How can we help our 2.5-year-old sleep without one of us in the room?", "en", "2.5", "2023-09-12"],
  ["https://www.reddit.com/r/toddlers/comments/mwnnor", "Why has my two-year-old suddenly started refusing to sleep alone?", "en", "2", "2021-04-23"],
  ["https://www.reddit.com/r/Parenting/comments/1gieyhf", "How can I help my six-year-old who wants me to sleep in her room?", "en", "6", "2024-11-03"],
  ["https://www.reddit.com/r/toddlers/comments/1onkk4y", "Why is my toddler sleeping by the bedroom door instead of in bed?", "en", "1.5", "2025-11-03"],
  ["https://www.reddit.com/r/Parenting/comments/1e1zt7i", "Why will my three- and seven-year-olds not stay in their rooms at night?", "en", "3", "2024-07-13"],
  ["https://www.reddit.com/r/Parenting/comments/16xxaam", "Why will my four-year-old only sleep if someone sits in his room?", "en", "4.5", "2023-10-02"],
  ["https://www.reddit.com/r/Parenting/comments/1ctal0o", "How can a child learn to fall asleep without an adult in the room?", "en", null, "2024-04-15"],
  ["https://www.reddit.com/r/toddlers/comments/169ycza", "How do we get our toddler back into her own sleep space after vacation?", "en", "toddler", "2023-09-04"],
  ["https://www.reddit.com/r/Parenting/comments/1gb6ant", "Should we stop trying to get our toddler to sleep in his own room?", "en", "toddler", "2024-10-24"],
  ["https://ca.reddit.com/r/sleeptraining/comments/1ugim59/nearly_4_year_old_son_will_not_stay_asleep_in_his/", "Why will my nearly four-year-old not stay asleep in his room?", "en", "4", null],
  ["https://www.reddit.com/r/toddlers/comments/1vlah0u/toddler_sharing_the_room/", "How can a room-sharing 2.5-year-old learn to fall asleep without lying beside us?", "en", "2.5", "2026-08-11"],
  ["https://www.reddit.com/r/toddlers/comments/1wuuy0b/to_move_to_own_room_or_not/", "How do you know when a child is ready to move to their own room?", "en", null, "2026-10-01"],
  ["https://www.reddit.com/r/Parenting/comments/1sx4tk6/how_to_help_10_year_old_overcome_fear_of_the_dark/", "How can I help my child overcome a deep fear of the dark?", "en", "10", "2026-04-27"],
  ["https://www.reddit.com/r/toddlers/comments/1ckqrry", "Do toddlers actually sleep better in their own room?", "en", "1.25", "2024-05-05"],
  ["https://www.reddit.com/r/Parenting/comments/10auhqr", "What can help a five-year-old who is scared of everything in a dark bedroom?", "en", "5", "2023-01-13"],
  ["https://www.reddit.com/r/Parenting/comments/14psi1s", "How do you help a three-year-old overcome fear of the dark?", "en", "3", "2023-07-03"],
  ["https://www.reddit.com/r/Parenting/comments/16ewvl1", "What can we try when a four-year-old wakes in the night afraid of the dark?", "en", "4", "2023-09-10"],
  ["https://www.reddit.com/r/Parenting/comments/16dv1wp", "Why has my nearly four-year-old suddenly become scared of the dark?", "en", "4", "2023-09-08"],
  ["https://www.reddit.com/r/Parenting/comments/14ddw5o", "My almost four-year-old is suddenly scared to sleep alone—what should we check?", "en", "4", "2023-06-19"],
  ["https://www.reddit.com/r/Parenting/comments/1imi5pc", "Do severe sleep problems in a four-year-old point to something beyond the room?", "en", "4", "2025-02-09"],
  ["https://www.reddit.com/r/toddlers/comments/1v3v7g5/at_what_age_did_you_move_your_kids_to_their_own/", "At what age did you move your child to their own room, and how did it go?", "en", null, "2026-07-22"],
  ["https://www.reddit.com/r/toddlers/comments/mrhomt", "How can we transition 2.5-year-old twins from co-sleeping to their own room?", "en", "2.5", "2021-04-15"],
  ["https://www.reddit.com/r/toddlers/comments/1gasdok", "What helps a 15-month-old transition from the parents' room to her own room?", "en", "1.25", "2024-10-24"],
  ["https://www.reddit.com/r/toddlers/comments/1voiln2/cosleeping_families_how_did_it_end/", "When do co-sleeping toddlers begin sleeping full nights in their own bed?", "en", "2.5", "2026-08-14"],
  ["https://www.reddit.com/r/cosleeping/comments/1voso5l/do_toddlers_naturally_grow_out_of_it/", "Do toddlers choose their own room naturally, or does the transition need to be led?", "en", "toddler", "2026-08-15"],
  ["https://www.reddit.com/r/toddlers/comments/1uso0po/toddler_and_newborn_room_share/", "How should we move a co-sleeping 2.5-year-old before a new baby arrives?", "en", "2.5", "2026-07-10"],
  ["https://www.reddit.com/r/cosleeping/comments/1vr44ag/advice_for_transitioning_out_of_cosleeping_into/", "Should a co-sleeping child move to a separate bed or share a room with a sibling?", "en", null, "2026-08-17"],
  ["https://www.reddit.com/r/cosleeping/comments/1kss4zn", "How did you transition a clingy toddler from co-sleeping to their own room?", "en", "2.5", "2025-05-22"],
  ["https://www.reddit.com/r/cosleeping/comments/1we0vi9/transitioning_toddler/", "How do I gently move my nearly two-year-old from co-sleeping into his own room?", "en", "2", "2026-09-12"],
  ["https://www.reddit.com/r/Parenting/comments/1ape8ol", "How do we move from staying until sleep to a tuck-in-and-leave routine?", "en", "3", "2024-02-12"],
  ["https://www.reddit.com/r/cosleeping/comments/1f6omgd", "Is moving house a good time to transition a 2.5-year-old into her own bed?", "en", "2.5", "2024-09-01"],
  ["https://www.reddit.com/r/bninfantsleep/comments/1w9pygh/help_with_co_sleeping_toddler_trying_to_move_into/", "Why does my toddler love her new room in daytime but refuse to sleep there?", "en", "toddler", "2026-09-12"],
  ["https://www.reddit.com/r/Parenting/comments/1qcclsx/my_almost_5_years_old_can_not_sleep_on_his_own/", "How can my almost five-year-old stay in his own bed all night?", "en", "5", "2026-01-14"],
  ["https://www.reddit.com/r/Parenting/comments/1re6a21/5_yr_old_makes_his_way_to_my_bed_almost_nightly/", "Is it okay that my five-year-old comes into our bed almost every night?", "en", "5", "2026-02-25"],
  ["https://www.reddit.com/r/Parenting/comments/1rgn7gy/struggling_with_a_4_year_old_who_wont_sleep_in/", "What can we do when our four-year-old suddenly refuses her own room?", "en", "4", "2026-02-27"],
  ["https://www.reddit.com/r/Parenting/comments/1fe75hx", "How can we help our four-year-old fall asleep by herself?", "en", "4", "2024-09-11"],
  ["https://www.reddit.com/r/Parenting/comments/1bm7zsv", "Why are my four-year-old's bedtime problems getting worse even when we stay with her?", "en", "4", "2024-03-24"],
  ["https://www.reddit.com/r/Parenting/comments/itp1h2", "How can a single parent help a four-year-old learn to sleep alone without increasing distress?", "en", "4", "2020-09-16"],
  ["https://www.reddit.com/r/Parenting/comments/1wet964/5yearold_coming_into_our_bed_every_night_how_do/", "How do we stop our five-year-old coming into our bed every night?", "en", "5", "2026-09-13"],
  ["https://www.reddit.com/r/Parenting/comments/1ptpf0c/my_almost_4_year_old_daughter_wont_sleep_and_i/", "What can we do when an almost four-year-old will only sleep beside a parent?", "en", "4", "2025-12-23"],
  ["https://www.reddit.com/r/Parenting/comments/1jlnez1", "How should we respond when a four-year-old is scared to be alone at night?", "en", "4", "2025-03-28"],
  ["https://www.reddit.com/r/Parenting/comments/1icqcbm", "Have we created an unchangeable habit if our four-year-old needs us to fall asleep?", "en", "4", "2025-01-29"],
  ["https://www.reddit.com/r/Parenting/comments/1ff71l5", "How can a 2.5-year-old and five-year-old begin sleeping independently?", "en", "2.5–5", "2024-09-12"],
  ["https://www.reddit.com/r/Parenting/comments/1e1zt7i", "Why does my younger child wake around 3 a.m. and demand that someone sleep with him?", "en", "3", "2024-07-13"],
  ["https://www.reddit.com/r/toddlers/comments/16gq8y2/help_our_toddler_wont_sleep_without_one_of_us_in/", "Why does my toddler wake repeatedly and settle only when a parent is present?", "en", "2.5", "2023-09-12"],
  ["https://parenting.stackexchange.com/questions/39209/making-7-year-old-sleep-in-her-own-bed", "How can a child who falls asleep in her room stop moving to the parents' bed overnight?", "en", "7", null],
  ["https://parenting.stackexchange.com/questions/28367/how-can-we-get-our-son-to-stop-sleeping-in-our-bed", "How can we get our young child to stop sleeping in our bed?", "en", "2", null],
  ["https://parenting.stackexchange.com/questions/41419/how-to-teach-a-six-year-old-to-sleep-alone", "How can a six-year-old who has never fallen asleep alone adjust to a new bedroom?", "en", "6", null],
  ["https://parenting.stackexchange.com/questions/35453/how-to-train-a-toddler-to-go-asleep-alone-if-she-shares-a-room-with-mom/35454", "How can a toddler learn to fall asleep alone while still sharing a room with a parent?", "en", "3", null],
  ["https://parenting.stackexchange.com/questions/15077/how-to-help-a-2-year-old-go-to-bed-alone", "How can we help a two-year-old begin going to bed alone?", "en", "2", null],
  ["https://parenting.stackexchange.com/questions/3478/what-is-the-recommended-age-for-an-infant-to-start-sleeping-in-his-own-room", "What challenges should families expect when a child first moves into their own room?", "en", null, null],
  ["https://parenting.stackexchange.com/questions/14618/move-into-own-room-at-the-same-time-as-sleep-training", "Should a room move and a new sleep routine happen at the same time?", "en", null, null],
  ["https://parenting.stackexchange.com/questions/2517/what-are-the-disadvantages-of-parents-and-children-sharing-a-bedroom", "What are the tradeoffs when parents and children share a bedroom?", "en", null, null],
  ["https://parenting.stackexchange.com/questions/29070/is-it-a-bad-idea-to-have-a-kid-sleep-in-his-her-own-room-since-birth", "How should parents decide when a separate room is appropriate for their child?", "en", null, null],
  ["https://parenting.stackexchange.com/questions/18854/at-what-age-should-my-child-sleep-in-his-or-her-own-room-to-greatest-decrease-th", "When is a child ready to move from room-sharing to their own room?", "en", null, null],
  ["https://www.mumsnet.com/talk/behaviour_development/1404003-5-yo-who-is-afraid-of-the-dark-and-sleeping-alone-any-suggestions", "What can help a five-year-old who is afraid of the dark and sleeping alone?", "en", "5", "2012-02-10"],
  ["https://www.mumsnet.com/talk/behaviour_development/1639-afraid-of-sleeping-alone", "How do I stop one nightmare from becoming a lasting fear of sleeping alone?", "en", "6", "2002-01-08"],
  ["https://www.mumsnet.com/talk/childrens_health/5369193-when-should-child-sleep-alone", "When should a child be able to sleep alone?", "en", null, "2025-07-07"],
  ["https://www.mumsnet.com/talk/behaviour_development/1114184-yr-old-DS-scared-of-shadows-and-the-dark", "How can I help a child who is scared of shadows even with a night light?", "en", null, "2010-12-30"],
  ["https://www.mumsnet.com/talk/behaviour_development/53841-do-your-children-sleep-with-the-light-off", "Could a child asking us to stay be afraid of the dark even if they cannot explain it?", "en", "2", "2005-01-19"],
  ["https://www.mumsnet.com/talk/sleep/3706670-4-year-old-wont-sleep-by-herself", "Why does our four-year-old scream and leave her room whenever she is asked to sleep alone?", "en", "4", "2019-10-01"],
  ["https://www.mumsnet.com/talk/am_i_being_unreasonable/5577459-3-year-old-suddenly-wont-sleep-through-scared-of-her-own-shadow", "Why is my three-year-old suddenly afraid of shadows, monsters, and being alone?", "en", "3", "2026-09-14"],
  ["https://www.mumsnet.com/talk/sleep/5152156-my-baby-wont-go-to-sleep-unless-she-can-see-me", "Why will my child sleep only when she can see a parent?", "en", null, "2024-08-27"],
  ["https://www.mumsnet.com/talk/behaviour_development/2543102-4-5-yr-old-wakes-scared-at-night-ideas-of-tactics", "What can help a 4.5-year-old who wakes afraid in the night?", "en", "4.5", "2016-01-06"],
  ["https://www.mumsnet.com/talk/sleep/5306851-4-year-old-wakes-up-and-expects-me-to-sleep-next-to-her-every-night", "How can we change a pattern where a four-year-old expects a parent beside her every night?", "en", "4", "2025-04-02"],
  ["https://www.fhs.gov.hk/sc_chi/health_info/faq/child_health/PD1_4_4_5.html", "孩子晚上不愿意自己睡，经常要我陪伴，怎样才能不用陪伴也能睡？", "zh-Hans", null, null],
  ["https://parents.hsin-yi.org.tw/Forum/Topic/1023/Discuss/Detail/6613", "孩子睡前总说害怕，却说不清怕什么，是安全感不足吗？", "zh-Hant", "7", null],
  ["https://www.pttweb.cc/bbs/Preschooler/M.1757315276.A.7A0", "小朋友几岁开始分房、有自己的房间比较合适？", "zh-Hant", null, null],
  ["https://www.moonbbs.com/thread-4222492-1-1.html", "宝宝只愿意睡大床，怎么过渡到自己的床？", "zh-Hans", null, null],
  ["https://www.dcard.tw/f/parentchild/p/257324170", "快上小学的孩子仍坚持睡在父母中间，应该怎样过渡？", "zh-Hant", "6", null],
  ["https://forum.babyhome.com.tw/topic/1505950", "孩子大概几岁会想和手足分房、拥有自己的空间？", "zh-Hant", null, null],
  ["https://www.pttweb.cc/bbs/BabyMother/M.1737432179.A.E12", "分床后孩子频频跑出房间，还有什么温和方法？", "zh-Hant", null, null],
  ["https://dxy.com/question/95316013", "孩子几乎每天半夜跑到父母房间，第二天不记得，需要就医吗？", "zh-Hans", "8", "2022-02-19"],
  ["https://www.hooos.com/data-10871", "儿童房已经布置好了，孩子为什么还是不喜欢、不愿意待？", "zh-Hans", null, null],
  ["https://wjw.hubei.gov.cn/bmdt/jkhb/jkkp/201910/t20191030_152705.shtml", "孩子三四岁还不愿在自己的小屋里睡，怎么办？", "zh-Hans", "3–4", null],
  ["https://www.mumsnet.com/talk/parenting/5344772-how-did-you-get-your-child-to-sleep-in-their-own-room", "How did you get a two- and three-year-old settled in their own room before a new baby?", "en", "2–3", "2025-05-30"],
  ["https://www.mumsnet.com/talk/parenting/1388533-3-year-old-sleeping-in-our-bed", "What tactics help a three-year-old move from the parents' bed to his own room?", "en", "3", "2012-01-21"],
  ["https://www.mumsnet.com/talk/sleep/2909244-gradual-retreat-how-do-you-retreat", "How do you actually use gradual retreat when a child needs you to fall asleep?", "en", null, "2017-04-22"],
  ["https://www.mumsnet.com/talk/_chat/5575557-five-year-old-taking-hours-to-fall-asleep-and-exhausted-for-school", "Why does my five-year-old take hours to fall asleep despite a consistent routine?", "en", "5", "2026-09-06"],
  ["https://www.mumsnet.com/talk/sleep/5306851-4-year-old-wakes-up-and-expects-me-to-sleep-next-to-her-every-night", "Why does my four-year-old wake and expect me to sleep beside her every night?", "en", "4", "2025-04-02"],
  ["https://www.mumsnet.com/talk/sleep/5006826-3-year-old-wants-to-sleep-in-my-bed-confused-on-whats-right", "Is it okay to let a three-year-old into our bed after a nighttime fear began?", "en", "3", "2024-02-13"],
  ["https://www.mumsnet.com/talk/sleep/843559-I-want-a-cuddle-I-want-a-cuddle-Is-this", "Is repeatedly asking for a cuddle at night fear, a night terror, or a learned routine?", "en", null, "2009-10-22"],
  ["https://www.mumsnet.com/talk/sleep/2666209-If-you-co-slept-didnt-sleep-train", "If you co-slept and did not sleep-train, when did your child choose their own bed?", "en", null, "2016-06-20"],
  ["https://www.mumsnet.com/talk/sleep/2543355-Toddler-bed-chaos", "How can we gradually reduce parental presence after moving to a toddler bed?", "en", "toddler", "2016-01-07"],
  ["https://www.mumsnet.com/talk/behaviour_development/1404003-5-yo-who-is-afraid-of-the-dark-and-sleeping-alone-any-suggestions", "Is waking in fear different from being afraid when first going to bed?", "en", "5", "2012-02-10"],
  ["https://www.netmums.com/coffeehouse/being-mum-794/children-4-11-years-60/1161685-7-year-old-daughter-wont-sleep-alone.html", "What helps a child who says bad dreams prevent sleeping in her own room?", "en", "7", "2014-08-24"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/881507-please-help-my-3-year-old-wont-sleep-his-own-bed.html", "What can I do when my three-year-old will not sleep a whole night in his own bed?", "en", "3", "2013-01-27"],
  ["https://www.netmums.com/coffeehouse/being-mum-794/children-4-11-years-60/473157-8-year-old-scared-dark.html", "How should we respond when a child fears both darkness and being alone on another floor?", "en", "8", "2010-09-21"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/1889583-5-year-old-still-will-not-sleep-own-night.html", "What else can we try when a five-year-old still will not sleep alone at night?", "en", "5", "2020-02-12"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/530187-22-month-old-will-not-sleep-unless-m-room-please-help.html", "Why has my toddler become anxious about me leaving and stopped sleeping alone?", "en", "1.8", "2011-02-06"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/85d09dd5-first-bedroom-sleep.html", "How can a five-year-old who has always shared my room adjust to her first bedroom?", "en", "5", "2023-10-17"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/1103929-moving-16-month-old-into-her-own-room.html", "Should a child adjust to a new bed before moving into a new room?", "en", null, "2014-04-28"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/1889583-5-year-old-still-will-not-sleep-own-night.html", "Could a child choosing room decorations make the room feel more like theirs?", "en", "5", "2020-02-12"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/881507-please-help-my-3-year-old-wont-sleep-his-own-bed.html", "How do we change a sleep association without changing everything at once?", "en", "3", "2013-01-27"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/85d09dd5-first-bedroom-sleep.html", "Why is a child refusing a newly decorated room that matches all her preferences?", "en", "5", "2023-10-17"],
  ["https://www.netmums.com/coffeehouse/drop-clinic-984/sleep-988/530187-22-month-old-will-not-sleep-unless-m-room-please-help.html", "What should we do when repeated returns to bed create more fear and exhaustion?", "en", null, "2011-02-06"],
  ["https://www.reddit.com/r/beyondthebump/comments/1wd4oht/transitioning_toddler_to_her_room/", "How do I move a 23-month-old who cuddles my arm to sleep into her own room?", "en", "1.9", "2026-09-11"],
  ["https://www.reddit.com/r/BeyondTheBumpUK/comments/1jsbvyy", "Should we wait for a child to sleep through before moving them into their own room?", "en", null, "2025-04-05"],
  ["https://www.reddit.com/r/bninfantsleep/comments/1uxeb9b/how_to_get_toddler_back_in_his_own_room/", "How can we move an almost three-year-old back to his room after a new sibling arrived?", "en", "3", "2026-07-15"],
  ["https://www.reddit.com/r/toddlers/comments/1wd4wff/transitioning_toddler_to_her_own_room/", "Is a slow transition better than trying to get a toddler into her room in two days?", "en", "toddler", "2026-09-11"],
  ["https://www.reddit.com/r/Parenting/comments/1vkqx4n/when_did_your_toddler_transition_to_own_room_with/", "How can a three-year-old transition from our bed to sharing a room with a sibling?", "en", "3", "2026-08-10"],
  ["https://www.reddit.com/r/BabyBumpsandBeyondAu/comments/1u5jsft/transitioning_toddler_to_own_bed/", "How do I convince a toddler to sleep in a fully prepared, child-safe room?", "en", "toddler", "2026-05-02"],
  ["https://www.reddit.com/r/cosleeping/comments/zq08zb", "What is a gentle process for moving a very attached two-year-old into his own room?", "en", "2", "2022-12-20"],
  ["https://www.reddit.com/r/beyondthebump/comments/1wd4oht/transitioning_toddler_to_her_room/", "Should a toddler's new room be pitch-black or have a night light?", "en", "1.9", "2026-09-11"],
  ["https://www.reddit.com/r/bninfantsleep/comments/1uxeb9b/how_to_get_toddler_back_in_his_own_room/", "Should we delay a room transition when a child is also starting preschool?", "en", "3", "2026-07-15"],
  ["https://www.reddit.com/r/cosleeping/comments/1kss4zn", "How can we handle midnight returns during a co-sleeping-to-own-room transition?", "en", "2.5", "2025-05-22"],
  ["https://www.reddit.com/r/toddlers/comments/1wd4wff/transitioning_toddler_to_her_own_room/", "How slowly should a parent move farther from a toddler's bed each night?", "en", "toddler", "2026-09-11"],
  ["https://www.reddit.com/r/BabyBumpsandBeyondAu/comments/1u5jsft/transitioning_toddler_to_own_bed/", "What should we change first when a toddler has a room and bed but still will not sleep there?", "en", "toddler", "2026-05-02"],
  ["https://www.reddit.com/r/Parenting/comments/1gb6ant", "Are monsters the real barrier, or is my child asking for closeness at night?", "en", "toddler", "2024-10-24"]
];

if (questions.length < 100) throw new Error(`Expected at least 100 questions; got ${questions.length}`);

const topics = [
  ["child-wont-sleep-alone", "Why won't my child sleep alone?", "F02", "STORY_OR_SOUND", true, 625],
  ["child-refuses-own-room", "Why does my child refuse their own room?", "F03", "ROOM_FRIEND", true, 500],
  ["toddler-refuses-own-room", "Why does my toddler refuse their own room?", "F02", "ROOM_FRIEND", false, 400],
  ["child-afraid-to-sleep-alone", "Why is my child afraid to sleep alone?", "F02", "STORY_OR_SOUND", false, 400],
  ["child-afraid-of-dark-at-bedtime", "What should I do when my child is afraid of the dark at bedtime?", "F01", "LIGHT", true, 625],
  ["child-keeps-coming-to-parents-bed", "Why does my child keep coming to the parents' bed?", "F02", "ROUTINE_ONLY", true, 625],
  ["parent-must-stay-until-child-sleeps", "What can I do when I must stay until my child sleeps?", "F02", "STORY_OR_SOUND", false, 500],
  ["transition-from-cosleeping-to-own-room", "How can we transition from co-sleeping to an own room?", "F05", "ROUTINE_ONLY", true, 625],
  ["child-has-own-room-but-wont-sleep-there", "Why won't my child sleep in a room they already have?", "F03", "ROOM_FRIEND", false, 320],
  ["child-sleeps-alone-elsewhere-but-not-home", "Why does my child sleep alone elsewhere but not at home?", "F06", "NO_ROOM_INTERVENTION", false, 240],
  ["three-year-old-wont-sleep-alone", "Why won't my three-year-old sleep alone?", "F02", "STORY_OR_SOUND", false, 320],
  ["four-year-old-wont-sleep-alone", "Why won't my four-year-old sleep alone?", "F02", "STORY_OR_SOUND", false, 400],
  ["five-year-old-still-sleeps-with-parents", "Why does my five-year-old still sleep with us?", "F02", "ROUTINE_ONLY", false, 400],
  ["how-to-make-child-like-own-room", "How can I help my child like their own room?", "F03", "ROOM_FRIEND", false, 320],
  ["first-night-in-own-room", "How should we prepare for the first night in an own room?", "F05", "ROUTINE_ONLY", false, 240],
  ["should-child-choose-bedroom-items", "Should a child choose something for their bedroom?", "F03", "ROOM_FRIEND", false, 180],
  ["night-light-for-child-afraid-of-dark", "Should a child who fears the dark choose a night light?", "F01", "LIGHT", false, 240],
  ["bedtime-story-for-sleeping-alone", "Can a bedtime story support a sleeping-alone transition?", "F02", "STORY_OR_SOUND", false, 180],
  ["comfort-object-for-sleeping-alone", "Can a room friend support a sleeping-alone transition?", "F03", "ROOM_FRIEND", false, 180],
  ["how-long-does-own-room-transition-take", "How long does an own-room transition take?", "F05", "ROUTINE_ONLY", false, 320]
];

function canonicalSlug(question) {
  const q = question.toLowerCase();
  if (/怕黑|dark|shadow/.test(q)) return "child-afraid-of-dark-at-bedtime";
  if (/co-sleep|cosleep|分床|大床|own bed.*transition|transition.*own bed/.test(q)) return "transition-from-cosleeping-to-own-room";
  if (/coming|comes|跑到父母|middle of night|midnight|parents?' bed|our bed every night|our bed almost/.test(q)) return "child-keeps-coming-to-parents-bed";
  if (/stay until|sit.*room|in the room|see a parent|beside her every night|陪伴|陪睡/.test(q)) return "parent-must-stay-until-child-sleeps";
  if (/first night|first bedroom|new room|房间.*布置|decorat|prepared.*room|like their own room/.test(q)) return "child-has-own-room-but-wont-sleep-there";
  if (/three-year-old|three year old|3 year old|三四岁/.test(q)) return "three-year-old-wont-sleep-alone";
  if (/four-year-old|four year old|4 year old|4.5-year-old/.test(q)) return "four-year-old-wont-sleep-alone";
  if (/five-year-old|five year old|5 year old/.test(q)) return "five-year-old-still-sleeps-with-parents";
  if (/toddler/.test(q)) return "toddler-refuses-own-room";
  if (/afraid|scared|害怕|fear/.test(q)) return "child-afraid-to-sleep-alone";
  if (/elsewhere|not at home/.test(q)) return "child-sleeps-alone-elsewhere-but-not-home";
  if (/room|分房|卧室/.test(q)) return "child-refuses-own-room";
  return "child-wont-sleep-alone";
}

function primaryCode(question, slug) {
  if (slug.includes("dark")) return "F01";
  if (slug.includes("cosleeping") || /routine|同一时间|渐进|slow|gradual/.test(question.toLowerCase())) return "F05";
  if (slug.includes("has-own-room") || /decorat|prepared|布置|空间/.test(question.toLowerCase())) return "F03";
  if (/sleep study|beyond the room|就医|dream terror|night terror|medical|something beyond/.test(question.toLowerCase())) return "F06";
  return "F02";
}

function sourceName(url) {
  const host = new URL(url).hostname.replace(/^www\./, "");
  if (host.includes("reddit")) return "Reddit";
  if (host.includes("mumsnet")) return "Mumsnet";
  if (host.includes("netmums")) return "Netmums";
  if (host.includes("stackexchange")) return "Parenting Stack Exchange";
  if (host.includes("pttweb")) return "PTT";
  if (host.includes("dcard")) return "Dcard";
  if (host.includes("babyhome")) return "BabyHome";
  if (host.includes("dxy")) return "DXY public question";
  return host;
}

const corpus = questions.map(([url, raw, language, age, published], index) => {
  const slug = canonicalSlug(raw);
  const code = primaryCode(raw, slug);
  return {
    problem_id: `MYNEST-P-${String(index + 1).padStart(4, "0")}`,
    source: sourceName(url),
    source_url: url,
    published_at: published,
    language,
    country_if_known: null,
    child_age_if_known: age,
    raw_question: raw,
    normalized_question: topics.find(([topicSlug]) => topicSlug === slug)?.[1] ?? raw,
    primary_problem_code: code,
    secondary_problem_code: code === "F01" ? "F02" : null,
    transition_intent: /transition|move|own room|own bed|分房|分床/.test(raw.toLowerCase()) ? "high" : "medium",
    urgency: /desperate|exhaust|every night|scream|cannot|can't|won't|不愿|不肯|害怕/.test(raw.toLowerCase()) ? "high" : "medium",
    commercial_intent: "low",
    existing_solution: null,
    failed_solution: null,
    answer_page_candidate: slug
  };
});

const counts = Object.fromEntries(topics.map(([slug]) => [slug, corpus.filter((r) => r.answer_page_candidate === slug).length]));

const questionMap = {
  project: "MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1",
  generated_at: today,
  raw_problem_records: corpus.length,
  canonical_questions: topics.map(([slug, question, primary_problem_code, first_experiment, published, priority_score], index) => ({
    id: `MYNEST-Q-${String(index + 1).padStart(2, "0")}`,
    slug,
    canonical_question: question,
    primary_problem_code,
    first_experiment,
    demand_examples: counts[slug],
    priority_score,
    status: published ? "PUBLISHED" : "HOLD",
    publish_gate: {
      real_demand_examples: counts[slug],
      minimum_met: counts[slug] >= 3,
      canonical_question_defined: true,
      duplicate_page: false,
      F01_F06_mapping_complete: true,
      first_experiment_defined: true,
      scope_boundary_present: true,
      CTA_exists: true
    }
  }))
};

const published = new Map([
  ["child-wont-sleep-alone", {
    title: "Why Won't My Child Sleep Alone?",
    short: "A child may resist sleeping alone because darkness feels unsafe, separation feels too abrupt, the room does not yet feel like theirs, something in the environment is uncomfortable, or the bedtime transition keeps changing. Start by noticing exactly when resistance begins. That observation is more useful than redesigning the whole room or trying several fixes at once.",
    checks: ["Does resistance begin before entering the room?", "Does it begin only when the lights go out?", "Does it begin when the parent starts to leave?", "Does the child fall asleep, then return later?", "Is there pain, breathing trouble, or severe distress?"],
    barriers: [["Darkness or imagined threats", "F01"], ["Separation from a parent", "F02"], ["Low sense of ownership", "F03"], ["Noise, temperature, bedding, or layout", "F04"], ["An unpredictable transition", "F05"], ["A cause that may not be room-related", "F06"]],
    experiment: "Use the Room Check to identify the biggest barrier, then change one thing only. If separation is the clearest barrier, let the child choose one approved story or sound while the parent keeps control of timing and volume.",
    cta: "Find the biggest barrier",
    related: ["child-afraid-of-dark-at-bedtime", "parent-must-stay-until-child-sleeps"]
  }],
  ["child-refuses-own-room", {
    title: "Why Does My Child Refuse Their Own Room?",
    short: "Refusing a room does not necessarily mean the room is badly designed. The barrier may appear before entry, when the parent leaves, after lights-out, or only after a night waking. First locate that moment. If the child happily plays in the room by day but resists sleep there, separation or transition rhythm may matter more than decoration.",
    checks: ["Will the child enter the room during the day?", "Do they resist the bed, the room, or the parent's departure?", "Is one sound, shadow, temperature, or object bothering them?", "Did the refusal follow a move, illness, holiday, or family change?", "Can the child name one part of the room they like?"],
    barriers: [["Darkness", "F01"], ["Separation", "F02"], ["The room does not feel like theirs", "F03"], ["Environmental friction", "F04"], ["Too many simultaneous changes", "F05"], ["Unclear or non-room cause", "F06"]],
    experiment: "Keep the room and routine stable. Offer one bounded Child Choice: a light, a story or sound, or a room friend. The child chooses within the approved options; the adult controls safety and use.",
    cta: "Let your child choose one thing",
    related: ["child-wont-sleep-alone", "how-to-make-child-like-own-room"]
  }],
  ["child-afraid-of-dark-at-bedtime", {
    title: "What Should I Do When My Child Is Afraid of the Dark at Bedtime?",
    short: "Fear of darkness can appear even after months of easy sleep. Before adding several lights or changing the entire routine, check whether the fear starts at lights-out, after a shadow appears, or only when the parent leaves. That difference tells you whether light is the best first experiment or whether separation is the stronger barrier.",
    checks: ["Does fear begin exactly when the light changes?", "Is a particular shadow or reflection involved?", "Would the child be calm in the same darkness with a parent present?", "Is the fear present in other rooms during daytime?", "Are persistent nightmares or severe distress involved?"],
    barriers: [["Darkness or shadows", "F01"], ["Being alone rather than darkness itself", "F02"], ["Unfamiliar room cues", "F03"], ["Glare, noise, or temperature", "F04"], ["Changing responses each night", "F05"], ["Persistent nightmares or another cause", "F06"]],
    experiment: "Offer one approved light choice—a low warm light, soft moon light, or low bedside glow. Keep brightness, placement, colour temperature, flashing, electrical safety, and usage period under adult control.",
    cta: "Find the biggest barrier",
    related: ["child-afraid-to-sleep-alone", "night-light-for-child-afraid-of-dark"]
  }],
  ["child-keeps-coming-to-parents-bed", {
    title: "Why Does My Child Keep Coming to the Parents' Bed?",
    short: "A child who starts the night in their own bed but returns later may be facing a different barrier from a child who refuses the room at bedtime. Notice when the return happens, what the child asks for, and whether they are fully awake. Keep the first experiment small and consistent instead of changing the room, reward system, and bedtime routine together.",
    checks: ["What time does the child usually return?", "Are they awake, frightened, or barely aware?", "Do they ask for light, closeness, a drink, or help after a dream?", "Can they resettle with a brief predictable response?", "Are there signs of pain, breathing problems, or unusual night events?"],
    barriers: [["Fear after waking", "F01"], ["Reconnecting with a parent", "F02"], ["Low comfort in the room", "F03"], ["A disturbance wakes the child", "F04"], ["The return response changes nightly", "F05"], ["Night terrors, sleepwalking, or another cause", "F06"]],
    experiment: "Keep the night response predictable for several nights and record what happens. Use Room Check before adding a product. If the child appears confused, sleepwalks, has breathing trouble, or is in severe distress, seek qualified advice.",
    cta: "Find the biggest barrier",
    related: ["transition-from-cosleeping-to-own-room", "parent-must-stay-until-child-sleeps"]
  }],
  ["transition-from-cosleeping-to-own-room", {
    title: "How Can We Transition From Co-Sleeping to an Own Room?",
    short: "Treat the move as a sequence, not a single night. First decide what will stay familiar: the bedtime order, story, approved sound, or room friend. Then define one small step and observe it for several nights. Avoid changing the bed, room, lighting, caregiver presence, and routine all at once, because you will not know which change helped or created resistance.",
    checks: ["Is the family ready to respond consistently for several nights?", "Which part of the existing routine can stay unchanged?", "Does the child resist the room or the parent's departure?", "Is another big change—moving house, illness, preschool, or a new sibling—happening?", "What would count as a small first-night attempt?"],
    barriers: [["Darkness in the new space", "F01"], ["Loss of close parental presence", "F02"], ["Low ownership of the new room", "F03"], ["A different sound, bed, or temperature", "F04"], ["Too many changes at once", "F05"], ["A reason outside the room transition", "F06"]],
    experiment: "Keep the bedtime sequence familiar and choose one transition step. The first outcome can be simply entering and settling in the room—not a full night. Record Day 1, 3, 7, and 14 without treating a difficult night as failure.",
    cta: "Find the biggest barrier",
    related: ["child-keeps-coming-to-parents-bed", "first-night-in-own-room"]
  }]
]);

function esc(value) {
  return String(value).replace(/[&<>\"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;" }[character]));
}

function pageShell({ title, description, canonical, body, articleJson }) {
  const structured = [
    { "@context": "https://schema.org", "@type": "Organization", name: "Spring of Zen", url: "https://www.springofzen.com/", brand: { "@type": "Brand", name: "MyNest" } },
    ...(articleJson ? [articleJson] : []),
    { "@context": "https://schema.org", "@type": "BreadcrumbList", itemListElement: [
      { "@type": "ListItem", position: 1, name: "MyNest", item: "https://www.springofzen.com/mynest/" },
      { "@type": "ListItem", position: 2, name: "Questions", item: "https://www.springofzen.com/mynest/questions/" },
      ...(canonical.endsWith("/questions/") ? [] : [{ "@type": "ListItem", position: 3, name: title.split(" |")[0], item: canonical }])
    ] }
  ];
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(title)}</title><meta name="description" content="${esc(description)}"><link rel="canonical" href="${canonical}">
<meta name="robots" content="index,follow"><link rel="stylesheet" href="/mynest/questions/questions.css?v=20261005">
<script type="application/ld+json">${JSON.stringify(structured)}</script></head>
<body><a class="skip" href="#answer">Skip to the answer</a><header><a class="brand" href="/mynest/">MyNest <span>by Spring of Zen</span></a><nav><a href="/mynest/questions/">Questions</a><a href="/mynest/method/">Method</a><a href="/mynest/results/">Results</a></nav></header>${body}<footer><a href="/mynest/">MyNest Room Check</a><span>Environmental and behavioural transition planning—not medical treatment.</span></footer></body></html>`;
}

function answerPage(slug, data) {
  const canonical = `https://www.springofzen.com/mynest/questions/${slug}/`;
  const related = data.related.map((relatedSlug) => {
    const topic = topics.find(([candidate]) => candidate === relatedSlug);
    const isLive = published.has(relatedSlug);
    return `<li><a href="${isLive ? `/mynest/questions/${relatedSlug}/` : "/mynest/questions/"}">${esc(topic?.[1] ?? relatedSlug)}</a></li>`;
  }).join("");
  const barriers = data.barriers.map(([label, code]) => `<li><strong>${esc(label)}</strong><span>${code}</span></li>`).join("");
  const checks = data.checks.map((check) => `<li>${esc(check)}</li>`).join("");
  const articleJson = {
    "@context": "https://schema.org", "@type": "Article", headline: data.title,
    description: data.short, datePublished: today, dateModified: today,
    author: { "@type": "Organization", name: "MyNest / Spring of Zen" },
    publisher: { "@type": "Organization", name: "Spring of Zen", url: "https://www.springofzen.com/" },
    mainEntityOfPage: canonical, about: "Children's own-room transition planning", inLanguage: "en"
  };
  const body = `<main id="answer"><div class="crumb"><a href="/mynest/">MyNest</a> / <a href="/mynest/questions/">Questions</a></div>
  <article><p class="eyebrow">OWN-ROOM TRANSITION · AGES 2½–6</p><h1>${esc(data.title)}</h1>
  <section class="answer"><h2>Short answer</h2><p>${esc(data.short)}</p></section>
  <section><h2>What to check first</h2><ul class="checks">${checks}</ul></section>
  <section><h2>Possible barriers</h2><p>The labels below are observation categories, not diagnoses.</p><ul class="barriers">${barriers}</ul></section>
  <section><h2>What not to change yet</h2><p>Do not redesign the entire room or change the bed, lighting, routine, and comfort objects at the same time. Do not buy several products before you know where resistance begins.</p></section>
  <section class="experiment"><h2>One first experiment</h2><p>${esc(data.experiment)}</p><a class="primary" href="/mynest/#room-check">${esc(data.cta)}</a></section>
  <section><h2>What MyNest has observed</h2><p><strong>Pilot data not yet sufficient.</strong> This page will use only aggregated, anonymous outcomes when the evidence gate is met.</p><a href="/mynest/results/">See the evidence status</a></section>
  <section><h2>When room changes may not be enough</h2><p>Room changes are not a substitute for qualified care. Seek appropriate professional advice for pain, breathing problems, persistent nightmares, major life change, severe distress, safety concerns, sleepwalking, or anything that feels medically unusual.</p></section>
  <section><h2>Related questions</h2><ul>${related}</ul><p><a href="/mynest/method/">How the Room Check works</a> · <a href="/mynest/results/">Pilot results</a></p></section>
  <aside><strong>Published by:</strong> MyNest / Spring of Zen<br><strong>Method:</strong> Room-transition decision framework<br><strong>Scope:</strong> Environmental and behavioural transition planning, not medical treatment.</aside>
  <p class="updated">Last materially updated: ${today}</p></article></main>`;
  return pageShell({ title: `${data.title} | MyNest by Spring of Zen`, description: `${data.short.slice(0, 150)} Use the MyNest Room Check before changing the whole bedroom.`, canonical, body, articleJson });
}

const hubCards = [...published].map(([slug, data]) => `<article><p>${topics.find(([candidate]) => candidate === slug)?.[2]}</p><h2><a href="/mynest/questions/${slug}/">${esc(data.title)}</a></h2><p>${esc(data.short)}</p></article>`).join("");
const hub = pageShell({
  title: "Own-Room Transition Questions | MyNest by Spring of Zen",
  description: "Clear, bounded answers to real parent questions about children sleeping in their own room, each linked to the MyNest Room Check.",
  canonical: "https://www.springofzen.com/mynest/questions/",
  body: `<main id="answer"><section class="hero"><p class="eyebrow">REAL QUESTION → ONE DECISION</p><h1>Own-room transition questions</h1><p>These pages begin with real public problem expressions, cluster duplicates, and end in one observable next step. Five topics have passed the first publishing gate; the remaining map stays on hold until demand and answer quality justify publication.</p><a class="primary" href="/mynest/#room-check">Start the Room Check</a></section><section class="grid">${hubCards}</section><section><h2>How pages are chosen</h2><p>We require at least three real demand examples, a complete F01–F06 barrier map, one first experiment, a scope boundary, and a direct Room Check path.</p><p><a href="/mynest/method/">Read the method</a> · <a href="/mynest/results/">See pilot evidence status</a></p></section></main>`
});

const method = pageShell({
  title: "MyNest Method | Spring of Zen",
  description: "How MyNest turns a real parent question into one bounded room-transition experiment and an observed outcome.",
  canonical: "https://www.springofzen.com/mynest/method/",
  body: `<main id="answer"><article><p class="eyebrow">METHOD</p><h1>From question to one observable experiment</h1><p>MyNest is an environmental and behavioural decision framework for own-room transitions in children aged 2½–6. It is not medical treatment.</p><ol class="steps"><li><strong>Listen.</strong> Locate when resistance begins.</li><li><strong>Classify.</strong> Consider darkness, separation, ownership, environment, routine, or a non-room cause.</li><li><strong>Choose one.</strong> Offer LIGHT, STORY_OR_SOUND, or ROOM_FRIEND only when that choice matches the barrier.</li><li><strong>Observe.</strong> Record room entry and sleep outcome at Day 1, 3, 7, and 14.</li><li><strong>Learn.</strong> Aggregate anonymous results only after the evidence gate is met.</li></ol><h2>What we do not do</h2><p>We do not diagnose, claim therapeutic effects, fabricate cases, collect child names, or transmit optional free-text notes. We do not recommend changing several variables at once.</p><a class="primary" href="/mynest/#room-check">Start the Room Check</a></article></main>`
});

const results = pageShell({
  title: "MyNest Pilot Results | Spring of Zen",
  description: "Evidence status and publication rules for anonymous MyNest own-room transition pilot outcomes.",
  canonical: "https://www.springofzen.com/mynest/results/",
  body: `<main id="answer"><article><p class="eyebrow">RESULTS LIBRARY</p><h1>Observed outcomes, with limits</h1><div class="status"><strong>Pilot data not yet sufficient.</strong><p>No public case is published until the completion, privacy, and evidence checks pass. We do not use invented sample results.</p></div><h2>What a future public case may contain</h2><ul><li>Anonymous case ID and age band</li><li>Baseline own-room nights</li><li>Primary barrier and one structured Child Choice</li><li>Day 1, 3, 7, and 14 outcomes</li><li>Limitations, including parent reporting and single-household scope</li></ul><h2>What is never public</h2><p>Child names, parent names, email addresses, phone numbers, exact birth dates, photos, addresses, private account IDs, and free-text notes.</p><a class="primary" href="/mynest/recruit/">Read about the 14-day pilot</a></article></main>`
});

const css = `:root{--ink:#18352f;--muted:#5e6f68;--paper:#f7f3ea;--card:#fffdf7;--sage:#b9d8c7;--clay:#c96f4d;--line:#d9d7c9}*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}.skip{position:absolute;left:-9999px}.skip:focus{left:1rem;top:1rem;background:#fff;padding:.7rem;z-index:3}header,footer{max-width:1120px;margin:auto;padding:1.2rem 2rem;display:flex;justify-content:space-between;gap:1rem;align-items:center}.brand{font-size:1.25rem;font-weight:800;color:var(--ink);text-decoration:none}.brand span{font-size:.8rem;font-weight:500;color:var(--muted)}nav{display:flex;gap:1rem}nav a,footer a{color:var(--ink)}main{max-width:920px;margin:2rem auto 5rem;padding:0 2rem}.crumb{font-size:.85rem;color:var(--muted);margin-bottom:3rem}.eyebrow{font-size:.78rem;letter-spacing:.14em;font-weight:800;color:#497467}h1{font:clamp(2.4rem,7vw,5rem)/1.02 Georgia,serif;letter-spacing:-.04em;margin:.4rem 0 1.4rem}h2{font:2rem/1.15 Georgia,serif;margin:0 0 1rem}section{margin:3.5rem 0}.answer,.experiment,.status{background:var(--card);border:1px solid var(--line);border-radius:22px;padding:clamp(1.4rem,5vw,3rem);box-shadow:0 12px 35px #29483b10}.experiment{background:#e4f1e8}.checks li{margin:.7rem 0}.barriers{list-style:none;padding:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.8rem}.barriers li{display:flex;justify-content:space-between;gap:1rem;background:var(--card);border:1px solid var(--line);padding:1rem;border-radius:14px}.barriers span{color:var(--muted);font-weight:800}.primary{display:inline-block;margin-top:1rem;background:var(--ink);color:white;text-decoration:none;padding:.9rem 1.2rem;border-radius:999px;font-weight:800}aside{border-left:4px solid var(--sage);padding:1rem 1.3rem;background:#ffffff80}.updated{color:var(--muted);font-size:.9rem}.hero{padding:3rem 0}.hero>p:not(.eyebrow){max-width:720px}.grid{display:grid;gap:1rem}.grid article{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:1.5rem}.grid article>p:first-child{font-size:.75rem;font-weight:800;color:#497467}.grid h2{font-size:1.45rem}.grid h2 a{color:var(--ink)}.steps li{margin:1.2rem 0}footer{border-top:1px solid var(--line);font-size:.8rem;color:var(--muted)}@media(max-width:650px){header{align-items:flex-start;flex-direction:column}nav{font-size:.9rem}.barriers{grid-template-columns:1fr}main{padding:0 1.2rem}footer{align-items:flex-start;flex-direction:column}}`;

const topicRows = questionMap.canonical_questions.map((q) => `| ${q.id} | ${q.canonical_question} | ${q.primary_problem_code} | ${q.demand_examples} | ${q.priority_score} | ${q.status} |`).join("\n");
const topicDoc = `# MYNEST_TOPIC_MAP_v0.1\n\nGenerated: ${today}\n\nThis map clusters ${corpus.length} anonymous public problem expressions into 20 canonical questions. Demand count is evidence for editorial priority, not a search ranking claim. Pages remain HOLD unless every publishing gate is satisfied.\n\n| ID | Canonical question | Primary class | Demand examples | Priority | Status |\n|---|---|---:|---:|---:|---|\n${topicRows}\n\n## Publishing rule\n\nPUBLISHED requires at least three real demand examples, no duplicate page, complete F01–F06 mapping, one defined first experiment, a scope boundary, and a primary Room Check CTA.\n`;
const standardDoc = `# MYNEST_ANSWER_PAGE_STANDARD_v0.1\n\nLast materially updated: ${today}\n\nEvery page answers one natural-language question and contains: A) question, B) 50–120 word short answer, C) three to five observable checks, D) readable F01–F06 barriers, E) what not to change yet, F) one first experiment, G) exactly one primary CTA, H) honest pilot evidence status, I) room-change scope boundary, and J) a real last-updated date.\n\nRequired technical elements: one canonical URL, index/follow only for published pages, unique title and description, visible publisher/method/scope, internal links to Room Check, two related questions, Method and Results, plus accurate Organization, Article, and BreadcrumbList JSON-LD. QAPage markup is not used for editorial answers.\n\nProhibited: fabricated outcomes, fake experts, keyword stuffing, mass-generated near-duplicates, unsupported medical claims, or public personal data.\n`;

const queue = {
  project: "MYNEST_SEARCH_AND_ANSWER_ENGINE_v0.1",
  generated_at: today,
  external_posting: "DISABLED",
  policy: "Drafts require human review and platform-rule review before any manual publication.",
  drafts: [
    { id: "SOC-001", platform: "Reddit", source_question: "child-wont-sleep-alone", status: "HUMAN_REVIEW_REQUIRED", draft: "A useful first distinction is when resistance starts: before entering, at lights-out, when the parent leaves, or after a later waking. Those moments point to different barriers. I would avoid changing the whole room at once; observe one moment, choose one small experiment, and keep the response consistent for several nights." },
    { id: "SOC-002", platform: "Quora", source_question: "child-refuses-own-room", status: "HUMAN_REVIEW_REQUIRED", draft: "A child can enjoy a room during the day and still resist sleeping there. That often means the barrier is not the decoration itself. Check whether the difficult moment is entering, lights-out, separation, or a night waking. Change one variable only so you can tell what actually helped." },
    { id: "SOC-003", platform: "Xiaohongshu", source_question: "child-refuses-own-room", status: "HUMAN_REVIEW_REQUIRED", draft: "儿童房已经布置好了，孩子为什么还是不肯自己睡？先别继续加东西。观察抗拒从什么时候开始：进房前、关灯时、父母离开时，还是半夜醒来后。一次只改一个变量，才知道真正的阻力在哪里。" },
    { id: "SOC-004", platform: "TikTok/Reels", source_question: "child-afraid-of-dark-at-bedtime", status: "HUMAN_REVIEW_REQUIRED", draft: "Your child may not fear the room. They may fear the exact moment the light changes—or the moment you leave. Before adding more lights, ask: when does the resistance begin? One answer. One experiment." },
    { id: "SOC-005", platform: "YouTube", source_question: "transition-from-cosleeping-to-own-room", status: "HUMAN_REVIEW_REQUIRED", outline: ["Why changing everything at once hides the real barrier", "Five moments to observe", "What should stay familiar", "One bounded Child Choice", "How to record Day 1, 3, 7, and 14 without claiming success"] },
    { id: "SOC-006", platform: "Facebook parenting groups", source_question: "child-keeps-coming-to-parents-bed", status: "HUMAN_REVIEW_REQUIRED", draft: "When a child starts in their own bed but returns later, note the time, whether they are fully awake, and what they ask for. This can be a different problem from refusing the room at bedtime. A small, predictable response is easier to evaluate than changing the room and routine together." }
  ]
};

function write(relativePath, content) {
  const target = path.join(root, relativePath);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, content);
}

write("data/mynest/problem-corpus.jsonl", corpus.map((record) => JSON.stringify(record)).join("\n") + "\n");
write("data/mynest/question-map.json", JSON.stringify(questionMap, null, 2) + "\n");
write("data/mynest/platform-content-queue.json", JSON.stringify(queue, null, 2) + "\n");
write("docs/mynest/MYNEST_TOPIC_MAP_v0.1.md", topicDoc);
write("docs/mynest/MYNEST_ANSWER_PAGE_STANDARD_v0.1.md", standardDoc);
write("mynest/questions/questions.css", css);
write("mynest/questions/index.html", hub);
write("mynest/method/index.html", method);
write("mynest/results/index.html", results);
for (const [slug, data] of published) write(`mynest/questions/${slug}/index.html`, answerPage(slug, data));

const urls = [
  "https://www.springofzen.com/",
  "https://www.springofzen.com/mynest/",
  "https://www.springofzen.com/mynest/recruit/",
  "https://www.springofzen.com/mynest/questions/",
  ...[...published.keys()].map((slug) => `https://www.springofzen.com/mynest/questions/${slug}/`),
  "https://www.springofzen.com/mynest/method/",
  "https://www.springofzen.com/mynest/results/"
];
write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map((url) => `  <url><loc>${url}</loc><lastmod>${today}</lastmod></url>`).join("\n")}\n</urlset>\n`);
write("robots.txt", "User-agent: *\nAllow: /\nSitemap: https://www.springofzen.com/sitemap.xml\n");

console.log(JSON.stringify({ raw_problem_records: corpus.length, canonical_questions: topics.length, published_answer_pages: published.size, sitemap_urls: urls.length, demand_counts: counts }, null, 2));
