/* eslint-disable @typescript-eslint/no-explicit-any */

import {
  ExperimentRunner,
  registerArrayExtensions,
  getParam,
  subsetExperimentByParam,
  canvasCountdown,
} from '@adriansteffan/reactive';

const KEY_WORD = getParam(
  'key_ld_word',
  'm',
  'string',
  'what key to use when indicating "word" in LD task',
);
const KEY_NON_WORD = getParam(
  'key_ld_non_word',
  'x',
  'string',
  'what key to use when indicating "non word" in LD task',
);
const KEYS_LD = [KEY_WORD, KEY_NON_WORD];

const KEY_UPPER = getParam(
  'key_dp_above',
  'u',
  'string',
  'what key to use when indicating "dot above +" in DP task',
);
const KEY_LOWER = getParam(
  'key_dp_under',
  'j',
  'string',
  'what key to use when indicating "dot under +" in DP task',
);
const KEYS_DP = [KEY_UPPER, KEY_LOWER];

const LD_LENGTH_PRACTICE = getParam(
  'number_ld_practice',
  20,
  'number',
  'How many lexical decision trials to practice with',
);
const LD_LENGTH_TEST = getParam(
  'number_ld_test',
  540,
  'number',
  'How many lexical decision trials to show in each block',
);

const DP_LENGTH_PRACTICE = getParam(
  'number_dp_practice',
  20,
  'number',
  'How many dotprobe trials to practice with',
);
const DP_LENGTH_TEST = getParam(
  'number_dp_test',
  580,
  'number',
  'How many dotprobe trials to show',
);

const offsetScreencenterDP = 0.2;
const canvasFontSizeRatio = 0.025;
const dotScale = 0.007;

const wordPairsDP = [
  ['Inept', 'Basic'],
  ['Foolish', 'Typical'],
  ['Expelled', 'Moderate'],
  ['Inadequate', 'Acceptable'],
  ['Blunder', 'Average'],
  ['Careless', 'Function'],
  ['Silly', 'Usual'],
  ['Unsuccessful', 'Information'],
  ['Negligent', 'Rectangle'],
  ['Exmination', 'Television'],
  ['Stupidity', 'Notebook'],
  ['Ignorant', 'Backpack'],
  ['Incompetent', 'Refrigerator'],
  ['Mistake', 'Drawers'],
  ['Disgraced', 'Container'],
  ['Idiotic', 'Tolerable'],
  ['Failure', 'Library'],
  ['Ashamed', 'Pendant'],
  ['Inferior', 'Patience'],
  ['Unprepared', 'Calculator'],
  ['Test', 'Tree'],
  ['Unwell', 'Candle'],
  ['Lonely', 'Bucket'],
  ['Injury', 'Button'],
  ['Violence', 'Mushroom'],
  ['Coffin', 'Rocket'],
  ['Rejected', 'Elevator'],
  ['Danger', 'Breeze'],
  ['Infectious', 'Campground'],
  ['Assault', 'Journey'],
  ['Hateful', 'Charger'],
  ['Harmful', 'Picture'],
  ['Disease', 'Luggage'],
  ['Illness', 'Biscuit'],
  ['Painful', 'Factory'],
  ['Lethal', 'Peanut'],
  ['Ignored', 'Horizon'],
  ['Hazard', 'Teapot'],
  ['Aggressive', 'Motorcycle'],
  ['Alarming', 'Building'],
  ['Anger', 'Chair'],
  ['Anxiety', 'Package'],
  ['Brutal', 'Window'],
  ['Bully', 'Plant'],
  ['Burning', 'Pattern'],
  ['Arsen', 'Table'],
  ['Chaos', 'Stone'],
  ['Fight', 'Clock'],
  ['Confrontation', 'Entertainment'],
  ['Corrupt', 'Already'],
  ['Creepy', 'Leaves'],
  ['Criminal', 'Interest'],
  ['Cruel', 'Plate'],
  ['Criticism', 'Afternoon'],
  ['Critical', 'Remember'],
  ['Cutthroat', 'Discovery'],
  ['Damage', 'Should'],
  ['Death', 'Horse'],
  ['Deadly', 'Differ'],
  ['Depressing', 'Strawberry'],
  ['Depraved', 'Probably'],
  ['Desperate', 'Therefore'],
  ['Destabilize', 'Application'],
  ['Destruction', 'Educational'],
  ['Dictator', 'Category'],
  ['Disgusting', 'Department'],
  ['Stressful', 'Household'],
  ['Distressing', 'Perspective'],
  ['Disturbing', 'Newsletter'],
  ['Doom', 'Screw'],
  ['Dread', 'Float'],
  ['Emergency', 'Propeller'],
  ['Pandemic', 'Hardware'],
  ['Fascism', 'Cabinet'],
  ['Fatal', 'Middle'],
  ['Afraid', 'Figure'],
  ['Fearful', 'Chicken'],
  ['Felon', 'Toast'],
  ['Hell', 'Hair'],
  ['Hopeless', 'Practice'],
  ['Horror', 'Potato'],
  ['Hostile', 'Another'],
  ['Hurtful', 'Gallery'],
  ['Hysteria', 'Official'],
  ['Ill', 'Egg'],
  ['Threat', 'Planet'],
  ['Madness', 'Butter'],
  ['Insanity', 'Producer'],
  ['Maniac', 'Bubble'],
  ['Misery', 'Spring'],
  ['Murderer', 'Ordinary'],
  ['Offense', 'Evening'],
  ['Panic', 'Whisk'],
  ['Paranoia', 'Material'],
  ['Poison', 'Letter'],
  ['Predator', 'Optional'],
  ['Problem', 'Because'],
  ['Punish', 'Winter'],
  ['Radical', 'Formula'],
  ['Rage', 'Then'],
  ['Risk', 'Fact'],
  ['Ruin', 'Ball'],
  ['Ruthless', 'Maintain'],
  ['Sickness', 'Normally'],
  ['Scary', 'Years'],
  ['Spiteful', 'Portrait'],
  ['Terrifying', 'Signature'],
  ['Terror', 'Cheese'],
  ['Terrorist', 'Landscape'],
  ['Toxic', 'Until'],
  ['Unsafe', 'Sailor'],
  ['Turbulent', 'Guideline'],
  ['Upsetting', 'Breakfast'],
  ['Unstable', 'Variable'],
  ['Vile', 'Fact'],
  ['War', 'Car'],
  ['Weapon', 'Pepper'],
  ['Grief', 'Grass'],
  ['Killer', 'Tomato'],
  ['Ugly', 'Clip'],
  ['Military', 'Computer'],
  ['Evil', 'Slack'],
  ['Grim', 'Wave'],
  ['Satanic', 'Gesture'],
  ['Grave', 'Water'],
  ['Lifeless', 'Outside'],
  ['Loss', 'Tide'],
  ['Sinister', 'Register'],
  ['Serious', 'Fashion'],
  ['Blood', 'Towel'],
  ['Menace', 'Pencil'],
  ['Conflict', 'Activity'],
  ['Disaster', 'Workshop'],
  ['Catastrophic', 'Alternatives'],
  ['Bomb', 'Case'],
  ['Collapse', 'Indirect'],
  ['Nightmare 	Chocolate'],
  ['Cheater', 'Earlobe'],
  ['Betrayal', 'Saturday'],
  ['Envy', 'Bean'],
  ['Greed', 'White'],
  ['Stalker', 'Flowers'],
  ['Torture', 'Jogging'],
  ['Uncertain', 'Dishtowel'],
  ['Canibal', 'Bicycle'],
];

const madeUpWords = [
  'Aqumj', // Inept
  'Konam', // Basic
  'Qoiqolg', // Foolish
  'Psfozow', // Typical
  'Ubsuydos', // Expelled
  'Jovusexu', // Moderate
  'Adehibeecu', // Inadequate
  'Igcokmidca', // Acceptable
  'Vhalyer', // Blunder
  'Ivodize', // Average
  'Hapesexv', // Careless
  'Cukjtaoh', // Function
  'Pakzt', // Silly
  'Isoaf', // Usual
  'Ujrijlarjpav', // Unsuccessful
  'Obhelyacuap', // Information
  'Melcihath', // Negligent
  'Heynedsmi', // Rectangle
  'Ajgudaqeic', // Exmination
  'Sakalaziel', // Television
  'Gfurexomt', // Stupidity
  'Yureloud', // Notebook
  'Iyzorolp', // Ignorant
  'Mejnsabz', // Backpack
  'Urqefmorucg', // Incompetent
  'Tinrahaqiqer', // Refrigerator
  'Livgece', // Mistake
  'Wyiwudr', // Drawers
  'Diyykalam', // Disgraced
  'Wedwaesuj', // Container
  'Uraoles', // Idiotic
  'Gikokihla', // Tolerable
  'Seareze', // Failure
  'Mezciwp', // Library
  'Ufqowel', // Ashamed
  'Gotdalt', // Pendant
  'Itqekuay', // Inferior
  'Qumaikcu', // Patience
  'Owfjazirir', // Unprepared
  'Laqvihibab', // Calculator
  'Lefq', // Test
  'Jnee', // Tree
  'Urwosj', // Unwell
  'Semxyu', // Candle
  'Vugesm', // Lonely
  'Qisvef', // Bucket
  'Ezwuqv', // Injury
  'Ladhoh', // Button
  'Daituldi', // Violence
  'Poshseak', // Mushroom
  'Rippuw', // Coffin
  'Verlen', // Rocket
  'Menadtas', // Rejected
  'Uorarar', // Eevator
  'Tobziq', // Danger
  'Nmouqu', // Breeze
  'Ozjicneuif', // Infectious
  'Zusgyfiuhx', // Campground
  'Ismiepx', // Assault
  'Geiwfil', // Journey
  'Milicam', // Hateful
  'Lpuqlac', // Charger
  'Lajwleq', // Harmful
  'Fovkezu', // Picture
  'Fewialu', // Disease
  'Jaxgasa', // Luggage
  'Azphofz', // Illness
  'Delqeaj', // Biscuit
  'Vuijmoc', // Painful
  'Supnicm', // Factory
  'Qafseb', // Lethal
  'Goozul', // Peanut
  'Aycojaj', // Ignored
  'Yaguxaz', // Horizon
  'Gigavw', // Hazard
  'Vaotun', // Teapot
  'Urqbusgeya', // Aggressive
  'Rehilwtyca', // Motorcycle
  'Ahecrupj', // Alarming
  'Gooxzeyr', // Building
  'Itxax', // Anger
  'Zfaiy', // Chair
  'Effoujt', // Anxiety
  'Supduji', // Package
  'Jkedel', // Brutal
  'Yujxop', // Window
  'Ceggd', // Bully
  'Skibt', // Plant
  'Bumcoms', // Burning
  'Burlopx', // Pattern
  'Oqgol', // Arsen
  'Lubya', // Table
  'Jsiik', // Chaos
  'Bsedo', // Stone
  'Neltx', // Fight
  'Gfipd', // Clock
  'Tizwzafcebuuw', // Confrontation
  'Iyjanriofbisn', // Entertainment
  'Webdorq', // Corrupt
  'Ezhuupx', // Already
  'Zteobk', // Creepy
  'Weuvof', // Leaves
  'Nwolewuf', // Criminal
  'Oxzakiqy', // Interest
  'Bgaoy', // Cruel
  'Tqagi', // Plate
  'Vmogizebj', // Criticism
  'Owzutroal', // Afternoon
  'Xdapiped', // Critical
  'Bakapgos', // Remember
  'Kezlttooz', // Cutthroat
  'Qeysefapq', // Discovery
  'Gofiqo', // Damage
  'Dzaepy', // Should
  'Hoaqx', // Death
  'Xidre', // Horse
  'Faumly', // Deadly
  'Lerhib', // Differ
  'Suvmutyipv', // Depressing
  'Cdbemsiwrx', // Strawberry
  'Peykibox', // Depraved
  'Sdoxejzt', // Probably
  'Qiypisemu', // Desperate
  'Yzapepode', // Therefore
  'Pesvohufeno', // Destabilize
  'Ikmpapuguim', // Application
  'Muhgdescaox', // Destruction
  'Ucecodaulem', // Educational
  'Wophayej', // Dictator
  'Jefibahn', // Category
  'Zoxpadjozb', // Disgusting
  'Fubadzyapp', // Department
  'Jkgakszik', // Stressful
  'Qeewisugy', // Household
  'Ludhzobdopl', // Distressing
  'Lomjxefyoqo', // Perspective
  'Lurhuxtejj', // Disturbing
  'Vozjjidrip', // Newsletter
  'Woih', // Doom
  'Ppxit', // Screw
  'Jduaf', // Dread
  'Jveob', // Float
  'Avepqexhb', // Emergency
  'Lqipusjiq', // Propeller
  'Zowharif', // Pandemic
  'Peyvfoxa', // Hardware
  'Neqzeyl', // Fascism
  'Wotiruv', // Cabinet
  'Canuk', // Fatal
  'Birrna', // Middle
  'Obgaev', // Afraid
  'Dulece', // Figure
  'Niotnug', // Fearful
  'Rvafwoc', // Chicken
  'Qakox', // Felon
  'Woeqp', // Toast
  'Zolp', // Hell
  'Kuer', // Hair
  'Luzekegy', // Hopeless
  'Jsehjepa', // Practice
  'Wenwov', // Horror
  'Bakobi', // Potato
  'Fitvefu', // Hostile
  'Eqemzov', // Another
  'Niykwec', // Hurtful
  'Jorgugc', // Gallery
  'Kmsyemae', // Hysteria
  'Ufzowiim', // Official
  'Ohg', // Ill
  'Etd', // Egg
  'Nyyieh', // Threat
  'Zbojeq', // Planet
  'Cuwnavv', // Madness
  'Rojlij', // Butter
  'Osjoqapw', // Insanity
  'Tqejodec', // Producer
  'Pifaag', // Maniac
  'Depcpi', // Bubble
  'Fuwajz', // Misery
  'Nnxigc', // Spring
  'Worhugiw', // Murderer
  'Iwpusuct', // Ordinary
  'Ezfukno', // Offense
  'Esitolt', // Evening
  'Tatan', // Panic
  'Sfirx', // Whisk
  'Focudooo', // Paranoia
  'Xicutiin', // Material
  'Kaecup', // Poison
  'Sawxuv', // Letter
  'Ydibofog', // Predator
  'Ifseopir', // Optional
  'Dvutbic', // Problem
  'Husoidi', // Because
  'Voguqz', // Punish
  'Wuzyav', // Winter
  'Zuwilim', // Radical
  'Hemqeke', // Formula
  'Huga', // Rage
  'Bbiv', // Then
  'Fafc', // Risk
  'Fuvs', // Fact
  'Xuen', // Ruin
  'Sevs', // Ball
  'Hiyyfabc', // Ruthless
  'Wuobseiz', // Maintain
  'Xoskfutf', // Sickness
  'Pexkopzj', // Normally
  'Rnudq', // Scary
  'Yaezs', // Years
  'Wcurujor', // Spiteful
  'Topksees', // Portrait
  'Weksuxrekf', // Terrifying
  'Wuphokuhe', // Signature
  'Suvvos', // Terror
  'Ydieye', // Cheese
  'Xehzuzoyp', // Terrorist
  'Qidrswosa', // Landscape
  'Hanaf', // Toxic
  'Uvreq', // Until
  'Onpuka', // Unsafe
  'Yeapow', // Sailor
  'Ficxijelh', // Turbulent
  'Daaxoduho', // Guideline
  'Olyoryexx', // Upsetting
  'Driuvzayz', // Breakfast
  'Ibfmokbo', // Unstable
  'Zaluubyi', // Variable
  'Sore', // Vile
  'Cugg', // Fact
  'Wed', // War
  'Rij', // Car
  'Taulal', // Weapon
  'Xuhcif', // Pepper
  'Msuer', // Grief
  'Hpacy', // Grass
  'Medxed', // Killer
  'Bevuva', // Tomato
  'Echr', // Ugly
  'Fles', // Clip
  'Yezuwurh', // Military
  'Depluqim', // Computer
  'Unes', // Evil
  'Nnofg', // Slack
  'Mhan', // Grim
  'Xipa', // Wave
  'Paxahen', // Satanic
  'Gabgoko', // Gesture
  'Nkemi', // Grave
  'Xozas', // Water
  'Yemewisv', // Lifeless
  'Ouxkaxe', // Outside
  'Jipq', // Loss
  'Behe', // Tide
  'Niyokjuw', // Sinister
  'Vucojyoj', // Register
  'Lebeaac', // Serious
  'Safwuis', // Fashion
  'Jxoiv', // Blood
  'Vonet', // Towel
  'Cokenu', // Menace
  'Vaxbiv', // Pencil
  'Gotwqugz', // Conflict
  'Asregaws', // Activity
  'Mumeqzep', // Disaster
  'Katptred', // Workshop
  'Dobomxyibcul', // Catastrophic
  'Amwuzgopinuy', // Alternatives
  'Kocb', // Bomb
  'Faja', // Case
  // 'Fasjeydi', // Collapse
  // 'Ufkeyuqg', // Indirect
  // 'Ceqfhcevi', // Nightmare
  // 'Pwasukebi', // Chocolate
  // 'Mqaajof', // Cheater
  // 'Uuvjume', // Earlobe
  // 'Neytejek', // Betrayal
  // 'Tawomkin', // Saturday
  // 'Evvq', // Envy
  // 'Pait', // Bean
  // 'Fjiif', // Greed
  // 'Lwike', // White
  // 'Hpatyok', // Stalker
  // 'Lsapitx', // Flowers
  // 'Niyseto', // Torture
  // 'Falcars', // Jogging
  // 'Olpudpauh', // Uncertain
  // 'Yeqcpatoh', // Dishtowel
  // 'Fafeder', // Canibal
  // 'Witqxhi', // Bicycle
];

const wordListsLD = {
  threat: {
    proportion: getParam(
      'ld_proportion_threat',
      0.25,
      'number',
      'How many lexical decision trials should be threats',
    ),
    list: wordPairsDP.map((x) => x[0]).slice(0, 135),
  },
  neutral: {
    proportion: getParam(
      'ld_proportion_neutral',
      0.25,
      'number',
      'How many lexical decision trials should be neutral',
    ),
    list: wordPairsDP.map((x) => x[1]).slice(0, 135),
  },
  nonword: {
    proportion: getParam(
      'ld_proportion_nonword',
      0.5,
      'number',
      'How many lexical decision trials should be non-words',
    ),
    list: madeUpWords.slice(0, 270),
  },
};

const interventionGroup = Math.random() < 0.5;
registerArrayExtensions();

function initCanvas(ctx, w, h) {
  ctx.font = `${Math.min(w, h) * canvasFontSizeRatio}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
}

function createLDTimeline(n: number) {
  return [
    ...Object.entries(wordListsLD)
      .map(([type, val]) =>
        val.list
          .pipe((arr) => {
            if (arr.length === Math.round(val.proportion * n)) {
              console.log(
                `Number of LD trials as long as trial portion, using provided list as is`,
              );
              return arr.shuffle();
            }
            console.log(
              `Number of LD trials ${arr.length} as NOT long as trial portion ${Math.round(val.proportion * n)}, sampling`,
            );
            return arr.sample(Math.round(val.proportion * n));
          })
          .map((word) => ({
            word,
            type,
            correctKey: type === 'nonword' ? KEY_NON_WORD : KEY_WORD,
          })),
      )
      .flat()
      .shuffle()
      .map((wordObj: any) => [
        {
          draw: (ctx, w, h) => {
            ctx.fillStyle = 'black';
            ctx.fillText(wordObj.word, w / 2, h / 2);
          },
          allowedKeys: KEYS_LD,
          metadata: wordObj,
        },
        (data: any[]) => {
          return {
            draw: (ctx, w, h) => {
              if (data[data.length - 1].key !== wordObj.correctKey) {
                ctx.fillStyle = 'RED';
                ctx.fillText('Error', w / 2, h / 2);
              } else {
                ctx.fillText('+', w / 2, h / 2);
              }
            },
            displayDuration: 500,
            ignoreData: true,
          };
        },
      ])
      .flat(),
  ];
}

function createDPTimeline(n: number) {
  const adjustedN = n % 2 === 0 ? n : n + 1;
  const threatPercentage = interventionGroup ? 0.1 : 0.5;

  const upperArray = Array.from({ length: adjustedN }, (_, i) => i < adjustedN / 2).shuffle();
  const threatArray = Array.from(
    { length: adjustedN },
    (_, i) => i < Math.round(adjustedN * threatPercentage),
  ).shuffle();

  return [
    ...wordPairsDP
      .pipe((arr) => {
        if (adjustedN % arr.length === 0) {
          console.log('Number of DP trials is a divisible by wordpair list length, using provided list as is');
          return Array.from({ length: adjustedN / arr.length }, (_) => arr.shuffle()).flat();
        }
        console.log(
          `Number of DP ${adjustedN} trials NOT as long as word list ${arr.length}, sampling`,
        );
        return arr.sample(adjustedN);
      })
      .map((v, index) => ({
        words: v,
        upper: upperArray[index],
      }))
      .map((v, index) => {
        return {
          ...v,
          threatDot: threatArray[index],
        };
      })
      .map((v) => ({
        correctKey: v.upper ? KEY_UPPER : KEY_LOWER,
        upperDot: v.upper,
        threatDot: v.threatDot,
        upperWord: (v.upper && v.threatDot) || (!v.upper && !v.threatDot) ? v.words[0] : v.words[1],
        lowerWord: (v.upper && v.threatDot) || (!v.upper && !v.threatDot) ? v.words[1] : v.words[0],
        interventionGroup: interventionGroup,
      }))
      .map((dpObj: any) => [
        {
          draw: (ctx, w, h) => {
            ctx.fillText('+', w / 2, h / 2);
          },
          displayDuration: 500,
          ignoreData: true,
        },
        {
          draw: (ctx, w, h) => {
            ctx.fillText(dpObj.upperWord, w / 2, h / 2 - (h / 2) * offsetScreencenterDP);
            ctx.fillText(dpObj.lowerWord, w / 2, h / 2 + (h / 2) * offsetScreencenterDP);
            ctx.fillText('+', w / 2, h / 2);
          },
          displayDuration: 500,
          ignoreData: true,
        },
        {
          draw: (ctx, w, h) => {
            ctx.fillText('+', w / 2, h / 2);

            const dotSize = w * dotScale;

            ctx.beginPath();
            ctx.arc(
              w / 2,
              h / 2 + (h / 2) * offsetScreencenterDP * (dpObj.upperDot ? -1 : 1),
              dotSize / 2,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          },
          allowedKeys: KEYS_DP,
          displayDuration: 3000,
          responseTimelimit: 3000,
          metadata: dpObj,
        },
        (data: any[]) => {
          return {
            draw: (ctx, w, h) => {
              if (data[data.length - 1].key !== dpObj.correctKey) {
                ctx.fillStyle = 'RED';
                ctx.fillText('Error', w / 2, h / 2);
              } else {
                ctx.fillText('+', w / 2, h / 2);
              }
            },
            displayDuration: 500,
            ignoreData: true,
          };
        },
      ])
      .flat(),
  ];
}

function keyInstructions(keys: string[], upperText: string, lowerText: string) {
  return (
    <>
      <br />
      Please place your fingers on these keys:{' '}
      <div className='space-y-4 mt-5 mb-5'>
        <div className='flex items-center space-x-2'>
          <kbd className='px-3 py-2 mr-4 text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {keys[0].toUpperCase()}
          </kbd>{' '}
          Press {keys[0]} {upperText}
        </div>
        <div className='flex items-center space-x-2'>
          <kbd className='px-3 py-2 mr-4 text-sm font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {keys[1].toUpperCase()}
          </kbd>{' '}
          Press {keys[1]} {lowerText}
        </div>
      </div>
      Press any of the keys to start the task.
    </>
  );
}

function createMegablockDP(ntrials: number, nblocks: number) {
  return createDPTimeline(ntrials)
    .chunk(nblocks)
    .map((x) => [...canvasCountdown(3), ...x])
    .map((timelineChunk, i) => [
      {
        type: 'Text',
        props: {
          buttonText: null,
          allowedKeys: KEYS_DP,
          content: (
            <>
              {i === 0 && (
                <>
                  <h1>Task B: Get ready</h1>
                  Get ready for Task B. Remember, in this task you will have to indicate the
                  position of a dot that appears after a word pair. <br />
                </>
              )}
              {i !== 0 && (
                <>
                  <h1>
                    Task B: You have completed {i}/{nblocks} blocks
                  </h1>
                  Feel free to take a short break before starting the next block. Continue the trial
                  once you feel ready <br />
                </>
              )}{' '}
              {keyInstructions(
                KEYS_DP,
                'if the dot appears above the +.',
                'if the dot appears below the +.',
              )}
            </>
          ),
        },
      },
      {
        name: `DotProbeTask_Block_${i + 1}`,
        type: 'CanvasBlock',
        props: {
          timeline: timelineChunk,
          initCanvas,
        },
      },
    ])
    .flat();
}

function createMegablockLD(index: number, ntrials: number, nblocks: number) {
  return createLDTimeline(ntrials)
    .chunk(nblocks)
    .map((x) => [...canvasCountdown(3), ...x])
    .map((timelineChunk, i) => [
      {
        type: 'Text',
        props: {
          buttonText: null,
          allowedKeys: KEYS_LD,
          content: (
            <>
              {i === 0 && (
                <>
                  <h1>Task A: Get ready</h1>
                  Get ready for Task A. Just like before, you will have to decide if the string you
                  see is a word or not and press a key in response. <br />
                </>
              )}
              {i !== 0 && (
                <>
                  <h1>
                    Task A: You have completed {i}/{nblocks} blocks
                  </h1>
                  Feel free to take a short break before starting the next block. Continue the trial
                  once you feel ready <br />
                </>
              )}{' '}
              {keyInstructions(
                KEYS_LD,
                'if the string you see is a word.',
                'if the string you see is a non-word.',
              )}
            </>
          ),
        },
      },
      {
        name: `LexicalDecicionTask${index}_Block_${i + 1}`,
        type: 'CanvasBlock',
        props: {
          timeline: timelineChunk,
          initCanvas,
        },
      },
    ])
    .flat();
}

const experiment = subsetExperimentByParam([
  {
    name: 'CheckDevice',
    type: 'CheckDevice',
    props: {
      check: (deviceInfo) => {
        return !deviceInfo.isMobile;
      },
    },
  },
  {
    name: 'IntroText',
    type: 'Text',
    collectRefreshRate: true,
    props: {
      buttonText: "Let's Begin",
      animate: true,
      content: (
        <>
          <h1> Welcome to our Study </h1>
          Welcome to our study about how attention relates to Anxiety. Here is a brief rundown of
          what you can expect:
          <br /> First you will be asked to give your consent to participate in this study. Then you
          will fill out a short questionnaire about your general experience with anxiety. After that
          the actual experiment starts. There will be Task A and Task B. First you will complete a
          set of two blocks of Task A, then a set of four blocks of Task B and lastly, another set
          of two blocks of Task A. Before the first blocks of Task A and B there will be short
          practice blocks to familiarize yourself with the tasks. <br />
        </>
      ),
    },
  },
  {
    name: 'ConsentText',
    type: 'Text',
    props: {
      buttonText: 'Accept',
      animate: true,
      content: (
        <>
          <h1> Participant Information </h1>
          Thank you for your interest in our research project. Enclosed you will find information
          about the research project, the conditions of participation and the handling of the
          collected data. Please read everything carefully. If you agree and want to participate in
          the experiment, please confirm by giving your consent below.
          <br />
          <h4>General information about the research project:</h4> <br />
          This study investigates how people make decisions in a multi-attribute situation. The
          study takes about 45 minutes in total (if no longer breaks are taken) and includes a short
          anxiety-related questionnaire and tasks in which you are asked to react to words presented
          on the screen with pressing the corresponding keys on the keyboard. No special stress or
          harm is expected as a result of participating in this research project. Participation in
          the study is remunerated at the rate displayed in Prolific, rounded up to the nearest
          minute.
          <br />
          <h4>Voluntary participation:</h4>
          Your participation in this research project is voluntary. You can withdraw your consent to
          participate at any time and without giving reasons, without receiving any disadvantages.
          Even if you decide to withdraw from the study, you are still entitled to receive the
          corresponding remuneration for the time spent up to that point, provided that this can be
          clearly demonstrated.
          <br />
          <h4>Participation requirements:</h4>
          The only participation requirement is a minimum age of 18 years. Those who have already
          participated in this study are excluded from participation.
          <br />
          <h4>Data protection and anonymity:</h4>
          Apart from gender, age and the sum scores of the anxiety questionnaire, no personal data
          are collected as part of this study. It is therefore not possible for us to personally
          identify you. As a user of Prolific, you have entered into a separate personal data
          processing agreement with Prolific. This agreement is independent of your consent related
          to this study and the personal data collected by Prolific will not be made available to
          the research team of this study at any point.
          <br />
          <h4>Use of data:</h4>
          The results of this study may be published for teaching and research purposes (e.g.
          theses, scientific publications or conference papers). These results will be presented in
          anonymized form, i.e. without the data being able to be connected to a specific person.
          The fully anonymized data of this study will be made available as "open data" in an
          internet-based repository, if applicable. Thus, this study follows the recommendations of
          the German Research Foundation (DFG) for quality assurance with regard to verifiability
          and reproducibility of scientific results, as well as optimal data re-use. If you would
          like to receive information on the scientific results of the study after its completion,
          please send an e-mail to Vianne Demirel (vianne.demirel@campus.lmu.de).
          <br />
          <h4>Legal basis and revocation:</h4>
          The legal basis for processing the aforementioned personal data is the consent pursuant to
          Art. 6 (1) letter a EU-DSGVO at the end of this document. You have the right to revoke the
          data protection consent at any time. The revocation does not affect the lawfulness of the
          processing carried out on the basis of the consent until the revocation. You can request
          an obligatory deletion of your data at any time - as long as you can provide sufficient
          information that allows us to identify your data. To do so, please contact the research
          project managers. You will not suffer any disadvantages as a result of the revocation.
          Research project managers: If you have any questions about the research project or if you
          want to exercise your right to withdraw your consent, please contact the research project
          managers:
          <br />
          <br />
          Vianne Demirel
          <br />
          Prof. Dr. Christopher Donkin
          <br />
          <br />
          Ludwig-Maximilians-Universität München
          <br />
          Department Psychologie
          <br />
          Lehrstuhl für Computational Modeling in Psychology
          <br />
          Akademiestr. 7<br />
          80799 München
          <br />
          <br />
          vianne.demirel@campus.lmu.de <br />
          c.donkin@psy.lmu.de
          <br />
          <br />
          Further contact addresses:
          <br />
          You can also contact the data protection officer of the research institution or the
          competent supervisory authority if you have any data protection concerns in connection
          with this study and/or wish to lodge a complaint.
          <br />
          <br />
          Ludwig-Maximilians-Universität <br />
          München Behördlicher Datenschutzbeauftragter
          <br />
          Geschwister-Scholl-Platz 1 <br />
          D-80539 München <br /> Bayerisches Landesamt für Datenschutzaufsicht
          <br />
          Promenade 27 <br />
          91522 Ansbach
          <br />
          <br />
          <br />
          <strong>Date: April 15, 2025</strong>
          <br />
          <br />
          Declaration of consent. I hereby certify that I have read and understood the participant
          information described above and that I agree to the conditions stated. I agree in
          accordance with Art. 6 (1) letter a EU-DSGVO. I have been informed about my right to
          revoke my data protection consent.
          <br />
          Declaration of fulfillment inclusion criteria. I hereby confirm that I meet the above
          conditions for participation (18+ years old, first-time participation).
        </>
      ),
    },
  },
  {
    name: 'Demographics',
    type: 'Quest',
    props: {
      surveyJson: {
        title: 'A few questions before we start',
        showQuestionNumbers: false,
        pages: [
          {
            elements: [
              {
                type: 'dropdown',
                name: 'gender',
                title: 'What gender do you identify with?',
                isRequired: true,
                choices: [
                  { value: 'male', text: 'Male' },
                  { value: 'female', text: 'Female' },
                  { value: 'other', text: 'Other' },
                  { value: 'prefer_not_to_say', text: 'Prefer not to say' },
                ],
              },
              {
                type: 'text',
                name: 'age',
                title: 'What is your age?',
                isRequired: true,
                inputType: 'number',
                min: 18,
                max: 100,
              },
            ],
          },
        ],
        completeText: 'Submit',
        showPrevButton: false,
      },
    },
  },
  {
    name: 'Anxiety Survey',
    type: 'Quest',
    props: {
      surveyJson: {
        title: 'A few questions before we start',
        description:
          'A number of statements which people have used to describe themselves are given below. Read each statement and then select the number at the end of the statement that indicates HOW YOU GENERALLY FEEL. There are no right or wrong answers. Do not spend too much time on any one statement but give the answer which seems to describe how you generally feel. Thank you.',
        showQuestionNumbers: false,
        pages: [
          {
            elements: [
              {
                name: 'anx_item1',
                title: 'I feel that difficulties are piling up so I cannot overcome them.',
              },
              {
                name: 'anx_item2',
                title: "I worry too much over something that really doesn't matter.",
              },
              {
                name: 'anx_item3',
                title: 'Some unimportant thoughts run through my mind and it bothers me.',
              },
              {
                name: 'anx_item4',
                title: "I take disappointments so keenly that I can't put them out of my mind.",
              },
              {
                name: 'anx_item5',
                title:
                  'I get in a state of tension or turmoil as I think over my recent concerns and interests.',
              },
            ].map((x) => ({
              type: 'rating',
              name: x.name,
              title: x.title,
              isRequired: true,
              rateMin: 1,
              rateMax: 4,
              minRateDescription: 'Not at all',
              maxRateDescription: 'Very much so',
            })),
          },
        ],
        completeText: 'Submit',
        showPrevButton: false,
      },
    },
  },
  { type: 'EnterFullscreen' },
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: KEYS_LD,
      content: (
        <>
          <h1>Task A Practice</h1>
          In Task A you must decide if a string of letters you see on the screen is a real English
          word or not. If it is a <strong>real</strong>, please indicate that by pressing the{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_LD[0].toUpperCase()}
          </kbd>{' '}
          key. If you believe the string is a <strong>non-word</strong>/just a string of random
          letters, indicate that by pressing{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_LD[1].toUpperCase()}
          </kbd>
          . Between the presentation of each word there will be a cross at the center of the screen.
          Please fixate on that cross while you are doing the task. The first set of Task A will
          comprise two blocks which take around five minutes each to complete + a short practice
          block in the beginning. Feel free to take a short break between each block.
          <br />{' '}
          {keyInstructions(
            KEYS_LD,
            'if the string you see is a word.',
            'if the string you see is a non-word.',
          )}
        </>
      ),
    },
  },
  {
    name: 'LexicalDecicionTaskPractice',
    type: 'CanvasBlock',
    props: {
      timeline: [...canvasCountdown(3), ...createLDTimeline(LD_LENGTH_PRACTICE)],
      initCanvas,
    },
  },
  ...createMegablockLD(1, LD_LENGTH_TEST, 2),
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: KEYS_DP,
      content: (
        <>
          <h1>Task B Practice</h1>
          In Task B you are presented with a pair of words. One of the words will appear above the
          fixation cross and one will appear below. After a short time the words will disappear and
          a dot will appear in the place of one of the words previously shown. You must indicate if
          the dot appeared below of above the fixation cross. If it appears below the fixation
          cross, press the key{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_DP[1].toUpperCase()}
          </kbd>
          . If the dot appears above the fixation cross, press the key{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_DP[0].toUpperCase()}
          </kbd>
          . There will be four blocks that will each take around five minutes to complete + a short
          practice block in the beginning. Feel free to take short breaks in between the blocks.{' '}
          <br />{' '}
          {keyInstructions(
            KEYS_DP,
            'if the dot appears above the +.',
            'if the dot appears below the +.',
          )}
        </>
      ),
    },
  },
  {
    name: 'DotProbeTaskPractice',
    type: 'CanvasBlock',
    props: {
      timeline: [...canvasCountdown(3), ...createDPTimeline(DP_LENGTH_PRACTICE)],
      initCanvas,
    },
  },
  ...createMegablockDP(DP_LENGTH_TEST, 4),
  {
    type: 'Text',
    props: {
      buttonText: null,
      allowedKeys: true,
      content: (
        <>
          <h1>One more task</h1>
          You will now complete the second set of Blocks for Task A. This means you will do the same
          task again that you did at the beginning of the experiment. As a reminder, here is how it
          works: In Task A you must decide if a string of letters you see on the screen is a real
          English word or not. If it is a <strong>real</strong>, please indicate that by pressing
          the key{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_LD[0].toUpperCase()}
          </kbd>
          . If you believe the string is a <strong>non-word</strong>/just a string of random
          letters, indicate that by pressing{' '}
          <kbd className='px-3 py-2 text-xs font-semibold text-gray-900 bg-white border border-gray-200 rounded-lg shadow-outer'>
            {KEYS_LD[1].toUpperCase()}
          </kbd>
          . Again, there will be two blocks that each take around five minutes to complete. Feel
          free to take short breaks in between the blocks. Press any key to start.
        </>
      ),
    },
  },
  ...createMegablockLD(2, LD_LENGTH_TEST, 2),
  { type: 'ExitFullscreen' },
  {
    type: 'Upload',
    props: {
      sessionCSVBuilder: {
        filename: '',
        trials: ['Demographics', 'Anxiety Survey', 'CheckDevice'],
        fun: (sessionInfo: Record<string, any>) => {
          sessionInfo['interventionGroup'] = interventionGroup;
          sessionInfo['sum_anxiety'] =
            sessionInfo.anx_item1 +
            sessionInfo.anx_item2 +
            sessionInfo.anx_item3 +
            sessionInfo.anx_item4 +
            sessionInfo.anx_item5;

          return sessionInfo;
        },
      },
      trialCSVBuilders: [
        {
          filename: `_DP__${Date.now()}`,
          trials: [
            'DotProbeTaskPractice',
            'DotProbeTask_Block_1',
            'DotProbeTask_Block_2',
            'DotProbeTask_Block_3',
            'DotProbeTask_Block_4',
          ],
        },
        {
          filename: `_LD__${Date.now()}`,
          trials: [
            'LexicalDecicionTaskPractice',
            'LexicalDecicionTask1_Block_1',
            'LexicalDecicionTask1_Block_2',
            'LexicalDecicionTask2_Block_1',
            'LexicalDecicionTask2_Block_2',
          ],
        },
      ],
    },
  },
  { type: 'ProlificEnding', hideSettings: true, props: { prolificCode: 'YOUR_CODE_HERE' } },
]);

export default function Experiment() {
  return <ExperimentRunner timeline={experiment} />;
}
